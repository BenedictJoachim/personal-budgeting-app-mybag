import { Form, json } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { account } from "~/services/appwrite";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const user = await account.create("unique()", email,password,name);
    } catch (error: any) {
        return json({ error: error.message });
    }
}

export default function Register() {
    return (
        <Form method="post">
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" required />
            <button type="submit">Sign Up</button>
        </Form>
    );
};