"use client";

import { useSession } from "next-auth/react";

export default function ClientSessionTest() {
  const { data: session, status } = useSession();

  return <>{JSON.stringify(session, null, 2)}</>;
}
