import { variable } from "../shared";

export default async function requestResetToken(email) {
  try {
    const response = await fetch(
      `${variable.API_URL}/auth/create-reset-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );
    if (!response.ok) {
      console.log("Failed to request token, ", response.statusText);
      return;
    }
    await response.json();
  } catch (err) {
    console.log(err);
  }
}
