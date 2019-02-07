var header = $("meta[name='_csrf_header']").attr("content");
var token = $("meta[name='_csrf']").attr("content");
var objectUtilPagination = $.extend({}, UtilPagination);


$(document).ready(function () {
    getstatus();
    getlevel();
    gettype();
    console.log("AAAA8888");
    gettypeEdit();
    getstatusEdit();
    getlevelEdit();


    setDataSearch();



    $('#txt-modal-calendar').daterangepicker({
        locale: {
            format: 'DD-MM-YYYY hh:mm A'
        }
    })
    $('#btn-claer-text').on('click', function () {
        $('#searchValueDate').val("");
        $('#search-subject').val("");
        $('#search-sender').val("");
        $('#search-responsible').val("");
        $('#search-content').val("");
        $('#search-email').val("");
        $('#search-type').val("all");
        $('#search-level').val("all");
        $('#search-status').val("all");
    })

    $('#add-responsible').on('click', function () {

        var countries = ["Chitsanu", "Yotsaporn"];
        autocomplete(document.getElementById("add-responsible"), countries);

    })
    $('#btn-add').on('click', function () {
        $('#content').empty();
        $('#content').val("");
    })

    $('#btn-Edit-modal').on('click', function () {
        console.log("***************")

        var id = $('#edit-id').text();
        console.log("-->" + id);

        //var json = JSON.parse(showAll());
        var json = jsonItem;
        var indexjson = 0;
        for (var i = 0; i < json.length; i++) {
            if (parseInt(json[i].id) == parseInt(id)) {
                indexjson = i;
            }
        }
        console.log(json[indexjson]);

        $('#edit2-id').html(json[indexjson].id);
        $('#edit2-sender').val(json[indexjson].sender);
        $('#edit2-subject').val(json[indexjson].subject);
        $('#edit2-email').val(json[indexjson].email);
        $('#edit2-type').val(json[indexjson].type);
        $('#edit2-status').val(json[indexjson].status);
        $('#edit2-level').val(json[indexjson].level);
        $('#edit2-responsible').val(json[indexjson].responsible);
        $('#edit2-content').val(json[indexjson].msg);

    })
    $('#edit-btn2').on('click', function () {
        console.log("******")
        update();
        $('#modal-alert-update').modal('show');

        setTimeout(function () {
            $('#modal-alert-update').modal('hide');
        }, 2000);
        setDataSearch();

    })

    $('#add-btn-save').on('click', function () {
        insert();
        setDataSearch();
    })
    $('#modal-btn-del').on('click', function () {
        deleteID();
        setDataSearch();
    })
    // $('#btn-search').on('click', function () {
    //     $('#modal-alert-loading').modal('show');
    //     setTimeout(function () {
    //         findNewDataMail();
    //     }, 1000)
    //
    // })
    $('#modal-find').on('click', function () {
        console.log("btn");
        customSearch();
        editSearchCustom()

    })

    $('#btn-modal-calendar').on('click', function () {
        insertCalendar();
    })
    $('#btn-search-test').on('click', function () {
        setDataSearch();
    })
    $('#btn-newLog-text').on('click', function () {

        $('#modal-alert-loading').modal('show');
        setTimeout(function () {
            findNewDataMail();
        }, 1000)


    })
    $('#searchValueDate').daterangepicker({
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
            format: 'DD-MM-YYYY HH:mm'
        }
    });

    $('#searchValueDate').val('');
});

//===============================================================

function replyMessage(id) {
    var jsonMess = jsonItem;
    var indexjson = 0;
    for (var i = 0; i < jsonMess.length; i++) {
        if (parseInt(jsonMess[i].id) == parseInt(id)) {
            indexjson = i;
        }
    }
    let json = $.ajax({
        url: session.context + "/appUsers/getReply",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        data: {messageNum: jsonMess[indexjson].messageNum},
        async: false,
        complete: function (xhr) {
            $('#modal-alert-update').modal('hide');
            console.log("complete")
        }
    }).done(function () {
        console.log('done')

        $('#modal-alert-loading').modal('hide');
    }).responseText;
}

function findBySenderAndType() {
    var x;
    if (($('#ch-line').is(':checked')) && $('#ch-email').is(':checked')) {
        console.log("email and line checked");
        x = "";
    } else if ($('#ch-line').is(':checked')) {
        console.log("line checked");
        x = "LINE";
    } else if ($('#ch-email').is(':checked')) {
        console.log("email checked");
        x = "email";
    }

    let json = $.ajax({
        url: session.context + "/appUsers/findBySenderAndType",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        data: {
            sender: $("#btn-select option:selected").val(),
            type: x
        },
        async: false
    }).done(function () {
        console.log('done')
    }).responseText;
    console.log(json)
    return json;
}

