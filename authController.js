const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController {
    async reg(req, res){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({username})
            if(candidate){
                return res.status(400).json({message: 'Пользователь уже зарегистрирован'})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save();
            return res.status(200).json({message: "Вы успешно зарегистрировались"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка регистрации'})
        }
    }
    async login(req, res){
        try{
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user){
                res.status(400).json({message: 'Пользователь не существует'})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword) {
                res.status(400).json({message: 'Неправильное имя пользователя или пароль'})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.status(200).json({message: 'Вы авторизовались', token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка авторизации'})
        }
    }
    async getUsers(req, res){
        try{
            const users = await User.find()
            res.json({users})
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new authController()