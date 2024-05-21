## Getting Started

First, install dependencies:
```bash
npm i
```
Then set up the required environment variables (provided with the submitted source code as '.env', '.env.test' and 'Cypress.env.json')

You can then run in dev mode:
```bash
npm run dev
```
Alternatively you can build the project and then run it with better performance:
```bash
npx next build
npx next
```
# Environment variables
To run project locally, add the following environment variables to .env (unless you have the .env files setup already):
- NEXTAUTH_SECRET
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- OPENAI_API_KEY
- AUTH_GOOGLE_ID
- AUTH_GOOGLE_SECRET
- GOOGLE_REFRESH_TOKEN
- ENABLE_CYPRESS_LOGIN=false #turn this on to run cypress tests
- CYPRESS_TEST_AC_ID="clwfwwqze0003wm9yx12qyrm6"
# Run in development mode
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TESTING

# Vitest

Before deployment to vercel, tests are run through github actions. 

for local testing, use 'npm run test', THIS NEEDS '.env.test' TO AIM AT TEST DATABASE, OTHERWISE IT WILL WIPE DEV DATABASE
Vitest is used for integration tests that check if trpc endpoints work the way we expect.

# Cypress

Most of our pages require some form of authentication, this is handled through using google OAuth playground.

https://docs.cypress.io/guides/end-to-end-testing/google-authentication

during testing we use the dev. database with an account that we own to run authentication tests

Add 'CYPRESS_TEST_AC_ID' with the id of the user you wish to test, and set 'ENABLE_CYPRESS_LOGIN' to 'true' within your local environment variables ('.env.local')
Add your user credentials to the variables 'GOOGLE_TEST_ACCOUNT_PWD' and 'GOOGLE_TEST_ACCOUNT_EMAIL' to the cypress environment variables ('Cypress.env.json)
