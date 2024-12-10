import { DataTable } from './data-table'
import { columns } from './columns'
import { getAllProducts } from '@/actions/product.actions';
import { getUserById } from '@/actions/user.actions';
import { currentUser } from '@/lib/auth';
import { Heading } from '@/components/ui/heading';

const page = async () => {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }

  const user = await getUserById(sessionUser.id);

  const products = await getAllProducts();

  return (
    <>
      <div className="mb-5 mx-10">
        <Heading
          title={`Manage Products (${products.length})`}
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
