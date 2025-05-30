import { Link, Form, useRouteLoaderData } from "@remix-run/react";
import { useTheme } from "../context/ThemeContext";
import { trackEvent } from "~/utils/trackEvent";
import type { RootLoaderData, User } from "~/root"; // Assuming root.tsx exports RootLoaderData and User

export default function Header() {
    const { isDarkMode, toggleTheme, theme } = useTheme();
    const data = useRouteLoaderData<RootLoaderData>("root");
    const user: User | null = data?.user ?? null;

	return (
        <header className={`flex flex-col items-center gap-9 p-4 bg-[${theme.primary}] border-b`}>
            <div className="w-full flex justify-between items-center">
                <Link
                    to="/"
                    onClick={() => {
                        trackEvent("logo_click", {
                            params: {
                                event_category: "Navigation",
                                event_label: "Logo",
                                component: "Header Component"
                            },
                        });
                    }}
                    className={`block border-2 border-[${theme.secondary}] p-3`}
                >
                    <img
                        src="/logo_desktopathlete.jpg"
                        alt="Desktop Athlete Logo"
                        className="block max-w-xs w-auto h-16 object-contain"
                    />
                </Link>

                <div className="flex items-center gap-4"> {/* Increased gap for auth buttons */}
                    {/* Theme Controller */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isDarkMode}
                            onChange={() => {
                                toggleTheme();
                                trackEvent("theme_toggle", {
                                    params: {
                                        event_category: "User Interaction",
                                        event_label: "Theme Toggle",
                                        component: "Header Component",
                                        isDarkMode: !isDarkMode,
                                    },
                                })();
                            }}
                            aria-label="Toggle theme"
                        />
                        <div className={`
                            w-11 h-6
                            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2
                            peer-focus:ring-${isDarkMode ? theme.background : theme.background}-300
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                            after:bg-white after:border-gray-300 after:border
                            after:h-5 after:w-5 after:transition-all
                            ${isDarkMode ?
                                `${theme.background} after:translate-x-full border-${theme.accent}` :
                                `${theme.background} border-${theme.accent}`
                            }
                        `}></div>
                    </label>

                    {/* Auth Links/Buttons */}
                    {user ? (
                        <>
                            <Link to="/profile" className="text-sm font-medium hover:underline">
                                Profile ({user.email})
                            </Link>
                            <Form action="/logout" method="post">
                                <button type="submit" className="text-sm font-medium hover:underline">
                                    Logout
                                </button>
                            </Form>
                        </>
                    ) : (
                        <Link to="/login" className="text-sm font-medium hover:underline">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
