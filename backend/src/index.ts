import { createServer, type ServerResponse } from "node:http";

import { LOCAL_STORAGE_LAYOUT } from "./storage/fileLayout";
import {
  readAdoptedChanges,
  readReviewPatchQueue,
  writeAdoptedChanges,
  writeReviewPatchQueue,
} from "./storage/queueStorage";
import { readCompileHistory, writeCompileHistory } from "./storage/compileStorage";
import type { AdoptedChangeItem, ReviewPatchQueueItem } from "./contracts/queue";
import type { CompileRecord } from "./contracts/compile";

const DEFAULT_PORT = 3001;
const port = Number(process.env.PORT ?? DEFAULT_PORT);

const DEFAULT_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

const server = createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      response.writeHead(204, DEFAULT_CORS_HEADERS);
      response.end();
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      sendJson(response, 200, {
        status: "ok",
        phase: "phase_2_baseline",
      });
      return;
    }

    if (request.method === "GET" && request.url === "/baseline") {
      sendJson(response, 200, {
        storage: "local_json_files",
        queues: LOCAL_STORAGE_LAYOUT.queues,
        compile: LOCAL_STORAGE_LAYOUT.compile,
      });
      return;
    }

    if (request.method === "GET" && request.url === "/review-patch-queue") {
      sendJson(response, 200, await readReviewPatchQueue());
      return;
    }

    if (request.method === "PUT" && request.url === "/review-patch-queue") {
      const payload = await readJsonBody(request);
      if (!Array.isArray(payload)) {
        sendJson(response, 400, {
          error: "invalid_queue_payload",
          message: "Review Patch Queue payload must be an array.",
        });
        return;
      }

      await writeReviewPatchQueue(payload as ReviewPatchQueueItem[]);
      sendJson(response, 200, {
        saved: (payload as ReviewPatchQueueItem[]).length,
      });
      return;
    }

    if (request.method === "GET" && request.url === "/adopted-changes") {
      sendJson(response, 200, await readAdoptedChanges());
      return;
    }

    if (request.method === "PUT" && request.url === "/adopted-changes") {
      const payload = await readJsonBody(request);
      if (!Array.isArray(payload)) {
        sendJson(response, 400, {
          error: "invalid_queue_payload",
          message: "Adopted Changes payload must be an array.",
        });
        return;
      }

      await writeAdoptedChanges(payload as AdoptedChangeItem[]);
      sendJson(response, 200, {
        saved: (payload as AdoptedChangeItem[]).length,
      });
      return;
    }

    if (request.method === "GET" && request.url === "/compile-history") {
      sendJson(response, 200, await readCompileHistory());
      return;
    }

    if (request.method === "PUT" && request.url === "/compile-history") {
      const payload = await readJsonBody(request);
      if (!Array.isArray(payload)) {
        sendJson(response, 400, {
          error: "invalid_compile_payload",
          message: "Compile history payload must be an array.",
        });
        return;
      }

      await writeCompileHistory(payload as CompileRecord[]);
      sendJson(response, 200, {
        saved: (payload as CompileRecord[]).length,
      });
      return;
    }

    sendJson(response, 200, {
      app: "VTuner",
      message: "Phase 2 backend baseline is ready.",
    });
  } catch (error) {
    sendJson(response, 500, {
      error: "storage_read_failed",
      message: "Local JSON storage could not be read.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

server.listen(port, () => {
  console.log(`VTuner backend baseline listening on http://localhost:${port}`);
});

function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...DEFAULT_CORS_HEADERS,
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request: import("node:http").IncomingMessage) {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return null;
  }

  const text = Buffer.concat(chunks).toString("utf8").trim();
  if (!text) {
    return null;
  }

  return JSON.parse(text) as unknown;
}
