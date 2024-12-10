"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema, SupplierRegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { UserRole } from "@prisma/client";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, phoneNumber, address, city, postalCode } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      phoneNumber,
      address,
      city,
      postalCode,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  );

  return { success: "Confirmation email sent!" };
};


export const registerSupplier = async (values: z.infer<typeof SupplierRegisterSchema>) => {
  const validatedFields = SupplierRegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, phoneNumber, socialReason, taxRegistrationNumber, address, city, postalCode } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }


  const user = await db.user.create({
    data: {
      name,
      email,
      phoneNumber,
      address,
      city,
      postalCode,
      password: hashedPassword,
      role: UserRole.SUPPLIER,
    },
  });

  const supplier = await db.supplier.create({
    data: {
      userId: user.id,
      socialReason,
      taxRegistrationNumber,
    },
    include: {
      user: true,
    },
  });
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};



