<!DOCTYPE html>
<html>
	<head>
		<title>Add Group</title>
		<meta charset="utf-8">

		<link rel="stylesheet" href="/assets/jelly/css/bootstrap.min.css">
		<link rel="stylesheet" href="/assets/jelly/css/bootstrap-theme.min.css">
		<link rel="stylesheet" href="/assets/jelly/css/style.css">
		<script type="text/javascript" src="/assets/js/jquery/jquery.js"></script>
		<link href="/assets/css/magicsuggest/magicsuggest-min.css" rel="stylesheet">
		<script src="/assets/js/jquery/magicsuggest-min.js"></script>
		<script>
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
						window.location = '/jelly/add_group/'+selection[0]
					};
				});

		})
		</script>
	</head>
	<body>
		<div class="container">
			<div class="row">

    			<?php echo $this->view->load('list_groups', false); ?>

				<div class="page-header"><h4>Add Group</h4></div>
				<?php //echo $this->form->error($this->flash); ?>
				<hr>
				
				<?php echo $formData; ?>

			</div>
		</div>
	</body>
</html>