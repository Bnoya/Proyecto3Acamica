const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { users } = require('./objects/index.js');

const db = require('./objects/index.js');
const app = express();

db.sequelize.sync();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const SECRET_KEY = 'chicken';

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
    const username = req.body.username;
    const password = req.body.password;

    const user = await db.user.loginUser(username, password);
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
    }else {
        res.send({message: 'Incorrect username or password'})
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
