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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



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
