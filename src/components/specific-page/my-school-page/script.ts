import type { AstroCookieGetOptions, AstroCookies, AstroCookieSetOptions } from "astro";
import { $user } from "../../../atoms/user";
import { auth } from "../../../services/firebase/server";
import { setUserAtom } from "../../../atoms/user";
import { db, Users, eq, Schools, Forms, and, inArray } from "astro:db";
import { allIds, lastSchoolVisited } from "../../../constants/constants";
import type { Image } from "../../../types/global";
import type { SchoolsType, PriceBySizes, SchoolOrder, SchoolAPIResponse } from "../../../types/school";


export const getUserOrUpdateAtom = async (cookies: AstroCookies) => {
    if ($user.value) return $user.value; /* If already signed in - return user */
  
    const sessionCookie = cookies.get("session")?.value;
  
    if (!sessionCookie)
      return null; /* If dont have cookie session - return null */
    try {
      const decodedIdToken = await auth.verifySessionCookie(
        sessionCookie,
        true
      ); /* Verifies Session Cookie */
      const user = await auth.getUser(
        decodedIdToken.uid
      ); /* Google Info about User */
      const userStructure = {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
      };
  
      setUserAtom(userStructure); /* Updates AtomState */
      return userStructure; /* Return user */
    } catch (err) {
      return null;
    }
  };

// Returns single school information
export const fetchUserInfoInSchool = async (
    uid: string,
    cookies: AstroCookies,
    searchParams: string | null
): Promise<Response> => {
    if (!uid) {
        return new Response(
          JSON.stringify({ error: "No se proporcionó una UID válida" }),
          {
            status: 400,
            statusText: "Bad Request",
          }
        );
    }

    try {
        const userData = await db
        .select({ schoolId: Users.schoolID })
        .from(Users)
        .where(eq(Users.uid, uid));
        
        if (userData.length === 0) {
        return new Response(
            JSON.stringify({ 
            error: "No se ha encontrado el usuario con la UID proporcionada",
        }),
        {
            status: 404,
            statusText: "Not Found",
        }
    );
}

const userSchoolIds: number[] = userData[0].schoolId as number[];
const schoolInfo = await getUserSchoolById(userSchoolIds, searchParams, cookies);

if ("error" in schoolInfo) {
    return new Response(
        JSON.stringify({ error: schoolInfo.error }),
        {
            status: schoolInfo.status,
            statusText: schoolInfo.statusText,
        }
    );
}

const schoolSteps = await getUserSchoolsSteps(uid, schoolInfo.id);
const response: SchoolAPIResponse = {
    school: schoolInfo,
    steps: schoolSteps,
}
return new Response(
    JSON.stringify(response),
    {
        status: 200,
        statusText: "ok",
    }
);
    } catch(error){
        console.error("Error fetching school data:", error);
        return new Response(
          JSON.stringify({ error: "Error interno del servidor" }),
          {
            status: 500,
            statusText: "Internal Server Error",
          }
        );
    }

}

const getUserSchoolById = async ( userSchoolIds: number[], searchParams: string | null, cookies: AstroCookies ): Promise<SchoolsType | { error: string; status: number; statusText: string }> => {
    try {
        const idToSearch = [] // This variable will contain the school that is gonna be searched
        if(searchParams){ // If the user is looking the school by parameters
            const isAffiliated = userSchoolIds.find(id => id.toString() === searchParams);
            
            isAffiliated && idToSearch.push(searchParams)
            
            cookies.set( // Updates last school visited cookie
                lastSchoolVisited,
                searchParams
            )
        } else if (cookies.has(lastSchoolVisited)) { // If not by parameters, looks in the cookies if has last school visited
            const lastSchoolValue = cookies.get(lastSchoolVisited)?.value;
            const isAffiliated = userSchoolIds.find(id => id.toString() === lastSchoolValue);
            isAffiliated && idToSearch.push(lastSchoolValue);
        }
        // If any ID has been pushed to idToSearch, the selected ID will be the first that appears
        const finalIdToSearch = idToSearch.length > 0 ? idToSearch[0] : userSchoolIds[0];
        
        const schoolDb = await db.select().from(Schools).where(eq(Schools.id, Number(finalIdToSearch)));
        
        if (schoolDb.length === 0) {
            return {
                error: "El usuario no está afiliado a ningún colegio",
                status: 404,
                statusText: "Not Found",
            };
        }
        const school: SchoolsType = {
            id: schoolDb[0].id,
            addres: schoolDb[0].addres,
            image: schoolDb[0].image as Image,
            name: schoolDb[0].name,
            order: schoolDb[0].order as SchoolOrder,
            price: schoolDb[0].price as PriceBySizes,
        };

        return school;
} catch (error) {
    return {
        error: "Error inesperado",
        status: 500,
        statusText: "Internal Server Error",
    };
}
}

const getUserSchoolsSteps = async( uid: string, schoolId: number ) => {
    const userForm = await getUserFormById(uid, schoolId);
    const userPayment = await getUserPayment();
    const userDeliverStatus = await getUserDeliverStatus();

    return {
        formStep: userForm,
        paymentStep: userPayment,
        deliverStep: userDeliverStatus
    }
}

const getUserFormById = async (uid: string, schoolId: number): Promise<{ isCompleted: boolean, value: any | null }> => {

    const form = await db
    .select()
    .from(Forms)
    .where(and(
        eq(Forms.userUid, uid),
        eq(Forms.schoolId, schoolId)
    ))
    
    if(form.length === 0){
        return {
            isCompleted: false, value: null
        }
    }
    
    return { isCompleted: true, value: form[0] }
}
const getUserPayment = (): { isCompleted: boolean, value: any | null } => {
    
    
    
    return { isCompleted: false, value: null }
}
const getUserDeliverStatus = (): { isCompleted: boolean, value: any | null } => {

    
    
    
    return { isCompleted: false, value: null }
}


export const manageCookies = async ( // Handles the school IDS with Names linked of the user every 7 days
    cookies: AstroCookies,
    uid: string 
) => {
    const existsCookies = cookies.has(allIds);
    if(existsCookies){
        const cookie = cookies.get(allIds)?.value;
        return cookie;
    }
    try {
        const userSchools = await db.select({
            schoolId: Users.schoolID
         })
        .from(Users)
        .where(
            eq(
                Users.uid, uid
            )
        )
    if(userSchools.length === 0) return false;

    const ids = userSchools[0].schoolId as number[];

    const schoolNameById = await db.select({ 
        name: Schools.name,
        id: Schools.id
    })
    .from(Schools)
    .where(
        inArray(Schools.id, ids
        ))

    cookies.set(allIds, JSON.stringify(schoolNameById), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: true
    })
return schoolNameById;
    } catch(error){
        return false;
    }
}