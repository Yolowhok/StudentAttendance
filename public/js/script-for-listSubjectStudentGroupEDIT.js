jQuery(document).ready(function() {
    getSubjectsForGroupEDIT()
    $("#st_student_group_id").on("change", function() {
        getSubjectsForGroupEDIT()
    })
})
function getSubjectsForGroupEDIT() {
    var student_group_id = $("#st_student_group_id").val();
    var params = {
        student_group_id: student_group_id
    }
    $("#st_subject_id_for_student_group").empty()

    $.ajax({
        type: "POST",
        url: "/subjects/getSubjectsForStudentGroupEDIT",
        data: params,
        dataTypes: "json"}).done(function(data) {
            // console.log(data[0].id)
            for (var i in data) {
                console.log(data[i].id)
                console.log(data[i].name)

                $("#st_subject_id_for_student_group").append('<option value=' + data[i].id+'>'+ data[i].name +'</option>')
            }
        })


}