import { Form } from "@remix-run/react";

export default function LogoutButton() {
  return (
    <Form method="post" action="/logout">
      <button type="submit" className="bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </Form>
  );
}
