import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { SocialsProvider } from "remix-auth-socials";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const provider = params.provider as SocialsProvider | undefined;

  if (!provider || !Object.values(SocialsProvider).includes(provider)) {
    // Handle invalid provider parameter
    // You might want to redirect to login with an error message
    console.error("Invalid provider in callback URL:", params.provider);
    return authenticator.authenticate(undefined, request, { // Authenticate with undefined will throw if not already authed
      failureRedirect: "/login?error=invalid_provider",
    });
  }

  return authenticator.authenticate(provider, request, {
    successRedirect: "/home", // Redirect to a protected route on successful authentication
    failureRedirect: "/login", // Redirect back to login page on failure
  });
}
