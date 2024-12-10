import { Heading } from "@/components/ui/heading";
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllSuppliers, getAllUsers } from "@/actions/user.actions";
import { UserDataTable } from "./(users-table)/data-table";
import { SupplierDataTable } from "./(suppliers-table)/data-table";
import { userColumns } from "./(users-table)/columns";
import { supplierColumns } from "./(suppliers-table)/columns";
import { currentUser } from "@/lib/auth";



const page = async () => {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return null;
  }

  const users = await getAllUsers();
  const suppliers = await getAllSuppliers();

  let title = `Users (${users.length + suppliers.length})`
  let description = "Here are all the users in the system."

  function onUsersClick() {
    title = `Users (${users.length})`
    description = "Here are all the users in the system."
  }

    function onSuppliersClick() {
        title = `Suppliers(${suppliers.length})`
        description = "Here are all the suppliers in the system."
    }

  return (
    <div className="mx-10" >
      <div className="mb-5 mt-0 pt-0">
        <Heading
          title={title}
          description={description}
        />
      </div>

      <Tabs defaultValue="sellers">
        <TabsList>
          <TabsTrigger value="sellers">SELLERS</TabsTrigger>
          <TabsTrigger value="suppliers">SUPPLIERS</TabsTrigger>
        </TabsList>
        <TabsContent value="sellers">
          <UserDataTable columns={userColumns} data={users} />
        </TabsContent>
        <TabsContent value="suppliers">
          <SupplierDataTable columns={supplierColumns} data={suppliers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default page
