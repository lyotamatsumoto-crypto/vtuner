import { createServer, type ServerResponse } from "node:http";

import { LOCAL_STORAGE_LAYOUT } from "./storage/fileLayout";
import {
  readAdoptedChanges,
  readReviewPatchQueue,
} from "./storage/queueStorage";
import { readCompileHistory } from "./storage/compileStorage";

const DEFAULT_PORT = 3001;
const port = Number(process.env.PORT ?? DEFAULT_PORT);

const server = createServer(async (request, response) => {
  try {
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

    if (request.method === "GET" && request.url === "/adopted-changes") {
      sendJson(response, 200, await readAdoptedChanges());
      return;
    }

    if (request.method === "GET" && request.url === "/compile-history") {
      sendJson(response, 200, await readCompileHistory());
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
  });
  response.end(JSON.stringify(payload));
}
