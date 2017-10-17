$(document).ready(function() {

    var lantag;
    var tag;

    checkCookie();

    function getCookie(c_name) {
        return $.cookie(c_name);
    }

    function setCookie(c_name, value, expiredays) {
        $.cookie(c_name, value, { expires: expiredays }); 
    }

    function checkCookie() {
        lantag = getCookie('lantag');

        if (lantag == null || lantag == "") {
            setCookie('lantag', 'zh', 365)
        }
        else{
			login_language();
        }
    }

    function changetag(tag) {
        setCookie('lantag', tag, 365)
        login_language();
    }

    $("#top_nav_zh").click(function() {
        changetag('zh');
    })

    $("#top_nav_en").click(function() {
        changetag('en');
    })

    function login_language() {

        var lantag = getCookie('lantag');
        var xmlDoc;
        var FLAG = 1;

        
        if (!lantag) lantag="zh";


        var xmlurl = "/Public/xml/" + lantag + '.xml';



        $.ajax({
        url: xmlurl,
        dataType: 'xml',
        success: function(data){
        
            // console.log(data);

            $(data).find("button").children().each(function(index, ele){
                try{
                    $("#" + $(this)[0].nodeName).text($(this).text());
                }catch(e){
                    //console.log(e);
                }
            });

            $(data).find("span").children().each(function(index, ele){
                try{
                    $("#" + $(this)[0].nodeName).text($(this).text());
                }catch(e){
                    //console.log(e);
                }
            });

            $(data).find("label").children().each(function(index, ele){
                try{
                    $("#" + $(this)[0].nodeName).text($(this).text());
                }catch(e){
                    //console.log(e);
                }
            });


            $(data).find("input").children().each(function(index, ele){
                try{
                    $("#" + $(this)[0].nodeName).attr("placeholder", $(this).text());
                }catch(e){
                    //console.log(e);
                }
            });

            $(data).find("select").children().each(function(index, ele){
                try{
                    var tmpNodeName = $(this)[0].nodeName;
                    var tmpArr = [];
                    $(this).children().each(function(i, e){
                        // console.log($(this).text());
                        tmpArr.push($(this).text());
                    });
                    $("#" + tmpNodeName ).find("option").each(function(i, e){
                        // console.log($(this).text());
                        $(this)[0].innerHTML = tmpArr[i];//!!!
                    });
                }catch(e){
                    //console.log(e);
                }
            });

            $(data).find("TP").children().each(function(index, ele){
                try{
                    $("#" + $(this)[0].nodeName).text($(this).text());
                    //console.log($(this).text());
                }catch(e){
                    //console.log(e);
                }
            });
        }

        });      


    }

});