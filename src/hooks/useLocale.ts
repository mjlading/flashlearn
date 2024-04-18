import { usePathname } from "next/navigation";

// Custom Hook for getting the locale in client components
function useLocale() {
  const pathname = usePathname();

  const locale = pathname.split("/")[1];

  return locale;
}

export default useLocale;
