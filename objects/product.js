class Product {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }

    async querryAll() {
        const productos = await this.sequelize.query('SELECT * FROM Products', {type: this.sequelize.QueryTypes.SELECT});
        return productos;
    }

    async queryById(prodId){
        try {
            const product = this.sequelize.query("SELECT * FROM Products WHERE id= :id", {
                replacements: {id: prodId},
                type: this.sequelize.QueryTypes.SELECT});
            return product;
        } catch (err) {
            return err;
        }
    }

    async newProduct(product){
        let query;
        try{
            query = await this.sequelize.query('INSERT INTO products (name, price, img_url, active) VALUES (:name, :price, :imgUrl, 1)',
            {
                replacement: {name: product.name, price: product.price, imgUrl: product.imgUrl},
                type: this.sequelize.QueryTypes.INSERT});
            return {message: 'Product Created'}
        } catch (err) {
            return {message: err.errors[0].message}
        }

    }

    async deleteProductById(productId) {
        let query;
        try {
            query = await this.sequelize.query('DELETE FROM products WHERE id = :productId', {
                replacement: {productId: productId},
                type: this.sequelize.QueryTypes.DELETE
            })
            return {error: false, message: `product with id ${productId} was deleted.`}
        } catch (err) {
            console.log(error);
            return{error: true, message: "could't delete product."}
        }
    }
    async updateProductPrice(prodId, price){
        try{
            const query = await this.sequelize.query('UPDATE products SET price = :price WHERE id = :id',
            {replacement: {id: prodId, price: price},
            type: this.sequelize.QueryTypes.UPDATE})
        return {error: false, message: "Product's price updates correctly"}
        } catch (err) {
            return {error: true, message: "Couldn't update product's price"}
        }
    }
    async updateProductImgUrl(prodId, imgUrl) {
        try {
            const query = await this.sequelize.query("UPDATE products SET img_url = :imgUrl WHERE id = :id", 
            {
                replacements: { id: prodId, imgUrl: imgUrl},
                type: this.sequelize.QueryTypes.UPDATE
            })
            return {error: false, message: "Product's img updated correctly"}
        } catch (err) {
            return {error: true, message: "Couldn't update product's img"}
        }
    }
    async updateProductName(prodId, name) {
        try {
            const query = await this.sequelize.query("UPDATE products SET name = :name WHERE id = :id", 
            {
                replacements: { id: prodId, name: name},
                type: this.sequelize.QueryTypes.UPDATE
            })
            return {error: false, message: "Product's img updated correctly"}
        } catch (err) {
            return {error: true, message: "Couldn't update product's img"}
        }
    }
    
};

module.exports = Product;
