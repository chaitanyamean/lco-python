
export const addItemToCart = (item, next) => {
    let cart = []
    if (typeof window != undefined) {
        if (localStorage.getItem('cart')) {
            console.log(localStorage.getItem('cart'))
            cart = JSON.parse(localStorage.getItem('cart'))
        }
        console.log(item)
        cart.push({
            ...item
        })
        console.log(cart)
        localStorage.setItem('cart', JSON.stringify(cart))
        next()
    }
}

export const removeItemFromCart = (productId) => {
    let cart = []
    if (typeof window != undefined) {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))
            cart.map((product, idx) => {
                if (product.id == productId) {
                    cart.splice(idx, 1)
                }
            })
            localStorage.setItem('cart', JSON.stringify(cart))
        }
        return cart
    }
}

export const loadCart = () => {
    if (typeof window != undefined) {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart'))
        }
    }
}

export const cartEmpty = (next) => {
    if (typeof window != undefined) {
        localStorage.removeItem('cart')
        let cart = []
        localStorage.setItem('cart', cart);
        next()
    }
}
