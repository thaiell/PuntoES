import { db, Schools, Users, Forms, Invitations } from "astro:db"
import { users, adminUsers, schools, adminForm, forms, buyerUser1, buyerUser1Form, invitations } from "./randomData";

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Users).values([...users, adminUsers, buyerUser1 ]),
	await db.insert(Schools).values(schools),
	await db.insert(Forms).values([ ...forms, adminForm, buyerUser1Form ]),
	await db.insert(Invitations).values(invitations)
}