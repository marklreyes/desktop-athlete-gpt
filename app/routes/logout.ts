import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";

// Action function to handle logout POST requests
export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: "/login" });
}

// Loader function to handle logout GET requests (optional, but common)
// It's often better to use POST for actions with side effects (like logout)
// but GET can be used for convenience (e.g., a simple link).
export async function loader({ request }: LoaderFunctionArgs) {
   // If you only want to allow POST for logout, you can throw an error here
   // or redirect to the login page.
   // For this example, we'll allow GET as well.
  return await authenticator.logout(request, { redirectTo: "/login" });
}
