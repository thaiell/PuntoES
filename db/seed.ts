import { db, Schools, Users, Forms } from "astro:db"
import { users, adminUsers, schools, adminForm, forms } from "./randomData";

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Users).values([...users, adminUsers]),
	await db.insert(Schools).values(schools),
	await db.insert(Forms).values([ ...forms, adminForm ])
}