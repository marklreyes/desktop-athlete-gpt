import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
  } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from "../context/ThemeContext";
import "./Layout.css";

export function Layout() {
	const { isDarkMode, theme } = useTheme();
	return (
		<html lang="en" className={isDarkMode ? "dark" : ""}>
		<head>
		  <meta charSet="utf-8" />
		  <meta name="viewport" content="width=device-width, initial-scale=1" />
		  <Meta />
		  <Links />
		</head>
		<body className={`${theme.background} ${theme.text} transition-colors duration-200 min-h-screen`}>
		<Header />
			<main className="container mx-auto p-4 relative overflow-hidden">
				<div className={`absolute inset-0 ${theme.background} opacity-50 z-0 pixelated-bg`}
						 style={{
							 backgroundImage: 'linear-gradient(to right, transparent 50%, rgba(255,255,255,0.1) 50%)',
							 backgroundSize: '8px 8px',
							 animation: 'pixelate 3s linear infinite'
						 }}>
				</div>
				<div className="relative z-10">
					<Outlet />
				</div>
			</main>
			<Footer />
			<ScrollRestoration />
			<Scripts />
		</body>
	  </html>
	);
}
