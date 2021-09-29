const bcrypt = require('bcrypt');

class User {
    constructor(sequelize){
        this.sequelize = sequelize;
    }

    async querryAll() {
        const users = await this.sequelize.query('SELECT id, username, first_name, last_name, email, phone, shipping_address, user_role_id FROM Users', {type: this.sequelize.QueryTypes.SELECT});
        return users;
    }

    async querryById(id){
        const users = await this.sequelize.query('SELECT id, username, first_name, last_name, email, phone, shipping_address, user_role_id FROM Users where id = :id', {replacements: {id: id}, type: this.sequelize.QueryTypes.SELECT });
        return users;
    }

    async loginUser(username, password) {
        const user = await this.sequelize.query("SELECT id, username, user_role_id, password FROM Users where username = :username", { replacements: { username: username }, type: this.sequelize.QueryTypes.SELECT })
        if (user.length != 0) {
            
            const validPassword = await bcrypt.compare(password, user[0].password);
            if(validPassword){
                let loggedUser = user[0]
                loggedUser.loginSuccess = true
                return loggedUser
            } else {
                return { loginSuccess: false }
            }
        } else {
            return { loginSucess: false }
        }
    };

    async authenticateUser(username, password) {
        const user = await this.sequelize.query('SELECT id, username, password FROM Users where username = :username', {replacements: {username: username}, type: this.sequelize.QueryTypes.SELECT});

        if (user.length != 0) {
            return user
        } else{
            return null
        }
    }

    async newUser(userData) {
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        console.log(userData.password)
        
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        const query = `
        INSERT INTO Users (username, email, password, user_role_id, first_name, last_name, phone, shipping_address)
        VALUES (:username, :email, :password, :user_role_id, :firstName, :lastName, :phone, :shippingAddress);`
        try {            
            const queryed = await this.sequelize.query(
                query,
                {
                    replacements: { username: userData.username, email: userData.email, password: hashedPassword, user_role_id:  userData.user_role_id, firstName: userData.firstName, lastName: userData.lastName, phone: userData.phone, shippingAddress: userData.shippingAddress },
                    type: this.sequelize.QueryTypes.INSERT
                })
            return queryed;
        } catch (error) {
            return false
        }
    }
};

module.exports = User;