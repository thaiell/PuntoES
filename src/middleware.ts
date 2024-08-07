import { auth } from "./services/firebase/server";
import { defineMiddleware } from "astro:middleware";
import type { UserSession } from "./types/global";
import type { AuthError } from "@firebase/auth";
import { cookieRedirectPathValue, pageUrls } from "./constants/constants";

export const onRequest = defineMiddleware(async( context, next ) => {

  const protectedRoutes = [
    "/mi-escuela"
  ]
  const currentPathName = context.url.pathname;
/*   const noAuthRoutes = [
    "/iniciar-sesion",
    "/registrarse"
  ] */

  const cookies = context.cookies;

  if(!cookies.has("session")){
    console.log("doesn't have cookie")
    console.log(currentPathName)
    if(protectedRoutes.some(protectedRoute => currentPathName.startsWith(protectedRoute))){
      console.log("trying to enter a protected route")
      return context.redirect(pageUrls.signIn);
    }
    return next();
  }

/*   if(!noAuthRoutes.includes(currentPathName)){
    console.log("Esta en un no necesito auth")
    if(!cookies.has("session")) return context.redirect(pageUrls.signIn);
  } */
    
    const authSessionCookie = cookies.get("session")?.value as string;
/*   console.log(authSessionCookie) */
    try {
        const decodedIdToken = await auth.verifySessionCookie(
            authSessionCookie,
            true
          ); /* Verifies Session Cookie */
          const user = await auth.getUser(
            decodedIdToken.uid
          ); /* Google Info about User */
          const userStructure: UserSession = {
            displayName: user.displayName,
            email: user.email,
            uid: user.uid,
          }; 
          context.locals.user = userStructure;
          return next();
    } catch(error){
        console.log("Error trying to get your session: ", error);
      if(error instanceof Error){
        const errorcode = (error as AuthError).code.toString();
        switch(errorcode){
            case "auth/session-cookie-expired":
              console.log(currentPathName)
              if(context.url.pathname.includes(protectedRoutes[0])){
                context.cookies.set(cookieRedirectPathValue, currentPathName);
                console.log("Protected Page, User redirected")
                return context.redirect(pageUrls.signIn);
              }
            break;
            default:
            console.log("Default", errorcode);
            break;
        }

      }

      console.log("LLEGA A NEXT")
        return next();
    }
});