import { getCategoryById } from "@/actions/category.actions";
import { currentUser } from "@/lib/auth";
import CategoryForm from "@/components/forms/category-form";

const CategoryPage = async ({
  params
}: {
  params: { categoryId: string }
}) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }


  const category = params.categoryId
    ? await getCategoryById(params.categoryId)
    : null;


  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-5 pt-3 w-full">
        <CategoryForm
          initialData={category}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
