window.onload = function() {
    textAreaAJAX()
    $("#button-edit-description").on('click', (function() {
        $("#value-edit-description").toggle("div-none");
        $("#form-edit-description").toggle("div-none");
        textAreaAJAX()
    }));
    $("#form-for-update-subject").submit(function() {
    })
    console.log("TEST")

}

function textAreaAJAX() {
    var editor = CKEDITOR.instances.addSubjectEditor;

    $('#testSpanForTextArea').html( editor.getData() )
    console.log(editor.getData())
}