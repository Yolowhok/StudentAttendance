var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js

//Подключите модуль uuid в файле subject.js:
var uuid = require ('uuid');

// Подключите модуль fs в файле subject.js:
var fs = require('fs');

// Подключите модуль connect-multiparty в файле subject.js:
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var router = express.Router();

var db = require("./database.js");


// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;


var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
var dbTransaction = new TransactionDatabase(db);
//*********************************** SUBJECT FOR TEACHER ***********************************

router.route("/listSubjects")
    .get(listSubjectsGET)
    function listSubjectsGET(req, res) {
        db.all(`SELECT * FROM subject`, (err, row) => {
            if (err) {
                throw err;
            }
            res.render("listSubjects", {
                subjects: row,
                title: "Список предметов"
            })
            console.log(row)

        })
    }
router.route("/sub/:id")
    .get(subjectONEGET)
    function subjectONEGET(req, res) {
        db.get(`SELECT * FROM subject WHERE id = ?`, [req.params.id], (err, row) => {
            if (err) {
                throw err;
            }
            res.render("subject", {
                subject: row,
                title: row.name
            })

        })
    }
router.route("/sub/updateSubject/:id")
    .post(updateSubjectPOST)
    function updateSubjectPOST(req, res) {
        db.run(`UPDATE subject SET name = ?, description = ? WHERE id = ?`, [req.body.name, req.body.description, req.params.id], (err) => {
            if (err) {
                throw err
            }
            console.log(req.body.name, req.body.description, req.params.id)
            res.redirect("/subjects/listSubjects")
        })
    }
router.route("/sub/deleteSubject/:id")
    .post(deleteSubjectPOST) 
    function deleteSubjectPOST(req, res) {
        db.run(`DELETE FROM subject WHERE id = ?`, req.params.id, (err) => {
            if (err) {
                throw err;
            }
            res.redirect("/subjects/listSubjects")
        })
    }
router.route("/addSubject")
    .get(addSubjectGET)
    .post(addSubjectPOST)
    function addSubjectGET(req, res) {
        res.render("addSubject", {
            title: "Добавить предмет"
        })
    }
    function addSubjectPOST(req, res) {
        db.run(`INSERT INTO subject (name, description) VALUES (?, ?)`, [req.body.name, req.body.description], (err) => {
            if (err) {
                throw err
            }
            res.redirect("listSubjects")
            
        })
    }


//*********************************** SUBJECT FOR STUDENT GROUP ***********************************

router.route("/listSubjectStudentGroup")
    .get(listSubjectStudentGroupGET)
    function listSubjectStudentGroupGET(req, res) {
        db.all(`SELECT * FROM student_group`, (err, row) => {
            if (err) {
                throw err;
            }
            res.render("listSubjectStudentGroup", {
                title: "Предметы групп",
                subjectStudentGroup: row
            })
        })
    }


//*********************************** AJAX & JQUERY ***********************************
// ADD ATTENDANCE MARK TEACHER-SUBJECT
router.route("/getSubjectsForTeacher")
    .post(getSubjectsForTeacher)
    function getSubjectsForTeacher(req, res) {
        db.all(
            `SELECT subject.* FROM subject_teacher
            INNER JOIN subject ON subject.id = subject_teacher.subject_id
            WHERE teacher_id = ?`,
            req.body.teacher_id, (err, rows) => {
            if (err) {
                throw err;
            }
            // ранее применяли функции render (отрисовка страницы) и redirect (переход по ссылке)
            // в этом обработчике используем функцию send для того, чтобы только вернуть данные из базы данных на сторону клиента
            res.send(JSON.stringify(rows));

            console.log(rows)
            console.log(JSON.stringify(rows))

        });
    }
// ADD SUBJECT TEEACHER
router.route("/getSubjectsForNotTeacher")
    .post(getSubjectForNotTeacher)
    function getSubjectForNotTeacher(req, res) {
        db.all(`SELECT * FROM subject
        WHERE id NOT IN (
            SELECT subject_teacher.subject_id 
            FROM subject_teacher 
            WHERE subject_teacher.teacher_id = ?)`, req.body.teacher_id, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    res.send(JSON.stringify(rows))
                })
    }


// ADD STUDENT GROUP SUBJECT
router.route("/getSubjectForStudentGroup")
    .post(getSubjectForStudentGroup)
    function getSubjectForStudentGroup(req, res) {
        var arrayStudents = req.body.student_group_id;
        db.all(`SELECT * FROM student_group
        inner join subject_student_group
            on student_group.id = subject_student_group.student_group_id
        inner join subject
            on subject_student_group.subject_id = subject.id
        where student_group.id = ?`, req.body.student_group_id, (err, rows) => {
            if (err) {
                throw err;
            }
            res.send(JSON.stringify(rows))
            console.log(rows)
            console.log("DADADDADA")

        })
    }
