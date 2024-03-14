const {check} = require('express-validator')

let validateLogin = () =>{
    return[
        check('query.username', 'Không được để trống tài khoản').not().isEmpty(),
        check('query.password', 'Không được để trống mật khẩu').not().isEmpty(),
    ]
}

let validate = {
    validateLogin: validateLogin,
}

module.exports = {validate}