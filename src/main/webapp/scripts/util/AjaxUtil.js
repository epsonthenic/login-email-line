function AjaxUtil () {}

var pattern = {
    async: true,
    cache: false,
    data: ''
    //,
    //beforeSend: function() { $('.dv-background').show(); },
    //complete: function() { $('.dv-background').hide(); }
};

/**
 * fire ajax request to server type post
 *
 * @param strUrl        (string)    url connect to server
 * @param jsonData      (json)      data send to server
 * @param bAsync        (boolean)   asynchronous type
 * @param eBackdrop     (element)   put backdrop (loader) over
 */
AjaxUtil.post = function (strUrl, jsonData, bAsync, eBackdrop) {
    //eBackdrop.addClass("overlay").prepend('<div class="overlay-image"><div class="image-contain" style="background-image: url(' + session['context'] + '/resources/images/eprop-indicator.png' + '); width:30px; height:30px;"><jsp:text/></div></div>');
    //eBackdrop.removeClass("overlay");
    var options = {
        type: 'POST',
        url: session['context'] + strUrl,
        data: jsonData,
        async: bAsync
    };
    var settings = $.extend({}, pattern, options);
    return $.ajax(settings);
};

AjaxUtil.get = function (strUrl, jsonData, bAsync) {
    var options = {
        type: 'GET',
        url: session['context'] + strUrl,
        data: jsonData,
        async: bAsync
    };
    var settings = $.extend({}, pattern, options);
    return $.ajax(settings);

};