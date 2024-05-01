import { redirect } from "next/navigation";
import { SignIn } from "./SignIn"


export default async function SignInCypress() {
    if (!process.env.ENABLE_CYPRESS_LOGIN) {
        redirect("/api/auth/signin");
        
    } else {
    return(
    <div className="flex flex-col gap-4">
        <main>
        <SignIn/>
            
        </main>
    </div>)
    }
}