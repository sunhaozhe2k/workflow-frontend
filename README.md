# Workflow Frontend Demo

A minimal workflow editor and monitor built with React, React Flow, and Socket.IO. The app renders a demo workflow graph, allows saving, and triggers executions while listening for real-time task updates.

## Getting Started

```bash
npm install
npm run dev
```

The development server runs on Vite's default port (`http://localhost:5173`). It expects a backend listening on `http://localhost:8000` that exposes:

- `POST /workflow/save`
- `POST /workflow/start`
- Socket.IO namespace emitting `task_update` events with `{ id, status }` payloads.
