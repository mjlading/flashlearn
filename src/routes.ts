// protected paths
const protectedPaths = [
  "/dashboard/decks",
  "/dashboard/collections",
  "/dashboard/courses",
  "/dashboard/progress",
  "/decks/create",
];
// available localizations TODO: Move this to lang config
let locales: readonly string[] = ["en", "no"];
/**
 *
 * @param path string that needs to be checked against the list of protected paths
 * */
export function isProtected(path: string) {
  //console.log(path.split("/")[1])
  if (locales.includes(path.split("/")[1])) {
    //if path includes lang
    return protectedPaths.includes(path.substring(3)); // does this work?
  } else {
    return protectedPaths.includes(path);
  }
}
