import { useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { User } from "~/types/data-types";
import { requireUserSession } from "~/utils/auth";

export async function loader() {
    const user = await requireUserSession();
    return user;
}
function Dashboard() {
    const user = useLoaderData<User>();

    return <h1>Welcome, {user.name}</h1>
}

export default function Index() {
    return (
        <Suspense>
            <Dashboard />
        </Suspense>
    )
}