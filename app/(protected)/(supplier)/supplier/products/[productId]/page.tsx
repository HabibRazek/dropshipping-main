import { db } from "@/lib/db";
import { ProductForm } from "@/components/product-form";
import { get } from "http";
import { getProductById } from "@/actions/product.actions";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/actions/user.actions";
import { getAllCategories } from "@/actions/category.actions";

const ProductPage = async ({
  params
}: {
  params: { productId: string }
}) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const databaseuser = await getUserById(user.id);

  const product = await getProductById(params.productId);

  const categories = await getAllCategories();

  
  return ( 
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-5 pt-3 w-full">
        <ProductForm 
          categories={categories} 
          initialData={product}
          supplierId={databaseuser?.supplier?.id || ""}
        />
      </div>
    </div>
  );
}

export default ProductPage;