import { Link } from "react-router";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
	const { isDarkMode, theme } = useTheme();
	return (
		<footer className={`w-full flex flex-col items-center gap-9 p-4 bg-[${theme.primary}]  text-${theme.text} border-t`}>
			<div className="container mx-auto">
				<div className="text-center">
					<p>
						<small>
							Made with 👾 by <Link className="underline font-bold" to="/about">Mark L. Reyes</Link>  | &copy; 2025 Desktop Athlete
						</small>
					</p>
				</div>
			</div>
		</footer>
	);
}
