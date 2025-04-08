import YouTube from "react-youtube";
import { useTheme } from "../context/ThemeContext";
import { trackEvent } from "../utils/trackEvent";

export function VideoPlayer({ videoUrl, title, onVideoEnd }: { videoUrl: string; title: string, onVideoEnd?: () => void;  }) {
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
				rel: 0
			}
		  }}
		  onEnd={() => {
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
		}}
		  onPlay={() => {
			trackEvent("video_play", {
			  params: {
				video_title: title,
				video_url: videoUrl
			  }
			})();
		  }}
		/>
	  </div>
	);
  }
