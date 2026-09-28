import { GraphIngestClient } from "graphingest";

export async function POST(request: Request) {
  const event = (await request.json()) as { id?: string; type?: string };
  if (!event.id || !event.type) {
    return Response.json({ error: "id and type are required" }, { status: 400 });
  }

  const flowId = process.env.GRAPHINGEST_FLOW_ID;
  if (!flowId) {
    return Response.json({ error: "GRAPHINGEST_FLOW_ID is not set" }, { status: 500 });
  }

  const client = new GraphIngestClient();
  const res = await client.triggerFlowRun(flowId, { id: event.id, type: event.type });
  const runId = (res as { data?: { id?: string } }).data?.id ?? null;
  return Response.json({ runId, status: "dispatched" });
}
