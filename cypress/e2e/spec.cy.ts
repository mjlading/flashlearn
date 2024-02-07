describe("auth flow test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("login button is showing in home page when unauthenticated", () => {
    cy.contains("Logg inn");
  });

  it("navigates to login screen when clicking login button", () => {
    cy.contains("Logg inn").click().url().should("include", "/auth/signIn");
  });
});

describe("middleware test", () => {
  it("should redirect to login page when accessing dashboard", () => {
    cy.visit("/dashboard").url().should("include", "auth/signIn");
  });

  it("should redirect to login page when accessing page within dashboard", () => {
    cy.visit("/dashboard/decks/create").url().should("include", "auth/signIn");
  });
});
