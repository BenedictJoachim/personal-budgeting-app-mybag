import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { User } from "~/types/data-types";
import { requireUserSession } from "~/utils/auth";

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireUserSession(request);
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