
describe("Deck e2e tests", ()=>{
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

    it("creates and deletes a deck", ()=>{
        cy.visit('/decks/create')
        .get('[placeholder="Give your deck a name"]').type("testTitle")
        cy.get('[name="flashcards.0.front"]').type("test")
        cy.get('[name="flashcards.0.back"]').type("test")
        cy.get('[name="flashcards.1.front"]').type("test")
        cy.get('[name="flashcards.1.back"]').type("test")
        cy.contains('Save deck').click().wait(2000).then(()=>{
            cy.visit('/dashboard/decks?category=created').wait(10000)
            .get('[data-cy="deleteSetButton"]').eq(0).click()
            
        }).then(()=>{
            cy.contains('button', 'Delete deck').click().wait(2000)
        })
    })
    it("edits deck", ()=>{
        // set up deck to edit
        cy.visit('/decks/create')
        .get('[placeholder="Give your deck a name"]').type("testTitle")
        cy.get('[name="flashcards.0.front"]').type("test")
        cy.get('[name="flashcards.0.back"]').type("test")
        cy.get('[name="flashcards.1.front"]').type("test")
        cy.get('[name="flashcards.1.back"]').type("test")
        cy.contains('Save deck').click().wait(2000).then(()=>{
            // act on the deck (edit it)
            cy.visit('/dashboard/decks?category=created').wait(10000)
            .get('[data-cy="editDeckButton"]').eq(0).click()
            .get('[placeholder="Give your deck a name"]').clear().type("editedTestTitle").then(()=>{
                    cy.contains('Save deck').click().wait(2000)
                }).visit('/dashboard/decks?category=created').wait(10000)
                .contains('editedTestTitle')
            
        }).then(()=>{
            //cleanup
            cy.visit('/dashboard/decks?category=created').wait(10000)
            .get('[data-cy="deleteSetButton"]').eq(0).click()
        }).then(()=>{
            cy.contains('button', 'Delete deck').click().wait(2000)
        })
    })


})