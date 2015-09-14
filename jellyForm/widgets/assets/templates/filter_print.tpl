<script>

<%

_.each(filter, function(v, idx) {
	%>
	<fieldset>
		<span><%=idx.toString().replace('_', ' ')%></span>
		<%
		_.each(v, function (v2, idx2) {
			%>
			<div class='blc'>
				<label><%=(idx2.toString().replace('_', ' '))%> = </label>
				<%
				if (/currency/i.test(idx2)) {
					print(LANG.currencies.results[v2] || "``");
				} else if (/country/i.test(idx2)) {
					print(LANG.countries.results[v2] || "``");
				} else {
					print(v2 || "``");
				}
				%>
			</div>
			<%
		});
		%>
	</fieldset>
	<%
});
%>

<style>
fieldset {
	display:block;
	position: relative;
	border: dotted 1px #CCC;
	padding-top: 20px;
	margin: 20px auto;
}
fieldset span {
	position: absolute;
	top: -12px;
	left: 5px;
	font-size: 14px; 
	font-weight: bold;
	background: #FFF;
}
.blc {
	border-radius: 5px;
	border:1px solid #CCC;
	margin: 3px;
	padding: 0 5px;
	display: inline-block;
	background: #E8F4F9;
}
.blc label {
	line-height: normal;
}
.blc label:first-letter, fieldset span:first-letter {
    text-transform: uppercase;
}
</style>

</script>
