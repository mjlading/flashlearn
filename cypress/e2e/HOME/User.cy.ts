describe("User/profile interactions", ()=> {

    const env = Cypress.env()

    describe("dropdown", ()=>{
        if (
            !env.AUTH_GOOGLE_ID ||
            !env.AUTH_GOOGLE_SECRET ||
            !env.GOOGLE_REFRESH_TOKEN
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
        })
        it("Contains nickame of user", ()=>{
            cy.get('[data-cy="userDropdown"]').click().then(()=>{
                cy.get('[data-cy="nameInDropDown"]').contains('dededed')
            })
        })
        it("Contains email of user", ()=>{
            cy.get('[data-cy="userDropdown"]').click().then(()=>{
                cy.get('[data-cy="emailInDropDown"]').contains('eggbertdestroyer@gmail.com')
            })
        })
        it("Contains user settings button", ()=>{
            cy.get('[data-cy="userDropdown"]').click().then(()=>{
                cy.get('[data-cy="userSettings"]').should('exist')
            })
        })
        it("User settings shows academic ", ()=>{
            cy.get('[data-cy="userDropdown"]').click().then(()=>{
                cy.get('[data-cy="userSettings"]').should('exist')
            })
        })
    })
})