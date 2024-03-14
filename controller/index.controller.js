exports.home = (req, res, next) => {
    let title = "Trang chủ"
    res.render('index', {title: title});
}

exports.changeInfo = (req, res, next) => {
    let title = "Đổi thông tin"
    res.render('account/changeInfo', {title: title});
}

exports.changePass = (req, res, next) => {
    let title = "Đổi mật khẩu"
    res.render('account/changePass', {title: title});
}