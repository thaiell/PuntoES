import type { CartItem } from "../lib/types"
import { persistentAtom } from "@nanostores/persistent";


export const shoppingCart = persistentAtom<CartItem[]>("cart", [], {
    encode: JSON.stringify,
    decode: JSON.parse,
  })

export function addItemToShoppingCart(cart: CartItem){
  const isAlreadyInCart = shoppingCart.get().find(item => item.sku === cart.sku)
  if(isAlreadyInCart) return;
  return shoppingCart.set([...shoppingCart.get(), cart])
}