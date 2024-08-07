import { Image, Size, type UserPayment } from "./global";

// Users
export type UserForm = {
  id: number
  fieldName: string
  fieldShirtSize: Size
  fieldShirtQuantity: number
  fieldJacketSize: Size
  fieldJacketQuantity: number
}
export interface UserSteps {
  schoolId: number
  form: boolean
  payment: boolean
  delivered: boolean
}
// Schools

export interface RequiredSchoolInfo {
  id: number
  name: string
  image: Image
  order: SchoolOrder
  price: PriceBySizes
}

export type SchoolsType = {
    name: string;
    price: PriceBySizes
    order: SchoolOrder
    image: Image; 
}

export interface SchoolOrder {
  shirt: {
      imgUrl: string
      imgAlt: string
    },
    jacket: {
      imgUrl: string
      imgAlt: string
    }
}

// Sizes

export interface PriceBySizes {
  shirt: Record<Size, number>;
  jacket: Record<Size, number>;
}

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL"

interface UserExtraData {
  phone: string
  dni: string
}
interface UserExtraDataWithEmail extends UserExtraData {
  email: string
}

// School Pages API Types

/* export interface RequiredSchoolPage {
  school: RequiredSchoolInfo
  steps: UserSteps
  user: UserExtraData
}

export interface SchoolFormPageAPIResponse extends RequiredSchoolPage {
  form: UserForm
}

export interface SchoolPaymentPageAPIResponse extends RequiredSchoolPage {
  payment: UserPayment
  form: UserForm
} */






