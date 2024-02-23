import CreateDeckForm from "@/app/(withNavbar)/dashboard/decks/create/CreateDeckForm";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { api } from "@/app/api/trpc/client";

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
    ai: {
      classifySubject: {
        useMutation: vi.fn(() => ({
          mutate: vi.fn(),
          isLoading: false,
        })),
      },
      generateTags: {
        useMutation: vi.fn(() => []),
      },
    },
    flashcard: {
      createAndSaveEmbeddings: {
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
  it("displays error if no flashcards added", async () => {
    render(<CreateDeckForm />);
    const nameInput = screen.getByLabelText("Navn");
    const submitButton = screen.getByRole("button", { name: "Lagre sett" });

    await userEvent.type(nameInput, "valid");
    userEvent.click(submitButton);

    expect(
      await screen.findByText("Settet må ha minst 2 studiekort")
    ).toBeDefined();
  });
  it("displays error if only one flashcard added", async () => {
    render(<CreateDeckForm />);
    const nameInput = screen.getByLabelText("Navn");
    const submitButton = screen.getByRole("button", { name: "Lagre sett" });
    const flashcardFront = screen.getByPlaceholderText("Fremside");
    const flashcardBack = screen.getByPlaceholderText("Bakside");

    await userEvent.type(nameInput, "valid");
    await userEvent.type(flashcardFront, "valid front");
    await userEvent.type(flashcardBack, "valid back");
    userEvent.click(submitButton);

    expect(
      await screen.findByText("Settet må ha minst 2 studiekort")
    ).toBeDefined();
  });
  it("calls createDeck mutation if inputs are valid", async () => {
    const { useMutation } = api.deck.createDeck;
    render(<CreateDeckForm />);
    const nameInput = screen.getByLabelText("Navn");
    const submitButton = screen.getByRole("button", { name: "Lagre sett" });
    const flashcardFront = screen.getByPlaceholderText("Fremside");
    const flashcardBack = screen.getByPlaceholderText("Bakside");

    await userEvent.type(nameInput, "test name");

    // Enter valid flashcard 1
    await userEvent.type(flashcardFront, "valid front");
    await userEvent.type(flashcardBack, "valid back");
    // Enter valid flashcard 2
    await userEvent.tab();
    await userEvent.type(document.activeElement!, "valid front 2");
    await userEvent.tab();
    await userEvent.type(document.activeElement!, "valid back 2");

    userEvent.click(submitButton);

    expect(useMutation).toHaveBeenCalled();
  });
});
