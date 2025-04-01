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
            <div className="absolute left-0 top-0 w-1/3 h-2 bg-[#00FF00]"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            {/* 8-bit avatar placeholder */}
            <div className={`w-32 h-32 md:w-48 md:h-48 border-4 border-[${theme.accent}] bg-white self-center md:self-start`}>
              <div className="h-full w-full grid grid-cols-8 grid-rows-8">
                {/* Placeholder for pixel art avatar - will be replaced with actual image */}
                {Array(64).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className={`${
                      [12, 13, 20, 21, 28, 29, 36, 37].includes(i) ? 'bg-black' :
                      [18, 19, 22, 23, 26, 27, 34, 35].includes(i) ? 'bg-[#01F1FC]' : 'bg-white'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Bio info */}
            <div className="flex-1">
              <h2 className={`text-2xl font-bold text-[${theme.secondary}] mb-4 uppercase tracking-wider`}>
                Developer Name
              </h2>
              <div className={`mb-4 p-4 border-2 border-[${theme.accent}] bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}>
                <p className="mb-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at lacus consectetur, sagittis nisi vel,
                  viverra nisi. Aliquam erat volutpat. Praesent malesuada urna nisi, quis volutpat erat hendrerit non.
                </p>
                <p>
                  Phasellus eget enim eu lectus faucibus vestibulum. Suspendisse sodales pellentesque elementum.
                </p>
              </div>

              {/* Social links with 8-bit icons */}
              <div className="flex gap-4">
                <a href="#" className={`inline-block border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                  <span className="font-bold text-black">GitHub</span>
                </a>
                <a href="#" className={`inline-block border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                  <span className="font-bold text-black">Twitter</span>
                </a>
                <a href="#" className={`inline-block border-2 border-[${theme.accent}] p-2 bg-white hover:translate-y-1 transition-transform`}>
                  <span className="font-bold text-black">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Skills section */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold text-[${theme.secondary}] mb-4 uppercase tracking-wider inline-block border-b-4 border-[${theme.accent}]`}>
              Skills & Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {["JavaScript", "TypeScript", "React", "Node.js", "Tailwind CSS", "AI", "UX Design", "Fitness"].map((skill) => (
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
                Desktop Athlete was created to help people incorporate fitness into their busy lives.
                The idea came from [your inspiration story here].
              </p>
              <p>
                The application combines modern AI technology with practical fitness knowledge to create
                accessible workouts that anyone can do, anywhere.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className={`text-2xl font-bold text-[${theme.secondary}] mb-4 uppercase tracking-wider inline-block border-b-4 border-[${theme.accent}]`}>
              Get In Touch
            </h2>
            <div className={`p-4 border-2 border-[${theme.accent}] bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}>
              <p className="mb-3">
                Have questions, suggestions, or just want to say hello?
              </p>
              <p className="mb-4">
                Reach out at: <span className="font-bold">contact@example.com</span>
              </p>

              <Link
                to="/chat"
                className={`inline-block px-6 py-3 border-4
                  border-black
                  bg-[${theme.secondary}]
                  text-black
                  font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
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
