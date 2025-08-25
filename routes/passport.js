// var passport        = require('passport');
// var LocalStrategy   = require('passport-local').Strategy;
// var bcrypt          = require('bcrypt');
// var db = require("./database.js");


// // стратегия регистрации пользователя
// passport.use('register', new LocalStrategy({
//         usernameField : 'username', // указываем, что для логина будет использоваться поле 'username' (из таблицы user)
//         passwordField : 'password', // указываем, что для пароля будет использоваться поле 'password' (также из таблицы user)
//         passReqToCallback : true
//     },

//     function (req, username, password, done) { // done - обратный вызов (после регистрации в вызывающий метод будет возвращена информация об успешной/неуспешной операции)
//         db.get("SELECT * FROM user WHERE username=?", [username], function (err, row) {
//             if (err) {
//                 return done(err);
//             }
//             if (row) { // если пользователь с таким логином уже зарегистрирован
//                 return done(null, false, req.flash("message", "Пользователь с данным логином существует"));
//             }
//             else {
//                 bcrypt.hash(password, 10, function (err, hash) { // генерируем хеш пароля, 10 - длина генерируемой "соли" (про "соль" подробно написано в задании)
//                     if (err) {
//                         throw err;
//                     }

//                     db.run("INSERT INTO user(username, password) VALUES(?,?)", [username, hash], function (err) {
//                         if (err) {
//                             throw err;
//                         }
//                         var user = {
//                             username: username,
//                             password: hash
//                         };
//                         return done(null, user);
//                     });
//                 });
//             }
//         });
//     }));

// // стратегия аутентификации пользователя по логину и паролю. Данная функция находит пользователя по логину в базе данных и проверяет правильность введённого пароля.
// passport.use('login', new LocalStrategy({
//         usernameField : 'username',
//         passwordField : 'password',
//         passReqToCallback : true
//     },
//     function (req, username, password, done) {
//         db.get("SELECT * FROM user WHERE username=?", [username], function (err, row) {
//             if (err) {
//                 return done(err);
//             }
//             if (row == null) {
//                 return done(null, false, req.flash("message", "Неверно введенный логин и/или пароль"));
//             }
//             bcrypt.compare(password, row.password, function (err, res) {
//                 if (res) {
//                     return done(null, row);
//                 } else {
//                     return done(null, false, req.flash("message", "Неверно введенный логин и/или пароль"));
//                 }
//             });
//         });
//     }));

// passport.serializeUser(function (user, done) {
//     done(null, user.username);
// });

// passport.deserializeUser(function (username, done) {
//     db.get('SELECT * FROM user WHERE username=?', [username], function (err, user) {
//         if (err) {
//             throw (err);
//         }
//         done(err, user);
//     });
// });

var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt          = require('bcrypt');
var db = require("./database.js");


// стратегия регистрации пользователя
passport.use('register', new LocalStrategy({
        usernameField : 'username', // указываем, что для логина будет использоваться поле 'username' (из таблицы user)
        passwordField : 'password', // указываем, что для пароля будет использоваться поле 'password' (также из таблицы user)
        passReqToCallback : true
    },

    function (req, username, password, done) { // done - обратный вызов (после регистрации в вызывающий метод будет возвращена информация об успешной/неуспешной операции)
        db.get("SELECT * FROM user WHERE username=?", [username], function (err, row) {
            if (err) {
                return done(err);
            }
            if (row) { // если пользователь с таким логином уже зарегистрирован
                return done(null, false, req.flash("message", "Пользователь с данным логином существует"));
            }
            else {
                bcrypt.hash(password, 10, function (err, hash) { // генерируем хеш пароля, 10 - длина генерируемой "соли" (про "соль" подробно написано в задании)
                    if (err) {
                        throw err;
                    }

                    db.run("INSERT INTO user(username, password) VALUES(?,?);", [username, hash], function (err) {
                        if (err) {
                            throw err;
                        }
                        var user = {
                            username: username,
                            password: hash
                        };
                        return done(null, user);
                    });
                });
            }
        });
    }));

// стратегия аутентификации пользователя по логину и паролю. Данная функция находит пользователя по логину в базе данных и проверяет правильность введённого пароля.
passport.use('login', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
},
function (req, username, password, done) {
    db.get("SELECT * FROM user WHERE username=?", [username], function (err, row) {
        if (err) {
            return done(err);
        }
        if (row == null) {
            return done(null, false, req.flash("message", "Неверно введенный логин и/или пароль"));
        }
        bcrypt.compare(password, row.password, function (err, res) {
            if (res) {
                return done(null, row);
            } else {
                return done(null, false, req.flash("message", "Неверно введенный логин и/или пароль"));
            }
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    db.get('SELECT * FROM user WHERE username=?', [username], function (err, user) {
        if (err) {
            throw (err);
        }
        done(err, user);
    });
});