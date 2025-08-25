jQuery(document).ready(function() {
    getTeacherForSubjectStudentGroup()
    getSubjectForSubjectStudentGroup()
    $("#subject_id").on('change',function () {
        getTeacherForSubjectStudentGroup()
    });
    console.log(1)


})

function getSubjectForSubjectStudentGroup() {
    var student_group_id = $("#studentGroupID").val()
    var param = {
        studentGroupID: student_group_id
    }

    $("#subject_id").empty()

    $.ajax({
        type: "POST",
        url: "/subjects/getSubjectForSubjectStudentGroup",
        data: param,
        dataType: "json"
    }).done(function(data) {
        for (var i in data) {
            $('#subject_id').append('<option value='+data[i].id+'>' + data[i].name + '</option>');

        }
    })
}
function getTeacherForSubjectStudentGroup() {
    var subject_id = $("#subject_id").val();
    var param = {
        subjectID: subject_id
    }
    $("#teacher_id").empty()
    $.ajax({
        type: "POST",
        url: "/subjects/getTeacherForSubjectStudentGroup",
        data: param,
        dataType: "json"
    }).done(function(data) {
        console.log(data)
        console.log("CHECK")
        for(var i in data) {
            console.log(data[i].name)
            $('#teacher_id').append('<option value='+data[i].id+'>' + data[i].name + '</option>');
        }
    })
}
function getSubjectsForTeacher(){
    // получаем идентификатор выбранного в списке преподавателя
    var teacher_id = $("#teacher_id").val();
    // записываем его в параметры, которые будем отправлять на сторону сервера в теле запроса
    var param = {
        teacher_id: teacher_id
    };
    console.log(teacher_id)
    // очищаем список предметов
    $('#subject_id option').remove();

    // второй способ очистки списка
    // $('#subject_id').empty();

    // делаем запрос к серверу при помощи AJAX
    $.ajax({
            type: "POST", // указываем тип запроса
            url: "/subjects/getSubjectsForTeacher", // указываем адрес обработчика
            data: param, // передаём параметры
            dataType: "json" // тип данных, которые ожидаются от сервера
        }).done(function (data) { // обрабатываем результат
            for (var i in data) {
                // в список выбора с идентификатором subject_id (id="subject_id") добавляем элементы выпадающего списка,
                // элементами являются те дисциплины, которые ведёт преподаватель
                $('#subject_id').append('<option value='+data[i].id+'>' + data[i].name + '</option>');
                // $('#select').prepend('<option value="">новый option</option>');

            }
        });
}