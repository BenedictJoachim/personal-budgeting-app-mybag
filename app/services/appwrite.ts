import { Client, Account } from "appwrite";

const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject("676d3e22003aaac72a19");

const account = new Account(client);

export { client, account };