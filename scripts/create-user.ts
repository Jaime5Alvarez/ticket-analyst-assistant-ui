process.env.AUTH_PROVISIONING_MODE = "true";

import { auth } from "../lib/auth";

type CreateUserInput = {
  email: string;
  password: string;
  name: string;
};

function ask(promptLabel: string): string {
  const value = prompt(promptLabel)?.trim();
  if (!value) {
    throw new Error(`Missing required value: ${promptLabel}`);
  }
  return value;
}

function collectUserInput(): CreateUserInput {
  const name = ask("Nombre del usuario:");
  const email = ask("Email del usuario:");
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }

  const password = ask("Contraseña temporal:");
  const confirmPassword = ask("Repite la contraseña temporal:");
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  return { email, name, password };
}

async function main() {
  const { email, password, name } = collectUserInput();

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (!result?.user?.id) {
    throw new Error("User could not be created");
  }

  console.log(`User created: ${result.user.email} (id: ${result.user.id})`);
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unexpected create user error";
  console.error(message);
  process.exit(1);
});
