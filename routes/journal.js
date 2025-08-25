var express = require("express");

// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

var db = require("./database.js");


// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

var isAuth = require('./isAuth');


// Установите модуль npm install sqlite3-transactions.
// В файл journal.js подключите модуль sqlite3-transactions и создайте объект dbTransaction:

var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
var dbTransaction = new TransactionDatabase(db);

router.get("/attendanceJournal", isAuth.isAuthenticated, function(req, res,  next)  {
    db.all('SELECT * FROM student_group', (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("attenDanceJournal", {
            studentGroup: rows,
            title: "Журнал посещаемости"
        });
    });
});

// router.route("/attendanceJournal")
//     .get(attendanceJournalGET)
//     function attendanceJournalGET(req, res) {
//         db.all(`SELECT * FROM student_group`, (err, row) => {
//             if (err) {
//                 throw err
//             }
//             res.render("attenDanceJournal", {
//                 studentGroup: row,
//                 title: "Журнал посещаемости группы"
//             })
//         })
//     }

router.route("/attenDanceJournal/studentGroupID=:student_group_id")  
    .get(attendanceStudentGroupGET)
    function attendanceStudentGroupGET(req, res) {
        db.all(
            `SELECT * FROM journal WHERE student_group_id=? ORDER BY journal.data_subject`,
            [req.params.student_group_id], (err, rows) => {
            if (err) {
                throw err;
            }
            // затем получаем записи из таблицы journal_student, в которой хранятся данные отметок посещаемости студентов
            var journal = rows;

            db.all(
                `SELECT journal_student.attendance, student.name as student_name, student.id as student_id, journal.data_subject FROM student
                LEFT JOIN journal ON journal.student_group_id=student.student_group_id
                LEFT JOIN journal_student ON journal_student.journal_id=journal.id AND journal_student.student_id=student.id
                WHERE student.student_group_id=?
                ORDER BY student.id, journal.data_subject`, [req.params.student_group_id], (err, rows) => {
                if (err) {
                    throw err;
                }
                // получаем данные студенческой группы, поскольку на странице будем выводить её наименование
                var journalStudent = rows;
                db.get('SELECT * FROM student_group WHERE id=?', [req.params.student_group_id], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    // console.log("req.params.id ", req.params.student_group_id)
                    // console.log("journal ", journal)
                    // console.log("journalStudent ", journalStudent)
                    // console.log("rows ", rows)
                    // console.log("req.params.student_group_id ", req.params.student_group_id)
                    res.render("attendanceStudentGroup", {
                        journal: journal,
                        journalStudent: journalStudent,
                        studentGroup: rows,
                        studentGroupId: req.params.student_group_id,
                        title: "Журнал посещаемости группы"
                    });
                });
    
            });
        });
    }


