import { usePathname } from "next/navigation";

// Custom Hook for getting the locale in client components
function useLocale() {
  const pathname = usePathname();

  const locale = pathname.split("/")[1];
  console.log("LOCALE: ", locale)
  return locale;
}

export default useLocale;
