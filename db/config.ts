import { defineDb, column, defineTable } from 'astro:db';

const Invitations = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    schoolId: column.number({ references: () => Schools.columns.id }),
    code: column.text()
  }
})

const Users = defineTable({
  columns: {
    uid: column.text({ primaryKey: true }),
    email: column.text(),
    name: column.text(),
    lastname: column.text(),
    phone: column.text(),
    dni: column.text(),
    schoolID: column.json({ optional: true, references: () => Schools.columns.id }),
    steps: column.json({ optional: true }), // form - payment - delivered - schoolId
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
      id: column.text({ primaryKey: true }),
      userUid: column.text({ references: () => Users.columns.uid }),
      formId: column.number({ references: () => Forms.columns.id }),
      totalAmount: column.number(),

      paymentMethod: column.text(), // cash - bank-transfer - mp

      address: column.json({ optional: true }),
      transactionId: column.number({ optional: true }), // Only working for Payments with MP, card, etc // Not Cash
      file: column.json({ optional: true }), // Only for bank transfers to upload vouchers
      externalReference: column.text({ optional: true }),

      date: column.date(),
/*       verified: column.boolean(), */
      status: column.text({ default: "pending" }) // pending - completed - canceled - half
    }
  })
// https://astro.build/db/config
export default defineDb({
  tables: {
    Users, Schools, Forms, PaymentOrder, Invitations
  }
});
