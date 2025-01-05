import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { SessionData } from "~/types/session";

const sessionSecret = process.env.SESSION_SECRET || "default_secret_key";
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "myBag_session",
    secure: process.env.NODE_ENV === "production", // Set to true in production, false for development
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

// Create a user session and commit it to the cookie
export async function createUserSession(
  userId: string,
  name: string,
  role: string,
  email: string,
  redirectTo: string
) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  session.set("name", name);
  session.set("email", email);
  session.set("role", role);


  console.log("Session Data before commit:", {
    userId: session.get("userId"),
    name: session.get("name"),
    email: session.get("email"),
  });

  // Committing the session and redirecting the user
  const headers = {
    "Set-Cookie": await sessionStorage.commitSession(session),
  };

  console.log("Committing session with data:", {
    userId: session.get("userId"),
    name: session.get("name"),
    email: session.get("email"),
  });

  return redirect(redirectTo, { headers });
}

// Get session from request
export const getSession = (request: Request) => {
  const cookie = request.headers.get("Cookie");
  console.log("Cookies in getSession:", cookie); // Logs cookies from request headers
  return sessionStorage.getSession(cookie);
};

// Commit the session
export const commitSession = (session: any) => {
  return sessionStorage.commitSession(session);
};

// Retrieve the user session from the request
export async function getUserSession(request: Request): Promise<SessionData | null> {
  try {
    const cookie = request.headers.get("Cookie");
    if (!cookie) {
      console.log("No cookie found in request.");
      return null;
    }

    const session = await sessionStorage.getSession(cookie);
    if (!session) {
      console.log("No session data found.");
      return null;
    }

    const userId = session.get("userId");
    const name = session.get("name");
    const email = session.get("email");
    const role = session.get("role");

    console.log("Retrieved session data:", { userId, name, email, role });

    if (typeof userId === "string" && typeof name === "string" && typeof email === "string" && typeof role === "string") {
      return { userId, name, email, role };
    }

    console.log("Session data incomplete or invalid.");
    return null;
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
}

// Destroy the session (logout)
export const destroySession = (session: any) => {
  return sessionStorage.destroySession(session);
};

export async function logout(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
