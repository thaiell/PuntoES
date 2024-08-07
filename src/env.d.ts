/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        user: UserSession,
        currentSchool: number
    }
}