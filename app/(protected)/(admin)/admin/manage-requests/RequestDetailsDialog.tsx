import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { PiFolderNotchOpenDuotone } from "react-icons/pi";
import ImageNext from "next/image";
import { Image, Prisma } from "@prisma/client";
import { formatDate, formatPrice } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllProductRequests } from "@/actions/request.actions";

interface RequestsProps {
  request: Awaited<ReturnType<typeof getAllProductRequests>>[0];
}


const RequestDetailsDialog: React.FC<RequestsProps> = ({
  request,
}) => {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <PiFolderNotchOpenDuotone className="h-5 w-5" />
      </DialogTrigger>
      <DialogContent className="min-w-[80%] h-[90%] ">
        <ScrollArea className="h-auto">
          <DialogHeader className="text-black p-2 rounded-t-md">
            <DialogTitle className="text-xl font-bold mb-6">
              Request Details
            </DialogTitle>
          </DialogHeader>
          <Table className="mb-5 border">
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">
                  Product Name
                </TableCell>
                <TableCell>
                  {request?.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">
                  Description
                </TableCell>
                <TableCell>
                  {request?.description}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">
                  Type
                </TableCell>
                <TableCell>
                  {request?.type}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">
                  Price
                </TableCell>
                <TableCell>
                  {formatPrice(Number(request?.price))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">
                  Quantity
                </TableCell>
                <TableCell>
                  {request?.approvisionment?.quantity}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">
                  Supplier Name
                </TableCell>
                <TableCell>
                  {request?.supplier?.user.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">
                  Supplier Phone
                </TableCell>
                <TableCell>
                  {request?.supplier?.user?.phoneNumber}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">
                  Approvisionment Date
                </TableCell>
                <TableCell>
                  {formatDate(
                    request.approvisionment?.approvisionment || new Date()
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {request.images && request.images.length > 0 && (
            <Carousel className="mx-auto w-full">
              <CarouselContent className="flex justify-center">
                {request.images.map((image: Image) => (
                  <CarouselItem key={image.id} className="flex justify-center">
                    <Card>
                      <CardContent className="relative w-full p-0">
                        <ImageNext
                          src={image.url || ""}
                          alt={request?.name || ""}
                          width={400}
                          height={500}
                          className="object-cover w-full h-full transition-transform transform group-hover:scale-110 rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 z-10" />
              <CarouselNext className="absolute right-0 z-10" />
            </Carousel>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default RequestDetailsDialog;

