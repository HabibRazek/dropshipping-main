import { DataTable } from './(supplier-products-table)/data-table'
import { columns } from './(supplier-products-table)/columns'
import { getProductsBySupplierId } from '@/actions/product.actions';
import { getUserById } from '@/actions/user.actions';
import { currentUser } from '@/lib/auth';
import { Heading } from '@/components/ui/heading';

const page = async () => {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }

  const user = await getUserById(sessionUser.id);

  const products = await getProductsBySupplierId(user?.supplier?.id || '');

  return (
    <>
      <div className="mb-5 mx-10">
        <Heading
          title={`Products (${products.length})`}
          description=""
        />
      </div>

      <div className='mx-10'>
        <DataTable columns={columns} data={products} />
      </div>
    </>
  )
}

export default page
