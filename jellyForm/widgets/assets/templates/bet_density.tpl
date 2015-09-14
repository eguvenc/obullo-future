<script>
<style>
.main-group-row {
	cursor:pointer;
}
tr.success td {
	border-bottom:none !important;
}
tr[data-group-target].success td {
	border:none !important;
}
</style>
<%
var colCount = 0;
function outComesRows (outComes) {
	var data = {};
	for (var i in outComes) {
		for (var j in outComes[i]) {
			data[j] = (data[j]) ? data[j] : {};
			data[j][i] = outComes[i][j];
		}
	}
	return data;
}
%>
<br clear='all' />
<table class="table table-bordered table-striped no-footer dataTable" role="grid" >
   <thead>
		<tr role="row">
		<%
		for (var i in data) {
			_.each(data[i].id, function (idV, idIdx) {
				colCount++;
				%>
				<th tabindex="0" aria-controls="countries_table" aria-label="Edit: activate to sort column ascending"><%=idIdx%></th>
				<%
			});
			%>
			<th tabindex="0" aria-controls="countries_table" aria-label="Edit: activate to sort column ascending">Outcome</th>
			<%
			break;
		}
		%>
		</tr>
	</thead>
	<tbody>
	<%
	_.each(data, function (val, idx) {
		%>
		<tr role="row" class='main-group-row' data-group='<%=idx%>' >
			<%
			_.each(val.id, function (idV, idIdx) {
				%>
				<td ><%
				switch (idIdx) {
					case 'currencyId':{
						print((LANG.currencies.results[idV]) ? LANG.currencies.results[idV] : idV);
						break;
					}
					case 'sportId':{
						print((LANG.sports.results[idV]) ? LANG.sports.results[idV] : idV);
						break;
					}
					case 'categoryId':{
						print((LANG.categories.results[idV]) ? LANG.categories.results[idV] : idV);
						break;
					}
					case 'tournamentId':{
						print((LANG.tournaments.results[idV]) ? LANG.tournaments.results[idV] : idV);
						break;
					}
					case 'marketId':{
						print((LANG.markets.results[idV]) ? LANG.markets.results[idV] : idV);
						break;
					}
					case 'betSlipType':{
						print(idV);
						break;
					}
				}
				%></th>
				<%
			});
			%>
			<td>
				<table class="table table-bordered table-striped no-footer dataTable">
					<tr>
						<th>Total Count</th>
						<th>Total Sum</th>
						<!--<th>Total Risk</th>-->
					</tr>
					<tr>
						<td><%=val.totalTotalCount%></td>
						<td><%=val.totalTotalSum%></td>
						<!--<td><%=val.totalTotalRisk%></td>-->
					</tr>
				</table>
			</td>
		</tr>
		<tr style='display:none' data-group-target='<%=idx%>' >
			<td colspan='<%=colCount + 1%>'>
				<%
				var rows = outComesRows(val.outComes);
				var outComesKeys = COMMON.getKeys(val.outComes);
				%>
				<table class="table table-bordered table-striped no-footer dataTable" role="grid" >
					<tr>
						<th> </th>
						<%
						for (var i in outComesKeys) {
							%>
							<th><%=outComesKeys[i]%></th>
							<%
						}
						%>
					</tr>
						<%
						for (var i in rows) {
							%>
							<tr>
								<th><%=i%></th>
								<%
								for (var j in rows[i]) {
									%>
									<td>
									<%=rows[i][j]%>
									</td>
									<%
								}
								%>
							</tr>
							<%
						}
						%>
				</table>
			</td>
		</tr>
		<tr></tr>
		<%
	});
	%>
	</tbody>
</table>

<%
	if (colCount == 0) {
		%>
		<center><h2>No Results</h2></center>
		<%
	}
%>	
</script>

