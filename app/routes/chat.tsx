import { useState, useEffect, useRef } from "react";
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

	// Add this at the top of your component
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// TODO - Load threadId from localStorage based on revisited UX
	// useEffect(() => {
	// 	const savedThreadId = localStorage.getItem("chat-thread-id");
	// 	if (savedThreadId) {
	// 		setThreadId(savedThreadId);
	// 	}
	// }, []);
	// TODO - Load runId from localStorage based on revisited UX
	// useEffect(() => {
	// 	const savedRunId = localStorage.getItem("chat-run-id");
	// 	if (savedRunId) {
	// 		setRunId(savedRunId);
	// 	}
	// }
	// , []);

	// Add this useEffect after your existing useEffect hooks
	useEffect(() => {
		// Clear localStorage on component mount (when user enters the route)
		console.log("Chat component mounted: Clearing localStorage items");
		localStorage.removeItem("chat-run-id");
		localStorage.removeItem("chat-thread-id");

		// Return a cleanup function to run when the component unmounts
		return () => {
		console.log("Chat component unmounted: Clearing localStorage items");
			localStorage.removeItem("chat-run-id");
			localStorage.removeItem("chat-thread-id");
		};
	}, []); // Empty dependency array ensures this runs only on mount/unmount

	// Update the useEffect for audio with looping functionality
	useEffect(() => {
		// Create the audio element early so we can reference it later
		const audio = new Audio('/pixel-playground-color-parade-main-version-25382-01-43.mp3');
		audio.volume = 0.1;
		audioRef.current = audio;

		// Add event listener for when the audio ends to restart it
		const handleAudioEnd = () => {
		console.log("Audio track ended, restarting...");
		if (audioRef.current) {
			audioRef.current.currentTime = 0; // Reset to beginning
			audioRef.current.play().catch(error => {
			console.error("Error replaying audio:", error);
			});
		}
		};

		// Add the ended event listener to create a loop
		audio.addEventListener('ended', handleAudioEnd);

		// Set a timeout to play the music after 5 seconds
		const audioTimer = setTimeout(() => {
		try {
			// Play the audio and handle potential autoplay policy errors
			audio.play().catch(error => {
			console.error("Error playing audio:", error);
			});
		} catch (error) {
			console.error("Error playing audio:", error);
		}
		}, 5000);

		// Clean up function that runs when component unmounts
		return () => {
		clearTimeout(audioTimer);
		if (audioRef.current) {
			// Remove the event listener to prevent memory leaks
			audioRef.current.removeEventListener('ended', handleAudioEnd);
			audioRef.current.pause();
			audioRef.current.currentTime = 0; // Reset position
		}
		};
	}, []);

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

			// Create the initial run
			console.log("Creating a new run with thread ID:", effectiveThreadId);
			// Check that effectiveThreadId is not null before calling runThread
			if (!effectiveThreadId) {
				throw new Error("Thread ID is unexpectedly null");
			}
			const initialRunResponse = await runThread(effectiveThreadId);
			if (!initialRunResponse) {
				throw new Error("Failed to create initial run");
			}

			let runData = await initialRunResponse.json();
			let currentRunId = runData.id || runData.run_id;
			if (!currentRunId) {
				throw new Error("Invalid run data: missing run_id");
			}

			setRunId(currentRunId);
			localStorage.setItem("chat-run-id", currentRunId);
			console.log("Run created successfully:", currentRunId);

			// Now poll for the run to complete
			let pollingAttempts = 0;
			let runRetryCount = 0;
			const MAX_POLLING_ATTEMPTS = 10;
			const MAX_RUN_RETRIES = 3;
			let runStatus = "queued";

			// TODO: Polling an existing run id when it is expired"" leads to issues, refactor polling or use streaming for revisited UX experience
			// PATCH - For now, we will just create a new run.
			while (pollingAttempts < MAX_POLLING_ATTEMPTS) {
				console.log(`Polling attempt ${pollingAttempts + 1}/${MAX_POLLING_ATTEMPTS} for run ${currentRunId}`);

				try {
					// Add null checks before calling retrieveRun
					if (!effectiveThreadId || !currentRunId) {
						throw new Error("Thread ID or Run ID is null, cannot retrieve run status");
					}

					const currentRun = await retrieveRun(effectiveThreadId, currentRunId);
					if (!currentRun) {
						pollingAttempts++;
						await new Promise(resolve => setTimeout(resolve, 1500));
						continue;
					}

					runStatus = currentRun.status;
					console.log("Run status:", runStatus);

					// If run completed successfully, break out of the loop
					if (runStatus === "completed") {
						console.log("Run completed successfully!");
						break;
					}

					// If run failed, try to create a new one (up to MAX_RUN_RETRIES times)
					if (["expired", "failed", "cancelled"].includes(runStatus)) {
						if (runRetryCount >= MAX_RUN_RETRIES) {
							throw new Error(`Maximum run retries (${MAX_RUN_RETRIES}) exceeded`);
						}

						console.log(`Run ${runStatus}. Treating as new interaction with existing thread.`);
						runRetryCount++;

						// Clear the existing runId from state and localStorage
						setRunId(null);
						localStorage.removeItem("chat-run-id");

						// Create a completely fresh run for the existing thread
						console.log("Creating a fresh run for existing thread:", effectiveThreadId);
						const freshRunResponse = await runThread(effectiveThreadId);
						if (!freshRunResponse) {
							throw new Error(`Failed to create fresh run after ${runStatus} status`);
						}

						const freshRunData = await freshRunResponse.json();
						console.log("Fresh run response data:", JSON.stringify(freshRunData, null, 2));

						// Reset currentRunId and extract it correctly from the response
						currentRunId = null; // Reset to ensure we don't reuse the expired ID

						// Check all possible locations of the run_id in the response
						if (freshRunData.id) {
							currentRunId = freshRunData.id;
							console.log("Found run_id as 'id':", currentRunId);
						} else if (freshRunData.run_id) {
							currentRunId = freshRunData.run_id;
							console.log("Found run_id as 'run_id':", currentRunId);
						} else if (freshRunData.run?.id) {
							currentRunId = freshRunData.run.id;
							console.log("Found run_id in nested object 'run.id':", currentRunId);
						}

						if (!currentRunId) {
							console.error("Could not find run_id in response:", freshRunData);
							throw new Error("Fresh run data missing run_id");
						}

						// Update state and localStorage with the new run ID
						setRunId(currentRunId);
						localStorage.setItem("chat-run-id", currentRunId);
						console.log("Fresh run created successfully:", currentRunId);

						// Reset status to queued since we're starting with a fresh run
						runStatus = "queued";

						// Give time for run to initialize but don't reset polling attempts
						await new Promise(resolve => setTimeout(resolve, 2000));
						continue;
					}

					// For queued, in_progress, etc. we wait and check again
					await new Promise(resolve => setTimeout(resolve, 1500));
				} catch (error) {
					console.error("Error during polling:", error);
				}

				pollingAttempts++;
			}

			// After the polling loop, check if we got a completed run
			if (runStatus !== "completed") {
				throw new Error("Failed to get a completed run after maximum attempts");
			}

			// Get messages from the thread
			console.log("Fetching messages from completed run");
			if (!effectiveThreadId) {
				throw new Error("Thread ID is unexpectedly null");
			}
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
		className="flex flex-col justify-center items-center"
		style={{ minHeight: 'calc(100vh - 57px - 157px)' }}
		role="main"
		aria-label="Chat Interface"
		aria-live="polite"
		aria-busy={isLoading}
		aria-disabled={isLoading}
    >
      <div
        className={`flex flex-col space-y-4 w-full max-w-lg p-4 border border-[${theme.accent}] bg-[${theme.primary}] shadow-md`}
        role="region"
        aria-label="Chat Container"
      >
        {/* Assistant's Latest Response with 8-bit styling */}
        <div
          className="flex items-start gap-3 max-h-[calc(100vh-12rem)]"
          role="log"
          aria-label="Assistant's latest response"
        >
          {/* 8-bit style avatar */}
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 border-2 border-[${theme.accent}] bg-[${theme.primary}] p-0 m-0 overflow-hidden`}>
              {/* Pixel art robot face */}
			  <img
				src="/dada-avatar.png"
				alt="Desktop Athlete AI Avatar"
				className="h-full w-full object-contain"
			/>
            </div>
          </div>

          {/* 8-bit style chat bubble - Modified to properly show triangles */}
          <div className="relative flex-1"> {/* Add an outer wrapper without overflow restrictions */}
            {/* Left side connector triangles - moved outside the chat bubble */}
            {/* Outer black triangle (border) */}
            <div className="absolute left-[-20px] top-3 w-0 h-0 z-10"
              style={{
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: `12px solid ${theme.accent}`,
				borderLeft: "12px solid transparent"
              }}>
            </div>
            {/* Inner white triangle (fill) */}
            <div className="absolute left-[-14px] top-3 w-0 h-0 z-10"
              style={{
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderRight: "8px solid white",
				borderLeft: "10px solid transparent"
              }}>
            </div>

            {/* Main chat bubble */}
            <div
              className={`bg-white border-4 border-[${theme.accent}] shadow-[4px_4px_0px_0px_var(--theme-rgba)]
              p-4 overflow-y-auto`}
              style={{
                maxHeight: "calc(100vh-14rem)"
              }}
            >
              {/* Message content */}
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
							p: ({ children }) => (
							  <p className={`text-gray-500`}>{children}</p>
							),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-[${theme.secondary}] underline hover:text-[${theme.secondary}]`}
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

                return <p className="text-gray-500">
                  Hi, I'm Desktop Athlete, your AI guide for free 20+ minute workouts. No weights or equipment required. Just your mat, water bottle, and a towel.
                  <br />
                  <br />
                  Be honest...that email can wait.
                  <br />
                  <br />
                  So what're you waiting for? Let's do it!
                </p>;
              })()}
            </div>
          </div>
        </div>

        <hr className={`mt-4 mb-4 border-t border-[${theme.accent}] border-opacity-50`} />

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
              placeholder="Suggest a 20 minute workout!"
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
				${theme.background}
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

      </div>
    </div>
  );
}
