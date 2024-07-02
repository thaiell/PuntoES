export type UserSession = {
    uid: string
    displayName: string | undefined
    email: string | undefined
  }
 export type UserForm = {
    fieldName: string
    fieldShirtSize: string
    fieldShirtQuantity: number
    fieldJacketSize: string
    fieldJacketQuantity: number
 }
  export type Image = {
    primary: boolean
    imgUrl: string
    imgAlt: string
  }
export interface APIResponse {
    message: string;
}