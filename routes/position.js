var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js

var router = express.Router();

var db = require("./database.js");


// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;


router.route("/listPosition")
    .get(positionListGET)
    function positionListGET(req, res){
        db.all(`SELECT * FROM position`, (err, row) => {
            if (err) {
                throw err
            }
            res.render("listPosition", {
                position: row,
                title: "Список должностей"
            })
            console.log(row)
        })
    }

router.route("/p/:id")
    .get(positionIDGET)
    function positionIDGET(req, res) {
        db.get(`SELECT * FROM position WHERE id = ?`, [req.params.id], (err, row) => {
            if (err) {
                throw err
            }
            res.render("position", {
                position: row,
                title: "Должность"
            })
        })
    }

router.route("/addPosition")
    .get(addPositionGET)
    .post(addPositionPOST)
    function addPositionGET(req, res) {
        res.render("addPosition", {
            title: "Добавить должность"
        })
    }
    function addPositionPOST(req, res) {
        db.run(`INSERT INTO position (name) VALUES (?)`, [req.body.name], (err) => {
            if (err) {
                throw err;
            }
            res.redirect("/position/listPosition")
        })
        console.log(req.body)
    }

router.route("/updatePosition/:id")
    .post(updatePositionPOST)
    function updatePositionPOST(req, res) {
        db.run(`UPDATE position SET name = ? WHERE id = ?`, [req.body.name, req.params.id], (err) => {
            if (err) {
                throw err
            }
            res.redirect("/position/listPosition")
        })
    }
router.route("/deletePosition/:id")
    .post(deletePositionPOST)
    function deletePositionPOST(req, res) {
        db.run(`DELETE FROM position WHERE id = ?`, [req.params.id], (err) => {
            if (err) {
                throw err
            }
            res.redirect("/position/listPosition")

        })
        console.log(req.params)
    }