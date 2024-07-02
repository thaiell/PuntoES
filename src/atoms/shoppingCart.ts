import type { Products } from "../lib/types"
const cartKey = "cart"

export const addProductToCart = (newProduct: Products) => {
    const currentProductsString = localStorage.getItem(cartKey);

    const currentProducts: Products[] = currentProductsString ? JSON.parse(currentProductsString) : [];

    const checkId = currentProducts.find((item: Products) => item.id === newProduct.id);

    if(checkId){
        console.log("El producto ya está en el carrito");
    } else {
        currentProducts.push(newProduct);
        localStorage.setItem(cartKey, JSON.stringify(currentProducts));
        console.log("Producto agregado al carrito correctamente");
    }
}

export const deleteProductInCart = (productId: string) => {
    const currentProductsString = localStorage.getItem(cartKey);
    const currentProducts: Products[] = currentProductsString ? JSON.parse(currentProductsString) : [];

    const updatedCart = currentProducts.filter((item: Products) => item.id !== productId);

    if (updatedCart.length < currentProducts.length) {
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        console.log("Producto eliminado del carrito correctamente");
    } else {
        console.log("Este producto no se encuentra en el carrito");
    }
}

/* export const readProductsInCart = () => {
    
    const products = localStorage.getItem(cartKey)
    return products ? JSON.parse(products) : [];

} */