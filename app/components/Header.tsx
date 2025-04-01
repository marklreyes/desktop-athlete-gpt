import { Link } from "react-router";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
    const { isDarkMode, toggleTheme, theme } = useTheme();

    return (
        <header className={`flex flex-col items-center gap-9 p-4 bg-[${theme.primary}] border-b`}>
            <div className="w-full flex justify-between items-center">
                <Link to="/" className={`block border-2 border-[${theme.secondary}] p-3`}>
                    {/* Visually hidden heading for screen readers */}
                    <h1 className="sr-only">Desktop Athlete</h1>
                    <img
                        src="/logo_desktopathlete.jpg"
                        alt="Desktop Athlete Logo"
                        className="block max-w-xs w-auto h-16 object-contain"
                    />
                </Link>

                {/* Simplified Theme Controller */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                        {isDarkMode ? "👾" : "🟠"}
                    </span>

                    {/* Custom toggle switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isDarkMode}
                            onChange={toggleTheme}
                            aria-label="Toggle theme"
                        />
                        <div className={`
                            w-11 h-6 rounded-full
                            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2
                            peer-focus:ring-${isDarkMode ? 'blue' : 'yellow'}-300
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                            after:bg-white after:border-gray-300 after:border
                            after:rounded-full after:h-5 after:w-5 after:transition-all
                            ${isDarkMode ?
                                'bg-blue-600 after:translate-x-full border-blue-600' :
                                'bg-yellow-400 border-yellow-400'
                            }
                        `}></div>
                    </label>
                </div>
            </div>
        </header>
    );
}
