import React from 'react';

import { getAllCategories } from '@/actions/category.actions';
import { currentUser } from '@/lib/auth';
import { getUserById } from '@/actions/user.actions';
import { Heading } from '@/components/ui/heading';
import { DataTable } from './data-table';
import { categoryColumns } from './columns';

const CategoryPage = async () => {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }

  const user = await getUserById(sessionUser.id);

  const categories = await getAllCategories();

  return (
    <>
      <div className="mb-5 mx-10">
        <Heading
          title={`Categories (${categories.length})`}
          description=""
        />
      </div>

      <div className='mx-10'>
        <DataTable columns={categoryColumns} data={categories} />
      </div>
    </>
  );
};

export default CategoryPage;
