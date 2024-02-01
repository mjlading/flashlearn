"use client";

import { expect, test, it } from "vitest";
import testProxy from "../tRPCProxyClient"
import {appRouter} from "@/server/routers/index"
test("gunnartest mirrors entered string", async () => {

    expect(await testProxy.hello.query()).toBe("Hello from tRPC!");
});

test("gunnartest mirrors entered string", async () => {
    const caller = appRouter.createCaller({session:null});
    
    expect(await caller.hello()).toBe("Hello from tRPC!");
});