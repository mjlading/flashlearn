import { auth } from "@/auth";
import AuthButton from "@/components/AuthButton";
import Test from "@/components/ClientSessionTest";
import TRPCProtectedTest from "@/components/TRPCProtectedTest";
import TRPCTest from "@/components/TRPCTest";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <h1>Hello world</h1>
      <h1>Session in server component</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <br />
      <br />
      <h1>Session in client component</h1>
      <Test />
      <br />
      <br />
      <h1>tRPC Test:</h1>
      <TRPCTest />
      <br />
      <h1>tRPC Protected test:</h1>
      <TRPCProtectedTest />
      <AuthButton />
    </>
  );
}
