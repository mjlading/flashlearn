import { getDictionary } from "@/app/dictionaries/dictionaries";
import ProfileSetupForm from "./ProfileSetupForm";
import { Locale } from "@/../i18n-config";

export default async function ProfileSetupPage({params:{lang}}:{params:{lang:Locale}}) {
  
  const dict = await getDictionary(lang);
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <main>
        <div className="bg-accent p-8 rounded-2xl shadow-sm">
          <h1 className="font-bold text-2xl leading-loose mb-4">
            {dict.profileSetupPage.beforeYouContinue}
          </h1>
          <ProfileSetupForm dict={dict}/>
        </div>
      </main>
    </div>
  );
}
