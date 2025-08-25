// var express = require("express");
// var router = express.Router();
// var passport = require('passport');

// // переход к странице для ввода логина и пароля
// router.route('/login')
//     .get(loginGET)
//     .post(loginPOST)

//     function loginGET(req, res) {
//         res.render('login', {
//             // message: req.flash('message') // по умолчанию передаётся пустое сообщение
//         });
//     }
// // осуществление входа пользователя в систему: выполняется переход к стратегии входа, которая определена в файле passport.js
//     function loginPOST() {
//         passport.authenticate('login', {
//             successRedirect: '/listStudents', // маршрут, по которому будет выполнен переход в случае успешного входа в систему
//             failureRedirect: '/login', // маршрут, по которому будет выполнен переход в случае ошибок идентификации или аутентификации
//             failureFlash : true // включение возможности вывода ошибок в виде флэш-сообщений (сообщения, которые никуда не сохраняются)
//         })
//     }
    
// // переход к странице регистрации
// router.route('/register')
//     .get(registerGET)
//     .post(registerPOST)
//     function registerGET(req, res) {
//         res.render('register',{
//             // message: req.flash('message')
//         });
//     }
    
// // осуществление регистрации пользователя в системе: выполняется переход к стратегии регистрации, которая определена в файле passport.js
//     function registerPOST() {
//         console.log("register")
//         passport.authenticate('register', {
//             successRedirect: '/login',
//             failureRedirect: '/register',
//             failureFlash : true
//         }
//     )
//     }
// // обработчик для выхода пользователя из системы (делает недействительной сессию пользователя)
// router.route('/logout')
//     .get(logoutGET)
//     function logoutGET(req, res) {
//         req.logout(); // завершили сессию
//         res.redirect('/login'); // переходим к странице ввода логина и пароля
//     }

// module.exports = router;

var express = require("express");
var router = express.Router();
var passport = require('passport');

// переход к странице для ввода логина и пароля
router.get('/login', function(req, res) {


    res.render('login', {
        message: req.flash('message') // по умолчанию передаётся пустое сообщение
    });
});

// осуществление входа пользователя в систему: выполняется переход к стратегии входа, которая определена в файле passport.js
router.post('/login', passport.authenticate('login', {
    successRedirect: '/students/listStudents', // маршрут, по которому будет выполнен переход в случае успешного входа в систему
    failureRedirect: '/login', // маршрут, по которому будет выполнен переход в случае ошибок идентификации или аутентификации
    failureFlash : true // включение возможности вывода ошибок в виде флэш-сообщений (сообщения, которые никуда не сохраняются)
}));

// переход к странице регистрации
router.get('/register', function(req, res){
    res.render('register',{
        message: req.flash('message')});
});

// осуществление регистрации пользователя в системе: выполняется переход к стратегии регистрации, которая определена в файле passport.js
router.post('/register', passport.authenticate('register', {
        successRedirect: '/login',
        failureRedirect: '/register',
        failureFlash : true
    }
));
router.route('/logout')
    .get(logoutPOST)
    function logoutPOST(req, res, next) {
        req.logout(function(err) {
            if (err) {
                return next(err)
            }
            res.redirect('/login')
        })
    }
module.exports = router;