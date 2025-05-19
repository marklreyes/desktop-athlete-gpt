import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler: Handler = async (event) => {
  try {
    const threadId = event.queryStringParameters?.thread;
    const runId = event.queryStringParameters?.run;

    if (!threadId || !runId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing thread or run parameter" }),
      };
    }

    // Retrieve the run status from OpenAI
    const response = await openai.beta.threads.runs.retrieve(threadId, runId);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error retrieving run:", error);

    // Handle 404 error specifically
    if (typeof error === 'object' && error !== null && 'response' in error &&
        typeof error.response === 'object' && error.response !== null &&
        'status' in error.response && error.response.status === 404) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No run found with the specified ID" }),
      };
    }
		// Handle other API errors with type checking
		if (typeof error === 'object' && error !== null) {
			let errorMessage = "Failed to retrieve run";

			// Try to extract error message
			if ('message' in error && typeof error.message === 'string') {
				errorMessage = error.message;
			} else if ('error' in error &&
								 typeof error.error === 'object' && error.error !== null &&
								 'message' in error.error && typeof error.error.message === 'string') {
				errorMessage = error.error.message;
			}

			return {
				statusCode: 500,
				body: JSON.stringify({ error: errorMessage }),
			};
		}
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve run" }),
    };
  }
};
