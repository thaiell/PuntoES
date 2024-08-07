export const fetchPayment = async (uid: string, currentSchool?: number, lastSchoolCookie?: number): Promise<Response>  => {
    try {
      const schoolInfoRequired = await fetchSchoolRequired(uid, currentSchool, lastSchoolCookie);
      
      console.log("SchoolInfoRequired", schoolInfoRequired)
  
      if (schoolInfoRequired.status === "success") {
          const form = await getForm(uid, schoolInfoRequired.data.steps.schoolId);
          return new Response(JSON.stringify({
              payment: {},
              form: form.status === "success" ? form.data : null,
              school: schoolInfoRequired.data.school,
              steps: schoolInfoRequired.data.steps,
              user: schoolInfoRequired.data.user
          }), {
              status: 200,
              statusText: "ok"  
          })
      }
  
      return new Response(JSON.stringify({ message: "Unexpected error" }), {
        status: 404,
        statusText: "Unexpected error",
      });
    } catch (error) {
      console.error("Error fetching payment data: ", error);
      return new Response(
          JSON.stringify({ message: "Error trying to payment user data" }),
          {
            status: 404,
            statusText: "Unexpected error trying to payment user data",
          }
        );
      }
    }