import type { Route } from "./+types/home";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { trackEvent } from "~/utils/trackEvent";
import { VideoPlayer } from "~/components/VideoPlayer";
import { useEffect, useState } from "react";

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

	// Use useState to manage the video URL and title
	const [videoUrl, setVideoUrl] = useState<string>("");
	const [title, setTitle] = useState<string>("");

	useEffect(() => {
		// First try to get values from location state (on initial navigation)
		const stateUrl = location.state?.url;
		let stateTitle = location.state?.content;

		// Check if title is too short and use default if needed
		if (!stateTitle || typeof stateTitle !== 'string' || stateTitle.length <= 5) {
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
		  if (!savedTitle || savedTitle.length <= 5) {
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
		<div>
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="text-4xl font-bold mb-4">{title}</h1>
				<p className="text-lg mb-4">Presented by Desktop Athlete</p>
				<p className="text-lg mb-4">Follow along with the video below:</p>
				<VideoPlayer videoUrl={videoUrl} title={title} />
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
