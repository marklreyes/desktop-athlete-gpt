import { Link } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { trackEvent } from "~/utils/trackEvent";

export default function Footer() {
	const { isDarkMode, theme } = useTheme();
	return (
		<footer className={`w-full flex flex-col items-center gap-9 p-4 bg-[${theme.primary}]  text-${theme.text} border-t`}>
			<div className="container mx-auto">
				<div className="text-center">
					<p>
						<small>
							Made with 👾 by <Link to="/about"
							className="underline font-bold"
							onClick={() => {
								// Track event for text click
								trackEvent("footer_click", {
									params: {
										event_category: "Navigation",
										event_label: "Mark L. Reyes",
										component: "Footer Component"
									},
								});
							}}
							> Mark L. Reyes</Link>  | &copy; 2025 Desktop Athlete
						</small>
					</p>
				</div>
			</div>
		</footer>
	);
}
