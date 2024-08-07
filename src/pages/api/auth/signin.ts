import { type APIRoute } from "astro";
import { auth } from "../../../services/firebase/server";
import { cookieRedirectPathValue } from "../../../constants/constants"; /* Verificar si lo termino dejando o no */
// import { getAuth } from "firebase-admin/auth";

export const GET: APIRoute = async ({request, cookies, redirect  }) => {
    // const auth = getAuth(app)
    const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
    
    if(!idToken){
        return new Response(
            "No token found",
            { status: 401 }
        );
    }

    let sessionCookie;
    try {
        
        await auth.verifyIdToken(idToken)
        
        const fiveDays = 60 * 60 * 24 * 5 * 1000
        
        sessionCookie = await auth
      .createSessionCookie(idToken, { expiresIn: fiveDays })
      .catch((error) => {
        return new Response(
          JSON.stringify({
            message: error.message,
          }),
          { status: 401 }
        );
      });



    } catch (error: any) {
      console.log("sign in error: ", error)
        return new Response(
          JSON.stringify({
            error: "El servidor canceló la solicitud",
          }),
          { status: 401 }
        );
      }
    
    cookies.set("session", sessionCookie, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 5 * 1000, 
        secure: true
    })
    
    if(cookies.has("destPath")){
      const path: string | undefined = cookies.get("destPath")?.value
      path ? redirect(path) : undefined;
    }

    const path = cookies.get(cookieRedirectPathValue)
    if(path){

      cookies.delete(cookieRedirectPathValue)
      return redirect(path.value)
    }

    return redirect("/")
}