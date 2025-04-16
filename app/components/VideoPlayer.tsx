import YouTube from "react-youtube";
import { useTheme } from "../context/ThemeContext";
import { trackEvent } from "../utils/trackEvent";

export function VideoPlayer({
  videoUrl,
  title,
  onVideoEnd,
  onPlayerReady,
  onPlay,
  onPause
}: {
  videoUrl: string;
  title: string;
  onVideoEnd?: () => void;
  onPlayerReady?: (event: any) => void;
  onPlay?: () => void;
  onPause?: () => void;
}) {
	const { theme } = useTheme();

	// Extract video ID from URL
	const getYouTubeVideoId = (url: string): string => {
	  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	  const match = url.match(regExp);
	  return (match && match[2].length === 11) ? match[2] : '';
	};

	const videoId = getYouTubeVideoId(videoUrl);

	return (
	  <div className={`w-full h-0 pb-[56.25%] relative border-4`}>
		<YouTube
		  videoId={videoId}
		  className="absolute top-0 left-0 w-full h-full"
		  opts={{
			width: '100%',
			height: '100%',
			playerVars: {
				modestbranding: 1,
				rel: 0,               // This restricts related videos to same channel
				showinfo: 0,          // Hides video info (deprecated but still works in some browsers)
				iv_load_policy: 3,    // Disables annotations
				autoplay: 0,
				controls: 1,
				disablekb: 0,
				fs: 1,                // Allow fullscreen
				start: 0,
				end: 0,               // Set dynamically if you know video duration (optional)
				loop: 0,
				playsinline: 1,       // Plays inline on iOS
				origin: window.location.origin  // Security feature
			}
		  }}
		  onReady={(event) => {
			// Call the parent's onPlayerReady if provided
			if (onPlayerReady) {
				onPlayerReady(event);
			}
		  }}
		  onEnd={() => {
			// Dispatch workout completed event
			window.dispatchEvent(new Event('workout-completed'));

			trackEvent("video_end", {
			  params: {
				video_title: title,
				video_url: videoUrl
			  }
			})();
			// Call the parent component's callback if provided
			if (onVideoEnd) {
				onVideoEnd();
			}
		}}
		  onPause={() => {
			trackEvent("video_pause", {
			  params: {
				video_title: title,
				video_url: videoUrl
			  }

			})();

			// Call parent's onPause if provided
			if (onPause) {
				onPause();
			}
		}}
		  onPlay={() => {
			trackEvent("video_play", {
			  params: {
				video_title: title,
				video_url: videoUrl
			  }
			})();

			// Call parent's onPlay if provided
			if (onPlay) {
				onPlay();
			}
		  }}
		  onStateChange={(event) => {
			// YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
			// We can use this to trigger additional logic when the player state changes
			const playerState = event.data;

			// Dispatch custom event to notify parent component of state change
			window.dispatchEvent(new CustomEvent('youtube-state-change', {
				detail: { playerState, player: event.target }
			}));
		  }}
		/>
	  </div>
	);
  }
