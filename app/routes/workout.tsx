import type { Route } from "./+types/home";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { trackEvent } from "../utils/trackEvent";
import { VideoPlayer } from "../components/VideoPlayer";
import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { Toast } from "../components/Toast";
import { AudioControls } from "../components/AudioControls";

export function meta({}: Route.MetaArgs) {
	return [
	  { title: "Workout of The Day | Desktop Athlete  | AI Assistant for free HIIT, Tabata, Calisthenics Workouts | DesktopAthlete.com" },
	  { name: "description", content: "Workout of The Day presented by Desktop Athlete." },
	  { property: "og:title", content: "Workout of The Day | Desktop Athlete" },
	  { property: "og:description", content: "Workout of The Day presented by Desktop Athlete." },
	  { property: "og:type", content: "website" },
	  { property: "og:url", content: "https://www.desktopathlete.com/workout" },
	];
}

export default function Workout() {
	const { theme } = useTheme();
	const location = useLocation();
	const [showToast, setShowToast] = useState(true);

	// Use useState to manage the video URL and title
	const [videoUrl, setVideoUrl] = useState<string>("");
	const [title, setTitle] = useState<string>("");

	// Add state to track if video has finished playing
	const [videoCompleted, setVideoCompleted] = useState(false);

	// Add state for video duration and current time
	const [videoDuration, setVideoDuration] = useState<number>(0);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [timeRemaining, setTimeRemaining] = useState<string>("--:--");

	// Reference to the YouTube player instance
	const playerRef = useRef<any>(null);

	// Interval reference for countdown timer
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Original document title (to restore later)
	const originalTitleRef = useRef<string>(document.title);

	// Format time remaining in MM:SS format
	const formatTimeRemaining = (seconds: number): string => {
		if (seconds <= 0 || !seconds) return "00:00";
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	// Update time remaining and document title
	const updateTimeRemaining = () => {
		if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
			try {
				const currentTimeValue = playerRef.current.getCurrentTime();
				setCurrentTime(currentTimeValue);

				// Only calculate remaining time if we have both values
				if (videoDuration > 0 && currentTimeValue >= 0) {
					const remaining = Math.max(0, videoDuration - currentTimeValue);
					const formattedTime = formatTimeRemaining(remaining);
					setTimeRemaining(formattedTime);

					// Update document title with remaining time
					document.title = `⏱️ ${formattedTime} | ${title}`;
				}
			} catch (error) {
				console.error("Error updating time remaining:", error);
			}
		}
	};

	// Handle video play event
	const handlePlay = () => {
		console.log("Video is playing, starting timer updates");

		// Clear any existing interval first
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		// Start a new interval for updates when the video is playing
		timerRef.current = setInterval(updateTimeRemaining, 1000);

		// Update immediately when play starts
		updateTimeRemaining();
	};

	// Handle video pause event
	const handlePause = () => {
		console.log("Video is paused, stopping timer updates");

		// Stop the interval when paused
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		// Do one final update to ensure the title is accurate
		updateTimeRemaining();
	};

	// Setup player reference and start countdown timer
	const handlePlayerReady = (event: any) => {
		playerRef.current = event.target;

		// Save original document title if not already saved
		if (!originalTitleRef.current) {
			originalTitleRef.current = document.title;
		}

		// Get video duration when player is ready
		if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
			const duration = playerRef.current.getDuration();
			setVideoDuration(duration);
			const formattedTime = formatTimeRemaining(duration);
			setTimeRemaining(formattedTime);

			// Set initial title with duration
			document.title = `⏱️ ${formattedTime} | ${title}`;
		}

		// Clear any existing interval
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		// Start interval to update time remaining
		timerRef.current = setInterval(updateTimeRemaining, 1000);

		// Track event when player is ready
		trackEvent("video_ready", {
			params: {
				action: "Ready",
				event_category: "Workout",
				event_label: title,
				video_url: videoUrl
			}
		})();
	};

	// Handle video completion
	const handleVideoEnd = () => {
		console.log("Video playback completed!");
		setVideoCompleted(true);

		// Clear interval when video ends
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		setTimeRemaining("00:00");

		// Update title to show completion
		document.title = `✅ Completed | ${title}`;

		// Optional: Track completion event
		trackEvent("workout_completed", {
			params: {
				action: "Complete",
				event_category: "Workout",
				event_label: title,
				video_url: videoUrl
			}
		})();
	};

	// Clean up interval and restore title on component unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}

			// Restore original document title when leaving the page
			if (originalTitleRef.current) {
				document.title = originalTitleRef.current;
			}
		};
	}, []);

	// Update title when video title changes
	useEffect(() => {
		if (title && timeRemaining) {
			document.title = `⏱️ ${timeRemaining} | ${title}`;
		}
	}, [title]);

	useEffect(() => {
		// First try to get values from location state (on initial navigation)
		const stateUrl = location.state?.url;
		let stateTitle = location.state?.content;

		// Check if title is too short and use default if needed
		if (!stateTitle || typeof stateTitle !== 'string' || stateTitle.length <= 10) {
		  stateTitle = "Workout of The Day";
		}

		if (stateUrl && stateTitle) {
		  // We have state from navigation, store it for future refreshes
		  localStorage.setItem('workout-video-url', stateUrl);
		  localStorage.setItem('workout-video-title', stateTitle);
		  setVideoUrl(stateUrl);
		  setTitle(stateTitle);
		} else {
		  // No state (page was refreshed), try localStorage
		  const savedUrl = localStorage.getItem('workout-video-url');
		  let savedTitle = localStorage.getItem('workout-video-title');

		  // Check if saved title is too short and use default if needed
		  if (!savedTitle || savedTitle.length <= 10) {
			savedTitle = "Workout of The Day";
		  }

		  if (savedUrl && savedTitle) {
			setVideoUrl(savedUrl);
			setTitle(savedTitle);
		  } else {
			// Fallback to defaults if nothing is available
			setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
			setTitle("Workout of The Day");
		  }
		}
	  }, [location]);
	return (
		<div
			className="flex flex-col items-center justify-center"
			style={{ minHeight: 'calc(100vh - 57px - 157px)' }}
			role="region"
			aria-label="Workout of the Day"
			aria-live="polite"
			aria-busy={videoCompleted ? "false" : "true"}
			>
			{/* Play victory sound when workout is completed */}
			{videoCompleted && (
				<div className="sr-only" aria-hidden="true">
					<AudioControls
						audioSrc="/8bit-music-winner-ni-sound-1-00-09.mp3"
						autoPlay={true}
						loop={false}
						defaultVolume={0.1}
					/>
				</div>
			)}

			{/* Show a celebration message when completed */}
			{videoCompleted && (
				<Toast
					role="status"
					aria-live="polite"
					showToast={showToast}
					setShowToast={setShowToast}
					message="🏆 Workout complete! Great job!"
				/>
			)}
      		{/* Only show confetti when video is completed */}
			{videoCompleted && (
			<div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
				<Confetti
					width={Math.min(window.innerWidth)} // Limit width to create more centered effect
					height={window.innerHeight} // Use 80% of window height
					recycle={false}
					numberOfPieces={5000}
					colors={['#f39416', '#01F1FC', '#331C40', '#B4D0D1']} // Match your theme colors
					gravity={0.3} // Slower fall for better visibility
				/>
			</div>
			)}
			<div className="flex flex-col items-center justify-center text-center w-full max-w-5xl px-4">
				<h1 className="text-3xl font-bold mb-4">{title}</h1>
				<p className="text-md mb-4">Presented by Desktop Athlete</p>
				<p className="text-md mb-4">Follow along with the video below:</p>
				<VideoPlayer
					videoUrl={videoUrl}
					title={title}
					onVideoEnd={handleVideoEnd}
					onPlayerReady={handlePlayerReady}
					onPlay={handlePlay}
					onPause={handlePause}
				/>
				<Link to="/chat"
					onClick={() => {
						trackEvent("return_to_chat", {
						params: {
							action: "Click",
							event_category: "Navigation",
							event_label: "Back to Chat",
							component: "Workout Screen"
						},
						audioSrc: "/retro-8bit-music-logo-ni-sound-1-00-04.mp3",
						audioVolume: 0.1
						})();
					}}
					className={`mt-4 text-center px-4 py-2 border-4
						border-[${theme.primary}]
						bg-[${theme.primary}]
						text-[${theme.secondary}]
						font-bold shadow-[4px_4px_0px_0px]
						shadow-[${theme.secondary}]
						hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px]
						active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
						transition-all`
				}>
					Back to Chat
				</Link>
			</div>
		</div>
	);
}
