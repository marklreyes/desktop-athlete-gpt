import type { Route } from "./+types/home";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router";

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

  return (
    <div
      className="flex flex-col items-center px-4 py-8"
      style={{ minHeight: 'calc(100vh - 57px - 157px)' }}
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
				Hi, I'm Mark, Frontend Engineer with 18 years working with Engineering, Product, Creative & Marketing Teams.
                </p>
                <p>
				Described by past teammates as a <em>quick study</em>, I'm a frontend software engineer that's in depth with the presentation layer of your web experience. I also side quest on the mic & advocate for what's important.
                </p>
              </div>

              {/* Social links with 8-bit icons */}
              <div className="flex gap-4">
                <a href="https://github.com/marklreyes" title="Check out Mark L. Reyes on GitHub" className={`inline-block border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                  <span className="font-bold text-black">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/marklreyes" title="Check out Mark L. Reyes on LinkedIn" className={`inline-block border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                  <span className="font-bold text-black">LinkedIn</span>
                </a>
								<a href="https://strava.app.link/rTPVMJOEdSb" title="Check out Mark L. Reyes on Strava" className={`inline-block border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                  <span className="font-bold text-black">Strava</span>
                </a>
              </div>
            </div>
          </div>

          {/* Skills section */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold text-[${theme.secondary}] mb-4 uppercase tracking-wider inline-block border-b-4 border-[${theme.accent}]`}>
              Skills & Tech
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {["TypeScript", "Netlify", "React Router", "Node.js", "Tailwind CSS", "OpenAI", "UX Design", "Fitness"].map((skill) => (
                <div
                  key={skill}
                  className={`p-2 border-2 border-[${theme.accent}] bg-white text-black text-center
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-1 transition-transform`}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Project Background */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold text-[${theme.secondary}] mb-4 uppercase tracking-wider inline-block border-b-4 border-[${theme.accent}]`}>
              About Desktop Athlete
            </h2>
            <div className={`p-4 border-2 border-[${theme.accent}] bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}>
              <p className="mb-3">
                Desktop Athlete was created in the throes of a hardship we all shared, lockdown due to COVID-19. Since gyms, public parks and beaches were essentially off limits in my area, this portion of my <em>multiverse</em> came about as a way for me to keep sane during such difficult times. I held onto this idea even after <em>the blip</em> ended because I felt compelled to turn this negative into a positive.
              </p>
              <p className="mb-3">
			  	This AI Assistant is designed to help people incorporate fitness into their busy lives. The suggestions procured are done by me and is essentially a compiled list of YouTube workouts that I've done multiple times over (and still continue to do so). Don't believe me? Add me on Strava.
			  </p>
              <p>
                Combined with modern AI technology provided by OpenAI, my hope is to provide practical fitness knowledge to create accessible workouts that anyone can do, anywhere. As I discover more workouts that I feel are worthy of being added to the list, I will update the app. I also plan to add more features in the future, so stay tuned!
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className={`text-2xl font-bold text-[${theme.secondary}] mb-4 uppercase tracking-wider inline-block border-b-4 border-[${theme.accent}]`}>
              Get In Touch
            </h2>
            <div className={`p-4 border-2 border-[${theme.accent}] bg-white`}>
              <p className="mb-3 text-black">
                Have questions, suggestions, or just want to say hello?
              </p>
              <p className="mb-3 text-black">
                Reach out at: <span className="font-bold">mr@marklreyes.com</span>
              </p>

              <Link
                to="/chat"
								onClick={() => {
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