function showAll() {
    var sender = "";
    var subject = "";
    var email = "";
    var respon = "";
    var msg = "";
    var status = "";
    var level = "";
    var type = "";
    var StartTime = startTime();
    var EndTime = endTime();

    console.log(sender);
    console.log(subject);
    console.log(email);
    console.log(respon);
    console.log(msg);
    console.log(status);
    console.log(level);
    console.log(type);
    console.log(StartTime);
    console.log(EndTime);
    console.log("function custom Search");
    let json = $.ajax({
        url: session.context + "/appUsers/findByCriteria",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        data: {
            sender: sender,
            subject: subject,
            email: email,
            responsible: respon,
            msg: msg,
            status: status,
            level: level,
            type: type,
            startTime: StartTime,
            endTime: EndTime
        },
        async: false
    }).done(function () {
        console.log('done')
    }).responseText;
    console.log(json);
    let jsonShowAll = json;
    json = JSON.parse(json);

    console.log("function");

    $('#tbody1').empty();
    if (json.length > 0) {
        let x;
        for (x of json) {
            console.log("x " + x);
            console.log("json length " + json.length);
            //var date = new Date(x.sentDate);

            $('#tbody1').append('' +
                '<tr data-idd="' + x.id + '">' +
                '<td>' + x.id + '</td>' +
                '<td>' + x.sender + '</td>' +
                '<td>' + x.send_To + '</td>' +
                '<td>' + x.subject + '</td>' +
                '<td>' + x.email + '</td>' +
                '<td>' + x.responsible + '</td>' +
                '<td>' + formatDate(x.sentDate) + '</td>' +
                '<td>' + x.level + '</td>' +
                '<td>' + x.status + '</td>' +
                '<td>' + x.type + '</td>' +
                '<td class="text-center"> <div><button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-edit" onclick="editFindDataMail(' + x.id + ')">edit <span class="glyphicon glyphicon-list"></button>' +
                ' <button type="button" class="btn btn-danger btn-sm" data-toggle="modal"  data-target="#modal-del" onclick="deleteFindDataMail(' + x.id + ')">del <span class="glyphicon glyphicon-trash"></button> </div> </td>' +
                '</tr>');
        }
    } else {
        $('#tbody1').append('<tr><td style="text-align: center;" colspan="10">No data.</td></tr>');
    }
    return jsonShowAll;
}

function formatDate(sentDate) {
    var Sentdate = new Date(sentDate);
    var month = new Array(11);
    month[0] = '01';
    month[1] = '02';
    month[2] = '03';
    month[3] = '04';
    month[4] = '05';
    month[5] = '06';
    month[6] = '07';
    month[7] = '08';
    month[8] = '09';
    month[9] = '10';
    month[10] = '11';
    month[11] = '12';

    var date = new Array(31);
    date[1] = "01";
    date[2] = "02";
    date[3] = "03";
    date[4] = "04";
    date[5] = "05";
    date[6] = "06";
    date[7] = "07";
    date[8] = "08";
    date[9] = "09";
    date[10] = "10";

    date[11] = "11";
    date[12] = "12";
    date[13] = "13";
    date[14] = "14";
    date[15] = "15";
    date[16] = "16";
    date[17] = "17";
    date[18] = "18";
    date[19] = "19";
    date[20] = "20";

    date[21] = "21";
    date[22] = "22";
    date[23] = "23";
    date[24] = "24";
    date[25] = "25";
    date[26] = "26";
    date[27] = "27";
    date[28] = "28";
    date[29] = "29";
    date[30] = "30";

    date[31] = "31";
    var showDateMonthYear = date[Sentdate.getDate()] + "-" + month[Sentdate.getMonth()] + "-" + Sentdate.getFullYear();
    var showDate = date[Sentdate.getDate()] + "-" + month[Sentdate.getMonth()] + "-" + Sentdate.getFullYear() + " " + Sentdate.getHours() + ":" + Sentdate.getMinutes() + ":" + Sentdate.getSeconds();
    return showDate;
}

