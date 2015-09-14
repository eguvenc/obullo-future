(function ($) {
    "use strict";
    var teamHandler = function (objt,ms,options) {

 		var _params = {
			selected  : {},
			inputName : '',
			inputs    : {},
			linkName  : 'team-link',
            disabled  : false,
 		};

    	var _private = {
    		buildElements : function (){
		   		_params.inputs[options.wrapper] = {};
				_params.inputs[options.wrapper].$div = $('<div></div>').attr('id',options.wrapperId).addClass(options.wrapperId);
				_params.inputs[options.wrapper].$input = $('<input>').attr({type:"hidden",name:_params.inputName});
                _params.inputs[options.wrapper].$input.prependTo($('#'+_params.inputName).parent().parent());
    		},
    		render : function () {
    			_params.inputs[options.wrapper].$ul  = $('<ul></ul>').attr('id',options.containerId).addClass(options.templates.ul);
				_params.inputs[options.wrapper].$li = {};

				for(var i in _params.selected) {
					_params.inputs[options.wrapper].$li  = $('<li><a class="'+options.templates.anchor+'" href="javascript:;" data-link="'+_params.linkName+'" data-value="'+i+'">'+_params.selected[i]+' <span class="glyphicon glyphicon-remove hide-remove"></span></a></li>').addClass(options.templates.li).appendTo(_params.inputs[options.wrapper].$ul);
                    _private.setValue(_params.selected[i]);
				}

				_params.inputs[options.wrapper].$div.html(_params.inputs[options.wrapper].$ul)
				_params.inputs[options.wrapper].$div.appendTo(ms.container.parent());
    		},
    		addToSelected : function (record) {
    			if (! _params.selected[record[0].id]) {
    				_params.selected[record[0].id] = record[0].name;
    				_private.setValue();
					_private.render();
				}
    		},
    		setValue : function (){
    			_params.inputs[options.wrapper].$input.val(JSON.stringify(_params.selected));
    		},
    		removeFromSelected : function (element, data){
    			delete _params.selected[data];
    			_private.setValue();
				element.parent().remove();
    		}
    	};

    	var obj = {
    		reset : function () {
				_params.selected = {};
				_params.inputs[options.wrapper].$input.val('');
				_params.inputs   = {};
				$('#'+options.wrapperId).remove();
    		},
            disable : function (){
                ms.disable();
                _params.disabled = true;
            },
    		init : function () {
    			_params.inputName = options.handler;
				_private.buildElements();
                if (options.selecteds) {
                    _params.selected = options.selecteds;
    				_private.render();
    			}
				$(ms).on('selectionchange',function (e,m,record) {

					if (! _params.inputs[options.wrapper]) {
						_private.buildElements();
					}
                    if (typeof options.onSelect == 'function') {
                        if (! options.onSelect(record[0].id,record[0].name)) {
                            ms.removeFromSelection(record,true,{});
                            return false;
                        }
                    }
					_private.addToSelected(record);
					
					ms.removeFromSelection(record,true,{});
				})

				$(document).on('click','[data-link="'+_params.linkName+'"]',function(){
                    if (_params.disabled) {
                        return false;
                    }
					var data = $(this).attr('data-value');
                    if (typeof options.onDelete == 'function') {
                        if (! options.onDelete(data)) {
                            return false;
                        }
                    }
					_private.removeFromSelected($(this),data);

				})
    		}
    	};

    	return obj;
    };
    
    $.fn.teamHandler = function (options) {
        var $obj = $(this);
        options.handler = $obj.attr('id');
        var data = {};
        data.selecteds = $('textarea[name="'+options.handler+'"]').val();
        var ms   = $('#'+options.handler).magicSuggest(options);
		try {data.selecteds = JSON.parse(data.selecteds);} catch(e) {}
    	var teams = new teamHandler($obj,ms,$.extend(true,$.fn.teamHandler.defaults,options,data)); 

    	teams.init();

    	return teams;
    };

    $.fn.teamHandler.defaults = {
    	templates : {
			div    : 'col-sm-12 col-sm-offset-4',
			ul     : 'list-group',
			li     : 'list-group-item',
			anchor : '',
    	},
		wrapperId   : 'team_wrapper',
		containerId : 'team_list',
    };
})(jQuery);