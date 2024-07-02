import { faker, simpleFaker } from "@faker-js/faker";

const createRandomUsers = ( quantityOfObjects: number, schoolsIds: number[] ) => {
    const allObjects = [];
    for (let i = 0; i < quantityOfObjects; i++) {
      allObjects.push({
        uid: `user${i + 1}`,
        name: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.string.numeric({length: { min: 10, max: 10 }}),
        schoolID: faker.helpers.arrayElements(schoolsIds, { min: 1, max: 3 }),
        role: 'user',
        dni: faker.number.int({ min: 10000000, max: 99999999 }),
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
          "XS": simpleFaker.number.int(), 
          "S": simpleFaker.number.int(), 
          "M": simpleFaker.number.int(), 
          "L": simpleFaker.number.int(), 
          "XL": simpleFaker.number.int() 
      },
        jacket: { 
          "XS": simpleFaker.number.int(), 
          "S": simpleFaker.number.int(), 
          "M": simpleFaker.number.int(), 
          "L": simpleFaker.number.int(), 
          "XL": simpleFaker.number.int() 
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
  const schoolIds = [152, 187, 290, 865]
  export const schools = createRandomSchools(schoolIds);


  export const users = createRandomUsers(15, schoolIds);
  const userUids = users.map(u => u.uid);
  export const forms = createRandomForms(12, userUids, schoolIds);

  const adminSchools = faker.helpers.arrayElements(schoolIds)

  export const adminUsers = {
    uid: "p2ThnkAaxtOCj7tYXWZFfRmuxnl2",
    name: "Thaiel",
    phone: 1121560306,
    lastname: "Ojalvo Gottau",
    email: "thaielog@gmail.com",
    schoolID: adminSchools,
    role: "admin",
    dni: 46917418
  }

  export const adminForm = { 
    id: simpleFaker.number.int(), 
    userUid: 'p2ThnkAaxtOCj7tYXWZFfRmuxnl2',
    schoolId: faker.helpers.arrayElement(adminSchools), 
    fieldName: "Thaielito Perez", 
    fieldShirtSize: 'M', 
    fieldShirtQuantity: 3, 
    fieldJacketSize: 'M', 
    fieldJacketQuantity: 1 
  }