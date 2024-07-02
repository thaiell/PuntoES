import { defineDb, column, defineTable } from 'astro:db';

const Users = defineTable({
  columns: {
    uid: column.text({ primaryKey: true }),
    email: column.text(),
    name: column.text(),
    lastname: column.text(),
    phone: column.text(),
    dni: column.number(),
    schoolID: column.json({ optional: true, references: () => Schools.columns.id }),
    role: column.text({ default: "user" }),
  }
})
const Schools = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),  
    name: column.text(),
    price: column.json(),
    addres: column.text(),
    order: column.json(),
    image: column.json(),
  }
})
const Forms = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    userUid: column.text({ references: () => Users.columns.uid}),
    schoolId: column.number({ references: () => Schools.columns.id}),
    fieldName: column.text(),
    fieldShirtSize: column.text(),
    fieldShirtQuantity: column.number(),
    fieldJacketSize: column.text(),
    fieldJacketQuantity: column.number()
  }
})
const PaymentOrder = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    userUid: column.text({ references: () => Users.columns.uid }),
    formId: column.number({ references: () => Forms.columns.id }),
    paymentMethod: column.text(),
    date: column.date(),
    total: column.number(),
    verified: column.boolean()
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    Users, Schools, Forms
  }
});
