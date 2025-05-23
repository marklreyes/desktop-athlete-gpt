import type { Route } from "./+types/home";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router";
import { trackEvent } from "~/utils/trackEvent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About the Creator | Desktop Athlete  | AI Assistant for free HIIT, Tabata, Calisthenics Workouts | DesktopAthlete.com" },
    { name: "description", content: "Learn about the creator of Desktop Athlete, your AI assistant for HIIT, Tabata, and Calisthenics workouts." },
    { property: "og:title", content: "About the Creator | Desktop Athlete" },
    { property: "og:description", content: "Learn about the creator of Desktop Athlete, your AI assistant for HIIT, Tabata, and Calisthenics workouts." },
	{ property: "og:type", content: "website" },
	{ property: "og:url", content: "https://www.desktopathlete.com/about" },
  ];
}

export default function About() {
  const { theme } = useTheme();

  // Calculate years of experience dynamically based on current year
  const startYear = 2007;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startYear;

  return (
    <div
      className="flex flex-col items-center px-4 py-8"
      style={{ minHeight: 'calc(100vh - 57px - 157px)' }}
	  role="main"
	  aria-label="About the Creator"
	  aria-live="polite"
    >
      <div className={`w-full max-w-3xl border-4 border-[${theme.accent}] bg-[${theme.primary}]`}>
        {/* Header with 8-bit style banner */}
        <div className={`border-b-4 border-[${theme.accent}] p-6`}>
          <h1 className={`text-4xl font-bold text-[${theme.secondary}] uppercase tracking-wider text-center`}>
            About The Creator
          </h1>
          <div className="w-full h-2 bg-[#000000] mt-4 mb-2 relative">
            <div className="absolute left-0 top-0 w-1/3 h-2 bg-[#B4D0D1]"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            {/* 8-bit avatar placeholder */}
            <div className={`w-32 h-32 md:w-48 md:h-48 border-4 border-[${theme.accent}] bg-white self-center md:self-start`}>
						<img
							src="/desktopathlete-author.jpg"
							alt="Mark L. Reyes, Author of Desktop Athlete"
							className="h-full w-full object-contain"
						/>
            </div>

            {/* Bio info */}
            <div className="flex-1">
              <h2 className={`text-2xl font-bold text-[${theme.secondary}] mb-4 uppercase tracking-wider`}>
                Mark L. Reyes
              </h2>
              <div className={`mb-4 p-4 border-2 border-[${theme.accent}] bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}>
                <p className="mb-3">
									Hi, I'm Mark, creator of Desktop Athlete. I'm a Frontend Engineer with {yearsOfExperience} years working with Engineering, Product, Creative & Marketing Teams.
                </p>
                <p className="mb-3">
									Described by past teammates as a <em>quick study</em>, I'm generally in the trenches of the presentation layer of your web experience. I also side quest on the mic & advocate for what's important.
                </p>
				<p>
					I made this app to help busy people like you and me find workouts that fit into our daily grind. I believe that fitness should be accessible to everyone, and I hope this app helps you on your journey.
				</p>
              </div>

              {/* Social links with 8-bit icons */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
							<a href="https://marklreyes.com"
								target="_blank"
								onClick={trackEvent("social_click", {
										params: {
											action: "Click",
											event_category: "Navigation",
											event_label: "Website",
											platform: "Website",
											link_type: "profile",
											component: "About Screen"
										}
									})}
								title="Check out Mark L. Reyes on his website"
								className={`text-center border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                	  <span className="font-bold text-black">Website</span>
                </a>
                <a href="https://github.com/marklreyes"
									target="_blank"
									onClick={trackEvent("social_click", {
										params: {
											action: "Click",
											event_category: "Navigation",
											event_label: "GitHub",
											platform: "GitHub",
											link_type: "profile",
											component: "About Screen"
										}
									})}
									title="Check out Mark L. Reyes on GitHub"
									className={`text-center border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                  	<span className="font-bold text-black">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/marklreyes"
									target="_blank"
									onClick={trackEvent("social_click", {
										params: {
											action: "Click",
											event_category: "Navigation",
											event_label: "LinkedIn",
											platform: "LinkedIn",
											link_type: "profile",
											component: "About Screen"
										}
									})}
									title="Check out Mark L. Reyes on LinkedIn"
									className={`text-center border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                  	<span className="font-bold text-black">LinkedIn</span>
                </a>
								<a href="https://strava.app.link/rTPVMJOEdSb"
									target="_blank"
									onClick={trackEvent("social_click", {
										params: {
											action: "Click",
											event_category: "Navigation",
											event_label: "Strava",
											platform: "Strava",
											link_type: "profile",
											component: "About Screen"
										}
									})}
									title="Check out Mark L. Reyes on Strava"
									className={`text-center border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                  	<span className="font-bold text-black">Strava</span>
                </a>
              </div>
            </div>
          </div>

          {/* Project Background */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold text-[${theme.secondary}] mb-4 uppercase tracking-wider inline-block border-b-4 border-[${theme.accent}]`}>
              About Desktop Athlete
            </h2>
            <div className={`p-4 border-2 border-[${theme.accent}] bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}>
              <p className="mb-3">
                Desktop Athlete was created in the throes of a hardship we all shared, lockdown due to COVID-19. Since gyms, public parks and beaches were essentially off limits in my area, this portion of the <em>multiverse</em> came about as a way for me to keep sane during such difficult times. I held onto this idea even after <em>the blip</em> ended because I felt compelled to turn a negative into a positive.
              </p>
              <p className="mb-3">
					This AI Assistant is designed to help people incorporate fitness into their busy lives. The suggestions were procured over a period of time by my wife (no days off), and is essentially a compiled list of YouTube workouts that I've done multiple times over and still continue to do so to this day. Add me on Strava for more details.
				</p>
				<p className="mb-3">
                Built primarily in TypeScript through React Router v7, Tailwind, Netlify and modern AI services provided by OpenAI, my hope is to provide practical fitness programs that anyone can do, anytime, anywhere. As I discover more workouts that I feel are worthy of being added to the list, I will update the app. I also plan to add more features in the future, so stay tuned.
              </p>
			  <p className="mb-3">
			  I'd be grateful for any additional cups of coffee in order to keep this platform up and running!
			  </p>
			  <div className="flex justify-center md:justify-start">
				<a
					href="https://www.buymeacoffee.com/markreyes"
					target="_blank"
					onClick={trackEvent("social_click", {
						params: {
							platform: "Buy Me A Coffee",
							link_type: "profile",
							component: "About Screen"
						}
					})}
					className={`
						block
						border-[${theme.primary}]
						bg-[#BD5FFF]
						text-[${theme.secondary}]
						font-bold shadow-[4px_4px_0px_0px]
						hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px]
						active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
						transition-all`}
					rel="noopener noreferrer"
					title="Support Desktop Athlete by buying Mark a coffee"
				>
					<img
						src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png"
						alt="Buy Me A Coffee"
						className="h-12 w-auto max-w-[200px]"
					/>
				</a>
			</div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className={`text-2xl font-bold text-[${theme.secondary}] mb-4 uppercase tracking-wider inline-block border-b-4 border-[${theme.accent}]`}>
              Get In Touch
            </h2>
            <div className={`p-4 border-2 border-[${theme.accent}] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}>
              <p className="mb-3 text-black">
                Have questions, suggestions, issues or just want to say,
				<a href="mailto:desktopathlete@gmail.com"
								target="_blank"
								onClick={trackEvent("social_click", {
										params: {
											action: "Click",
											event_category: "Navigation",
											event_label: "Email",
											platform: "Email",
											link_type: "profile",
											component: "About Screen"
										}
									})}
								title="Check out Mark L. Reyes on his website"
								className={`text-center border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                	  <span className="font-bold text-black">Hello</span>
                </a>?
              </p>
              <p className="mb-3 text-black">

              </p>

              <Link
                to="/chat"
				onClick={() => {
					// Track the button click event
					trackEvent('try_desktop_athlete_now_button', {
						params: {
							action: "Click",
							event_category: "Navigation",
							event_label: "Try Desktop Athlete Now!",
							component: "About Screen",
						},
						audioSrc: "/retro-8bit-music-logo-ni-sound-1-00-04.mp3",
						audioVolume: 0.1,
					});
					const audio = new Audio('/retro-8bit-music-logo-ni-sound-1-00-04.mp3');
					audio.volume = 0.1; // Set volume to 10% (adjust this value between 0-1)
					audio.play();
				}}
				className={`inline-block text-center px-4 py-2 border-4
					border-[${theme.primary}]
					bg-[${theme.primary}]
					text-[${theme.secondary}]
					font-bold shadow-[4px_4px_0px_0px]
					shadow-[${theme.secondary}]
					hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px]
					active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
					transition-all`}
				>
					Try Desktop Athlete Now!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
