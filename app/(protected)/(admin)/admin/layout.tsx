import React, { ReactNode } from 'react';
import { currentRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: ReactNode }) {
  const role = await currentRole();
  
  if (role !== UserRole.ADMIN ) {
    return redirect('/unauthorized');
  }

  return (
    <>
      <div className='max-w-[3000px]'>
        {children}
      </div>
    </>
  );
};

