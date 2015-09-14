/*
 * 
 * @copyright 	2014 PARADOKS 	<http://www.obullo.com/>
 * @author 		Rabih Abou Zaid <rabihsyw@gmail.com>
 * @dependency	Jquery, COMMON
 *
 */

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* ********************************************************************** FILTER MANAGER ********************************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var FILTER_MANAGER = function ($, C, T) {
	
    "use strict";

	var _params  = {
		options 		: {
			mainFiltersId   : 'main-filters-box',
            'dtd-box'	    : 'f-box-container',
            'dtd-content'   : 'content',
            'dtd-link'      : 'switch',
            'dtd-append'    : 'append',
            'dtd-remove'    : 'remove',
		},
		definedTypes 	: {
		},
		filters 		: {},
		inputs 			: {},
		response 		: {}
	};
	
	var _private = {
		createElement 	: function (tag, _class) {
			return $(document.createElement(tag)).addClass(_class);
		},
		buildFilterJson : function () {
			var json = {};

			for (var i in _params.filters) {

				var tp = _params.filters[i].type;
				if (_params.inputs[tp]) {

					json[tp] = json[tp] || {};
					var inputPass = [];
					var xx = 0;
					for (var j in _params.inputs[tp]) {

						var $input = $(_params.inputs[tp][j]);
						var name = $input.attr('name');
						if (name) {
							if (C.inArray(['radio', 'checkbox'], $input.attr('type'))) {

								/**
								 * If input has been registered as read pass the rest of code.
								 */
								if (C.inArray(inputPass, name)) {

									continue;
								}

								var $checked = $input.parents('[data-filter=f-box-container]').find('[name='+name+']:checked');

								if ($checked.length > 1) {
									$checked.each(function (x, v) {
										json[tp][name] = json[tp][name] || [];
										json[tp][name].push($(v).val());
									});
								} else {
									json[tp][name] = $input.parents('[data-filter=f-box-container]').find('[name='+name+']:checked').val();
								}
							} else {
								json[tp][name] = $input.val();
							}

							inputPass[name] = name;
						}
					}
				}
			}
			return json;
		},
		buildTypesSelect : function () {
			var $s = this.createElement('select', 'form-control mainFilter').attr({'data-filter' : ''+_params.options['dtd-link']});
            var $o = this.createElement('option', '').val('').html('Select filter').appendTo($s);
			for (var i in _params.definedTypes) {
				if (!this.checkTypeIsChoosen(i)) {
					$o = this.createElement('option', '').val(i).html(_params.definedTypes[i].title).appendTo($s);
				}
			}
			return $s;
		},
		buildPlainFilter : function () {
			var id = Math.floor(Math.random() * 500 + 1);
			var $root = this.createElement('fieldset').attr({
				'data-filter' 		: _params.options['dtd-box'],
				'data-filter-num'	: id
			});
			var $filterC = this.createElement('div', 'form-group col-sm-9').appendTo($root);
			var $buttonC = this.createElement('div', 'form-group col-sm-2').appendTo($root);

			$filterC.append(this.createElement('label', '').html('Filter :'));
			$filterC.append(this.buildTypesSelect());
            $filterC.append(this.createElement('div', 'col-sm-12').attr('data-filter', _params.options['dtd-content']));
			$buttonC.append(this.createRemoveButton());
            
            return [$root, id];
		},
		createPostButton	: function () {
			return _private.createElement('button', 'btn btn-info btn-sm FilterBtn').attr({
				type : 'button'
			}).html('Step 1 - Filter').on('click', function () {
				FILTER_MANAGER.post();
			});
		},
		createRemoveButton 	: function () {
			return this.createElement('button', 'btn btn-danger btn-sm removeFilter').attr({
				'type' : 'button',
				'data-filter' : _params.options['dtd-remove']
			}).html(this.createElement('span', 'glyphicon glyphicon-minus')).on('click', function () {

				FILTER_MANAGER.remove($(this).parents('[data-filter-num]').data('filter-num'));
			});
		},
		createAppendButton 	: function () {
			return _private.createElement('button', 'btn btn-info btn-sm FilterBtn col-sm-offset-1').attr({
				'type' : 'button'
				// 'data-filter' : _params.options['dtd-append']
			}).html(_private.createElement('span', 'glyphicon glyphicon-plus')).on('click', function () {
				FILTER_MANAGER.append();
			});
		},
		investigateInputs : function (type, $tpl) {

			var $els = $tpl.find('input,select,textarea');

			/*_params.inputs[type] = _params.inputs[type] || [];*/
			_params.inputs[type] = [];
			
			$els.each(function (x, v){
				_params.inputs[type].push($(v));
			});
			console.info(_params.inputs);
		},
		setOpened : function (id, type) {
			_params.filters[id] = _params.filters[id] || {};
			_params.filters[id].type = type;
		},
		close 	  : function (id, type) {
			C.deleteKey(_params.filters, id);
		},
		loadTemplate : function (id, type) {
			var $target = $(document).find('[data-filter='+_params.options['dtd-box']+'][data-filter-num='+id+']').find('[data-filter='+_params.options['dtd-content']+']')
			var newF = _params.definedTypes[type];
            var res = $(T.getParsed(newF.template, newF.data, {}, {async : false}));
            $target.html(res).slideDown();

            this.investigateInputs(type, res);
		},
		checkTypeIsChoosen : function (type) {
			for (var i in _params.filters) {
				if (_params.filters[i].type == type) {
					return true;
				}
			}
			return false;
		},
		getBoxIdByType : function (type) {
			for (var i in _params.filters) {
				if (type == _params.filters.type) {
					return i;
				}
			}
			return null;
		}
	};
	
	var obj      = {
		build	: function (args) {
			_params.options.url     = args.url || '';
			_params.options.id      = args.id || '';
			_params.options.target  = args.target || '';
			_params.options.default = args.default || '';
			obj.success             = typeof args.success == 'function' ? args.success : function () {};
			obj.onChange            = typeof args.onChange == 'function' ? args.onChange : function () {};

			if (C.inArray([_params.options.target, _params.options.id, _params.options.url], '')) {
				C.logger.error('FILTER_MANAGER : init : missing paramets in the arguments object, url, id and target are required.');
                return;
			}

			if (C.isEmpty(_params.definedTypes)) {
				C.logger.error('FILTER_MANAGER : init : There is no defined filters to build.');
                return;
			}
            
            var $f = _private.createElement('div', 'col-sm-12').attr({id : _params.options.mainFiltersId});
            var $b = _private.createElement('div', 'col-sm-12 filters-bottom').html(_private.createPostButton());
            $b.append(_private.createAppendButton());
            $('#'+_params.options.id).append($f).append($b);
            this.append(_params.options.default);
            

            $(document).on('change', '[data-filter='+_params.options['dtd-link']+']', function () {
            	var num = $(this).parents('[data-filter='+_params.options['dtd-box']+']').data('filter-num');
                obj.switch(num, $(this).val());
            });
		},
		define 	: function (type, title, template, dataOrSource, func) {
			obj[type+'_func'] = (typeof func == 'function') ? func : function () {};
			_params.definedTypes[type] = {
				'template' : template,
				'data' : dataOrSource,
				'title' : title,
				'func'	: obj[type+'_func']
			};
		},
		append 	: function (autoSelect) {
			if (!autoSelect && _private.checkTypeIsChoosen('')) {
				return;
			}
			if (autoSelect && _private.checkTypeIsChoosen(autoSelect)) {
				return;
			}
			var nw = _private.buildPlainFilter();
			_private.setOpened(nw[1], '');
            $('#'+_params.options.id+' #'+_params.options.mainFiltersId).append(nw[0]);
            if (autoSelect) {
            	this.switch(nw[1], autoSelect);
            }
		},
		remove  : function (id) {

            console.warn('Remove filter, ', arguments);
            var $parent = $(document).find('[data-filter='+_params.options['dtd-box']+'][data-filter-num='+id+']');
            var type = $parent.find('[data-filter='+_params.options['dtd-link']+']').val();
            
            _private.close(id, type);

			$parent.slideUp(function () {
				$(this).detach().remove();
			});
            if (!C.count(_params.filters)) {
            	this.append();
            }
		},
		switch 	: function (id, toType) {

            console.warn('Switch filter, ', arguments);
            var $parent = $(document).find('[data-filter='+_params.options['dtd-box']+'][data-filter-num='+id+']');
            var $target = $parent.find('[data-filter='+_params.options['dtd-content']+']');
            var box_id = $target.parents('[data-filter-num]').data('filter-num');

            if (!toType) {
            	/**
            	 * Unregister filter if the user chooses an empty type
            	 */
            	$target.slideUp().html('');
            	_private.setOpened(id, toType);
            	return;
            } else {
            	
            	if (_private.checkTypeIsChoosen(toType)) {
            		if (id != _private.getBoxIdByType(toType)) {
            			this.remove(id);
            		}
            	} else {

		            _private.setOpened(id, toType);
		            _private.loadTemplate(id, toType);
            	}
            }

            var newF = _params.definedTypes[toType];
            if (newF.func) {
            	obj[toType+'_func']();
            }
            $parent.find('[data-filter='+_params.options['dtd-link']+']').find('option[value='+toType+']').prop('selected', true);

            obj.onChange(toType);
		},
		defineList : function (urlOrJson, func) {
			this.defineListClo = func;

			if (typeof urlOrJson == 'string') {
				C.JQueryAjax(urlOrJson, {}, {async : false}, function (res) {
					for (var i in res) {
						obj.define(i, res[i].title, res[i].template, res[i].templateSource, function () {
							
						});
					}

					obj.defineListClo();
				});
			}


		},
		post	: function () {
            var json = _private.buildFilterJson();
            if (C.isEmpty(json)) {
            	obj.success({});
            	return;
            }
            $(document).find('input[name='+_params.options.target+']').val(JSON.stringify(json));
            C.JQueryAjax(_params.options.url, json, {'type' : 'post'}, function (res) {
            	obj.success(res);
            	_params.response = res;
            });
		},
		getResponse : function () {
			return _params.response;
		}
	};

	return obj;

} ($, COMMON, TEMPLATE);