router.route("/addAttendanceMark/studentGroupId=:student_group_id")
    .get(addAttendanceMarkGET)
    .post(addAttendanceMarkPOST)
    function addAttendanceMarkGET(req, res) {
        db.all('SELECT * FROM teacher', (err, rows) => {
            if (err) {
                throw err;
            }
            var teachers = rows;
            db.all('SELECT * FROM subject', (err, rows) => {
                if (err) {
                    throw err;
                }
                var subjects = rows;
                db.all('SELECT * FROM student WHERE student_group_id=?', [req.params.student_group_id], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    var students = rows;
                    db.get('SELECT * FROM student_group WHERE id=?', [req.params.student_group_id], (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        res.render("addAttendanceMark", {
                            teachers: teachers,
                            subjects: subjects,
                            students: students,
                            studentGroup: rows,
                            title: "Добавление отметки посещаемости"
                        });
                    });
                });
            });
        });
    }
    function addAttendanceMarkPOST(req, res) {
        // получаем массив идентификаторов студентов, для которых нужно добавить отметку посещаемости
        var arrayStudents = req.body.array_students_id;
        // добавляем следующую проверку: если arrayStudents не является массивом и не имеет значение undefined, то значит в списке был один студент
        // если один студент, то отметка посещаемости тоже одна и в таком случае передаётся на сторону сервера только одно значение не в массиве
        // если отметок посещаемости несколько, то все они передаются в одном массиве

        if (Array.isArray(arrayStudents) == false && arrayStudents!==undefined){
            arrayStudents = [];
            arrayStudents.push(req.body.array_students_id);
        }

        // проверяем, что arrayStudents является массивом, поскольку, если в группе нет студентов, то arrayStudents будем иметь тип undefined
        if (Array.isArray(arrayStudents) == true ) {

            dbTransaction.beginTransaction(function (err, transaction) {
                transaction.run(
                    'INSERT INTO journal(subject_id, teacher_id, student_group_id, data_subject) VALUES (?,?,?,?)',
                    [req.body.subject_id, req.body.teacher_id, req.params.student_group_id, req.body.data_subject],
                    function (err) {
                        if (err) {
                            throw err;
                        }
                        // получаем идентификатор добавленной записи в journal (этот идентификатор потребуется для добавления записей в journal_student, поскольку нужно указывать ссылку на запись из таблицы journal) 
                        var journal_id = this.lastID;
                        var journal_student = [];
                        for (var i = 0; i < arrayStudents.length; i++) {
                            console.log(req.body["attendance"+i], " check")

                            // сначала добавляем идентификатор студента
                            journal_student.push(arrayStudents[i]);
                            // определяем отметку посещаемости
                            // если нашли в теле запроса отметку посещаемости, то значит была установлена галочка (если галочка не поставлена, то информация по отметке не отправляется из формы на сервер)
                            if (req.body["attendance" + i] != null) {
                                journal_student.push(1);
                            }
                            else {
                                journal_student.push(0);
                            }
                            journal_student.push(journal_id);
                        }
                        var placeholders = arrayStudents.map((id) => '(?,?,?)').join(',');
                        // console.log(req.body.attendance0)
                        // console.log(arrayStudents)
                        // console.log(placeholders)
                        // console.log(journal_student)
                        // INSERT INTO journal_student(student_id, attendance, journal_id) VALUES (?,?,?)x arrayStudents.length
                        // jpurnal student = 
                        transaction.run(
                            'INSERT INTO journal_student(student_id, attendance, journal_id) VALUES ' + placeholders,
                            journal_student,
                            function (err) {
                                if (err) {
                                    throw err;
                                }
                                // фиксируем транзакцию
                                transaction.commit(function (err) {
                                    if (err) {
                                        throw err;
                                    }
                                    // в случае успешного выполнения транзакции переходим к странице с отметками посещаемости группы
                                    res.redirect('/attendanceJournal/studentGroupId=' + req.params.student_group_id);
                                });
                            });
                    });
            });
        } else {
            res.redirect("/addAttendanceMark/studentGroupId=" + req.params.student_group_id)
        }
       
    }

    //attendanceMark/journalId=" + el.id + "/studentGroupId=" + studentGroupId
