const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { users } = require('./objects/index.js');

const db = require('./objects/index.js');
const app = express();

db.sequelize.sync();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const SECRET_KEY = 'foo';

//middleWare

const authenticateUser = (req, res, next) => {
    const nonSecurePaths = ['/user/login', '/create-user'];
    if (nonSecurePaths.includes(req.path)) return next();
    
    const authHead = req.headers['authorization'];
    if (authHead) {
        const token = authHead.split(' ')[1];
        jwt.verify(token, SECRET_KEY, async (err, user) => {
            req.user = user;
            if(err){
                res.status(401).send({message: 'Invalid Token'})
            }
            next();
        })
    }else {
        res.status(401).send({message: 'No token provided'})
    }
}

app.use(authenticateUser);

// User Routes:

app.post('/user/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const user = await db.users.loginUser(username, password);
    if (user.loginSuccess) {
        const accessToken = jwt.sign({
            userId: user.id,
            user: user.username,
            password: user.password,
            userRoleId: user.user_role_id
        }, SECRET_KEY);
        res.send({
            message: 'Login Successfull',
            userId: user.id,
            token: accessToken
        });
    } else {
        res.send({message: 'incorrect username or password'})
    }
})

app.get('/user', async (req, res) => {
    if(req.user.userRoleId ==1) {
        const users = await db.users.querryAll();
        res.send(users);
    } else {
        res.status(401).send({message: 'unauthorized'})
    }
});

app.get('/users/:userId', async (req, res) => {
    if (req.user.userRoleId != 1 && req.user.userId != req.params.userId) {
        res.status(401).send({message: 'unauthorized'})
    } else {
        const users = await db.users.querryById(req.params.userId);
        if (users.length !== 0) {
            res.send(users);
            
        } else{
            res.status(400).send({message:'User not Found'})
        }
    }
})

app.post('/create-user', async (req, res) => {
    if (!(req.body.username && req.body.password && req.body.email && req.body.firstName && req.body.lastName && req.body.phone && req.body.shippingAddress)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }
    req.body.user_role_id = 2;

    const new_user = await db.users.newUser(req.body);
    if (new_user == false){
        res.status(500).send({message: 'couldnt create user'})
    } else {
        res.status(201).send({message: 'User Created'})
    }
})

app.post('/create-admin-user', async (req, res) => {
    if (!(req.body.email && req.body.password && req.body.email)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }
    if (!(req.user.userRoleId == 1)) {
        res.status(401).send({message: 'unauthorized'})
    }
    req.body.user_role_id = 1;
    const new_user = await db.users.newUser(req.body);
    if (new_user == false){
        res.status(500).send({message: 'couldnt create user'})
    } else {
        res.status(201).send({message: 'User Created'})
    }
})

// routes for Products

app.get('/products', async (req, res) => {
    const products = await db.products.querryAll();
    res.send(products);
});

app.get('/products/:prodId', async (req, res) => {
    const products = await db.products.querryById(req.body.prodId);
    res.send(products);
});

app.delete('/products/:prodId', async (req, res) => {
    if (req.user.userRoleId != 1) {
        res.status(401).send({message: 'unauthorized'});
    } else {
        const query = await db.products.deleteProductById(req.params.prodId);
        if (query.error) {
            res.status(500).send({message : query.message})
        } else {
            res.send({message: query.message})
        }
    }
});

app.post('/products', async (req, res) => {
    if (!(req.body.name && req.body.price)) {
        res.status(400).send({error: 'Data not Formated Correctly'})
    }
    if (req.user.userRoleId != 1) {
        res.status(401).send({message: "unauthorized"});
    } else {
        if (!req.body.imgUrl) {
            req.body.imgUrl = null;
        }
        const query = await db.products.newProduct({name: req.body.name, price: req.body.price, imgUrl: req.body.imgUrl})
        res.send(query);
    }
})

app.put('/product', async (req, res) => {
    if (!(req.body.id && (req.body.price || req.body.name || req.body.imgUrl))) {
        res.status(400).send({ error: "Data not formatted properly"});
    }
    if (req.user.userRoleId != 1) {
        res.status(401).send({message: "unauthorized"});
    } else {
        let response = {};
        if (req.body.price) {
            const query = await db.products.updateProductPrice(req.body.id, req.body.price);
            if (query.error) {
                res.status(500).send({message: query.message});
            } else {
                response['Price Qperation'] = {message: query.message};
            }
        }
        if (req.body.name) {
            const query = await db.products.updateProductName(req.body.id, req.body.name);
            if (query.error) {
                res.status(500).send({message:query.message});
            } else {
                response ['Name Operation'] = {message: query.message}
            }
        }
        if (req.body.imgUrl) {
            const query = await db.products.updateProductImgUrl(req.body.id, req.body.imgUrl);
            if (query.error) {
                res.status(500).send({message:query.message});
            } else {
                response ['Img Operation'] = {message: query.message}
            }
        }
        res.send(response);
    }

})

app.post('/products/cart', async (req, res) => {
    if (!(req.body.prodId && req.body.quantity)) {
        res.status(400).send({ error: "Data not formatted properly"});
    }
    const query = await db.carts.addToCart(req.user.userId, req.body.prodId, req.body.quantity)
    if (query == true) {
        res.send({message: "Product added to Cart"});
    } else {
        res.status(500).send({message: "Fatal Error - unable to add to cart"});
    }
})

app.delete('/products/cart/:prodId', async (req, res) => {
    const query = await db.carts.deleteProdFromCart(req.user.userId, req.params.prodId);
    if (query == true) {
        res.send({message: "product deleted from cart"});
    } else {
        res.status(500).send({message: "Fatal Error - unable to delete product from cart"});
    }
})

app.get('/current-cart', async (req, res) => {
    const currCart = await db.carts.getCartDetailsByUserId(req.user.userId);
    res.send(currCart);
})

app.post('/checkout-cart/:paymentMethod', async (req, res) => {
    const checkoutCart = await db.carts.checkoutCart(req.user.userId, req.params.paymentMethod);
    if (checkoutCart.error) {
        res.status(500).send({message: checkoutCart.message})
    } else {
        res.send({message: checkoutCart.message})
    }
})

app.get('/orders', async (req, res) => {
    if (req.user.userRoleId != 1) {
        res.status(401).send({message: 'unauthorized'});
    } else {
        const orders = await db.carts.querryAllOrders();
        res.send(orders);
    }
})

app.put('/orders', async (req, res)=> {
    if (req.user.userRoleId != 1) {
        res.status(401).send({message: 'unauthorized'});
    } else {
        if (!(req.body.orderId && req.body.orderStatus)) {
            return res.status(400).send({error: "Data not formatted properly"})
        } 
        const query = await db.carts.updateOrderStatus(req.body.orderId, req.body.orderStatus);
        
        if (query.error){
            res.status(500).send({message: query.message})
        } else {
            res.send({message: query.message});
        }
    }
})

app.delete('/order/:orderId', async (req, res) => {
    if (req.user.userRoleId != 1) {
        res.status(401).send({message: 'unauthorized'})
    } else {
        const query = await db.carts.deleteOrderById(req.params.orderId);
        if (query.error) {
            res.status(500).send({message: query.message})
        } else {
            res.send({message: query.message})
        }
    }
})

app.get('/user-orders/:userId', async (req, res) => {
    if (req.user.userRoleId != 1 && req.user.userId != req.params.userId) {
        res.status(401).send({message: 'unauthorized'})
    } else {
        const orders = await db.carts.queryOrdersByUserId(req.params.userId)
        res.send(orders);
    }
})


app.listen(3000, () => {
    console.log('Listening on port 3000');
});

