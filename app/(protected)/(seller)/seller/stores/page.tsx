import {
  getPaginatedStoresBySellerId,
  getStoreWebhookStatus,
} from "@/actions/store.actions";
import PaginationStoresSection from "@/components/pagination-stores";
import NoStore from "@/components/store/no-store";
import { InputWithButton } from "@/components/store/search-input";
import StoreCard from "@/components/store/store-card";
import { Heading } from "@/components/ui/heading";
import { currentUser } from "@/lib/auth";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sessionUser = await currentUser();

  if (!sessionUser) return null;

  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

  const limit =
    typeof searchParams.limit === "string" ? Number(searchParams.limit) : 6;

  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const { stores, totalPages } = await getPaginatedStoresBySellerId({
    sellerId: sessionUser?.id,
    page,
    limit,
    query: search,
  });

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="mb-5 mt-0 pt-0 flex-grow">
        <div>
          <Heading
            title={`Stores (${stores?.length})`}
            description="Here are the stores you have created. You can create a new store."
          />
        </div>
        <InputWithButton search={search} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {stores?.map(async (store) => {
            const webhookStatus = await getStoreWebhookStatus(store?.id!);
            return (
              <div key={store.id}>
                <StoreCard
                  store={store}
                  webhookStatus={webhookStatus?.status}
                />
              </div>
            );
          })}
        </div>

        {stores?.length === 0 && (
          <div className="flex items-center justify-center mt-[200px]">
            <NoStore />
          </div>
        )}
      </div>
      {/* Pagination Section */}
      {stores?.length !== 0 && (
        <div className="mt-auto p-4">
          <PaginationStoresSection totalPages={totalPages ? totalPages : 1} />
        </div>
      )}
    </div>
  );
}
