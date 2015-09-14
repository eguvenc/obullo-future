var ajax = {
    post : function(url, closure, params) {
        var xmlhttp;
        if (window.XMLHttpRequest){
            xmlhttp = new XMLHttpRequest(); // code for IE7+, Firefox, Chrome, Opera, Safari
        }else{
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
        }
        xmlhttp.onreadystatechange=function(){
        /**
         * onreadystatechange will fire five times as 
         * your specified page is requested.
         * 
         *  0: uninitialized
         *  1: loading
         *  2: loaded
         *  3: interactive
         *  4: complete
         */
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                if( typeof closure === 'function'){
                    closure(xmlhttp.responseText);
                }
            }
        }
        xmlhttp.open("POST",url,true);
        xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xmlhttp.send(params);
    },
    get : function() {
        // paste here
    }
}
function parseNode(obj, element, i) {
    var name = element.name;
    var inputErrorDiv = document.getElementById(i + '_inputError');

    // Parse Errors
    //------------------------------------------------------------------
    if (typeof obj['success'] !== 'undefined' && obj['success'] == '0') {
        if (typeof obj.errors !== 'undefined' && typeof obj.errors[name] !== 'undefined') {

            if (inputErrorDiv) {
                if (isGroup !== false || isGroupError !== false) {
                    return inputErrorDiv.innerHTML += obj.errors[name] + '<br />';
                }
                return inputErrorDiv.innerHTML = obj.errors[name];
            }
            inputError.innerHTML = obj.errors[name];
            return element.parentNode.insertBefore(inputError, element);   
        }

        if (inputErrorDiv) {
            if (isGroup == false || isGroupError == false) {
                return inputErrorDiv.innerHTML = '';
            }
        }
        return;
    }
    if (inputErrorDiv) {
        return inputErrorDiv.innerHTML = '';
    }
}
function submitAjax(formId,gridId) {
    var myform  = document.getElementById(formId);
    var captcha = myform.captcha;
    if (captcha) {
        myform.captchaImg.src="/index.php/widgets/captcha/create/'" + Math.random();
    }
    if (typeof CKEDITOR != 'undefined' && CKEDITOR && CKEDITOR.instances) {
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
        }
    }
    formSubmit(myform, captcha, formId);
}
var formSubmit = function(myform,captcha,formId) {

    var elements = new Array();
    elements[0] = myform.getElementsByTagName('input');
    elements[1] = myform.getElementsByTagName('select');
    elements[2] = myform.getElementsByTagName('textarea');

    //--------------- Ajax Post ----------------//
    ajax.post( myform.getAttribute('action'), function(json) {
        var obj = JSON.parse(json);
        if (captcha) {
            captcha.value='';
        }

        var template     = '<div class="{class}">{icon}{message}</div>';
        var errorSign    = '<span class="glyphicon glyphicon-remove-sign"></span> ';
        var errorClass   = 'alert alert-danger';
        var successSign  = '<span class="glyphicon glyphicon-ok-sign"></span> ';
        var successClass = 'alert alert-success';

        // var warningSign = '<span class="glyphicon glyphicon-exclamation-sign"></span> ';
        // var infoSign    = '<span class="glyphicon glyphicon-info-sign"></span> ';

        if (typeof obj['success'] !== 'undefined' && obj['success'] == '1') { // Success

            if (typeof obj['message'] !== 'undefined') {

                var tempTemplate = template.replace('{class}',successClass);
                tempTemplate = tempTemplate.replace('{icon}',successSign);
                obj['message'] = tempTemplate.replace('{message}',obj['message']);
                var response = 'general';
                var responseDiv = document.getElementById("response_"+formId);

                if (responseDiv) {
                    response = formId;
                }
                var xx = document.getElementById("response_"+response);
                if (xx) {
                    xx.innerHTML = obj['message'];
                }
                
                // document.getElementById("response_"+formId).className = "alert alert-success";
            }
            var event = new CustomEvent('onsuccessAjax', {}, true);
            var event2 = new CustomEvent(formId+'Success', {}, true);
            event.response = obj;
            event2.response = obj;
            // Listen for the event.
            // document.addEventListener('onsuccessAjax', function (e) {  }, false);

            // Dispatch the event.
            document.dispatchEvent(event);
            document.dispatchEvent(event2);
        } else { // Assign Test Results
                var response = 'general';
                var responseDiv = document.getElementById("response_"+formId);

                var tempTemplate = template.replace('{class}',errorClass);
                tempTemplate = tempTemplate.replace('{icon}',errorSign);
                obj['message'] = tempTemplate.replace('{message}',obj['message']);

                if (responseDiv) {
                    response = formId;
                }
                document.getElementById("response_"+response).innerHTML = obj['message'];
                var event       = new CustomEvent('onerrorAjax', {}, true);
                var event2      = new CustomEvent(formId+'Error', {}, true);
                event.response  = obj;
                event2.response = obj;
                // Listen for the event.
                // document.addEventListener('onsuccessAjax', function (e) {  }, false);

                // Dispatch the event.
                document.dispatchEvent(event);
                document.dispatchEvent(event2);
                // document.getElementById("response_"+formId).className = "alert alert-danger";
        }
        COMMON.always(obj);
        var groupData = {};
        var groupErrorData = {};
        var elementsOfGroup = {};
        if (typeof obj['groupData'] !== 'undefined') {
            groupData = obj['groupData'];
        }
        for (var key in groupData) {
            var groupError = document.getElementById(groupData[key] + '_inputError');
            if (groupError) {
                groupError.innerHTML = '';
            }
        }
        isGroup = false;
        isGroupError = false;
        tempElementName = false;
        for (var i = 0; i < elements.length; i++) {
            var elements2 = {};
                elements2 = elements[i];
            for (var ii = 0; ii < elements2.length; ii++) {
                inputError = document.createElement('div');
                inputError.className = '_inputError';
                if (elements2[ii].type == 'hidden') {
                    inputError.className = 'col-sm-9';
                }
                errorInputNameId = i.toString() + ii.toString();
                inputError.id = errorInputNameId + '_inputError';

                if (elements2[ii].type != 'submit') {
                    if (typeof groupData[elements2[ii].name] !== 'undefined') {
                        isGroup = true;
                        errorInputNameId = groupData[elements2[ii].name];
                        if (typeof obj.errors !== 'undefined' && typeof obj.errors[elements2[ii].name] !== 'undefined') {
                            groupErrorData[errorInputNameId] = true;
                            isGroupError = true;
                        }
                        if (typeof groupErrorData[errorInputNameId] === 'undefined' || groupErrorData[errorInputNameId] === false) {
                            isGroupError = false;
                        }
                    } else {
                        isGroup = false;
                        isGroupError = false;
                        groupErrorData[errorInputNameId] = false;
                    }
                    if (tempElementName !== elements2[ii].name) {
                        parseNode(obj, elements2[ii], errorInputNameId);
                    }
                    if (elements2[ii].type == 'radio') {
                        tempElementName = elements2[ii].name;
                    }
                }
            }
        }
    },
    new FormData(myform)
    );
    myform.onsubmit = function (){
        return false; // Do not do form submit;
    }
}