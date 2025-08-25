var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js

var router = express.Router();

var db = require("./database.js");


// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;


router.route("/listTeachers")
    .get(listTeachersGET)
    function listTeachersGET(req, res) {
        db.all(`SELECT teacher.*, position.name as position_name FROM teacher
        INNER JOIN position
            ON teacher.position_id = position.id`, (err, row) => {
                if (err) {
                    throw err;
                }
                res.render("listTeachers", {
                    teachers: row,
                    titile: "Список преподавателей"
                })
                console.log(row)
            })
    }
router.route("/addTeacher")
    .get(addTeacherGET) 
    .post(addTeacherPOST)
    function addTeacherGET(req, res) {
        db.all(`SELECt * FROM position`, (err, row) => {
            if (err) {
                throw err;
            }
            res.render("addTeacher", {
                position: row,
                title: "Добавить преподавателя"
            })
        })
    }
    function addTeacherPOST(req, res) {
        db.run(`INSERT INTO teacher (name, position_id) VALUES (?, ?)`, [req.body.name, req.body.position], (err) => {
            if (err) {
                throw err;
            }
            res.redirect("listTeachers")
        })
        console.log(req.body)
        console.log(req.params)


    }
router.route("/teacher/:id")
    .get(teacherIDGET)
    function teacherIDGET(req, res) {
        db.get(`SELECT teacher.*, position.name as position_name FROM teacher
        INNER JOIN position
            ON teacher.position_id = position.id
                WHERE teacher.id = ? `, req.params.id, (err, row) => {
            if (err) {
                throw err;
            }
            teacher = row
            db.all(`SELECT * FROM position`, (err, row) => {
                if (err) {
                    throw err;
                }
                res.render("teacher", {
                    teacher: teacher,
                    position: row,
                    title: "Преподаватель"
                })
                console.log(row)
            })
            
        })
    }
router.route("/teacher/updateTeacher/:id")
    .post(updateTeacherPOST)
    function updateTeacherPOST(req, res) {
        db.run(`UPDATE teacher SET name =?, position_id =? WHERE id =?`, [req.body.name, req.body.position, req.params.id], (err) => {
            if (err) {
                throw err;
            }
            res.redirect("/teachers/listTeachers")
        })
        console.log(req.params)
        console.log(req.body)
        // res.redirect("/teachers/listTeachers")
    }
router.route("/teacher/deleteTeacher/:id")
    .post(deleteTeacherPOST)
    function deleteTeacherPOST(req, res) {
        db.run(`DELETE FROM teacher WHERE id = ?`, [req.params.id], (err) => {
            if (err) {
                throw err;
            }
            res.redirect("/teachers/listTeachers")
            console.log(req.params)
        })
    }

//Все обработчики маршрутов, которые потребуются для работы с таблицей subject_teacher будем размещать в файле teacher.js.
router.route("/listSubjectTeacher")
    .get(listSubjectTeacherGET)
    function listSubjectTeacherGET(req, res) {
        db.all(`SELECT subject.id AS subject_id, subject.name AS subject_name, teacher.id AS teacher_id, teacher.name AS teacher_name
            FROM subject_teacher
                INNER JOIN subject ON subject.id = subject_teacher.subject_id
                INNER JOIN teacher ON teacher.id = subject_teacher.teacher_id`, (err, row) => {
                    if (err) {
                        throw err
                    }
                    res.render("listSubjectTeacher", {
                        subjectTeacher: row,
                        title: "Дисциплины преподавателей"
                    })
                })
    }

router.route("/addSubjectTeacher")
    .get(addSubjectTeacherGET)
    .post(addSubjectTeacherPOST)
    function addSubjectTeacherGET(req, res) {
        db.all(`SELECT * FROM teacher`, (err, row) => {
            if (err) {
                throw err;
            }
            var teacher = row
            db.all(`SELECT * FROM subject`, (err, sub) => {
                if (err) {
                    throw err;
                }
                var subject = sub
                res.render("addSubjectTeacher", {
                    subject: subject,
                    teacher: teacher,
                    title: "Добавление записи"
                })
            })
        })
    }
    function addSubjectTeacherPOST(req, res) {
        db.run(`INSERT INTO subject_teacher (subject_id, teacher_id) VALUES (?, ?)`, [req.body.subject_id, req.body.teacher_id], (err) => {
            if (err) {
                throw err;
            }
            res.redirect("listSubjectTeacher")
        })
    }
router.route("/deleteSubjectTeacher/teacherID=:teacher_id/subjectID=:subject_id")
    .post(deleteSubjectTeacherPOST)
    function deleteSubjectTeacherPOST(req, res) {
        db.run(`DELETE FROM subject_teacher WHERE teacher_id = ? AND subject_id = ?`, [req.params.teacher_id, req.params.subject_id], (err) => {
            if (err) {
                throw err;
            }
            res.redirect("/teachers/listSubjectTeacher")
        })
    }