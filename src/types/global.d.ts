import type { UserSteps, SchoolsType } from "./school"

export type UserSession = {
    uid: string
    displayName?: string
    email?: string
}


// How its defined in DB
export interface UserData {
  name: string
  lastname: string
  email: string
  dni: string
  phone: string
  schoolIds: number[]
  steps: UserSteps
}

export interface RequiredSchoolPage {
  schoolId: number
  school: SchoolsType
  user: UserData
}


export interface Image {
  primary: boolean
  imgUrl: string
  imgAlt: string
}
// Payments

export interface UserPayment {
  email: string
  phoneNumber: string
  dni: string
  paymentMethod: PaymentMethod
  deliver: DeliveryMethods
  address?: Address
}

/* export interface RequiredPaymentInfo {
  email: string
  phoneNumber: string
  dni: string
  paymentMethod: PaymentMethod
} */

interface PaymentMethod {
  method: "cash" | "mp" | "bank-transfer"
  instalments: 1 | 2
}

export interface Address {
  street: string
  number: string
  place: string
  zipcode: string
}

export type DeliveryMethods = "puntoes-shop" | "puntoes-deliver" | "moova-deliver"

// Api Responses
export interface APIResponse {
    message: string;
}
interface ErrorResponse {
  status: "error"
  message: string
}
interface SuccessResponse<T> {
  status: "success"
  data: T
}
export type InternalResponse<T> = SuccessResponse<T> | ErrorResponse