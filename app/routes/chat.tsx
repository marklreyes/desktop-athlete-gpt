import { useState, useEffect } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { VisuallyHidden } from "../components/VisuallyHidden";
import { sanitizeInput } from "~/utils/sanitizer";
import type { Route } from "./+types/chat";
import { useTheme } from "../context/ThemeContext";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const MAX_MESSAGE_LENGTH = 800; // Reduced from 1000 to better align with 300 token limit

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Chat with Desktop Athlete | AI Assistant for HIIT, Tabata, Calisthenics Workouts | DesktopAthlete.com" },
		{ name: "description", content: "Chat with Desktop Athlete, your AI assistant focused on providing you with FREE exercise programs for as little as 20 minutes." },
		{ name: "twitter:card", content: "Chat with Desktop Athlete, your AI assistant focused on providing you with FREE exercise programs for as little as 20 minutes." },
		{ property: "og:title", content: "Chat with Desktop Athlete | AI Assistant for free HIIT, Tabata, Calisthenics Workouts | DesktopAthlete.com" },
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: "https://www.desktopathlete.com/chat" },
		{ property: "og:description", content: "Chat with Desktop Athlete, your AI assistant focused on providing you with FREE exercise programs for as little as 20 minutes." }
	];
}

// Return a plain object instead of Response.json()
export async function loader({}: LoaderFunctionArgs) {
  return {
    messages: []
  };
}

