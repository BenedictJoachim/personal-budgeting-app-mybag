import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__mybag_session",
    secrets: ["your-secret-key"],
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export { getSession, commitSession, destroySession };
