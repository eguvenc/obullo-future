<script>
<% 
	function parseInfo (name,value) {
		name  = (name) ? name : "-" ;
		value = (value) ? value : "-" ;
		return  '<div class="col-sm-12">\
			        <label for="" class="label-control col-sm-4">'+name+'</label>\
			        <div class="col-sm-8">\
			            <span class="labelCol"><b>'+value+'</b></span>\
			        </div>\
			    </div>';
	}	

	function parseDetail (name,value) {
		name  = (name) ? name : "-" ;
		value = (value) ? value : "-" ;
		return  '<div class="col-sm-12 section">\
                            <span class="title">'+name+'</span>\
                            '+value+'\
                </div>';
	}
	
	function ucfirst(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	var odd  = '';
	var even = '';

    for(var i in data) {
        var _tempContainer = '';
        for (var k in data[i]) {
            var _tempInfo = '';

            for(var j in data[i][k]) {

                if ($.isArray(data[i][k])) {
                    for (var  l in data[i][k][j]) {
                    	
                        var name = (l === 'none') ? '' : ucfirst(l);
              			_tempInfo += parseInfo(name,data[i][k][j][l]);
                    }
                } else {
                    _tempInfo += parseInfo(j,data[i][k][j]);
                }
            }
            _tempContainer = parseDetail(k,_tempInfo);
        }

        if (type == 'live') {
        	(i % 2) ? even += _tempContainer : odd += _tempContainer ;
        } else {
        	 (i % 2) ? odd += _tempContainer : even += _tempContainer ;
        }

    }
	var cardHistory = '';
	var goalHistory = '';
	if (type != 'live') {
		cardHistory = '<table id="card_history_table" class="table table-bordered table-striped table-hover"></table>';
    	goalHistory	= '<table id="goal_history_table" class="table table-bordered table-striped table-hover"></table>';
    }

%>

	<div class="col-sm-6">
		<%= even %>
		<%= cardHistory %>
	</div>	
	<div class="col-sm-6">
		<%= odd %>
		<%= goalHistory %>
	</div>	

</script>


