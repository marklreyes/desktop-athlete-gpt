import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server"; // Adjust path if auth.server.ts is elsewhere

// Define the User type based on what your authenticator returns
// This should match the User interface in auth.server.ts
interface User {
  id: string;
  email: string;
  name?: string;
  // Add any other user properties your strategies return and you store
}

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is not authenticated, redirect to /login
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  // If authenticated, return the user data
  return json({ user });
}

export default function ProfilePage() {
  const { user } = useLoaderData<{ user: User }>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.name && (
            <p>
              <strong>Name:</strong> {user.name}
            </p>
          )}
          {/* Add other user information you want to display */}
        </div>
      ) : (
        <p>Could not load user information.</p>
      )}
      {/* You might want to add a logout button here or in a shared header */}
      {/* <Form method="post" action="/logout">
            <button type="submit">Logout</button>
          </Form> */}
    </div>
  );
}