function setDataSearch() {
    var setStatus;
    var setLevel;
    var setType;
    if ($('#search-type').val() == "all") {
        setType = ""
    } else if (($('#search-type').val() != "all")) {
        setType = ($('#search-type').val());
    }
    if ($('#search-level').val() == "all") {
        setLevel = ""
    } else if (($('#search-level').val() != "all")) {
        setLevel = ($('#search-level').val());
    }
    if ($('#search-status').val() == "all") {
        setStatus = ""
    } else if (($('#search-status').val() != "all")) {
        setStatus = ($('#search-status').val());
    }
    var jsonCriteria = {
        sender: $('#search-subject').val(),
        subject: $('#search-sender').val(),
        email: $('#search-email').val(),
        responsible: $('#search-responsible').val(),
        msg: $('#search-content').val(),
        status: setStatus,
        level: setLevel,
        type: setType,
        startTime: startTime(),
        endTime: endTime()
    }

    console.log();
    queryData(jsonCriteria);

    console.log("Json : " + jsonCriteria.startTime);

}

let jsonItem;

function queryData(criteriaObject) {
    objectUtilPagination.setId('#pagingSearchDataCustomerLog');
    objectUtilPagination.setUrlData("/appUsers/findByCriteria");
    objectUtilPagination.setUrlSize("/appUsers/findByCriteriaSize");


    objectUtilPagination.loadTable = function (items) {

        var item = items;
        jsonItem = items;
        console.log("jsonItem :", jsonItem);
        console.log(item)
        $('#tbody1').empty();
        console.log('Item Data Size = ' + item.length)

        $('#tbody1').empty();
        if (item.length > 0) {
            let x;
            for (x of item) {
                console.log("x " + x);
                console.log("item length " + item.length);
                $('#tbody1').append('' +
                    '<tr data-idd="' + x.id + '">' +
                    '<td>' + x.id + '</td>' +
                    '<td>' + x.sender + '</td>' +
                    '<td>' + x.send_To + '</td>' +
                    '<td>' + x.subject + '</td>' +
                    '<td>' + x.email + '</td>' +
                    '<td>' + x.responsible + '</td>' +
                    '<td>' + formatDate(x.sentDate) + '</td>' +
                    '<td>' + x.level + '</td>' +
                    '<td>' + x.status + '</td>' +
                    '<td>' + x.type + '</td>' +
                    '<td class="text-center"> <div> <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-edit" onclick="modalEdit1(' + x.id + ')">edit <span class="glyphicon glyphicon-list"></button>' +
                    ' <button type="button" class="btn btn-danger btn-sm" data-toggle="modal"  data-target="#modal-del" onclick="modalDel1(' + x.id + ')">del <span class="glyphicon glyphicon-trash"></button></div> </td>' +
                    '</tr>');

            }
        } else {
            $('#tbody1').append('<tr><td style="text-align: center;" colspan="10">No data.</td></tr>');
        }


    }

    objectUtilPagination.setDataSearch(criteriaObject);
    objectUtilPagination.search(objectUtilPagination);
    objectUtilPagination.loadPage((0 * 1) + 1, objectUtilPagination);
}

function customSearch() {
    var sender = $('#search-sender').val();
    var subject = $('#search-subject').val();
    var email = $('#search-email').val();
    var respon = $('#search-responsible').val();
    var msg = $('#search-content').val();
    var status = $('#search-status').val();
    var level = $('#search-level').val();
    var type = $('#search-type').val();


    if (status == 'all') {
        status = '';
    }
    if (type == 'all') {
        type = ''
    }
    if (level == 'all') {
        level = ''
    }

    console.log(sender);
    console.log(subject);
    console.log(email);
    console.log(respon);
    console.log(msg);
    console.log(status);
    console.log(level);
    console.log(type);
    console.log("function custom Search");
    let json = $.ajax({
        url: session.context + "/appUsers/findByCriteria",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        data: {
            sender: sender,
            subject: subject,
            email: email,
            responsible: respon,
            msg: msg,
            status: status,
            level: level,
            type: type,
            startTime: startTime(),
            endTime: endTime()
        },
        async: false
    }).done(function () {
        console.log('done')
    }).responseText;
    console.log(json);


    return json;

}

function getstatusEdit() {
    json = JSON.parse(findByStatus());
    console.log(json);
    try {
        // json = json[0].split(",");
        let count;
        for (count = 0; count < json.length; count++) {
            $('#edit2-status').append(
                '<option>' + json[count] + '</option>'
            );
        }
    } catch (e) {
    }
}

