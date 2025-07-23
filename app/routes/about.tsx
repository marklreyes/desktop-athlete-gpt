import type { Route } from "./+types/home";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router";
import { trackEvent } from "~/utils/trackEvent";
import { useState, useEffect } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Store form reference before async operations
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            // Submit to our reliable custom Netlify function
            const response = await fetch("/.netlify/functions/contact-simple", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData as any).toString(),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Reset form using stored reference
                form.reset();

                setIsSubmitted(true);
                trackEvent('Contact Form', {
					params: {
						action: 'Submit',
						event_category: 'Contact',
						event_label: 'Form Submission Success',
						platform: 'Web',
						link_type: 'form',
						component: 'About Screen'
					}
				});
            } else {
                throw new Error(result.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            trackEvent('Contact Form', {
				params: {
						action: 'Submit',
						event_category: 'Contact',
						event_label: 'Form Submission Error',
						platform: 'Web',
						link_type: 'form',
						component: 'About Screen'
				}
			});
            alert('There was an error submitting the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <p className="mb-3 font-semibold">
									Mark is a Front-End Engineer, Podcast Producer, and Advocate crafting dynamic web experiences and scalable UI systems.
                </p>
                <p className="mb-3">
									He started in web marketing, but his passion for design systems, JavaScript frameworks, and tech storytelling grew into a career spanning development, digital strategy, and audio production. Today, he helps companies—from Fortune 500s to startups—deliver performant, accessible digital products that align with real goals.
                </p>
                <p className="mb-3">
									Mark developed this app to help busy individuals discover workouts that fit seamlessly into their daily routines. Driven by the belief that fitness should be accessible to all, he designed the experience to support users on their personal health journeys.
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
					className={`block text-center px-4 py-2 border-4
						border-[${theme.primary}]
						bg-[${theme.primary}]
						text-white
						font-bold shadow-[4px_4px_0px_0px]
						shadow-[${theme.secondary}]
						hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px]
						active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
						transition-all`}
					>
						Try Desktop Athlete Now!
				</Link>
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
								<span className="font-semibold">Desktop Athlete</span> was created during the global COVID-19 lockdown—a challenging period that reshaped daily routines and limited access to gyms, parks, and other fitness spaces. What began as a personal solution for staying active and mentally grounded soon evolved into a lasting project, rooted in the desire to turn adversity into opportunity.
							</p>
							<p className="mb-3">
								This AI-powered assistant curates a growing collection of accessible workout routines tailored for busy lifestyles. The recommendations—sourced over time by Mark’s wife, a dedicated fitness enthusiast—are based on YouTube workouts that Mark has personally tested and continues to use regularly. For additional insights and progress tracking, users can connect with him on Strava.
							</p>
							<p className="mb-3">
								Developed primarily with TypeScript using React Router v7, Tailwind, Netlify, and OpenAI’s modern AI tools, the platform offers practical, flexible fitness solutions that anyone can integrate into their day. As new, high-quality workouts are discovered, the app will be updated accordingly. Additional features are also in development.
							</p>
							<p className="mb-3">
								Support is always appreciated to help keep the project alive and growing.
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
              {/* Two-column layout: paragraph on left, form on right */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left column - paragraph */}
                <div className="lg:w-1/2">
                  <p className="mb-3 text-black">
                    Have questions, suggestions, issues or just want to say, <em>hello</em>? Then fill out the form below and I'll get back to you as soon as I can.
                  </p>
                </div>

                {/* Right column - contact form or success message */}
                <div className="lg:w-1/2">
                  {isSubmitted ? (
                    // Success message UI
                    <div className="space-y-4">
                      <div className={`p-4 border-2 border-[${theme.accent}] bg-green-50 text-center`}>
                        <h3 className="text-lg font-bold text-green-800 mb-2">
                          Thank You! 🎉
                        </h3>
                        <p className="text-green-700 mb-3">
                          Your message has been sent successfully! I'll get back to you as soon as I can.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsSubmitted(false)}
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
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    // Contact form UI
					<form
						name="contact"
						method="POST"
						onSubmit={handleSubmit}
						className="space-y-4"
					>
					{/* Hidden field for Netlify */}
					<input type="hidden" name="form-name" value="contact" />

					{/* Honeypot field for spam protection */}
					<div style={{ display: 'none' }}>
						<label>
							Don't fill this out if you're human:
							<input name="bot-field" />
						</label>
					</div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-black mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`w-full px-3 py-2 border-2 border-[${theme.accent}] focus:outline-none focus:ring-2 focus:ring-[${theme.primary}] text-black`}
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-black mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`w-full px-3 py-2 border-2 border-[${theme.accent}] focus:outline-none focus:ring-2 focus:ring-[${theme.primary}] text-black`}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-black mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className={`w-full px-3 py-2 border-2 border-[${theme.accent}] focus:outline-none focus:ring-2 focus:ring-[${theme.primary}] text-black resize-none`}
                        placeholder="What's on your mind?"
                        required
                      />
                    </div>

                    <button
                      type="submit"
					  disabled={isSubmitting}
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
                    	{isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
