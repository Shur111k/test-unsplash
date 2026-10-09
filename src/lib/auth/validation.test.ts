import { describe, expect, it } from "vitest";
import { validateCredentials } from "./validation";

function credentials(email: string, password: string) {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);
  return form;
}

describe("validateCredentials", () => {
  it("trims the email while preserving the password exactly", () => {
    expect(
      validateCredentials("register", credentials("  person@example.com  ", " secret 123 ")),
    ).toEqual({
      data: { email: "person@example.com", password: " secret 123 " },
    });
  });

  it("rejects malformed email and short registration passwords", () => {
    const result = validateCredentials("register", credentials("wrong-address", "short"));
    expect(result.errors).toEqual({
      email: "Вкажіть коректну електронну адресу.",
      password: "Пароль має містити щонайменше 8 символів.",
    });
  });

  it("does not apply the sign-up length rule to sign-in", () => {
    expect(validateCredentials("login", credentials("person@example.com", "short"))).toEqual({
      data: { email: "person@example.com", password: "short" },
    });
  });

  it("rejects file values instead of coercing them into credentials", () => {
    const form = credentials("person@example.com", "validpassword");
    form.set("password", new File(["secret"], "password.txt"));
    expect(validateCredentials("login", form).errors?.password).toBe("Вкажіть пароль.");
  });
});
