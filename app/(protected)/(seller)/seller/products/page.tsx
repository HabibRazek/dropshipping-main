import { getProducts } from "@/actions/product.actions";
import { Heading } from "@/components/ui/heading";
import SearchInput from "@/components/search";
import ProductsCatalogue from "@/components/products-catalogue";
import PaginationSection from "@/components/pagination-products";
import NavMenu from "@/components/nav-menu";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { getAllCategories } from "@/actions/category.actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

  const limit =
    typeof searchParams.limit === "string" ? Number(searchParams.limit) : 12;

  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const categoryId =
    typeof searchParams.categoryId === "string"
      ? searchParams.categoryId
      : undefined;

  const { products, totalPages } = await getProducts({ page, limit, query: search, categoryId: categoryId });

  const categories = await getAllCategories();

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-wrap justify-between items-center  ">
        <div className="text-gray-900 p-4">
          <Heading
            title={`Catalog of Products`}
            description="Discover our trendy products at affordable prices."
          />
        <Image
          src="/assets/Vector.png"
          alt="Empty"
          width={200}
          height={200}
          className="mt-4"
        />
        </div>
        <div className="sm:w-3/12 w-12/12">
          <SearchInput search={search} />
        </div>
      </div>
        <NavMenu categories={categories}/>
        <Separator className="w-full" />

      {/* Products Catalogue */}
      <div >
        <ProductsCatalogue products={products} />

        {/* Pagination Section */}
        {products?.length !== 0 && (
          <div className="mt-auto p-4">
            <PaginationSection totalPages={totalPages ? totalPages : 1} />
          </div>
        )}
      </div>
    </div>
  );
}
