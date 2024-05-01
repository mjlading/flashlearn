describe("auth flow tests", () => {
    const env = Cypress.env()
    describe("redirects when unauthorized", () => {
        beforeEach(() => {
        cy.visit("/");
        
        });

        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        })

        it("should redirect to login page when accessing dashboard", () => {
            cy.visit('/dashboard').wait(2000).url().should("include", "/auth/signIn")
        });

        it("should redirect to login page when accessing decks without being signed in", () => {
            cy.visit("/dashboard/decks").wait(2000).url().should("include", "/auth/signIn");
        });
        
        //it("should redirect to login page when accessing deck creation page without being signed in", () => {
         //   cy.visit("/decks/create").wait(2000).url().should("include", "/auth/signIn");
       // });

        it("should redirect to login page when accessing collections page without being signed in", () => {
            cy.visit("/dashboard/collections").wait(2000).url().should("include", "/auth/signIn");
        });

        //it("should redirect to login page when accessing progress page without being signed in", () => {
        //    cy.visit("/dashboard/progress").wait(2000).url().should("include", "/auth/signIn");
        //});
    })

    describe("", () => {
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
        it("Signs in", ()=>{
            cy.get('[data-cy="userDropdown"]').click().then(()=>{
                cy.getCookie('authjs.session-token').should('exist')
            })
        })

        it("should be able to access dashboard while signed in", () => {
            cy.visit('/dashboard').wait(2000).url().should("include", "/dashboard")
        });

        it("should be able to access decks while being signed in", () => {
            cy.visit("/dashboard/decks").wait(2000).url().should("include", "/dashboard/decks");
        });
        
        it("should be able to access deck creation page while being signed in", () => {
            cy.visit("/decks/create").wait(2000).url().should("include", "/decks/create");
        });

        it("should be able to access collections page while being signed in", () => {
            cy.visit("/dashboard/collections").wait(2000).url().should("include", "/dashboard/collections");
        });

        it("should be able to access progress page while being signed in", () => {
            cy.visit("/dashboard/progress").wait(2000).url().should("include", "/dashboard/progress");
        });
    })
});
  