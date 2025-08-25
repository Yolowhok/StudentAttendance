

jQuery(document).ready(function() {
    $("#containerV").css('visibility', 'hidden');
    $(".col.btn.nameGroup.jqueryHover").on("click", function() {
        let value = $(this).attr("value");
        $(this).toggleClass("Activate")
        setPanel(value)
        let params = {
            student_group_id: value
        }
        getSubjectsForGroup(params)
    })
    $("#textID").hover(function() {
        if($("#containerV").is(":hidden") || $("#containerV").css("visibility") == "hidden" || $("#containerV").css('opacity') == 0) {
            deleteActiveClass()
        }
    })
})
$(document).mouseup(function(e){
    var container = $("#ulID");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        unsetVisible()
    }
    
});
function getSubjectsForGroup(parametres) {
    let params = parametres;

    $('#ulID').empty();
    $.ajax({
        type: "POST", // указываем тип запроса
        url: "/subjects/getSubjectForStudentGroup", // указываем адрес обработчика
        data: params, // передаём параметры
        dataType: "json" // тип данных, которые ожидаются от сервера
    }).done(function (data) { 
        console.log(data)

        if (data.length==0) {
            $('#ulID').append(`
                                    <div id="divIDForEmptySubjects">
                                        <div class="row"> 
                                            <span class="script-for-listSubjectStudentGroup"> Предметы не назначены </span>
                                        </div>
                                        <div class="row"> 
                                            <span>
                                                <a href="/subjects/addSubjectForStudentGroup/`+`"> назначить </a>
                                            </span>
                                        </div>
                                    </div>`)
        } else {
            for (var i in data) {
                $('#ulID').append(`<li class="list-group-item nameGroup" id="testLiId">
                                    <div class="row nameGroup" id="btnIDForSubject">
                                        <btn class="col btn nameGroup" disabled>` +data[i].name+ `</a>
                                    </div>
                                </li>`)
            }
        }
    });
}
function setPanel(params) {
    let lastClickIndex = params
    let arr = []
    $(".col.btn.nameGroup.jqueryHover").each(function() {
        if($(this).hasClass("Activate")) {
            arr.push($(this).attr("value"))
        }     
    })
    console.log(arr)
    switch (arr.length) {
        case 0:
            unsetVisible()
            break;
        case 1:
            setVisible()
            break;
        default:
            deleteActiveClass()
            $(".col.btn.nameGroup.jqueryHover").each(function() {
                if($(this).attr("value")==lastClickIndex) {
                    $(this).addClass("Activate")
                    setVisible()
                }
            })
            break;
        }
        
}
function unsetVisible() {
    $("#containerV").css('visibility', 'hidden');
}
function setVisible() {
    $("#containerV").css('visibility', 'visible');
}
function deleteActiveClass() {
    $(".col.btn.nameGroup.jqueryHover").each(function() {
        if($(this).hasClass("Activate")) {
            $(this).removeClass("Activate")
        }
    })
}
function consoleClass() {
    $(".col.btn.nameGroup.jqueryHover").each(function() {
        console.log($(this).attr("class"))
    })
}
