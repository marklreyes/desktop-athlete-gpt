import { Link } from "react-router";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
	const { isDarkMode, theme } = useTheme();
	return (
		<header className={`flex flex-col items-center gap-9 py-4 bg-[${theme.primary}] border-b`}>
			<div className="w-[500px] max-w-[100vw] flex justify-center">
				<Link to="/" className={`block border-2 border-[${theme.secondary}] p-3`}>
					{/* Visually hidden heading for screen readers */}
					<h1 className="sr-only">Desktop Athlete</h1>
					<img
						src="/logo_desktopathlete.jpg"
						alt="Desktop Athlete Logo"
						className="block max-w-xs w-auto h-16 object-contain"
					/>
				</Link>
			</div>
		</header>
	);
}
