import { redirect } from "@remix-run/react";
import { account } from "~/services/appwrite";
import { User } from "~/types/data-types";

export async function requireUserSession(): Promise<User> {
    try {
        const user = await account.get();
        return user as User;
    } catch  {
        throw redirect("/login")
    }
}