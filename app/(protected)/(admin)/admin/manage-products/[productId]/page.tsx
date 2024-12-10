import { ProductForm } from "@/components/product-form";
import { getProductById } from "@/actions/product.actions";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/actions/user.actions";
import { getAllCategories } from "@/actions/category.actions";
import { ProductFormAdmin } from "@/components/product-form-admin";

const ProductPage = async ({
  params
}: {
  params: { productId: string }
}) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const product = await getProductById(params.productId);

  const categories = await getAllCategories();

  
  return ( 
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-5 pt-3 w-full">
        <ProductFormAdmin
          categories={categories} 
          initialData={product}
        />
      </div>
    </div>
  );
}

export default ProductPage;