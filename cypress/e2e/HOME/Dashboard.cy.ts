describe("Dashboard flow tests", () => {
  const env = Cypress.env()
  if (
    !env.AUTH_GOOGLE_ID ||
    !env.AUTH_GOOGLE_SECRET ||
    !env.GOOGLE_REFRESH_TOKEN ||
    !env.GOOGLE_TEST_ACCOUNT_EMAIL ||
    !env.GOOGLE_TEST_ACCOUNT_PWD
  )
      throw new TypeError("Missing Google auth environment variables")
      
  Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
  })
  beforeEach("Signing in to google test account", ()=>{
      
      cy.log('Creating session')
      cy.visit("/en/auth/signIn/cypress")
      .get('input[type="email"').type(Cypress.env().GOOGLE_TEST_ACCOUNT_EMAIL)
      .get('input[type="password"').type(Cypress.env().GOOGLE_TEST_ACCOUNT_PWD)
      .get('[data-cy="signinbutton"').click().wait(2000)
      .visit('/')
      //.visit("/dashboard").wait(2000).url().should('include', '/dashboard')
  })
  describe("dropdown", ()=>{

    beforeEach(() => {
      cy.visit("/dashboard");
    });
    it("Sidebar is visible", () => {
      cy.get('[data-cy="dashboardlinks"]').should('be.visible');
    });
    it("Dashboard button is visible on the sidebar", () => {
      cy.get('[data-cy="dashboardlinks"]').contains('Dashboard').should('be.visible');
    });
    it("Flashcards button is visible on the sidebar", () => {
      cy.get('[data-cy="dashboardlinks"]').contains('Flashcards').should('be.visible');
    });
    it("Collections button is visible on the sidebar", () => {
      cy.get('[data-cy="dashboardlinks"]').contains('Collections').should('be.visible');
    });
    it("Courses button is visible on the sidebar", () => {
      cy.get('[data-cy="dashboardlinks"]').contains('Courses').should('be.visible');
    });
    it("Progress button is visible on the sidebar", () => {
      cy.get('[data-cy="dashboardlinks"]').contains('Progress').should('be.visible');
    });
  });
});
  