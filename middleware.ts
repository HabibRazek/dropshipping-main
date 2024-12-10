import { currentRole, currentUser } from '@/lib/auth';
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  apiCronjobPrefix,
  apiWebhookPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { useCurrentRole } from './hooks/use-current-role';
import { UserRole } from '@prisma/client';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiWbhookRoute = nextUrl.pathname.startsWith(apiWebhookPrefix)
  const isCronJobRoute = nextUrl.pathname.startsWith(apiCronjobPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);


  if (isApiAuthRoute || isApiWbhookRoute || isCronJobRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(
      // `/auth/login?callbackUrl=${encodedCallbackUrl}`,
      `/auth/login`,
      nextUrl
    ));
  }

  return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