export default function Chat() {
	const { theme } = useTheme();
	const data = useLoaderData() as { messages: Message[] };

	// Initialize messages from localStorage or loader data
	const [messages, setMessages] = useState<Message[]>(() => {
		if (typeof window !== "undefined") {
		  const savedMessages = localStorage.getItem("chat-messages");
		  return savedMessages ? JSON.parse(savedMessages) : data.messages;
		}
		return data.messages; // Fallback for SSR
	});

	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [threadId, setThreadId] = useState<string | null>(null);
	const [runId, setRunId] = useState<string | null>(null);
	// Load threadId from localStorage
	useEffect(() => {
		const savedThreadId = localStorage.getItem("chat-thread-id");
		if (savedThreadId) {
			setThreadId(savedThreadId);
		}
	}, []);
	// Load runId from localStorage
	useEffect(() => {
		const savedRunId = localStorage.getItem("chat-run-id");
		if (savedRunId) {
			setRunId(savedRunId);
		}
	}
	, []);

	// Create a message
	async function createMessage(threadId: string, sanitizedMessage: string) {
		const createMessageResponse = await fetch("/.netlify/functions/create-message", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				threadId, // Use the existing threadId
				question: sanitizedMessage, // User's message
			}),
		});

		if (!createMessageResponse.ok) {
			const errorData = await createMessageResponse.json();
			throw new Error(errorData.error || "Failed to send message");
		}

		return createMessageResponse;
	}

	// Create a run
	// This function is called when the user sends a message
	// and is used to create a new run for the thread
	// It is not called in the initial load
	// because we want to avoid creating a run before the user interacts
	// with the chat
	// It is called when the user sends a message
	// and the threadId is already set
	// It is called after the thread is created
	// and the runId is set
	// It is called when the user sends a message
	// and the runId is not set
	async function runThread(threadId: string) {
		try {
			console.log("Running thread with assistantId:", import.meta.env.VITE_ASSISTANT_ID);

			const runThreadResponse = await fetch(
				`/.netlify/functions/run-thread?threadId=${threadId}&asstID=${import.meta.env.VITE_ASSISTANT_ID}`
			);

			if (!runThreadResponse.ok) {
				const errorData = await runThreadResponse.json();
				console.error("Run thread error:", errorData);
				setErrorMessage(errorData.error || "Failed to create run");
				return null;
			}

			// Try parsing the response before returning
			try {
				const responseData = await runThreadResponse.json();
				console.log("Run thread response:", responseData);

				// Clone the response since we've already consumed it with .json()
				const clonedResponse = new Response(JSON.stringify(responseData), {
					status: 200,
					headers: { 'Content-Type': 'application/json' }
				});

				return clonedResponse;
			} catch (parseError) {
				console.error("Error parsing run response:", parseError);
				setErrorMessage("Failed to parse run response");
				return null;
			}
		} catch (error) {
			console.error("Error running thread:", error);
			setErrorMessage("Failed to run thread");
			return null;
		}
	}

	// Get messages from the thread
	// This function is called after the assistant's response is received
	// and is used to update the chat with all messages from the thread
	// It is not called in the initial load
	// because we want to avoid fetching messages before the user interacts
	// with the chat
	async function listMessages(threadId: string) {
		try {
			console.log("Listing messages for thread:", threadId);

			// Add a cache-busting parameter
			const timestamp = new Date().getTime();
			const listMessagesResponse = await fetch(
				`/.netlify/functions/list-messages?threadId=${threadId}&_=${timestamp}`
			);

			if (!listMessagesResponse.ok) {
				const errorData = await listMessagesResponse.json();
				console.error("List messages error:", errorData);
				throw new Error(errorData.error || "Failed to list messages");
			}

			const data = await listMessagesResponse.json();
			console.log("Raw message data received:", data);

			if (!data.messages || !Array.isArray(data.messages)) {
				console.error("Invalid message format received:", data);
				throw new Error("Invalid message format received from API");
			}

			return data.messages;
		} catch (error) {
			console.error("Error listing messages:", error);
			setErrorMessage("Failed to list messages: " + (error instanceof Error ? error.message : String(error)));
			throw error; // Re-throw to handle in the calling function
		}
	}

	// Retrieve the run status
	// This function is called when the user sends a message
	// and is used to check the status of the run
	// It is not called in the initial load
	// because we want to avoid checking the status before the user interacts
	// with the chat
	// It is called when the user sends a message
	// and the runId is already set
	// It is called after the run is created
	// and the runId is set
	// It is called when the user sends a message
	// and the runId is not set
	async function retrieveRun(threadId: string, runId: string) {
		try {
			console.log(`Retrieving run status for thread=${threadId}, run=${runId}`);
			const retrieveRunResponse = await fetch(
				`/.netlify/functions/retrieve-run?thread=${threadId}&run=${runId}`
			);

			if (!retrieveRunResponse.ok) {
				const errorData = await retrieveRunResponse.json();
				console.error("Retrieve run error:", errorData);
				throw new Error(errorData.error || "Failed to retrieve run status");
			}

			const currentRun = await retrieveRunResponse.json();
			return currentRun;
		} catch (error) {
			console.error("Error retrieving run:", error);
			throw error; // Let the caller handle this error
		}
	}

	const handleSendMessage = async (userMessage: string) => {
		const sanitizedMessage = sanitizeInput(userMessage);

		if (!sanitizedMessage) {
			setErrorMessage("Please enter a valid message");
			return;
		}

		if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
			setErrorMessage(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`);
			return;
		}

		try {
			setIsLoading(true);
			setErrorMessage(null);

			// Add the user's message to the chat
			const newUserMessage: Message = { role: "user", content: sanitizedMessage };
			setMessages((prev) => [...prev, newUserMessage]);

			 // Variable to store the actual thread ID we'll use
			let effectiveThreadId = threadId;

			// Create a thread if it doesn't exist (Default experience)
			if (!effectiveThreadId) {
				console.log("No thread found. Creating a new thread...");

				const createThreadResponse = await fetch("/.netlify/functions/create-thread", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ initialMessage: sanitizedMessage }),
				});

				if (!createThreadResponse.ok) {
					const errorData = await createThreadResponse.json();
					console.error("Create Thread API Error:", errorData);
					throw new Error(errorData.error || "Failed to create thread");
				}

				const threadData = await createThreadResponse.json();
				console.log("Create Thread API Response:", threadData);

				if (!threadData.id) {
					console.error("Thread creation failed: No thread_id returned from API");
					throw new Error("Thread creation failed: No thread_id returned from API");
				}

				// Update threadId in state and localStorage
				effectiveThreadId = threadData.id; // Use the new thread ID
				setThreadId(effectiveThreadId);
				if (effectiveThreadId) {
					localStorage.setItem("chat-thread-id", effectiveThreadId);
				}
				console.log("Thread created successfully:", effectiveThreadId);

				// Create a message with the newly created threadId
				await createMessage(threadData.id, sanitizedMessage);
			} else {
				// Returning experience - use existing threadId
				console.log("Using existing thread:", effectiveThreadId);
				if (effectiveThreadId) {
					await createMessage(effectiveThreadId, sanitizedMessage);
				} else {
					throw new Error("Thread ID is unexpectedly null");
				}
			}

				// Poll for run status until completed
				let currentRun;
				let runStatus = "pending";
				let pollingAttempts = 0;
				const MAX_POLLING_ATTEMPTS = 10;
				let currentRunId = runId; // Track the current runId

				// Always create a new run when sending a message
				console.log("Creating a new run with thread ID:", effectiveThreadId);

				// Clear any existing runId to force a fresh run
				setRunId(null);
				localStorage.removeItem("chat-run-id");
				currentRunId = null;

				const runThreadResponse = await runThread(effectiveThreadId);

				if (!runThreadResponse) {
					console.error("Failed to create run - runThreadResponse is null");
					throw new Error("Failed to create run for assistant response");
				}

				let runData;
				try {
					runData = await runThreadResponse.json();
					console.log("Run data received:", runData);

					if (!runData.id) {
						console.error("Run data missing run_id:", runData);
						throw new Error("Invalid run data: missing run_id");
					}
					currentRunId = runData.id; // Update the current runId
					setRunId(currentRunId);
					if (currentRunId) {
						localStorage.setItem("chat-run-id", currentRunId);
					}
					console.log("Run created successfully:", currentRunId);
					localStorage.setItem("chat-run-id", currentRunId);
					console.log("Run created successfully:", currentRunId);
				} catch (error) {
					console.error("Error parsing run data:", error);
					throw new Error("Failed to parse run data");
				}

				// Now poll for the run to complete
				while (runStatus !== "completed" && pollingAttempts < MAX_POLLING_ATTEMPTS) {
					console.log(`Polling attempt ${pollingAttempts + 1}/${MAX_POLLING_ATTEMPTS} for run ${currentRunId}`);

					try {
						currentRun = await retrieveRun(effectiveThreadId, currentRunId);
						console.log("Retrieved run:", currentRun);

						if (!currentRun) {
							console.error("Retrieved run is null");
							pollingAttempts++;
							await new Promise(resolve => setTimeout(resolve, 1500)); // Wait before retrying
							continue;
						}

						runStatus = currentRun.status;
						console.log("Run status:", runStatus);

						// Check if run has expired or failed
						if (runStatus === "expired" || runStatus === "failed" || runStatus === "cancelled") {
							console.log(`Run ${runStatus}. Creating a new run...`);
							const newRunResponse = await runThread(effectiveThreadId);

							if (!newRunResponse) {
								console.error("Failed to create new run after status:", runStatus);
								throw new Error(`Failed to create new run after ${runStatus}`);
							}

							const newRunData = await newRunResponse.json();
							console.log("New run data:", newRunData);

							if (!newRunData.run_id) {
								console.error("New run data missing run_id:", newRunData);
								throw new Error("Invalid new run data: missing run_id");
							}

							// Update the current runId (removed duplicate code)
							currentRunId = newRunData.run_id;
							setRunId(currentRunId);
							if (currentRunId) {
								localStorage.setItem("chat-run-id", currentRunId);
							}
							console.log("New run created successfully:", currentRunId);

							pollingAttempts = 0; // Reset polling attempts
							continue;
						}

						if (runStatus !== "completed") {
							await new Promise(resolve => setTimeout(resolve, 1500)); // Wait before polling again
						}
					} catch (error) {
						console.error("Error during polling:", error);
						pollingAttempts++;
						await new Promise(resolve => setTimeout(resolve, 1500)); // Wait before retrying
						continue;
					}

					pollingAttempts++;
				}

				if (pollingAttempts >= MAX_POLLING_ATTEMPTS) {
					throw new Error("Polling exceeded maximum attempts");
				}

				// Get messages from the thread
				console.log("Fetching messages from thread:", effectiveThreadId);
				const messagesData = await listMessages(effectiveThreadId);

				if (messagesData && Array.isArray(messagesData)) {
					console.log("Messages received:", messagesData.length);
					console.log("Full message data:", JSON.stringify(messagesData, null, 2));
					setMessages(messagesData);
				} else {
					throw new Error("Failed to fetch messages or invalid message format");
				}

		} catch (error) {
			console.error("Error handling message:", error);
			setErrorMessage(error instanceof Error ? error.message : "Failed to handle message");
		} finally {
			setIsLoading(false);
		}
	};

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${theme.background}`}
      role="main"
      aria-label="Chat Interface"
    >
      <div
        className="flex flex-col space-y-4 w-full max-w-lg p-4"
        role="region"
        aria-label="Chat Container"
      >
        <p className="text-white mb-4 text-center">
          Hi, I'm Desktop Athlete, your AI guide for free 20+ minute workouts.
        </p>

        <p className="text-white mb-4 text-center">
          Grab a mat, water bottle, and a towel. No weights or equipment required. Let's go!
        </p>

        <hr className="mt-4 mb-4 border-t border-white border-opacity-50" />

        {/* Input Section */}
        <div
          className="flex flex-col gap-2"
          role="form"
          aria-labelledby="chat-input-label"
        >
          <VisuallyHidden>
            <label id="chat-input-label">Chat message input</label>
          </VisuallyHidden>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage(inputMessage);
                  setInputMessage(""); // Clear input after sending
                }
              }}
              placeholder="Short on time today. What's my workout?"
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={isLoading} // Only disable when isLoading is true
              className={`w-full text-black p-2 bg-white border focus:outline-none focus:ring-2 ${
                isLoading ? "opacity-50" : ""
              }`}
              aria-label="Message input"
              aria-describedby="char-count"
              aria-disabled={isLoading}
            />
            <button
              onClick={() => {
                handleSendMessage(inputMessage);
                setInputMessage(""); // Clear input after sending
              }}
              disabled={isLoading || !inputMessage.trim()} // Disable if isLoading or input is empty
              aria-busy={isLoading}
              aria-label={isLoading ? "Sending message..." : "Send message"}
              title={
                isLoading
                  ? "Message is being sent"
                  : !inputMessage.trim()
                  ? "Please enter a message"
                  : "Send message"
              }
              className={`w-full sm:w-auto px-4 py-2
				border-[${theme.primary}]
				bg-[${theme.primary}]
				text-[${theme.secondary}]
				font-bold shadow-[4px_4px_0px_0px]
				shadow-[${theme.secondary}]
				hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px]
				active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
				transition-all
				disabled:opacity-50`}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
          <div
            className="text-xs text-right text-white"
            id="char-count"
            aria-live="polite"
          >
            {MAX_MESSAGE_LENGTH - inputMessage.length} characters remaining
          </div>
        </div>

        <hr className="mt-4 mb-4 border-t border-white border-opacity-50" />

        {/* Assistant's Latest Response */}
        <div
          className="flex flex-col items-start bg-white border border-gray-300 p-4 shadow-md text-black max-h-[calc(100vh-12rem)] overflow-y-auto"
          role="log"
          aria-label="Assistant's latest response"
        >
          {(() => {
            const assistantMessages = messages.filter((message) => message.role === "assistant");
            console.log("All assistant messages:", assistantMessages);

            const latestAssistantMessage = assistantMessages[0]; // Get the last assistant message
            console.log("Latest assistant message:", latestAssistantMessage);

            if (latestAssistantMessage) {
              try {
                // First try to parse as JSON
                const parsedContent = JSON.parse(latestAssistantMessage.content);
                console.log("Parsed content:", parsedContent);

                if (Array.isArray(parsedContent) && parsedContent[0]?.text?.value) {
                  return (
					<ReactMarkdown
						components={{
						a: ({ href, children }) => (
							<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 underline hover:text-blue-800"
							>
							{children}
							</a>
						),
						}}
					>
						{parsedContent[0].text.value}
					</ReactMarkdown>
                  );
                } else if (typeof parsedContent === 'object' && parsedContent.content) {
                  // Try alternative format
                  return <ReactMarkdown>{parsedContent.content}</ReactMarkdown>;
                }

                // If we get here, the format isn't what we expected
                return <p className="text-red-500">Unable to display message: Unknown format</p>;
              } catch (error) {
                // Not JSON, treat as plain text/markdown
                console.log("Using direct content (not JSON)");
                return <ReactMarkdown>{latestAssistantMessage.content}</ReactMarkdown>;
              }
            }

            return <p className="text-gray-500">Waiting for the assistant's response...</p>;
          })()}
        </div>

      </div>
    </div>
  );
}
