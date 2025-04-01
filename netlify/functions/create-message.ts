import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

// Add timeout constant
const TIMEOUT_DURATION = 8000; // 8 seconds (Netlify's limit is 10s)
const MAX_MESSAGE_LENGTH = 1000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: TIMEOUT_DURATION,
  maxRetries: 2 // Add retry limit
});

export const handler: Handler = async (event) => {
  try {
    // Parse threadId and question from the request body
    const { threadId, question } = JSON.parse(event.body || "{}");

    if (!threadId || !question) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing threadId or question parameter" }),
      };
    }

    if (question.length > MAX_MESSAGE_LENGTH) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Question exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` }),
      };
    }

    // Call OpenAI's API to create a message in the given thread
    const response = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: question,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error creating message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create message" }),
    };
  }
};


