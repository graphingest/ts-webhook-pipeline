# ts-webhook-pipeline

A TypeScript pipeline and a webhook route. No Python. `POST /api/webhook` starts the run and returns the run id. The pipeline keeps going after the response.

## Run

```bash
npm install
npm run deploy
```

Copy `app/api/webhook/route.ts` into your app. Set `GRAPHINGEST_API_KEY` and `GRAPHINGEST_FLOW_ID` (the flow id from the dashboard after deploy).
