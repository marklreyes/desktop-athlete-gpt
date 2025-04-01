import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

const TIMEOUT_DURATION = 8000; // 8 seconds (Netlify's limit is 10s)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: TIMEOUT_DURATION,
  maxRetries: 2, // Add retry limit
});

export const handler: Handler = async (event) => {
  try {
    const threadId = event.queryStringParameters?.threadId;
    const asstID = event.queryStringParameters?.asstID;

    if (!threadId || !asstID) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing threadId or asstID parameter" }),
      };
    }

    // Check if the thread already has an active run
    const threadRuns = await openai.beta.threads.runs.list(threadId);
    const activeRun = threadRuns.data.find(
      run => run.status !== "completed" && run.status !== "failed" && run.status !== "cancelled"
    );

    if (activeRun) {
      // Return the existing active run_id
      return {
        statusCode: 200,
        body: JSON.stringify({ run_id: activeRun.id }),
      };
    }

    // If no active run exists, create a new run
    const response = await openai.beta.threads.runs.create(threadId, {
      assistant_id: asstID
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error running thread:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to run thread" }),
    };
  }
};
