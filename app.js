// Подключение модуля express
var express = require("express");

var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var pp = require('./routes/passport');

// Создание объекта  express
var app = express();

var bodyParser = require('body-parser');

// Указание, что каталог public используется для хранения статических файлов
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Подключение шаблонизатора Pug.
app.set("view engine", "pug");
// Указание пути к каталогу, который хранит шаблоны в формате Pug.
// app.set('views', './views', './views/student');
app.set("views", "./views");
// app.set('views', path.join(__dirname,'/views'));
app.locals.basedir = '/Users/antonprilovsky/WEB VisualStudio /First project/';

app.use(flash());
app.use(expressSession({secret: "key"}));
app.use(passport.initialize());
app.use(passport.session());

// Указание номера порта, через который будет запускаться приложение.
app.listen(8000);


app.use(function (req, res, next) {
    res.locals.username = req.user ? req.user.username : "";

    console.log("login", res.locals.username)
    next();
});
// Определение обработчика для маршрута "/".
// request — HTTP-запрос, свойствами которого являются строки запроса, параметры, тело запроса, заголовки HTTP.
// response — HTTP-ответ, который приложение Express отправляет при получении HTTP-запроса.
app.get("/", function(request, response)  {
   // render() — функция, которая на основе шаблона (в данном случае шаблона index.pug) генерирует страницу html, которая отправляется пользователю.
    response.render("index");
    
});

// Определение обработчикв для маршрута "/test"
app.get("/test", function(request, response)  {
    response.render("test", {description: "Описание страницы"});
});

app.get("/information", function(request, response)  {
    response.render("test", {description: "На этой странице будет описание проекта"});
  });

app.get("/menu", function(req, res){
    res.render("menu")
})

app.get("/practice", function(req, res){
    res.render("pug_practice")
})


// app.get('/random.text', function (req, res) {
//     res.send('random.text');
//   });
// подключение модуля student.js
var student = require('./routes/student');
app.use('/students/', student);

var subjects = require('./routes/subject');
app.use('/subjects/', subjects);

var teachers = require('./routes/teacher');
app.use('/teachers/', teachers)

var studentGroup = require('./routes/studentGroup');
app.use('/studentGroup/', studentGroup)

var position = require('./routes/position');
app.use('/position/', position)

var journal = require('./routes/journal')
app.use('/', journal)

var authentication = require('./routes/authentication');
app.use('/', authentication);
;



// var script = require('./public/js/script')
// app.use('/', script)

// app.get(('/example'), function(req, res) {
//     res.render("example")
// })