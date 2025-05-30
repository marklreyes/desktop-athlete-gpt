import { Authenticator } from "remix-auth";
import { SocialsProvider, GoogleStrategy, FacebookStrategy, AppleStrategy } from "remix-auth-socials";
import { sessionStorage } from "./session.server"; // Assuming you have a session storage utility

interface User {
  id: string;
  email: string;
  name?: string;
  // Add any other user properties you need
}

export const authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "sessionKey", // replace this with your actual session key
  sessionErrorKey: "sessionErrorKey", // replace this with your actual session error key
});

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.AUTH_CALLBACK_BASE_URL}/auth/${SocialsProvider.GOOGLE}/callback`, // Adjust callback URL as needed
    },
    async ({ profile }) => {
      // Here you would typically find or create a user in your database
      // For this example, we'll just return a simplified user object
      return {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      };
    }
  )
);

authenticator.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: `${process.env.AUTH_CALLBACK_BASE_URL}/auth/${SocialsProvider.FACEBOOK}/callback`, // Adjust callback URL as needed
    },
    async ({ profile })
    ) => {
      // Here you would typically find or create a user in your database
      // For this example, we'll just return a simplified user object
      return {
        id: profile.id,
        email: profile.emails[0].value, // May need to adjust based on Facebook's profile structure
        name: profile.displayName,
      };
    }
  )
);

authenticator.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!, // This will be your Apple client secret
      callbackURL: `${process.env.AUTH_CALLBACK_BASE_URL}/auth/${SocialsProvider.APPLE}/callback`, // Adjust callback URL as needed
      scope: "name email", // Request name and email from Apple
      // You might need to provide a private key or other specific Apple configurations
    },
    async ({ profile }) => {
      // Here you would typically find or create a user in your database
      // For this example, we'll just return a simplified user object
      // Apple's profile structure might differ, adjust accordingly
      return {
        id: profile.id, // This might be `profile.sub` for Apple
        email: profile.email!, // Ensure email is requested and provided
        name: profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : undefined,
      };
    }
  )
);
