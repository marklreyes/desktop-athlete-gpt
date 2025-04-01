import { useTheme } from "../context/ThemeContext";

export default function Footer() {
	const { isDarkMode, theme } = useTheme();
	return (
		<footer className={`w-full flex flex-col items-center gap-9 py-4 bg-[${theme.primary}]  border-t`}>
			<p>© 2025 Desktop Athlete</p>
		</footer>
	);
}
