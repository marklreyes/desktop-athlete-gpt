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
    // Parse the initial message from the request body
    const { initialMessage } = JSON.parse(event.body || "{}");

    if (!initialMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing initialMessage parameter" }),
      };
    }

    // Call OpenAI's API to create a new thread with the initial message
    const response = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: initialMessage,
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error creating thread:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create thread" }),
    };
  }
};