function getlevelEdit() {
    json = JSON.parse(findBylevel());
    console.log(json);
    try {
        // json = json[0].split(",");
        let count;
        for (count = 0; count < json.length; count++) {
            $('#edit2-level').append(
                '<option>' + json[count] + '</option>'
            );
        }
    } catch (e) {
    }
}
function gettypeEdit() {
    json = JSON.parse(findBytype());
    console.log(json);
    try {
        // json = json[0].split(",");
        let count;
        for (count = 0; count < json.length; count++) {
            $('#edit2-type').append(
                '<option>' + json[count] + '</option>'
            );
        }
    } catch (e) {
    }
}

function getstatus() {
    json = JSON.parse(findByStatus());
    console.log(json);
    try {
        // json = json[0].split(",");
        let count;
        for (count = 0; count < json.length; count++) {
            $('#search-status').append(
                '<option>' + json[count] + '</option>'
            );
        }
    } catch (e) {
    }
}



function getlevel() {
    json = JSON.parse(findBylevel());
    console.log(json);
    try {
        // json = json[0].split(",");
        let count;
        for (count = 0; count < json.length; count++) {
            $('#search-level').append(
                '<option>' + json[count] + '</option>'
            );
        }
    } catch (e) {
    }
}

function gettype() {
    json = JSON.parse(findBytype());
    console.log(json);
    try {
        // json = json[0].split(",");
        let count;
        for (count = 0; count < json.length; count++) {
            $('#search-type').append(
                '<option>' + json[count] + '</option>'
            );
        }
    } catch (e) {
    }
}

function editSearchCustom() {
    json = JSON.parse(customSearch());

    console.log("function");

    $('#tbody1').empty();
    if (json.length > 0) {
        let x;
        for (x of json) {
            console.log("x " + x);
            console.log("json length " + json.length);
            $('#tbody1').append('' +
                '<tr data-idd="' + x.id + '">' +
                '<td>' + x.id + '</td>' +
                '<td>' + x.sender + '</td>' +
                '<td>' + x.send_To + '</td>' +
                '<td>' + x.subject + '</td>' +
                '<td>' + x.email + '</td>' +
                '<td>' + x.responsible + '</td>' +
                '<td>' + formatDate(x.sentDate) + '</td>' +
                '<td>' + x.level + '</td>' +
                '<td>' + x.status + '</td>' +
                '<td>' + x.type + '</td>' +
                '<td class="text-center"> <div><button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-edit" onclick="modalEdit(' + x.id + ')">edit <span class="glyphicon glyphicon-list"></button>' +
                ' <button type="button" class="btn btn-danger btn-sm" data-toggle="modal"  data-target="#modal-del" onclick="modalDel(' + x.id + ')">del <span class="glyphicon glyphicon-trash"></button> </div></td>' +
                '</tr>');
        }
    } else {
        $('#tbody1').append('<tr><td style="text-align: center;" colspan="10">No data.</td></tr>');
    }

}

function downloadFile(filename) {

    console.log(filename);
    location.href = session.context + '/appUsers/download?filename=' + filename;
}

function downloadFile1(filename) {

    console.log(filename);
    location.href = session.context + '/appUsers/download1?filename=' + filename;
}

function modalDel(id) {
    var json = JSON.parse(customSearch());
    var indexjson = 0;
    for (var i = 0; i < json.length; i++) {
        if (parseInt(json[i].id) == parseInt(id)) {
            indexjson = i;
        }
    }
    console.log(json[indexjson]);

    $('#del-id').text(json[indexjson].id);
    $('#del-sender').text(json[indexjson].sender);
    $('#del-subject').text(json[indexjson].subject);
    $('#del-email').text(json[indexjson].email);
    $('#del-type').text(json[indexjson].type);
    $('#del-status').text(json[indexjson].status);
    $('#del-date').text(json[indexjson].sentDate);
    $('#del-responsible').text(json[indexjson].msg);

}

