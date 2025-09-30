import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FormRenderer } from "@/components/renderer/FormRenderer";
import type { Form } from "@/types";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);
}

describe("FormRenderer — validation", () => {
  it("shows errors for required fields and clears after fixing", async () => {
    const form: Form = {
      id: "f4",
      name: "Validation",
      elements: [
        { id: "name", type: "text", label: "Name", isRequired: true },
        {
          id: "topics",
          type: "checkbox",
          label: "Topics",
          isRequired: true,
          choices: [
            { id: "music", name: "Music" },
            { id: "tech", name: "Tech" },
          ],
        },
      ],
    };

    renderWithTheme(<FormRenderer form={form} />);

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await screen.findByText(/Required/i);
    await screen.findByText(/Select at least one/i);

    expect(
      await screen.findAllByText(/Required|Select at least one/i)
    ).toHaveLength(2);

    await userEvent.type(screen.getByLabelText(/Name/i), "Alice");
    await userEvent.click(screen.getByLabelText(/Music/i));

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.queryByText(/Required|Select at least one/i)).toBeNull();
  });
});
