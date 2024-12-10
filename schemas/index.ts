import * as z from "zod";

// This is the schema for the settings form
export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
  phoneNumber: z.optional(z.string()),
  socialReason: z.optional(z.string()),
  taxRegistrationNumber: z.optional(z.string()),
  city: z.optional(z.string()),
  address: z.optional(z.string()),
  postalCode: z.optional(z.string()),
})

  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })

// This is the schema for the forgot password form
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});


// This is the schema for the forgot password form
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});


// This is the schema for the login form
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});


// This is the schema for the register form
export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }).min(3, {
    message: "Minimum 3 characters required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  address: z.string().min(1, {
    message: "Address is required",
  }).min(10, {
    message: "Minimum 10 characters required",
  }),
  city: z.string().min(1, {
    message: "City is required",
  }).min(3, {
    message: "Minimum 3 characters required",
  }),
  postalCode: z.string().min(1, {
    message: "Postal code is required",
  }).min(4, {
    message: "Postal code must be 4 numbers",
  }).max(4, {
    message: "Postal code must be 4 numbers",
  }),
  phoneNumber: z.string()
    .min(1, { message: "Phone number is required" }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  confirmPassword: z.string().min(1, {
    message: "Confirm password is required"
  }),
})
  .refine((data) => /^\d{4}$/.test(data.postalCode), {
    message: "Postal code must be 4 numbers",
    path: ["postalCode"],
  })
  .refine((data) => /^\d{8}$/.test(data.phoneNumber), {
    message: "Phone number must be 8 numbers",
    path: ["phoneNumber"],
  })
  .refine((data) => {
    if (data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });


// This is the schema for the supplier register form
export const SupplierRegisterSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }).min(6, { message: "Minimum 6 characters required" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  socialReason: z.string().min(1, { message: "Social reason is required" }).min(3, { message: "Minimum 3 characters required" }),
  taxRegistrationNumber: z.string().min(1, { message: "Tax registration number is required" }).min(3, { message: "Minimum 3 characters required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required", }).min(4, { message: "Postal code must be 4 numbers", })
    .max(4, { message: "Postal code must be 4 numbers", }),
})
  .refine((data) => /^\d{4}$/.test(data.postalCode), {
    message: "Postal code must be 4 numbers",
    path: ["postalCode"],
  })
  .refine((data) => /^\d{8}$/.test(data.phoneNumber), {
    message: "Phone number must be 8 numbers",
    path: ["phoneNumber"],
  })

  .refine((data) => {
    if (data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }).min(3, { message: "Minimum 6 characters required" }),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  stock: z.coerce.number().positive({ message: "Quantity must be positive" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(1, { message: "Description is required" }).min(10, { message: "Minimum 10 characters required" }),
  supplierId: z.string().optional().nullable(),
  approvisionment: z.date({ required_error: "Approvisionment date is required", invalid_type_error: "Invalid approvisionment date" }).min(new Date(), { message: "Approvisionment date must be in the future" }),
}).refine((data) => {
  if (!data.images.length) {
    return false;
  }
  return true;
}
  , {
    message: "At least one image is required",
    path: ["images"]
  })



export const ProductTableSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }).min(3, { message: "Minimum 6 characters required" }),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  stock: z.coerce.number().positive({ message: "Quantity must be positive" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(1, { message: "Description is required" }).min(10, { message: "Minimum 10 characters required" }),
  supplierId: z.string().optional().nullable(),
}).refine((data) => {
  if (!data.images.length) {
    return false;
  }
  return true;
}
  , {
    message: "At least one image is required",
    path: ["images"]
  })


export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }).min(2, { message: "Minimum 2 characters required" }),
  description: z.string().min(1, { message: "Description is required" }).min(80, { message: "Minimum 80 characters required" }),
})


export const NewStoreSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .min(3, { message: "Minimum 3 characters required" }),
  link: z.string()
    .min(1, { message: "Store link is required" })
    .url({ message: "Invalid URL" })
    .refine((value) => !value.endsWith('/'), {
      message: "Store link should not end with '/'"
    })
    .refine((value) =>
      value.endsWith('.com') ||
      value.endsWith('.tn') ||
      value.endsWith('.net') ||
      value.endsWith('.fr') ||
      value.endsWith('.store'), {
      message: "Store link must end with .com, .tn, .net, .fr, or .store"
    }),
  consumerKey: z.string()
    .min(1, { message: "Consumer key is required" })
    .regex(/^(ck)_[a-f0-9]{40}$/, { message: "Invalid consumer key" }),
  consumerSecret: z.string()
    .min(1, { message: "Consumer secret is required" })
    .regex(/^(cs)_[a-f0-9]{40}$/, { message: "Invalid consumer secret" }),
});


export const SellPriceInputSchema = z.object({
  standardPrice: z.coerce.number().positive({ message: "Price must be positive" }),
}).catchall(z.coerce.number().positive({ message: "Price must be positive" }));


export const ConfirmOrderSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Adress is required'),
  country: z.optional(z.string()),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
})
  .refine((data) => /^\d{8}$/.test(data.phoneNumber), {
    message: "Phone number must be 8 numbers",
    path: ["phoneNumber"],
  })
  .refine((data) => /^\d{4}$/.test(data.postalCode), {
    message: "Invalid postal code",
    path: ["postalCode"],
  });
