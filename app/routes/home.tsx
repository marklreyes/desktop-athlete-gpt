import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Welcome to Desktop Athlete | AI Assistant for HIIT, Tabata, Calisthenics Workouts | DesktopAthlete.com" },
		{ name: "description", content: "Desktop Athlete, your AI assistant focused on providing you with FREE exercise programs for as little as 20 minutes." },
		{ name: "twitter:card", content: "Desktop Athlete, your AI assistant focused on providing you with FREE exercise programs for as little as 20 minutes." },
		{ property: "og:title", content: "Desktop Athlete | AI Assistant for free HIIT, Tabata, Calisthenics Workouts | DesktopAthlete.com" },
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: "https://www.desktopathlete.com/" },
		{ property: "og:description", content: "Desktop Athlete, your AI assistant focused on providing you with FREE exercise programs for as little as 20 minutes." }
	];
}

export default function Home() {
  return <Welcome />;
}
