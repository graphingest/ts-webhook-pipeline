# Someone knocks, you answer, the work continues

Other services do not wait. A payment provider says “this invoice was paid.” A form says “someone just signed up.” A storage bucket says “a file arrived.” Your site has to answer quickly, or the sender assumes you were asleep and tries again.

The slow part, updating the account, writing the receipt, processing the file, does not belong inside that quick answer.

This starter is for a TypeScript app. The knock is a webhook: an incoming message. The route answers with a run id. [GraphIngest](https://www.graphingest.io) does the rest.

## When this fits

Use it when the trigger is a message from outside, and your team writes TypeScript. The slow work is registered on [graphingest.io](https://www.graphingest.io).

Everyday cases:

- A card payment is confirmed. You answer “received,” then record the payment and email the receipt.
- A customer uploads a document. You answer “received,” then read it, store the result, and notify the team.
- A form on another site posts a new lead. You answer “received,” then add the lead and assign an owner.
- A partner system sends a batch of events. Each event gets an id, and you can look that run up later on [graphingest.io/runs](https://www.graphingest.io/runs).

The sample message in this folder is a paid invoice: an `id` and a `type`. Your real sender will have its own shape. Keep the idea: read the message, start the job on [graphingest.io](https://www.graphingest.io), return the run id.

## What happens, in order

1. The other service sends a message to `/api/webhook` on your app.
2. Your app checks that the message has an id and a type.
3. Your app asks [graphingest.io](https://www.graphingest.io) to start `webhook-pipeline`, then replies with the run id. That reply is the whole conversation with the sender.
4. GraphIngest runs the pipeline after the reply has already gone out. The sample pipeline records that the event was handled. You replace that step with your real work: the receipt, the file, the lead. The shape of that step is in the [docs](https://www.graphingest.io/docs).
5. [The dashboard](https://www.graphingest.io/dashboard) shows the run, so you can see whether the slow part finished.

If the same event id shows up again within five minutes, the saved result is reused. That protects you when a sender delivers the same knock twice.

## What you need

- A GraphIngest account at [graphingest.io/signup](https://www.graphingest.io/signup).
- An API key from [Settings](https://www.graphingest.io/settings). Store it as `GRAPHINGEST_API_KEY` in the environment. Leave it out of the source files.
- A TypeScript app that can expose a public address for the sender to call.

## How to run it

From this folder, register the pipeline on [graphingest.io](https://www.graphingest.io):

```bash
npm install
npm run deploy
```

Open [your flows](https://www.graphingest.io/flows) and copy the flow id.

Copy `app/api/webhook/route.ts` into your app at `app/api/webhook/route.ts`.

In the app’s environment, set:

- `GRAPHINGEST_API_KEY`, the key from [Settings](https://www.graphingest.io/settings).
- `GRAPHINGEST_FLOW_ID`, the flow id from [graphingest.io/flows](https://www.graphingest.io/flows).

Send a test message:

```bash
curl -X POST https://your-app.example/api/webhook \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"evt_demo\",\"type\":\"invoice.paid\"}"
```

The response comes back with a run id. [The dashboard](https://www.graphingest.io/dashboard) shows that run while the pipeline finishes. Point your payment provider, form tool, or partner at that same address when the test looks right.
