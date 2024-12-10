import { DataTable } from './data-table'
import { columns } from './columns'
import { getUserById } from '@/actions/user.actions';
import { currentUser } from '@/lib/auth';
import { Heading } from '@/components/ui/heading';
import { getAllStores } from '@/actions/store.actions';
import { getTransactions } from '@/actions/transaction.actions';

const page = async () => {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }

  const user = await getUserById(sessionUser.id);

  const transactions = await getTransactions();

  return (
    <>
      <div className="mb-5 mx-10">
        <Heading
          title={`Transactions (${transactions.length})`}
          description=""
        />
      </div>

      <div className='mx-10'>
        <DataTable columns={columns} data={transactions} />
      </div>
    </>
  )
}

export default page
