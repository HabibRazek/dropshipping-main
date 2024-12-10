import { Heading } from "@/components/ui/heading";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getAllProductRequests } from '@/actions/request.actions';
import React from 'react'
import { ProductRequestStatus } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const page = async () => {
  const requests = await getAllProductRequests();

  return (
    <div className="mx-10" >
      <div className="mb-5 mt-0 pt-0">
        <Heading
          title={`Requests (${requests.filter(
            (request) => request.status === ProductRequestStatus.PENDING
          ).length
            })`}
          description="Here are all the requests from suppliers. You can approve or reject them."
        />
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">PENDING</TabsTrigger>
          <TabsTrigger value="accepted">ACCEPTED</TabsTrigger>
          <TabsTrigger value="rejected">REJECTED</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <DataTable columns={columns} data={requests.filter((request) => request.status === ProductRequestStatus.PENDING)} />
        </TabsContent>
        <TabsContent value="accepted">
          <DataTable columns={columns} data={requests.filter((request) => request.status === ProductRequestStatus.ACCEPTED)} />
        </TabsContent>
        <TabsContent value="rejected">
          <DataTable columns={columns} data={requests.filter((request) => request.status === ProductRequestStatus.REJECTED)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default page
