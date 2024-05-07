describe("User/profile interactions", ()=> {

    const env = Cypress.env()
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
    describe("dropdown", ()=>{
        
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
                cy.get('[data-cy="userSettingsButton"]').should('exist')
            })
        })
    })
    describe("User settings", ()=>{
        beforeEach("opening dropdown and entering user settings", ()=>{
            cy.get('[data-cy="userDropdown"]').click().then(()=>{
                cy.get('[data-cy="userSettingsButton"]').should('exist').click()
            })
        })
        it("Can open the user settings screen", ()=>{
            cy.get('[data-cy="userSettings"]').should('exist').contains('dededed')
        })
        it("User settings shows nickname of user", ()=>{
            cy.get('[data-cy="userSettings"]')
            .get('[data-cy="userSettingsNickname"]').contains('dededed')
        })
        it("User settings shows correct academic level", ()=>{
            cy.get('[data-cy="userSettings"]')
            .get('[data-cy="academicLevel"]').contains('Bachelor')
        })
        it("User settings allows changing academic level", ()=>{
            cy.get('[data-cy="userSettings"]')
            .get('[data-cy="academicLevel"]').click()
            .get('[data-cy="academicLevelSelector"]').contains('Master').click()
            // check if change happened
            .get('[data-cy="academicLevel"]').contains("Master") 
            //undo change
            .click().get('[data-cy="academicLevelSelector"]').contains('Bachelor').click()
            .get('[data-cy="academicLevel"]').contains("Bachelor") 
        })
    })
})