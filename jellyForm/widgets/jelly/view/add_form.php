<!DOCTYPE html>
<html>
    <head>
        <title>Add Form</title>
        <meta charset="utf-8">

        <link rel="stylesheet" href="/assets/jelly/css/bootstrap.min.css">
        <link rel="stylesheet" href="/assets/jelly/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="/assets/jelly/css/style.css">
        <script type="text/javascript" src="/assets/js/jquery/jquery.js"></script>
        <link href="/assets/css/magicsuggest/magicsuggest-min.css" rel="stylesheet">
        <script src="/assets/js/jquery/magicsuggest-min.js"></script>
        
        <script type="text/javascript">
            function addPermission(element) {
                var saveForm = (saveForm) ? saveForm : document.saveForm;
                if (element.checked) {
                    saveForm.permission_name.value = saveForm.form_attr_name.value;
                    saveForm.permission_resource_id.value = saveForm.form_resource_id.value;
                } else {
                    saveForm.permission_name.value = '';
                    saveForm.permission_resource_id.value = '';
                }
            }

            $(document).ready(function() {
                $('input[name="form_attr_name"]').focus();
                $('select[name="permission_parent_id"]').magicSuggest({
                        allowFreeEntries : false,
                        hideTrigger : false,
                        toggleOnClick: true,
                        maxSelection :1,
                        minChars : 0,
                });

            });
            
        </script>
    </head>
    <body>
        <div class="container">
            <div class="row">
            
                <?php echo $this->view->load('list_forms', false); ?>

                <div class="page-header"><h4>Add Form</h4></div>
                <?php //echo $this->form->error($this->flash); ?>
                <hr>

                <?php echo $formData; ?>
                
            </div>      
        </div>
    </body>
</html>