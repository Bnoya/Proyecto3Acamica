class Cart {
    constructor(sequelize) {
        this.sequelize= sequelize;
    }
    async querryActiveCarts() {
        const carts = await this.sequelize.query('SELECT * FROM Carts WHERE active = 1', {type: this.sequelize.QueryTypes.SELECT});
    return carts;
    }
    async getActiveCartsId(userId) {
        const activeCartsId = await this.sequelize.query("SELECT id FROM Carts WHERE active = 1 AND user_id = :userId", {
            replacements: {userId: userId},
            type: this.sequelize.QueryTypes.SELECT
        })
        if(activeCartsId.length ==0){
            const query = await this.sequelize.query('INSERT into Carts (user_id) VALUES (:userId)', {
                replacements: {userId: userId},
                type: this.sequelize.QueryTypes.INSERT
            })
            return query[0]
        } else {
            return activeCartsId[0].id
        }
    }
    async addToCart(userId, prodId, quantity) {
        const activeCardId = await this.getActiveCartsId(userId);
        let query;
        try {
            query = await this.sequelize.query('INSERT INTO Cart_details (cart_id, product_id, quantity) VALUES (:cartId, :prodId, :quantity)', {
                replacements: {cartId: activeCardId, prodId: prodId, quantity: quantity},
                type: this.sequelize.QueryTypes.INSERT
            })
            return true
        } catch (err) {
            return err
        }
    }
    async deleteProdFromCart(userId, prodId){
        const activeCardId = await this.getActiveCartsId(userId);
        let query;
        try {
            query = await this.sequelize.query('DELETE FROM Cart_details WHERE product_id = :prodId AND cart_id = :cartId', {
                replacements: {cartId: activeCardId, prodId: prodId},
                type: this.sequelize.QueryTypes.DELETE
            })
            return true
        } catch (err) {
            return err
        }
    }

    async getCartDetailsByUserId(userId){
        const queryStr = `SELECT Cart_details.cart_id, Cart_details.product_id, Products.price, Products.name, Products.img_url, Carts.user_id, sum(Cart_details.quantity) as quantity
        FROM Cart_details
        INNER JOIN Products ON Cart_details.product_id = Products.id
        INNER JOIN Carts ON Cart_details.cart_id = Carts.id
        WHERE Carts.active = 1 AND cart_id = :cartId
        GROUP BY Cart_details.product_id;`

        const activeCardId = await this.getActiveCartsId(userId);
        const query = await this.sequelize.query(queryStr, {
            replacements: {cartId: activeCardId},
            type: this.sequelize.QueryTypes.SELECT
        })

        let response = {cartId: activeCardId};
        let cartDetails = [];
        let cartrTotalPrice = 0;
        for (let i = 0; i < query.length; i++) {
            const element = query[i];
            cartDetails.push({product_id: element.product_id, name: element.name, imgUrl: element.img_url, price: element.price, quantity: parseInt(element.quantity)})
            cartrTotalPrice = cartrTotalPrice + element.price * element.quantity;
        }
        response['cartDetails'] = cartDetails;
        response['cartTotalPrice'] = cartrTotalPrice;
        return response;
    }

    generateOrderDesc(cartDetails){
        let descStr = "";
        for (let i = 0; i< cartDetails.cartDetails.length; i++){
            const element = cartDetails.cartDetails[i];
            descStr = descStr + element.quantity + "x" + element.name;
        }
        return descStr
    }

    async checkoutCart(userId, paymentMethod){
        try{
            const cartDetails = await this.getCartDetailsByUserId(userId);
            if(cartDetails.cartDetails.length == 0){
                return {error: true, message: "Couldn't checkout cart. It is empty"}
            }

            const deactivateCart = await this.sequelize.query('UPDATE Carts SET active = 0 WHERE user_id = :userId', {
                replacements: {userId: userId},
                type : this.sequelize.QueryTypes.INSERT
            })

            const orderDesc = this.generateOrderDesc(cartDetails);

            const createOrder = await this.sequelize.query("INSERT INTO Orders (user_id, cart_id, payment_method_id, order_status_id, total, order_desc) VALUES (:userId, :cartId, :paymentMethodId, :orderStatusId, :total, :orderDesc)", {
                replacements: {userId: userId},
                type: this.sequelize.QueryTypes.INSERT
            })
            return {error: false, message: "Order Created"}

        } catch(err){
            return {error: true, message: "Could't checkout Cart"}
        }
    }

    async queryAllOrders(){
        const queryStr = `
        SELECT Orders.id as order_number, Order_status.order_status_name, Orders.cart_id, Orders.order_date, Orders.order_desc,  Payment_methods.payment_method_name, Orders.total, Users.first_name, Users.last_name, Users.shipping_address
        FROM Orders
        INNER JOIN Order_status ON Order_status.id = Orders.order_status_id
        INNER JOIN Payment_methods ON Payment_methods.id = Orders.payment_method_id
        INNER JOIN Users ON Users.id = Orders.user_id
        ORDER BY Orders.order_status_id ASC;`

        const query = await this.sequelize.query(queryStr, {
            type: this.sequelize.QueryTypes.SELECT
        })
        return query
    }

    async updateOrderStatus(orderId, orderStatus){
        try{
            const query = await this.sequelize.query("UPDATE Orders SET order_status_id = :orderStatus WHERE id = :orderId", {
                replacements: {orderStatus: orderStatus, orderId: orderId,
                type: this.sequelize.QueryTypes.UPDATE}
            })
            return {error: false, message: "Order updated"}

        } catch(err){
            return {error: true, message: "Couldn't update order"}
        }
    }

    async queryOrdersByUserId(userId){
        const queryStr = `
        SELECT Orders.id as order_number, Order_status.order_status_name, Orders.order_date,Orders.cart_id, Orders.order_desc,  Payment_methods.payment_method_name, Orders.total, Users.first_name, Users.last_name, Users.shipping_address
        FROM Orders
        INNER JOIN Order_status ON Order_status.id = Orders.order_status_id
        INNER JOIN Payment_methods ON Payment_methods.id = Orders.payment_method_id
        INNER JOIN Users ON Users.id = Orders.user_id
        WHERE Orders.user_id = :userId
        ORDER BY Orders.order_status_id ASC;`

        const query = await this.sequelize.query(queryStr, {
            replacements: {userId: userId},
            type: this.sequelize.QueryTypes.SELECT
        })
        return query
    }

    async deleteOrderBtId(orderId){
        let query;
        try{
            query = await this.sequelize.query("DELETE FROM Orders WHERE id = :orderId", {
                replacements: {orderId: orderId}, type : this.sequelize.QueryTypes.DELETE
            })
            return {error: false, message: `Order with id: ${orderId} was deleted.`}
        } catch (err){
            return {error: true, message: "Couldn't delete your order"}
            
        }
    }
}

module.exports = Cart;
