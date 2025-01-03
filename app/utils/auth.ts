import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/services/session.server";
import { account } from "~/services/appwrite";

export async function requireUserSession(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));

    // Check if user data exists in session
    const user = session.get("user");
    if (!user) {
        throw redirect("/login");
    }

    try {
        // Verify session with Appwrite
        await account.get();
    } catch (error) {
        // If Appwrite session is invalid, clear the session
        console.error("Session verification failed:", error);
        throw redirect("/login", {
            headers: {
                "Set-Cookie": await destroySession(session),
            },
        });
    }

    return user;
}
