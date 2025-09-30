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

describe("FormRenderer — conditional visibility", () => {
  it("shows dependent field when checkbox condition matches", async () => {
    const form: Form = {
      id: "f3",
      name: "Visibility",
      elements: [
        {
          id: "topics",
          type: "checkbox",
          label: "Topics",
          choices: [
            { id: "music", name: "Music" },
            { id: "tech", name: "Tech" },
          ],
        },
        {
          id: "musicFav",
          type: "text",
          label: "Favorite band",
          visibility: {
            op: "AND",
            conditions: [{ targetElementId: "topics", valueToMatch: "music" }],
          },
        },
      ],
    };

    renderWithTheme(<FormRenderer form={form} />);

    await expect(screen.queryByLabelText(/Favorite band/i)).toBeNull();

    const musicSwitch = screen.getByLabelText(/Music/i);
    await userEvent.click(musicSwitch);

    await expect(
      await screen.findByLabelText(/Favorite band/i)
    ).toBeInTheDocument();
  });
});
