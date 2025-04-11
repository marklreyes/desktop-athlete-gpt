import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { trackEvent } from "~/utils/trackEvent";

interface AudioControlsProps {
  audioSrc: string;
  defaultVolume?: number;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  loop?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  onUserInteraction?: () => void; // New callback prop
}

export function AudioControls({
  audioSrc,
  defaultVolume = 0.1,
  autoPlay = false,
  autoPlayDelay = 5000,
  loop = true,
  position = "bottom-right",
  onUserInteraction // New callback prop
}: AudioControlsProps) {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false); // New state for collapsible UI

  // Position styles mapping
  const positionStyles = {
    "bottom-right": "fixed bottom-20 right-4",
    "bottom-left": "fixed bottom-20 left-4",
    "top-right": "fixed top-20 right-4",
    "top-left": "fixed top-20 left-4"
  };

  useEffect(() => {
    // Create the audio element
    const audio = new Audio(audioSrc);
    audio.volume = volume;
    audioRef.current = audio;

    // Set up loop handling
    const handleAudioEnd = () => {
      if (loop && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error("Error replaying audio:", error);
        });
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('ended', handleAudioEnd);

    // Set up autoplay with delay if enabled
    let audioTimer: NodeJS.Timeout | null = null;
    if (autoPlay) {
      audioTimer = setTimeout(() => {
        try {
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error("Error auto-playing audio:", error);
            });
        } catch (error) {
          console.error("Error auto-playing audio:", error);
        }
      }, autoPlayDelay);
    }

    // Clean up function
    return () => {
      clearTimeout(audioTimer as NodeJS.Timeout);
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [audioSrc, loop, autoPlay, autoPlayDelay]);

  // Add a separate effect to handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error("Error playing audio:", err));

        // Call the callback when user interacts
        if (onUserInteraction) onUserInteraction();

        trackEvent("audio_control", {
          params: {
            action: "Play",
            event_category: "Audio",
            event_label: "Background Music",
            component: "Audio Controls"
          }
        })();
      } else {
        audioRef.current.pause();
        setIsPlaying(false);

        // Call the callback when user interacts
        if (onUserInteraction) onUserInteraction();

        trackEvent("audio_control", {
          params: {
            action: "Pause",
            event_category: "Audio",
            event_label: "Background Music",
            component: "Audio Controls"
          }
        })();
      }
    }
  };

  const changeVolume = (newVolume: number) => {
    if (audioRef.current) {
		audioRef.current.volume = newVolume;
		setVolume(newVolume);

		// Call the callback when user interacts
		if (onUserInteraction) onUserInteraction();

		trackEvent("audio_control", {
			params: {
				action: "Volume Change",
				event_category: "Audio",
				event_label: "Background Music",
				value: Math.round(newVolume * 100),
				component: "Audio Controls"
			}
		})();
    }
  };

  return (
    <div
      className={`${positionStyles[position]} p-2 border border-[${theme.accent}] bg-[${theme.primary}] z-50`}
      role="region"
      aria-label="Music controls"
    >
      	{/* Mobile view - collapsed by default */}
		<div className="md:hidden">
			{isExpanded ? (
			// Expanded view for mobile
			<div className="flex flex-col items-center gap-2">
				<div className="flex w-full justify-between items-center mb-2">
				<button
					onClick={toggleAudio}
					className={`w-8 h-8 flex items-center justify-center border-2 border-[${theme.accent}] bg-white cursor-pointer`}
					aria-label={isPlaying ? "Pause music" : "Play music"}
				>
					{/* Play/Pause icon (existing code) */}
					{isPlaying ? (
					<div className="flex gap-1 items-center">
						<div className={`w-1 h-4 bg-[${theme.primary}]`}></div>
						<div className={`w-1 h-4 bg-[${theme.primary}]`}></div>
					</div>
					) : (
					<div
						className="w-0 h-0 ml-1"
						style={{
						borderTop: '5px solid transparent',
						borderBottom: '5px solid transparent',
						borderLeft: `7px solid ${theme.primary}`
						}}
					></div>
					)}
				</button>

				{/* Collapse button */}
				<button
					onClick={() => {
					setIsExpanded(false);
					if (onUserInteraction) onUserInteraction();
					}}
					className="text-xs px-2 py-1 border border-[${theme.accent}] bg-white cursor-pointer"
					aria-label="Collapse audio controls"
				>
					▼
				</button>
				</div>

				{/* Volume controls */}
				<div className="flex gap-1">
				{[0.0, 0.33, 0.66, 1.0].map((vol) => (
					<button
					  key={vol}
					  onClick={() => changeVolume(vol)}
					  className={`w-5 h-5 flex items-center justify-center border border-[${theme.accent}] ${
						Math.abs(volume - vol) < 0.1 ? `bg-[${theme.secondary}]` : 'bg-white'
					  } text-xs cursor-pointer`}
					  aria-label={`Set volume to ${Math.round(vol * 100)}%`}
					>
					  {vol === 0 ? (
						<span>✕</span>
					  ) : (
						<div className="flex items-end gap-[2px] h-3">
						  {Array.from({ length: Math.ceil(vol * 3) }).map((_, i) => (
							<div
							  key={i}
							  className={`w-[2px] bg-[${theme.primary}]`}
							  style={{ height: `${(i+1) * 33}%` }}
							></div>
						  ))}
						</div>
					  )}
					</button>
				))}
				</div>
			</div>
			) : (
			// Collapsed view - just shows a music icon
			<button
				onClick={() => {
				setIsExpanded(true);
				if (onUserInteraction) onUserInteraction();
				}}
				className={`w-8 h-8 flex items-center justify-center border-2 border-[${theme.accent}] bg-white cursor-pointer`}
				aria-label="Expand audio controls"
			>
				<span role="img" aria-label="music">
					🔈
				</span>
			</button>
			)}
		</div>

		{/* Desktop view - always expanded */}
		<div className="hidden md:block">
			<div className="flex flex-col items-center gap-2">
				<button
				onClick={toggleAudio}
				className={`w-8 h-8 flex items-center justify-center border-2 border-[${theme.accent}] bg-white hover:translate-y-[1px] transition-transform cursor-pointer`}
				aria-label={isPlaying ? "Pause music" : "Play music"}
				title={isPlaying ? "Pause music" : "Play music"}
				>
				{isPlaying ? (
					// Pause icon (two vertical bars)
					<div className="flex gap-1 items-center">
					<div className={`w-1 h-4 bg-[${theme.primary}]`}></div>
					<div className={`w-1 h-4 bg-[${theme.primary}]`}></div>
					</div>
				) : (
					// Play icon (triangle)
					<div
					className="w-0 h-0 ml-1"
					style={{
						borderTop: '5px solid transparent',
						borderBottom: '5px solid transparent',
						borderLeft: `7px solid ${theme.primary}`
					}}
					></div>
				)}
				</button>

				<div className="flex gap-1">
				{[0.0, 0.33, 0.66, 1.0].map((vol) => (
					<button
					key={vol}
					onClick={() => changeVolume(vol)}
					className={`w-5 h-5 flex items-center justify-center border border-[${theme.accent}] ${
						Math.abs(volume - vol) < 0.1 ? `bg-[${theme.secondary}]` : 'bg-white'
					} hover:translate-y-[1px] transition-transform text-xs cursor-pointer`}
					aria-label={`Set volume to ${Math.round(vol * 100)}%`}
					title={`Volume: ${Math.round(vol * 100)}%`}
					>
					{vol === 0 ? (
						// Mute icon
						<span>✕</span>
					) : (
						// Volume bars
						<div className="flex items-end gap-[2px] h-3">
						{Array.from({ length: Math.ceil(vol * 3) }).map((_, i) => (
							<div
							key={i}
							className={`w-[2px] bg-[${theme.primary}]`}
							style={{ height: `${(i+1) * 33}%` }}
							></div>
						))}
						</div>
					)}
					</button>
				))}
				</div>
			</div>
		</div>
    </div>
  );
}
