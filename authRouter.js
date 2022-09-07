const Router = require('express')
const router = new Router();
const authController = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/reg', [
    check('username')
        .isLength({min: 5})
        .withMessage('Поле логина должно содержать не менее 5 символов')
        .isLength({max: 10})
        .withMessage('Поле логина должно содержать не более 10 символов'),
        // .isEmpty()
        // .withMessage('Поле логина обязательно к заполнению'),
    check('password')
        .isLength({min: 5})
        .withMessage('Поле пароля должно содержать не менее 5 символов')
        .isLength({max: 10})
        .withMessage('Поле пароля должно содержать не более 10 символов')
        // .isEmpty()
        // .withMessage('Поле пароля обязательно к заполнению')
], authController.reg)
router.post('/login', authController.login)
router.get('/users', roleMiddleware(['ADMIN']), authController.getUsers)

module.exports = router;