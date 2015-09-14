<script>
<% 
	oldData = $('input[name="oldData"]').val();

	function parseContainer (value){
		return '<div class="col-sm-6">'+value+'</div>';
	}
	function parseInfo (market,odds) {
		var marketName = '';
		try {
			if (! $.isPlainObject(market.market_name)) {
				market.market_name = JSON.parse(market.market_name);
			}
			marketName = market.market_name['en'];
		} catch (e) {}
		var is_feed = (parseFloat(market.is_feed)  == 1) ? {'classN' : 'danger','textN'  : title.feedStopAll} : {'classN' : 'success','textN'  : title.feedStartAll};
		var is_active = (parseFloat(market.is_active)  == 1) ? {'classN' : 'danger','textN'  : title.stopTransmissionAll} : {'classN' : 'success','textN'  : title.startTransmissionAll};
		return '<div class="col-sm-12 section">\
					<div class="section_resize">\
						<a href="#"><span class="glyphicon glyphicon-eye-open"></span></a>\
					</div>\
					<div class="col-sm-12">\
						<div class="col-sm-6 sectionTitle inlineWrap">'+marketName+' '+market.special_bet_value+'</div>\
						<div class="pull-right text-right inlineWrap">\
							<button class="hBtn btn btn-'+is_feed.classN+' btn-sm" data-link="all_feeds" data-params=\'{"eid" : '+market.event_id+', "mid" : '+market.market_id+' , "sbv" : "'+market.special_bet_value+'" }\' >'+is_feed.textN+'</button>\
							<button class="hBtn btn btn-'+is_active.classN+' btn-sm" data-link="all_transmissions" data-params=\'{"eid" : '+market.event_id+', "mid" : '+market.market_id+',"sbv" : "'+market.special_bet_value+'"  }\' >'+is_active.textN+'</button>\
						</div>\
						<div class="clearfix"></div>\
					</div>\
					<div class="col-sm-12">\
						<div class="col-sm-12">\
							<br>\
							<div id="response_changeOdd_'+market.market_id+'_'+market.special_bet_value+'"></div>\
							<form method="post" ajax="1" id="changeOdd_'+market.market_id+'_'+market.special_bet_value+'" action="/ajax/bets/event_odd_change">\
							<input type="hidden" name="eid" value="'+market.event_id+'">\
							<input type="hidden" name="mid" value="'+market.market_id+'">\
							<input type="hidden" name="oldData" value="'+oldData+'">\
							<table class="table table-hover table-striped" style="display: table;">\
							<thead>\
								<tr>\
									<th>'+title.outCome+'</th>\
									<th>'+title.odds+'</th>\
									<th>'+title.responsible+'</th>\
									<th>'+title.count+'</th>\
									<th>'+title.stake+'</th>\
									<th>'+title.risk+'</th>\
									<th>'+title.feed+'</th>\
									<th>'+title.transmission+'</th>\
								</tr>\
							</thead>\
							<tbody>\
								'+odds+'\
							</tbody>\
							</table>\
						<input type="submit" onclick="submitAjax(\'changeOdd_'+market.market_id+'_'+market.special_bet_value+'\')" class="btn btn-primary pull-right save btn-sm" style="display: block;" value="Kaydet"><div class="clearfix"></div></form></div>\
					</div>\
				</div>';

	}

	function parseMarkets (odds,market) {
		var teamName = '';
		try {
			if (! $.isPlainObject(odds.team_name)) {
				odds.team_name = JSON.parse(odds.team_name);
			}
			teamName = odds.team_name['en'];
		} catch (e) {}
		var out_come        = (teamName != '') ? teamName : odds.out_come ;
		var is_feed         = (parseFloat(odds.is_feed) == 1) ? {'classT' :  'danger','classN' : 'stop'} : {'classT' :  'success','classN' : 'play'};
		var is_active       = (parseFloat(odds.is_active) == 1 ) ? {'classT' :  'danger','classN' : 'stop'} : {'classT' :  'success','classN' : 'play'};
		
		return '<tr>\
					<td>'+out_come+'</td>\
					<td><input type="text" class="form-control miniElem input-sm" name="odd_'+odds.odd_id+'" data-link="" value="'+odds.odd+'">\
						<input type="hidden" class="form-control miniElem input-sm" name="old_'+odds.odd_id+'" data-link="" value="'+odds.odd+'">\
						<button class="btn btn-info btn-xs inlineBtn" data-link="inc-odd" type="button" data-params="odd_'+odds.odd_id+'">\
							<span class="glyphicon glyphicon-plus"></span>\
						</button>\
						<button class="btn btn-info btn-xs inlineBtn" data-link="dec-odd" type="button" data-params="odd_'+odds.odd_id+'">\
							<span class="glyphicon glyphicon-minus"></span>\
						</button>\
					</td>\
					<td>0</td>\
					<td>'+odds.count+'</td>\
					<td>'+odds.sum.toFixed(2)+'</td>\
					<td>'+odds.risk.toFixed(2)+'</td>\
					<td><button class="btn btn-'+is_feed.classT+' btn-xs" data-link="odd_feed" id="feed_'+odds.odd_id+'" data-params=\'{"eid" : '+market.event_id+',"oid" : '+odds.odd_id+',"mid" : '+market.market_id+' , "sbv" : "'+market.special_bet_value+'" }\'>'+'<span class="glyphicon glyphicon-'+is_feed.classN+'"></span>'+'</button></td>\
					<td><button class="btn btn-'+is_active.classT+' btn-xs" data-link="odd_transmission" id="transmission_'+odds.odd_id+'" data-params=\'{"eid" : '+market.event_id+',"oid" : '+odds.odd_id+',"mid" : '+market.market_id+' , "sbv" : "'+market.special_bet_value+'"}\' >'+'<span class="glyphicon glyphicon-'+is_active.classN+'"></span>'+'</button></td>\
				</tr>';		

	}	

	function parseWinnerContainer (market,odds,perm,type,save) {
		var marketName = '';
		try {
			if (! $.isPlainObject(market.market_name)) {
				market.market_name = JSON.parse(market.market_name);
			}
			marketName = market.market_name['en'];
		} catch (e) {}
		market.special_bet_value  = (market.special_bet_value == '-1') ?  '' : market.special_bet_value; 
		if (market.market_status == 1) {
			marketStatus = 1;
		}
		
		var cancelPermission = '';
		var params = {
			eid : market.event_id,
			mid : market.market_id,
			sbv : market.special_bet_value,
			type : "market"
		};
			switch (market.market_status) {
				case "0" : 
					var cancelMarket = jQuery.extend(true, {}, params);
					var saveButton   = '';
					var cancelButton = '';
					if (save) {
						saveButton = '<button class="btn btn-primary btn-sm removeBtn" data-link="save_winner" data-params='+JSON.stringify(params)+'><span class="glyphicon glyphicon-ok"></span></button>';
					}
					if (perm) {
						cancelButton = '<button title="Cancel Market" class="btn btn-danger btn-sm removeBtn" data-link="cancel_market" data-params='+JSON.stringify(cancelMarket)+'><span class="glyphicon glyphicon-remove"></span></button>';
					}

					params.save         = save;
					cancelMarket.field  = type;
					cancelPermission = saveButton+' '+cancelButton;
					break;
				case "1" : 
				case "-1" : 
				case "2" : 
					params.field  = type;
					console.info(save);
					console.info(perm);
					if (perm) {
						cancelPermission = '<button class="btn btn-danger btn-sm removeBtn" title="Cancel Process" data-link="cancel_process" data-params='+JSON.stringify(params)+'><span class="glyphicon glyphicon-remove"></span></button>';
					}
					break;

			}
		return '<div class="col-sm-12 section">\
					<div class="section_resize">\
						<a href="#"><span class="glyphicon glyphicon-eye-open"></span></a>\
					</div>\
					<div class="col-sm-12">\
						<div class="col-sm-6 sectionTitle">'+marketName+' '+market.special_bet_value+'</div>\
						<div class="col-sm-5 col-sm-offset-1 text-right"></div>\
						<div class="clearfix"></div>\
					</div>\
					<div class="col-sm-12">\
						<div class="col-sm-12">\
							<br>\
							<div id="response_changeOdd_'+market.market_id+'_'+market.special_bet_value+'"></div>\
							<input type="hidden" name="eid" value="'+market.event_id+'">\
							<input type="hidden" name="mid" value="'+market.market_id+'">\
							<table class="table table-hover" style="display: table;">\
							<thead>\
								<tr>\
									<th>'+title.status+'</th>\
									<th>'+title.outCome+'</th>\
									<th>'+title.odds+'</th>\
									<th>'+title.responsible+'</th>\
									<th>'+title.count+'</th>\
									<th>'+title.stake+'</th>\
									<th>'+title.risk+'</th>\
								</tr>\
							</thead>\
							<tbody>\
								'+odds+'\
							</tbody>\
							</table>\
							'+cancelPermission+'\
							<div class="clearfix"></div>\
							</div>\
					</div>\
				</div>';

	}

	function parseWinnerOdd (odds,market) {
		var teamName = '';
		try {
			if (! $.isPlainObject(odds.team_name)) {
				odds.team_name = JSON.parse(odds.team_name);
			}
			teamName = odds.team_name['en'];
		} catch (e) {}
		var out_come = (teamName != '') ? teamName : odds.out_come ;
		var lost     = 'selected';
		var win      = '';
		var result   = title.lost;
		oddStatus    = odds.status;
		var success = 'class="alert alert-danger"';
		if (odds.status == 1 || odds.type == 1) {
			win     = 'selected';
			lost    = '';
			result  = title.won;
			success = 'class="alert alert-success"';
		} else if  (odds.status == 3 || odds.type == 3) {
			success = 'class="alert alert-info"';
			result  = 'Rewaiting';
		} else if  (odds.status == 2) {
			success = 'class="alert alert-warning"';
			result  = title.canceled;
		} 
		var winnerSelection = '';
		if (odds.status == 0) {
			var oddParam = {
				hash : odds.hash,
				unique : market.market_id+'_'+market.special_bet_value 
			};
			result = '<select name="odd_status_'+market.market_id+'_'+market.special_bet_value+'" data-link="choose_winner" data-market-id="'+market.market_id+'_'+market.special_bet_value+'" data-param='+JSON.stringify(oddParam)+' class="form-control input-sm">\
							<option value="-1"  '+lost+'>'+title.lost+'</option>\
							<option value="1" '+win+'>'+title.won+'</option>\
						</select>';
		}
		if (typeof odds.sum == 'undefined') {
			odds.sum   = 0;
			odds.risk  = 0;
			odds.count = 0;
		}
		return '<tr '+success+'>\
					<td>\
					'+result+'\
					</td>\
					<td>'+out_come+'</td>\
					<td>'+odds.odd+'</td>\
					<td>0</td>\
					<td>'+odds.count+'</td>\
					<td>'+odds.sum.toFixed(2)+'</td>\
					<td>'+odds.risk.toFixed(2)+'</td>\
				</tr>';		

	}
	title        = data.title;
	marketStatus =  0;
	oddStatus    =  0;
	status       = data.status;
	var perm     = data.perm;
	var savePerm = data.save;
	var odd      = '';
	var even     = '';
	var data     = data.data;
	var eid      = '';
	var mid      = '';
	var sbv      = '';
	if (! $.isEmptyObject(data)) {
		var type = (typeof data[0].is_feed == 'undefined') ? 'live': 'common' ; 
		sbv      = (data[0].special_bet_value == '-1') ?  '""' : data[0].special_bet_value; 
		mid      = data[0].market_id; 
		eid      = data[0].event_id; 
		betradar = data[0].betradar; 

		for(var i in data) {
			var marketInfo = data[i];
			var selection  = data[i].markets;
			var _tempTable =  '';
			var oddHashes  = [];
			for ( var j in selection) {
				oddHashes.push(selection[j].hash);
				_tempTable += (status == 1) ? parseMarkets(selection[j],marketInfo) : parseWinnerOdd(selection[j],marketInfo);
			}
			var _tempInfo = (status == 1)? parseInfo(data[i],_tempTable) :  parseWinnerContainer(data[i],_tempTable,perm,type,savePerm);

			(i % 2) ? odd += _tempInfo : even += _tempInfo ;
		}
	%>
	<div class="">
		<h4 class="resize2">
			<a href="#" id="resize2"><span class="glyphicon glyphicon-resize-small"></span></a>
		</h4>	
		<div class="row col-sm-2 pull-right">	
		<% if (status == 1) { %>
			<label for="incdec" class="label-control col-sm-4"> Accrual</label>
			<div class="form-group control col-sm-8">
				<select name="incdec" id="incdec" class="form-control input-sm">
					<option value="0.01">0.01</option>
					<option value="0.02">0.02</option>
					<option value="0.03">0.03</option>
					<option value="0.04">0.04</option>
					<option value="0.05">0.05</option>
					<option value="0.06">0.06</option>
					<option value="0.07">0.07</option>
					<option value="0.08">0.08</option>
					<option value="0.09">0.09</option>
					<option value="0.10">0.10</option>
				</select>
			</div>
		<% } else { 
			if (perm != false) { 
				if (marketStatus == 1) {

					var params = {
						eid : eid,
						type : "event",
						field : type,
						status : 0,

					};
				%>

			<button class="btn btn-danger btn-sm removeBtn" data-link="cancel_process" data-params='<%= JSON.stringify(params) %>'><span class="glyphicon glyphicon-remove"></span> Cancel All Markets</button>
		<% } } } %>
		</div>
		<div class="clearfix"></div>	
	</div>
	<%= parseContainer(even)%>
	<%= parseContainer(odd)%>
	
	<% } else { %> 
		<div class="alert alert-info" style="font-weight:bold;text-align:center;font-size: 15px;margin:20px 10px 0px 10px;">
			<%= title.noMarket%>
		</div>
	<% } %>




</script>


