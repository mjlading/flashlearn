import { api } from "@/app/api/trpc/server";
import CollectionCard from "./CollectionCard";

export default async function CollectionList() {
  const collections = await api.collection.getUserCollections.query();

  return (
    <div>
      {collections.map((collection) => (
        <div key={collection.id}>
          <CollectionCard collection={collection} />
        </div>
      ))}
    </div>
  );
}
