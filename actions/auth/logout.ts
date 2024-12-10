"use server";


import { signOut } from "@/auth";


export const logout = async () => {
    await signOut();
    return { redirect: { destination: "/auth/login", permanent: false}}
};
