describe("Dashboard flow tests", () => {
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
      cy.visit("/dashboard").url().should("include", "/en");
    });

    it("should redirect to login page when accessing dashboard", () => {
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        })
        cy.visit('/dashboard').url().should("include", "/auth/signIn")
      });
      
    //TODO: fix the authentication requirement 
    //it("should redirect to login page when accessing page within dashboard", () => {
    //  cy.visit("/decks/create").wait(2000).url().should("include", "/auth/signIn");
    //});
  });
  