import React, { ReactNode } from 'react';
import { currentRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function Layout ({ children } : { children : ReactNode} ) {
  const role = await currentRole();

  if (role !== UserRole.USER ) {
    if (role === UserRole.ADMIN ) {
      return redirect('/dashboard');
    }
    return redirect('/unauthorized');
  }

  return (
    <>
    {children}
    </>
  );
};
