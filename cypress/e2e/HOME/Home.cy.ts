describe("Home/landing page test", () => {
    beforeEach(() => {
      cy.visit("/");
    });
  
    it("login button is showing in home page when unauthenticated", () => {
      cy.contains("Start learning!");
    });
  
    it("navigates to login screen when clicking login button", () => {
      cy.contains("Start learning!").click().url().should("include", "/auth/signIn");
    });
  });
  
  describe("middleware test", () => {
    it("should redirect to default lang", () => {
      cy.visit("/").url().should("include", "/en");
    });
  });
  