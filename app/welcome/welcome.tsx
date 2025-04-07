import { Link } from "react-router";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import "./welcome.css";
import { trackEvent } from "~/utils/trackEvent";

export function Welcome() {
	const { isDarkMode, theme } = useTheme();
  const [displayText, setDisplayText] = useState("");
  const indexRef = useRef(0);
  const fullText = "Get FREE exercise programs dedicated to YOU...the everyday Desktop Athlete!";

  useEffect(() => {
	// Reset state and index
	indexRef.current = 0;
	setDisplayText("");

	const timer = setInterval(() => {
	  if (indexRef.current < fullText.length) {
		const currentChar = fullText.charAt(indexRef.current);
		indexRef.current++;
		setDisplayText((prev) => prev + currentChar);
	  } else {
		clearInterval(timer);
	  }
	}, 50); // Speed in milliseconds

	return () => clearInterval(timer);
  }, []);

  return (
    <div
		className="flex flex-col justify-center items-center"
		style={{ minHeight: 'calc(100vh - 57px - 157px)' }}
		role="main"
		aria-label="Welcome to Desktop Athlete"
		aria-live="polite"
    >

			<div className="max-w-lg w-full space-y-6 px-4 -mt-16">
				<div className="relative h-40 m-0 overflow-hidden">
					<img
						src="/dada.png"
						alt="Desktop Athlete Character"
						className="h-28 absolute"
						style={{
							animation: "walkAnimation 15s linear infinite",
							bottom: "-11px"
						}}
					/>
				</div>
				<div className={`border border-[${theme.accent}] p-6 space-y-4 ${theme.background}`}>
					<p className="leading-6 text-white text-center">
						{displayText}
						{displayText.length < fullText.length && (
							<span className="inline-block w-0.5 h-5 bg-gray-700 dark:bg-gray-200 animate-pulse ml-0.5">
								&nbsp;
							</span>
						)}
					</p>
					<Link
						to="/chat"
						onClick={() => {
							// Track the button click event
							trackEvent("begin_workout_button", {
								params: {
									action: "Click",
									event_category: "Navigation",
									event_label: "Begin Workout",
									component: "Welcome Screen",
								},
								audioSrc: "/retro-8bit-music-logo-ni-sound-1-00-04.mp3",
								audioVolume: 0.1,
							});

							// Play audio (existing functionality)
							const audio = new Audio('/retro-8bit-music-logo-ni-sound-1-00-04.mp3');
							audio.volume = 0.1; // Set volume to 10% (adjust this value between 0-1)
							audio.play();
						}}
						className={`block text-center px-4 py-2 border-4
							border-[${theme.primary}]
							bg-[${theme.primary}]
							text-[${theme.secondary}]
							font-bold shadow-[4px_4px_0px_0px]
							shadow-[${theme.secondary}]
							hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px]
							active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
							transition-all`}
					>
						Begin Workout
					</Link>
					<div className="text-sm mt-4 text-white">
						<p>
							<strong>DISCLAIMER:</strong> Always consult with a physician before beginning any exercise program.
							If you experience any pain or discomfort, stop immediately and seek medical advice.
							The information provided is not intended as medical advice or as a substitute for professional care.
							Start slowly and listen to your body's signals.
						</p>
					</div>
				</div>
			</div>
    </div>
  );
}