function modalEdit(id) {
    var json = JSON.parse(customSearch());

    var x = id;

    var indexjson = 0;
    for (var i = 0; i < json.length; i++) {
        if (parseInt(json[i].id) == parseInt(id)) {
            indexjson = i;
        }
    }
    console.log(json[indexjson]);

    $('#edit-sender').text(json[indexjson].sender);
    $('#edit-id').text(json[indexjson].id);
    $('#edit-subject').text(json[indexjson].subject);
    $('#edit-email').text(json[indexjson].email);
    $('#edit-BCC').text(json[indexjson].bcc);
    $('#edit-CC').text(json[indexjson].cc);
    $('#edit-date').text(formatDate(json[indexjson].sentDate));
    $('#edit-content').text(json[indexjson].msg);
    $('#edit-attachments').empty();
    var filenameAll = json[indexjson].attachments;


    $('#edit-attachmentsFullName').text(filenameAll);


    var idline = json[indexjson].idline;
    var type = json[indexjson].type;


    try {
        if (filenameAll.length > 5) {

            filenameAll = filenameAll.split(", ");

            $('#edit-attachments').empty();
            let count;
            for (count = 0; count < filenameAll.length; count++) {
                console.log(filenameAll[count]);
                console.log(filenameAll.length);
                filenameAll[count];
                var filename = filenameAll[count];
                var index = filename.lastIndexOf('.');
                console.log(filename.length);
                console.log(index);
                var typeFilename = filename.substring(index, filename.length)
                console.log(type);
                filename = filename.substring(0, 19);
                console.log(filename + "..." + typeFilename);
                $('#edit-attachments').append(
                    // '' + '<label style="text-decoration: underline" onclick="downloadFile(\'' + filenameAll[count] + '\')">' + filename+"..."+typeFilename + '<span class="glyphicon glyphicon-download"></span></label>'
                    '' + '<button type="button"  onclick="downloadFile(\'' + filenameAll[count] + '\')">' + filename + "..." + typeFilename + ' <span class="glyphicon glyphicon-download"></span></button>'
                );
                console.log(filenameAll[count]);
            }
        } else {

        }
    } catch (e) {

    }

}

function modalDel1(id) {
    var json = jsonItem;
    var indexjson = 0;
    for (var i = 0; i < json.length; i++) {
        if (parseInt(json[i].id) == parseInt(id)) {
            indexjson = i;
        }
    }
    console.log(json[indexjson]);

    $('#del-id').text(json[indexjson].id);
    $('#del-sender').text(json[indexjson].sender);
    $('#del-subject').text(json[indexjson].subject);
    $('#del-email').text(json[indexjson].email);
    $('#del-type').text(json[indexjson].type);
    $('#del-status').text(json[indexjson].status);
    $('#del-date').text(json[indexjson].sentDate);
    $('#del-responsible').text(json[indexjson].responsible);

}

function AttachmentsFullName(filename) {
    var name = filename;
    return name;
}

function canlenderPicker() {
    $('#calenderPicker').daterangepicker();
}

function deleteID() {
    console.log("Delete");
    let id = $('#del-id').html();

    $.ajax({
        url: session.context + "/appUsers/del/" + id,
        contentType: "application/json",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "DELETE",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + ": " + thrownError);
        },
        async: false
    })
    console.log("Delete id :" + id + " success");
}

function formatToUpdate(dateString) {
    var date = dateString;
    console.log("date to update :", date)
    date = date.split(" ");
    var date1 = date[0].split("-");
    var dateUpdate = date1[2] + "-" + date1[1] + "-" + date1[0] + " " + date[1];
    console.log("date to update", dateUpdate);
    console.log("Timestamp : ", toTimestamp(dateUpdate));
    return toTimestamp(dateUpdate);
}

function update() {
    let id = $('#edit2-id').html();
    var json = jsonItem;
    var indexjson = 0;
    for (var i = 0; i < json.length; i++) {
        if (parseInt(json[i].id) == parseInt(id)) {
            indexjson = i;
        }
    }
    replyMessage(id)
    console.log("Update")
    var date = $('#edit-date').html();

    console.log($('#edit-attachmentsFullName').text());
    var jsonData = {
        sender: $('#edit2-sender').val(),
        subject: $('#edit2-subject').val(),
        email: $('#edit2-email').val(),
        responsible: $('#edit2-responsible').val(),
        sentDate: formatToUpdate(date),
        msg: $('#edit2-content').val(),
        cc: $('#edit-CC').html(),
        bcc: $('#edit-BCC').html(),
        level: $('#edit2-level').val(),
        status: $('#edit2-status').val(),
        type: $('#edit2-type').val(),
        attachments: $('#edit-attachmentsFullName').text(),
        send_To:json[indexjson].send_To,
        messageNum: json[indexjson].messageNum
    }
    console.log("json :", jsonData);
    //console.log(jsonData.sentDate);

    $.ajax({
        url: session.context + "/appUsers/update/" + id,
        contentType: "application/json",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "PUT",
        data: JSON.stringify(jsonData),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + ": " + thrownError);
        },
        async: false
    })
}

