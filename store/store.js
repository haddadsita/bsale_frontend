class Store {

    constructor() {
        this.available = typeof Storage !== 'undefined' ? true : false;
    }


    checkCart() {
        if (!localStorage.getItem('cart')) {
            localStorage.setItem('cart', JSON.stringify([]));
        }
    }
    
    addItem(item) {
        let cart = this.getCart();
        
        // Verify if exist item in cart
        if (this.verifyItemInCart(item.id, cart)) {
            return false;
        }
        item['qty'] = 1;

        cart = JSON.stringify([...cart, item]);

        localStorage.setItem('cart', cart);
    }

    getCart() {
        return JSON.parse(localStorage.getItem('cart'));
    }

    verifyItemInCart(id, cart) {
        return cart.some(item => item.id === id);
    }

    searchProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));

        return products.find(product => product.id === id);
    }

    setCategory(id = 4) {
        localStorage.setItem('category', id);
    }

    getCategory() {
        return localStorage.getItem('category');
    }

    getCountItemsCart() {
        return this.getCart().length;
    }

}
