var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js

var router = express.Router();

var db = require("./database.js");

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;




router.route("/listStudentGroup")
    .get(listStudentGroupGet)
    function listStudentGroupGet(req, res) {
        db.all("SELECT * FROM student_group", (err, rows) => {
            if (err) {
                throw err;
            } 
            res.render("listStudentGroup", {
                studentGroup: rows,
                title: "Список групп"
            });
            console.log(rows)
        })
    }
router.route("/addStudentGroup")
    .get(addStudentGroupGet)
    .post(addStudentGroupPost);
    function addStudentGroupGet(req, res) {
        res.render('addStudentGroup', {
            title: 'Добавить группу'
        })
    }
    function addStudentGroupPost(req, res) {
        db.run('INSERT INTO student_group (name) VALUES (?)', [req.body.name],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect("/StudentGroup/listStudentGroup")
            console.log(req.body.name)
        })
    }
router.route("/group/:id")
    .get(studentGroupIDGet)
    function studentGroupIDGet(req, res) {
        db.get('SELECT * FROM student_group WHERE id=?', [req.params.id], (err, rows) => {
            if (err) {
                throw err;
            };
            res.render("studentGroup", {
                studentGroup: rows,
                title: "Студенческая группа"
            });
            console.log(rows);
        });
    };
router.route("/group/updateStudentGroup/:id")
    .post(studentGroupUpdate)
    function studentGroupUpdate(req, res) {
        console.log(req.body);
        db.run('UPDATE student_group SET name=? WHERE id=?', [req.body.name, req.params.id], 
            (err) => {
                if (err) {
                    throw err;                    
                }
            res.redirect("/StudentGroup/listStudentGroup");
            }
        );
    };
router.route("/group/deleteStudentGroup/:id")
    .post(studentGroupDelete)
    function studentGroupDelete(req, res) {
        console.log(req.params.id)
        db.run('DELETE FROM student_group WHERE id=?', [req.params.id], 
            (err) => {
                if (err) {
                    throw err;
                }
            res.redirect("/StudentGroup/listStudentGroup");
            }
        );
    };


