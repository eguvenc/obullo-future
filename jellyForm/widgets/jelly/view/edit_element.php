<!DOCTYPE html>
<html>
    <head>
        <title>Edit Element</title>
        <meta charset="utf-8">

        <link rel="stylesheet" href="/assets/jelly/css/bootstrap.min.css">
        <link rel="stylesheet" href="/assets/jelly/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="/assets/jelly/css/style.css">
        <script type="text/javascript" src="/assets/js/jquery/jquery.js"></script>
        <link href="/assets/css/magicsuggest/magicsuggest-min.css" rel="stylesheet">
        <script src="/assets/js/jquery/magicsuggest-min.js"></script>
        <style>
        .container  {
            width : 1350px;
        }
        .table-columns  {
            width : 5%;
        }
        .table {
                vertical-align: top;

                margin: 0px;

                -ms-word-break: break-all;
                     word-break: break-all;

                      /*Non standard for webkit */
                     word-break: break-word;

                -webkit-hyphens: auto;
                   -moz-hyphens: auto;
                    -ms-hyphens: auto;
                        hyphens: auto;
              } 
        </style>
        <script type="text/javascript">
        $(document).ready(function(){
            var formId = $('select[name="forms_form_id"]').magicSuggest({
                        allowFreeEntries : false,
                        hideTrigger : false,
                        toggleOnClick: true,
                        maxSelection :1,
                        minChars : 0
            });
            $(formId).on('selectionchange',function (e,m){
                var selection = m.getValue();
                if (typeof selection[0] != 'undefined' && selection[0] != 0) {
                    window.location = '/jelly/add_element/'+selection[0]
                };
            });
        });
            function dropdownAction(obj)
            {
                var saveForm = (saveForm) ? saveForm : document.saveForm;

                if (obj.value == 'submit') {
                    saveForm.form_element_name.value = 'submit';
                }
                if (obj.value == 'reset') {
                    saveForm.form_element_name.value = 'reset';
                }
                if (obj.value == 'captcha') {
                    saveForm.form_element_name.value = 'captcha';
                    saveForm.form_element_name.setAttribute('disabled', 'disabled');
                    saveForm.form_element_attribute.value = 'id="captcha"';
                    saveForm.form_element_rules.value = 'required';

                    var data = {};
                    data['id']    = 'captcha';
                    data['type']  = 'hidden';
                    data['name']  = 'name';
                    data['value'] = 'captcha';
                    var inputData = createInput('input', data);

                    saveForm.appendChild(inputData);
                } else {
                    var hiddenInput = document.getElementById('captcha');
                    if (hiddenInput) {
                        hiddenInput.remove();
                        saveForm.form_element_name.removeAttribute('disabled');
                    }
                }
            }
            function groupDropdown(obj)
            {
                var saveForm = (saveForm) ? saveForm : document.saveForm;

                var groupOrder = document.getElementById('groupOrder');
                if (groupOrder && (groupOrder.style.display == 'none' || obj.getAttribute('data') !== null)) {
                    groupOrder.style.display = 'block';
                    groupOrder.focus();
                    groupOrder.scrollIntoView();
                    saveForm.group_order.value = obj.getAttribute('data');
                    saveForm.group_order.setAttribute('disabled', 'disabled');
                } else {
                    var groupOrder = document.getElementById('groupOrder');
                    if (groupOrder) {
                        groupOrder.style.display = 'none';
                        saveForm.group_order.removeAttribute('disabled');
                    }
                }
            }
            function valueTypeDropDown(obj)
            {
                var saveForm     = (saveForm) ? saveForm : document.saveForm,
                    valueTypeOld = saveForm.form_element_value;

                if (obj.value === 'string') {
                    var data = {};
                    data['type']  = 'text';
                    data['name']  = valueTypeOld.name;
                    data['value'] = valueTypeOld.value;
                    data['class'] = valueTypeOld.getAttribute('class');
                    var inputData = createInput('input', data);
                    valueTypeOld.parentNode.replaceChild(inputData, valueTypeOld);
                } else {
                    var data = {};
                    data['name']  = valueTypeOld.name;
                    data['id']    = 'focusedInput';
                    data['value'] = valueTypeOld.value;
                    data['class'] = valueTypeOld.getAttribute('class');
                    data['rows']  = 5;
                    var valueTypeNew = createInput('textarea', data);
                    valueTypeOld.parentNode.replaceChild(valueTypeNew, valueTypeOld);
                }
            }
            function createInput(type, data)
            {
                var i = document.createElement(type);
                for (key in data) {
                    i.setAttribute(key, data[key]);
                }
                return i;
            }
        </script>
    </head>
    <body>
        <div class="container">
            <div class="row">
            
                <?php echo $this->view->load('list_elements', false); ?>
                
                <div class="page-header"><h4>Edit Element</h4></div>
                <?php //echo $this->form->error($this->flash); ?>
                <hr>

                <?php echo $formData; ?>

            </div>
        </div>
    </body>
</html>