/**
 * TypeScript pipeline triggered by app/api/webhook/route.ts.
 *
 *   npm install
 *   npm run deploy
 */

import { node, graph, deploy } from "graphingest";

const handleEvent = node(
  { name: "handle-event", cacheTtl: 300, maxRetries: 3 },
  async (event: { id: string; type: string }) => {
    return { id: event.id, type: event.type, handled: true };
  }
);

const pipeline = graph(
  {
    name: "webhook-pipeline",
    timeoutMs: 3_600_000,
    retryPolicy: { maxRetries: 2, delayMs: 1_000, backoffFactor: 2 },
  },
  async (event: { id: string; type: string }) => {
    return handleEvent(event);
  }
);

await deploy();

const result = await pipeline({ id: "evt_demo", type: "invoice.paid" });
console.log(result);
