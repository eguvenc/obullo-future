<script>

<%
	for (var i in data) {
	var table = '<table class="table table-bordered table-striped dataTable no-footer table-hover">\
			<thead>\
				<tr>\
					<th>Market</th>\
					<th>Count</th>\
					<th>Sum</th>\
					<th>Risk</th>\
				</tr>\
			</thead>';
		var markets = data[i];
		for (var k in markets) {
			var market = markets[k];
			console.info(market);
			table += '<tr>\
						<td>Market Id '+market.market_id+' - SBV '+market.sbv+'</td>\
						<td>'+market.totalCount+'</td>\
						<td>'+market.totalSum+'</td>\
						<td>'+market.totalRisk+'</td>\
					</tr>';
		}
		table += '</table>';
		print(table);
	}
%>


</script>
