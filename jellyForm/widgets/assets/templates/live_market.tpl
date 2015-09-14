<script>
<% 
	oldData = $('input[name="oldData"]').val();

	function parseContainer (value){
		return '<div class="col-sm-6">'+value+'</div>';
	}

	function parseWinnerContainer (market,odds) {
		try {
			market.market_name = JSON.parse(market.market_name);
			market.market_name = market.market_name['en'];
		} catch (e) {}
		var is_active = (parseFloat(market.is_active)  == 1) ? {'classN' : 'danger','textN'  : title.stopTransmissionAll} : {'classN' : 'success','textN'  : title.startTransmissionAll};
		var sbv = (market.special_bet_value == '-1') ? '' : market.special_bet_value;
		return '<div class="col-sm-12 section">\
					<div class="section_resize">\
						<a href="#"><span class="glyphicon glyphicon-eye-open"></span></a>\
					</div>\
					<div class="col-sm-12">\
						<div class="col-sm-6 sectionTitle">'+market.market_name+' '+sbv+'</div>\
						<div class="col-sm-5 col-sm-offset-1 text-right">\
						<button class="hBtn btn btn-'+is_active.classN+' btn-sm" data-link="live_market_active" data-params=\'{"eid" : '+market.event_id+', "mid" : '+market.betradar+',"sbv" : "'+market.special_bet_value+'"  }\' >'+is_active.textN+'</button>\
						</div>\
						<div class="clearfix"></div>\
					</div>\
					<div class="col-sm-12">\
						<div class="col-sm-12">\
							<br>\
							<div id="response_changeOdd_'+market.market_id+'_'+sbv+'"></div>\
							<input type="hidden" name="eid" value="'+market.event_id+'">\
							<input type="hidden" name="mid" value="'+market.market_id+'">\
							<table class="table table-hover" style="display: table;">\
							<thead>\
								<tr>\
									<th>'+title.outCome+'</th>\
									<th>'+title.odds+'</th>\
									<th>'+title.responsible+'</th>\
									<th>'+title.count+'</th>\
									<th>'+title.stake+'</th>\
									<th>'+title.risk+'</th>\
									<th>'+title.transmission+'</th>\
								</tr>\
							</thead>\
							<tbody>\
								'+odds+'\
							</tbody>\
							</table>\
							<div class="clearfix"></div>\
						</div>\
					</div>\
				</div>';

	}

	function parseWinnerOdd (odds,market) {
		try {odds.team_name = JSON.parse(odds.team_name)} catch (e) {}
		var is_active       = (parseFloat(odds.is_active) == 1 ) ? {'classT' :  'danger','classN' : 'stop'} : {'classT' :  'success','classN' : 'play'};
		var out_come = (typeof odds.team_name != 'undefined' && odds.team_name != '') ? odds.team_name['en'] : odds.out_come ;
		var lost    = 'selected';
		var win     = '';
		var result  = title.lost;
		var success = 'style="background-color:#f2dede !important;"';
		if (odds.type == 1) {
			win     = 'selected';
			lost    = '';
			result  = title.won;
			success = 'style="background-color:#dff0d8 !important;"';
		}
		return '<tr>\
					<td>'+out_come+'</td>\
					<td>'+odds.odd+'</td>\
					<td>0</td>\
					<td>0</td>\
					<td>0</td>\
					<td>0</td>\
					<td>\
					<button class="btn btn-'+is_active.classT+' btn-xs" data-link="live_odd_active" id="active_'+odds.odd_id+'" data-params=\'{"eid" : '+market.event_id+',"oid" : "'+odds.odd_id+'","mid" : '+market.betradar+' , "sbv" : "'+market.special_bet_value+'" }\'>'+'<span class="glyphicon glyphicon-'+is_active.classN+'"></span>'+'</button>\
					</td>\
				</tr>';		

	}

	title    = data.title;
	var odd  = '';
	var even = '';
	var data = data.data;
	if (! $.isEmptyObject(data)) {
		var eventIsAct = (parseFloat(data[0].all_active) == 1) ? {'classT' :  'danger','classN' : 'stop'} : {'classT' :  'success','classN' : 'play'};
		var events = data[0];
		var odds   = data[0].markets;
		var uniq   = new Date().getTime();
		for(var i in data) {
			for(var j in data[i]) {
				var _tempInfo = '';
				var _tempTable =  '';
				for(var k in data[i][j]) {
					if (typeof data[i][j][k] === 'object') {
						_tempTable += parseWinnerOdd(data[i][j][k],data[i]);
					}
				}
				_tempInfo = parseWinnerContainer(data[i],_tempTable);
			}
			(i % 2) ? odd += _tempInfo : even += _tempInfo ;
		}
	%>
	<div class="">
		<h4 class="resize2">
			<a href="#" id="resize2"><span class="glyphicon glyphicon-resize-small"></span></a>
		</h4>	
		<div class="row col-sm-2 pull-right">	
		<button id="active_<%= uniq%>" class="btn btn-<%= eventIsAct.classT %> btn-xs" data-link="live_events_active" data-params='{ "eid" : <%=events.event_id%>,"oid" : <%= uniq%>,"mid" : <%=events.betradar%> , "sbv" : "<%=events.special_bet_value%>" }'><span class="glyphicon glyphicon-<%=eventIsAct.classN%>"></span></button>
			
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


