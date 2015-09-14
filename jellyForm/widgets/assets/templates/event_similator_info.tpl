<script>

<%
	var eventName = '<h3>'+data.eventName+'</h3>';

	var html = '';
	for (var i in data.resultInputs) {
		var input = data.resultInputs[i];
		html += '<div class="col-sm-3"><label class="label-control col-sm-6" for="">'+input["result_type_name"]+'</label>\
                    <div id="" class="col-sm-8 input-group" style="">\
                        <input type="text" value="" name="home_'+input["result_type_key"]+'" class="input-sm form-control">\
                         <span class="input-group-addon">-</span>\
                        <input type="text" value="" name="away_'+input["result_type_key"]+'" class="input-sm form-control">\
                    </div></div>';
	}

	print(eventName);
	print(html);

%>
</script>