router.route("/attendanceMark/journalId=:journal_id/studentGroupId=:student_group_id")
    .get(attendanceMarkGET)
    .post(attendanceMarkPOST2)
    function attendanceMarkGET(req, res) {
        // console.log(req.params, "dsdsdsd")
        db.get(
            `SELECT journal.*, teacher.name as teacher_name, teacher.id as teacher_id, subject.name as subject_name, subject.id as subject_id
            FROM journal 
            INNER JOIN teacher ON teacher.id=journal.teacher_id
            INNER JOIN subject ON subject.id=journal.subject_id
            WHERE student_group_id=? AND journal.id=? ORDER BY journal.data_subject`, [req.params.student_group_id, req.params.journal_id], (err, rows) => {
                if (err) {
                    throw err;
                }
                var journal = rows;
                // console.log(journal)
                db.all(
                    `SELECT journal_student.*, student.name as student_name, 
                    student.id as student_id, journal.data_subject 
                    FROM student
                    LEFT JOIN journal ON journal.student_group_id=student.student_group_id
                    LEFT JOIN journal_student ON journal_student.journal_id=journal.id AND journal_student.student_id=student.id
                    WHERE student.student_group_id=? AND journal.id=?
                    ORDER BY student.id, journal.data_subject`, [req.params.student_group_id, req.params.journal_id], (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        res.render("attendanceMark", {
                            journal: journal,
                            journalStudent: rows,
                            studentGroupId: req.params.student_group_id,
                            title: "Редактирование посещаемости"
                        });
                    });
        });
        // res.render("attendanceMark")
    }   
    function attendanceMarkPOST(req, res) {
        dbTransaction.beginTransaction(function (err, transaction) {
            // сначала удаляем старые отметки посещаемости
            transaction.run('DELETE FROM journal WHERE id=?', [req.params.journal_id],
                (err) => {
                    if (err) {
                        throw err;
                    }
                    var arrayStudents = req.body.array_students_id;

                    // console.log(arrayStudents)
                    if (Array.isArray(arrayStudents) == false && arrayStudents!==undefined){
                        arrayStudents = [];
                        arrayStudents.push(req.body.array_students_id);
                    }
                    // теперь добавляем новые отметки посещаемости
                    // console.log(req.body.data_subject, "DATA SUBJECT ")
                    // console.log(req.body, "REQ BODY")

                    if (Array.isArray(arrayStudents) == true ) {
                        transaction.run(
                            'INSERT INTO journal(subject_id, teacher_id, student_group_id, data_subject) VALUES (?,?,?,?)',
                            [req.body.subject_id, req.body.teacher_id, req.params.student_group_id, req.body.data_subject],
                            function (err) {
                                if (err) {
                                    throw err;
                                }
                                var journal_id = this.lastID;
                                var journal_student = [];
                                for (var i = 0; i < arrayStudents.length; i++) {
                                    journal_student.push(arrayStudents[i]);       
                                    if (req.body["attendance" + i] != null) {
                                        journal_student.push(1);
                                    }
                                    else {
                                        journal_student.push(0);
                                    }
                                    journal_student.push(journal_id);
                                }
                                var placeholders = arrayStudents.map((id) => '(?,?,?)').join(',');
                                transaction.run(
                                    'INSERT INTO journal_student(student_id, attendance, journal_id) VALUES ' + placeholders,
                                    journal_student,
                                    function (err) {
                                        if (err) {
                                            throw err;
                                        }
                                        transaction.commit(function (err) {
                                            if (err) {
                                                throw err;
                                            }
                                            res.redirect('/attendanceJournal/studentGroupID=' + req.params.student_group_id);
                                        });
                                    });
                            }
                        );
                    }
                });
            });
    }
    //POST изменение отметок посещаемости + даты без создания новой таблицы (обновление текущей UPDATE)
    function attendanceMarkPOST2(req, res) {
        dbTransaction.beginTransaction(function(err, transaction) {
            console.log(req.body, "REQ BODY attendanceMarkPOST2")
            transaction.run(`UPDATE journal SET data_subject = ? WHERE id = ?`, [req.body.data_subject, req.params.journal_id], (err) => {
                if (err) {
                    throw err
                }
                var arrayStudents = req.body.array_students_id
                var attendance = []
                for (var i = 0; i < arrayStudents.length; i++) 
                    if (req.body["attendance"+ i] != null) {
                        attendance.push(1)
                    }
                    else {
                        attendance.push(0)
                    }
                console.log("attendanceattendanceattendanceattendanceattendanceattendanceattendance",attendance)
                let zipped = arrayStudents.map((x, i) => [x, attendance[i]]);

                var placeholders = zipped.map((x) => ['WHEN ' + x[0] + ' THEN ' + x[1]].join("")).join(" ")


                transaction.run(`UPDATE journal_student SET attendance = CASE journal_student.student_id ` + placeholders + ` END ` + 
                `WHERE journal_student.journal_id = ?`, [req.params.journal_id], (err) => {
                    if (err) {
                        throw err;
                    }
                    transaction.commit(function (err){
                        if (err) {
                            throw err
                        }
                        res.redirect('/attendanceJournal/studentGroupID=' + req.params.student_group_id);
                    })
                })
            })
        })
    }

//UPDATE table_name SET column_name=new_value [, ...] WHERE expression

//UPDATE table_name SET column_name=new_value [, ...] WHERE journal = 1




// UPDATE journal_student 
// SET attendance
//  = CASE  journal_student.student_id 
// 	WHEN 1 THEN 1
// 	WHEN 3 THEN 1
// 	WHEN 12 THEN 1
// 	WHEN 19 THEN 1
// 	END
// 	WHERE journal_student.journal_id=56
    // teacher_id: '1',
    // subject_id: '1',
    // data_subject: '0232-03-12',
    // array_students_id: [ '1', '3', '12', '19' ],
    // attendance0: 'on',
    // attendance2: 'on'

router.route("/deleteAttendanceMark/journalId=:journal_id/studentGroupId=:student_group_id")
    .post(deleteAttendanceMarkPOST)
    function deleteAttendanceMarkPOST(req, res) {
        db.run(`DELETE FROM journal WHERE id = ? `, [req.params.journal_id], (err) => {
            if (err) {
                throw err
            }
            console.log("smotri suda", req.params.journal_id)
            res.redirect('/attendanceJournal/studentGroupID=' + req.params.student_group_id);
        })
    }


