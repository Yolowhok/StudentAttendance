window.onload = function() {
    console.log(window.jQuery ? "jquery working" : "doesnt Work " )
    console.log(CKEDITOR.version, "CKEDITOR")

    $("#form-for-update-subject").submit(function() {

    })

}




// jQuery(document).ready(function() {
//     getSubjectForNotTeacher()
//     getSubjectsForTeacher()

//     $("#teacher_id").on('change',function () {
//         getSubjectsForTeacher()
//     });
//     $("#st_teacher_id").on('change', function () {
//         getSubjectForNotTeacher()
//     })
// })
// function getSubjectsForTeacher(){
//     // получаем идентификатор выбранного в списке преподавателя
//     var teacher_id = $("#teacher_id").val();
//     // записываем его в параметры, которые будем отправлять на сторону сервера в теле запроса
//     var param = {
//         teacher_id: teacher_id
//     };
//     console.log(teacher_id)
//     // очищаем список предметов
//     $('#subject_id option').remove();

//     // второй способ очистки списка
//     // $('#subject_id').empty();

//     // делаем запрос к серверу при помощи AJAX
//     $.ajax({
//             type: "POST", // указываем тип запроса
//             url: "/subjects/getSubjectsForTeacher", // указываем адрес обработчика
//             data: param, // передаём параметры
//             dataType: "json" // тип данных, которые ожидаются от сервера
//         }).done(function (data) { // обрабатываем результат
//             for (var i in data) {
//                 // в список выбора с идентификатором subject_id (id="subject_id") добавляем элементы выпадающего списка,
//                 // элементами являются те дисциплины, которые ведёт преподаватель
//                 $('#subject_id').append('<option value='+data[i].id+'>' + data[i].name + '</option>');
//                 // $('#select').prepend('<option value="">новый option</option>');

//             }
//         });
// }
// function getSubjectForNotTeacher() {
//     var teacher_id = $("#st_teacher_id").val();
//     var params = {
//         teacher_id: teacher_id
//     }
//     $("#st_subject_id option").remove();
//     $.ajax(
//         {
//             type: "POST",
//             url: "/subjects/getSubjectsForNotTeacher",
//             data: params,
//             dataType: "json"
//         }).done(function (data) {
//             console.log(data)
//             for (var i in data) {
//                 $("#st_subject_id").append('<option value=' + data[i].id + '>' + data[i].name + '</option');
//             }
//         });
// }