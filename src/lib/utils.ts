import type { AstroCookies, AstroGlobal } from "astro";
import { cookieRedirectPathValue } from "../constants/constants";

export const savePathThenReturn = (currPath: string, cookies: AstroCookies) => {
    cookies.set(cookieRedirectPathValue, currPath)
    return;
  }
  
  export const deleteAndReturn = ({ Astro }: { Astro: AstroGlobal }) => {
    const cookie = Astro.cookies.get(cookieRedirectPathValue)
    const cookieValue = cookie?.value
    
    if(cookieValue){
      Astro.cookies.delete(cookieRedirectPathValue)
      return Astro.redirect(cookieValue)
    }
  return null;
  }

  export const removeExtraSpaces = ( word: string | undefined ) => {
    if(!word){
        return "";
    }
    return word.trim().replace(/\s+/g, ' ');
}
export const capitalizeWords = (str: string) => {
    return str.split(" ").map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();    })
}
export const createRandomNumberId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000000);
}