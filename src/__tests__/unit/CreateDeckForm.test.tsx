import CreateDeckForm from "@/app/(withNavbar)/dashboard/decks/create/CreateDeckForm";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

// Mock trpc createDeck procedure
vi.mock("@/app/api/trpc/client", () => ({
  api: {
    deck: {
      createDeck: {
        useMutation: vi.fn(() => ({
          mutate: vi.fn(),
          isLoading: false,
        })),
      },
    },
  },
}));

describe("CreateDeckForm", () => {
  it("displays error if name too short", async () => {
    render(<CreateDeckForm />);
    const nameInput = screen.getByLabelText("Navn");
    const submitButton = screen.getByRole("button", { name: "Lagre sett" });

    await userEvent.type(nameInput, "a");
    userEvent.click(submitButton);

    expect(
      await screen.findByText("Navnet må være minst 2 tegn")
    ).toBeDefined();
  });
});
