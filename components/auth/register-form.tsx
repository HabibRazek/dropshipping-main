"use client";

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FaUser, FaBoxes } from "react-icons/fa";
import Image from "next/image";
import RegisterFormSeller from "./register-form-seller";
import RegisterFormSupplier from "./register-form-supplier";

export const RegisterForm = () => {
  const [value, setValue] = React.useState('seller');

  return (
    
    <div className="flex w-8/12 mx-auto">
      <Image
        src="/assets/img.svg"
        width={500}
        height={500}
        alt="Picture of the author"
        className="max-w-full h-auto hidden sm:block"
        priority
      />
      <CardWrapper
        headerTitle="Create an account"
        headerLabel="Create an account"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial={value === 'seller'}
      >
        <Tabs value={value} onValueChange={setValue} defaultValue="seller">
          <TabsList className="flex bg-transparent justify-center gap-4 mx-auto py-2">
            <TabsTrigger value="seller" className="px-4 py-2 text-base font-medium rounded-sm text-gray-900 mx-4">
              <FaUser className="mx-2" /> Seller
            </TabsTrigger>
            <TabsTrigger value="supplier" className="px-4 py-2 text-base font-medium rounded-sm text-gray-900 mx-4">
              <FaBoxes className="mx-2" /> Supplier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seller">
            <RegisterFormSeller />
          </TabsContent>
          <TabsContent value="supplier">
            <RegisterFormSupplier />
          </TabsContent>
        </Tabs>
      </CardWrapper>
    </div>
  );
};

