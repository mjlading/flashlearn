import { getDictionary } from "@/app/dictionaries/dictionaries";
import SubjectList from "@/components/SubjectList";
import { Locale } from "@/../i18n-config";

export default async function ExplorePage({params:{lang}}:{params:{lang:Locale}}) {
  
  const dict = await getDictionary(lang);

  return (
    <div className="max-w-full lg:w-[50rem]">
      <h1 className="text-4xl font-bold mb-4">{dict.explore.explore}</h1>
      <h3 className="text-muted-foreground mb-12">
        {dict.home.slogan}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <SubjectList dict={dict}/>
      </div>
    </div>
  );
}
