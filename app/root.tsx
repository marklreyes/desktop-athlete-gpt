import {
  isRouteErrorResponse,
} from "react-router";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "./components/Layout";
import { authenticator } from "./auth.server"; // Adjust path as necessary

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { ThemeProvider } from "./context/ThemeContext";

// Define the type for your user object if you haven't already
// This should match or be compatible with the User type in auth.server.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  // Add any other properties your authenticator returns
}

export interface RootLoaderData {
  user: User | null;
  ENV: { [key: string]: string }; // For client-side env vars if needed
}


export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request); // Returns user or null
  // Example of exposing environment variables to the client, if needed
  const ENV = {
    GA_TRACKING_ID: process.env.VITE_GA_TRACKING_ID || "",
    // Add other client-side env vars here
  };
  return json<RootLoaderData>({ user, ENV });
}

export default function App() {
  // const { ENV } = useLoaderData<typeof loader>(); // If you need client-side ENV
  return (
		<ThemeProvider>
			{/* Pass user to Layout if Layout needs it directly, or let Header use useRouteLoaderData */}
			<Layout />
		</ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
