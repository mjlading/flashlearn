This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TESTING

# Vitest

Before deployment to vercel, tests are run through github actions. 

for local testing, use 'npm run test', this runs tests that use the testdatabase. 
Vitest is used for integration tests that check if trpc endpoints work the way we expect.

# Cypress

Most of our pages require some form of authentication, this is handled through using google OAuth playground.

https://docs.cypress.io/guides/end-to-end-testing/google-authentication

during testing we use the dev. database with an account that we own to run authentication tests

Add 'CYPRESS_TEST_AC_ID' with the id of the user you wish to test, and set 'ENABLE_CYPRESS_LOGIN' to 'true' within your local environment variables ('.env.local')
Add your user credentials to the variables 'GOOGLE_TEST_ACCOUNT_PWD' and 'GOOGLE_TEST_ACCOUNT_EMAIL' to the cypress environment variables ('Cypress.env.json)
