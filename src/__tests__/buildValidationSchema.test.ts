import { describe, it, expect } from "vitest";
import type { Form } from "@/types";
import { buildValidationSchema } from "@/util/validation";

describe("buildValidationSchema", () => {
  it("requires text and at least one checkbox when isRequired=true", async () => {
    const form: Form = {
      id: "f1",
      name: "Test",
      elements: [
        { id: "name", type: "text", label: "Name", isRequired: true },
        {
          id: "topics",
          type: "checkbox",
          label: "Topics",
          isRequired: true,
          choices: [
            { id: "tech", name: "Tech" },
            { id: "music", name: "Music" },
          ],
        },
      ],
    };
    const schema = buildValidationSchema(form);
    await expect(schema.isValid({ name: "", topics: [] })).resolves.toBe(false);
    await expect(schema.isValid({ name: "Alice", topics: ["tech"] })).resolves.toBe(true);
  });

  it("allows empty fields when isRequired=false", async () => {
    const form: Form = {
      id: "f2",
      name: "Test",
      elements: [
        { id: "bio", type: "text", label: "Bio", isRequired: false },
        {
          id: "tags",
          type: "checkbox",
          label: "Tags",
          isRequired: false,
          choices: [
            { id: "a", name: "A" },
            { id: "b", name: "B" },
          ],
        },
      ],
    };
    const schema = buildValidationSchema(form);
    await expect(schema.isValid({})).resolves.toBe(true);
  });
});