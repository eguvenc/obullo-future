/*
 * 
 * @package		CORE Objects {COMMON, QUEUE, LINKS_STATICS, CUSTOM_EVENTS, LANG, REFRESH_INTERVAL, ACCOUNTING}
 * @copyright 	2014 PARADOKS 	<http://www.obullo.com/>, PBetting <http://www.pbetting.com/>.
 * @author 		Rabih Abou Zaid <rabihsyw@gmail.com>
 * @dependency	Jquery
 *
 */

var AHelp = function () {
	var _params  = {
		current_parent 	: 0,
		container 		: '#table-view-help',
		res 			: {},
		resGuide		: {}
	};
	
	var _path_params = {
		stack : []
	};

	var _private = {
		resetPath : function () {
			var $nw = $('<a></a>').attr({'href' : '#', 'data-stem' : 0, 'data-link' : 'stem'}).html('Root');
			$('.pg-path-links').html($nw);
			
			if (_params.current_parent == 0) {
				_path_params.stack = [];
			} else {
				if (COMMON.inArray(_path_params.stack, _params.current_parent)) {
					var del = false;
					for (var j in _path_params.stack) {
						if (_path_params.stack[j] == _params.current_parent)
							del = true;
						if (del)
							delete _path_params.stack[j];
					}
				}
			}
		},
		setPathStack : function () {

			if (_params.current_parent)
				_path_params.stack.push(_params.current_parent);					
		},
		buildPath : function () {
			this.resetPath();
			this.setPathStack();

			for (var i in _path_params.stack) {
				var o = _params.resGuide[_path_params.stack[i]];

				var $nw = $('<a></a>').attr({'href' : '#', 'data-stem' : o._id.$id, 'data-link' : 'stem'}).html(o.name.en);
				$('.pg-path-links').append(' &raquo; ').append($nw);
			}
		},
		buildResGuide : function () {
			for (var i in _params.res) {
				_params.resGuide[_params.res[i]._id.$id] = _params.res[i];
			}
		},
		buildHtml : function () {
			$(_params.container).html('');
			for (var i in _params.res) {
				var $tr = $('<tr></tr>');
				var $td1 = ($('<td></td>')).appendTo($tr);
				var $td2 = ($('<td></td>')).appendTo($tr);
				var $td3 = ($('<td></td>')).appendTo($tr);
				var $td4 = ($('<td></td>')).appendTo($tr);

				$('<a></a>').attr({'href' : '#', 'data-stem' : _params.res[i]._id.$id, 'data-link' : 'stem'}).html(_params.res[i].name.en).appendTo($td1);
				$td2.html(_params.res[i].sections_name.en);
				if (_params.res[i].categories_name)
					$td3.html(_params.res[i].categories_name.en);
				else
					$td3.html('-');
				$td4.html("<a href='#' data-link='cat-edit' data-link-params='{\"catid\" : \""+_params.res[i]._id.$id+"\"}' ><span class='glyphicon glyphicon-pencil'></span></a>");
				$(_params.container).append($tr);
			}
		}
	};
	var obj      = {
		getCurrentStem : function () {
			return _params.current_parent;
		},
		openStem : function (parent) {
			_params.current_parent = parent;
			COMMON.ajax('/ajax/help/categoriesGetList/', {parent : parent}, {}, function (res) {
				_params.res = res;
				_private.buildResGuide();
				_private.buildHtml();
				_private.buildPath();
			});
		},
		init 	: function () {
			obj.openStem(0);
			$(document).on('click', '[data-link=stem]', function () {
				obj.openStem($(this).data('stem'));
			});
		}
	};
	return obj;
}();