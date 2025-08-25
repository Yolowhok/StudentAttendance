jQuery(document).ready(function() {
    getSubjectForNotTeacher()
    $("#st_teacher_id").on('change', function () {
        getSubjectForNotTeacher()
    })
})
function getSubjectForNotTeacher() {
    var teacher_id = $("#st_teacher_id").val();
    var params = {
        teacher_id: teacher_id
    }
    $("#st_subject_id option").remove();
    $.ajax(
        {
            type: "POST",
            url: "/subjects/getSubjectsForNotTeacher",
            data: params,
            dataType: "json"
        }).done(function (data) {
            console.log(data)
            for (var i in data) {
                $("#st_subject_id").append('<option value=' + data[i].id + '>' + data[i].name + '</option');
            }
        });
}