function move() {
    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(frame, 5);

    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
            elem.innerHTML = width * 1 + '%';
            if (width == 30) {
                findNewDataMail();
            } else if (width == 100) {
                //location.reload();
            }
        }
    }

    var elem = document.getElementById("myBar");
}

function findNewDataMail() {
    let json = $.ajax({
        url: session.context + "/appUsers/findNewDataMail",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        data: {sender: ""},
        async: false,
        complete: function (xhr) {
            $('#modal-alert-update').modal('hide');
            console.log("complete")
        }
    }).done(function () {
        console.log('done')

        $('#modal-alert-loading').modal('hide');
    }).responseText;
    setDataSearch();
}

function insert() {
    var dateNow = new Date();

    var weekday = new Array(7);
    weekday[0] = "Sun"
    weekday[1] = "Mon";
    ;
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var month = new Array();
    month[0] = "01";
    month[1] = "02";
    month[2] = "03";
    month[3] = "04";
    month[4] = "05";
    month[5] = "06";
    month[6] = "07";
    month[7] = "08";
    month[8] = "09";
    month[9] = "10";
    month[10] = "11";
    month[11] = "12";

    var sender;
    var subject;
    var email;
    var responsible;
    // var sentDate = weekday[dateNow.getDay()]+" "+month[dateNow.getMonth()]+" "+dateNow.getDate()+" "+dateNow.getHours()+":"+dateNow.getMinutes()+":"+dateNow.getSeconds()+" "+"ICT"+" "+dateNow.getFullYear();
    //var sentDate = toTimestamp(new Date());
    var sentDate = dateNow.getFullYear() + "-" + month[dateNow.getMonth()] + "-" + dateNow.getDate() + " " + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds();
    console.log(sentDate);
    var status = $('#add-status').val();
    var type = $('#add-type').val();
    var level = $('#add-level').val();
    var msg = $('#add-content').val();
    var cc;
    var bcc;


    if ($('#add-sender').val() == '') {
        sender = "--";
    } else {
        sender = $('#add-sender').val();
    }

    if ($('#add-subject').val() == '') {
        subject = "--";
    } else {
        subject = $('#add-subject').val();
    }

    if ($('#add-email').val() == '') {
        email = "--";
    } else {
        email = $('#add-email').val();
    }

    if ($('#add-responsible').val() == '') {
        responsible = "----";
    } else {
        responsible = $('#add-responsible').val();
    }

    var jsonData = {sender, subject, email, responsible, sentDate, status, type, level, msg}

    $.ajax({
        url: session.context + "/appUsers/insert",
        contentType: "application/json",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "POST",
        data: JSON.stringify(jsonData),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + ": " + thrownError);
        },
        async: false
    })
    console.log("insert complete")
}

function findDataMail() {
    let json = $.ajax({
        url: session.context + "/appUsers/findDataMail",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        data: {sender: $('#searchValueDate').val()},
        async: false
    }).done(function () {
        console.log('done')
    }).responseText;
    json = JSON.parse(json);
    console.log(json);
    $('#tbody1').empty();
    if (json.length > 0) {
        let x;
        for (x of json) {
            console.log("x " + x);
            console.log("json length " + json.length);
            $('#tbody1').append('' +
                '<tr>' +
                '<td>' + x.id + '</td>' +
                '<td>' + x.sender + '</td>' +
                '<td>' + x.send_To + '</td>' +
                '<td>' + x.subject + '</td>' +
                '<td>' + x.email + '</td>' +
                '<td>' + x.responsible + '</td>' +
                '<td>' + formatDate(x.sentDate) + '</td>' +
                '<td>' + x.level + '</td>' +
                '<td>' + x.status + '</td>' +
                '<td>' + x.type + '</td>' +
                '<td class="text-center"> <div><button type="button" class="btn btn-primary btn-sm" data-toggle="modal"  data-target="#modal-edit" onclick="editFindDataMail(' + x.id + ')" >edit <span class="glyphicon glyphicon-list"></button>' +
                '            <button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#modal-del" onclick="deleteFindDataMail(' + x.id + ')">del <span class="glyphicon glyphicon-trash"></button></div> </td>' +
                '</tr>');
        }
    } else {
        $('#tbody1').append('<tr><td style="text-align: center;" colspan="10">No data.</td></tr>');
    }

}

