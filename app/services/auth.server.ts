import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form"; // Ensure you install this package
import { sessionStorage } from "~/services/session.server";
import { db } from "~/services/db.server";
import { verifyPassword } from "~/utils/hash";

export const authenticator = new Authenticator<string>(); // Specify the user ID type

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await db.findUserByEmail(email); // Implement `findUserByEmail` in `db.server.ts`
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    return user.id; // Return the user's ID (or another unique identifier)
  }),
  "form" // Strategy name
);
