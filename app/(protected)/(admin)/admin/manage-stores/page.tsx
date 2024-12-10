import { DataTable } from './data-table'
import { columns } from './columns'
import { getUserById } from '@/actions/user.actions';
import { currentUser } from '@/lib/auth';
import { Heading } from '@/components/ui/heading';
import { getAllStores } from '@/actions/store.actions';

const page = async () => {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }

  const user = await getUserById(sessionUser.id);

  const stores = await getAllStores();

  return (
    <>
      <div className="mb-5 mx-10">
        <Heading
          title={`Manage Stores (${stores.length})`}
          description=""
        />
      </div>

      <div className='mx-10'>
        <DataTable columns={columns} data={stores} />
      </div>
    </>
  )
}

export default page
