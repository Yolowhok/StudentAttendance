$(document).ready(function() {
    deleteSubjectForStudentGroup()
    $("#st_student_group_id_delete").on('change', function() {
        deleteSubjectForStudentGroup()
    })
})

function deleteSubjectForStudentGroup() {
    var student_group_id = $("#st_student_group_id_delete").val();
    var params = {
        studentGroupID: student_group_id
    }

    $("#st_subject_id_for_student_group_delete").empty()

    $.ajax({
        type: "POST",
        url: "/subjects/getSubjectForStudentGroupDELETE",
        data: params,
        dataType: "json"
    }).done(function(data) {
        console.log(data)
        for(var i in data) {
            $("#st_subject_id_for_student_group_delete").append(
                '<option value=' + data[i].id + '>' + data[i].name +'</option>')
        }
    })
    console.log(params)
}