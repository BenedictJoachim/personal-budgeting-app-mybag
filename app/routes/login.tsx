import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect } from "@remix-run/react";
import { account } from "~/services/appwrite";

export async function action({  request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await account.createSession(email, password);
        return redirect("/dashboard");
    } catch (error: any) {
        return json({ error: error.message })
    }
}

export default function Login() {
    return (
        <Form method="post">
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" required />
            <button type="submit">Login</button>
        </Form>
    )
}