function deleteFindDataMail(id) {
    var json = JSON.parse(showAll());
    var indexjson = 0;
    for (var i = 0; i < json.length; i++) {
        if (parseInt(json[i].id) == parseInt(id)) {
            indexjson = i;
        }
    }
    console.log(json[indexjson]);

    $('#del-id').text(json[indexjson].id);
    $('#del-sender').text(json[indexjson].sender);
    $('#del-subject').text(json[indexjson].subject);
    $('#del-email').text(json[indexjson].email);
    $('#del-type').text(json[indexjson].type);
    $('#del-status').text(json[indexjson].status);
    $('#del-date').text(json[indexjson].sentDate);
    $('#del-responsible').text(json[indexjson].msg);

}

function startTime() {
    var date;
    if ($('#searchValueDate').val() != "") {
        var Fulltime = $('#searchValueDate').val().split(" - ");
        var time = Fulltime[0].split(" ");
        console.log(time[0]);
        var timeFormat = time[0].split("-");
        var startTimeFormat = timeFormat[2] + "-" + timeFormat[1] + "-" + timeFormat[0] + " " + time[1] + ":00";

        date = new Date(timeFormat[1] + "-" + timeFormat[0] + "-" + timeFormat[2] + " " + time[1]);
        console.log(startTimeFormat);
        console.log(date);
    } else {
        date = "";
    }

    return startTimeFormat;
}

function endTime() {
    var date;
    if ($('#searchValueDate').val() != "") {
        var Fulltime = $('#searchValueDate').val().split(" - ");
        var time = Fulltime[1].split(" ");
        console.log(time[0]);
        var timeFormat = time[0].split("-");
        var endTimeFormat = timeFormat[2] + "-" + timeFormat[1] + "-" + timeFormat[0] + " " + time[1] + ":00";
        date = new Date(timeFormat[1] + "-" + timeFormat[0] + "-" + timeFormat[2] + " " + time[1]);
        console.log(endTimeFormat);
        console.log(date);
    } else {
        date = "";
    }

    return endTimeFormat;
}

function toTimestamp(strDate) {
    var datum
    if (strDate != "") {
        datum = Date.parse(strDate);
    } else {
        datum = "";
    }

    return datum;
}

function editFindDataMail(id) {
    var json = JSON.parse(showAll());

    var x = id;

    var indexjson = 0;
    for (var i = 0; i < json.length; i++) {
        if (parseInt(json[i].id) == parseInt(id)) {
            indexjson = i;
        }
    }
    console.log(json[indexjson]);

    $('#edit-sender').text(json[indexjson].sender);
    $('#edit-id').text(json[indexjson].id);
    $('#edit-subject').text(json[indexjson].subject);
    $('#edit-email').text(json[indexjson].email);
    $('#edit-BCC').text(json[indexjson].bcc);
    $('#edit-CC').text(json[indexjson].cc);
    $('#edit-date').text(formatDate(json[indexjson].sentDate));
    $('#edit-content').text(json[indexjson].msg);
    $('#edit-attachments').empty();

    var filenameAll = json[indexjson].attachments;
    AttachmentsFullName(filenameAll);
    console.log(AttachmentsFullName())
    $('#edit-attachmentsFullName').text(filenameAll);

    var idline = json[indexjson].idline;
    var type = json[indexjson].type;

    try {
        if (filenameAll.length > 5) {
            filenameAll = filenameAll.split(", ");

            $('#edit-attachments').empty();
            let count;
            for (count = 0; count < filenameAll.length; count++) {
                console.log(filenameAll[count]);
                console.log(filenameAll.length);
                filenameAll[count];
                var filename = filenameAll[count];
                var index = filename.lastIndexOf('.');
                console.log(filename.length);
                console.log(index);
                var typeFilename = filename.substring(index, filename.length)
                console.log(type);
                filename = filename.substring(0, 19);
                console.log(filename + "..." + typeFilename);
                $('#edit-attachments').append(
                    '' + '<label style="text-decoration: underline" onclick="downloadFile(\'' + filenameAll[count] + '\')">' + filename + "..." + typeFilename + '<span class="glyphicon glyphicon-save"></span></label>'
                );
                console.log(filenameAll[count]);
            }
        } else {

        }
    } catch (e) {

    }

}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

}

