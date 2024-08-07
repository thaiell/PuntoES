import { db, eq, Schools, Users } from "astro:db";
import type { InternalResponse } from "../../../types/global";
import type { UserData } from "../../../types/global";
import type { AstroCookies } from "astro";
import { lastSchoolVisited, pageUrls } from "../../../constants/constants";
import type { SchoolsType } from "../../../types/school";

interface TemporaryUserData extends Omit<UserData, 'steps'> {
  steps: UserData['steps'][];
}

// Verificates ID in searchParams or Cookie and returns the ID. If Not, returns first element in schoolIds 
// Every other call needs to verify if the user is able to enter to the id school
const chooseId = (idInParam: number, cookie: AstroCookies, schoolIds: number[]): number => { 
  if (idInParam && schoolIds.includes(idInParam)) {
    cookie.set(lastSchoolVisited, idInParam.toString());
    return idInParam;
  } else if (cookie.has(lastSchoolVisited)) {
    const cookieId = cookie.get(lastSchoolVisited)?.value;
    if (cookieId && schoolIds.includes(Number(cookieId))) {
      cookie.set(lastSchoolVisited, cookieId.toString());
      return Number(cookieId);
    }
  }
  return schoolIds[0];
};

const getUserDb = async (uid: string): Promise<InternalResponse<TemporaryUserData>> => {
  try {
    const user = await db
      .select({
        name: Users.name,
        lastname: Users.lastname,
        email: Users.email,
        dni: Users.dni,
        phone: Users.phone,
        schoolIds: Users.schoolID,
        steps: Users.steps,
      })
      .from(Users)
      .where(eq(Users.uid, uid));

    if (user.length === 0) {
      return {
        status: "error",
        message: "User not found",
      };
    }

    const cleanUserData: TemporaryUserData = {
      name: user[0].name,
      lastname: user[0].lastname,
      email: user[0].email,
      dni: user[0].dni,
      phone: user[0].phone,
      schoolIds: user[0].schoolIds as UserData["schoolIds"],
      steps: user[0].steps as UserData["steps"][],
    };

    return {
      status: "success",
      data: cleanUserData,
    };

  } catch (error) {
    console.error("Error trying to getUser: ", error);
    return {
      status: "error",
      message: "Error trying to fetch the user data...",
    };
  }
};

const getSchool = async (id: number): Promise<InternalResponse<SchoolsType>> => {
  try {
    const school = await db.select({
      name: Schools.name,
      price: Schools.price,
      order: Schools.order,
      image: Schools.image,
    }).from(Schools).where(
      eq(Schools.id, id)
    );

    if (school.length === 0) {
      return {
        status: "error",
        message: "School not found",
      };
    }

    const cleanData: SchoolsType = {
      name: school[0].name,
      image: school[0].image as SchoolsType["image"],
      order: school[0].order as SchoolsType["order"],
      price: school[0].price as SchoolsType["price"],
    };

    return {
      status: "success",
      data: cleanData,
    };

  } catch (error) {
    console.error("Unexpected error while fetching schools", error);
    return {
      status: "error",
      message: "Unexpected error",
    };
  }
};

export const activateSchoolUser = async (uid: string, idInParam: number, cookie: AstroCookies): Promise<Response> => {
  try {
    const userResponse = await getUserDb(uid);
    if (userResponse.status === "error") {
      console.log("user error")
      return new Response(JSON.stringify({ 
        message: userResponse.message,
        redirect: pageUrls.signIn 
      }), {
        status: 404,
        statusText: "User not found",
      });
    }

    const schoolIds = userResponse.data.schoolIds;
    const id = chooseId(idInParam, cookie, schoolIds);
    
    const schoolResponse = await getSchool(id);
    if (schoolResponse.status === "error") {
      console.log("school error")
      return new Response(JSON.stringify({ 
        redirect: pageUrls.my_school.default,
        message: schoolResponse.message
       }), {
        status: 404,
        statusText: "School not found",
      });
    }

    const steps = userResponse.data.steps.find((stepObj) => stepObj.schoolId === id) || {
      delivered: false,
      form: false,
      payment: false,
      schoolId: id,
    };

    return new Response(JSON.stringify({
      schoolId: id,
      user: {
        ...userResponse.data,
        steps: steps,
      },
      school: schoolResponse.data,
    }), {
      status: 200,
      statusText: "OK",
    });

  } catch (error) {
    console.error("Unexpected error in activateSchoolUser: ", error);
    return new Response(JSON.stringify({ message: "Unexpected error" }), {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};