import AuthButton from "@/components/AuthButton";
import { getDictionary } from '../../dictionaries/dictionaries'

export default async function Home({ params: { lang } }:{params:{lang:any}}) {
  const dict = await getDictionary(lang);
  return (
    <>
      <div className="inset-y-30 mx-auto max-w-full lg:w-[50rem]">
        <h1 className="text-4xl font-bold mb-4">{dict.home.title}</h1>
        <h3 className="text-muted-foreground mb-12">
          {dict.home.slogan}
        </h3>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <AuthButton />
        </div>
      </div>
    </>
  );
}
