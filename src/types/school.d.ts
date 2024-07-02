import { Image } from "./global";
export type SchoolsType = {
    id: number;
    name: string;
    price: PriceBySizes
    order: SchoolOrder
    addres: string;
    image: Image; 
}

export type SchoolReferences = {
    id: number
    name: string
  }

export interface PriceBySizes {
    shirt: {"XS": number, "S": number, "M": number, "L": number, "XL": number},
    jacket: {"XS": number, "S": number, "M": number, "L": number, "XL": number}
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

export interface SchoolAPIResponse {
  school: SchoolsType
  steps: {
      formStep: { isCompleted: boolean, value: UserForm }
      paymentStep: { isCompleted: boolean, value: any }
      deliverStep: { isCompleted: boolean, value: any }
  }
}