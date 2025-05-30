import { createCookieSessionStorage } from "@remix-run/node"; // Or "@remix-run/cloudflare" or another adapter

// Ensure `SESSION_SECRET` is set in your environment variables
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session", // use any name you want here
    httpOnly: true, // for security reasons, prevent client JS from accessing the cookie
    path: "/", // remember to adjust this so it's accessible for the parts of your app that need it
    sameSite: "lax", // this helps with CSRF
    secrets: [process.env.SESSION_SECRET], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// You can also export the methods individually for convenience
export const { getSession, commitSession, destroySession } = sessionStorage;
