import { describe, expect, it } from "vitest";
import { recoveryEmailSchema, resetPasswordSchema } from "@/lib/auth";

describe("password recovery validation", () => {
  it("trims and accepts a valid recovery email", () => {
    expect(recoveryEmailSchema.parse({ email: "  user@example.com  " })).toEqual({
      email: "user@example.com",
    });
  });

  it("rejects malformed recovery email addresses", () => {
    expect(recoveryEmailSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });

  it("requires the same minimum password length as account registration", () => {
    expect(
      resetPasswordSchema.safeParse({ password: "12345", confirmPassword: "12345" }).success,
    ).toBe(false);
    expect(
      resetPasswordSchema.safeParse({ password: "secret1", confirmPassword: "secret1" }).success,
    ).toBe(true);
  });

  it("requires the confirmation to match", () => {
    expect(
      resetPasswordSchema.safeParse({ password: "secret1", confirmPassword: "different" }).success,
    ).toBe(false);
  });
});
