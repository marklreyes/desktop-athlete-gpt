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
  onUserInteraction?: () => void;
}

export function AudioControls({
  audioSrc,
  defaultVolume = 0.1,
  autoPlay = false,
  autoPlayDelay = 5000,
  loop = true,
  position = "bottom-right",
  onUserInteraction
}: AudioControlsProps) {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
    audio.volume = defaultVolume;
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
  }, [audioSrc, loop, autoPlay, autoPlayDelay, defaultVolume]);

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

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);

      // Call the callback when user interacts
      if (onUserInteraction) onUserInteraction();

      trackEvent("audio_control", {
        params: {
          action: newMutedState ? "Mute" : "Unmute",
          event_category: "Audio",
          event_label: "Background Music",
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
      {/* Mobile view - single button */}
      <div className="md:hidden">
        <button
          onClick={toggleMute}
          className={`w-8 h-8 flex items-center justify-center border-2 border-[${theme.accent}] bg-white cursor-pointer`}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
          title={isMuted ? "Unmute music" : "Mute music"}
        >
          {/* 8-bit style speaker icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="block">
            {/* Speaker body */}
            <rect x="2" y="6" width="2" height="4" fill="black" />
            <rect x="4" y="4" width="2" height="8" fill="black" />
            <rect x="6" y="2" width="2" height="12" fill="black" />

            {/* Sound waves (only show when not muted) */}
            {!isMuted && (
              <>
                <rect x="9" y="4" width="1" height="8" fill="black" />
                <rect x="11" y="2" width="1" height="12" fill="black" />
                <rect x="13" y="4" width="1" height="8" fill="black" />
              </>
            )}

            {/* X for muted (only show when muted) */}
            {isMuted && (
              <>
                <rect x="8" y="4" width="2" height="2" fill="black" />
                <rect x="10" y="6" width="2" height="2" fill="black" />
                <rect x="12" y="8" width="2" height="2" fill="black" />
                <rect x="8" y="10" width="2" height="2" fill="black" />
                <rect x="10" y="8" width="2" height="2" fill="black" />
                <rect x="12" y="6" width="2" height="2" fill="black" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Desktop view - single button */}
      <div className="hidden md:block">
        <button
          onClick={toggleMute}
          className={`w-8 h-8 flex items-center justify-center border-2 border-[${theme.accent}] bg-white hover:translate-y-[1px] transition-transform cursor-pointer`}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
          title={isMuted ? "Unmute music" : "Mute music"}
        >
          {/* 8-bit style speaker icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="block">
            {/* Speaker body */}
            <rect x="2" y="6" width="2" height="4" fill="black" />
            <rect x="4" y="4" width="2" height="8" fill="black" />
            <rect x="6" y="2" width="2" height="12" fill="black" />

            {/* Sound waves (only show when not muted) */}
            {!isMuted && (
              <>
                <rect x="9" y="4" width="1" height="8" fill="black" />
                <rect x="11" y="2" width="1" height="12" fill="black" />
                <rect x="13" y="4" width="1" height="8" fill="black" />
              </>
            )}

            {/* X for muted (only show when muted) */}
            {isMuted && (
              <>
                <rect x="8" y="4" width="2" height="2" fill="black" />
                <rect x="10" y="6" width="2" height="2" fill="black" />
                <rect x="12" y="8" width="2" height="2" fill="black" />
                <rect x="8" y="10" width="2" height="2" fill="black" />
                <rect x="10" y="8" width="2" height="2" fill="black" />
                <rect x="12" y="6" width="2" height="2" fill="black" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
