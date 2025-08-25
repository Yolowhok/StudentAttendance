var express = require('express');

function isAuth(req, res, next) {
    // если пользователь аутентифицирован в сеансе, вызывается next() для вызова следующего обработчика маршрута
    if (req.isAuthenticated()) {
        return next();
    }
    // если пользователь не прошел проверку подлинности, он будет перенаправлен на страницу входа в систему (маршрут можно изменить на другой)
    res.redirect('/login');
}

module.exports = {
    isAuthenticated: isAuth
};