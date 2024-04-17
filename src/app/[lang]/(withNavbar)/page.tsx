import AuthButton from "@/components/AuthButton";


export default async function Home({ params: { lang } }:{params:{lang:any}}) {
  console.log(lang);
  return (
    <>
      <div className="inset-y-30 mx-auto max-w-full lg:w-[50rem]">
        <h1 className="text-4xl font-bold mb-4">Flashlearn</h1>
        <h3 className="text-muted-foreground mb-12">
          Oppdag noe nytt å lære - la nysgjerrigheten lede veien!
        </h3>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <AuthButton />
        </div>
      </div>
    </>
  );
}
