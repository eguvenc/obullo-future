<!DOCTYPE html>
<html>
    <head>
        <title>Edit Form</title>
        <meta charset="utf-8">

        <link rel="stylesheet" href="/assets/jelly/css/bootstrap.min.css">
        <link rel="stylesheet" href="/assets/jelly/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="/assets/jelly/css/style.css">
        <script type="text/javascript" src="/assets/js/jquery/jquery.js"></script>
        <link href="/assets/css/magicsuggest/magicsuggest-min.css" rel="stylesheet">
        <script src="/assets/js/jquery/magicsuggest-min.js"></script>
    </head>
    <body>
        <div class="container">
            <div class="row">
            
                <?php echo $this->view->load('list_forms', false); ?>

                <div class="page-header"><h4>Edit Form</h4></div>
                <?php //echo $this->form->error($this->flash); ?>
                <hr>

                <?php echo $formData; ?>

            </div>
        </div>
    </body>
</html>