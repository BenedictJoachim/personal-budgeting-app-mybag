import { useLoaderData } from "@remix-run/react";
import { User } from "~/types/data-types";
import { requireUserSession } from "~/utils/auth";

export async function loader() {
    const user = await requireUserSession();
    return user;
}

export default function Dashboard() {
    const user = useLoaderData<User>();

    return <h1>Welcome, {user.name}</h1>
}