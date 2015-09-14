<script>

<fieldset class="childFilter">
	<div class="form-group col-sm-12">
        <label>Last Login</label>
		<input type='input' name="last_login" class="form-control input-sm datepicker" />
	</div>
	<div class="form-group col-sm-12">
        <label>Status</label>
		<label class="checkbox-inline">
			Active
			<input type='radio' name="status" value="active" />
		</label>
		<label class="checkbox-inline">
			Passive
			<input type='radio' name="status" value="passive" />
		</label>
		<label class="checkbox-inline">
			Pending
			<input type='radio' name="status" value="pending" />
		</label>
		<label class="checkbox-inline">
			All
			<input type='radio' checked="checked" name="status" value="" />
		</label>
	</div>
	<div class="form-group col-sm-12">
        <label>Bonus</label>
		<label class="checkbox-inline">
			Active
			<input type='radio' name="bonus" value="1" />
		</label>
		<label class="checkbox-inline">
			InActive
			<input type='radio' name="bonus" value="0" />
		</label>
		<label class="checkbox-inline">
			All
			<input type='radio' checked="checked" name="bonus" value="" />
		</label>
	</div>
    <br>
    <div class="form-group col-sm-12">
        <label>Whatsapp on/off</label>
		<label class="checkbox-inline">
			Active
			<input type='radio' name="whatsapp" value="1" />
		</label>
		<label class="checkbox-inline">
			InActive
			<input type='radio' name="whatsapp" value="0" />
		</label>
		<label class="checkbox-inline">
			All
			<input type='radio' checked="checked" name="whatsapp" value="" />
		</label>
	</div>
    <br>
    <div class="form-group col-sm-12">
        <label>Notifications on/off</label>
		<label class="checkbox-inline">
			Active
			<input type='radio' name="notification" value="1" />
		</label>
		<label class="checkbox-inline">
			InActive
			<input type='radio' name="notification" value="0" />
		</label>
		<label class="checkbox-inline">
			All
			<input type='radio' checked="checked" name="notification" value="" />
		</label>
	</div>
    <br>
    <div class="form-group col-sm-12">
        <label>Currency</label>
    	<select multiple name="currency" class="form-control input-sm">
    		<%
    		_.each(results.currencies, function (v, k) {
    			%>
    			<option value="<%=k%>"><%=v%></option>
    			<%
    		});
    		%>
    	</select>
    </div>
    <div class="form-group col-sm-12">
        <label>Country</label>
    	<select multiple name="country" class="form-control input-sm">
    		<%
    		_.each(results.countries, function (v, k) {
    			%>
    			<option value="<%=k%>"><%=v%></option>
    			<%
    		});
    		%>
    	</select>
    </div>
</fieldset>

</script>