router.route("/addSubjectForStudentGroup")
    .get(addSubjectForStudentGroupGET) 
    .post(addSubjectForStudentGroupPOST)
    function addSubjectForStudentGroupGET (req, res) {
        db.all(`SELECT * FROM subject`, (err, row) => {
            if (err) {
                throw err;
            }
            subject = row
            
            db.all(`SELECT * FROM student_group`, (err, row) => {
                if (err) {
                    throw err;
                }
                studentGroup = row
                res.render("addSubjectStudentGroup", {
                    title: "Добавить предмет группе",
                    studentGroup: studentGroup,
                    subject: subject
                })
                console.log(studentGroup)
            })
        })
    }
    function addSubjectForStudentGroupPOST(req, res) {
        db.run(`INSERT INTO subject_student_group (student_group_id, subject_id)
        VALUES (?, ?)`, [req.body.student_group_id, req.body.subject_id],
            (err) => {
                if (err) {
                    console.log("not changed")
                    throw err
                }
                console.log(req.body.student_group_id)
                console.log("changed")
                res.redirect("/subjects/listSubjectStudentGroup")
            } )
    }

//*********************************** AJAX & JQUERY ***********************************
//ADD STUDENT GROUP SUBJECT
router.route("/getSubjectsForStudentGroupEDIT")
    .post(getSubjectsForStudentGroupEDIT)
    function getSubjectsForStudentGroupEDIT(req, res) {
        db.all(`SELECT * FROM subject
        WHERE id NOT IN (
            SELECT subject_student_group.subject_id FROM subject_student_group
                WHERE subject_student_group.student_group_id = ?)`, req.body.student_group_id, (err, rows) => {
                    if (err) {
                        throw err;
                    }

                    res.send((rows))

                    // console.log(JSON.stringify(row))
                })
    }
router.route("/deleteSubjectForStudentGroup")
    .get(deleteSubjectForStudentGroupGET)
    .post(deleteSubjectForStudentGroupPOST)
    function deleteSubjectForStudentGroupGET(req, res) {
        db.all(`SELECT * FROM student_group`, (err, row) => {
            if (err) {
                throw err;
            }
            res.render("deleteSubjectForStudentGroup", {
                title: "Удалить группу",
                studentGroup: row
            })
        })
    } 
    function deleteSubjectForStudentGroupPOST(req, res) {
        db.run(`DELETE FROM subject_student_group
        WHERE subject_id = ? AND student_group_id = ?`, [req.body.subject_id, req.body.student_group_id], (err)=> {
            if (err) {
                throw err;
            }
            res.redirect("deleteSubjectForStudentGroup")
        })
    }
//*********************************** AJAX & JQUERY ***********************************
//DELETE SUBJECT FOR STUDENT GROUP
router.route("/getSubjectForStudentGroupDELETE")
    .post(getSubjectForStudentGroupDELETE)
    function getSubjectForStudentGroupDELETE(req, res) {
        db.all(`SELECT * FROM subject
        inner join subject_student_group on subject_student_group.subject_id = subject.id
        WHERE subject_student_group.student_group_id = ?`, [req.body.studentGroupID], (err, row)=> {
            if (err) {
                throw err;
            }
            res.send(row)
            console.log(row)
        })
    }


//*********************************** AJAX & JQUERY GET TEACHER FOR SUBJECT STUDENT UPDATE ***********************************
router.route("/getTeacherForSubjectStudentGroup")
    .post(getTeacherForSubjectStudentGroup)
    function getTeacherForSubjectStudentGroup(req, res) {
        db.all(`SELECT * FROM teacher 
        inner join subject_teacher on subject_teacher.teacher_id = teacher.id
        WHERE subject_id = ?`, req.body.subjectID, (err, row) => {
            if (err) {
                throw err
            }
            res.send(row)
            console.log(row, "da")
            console.log(req.body.subjectID, "da")
        })
    }
router.route("/getSubjectForSubjectStudentGroup")
    .post(getSubjectForSubjectStudentGroup)
    function getSubjectForSubjectStudentGroup(req, res) {
        db.all(`SELECT * FROM SUBJECT 
        inner join subject_student_group on subject.id = subject_student_group.subject_id
            where subject_student_group.student_group_id = ?`, [req.body.studentGroupID], (err, row) => {
                if (err) {
                    throw err;
                }
                res.send(row)
            })
    }

//*********************************** UPLOAD IMAGE ON SERVER ***********************************
router.post('/uploader', multipartMiddleware, function(req, res) {
    var expansion = req.files.upload.type; // тип файла указывается так: image/png
    expansion = expansion.split('/')[1]; // из "image/png" нам нужно извлечь только png, чтобы добавить к имени файла его расширение
    fs.readFile(req.files.upload.path, function (err, data) {
        var newName = uuid.v4() + "." + expansion; // вызываем функцию v4() для того, чтобы уникальный идентификатор был сгенерирован случайным образом
        var newPath = __dirname + '/../public/uploads/' + newName;
        console.log(newPath);
        fs.writeFile(newPath, data, function (err) {
            if (err) {
                throw err;
            }
            else {
                html = "<script type='text/javascript'>" +
                        "var funcNum = " + req.query.CKEditorFuncNum + ";" +
                        "var url     = \"/uploads/" + newName + "\";" +
                        "var message = \"Файл успешно загружен\";" +
                        "window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);" +
                        "</script>";
                res.send(html);
            }
        });
    });
});