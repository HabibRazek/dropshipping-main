import { getStoreById } from "@/actions/store.actions";
import { NewStoreForm } from "@/components/new-store-form";
import { currentUser } from "@/lib/auth";

export default async function page({
  params,
}: {
  params: { storeId: string };
}) {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const store = await getStoreById(params.storeId);

  return <NewStoreForm initialData={store} />;
}
