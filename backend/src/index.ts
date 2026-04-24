import { createServer } from "node:http";

import { LOCAL_STORAGE_LAYOUT } from "./storage/fileLayout";

const DEFAULT_PORT = 3001;
const port = Number(process.env.PORT ?? DEFAULT_PORT);

const server = createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(
      JSON.stringify({
        status: "ok",
        phase: "phase_2_baseline",
      }),
    );
    return;
  }

  if (request.url === "/baseline") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(
      JSON.stringify({
        storage: "local_json_files",
        queues: LOCAL_STORAGE_LAYOUT.queues,
        compile: LOCAL_STORAGE_LAYOUT.compile,
      }),
    );
    return;
  }

  response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  response.end(
    JSON.stringify({
      app: "VTuner",
      message: "Phase 2 backend baseline is ready.",
    }),
  );
});

server.listen(port, () => {
  console.log(`VTuner backend baseline listening on http://localhost:${port}`);
});
