import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/auth.server"; // Assuming auth.server.ts is in the app root
import { SocialsProvider } from "remix-auth-socials";

// Optional: Loader to redirect if already logged in
export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/home", // Redirect to a protected route if logged in
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const provider = formData.get("provider") as SocialsProvider | null;

  if (!provider || !Object.values(SocialsProvider).includes(provider)) {
    // Handle invalid provider or return an error response
    return new Response("Invalid provider", { status: 400 });
  }

  return authenticator.authenticate(provider, request, {
    successRedirect: "/home", // Where to redirect after successful login
    failureRedirect: "/login", // Where to redirect after failed login
  });
}

export default function LoginPage() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Login</h1>
      <p>Choose a provider to login:</p>
      <Form method="post">
        <button type="submit" name="provider" value={SocialsProvider.GOOGLE}>
          Login with Google
        </button>
      </Form>
      <br />
      <Form method="post">
        <button type="submit" name="provider" value={SocialsProvider.FACEBOOK}>
          Login with Facebook
        </button>
      </Form>
      <br />
      {/* 
        Apple login often requires more specific handling or a different UI approach,
        as it might not use a simple button redirect in the same way.
        For now, we'll include a button, but this might need refinement.
      */}
      <Form method="post">
        <button type="submit" name="provider" value={SocialsProvider.APPLE}>
          Login with Apple
        </button>
      </Form>
    </div>
  );
}
