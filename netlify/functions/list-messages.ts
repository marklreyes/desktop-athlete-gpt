import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

const TIMEOUT_DURATION = 8000; // 8 seconds (Netlify's limit is 10s)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: TIMEOUT_DURATION,
  maxRetries: 2 // Add retry limit
});

export const handler: Handler = async (event) => {
  try {
    const threadId = event.queryStringParameters?.threadId;

    if (!threadId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing threadId parameter" }),
      };
    }

    // Call OpenAI's API to list messages for the given threadId
    const response = await openai.beta.threads.messages.list(threadId);

    if (!response || !response.data) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to retrieve messages" }),
      };
    }

    // Ensure all message content is a string
    const messages = response.data.map((message) => ({
      ...message,
      content: typeof message.content === "string" ? message.content : JSON.stringify(message.content),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ messages }),
    };
  } catch (error) {
    console.error("Error listing messages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to list messages" }),
    };
  }
};
