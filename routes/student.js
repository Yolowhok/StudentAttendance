var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js

var router = express.Router();

var db = require("./database.js");

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;


// var studentiki = [
//     { 
//         id: 1,
//         firstname: "Karl",
//         lastname: "Marx",
//         surname: "Heinrich",
//         birthday: "05.05.1818",
//         phoneNumber: null
//     },
//     {
//         id: 2,
//         firstname: "Vladimir",
//         lastname: "Lenin",
//         surname: "Ilyich",
//         birthday: "22.04.1870",
//         phoneNumber: null
//     }
// ];

// router.get("/listStudents", function(req, res)  {
//     res.render("listStudents", {
//         students: studentiki,
//         title: "Список студентов"
//     });  
// });  

////

router.get("/listStudents", function(req, res)  {
    db.all(`SELECT student.*, student_group.name as student_group_name from student
            INNER JOIN student_group 
                ON student.student_group_id = student_group.id`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("listStudents", {
            students: rows,
            title: "Список студентов"
        });
        // console.log(rows)
    });
});
// :id — параметр запроса
router.get("/stud/:id", function(req, res)  {
    var student_id = req.params.id;

    db.get(`SELECT student.*, student_group.name as student_group_name FROM student
    INNER JOIN student_group
        ON student_group.id=student.student_group_id 
            WHERE student.id = ?`, [req.params.id], (err, row) => {
                if (err) {
                    throw err;
                }
                var student = row;
                db.all(`SELECT * FROM Student_group`, (err, row) => {
                    if (err) {
                        throw err;
                    }
                    res.render("student", {
                        student: student,
                        studentGroups: row,
                        title: "Студент"
                    });
                    // console.log("dsds")
                    // console.log(student)

                })
            })
});

router.post("/stud/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req.body)
    
    // переход по адресу localhost:3000/listStudents
    res.redirect("/students/listStudents");
}); 


router.route("/updateStudent/:id")
    .post(updateStudentPost)
function updateStudentPost(req, res) {
    db.run(
        'UPDATE student SET name=?, birth_date=?, student_group_id=? WHERE id=?',
        [req.body.name, req.body.birth_date, req.body.student_group_id, req.params.id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect("/students/listStudents");
}
    );
}

router.route("/deleteStudent/:id")
    .post(deleteStudentPOST)
function deleteStudentPOST(req, res) {
    db.run(`DELETE FROM student WHERE id = ?`, [req.params.id], (err) => {
        if (err) {
            throw err;
        }
        res.redirect("/students/listStudents");
        // console.log(req.params)
    })
}


///////
router.route("/addStudent")
    .get(addStudentGet)
    .post(addStudentPost)
function addStudentGet(req, res) {
    var studentGroupROWS = db.all(`SELECT * FROM Student_group`, (err, studentGroupROWS, ) => {
        if (err) {
            throw err;
        }
        console.log(studentGroupROWS);
        res.render("addStudent", {
            studentGroup: studentGroupROWS,
            title: "Добавление студента"
        })
    });


}
function addStudentPost(req, res) {

    db.run('INSERT INTO Student (name, birth_date, student_group_id) VALUES (?, ?, ?)', 
        [req.body.name, req.body.birth_date, req.body.student_group_id], (err, row) => {
            if (err) {
                throw err;
            }
            res.redirect("listStudents")
        })

}



// получение id студента из параметров запроса
// // :id — параметр запроса
// router.get("/stud/:id", function(req, res)  {
//     // получение id студента из параметров запроса
//     var student_id = req.params.id;

//     // Поиск студента в массиве.
//     // 1 способ - плохой способ (лучше закомментируйте его или удалите :)
//     // var student = students[student_id-1];
//     // 2 способ
//     var studentik = studentiki.find(item => item.id == student_id);

//     res.render("student", {
//         student: studentik,
//         title: "Студент"
//     });
// });