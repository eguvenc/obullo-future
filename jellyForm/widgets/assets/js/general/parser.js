    "use strict";
var ODD_MANAGER = new function() {
    var _params = {
        data               : {},
        title              : {},
        container_id       : "template",
        template_url       : "/assets/templates/market.tpl",
        live_template_url  : "/assets/templates/live_market.tpl",
        type               : "",
        market_id          : "",
        odd_id             : "",
        sbv                : "",
        event_id           : "",
        key                : "",
        verifyType         : "",
        winnerData         : [],
        doubleChance       : ["13_","38_","39_","40_","143_","156_"],
        loserData          : [],
        postData           : {},
        incdec             : 0,
        start              : "<span class=\"glyphicon glyphicon-play\"></span>",
        stop               : "<span class=\"glyphicon glyphicon-stop\"></span>",
        data_url           : "/bet/events/market_edit/",
        live_data_url      : "/bet/live/completed_event/",
        save_winner_url    : "/ajax/bets/event_winner_save",
        request_url        : "/ajax/bets/event_feed_edit",
        live_request_url   : "/ajax/bets/live_event_market_edit",
        cancel_url         : "/ajax/bets/cancel_event_market",
        cancel_process_url : "/ajax/bets/cancel_market_process"
    };

    var _private = {
        toggleAll : function (saltId,field,toggleAllF,toggleAllE) {
            _params.$thisObj.toggleClass("btn-danger btn-success");
            var status = field;
            
            (_params.data[_params.key][status] == 1) ? _params.$thisObj.html(_params.title[toggleAllF]) : _params.$thisObj.html(_params.title[toggleAllE]);

            for ( var i in _params.data[_params.key].markets) {
                var id = saltId+_params.data[_params.key].markets[i].odd_id;
                
                if (_params.data[_params.key][status] == _params.data[_params.key].markets[i][status]) {
                    (_params.data[_params.key][status] == 1) ? $("#"+id).html(_params.start) : $("#"+id).html(_params.stop);
                    _params.data[_params.key].markets[i][status] = (_params.data[_params.key].markets[i][status] == 1) ? 0 : 1;
                    $("#"+id).toggleClass("btn-danger btn-success");
                }
            }
            _params.data[_params.key][status] = (_params.data[_params.key][status] == 1) ? 0 : 1;
        },
        toggleOne : function (status) {
            var status = status;
            for(var i in _params.data[_params.key].markets) {
                if (_params.data[_params.key].markets[i].odd_id == _params.odd_id) {
                    (_params.data[_params.key].markets[i][status] == 1) ? _params.$thisObj.html(_params.start) : _params.$thisObj.html(_params.stop);
                    _params.data[_params.key].markets[i][status] = (_params.data[_params.key].markets[i][status] == 1) ? 0 : 1;
                    _params.$thisObj.toggleClass('btn-danger btn-success');
                }
            }
        },
        toggleEvent : function () {
            (_params.data[_params.key].all_active == 1) ? _params.$thisObj.html(_params.start) : _params.$thisObj.html(_params.stop);
            _params.data[_params.key].all_active  = (_params.data[_params.key].all_active == 1) ? 0 : 1;
            _params.$thisObj.toggleClass('btn-danger btn-success');
        },
        setParams : function (){
            var params        = _params.$thisObj.data('params');
            try {params = JSON.parse(params)} catch (e) {}
            _params.key       = params.mid+'|--|'+params.sbv;
            _params.market_id = params.mid;
            _params.sbv       = params.sbv;
            _params.event_id  = params.eid;
            if (params.oid) {
                _params.odd_id = params.oid
            } else {
                _params.odd_id = [];
                for (var i in _params.data[_params.key].markets) {
                    _params.odd_id.push(_params.data[_params.key].markets[i].odd_id);
                }
            }
            
        },        
        setCancelParams : function (){
            var params        = _params.$thisObj.data('params');
            try {params = JSON.parse(params)} catch (e) {}
            _params.postData        = params;
            if (params.type != 'event') {
                _params.key             = params.mid+'|--|'+params.sbv;
                _params.postData.hashes = [];
                for (var i in _params.data[_params.key].markets) {
                    _params.postData.hashes.push(_params.data[_params.key].markets[i].hash);
                }
            }
        },
        changeStatus : function (field,toggleAllF,toggleAllE,saltId) {

            var jobKey = 'feedTransmission';
            var fieldKey = (field == 'market' || field == 'odd') ? 'is_active' : field; 
            switch  (toggleAllF) {
                case 'startTransmissionAll':
                case 'feedStartAll':
                    var value = (_params.data[_params.key][fieldKey] == 1)  ? 0 : 1;
                    var toggle = 1;
                    break;
                case 'feed':
                case 'transmission':
                    var value = (_params.data[_params.key].markets[_params.odd_id][fieldKey] == 1)  ? 0: 1;
                    var toggle = 0;
                    break;
            }
            var oldData = $('input[name="oldData"]').val();
            var url = (_params.type == 'active') ? 'live_request_url': 'request_url';
            COMMON.ajax(
                _params[url],
                {
                    eid   :_params.event_id,
                    mid   :_params.market_id,
                    oid   :_params.odd_id,
                    sbv   :_params.sbv,
                    value : value,
                    field : field,
                    job   : jobKey,
                    oldData : oldData
                },
                {
                    type:'POST',
                    async : true
                },
                function(res){

                    if (res.success) {
                        if (toggle) {
                            _private.toggleAll(saltId,fieldKey,toggleAllF,toggleAllE,field)
                        } else {
                            _private.toggleOne(fieldKey)
                        }
                        return;
                    } 
                    alert('hata');
            })
        },     
        changeLiveEventStatus : function (field) {
            var value = (_params.data[_params.key].all_active == 1)  ? 0 : 1;
            var toggle = 1;
            var oldData = $('input[name="oldData"]').val();
            var url = 'live_request_url';
            COMMON.ajax(
                _params[url],
                {
                    eid   :_params.event_id,
                    mid   :_params.market_id,
                    oid   :_params.odd_id,
                    sbv   :_params.sbv,
                    value : value,
                    field : 'event',
                    oldData : oldData
                },
                {
                    type:'POST',
                    async : true
                },
                function(res){

                    if (res.success) {
                        _private.toggleEvent();
                        return;
                    } 
                    alert('hata');
            })
        },
        cancelMarket : function (process) {

            var event_name = $('#event_name').html();
            var market = 'All Markets';
            if (_params.postData.type == 'market') {
                var event_detail = _params.data[_params.key];
                var market       = event_detail.market_name['en']+' '+event_detail.special_bet_value;
            }
            var url = (process) ? _params.cancel_process_url : _params.cancel_url; 
            POPUP.injectValue('title','Cancel Odds');
            POPUP.injectValue('url', url);
            POPUP.injectValue('content','<b>'+event_name+'</b> will be cancelled <b>'+market+'</b>');
            POPUP.modal('cancel_market_popup',true);
            var formObj = FORM_FACTORY.create('cancel_market_popup_form');
            formObj.whenSubmit(function(res){
                if (res.success) {
                    $('#send_verify').remove();
                    $('#confirm_cancel').remove();
                    var url = (_params.type == 'completed') ? 'live_data_url': 'data_url';
                    COMMON.ajax(
                        _params[url]+_params.postData['eid'],
                        {},
                        {
                            type : "POST",
                            async : true,
                        },
                        function (response) {
                            obj.setData(response,_params.type);
                            setTimeout(function(){
                                POPUP.close('cancel_market_popup');
                            }, 2500);
                        }
                    );
                }
            },
            function () {
                return true;
            },function (args) {
                $.extend(args, args, _params.postData);
                return args;
            });
        },
        saveWinner : function (key, uniq) {
            // console.warn(_params.data);
            var data    = _params.data[key];
            var winners = "";
            var title   = 'Save Winner '+data.market_name.en;
                console.warn(data);
            for(var i in data.markets) {

                if ($.inArray(data.markets[i].hash,_params.winnerData[uniq]) !== -1) {
                    var selection = (data.markets[i].team_name != "") ? data.markets[i].team_name : data.markets[i].out_come;
                    winners += "Your selection is <b>"+selection+"</b> with <b>"+data.markets[i].odd+"</b> value.<br>";
                }
            }
            winners += "Are you sure ?";
            POPUP.injectValue('title',title);
            POPUP.injectValue('content',winners);
            POPUP.modal('save_event_popup',true);
            $('input[name="verify_code"]').remove();
            $('label[for="cancel_note"]').remove();
            $('#send_verify').remove();
            var formObj = FORM_FACTORY.create('event_winner_save_form');
            formObj.whenSubmit(function(res){
                if (res.success) {
                    $('#confirm_cancel').remove();
                    var url = (_params.type == 'completed') ? 'live_data_url': 'data_url';
                    COMMON.ajax(
                        _params[url]+_params.postData['eid'],
                        {},
                        {
                            type : "POST",
                            async : true,
                        },
                        function (response) {
                            setTimeout(function(){
                                POPUP.close('save_event_popup');
                            }, 5000);
                        }
                    );
                }
            },
            function () {
                return true;
            },function (args) {
                $.extend(args, args, _params.postData);
                return args;
            });
        }
     };

    var obj = {
        setData : function (data,type){
            _params.type = type;
            if (type == 'completed') {
                data.status = 0;
            }
            _params.data  = data.data; 
            _params.title = data.title;
            this.parse(data);
            this.plunk();
            this.init();
        },
        parse : function (data) {
            var url = 'template_url';
            if (_params.type == 'active') {
                url = 'live_template_url';
            }
            TEMPLATE.parse(_params[url], {data: data}, _params.container_id);
        },
        plunk : function () {
            var parsedObj = {};
            for (var i in _params.data) {
                var key = (_params.type == 'active') ? _params.data[i].betradar+'|--|'+_params.data[i].special_bet_value : _params.data[i].market_id+'|--|'+_params.data[i].special_bet_value;
                var selection = _params.data[i].markets;
                parsedObj[key]         = _params.data[i];
                parsedObj[key].markets = {};
                for(var k in selection) {
                    var oddId = selection[k].odd_id
                    parsedObj[key].markets[oddId] = selection[k];
                }
            }
            _params.data = parsedObj;
        },
        startProcess : function (element,e) {
            e.preventDefault();
            _params.$thisObj = element;
            _private.setParams();
        },
        init : function () {
             $(document).on("click","[data-link='live_market_active']",function(e){
                obj.startProcess($(this),e);
                _private.changeStatus('market','startTransmissionAll','stopTransmissionAll','active_');
            });
            $(document).on("click","[data-link='live_odd_active']",function(e){
                obj.startProcess($(this),e);
                _private.changeStatus('odd','transmission');
            });   
            $(document).on("click","[data-link='live_events_active']",function(e){
               obj.startProcess($(this),e);
                _private.changeLiveEventStatus('event');
            });
            _params.incdec = $('select[name="incdec"]').val();
            $(document).on("click","[data-link='cancel_process']",function(e){
                e.preventDefault();
                _params.$thisObj = $(this);
                _params.verifyType = 'cancelOdd';
                _private.setCancelParams();
                _private.cancelMarket(true);
                
            });
            $(document).on("click","[data-link='cancel_market']",function(e){
                e.preventDefault();
                _params.$thisObj = $(this);
                _params.verifyType = 'cancelOdd';
                _private.setCancelParams();
                _private.cancelMarket(false);
                
            });
            $(document).on("click","[data-link='send_verify']",function(e){
                e.preventDefault();
                COMMON.ajax(
                '/jsons/user/send_verify_code',
                {request : _params.verifyType},
                {
                    type:'POST',
                    async : true
                },
                function(res){
                })
                
            }); 
            $(document).on("click","[data-link='all_feeds']",function(e){
                obj.startProcess($(this),e);
                _private.changeStatus('is_feed','feedStartAll','feedStopAll','feed_');
            }); 
            $(document).on("click","[data-link='all_transmissions']",function(e){
                obj.startProcess($(this),e);
                _private.changeStatus('is_active','startTransmissionAll','stopTransmissionAll','transmission_');
            }); 
            $(document).on("click","[data-link='odd_feed']",function(e){
                obj.startProcess($(this),e);
                _private.changeStatus('is_feed','feed');
            });
            $(document).on("click","[data-link='odd_transmission']",function(e){
               obj.startProcess($(this),e);
                _private.changeStatus('is_active','transmission');
            });
            $(document).on('change','select[name="incdec"]',function(){
                _params.incdec = $('select[name="incdec"]').val();
            });
            $(document).on('change','[data-link="choose_winner"]',function(){
                var uniq = $(this).data('param').unique;
                var hash = $(this).data('param').hash;
                var length = 1;   
                if ($.inArray(uniq, _params.doubleChance) !== -1) { 
                    length = 2;
                }
                _params.winnerData[uniq] = _params.winnerData[uniq] || [];
                _params.loserData[uniq]  = _params.loserData[uniq] || [];
                var indexWinner          = _params.winnerData[uniq].indexOf(hash);
                var indexLoser           = _params.loserData[uniq].indexOf(hash);

                if ($(this).val() == 1 && indexWinner === -1 && _params.winnerData[uniq].length < length) {
                    chooseWinner(hash,uniq);
                } else if ($(this).val() == -1) {
                    _params.winnerData[uniq] =  [];
                    _params.loserData[uniq] =  [];
                } else {
                    _params.winnerData[uniq] =  [];
                    chooseWinner(hash,uniq);
                }
                function chooseWinner (hash,uniq) {
                    _params.loserData[uniq] = [];
                    _params.winnerData[uniq].push(hash);

                    $('[data-market-id="'+uniq+'"]').each(function(){
                        if ($.inArray($(this).data('param').hash, _params.winnerData[uniq]) === -1) {
                            $(this).val(-1);
                            _params.loserData[uniq].push($(this).data('param').hash); 
                        }
                    });
                }
            });
            $(document).on('click','[data-link="save_winner"]',function(){
                _params.postData = $(this).data('params');
                var uniq = $(this).data('params').mid+"_"+$(this).data('params').sbv;
                var key  = $(this).data('params').mid+"|--|"+$(this).data('params').sbv;
                var winnerLen = 1;
                if ($.inArray(uniq, _params.doubleChance) !== -1) { 
                    winnerLen = 2;
                }

                _params.winnerData[uniq] = _params.winnerData[uniq] || [];
                _params.loserData[uniq]  = _params.loserData[uniq] || [];
                _params.verifyType = 'saveWinner';
                $.extend(_params.postData,{winners : JSON.stringify(_params.winnerData[uniq]),losers : _params.loserData[uniq]});

                if (_params.winnerData[uniq].length < winnerLen || _params.loserData[uniq].length == 0)  {
                    POPUP.injectValue('popup_title', 'Error');
                    POPUP.injectValue('popup_message', 'You need to select a winner');
                    POPUP.modal('message', true);
                    return;
                }
                // if (_params.postData.save == 'true') {
                _private.saveWinner(key,uniq);
                return;
            });
            $(document).on('click','[data-link="inc-odd"]',function(){
                var name     = $(this).data('params');
                var value    = isNaN(parseFloat($('input[name="'+name+'"]').val()))  ? parseFloat("0.00") : parseFloat($('input[name="'+name+'"]').val());
                var newValue = parseFloat(value)+parseFloat(_params.incdec);
                $('input[name="'+name+'"]').val(newValue.toFixed(2));
            });
            $(document).on('click','[data-link="dec-odd"]',function(){
                var name     = $(this).data('params');
                var value    = isNaN(parseFloat($('input[name="'+name+'"]').val()))  ? parseFloat("0.00") : parseFloat($('input[name="'+name+'"]').val());
                var newValue = parseFloat(value)-parseFloat(_params.incdec);
                if (parseFloat(_params.incdec) > parseFloat(value)) {
                    newValue = 0;
                }
                $('input[name="'+name+'"]').val(newValue.toFixed(2));
            })
        }

    };
    return obj;
};

$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});