function modalEdit1(id) {
    var json = jsonItem;
    //ImgLine --- Nick
    var json1 = JSON.parse(findByIdline());
    //ImgLine --- Nick
    var x = id;

    var indexjson = 0;
    for (var i = 0; i < json.length; i++) {
        if (parseInt(json[i].id) == parseInt(id)) {
            indexjson = i;
        }
    }
    console.log(json[indexjson]);

    $('#edit-sender').text(json[indexjson].sender);
    $('#edit-id').text(json[indexjson].id);
    $('#edit-subject').text(json[indexjson].subject);
    $('#edit-email').text(json[indexjson].email);
    $('#edit-BCC').text(json[indexjson].bcc);
    $('#edit-CC').text(json[indexjson].cc);
    $('#edit-date').text(formatDate(json[indexjson].sentDate));
    $('#edit-content').text(json[indexjson].msg);
    $('#edit-attachments').empty();
    var filenameAll = json[indexjson].attachments;


    $('#edit-attachmentsFullName').text(filenameAll);


    var idline = json[indexjson].idline;
    var type = json[indexjson].type;
    //ImgLine --- Nick
    if (type == "LINE") {
        for (var j = 0; j < json1.length; j++) {
            if (idline == json1[j].idline) {
                console.log(json1[j].idline);
                var textimg = textimg + ", " + json1[j].imgg;
            }
        }
        console.log(textimg);
        try {
            filenameAll = textimg.split(", ");

            $('#edit-attachments').empty();
            let count;
            for (count = 1; count < filenameAll.length; count++) {
                console.log("-------------")
                console.log(filenameAll[count]);
                console.log("-------------")
                filenameAll[count];
                var filename = filenameAll[count];
                var index = filename.lastIndexOf('.');
                console.log(filename.length);
                console.log(index);
                var typeFilename = filename.substring(index, filename.length)
                console.log(type);
                filename = filename.substring(0, 19);
                console.log(filename + "..." + typeFilename);
                $('#edit-attachments').append(
                    '' + '<button type="button" class="btn btn-primary btn-sm " onclick="downloadFile1(\'' + filenameAll[count] + '\')">' + filename + "..." + typeFilename + ' <span class="glyphicon glyphicon-save"></span></button>'
                );
            }
        } catch (e) {

        }
    } else {
        //ImgLine --- Nick
        try {
            if (filenameAll.length > 5) {

                filenameAll = filenameAll.split(", ");

                $('#edit-attachments').empty();
                let count;
                for (count = 0; count < filenameAll.length; count++) {
                    console.log(filenameAll[count]);
                    console.log(filenameAll.length);
                    filenameAll[count];
                    var filename = filenameAll[count];
                    var index = filename.lastIndexOf('.');
                    console.log(filename.length);
                    console.log(index);
                    var typeFilename = filename.substring(index, filename.length)
                    console.log(type);
                    filename = filename.substring(0, 19);
                    console.log(filename + "..." + typeFilename);
                    $('#edit-attachments').append(
                        // '' + '<label style="text-decoration: underline" onclick="downloadFile(\'' + filenameAll[count] + '\')">' + filename+"..."+typeFilename + '<span class="glyphicon glyphicon-download"></span></label>'
                        '' + '<button type="button" class="btn btn-primary btn-sm " style="margin-top: 5px" onclick="downloadFile(\'' + filenameAll[count] + '\')">' + filename + "..." + typeFilename + ' <span class="glyphicon glyphicon-save"></span></button>'
                    );
                    console.log(filenameAll[count]);
                }
            } else {

            }
        } catch (e) {

        }
    }
}


function findByIdline() {
    let json = $.ajax({
        url: session.context + "/appUsers/findByIdline",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        data: {idline: ""},
        async: false
    }).done(function () {
        console.log('done')
    }).responseText;
    return json;
}

function findByStatus() {
    let json = $.ajax({
        url: session.context + "/appUsers/getkeyword?id=200&code=status.list",
        contentType: "application/json;charset=UTF-8",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        async: false
    }).done(function () {
        console.log('done')
    }).responseText;
    return json;
}

function findBylevel() {
    let json = $.ajax({
        url: session.context + "/appUsers/getkeyword?id=200&code=level.list",
        contentType: "application/json;charset=UTF-8",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        async: false
    }).done(function () {
        console.log('done')
    }).responseText;
    return json;
}

function findBytype() {
    let json = $.ajax({
        url: session.context + "/appUsers/getkeyword?id=200&code=type.list",
        contentType: "application/json;charset=UTF-8",
        headers: {Accept: "application/json;charset=UTF-8"},
        type: "GET",
        async: false
    }).done(function () {
        console.log('done')
    }).responseText;
    return json;
}
