import { faker, simpleFaker } from "@faker-js/faker";
import { customAlphabet, urlAlphabet } from "nanoid";

const createRandomUsers = ( quantityOfObjects: number, schoolsIds: number[] ) => {
    const allObjects = [];
    for (let i = 0; i < quantityOfObjects; i++) {
      allObjects.push({
        uid: `user${i + 1}`,
        name: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.string.numeric({length: { min: 10, max: 10 }}).toString(),
        schoolID: faker.helpers.arrayElements(schoolsIds, { min: 1, max: 3 }),
        role: 'user',
        steps: [{
          schoolId: faker.helpers.arrayElement(schoolIds),
          form: faker.datatype.boolean(),
          payment: faker.datatype.boolean(),
          delivered: faker.datatype.boolean()
        }],
        dni: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
      });
    }
    return allObjects;
  };

// Generador de Escuelas
const createRandomSchools = (schoolIds: number[]) => {
  return schoolIds.map((id) => {
    return {
      id: id,
      name: faker.company.name(),
      addres: faker.location.direction(),
      price: {
        shirt: { 
          "XS": simpleFaker.number.int({ min: 50, max: 100 }), 
          "S": simpleFaker.number.int({ min: 50, max: 100 }), 
          "M": simpleFaker.number.int({ min: 50, max: 100 }), 
          "L": simpleFaker.number.int({ min: 50, max: 100 }), 
          "XL": simpleFaker.number.int({ min: 50, max: 100 }),
          "XXL": simpleFaker.number.int({ min: 50, max: 100 })
      },
        jacket: { 
          "XS": simpleFaker.number.int({ min: 50, max: 100 }), 
          "S": simpleFaker.number.int({ min: 50, max: 100 }), 
          "M": simpleFaker.number.int({ min: 50, max: 100 }), 
          "L": simpleFaker.number.int({ min: 50, max: 100 }), 
          "XL": simpleFaker.number.int({ min: 50, max: 100 }), 
          "XXL": simpleFaker.number.int({ min: 50, max: 100 })
        }
      },
      order: {
        shirt: { 
          imgUrl: faker.image.url(), 
          imgAlt: faker.lorem.sentence()
        },
        jacket: { 
            imgUrl: faker.image.url(), 
            imgAlt: faker.lorem.sentence() 
          }
        },
        image: { 
          primary: true, 
          imgUrl: faker.image.url(),
          imgAlt: faker.lorem.sentence()
        }
    }
  })
}
  const createRandomForms = (quantityOfObjects: number, userUids: string[], schoolsIds: number[]) => {
    const allObjects = [];
    for (let i = 0; i < quantityOfObjects; i++) {
      allObjects.push({
        id: simpleFaker.number.int(),
        userUid: faker.helpers.arrayElement(userUids),
        schoolId: faker.helpers.arrayElement(schoolsIds),
        fieldName: faker.person.middleName(),
        fieldShirtSize: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL']),
        fieldShirtQuantity: faker.number.int({ min: 1, max: 5 }),
        fieldJacketSize: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL']),
        fieldJacketQuantity: faker.number.int({ min: 1, max: 5 })
      });
    }
    return allObjects;
  };

  const createRandomInvitations = ( schoolIds: number[] ) => {
    return schoolIds.map((id) => {
      const urlFriendlyIdGen = customAlphabet(urlAlphabet, 10)
      return ({
        id: simpleFaker.number.int(),
        schoolId: id,
        code: urlFriendlyIdGen(),
      })
    })
  }


  const schoolIds = [152, 187, 290, 865]
  export const schools = createRandomSchools(schoolIds);

  export const invitations = createRandomInvitations(schoolIds)

  export const users = createRandomUsers(15, schoolIds);
  const userUids = users.map(u => u.uid);
  export const forms = createRandomForms(12, userUids, schoolIds);

const adminSchools = [290, 865] /* faker.helpers.arrayElements(schoolIds) */
const formSchoolIdAdmin = faker.helpers.arrayElement(adminSchools)

  export const adminUsers = {
    uid: "p2ThnkAaxtOCj7tYXWZFfRmuxnl2",
    email: "thaielog@gmail.com",
    name: "Thaiel",
    lastname: "Ojalvo Gottau",
    phone: "1121560306",
    dni: "46917418",
    steps: [
      {
      schoolId: formSchoolIdAdmin,
      form: true,
      payment: false,
      delivered: false
    }
  ],
    schoolID: [290, 865],
    role: "admin"
  }

  export const adminForm = { 
    id: simpleFaker.number.int(), 
    userUid: 'p2ThnkAaxtOCj7tYXWZFfRmuxnl2',
    schoolId: formSchoolIdAdmin, 
    fieldName: "Thaielito Perez", 
    fieldShirtSize: 'XL', 
    fieldShirtQuantity: 2, 
    fieldJacketSize: 'S', 
    fieldJacketQuantity: 3 
  }

  const buyerUser1SchoolId = [152, 187] /* faker.helpers.arrayElements(schoolIds) */
  const formSchoolIdBuyer1 = faker.helpers.arrayElement(adminSchools)

  export const buyerUser1 = {
    uid: "lpOfqY3Mw7ZS4OD2BwsMOkBmMOr1",
    email: "thaithailog@gmail.com",
    name: "Carlitos",
    lastname: "Prada Gucci",
    phone: "1195958534",
    dni: "29038749",
    steps: [
      {
      schoolId: formSchoolIdBuyer1,
      form: true,
      payment: false,
      delivered: false
    }
  ],
    schoolID: buyerUser1SchoolId,
    role: "user"
  }
  export const buyerUser1Form = { 
    id: simpleFaker.number.int(), 
    userUid: 'lpOfqY3Mw7ZS4OD2BwsMOkBmMOr1',
    schoolId: formSchoolIdBuyer1, 
    fieldName: "Pablito Corchito", 
    fieldShirtSize: 'XS', 
    fieldShirtQuantity: 1, 
    fieldJacketSize: 'L', 
    fieldJacketQuantity: 2 
  }