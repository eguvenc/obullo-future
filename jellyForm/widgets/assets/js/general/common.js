/*
 * 
 * @package		CORE Objects {COMMON, QUEUE, LINKS_STATICS, CUSTOM_EVENTS, LANG, REFRESH_INTERVAL, ACCOUNTING}
 * @copyright 	2014 PARADOKS 	<http://www.obullo.com/>, PBetting <http://www.pbetting.com/>.
 * @author 		Rabih Abou Zaid <rabihsyw@gmail.com>
 * @dependency	Jquery
 * @uses 		HISTORY, POPUP
 *
 */

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* *********************************************************************** Custom Events ********************************************************************** */
/* ***************************************************************** Declared custom events ******************************************************************* */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var CUSTOM_EVENTS = new function () {
	events = {
		edit_popup					: 'edit-popup',
		login_popup 				: 'login-popup',
		user_idle 				: 'user-idle',
		user_cameback 				: 'user-cameback',
	};

	obj = {
		get : function (name) {
			if (events[name]) {
				return events[name];
			}
			COMMON.logger.error('CUSTOM_EVENTS : event name = \''+name+'\' is undefined ');
			return false;
		}
	};

	return obj;
} ();

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* *************************************************************************** LANG *************************************************************************** */
/* ****************************************************** LANG object used to get translations & config ******************************************************* */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var LANG = new function(){

	var obj    = {}; /* lang-json-data */
	var loaded = {}; /* to check if the lang-json-file has been loaded before. */

	var _private = { /* private functions */
		jsonGet : function (url_or_json, data, options, aline) {

			if (/string/i.test(typeof url_or_json)) {
				if (! loaded.hasOwnProperty(url_or_json)) {
					var storage = COMMON.localStorage.get(url_or_json);

					if (! storage) 
						storage = COMMON.sessionStorage.get(url_or_json);

					if (! storage) {
						try {
							var storage = COMMON.include.json(url_or_json, data, options);
						} catch (e) {
							COMMON.logger.warn('not found');
						}
					}

					loaded[url_or_json] = 1;
					this.processAppend(storage, aline);
				}
			} else {
				this.processAppend(url_or_json, aline);
			}
		},
		processAppend : function (json, aline) {
			var appends = {};
			for (var key in json) {
				if(key != 'append') { /* to prevent changeing the only public method in this object 'append'*/
					var val = json[key];
					appends[key] = val;
				}
			}
			if (aline) {
				obj[aline] = appends;
			} else {
				for (var i in appends) {
					obj[i] = appends[i];
				}
			}
		},
		setStorage    : function (url, storageType, res) {
			if (/string/i.test(typeof storageType) && /object/i.test(typeof res)) {
				switch (storageType) {
					case 'localStorage' : {
						COMMON.localStorage.set(url, res);
						break;
					}
					case 'sessionStorage' : {
						COMMON.sessionStorage.set(url, res);
						break;
					}
				}
			}
		}
	};

	obj.append = function(url_or_json, data, options, storageType, aline) { /* public functions */
		options = (/object/i.test(options)) ? options : {};
		options.closure = function (res) {

			if (/string/i.test(typeof url_or_json)) {
				_private.setStorage(url_or_json, storageType, res);
			}
		};
		_private.jsonGet(url_or_json, data, options, aline);
	};

	obj.init  = function () {
		loaded = {};
	};

	return obj;
};

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* ************************************************************************** JIManager ************************************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var JIManager = function () {
	var _params  = {
		inputs : {}
	};
	var _private = {
		after : function (inputName) {
			var input = this.getInput(inputName);
			if (_params.inputs[inputName].textarea && CKEDITOR != 'undefined') {
				input.$new.css({'height' : 'auto', 'position' : 'initial'});
				input.$rows.find('.JIM-selectTitle').css({'display' : 'block', 'line-height' : 'normal', 'padding-top' : '10px'});
				input.$nVal.ckeditor({
				    toolbarGroups: [
				        { name: 'document',    groups: [ 'mode', 'document' ] },            // Displays document group with its two subgroups.
				        { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },           // Group's name will be used to create voice label.
				        '/',                                                                // Line break - next group will be placed in new line.
				        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
				        { name: 'links' }
				    ]
				});
				CKEDITOR.instances[inputName+'-textarea'].on('change', function() {
					// console.info(input.$nVal.val());
					// input.$nVal.val(this.getData());
					// console.info(this.getData());
				});
			}
		},
		getValueInputElement : function (inputName) {
			var input = this.getInput(inputName);
			if (_params.inputs[inputName].textarea) {
				var $nVal = $('<textarea name="'+inputName+'-textarea" placeholder="Value..."></textarea>').addClass('JIM-nTextarea');
			} else {
				var $nVal = $('<input type=text placeholder="Value...">').addClass('JIM-nVal');
			}
			return $nVal;
		},
		buildVars   : function (args) {

			var inputName                         = args.inputName;
			var cageStyle                         = (args.cageStyle && COMMON.inArray([1,2], args.cageStyle)) ? args.cageStyle : 2;
			var isLangInput                       = (args.isLangInput) ? args.isLangInput : false;
			var textarea                          = (args.textarea) ? true : false;
			
			_params.inputs[inputName]             = {};
			_params.inputs[inputName].name        = inputName;
			_params.inputs[inputName].afterChange = typeof afterChange == 'function' ? afterChange : function () {};
			_params.inputs[inputName].cageStyle   = cageStyle;
			_params.inputs[inputName].textarea    = textarea;
			_params.inputs[inputName].isLangInput = isLangInput;
			_params.inputs[inputName].$obj        = $('input[name='+inputName+']');
			
			var valueTemp                         = COMMON.parseJson(_params.inputs[inputName].$obj.val());
			_params.inputs[inputName].value       = (COMMON.isJson(valueTemp)) ? valueTemp : {};
			
			_params.inputs[inputName].$cage       = $('<div></div>').addClass('JIM-cage').addClass('JIM-cageStyle-'+cageStyle).attr('ref', inputName);
			_params.inputs[inputName].$rows       = $('<div></div>').addClass('JIM-rows').appendTo(_params.inputs[inputName].$cage);
			
			_params.inputs[inputName].$new        = $('<div></div>').addClass('JIM-new').appendTo(_params.inputs[inputName].$cage);

		},
		setInputs		: function (inputName, $keyInput, $valInput) {

			var input = this.getInput(inputName);
			input.$nKey = $keyInput;
			input.$nVal = $valInput;
		},

		buildArrayCage 	: function (inputName) {
			var input = this.getInput(inputName);

			_params.inputs[inputName].value = (COMMON.isEmpty(_params.inputs[inputName].value)) ? [] : _params.inputs[inputName].value;

			var $nKey = $('<input type=text></input>').addClass('JIM-nKey').addClass('JIM-aKey');
			var $nVal = this.getValueInputElement(inputName);

			this.setInputs(inputName, $nKey, $nVal);
			
			// var $nVal = $('<input type=text placeholder="Value...">').addClass('JIM-nVal');

			input.$new.append($nKey);
			input.$new.append($nVal);

			if (input.cageStyle == 1) {
				input.$rows.off('click', '.JIM-key').on('click', '.JIM-key', function () {

					input.$new.find('.JIM-nKey').html($(this).html().trim());
					input.$new.find('.JIM-nVal').val(input.value[$(this).html().trim()]);

					_params.inputs[inputName].afterChange(inputName, $(this).html().trim());
				});
			}

			$('<input type=button value=+>').addClass('JIM-nSave').appendTo(input.$new).off('click').on('click', function(e){
				e.preventDefault();
				var newK = input.$nKey.val();
				var newV = input.$nVal.val();
				obj.arrayAddNew(inputName, newK, newV);
			});

			$nVal.off('focusout input').on('focusout input', function (e) {
				// console.warn(e.relatedTarget);
				var newK = input.$nKey.val();
				var newV = input.$nVal.val();
				obj.arrayAddNew(inputName, newK, newV);
				// _private.alterInputValue(inputName, newK, newV);
			});
		},
		buildJsonCage  : function (inputName) {

			var input = this.getInput(inputName);

			var $nKey = $('<input type=text placeholder="Key...">').addClass('JIM-nKey');
			// var $nVal = $('<input type=text placeholder="Value...">').addClass('JIM-nVal');
			var $nVal = this.getValueInputElement(inputName);

			this.setInputs(inputName, $nKey, $nVal);

			input.$new.append($nKey);
			input.$new.append($nVal);

			if (input.cageStyle == 2) {
				var $select = $('<select></select>').addClass('form-control');
				var $selectLabel = $('<div></div>').addClass('JIM-selectTitle').html('Current Value');

				$select.off('change input').on('change input', function () {
					input.$nKey.val($(this).val());

					$selectLabel.html(input.value[$(this).val()]);
					input.$nVal.val(input.value[$(this).val()]);

					input.afterChange(inputName, $(this).val());
				});
				input.$rows.append($('<div></div>').addClass('JIM-selectContainer').html($select));
				input.$rows.append($selectLabel);
				input.$rows.append('<br clear=all />');

			} else if (input.cageStyle == 1) {
				input.$rows.off('click', '.JIM-key').on('click', '.JIM-key', function () {
					input.$nKey.val($(this).html().trim());

					input.$nVal.val(input.value[$(this).html().trim()]);

					input.afterChange(inputName, $(this).html().trim());
				});
			}

			
			$('<input type=button value=+>').addClass('JIM-nSave').appendTo(input.$new).off('click').on('click', function(e){
				e.preventDefault();
				var newK = input.$nKey.val();
				var newV = input.$nVal.val();
				obj.addNew(inputName, newK, newV);
			});

			$nVal.off('focusout').on('focusout', function (e) {
				// console.warn(e.relatedTarget);
				var newK = input.$nKey.val();
				var newV = input.$nVal.val();
				obj.addNew(inputName, newK, newV);
				// _private.alterInputValue(inputName, newK, newV);
			});
		},
		getInput    : function (inputName) {
			return _params.inputs[inputName];
		},
		buildCagePairs : function (key, val) {
			var $nwR = $('<div></div>').addClass('JIM-row');

			var $nwK = $('<div></div>').addClass('JIM-key').html(key).appendTo($nwR);
			var $nwV = $('<div></div>').addClass('JIM-val').html(val).appendTo($nwR);

			return $nwR;
		},
		readValue   : function (inputName) {
			var input = this.getInput(inputName);
			input.$rows.html('');

			var jsn = (input.value);
			for (var i in jsn) {
				input.$rows.append(this.buildCagePairs(i, jsn[i]));
			}
		},
		readClassic   : function (inputName, newK) {
			var input = this.getInput(inputName);

			$select = input.$rows.find('select');
			$select.fadeOut('fast', function (){
				
				$(this).html('<option value="">...</option>');
				var jsn = (input.value);
				for (var i in jsn) {
					$(this).append('<option value="'+i+'">'+i+'</option>');
				}

				$(this).fadeIn('slow');

				$(this).val(newK).trigger('change');
			});
		},
		arrestInput : function (inputName) {
			var input = this.getInput(inputName);
			
			input.$obj.attr('type', 'hidden');
			this.readValue(inputName);

			input.$obj.after(input.$cage);
			this.after(inputName);
		},
		alterInputValue : function (inputName, newK, newV) {
			var input = _private.getInput(inputName);

			if (input.isLangInput) {
				console.info(obj.language.isValidKey(newK));
				if (obj.language.isValidKey(newK)) {
					input.value[newK] = newV; /*Adding new item*/
					input.$obj.val(JSON.stringify(input.value));
				}
			} else {
				input.value[newK] = newV; /*Adding new item*/
				input.$obj.val(JSON.stringify(input.value));
			}
		
		},
		alterArrayValue : function (inputName, newK, newV) {
			var input = _private.getInput(inputName);

			if (! newK && newV)
				input.value.push(newV);
			else if (newK && ! input.value[newK]) {
				input.value[newK] = newV;
			}

			input.$obj.val(JSON.stringify(input.value));
			// this.after(inputName);
		},
		arrestInputClassic : function (inputName) {
			var input = this.getInput(inputName);
			
			input.$obj.attr('type', 'hidden');
			this.readClassic(inputName);
			
			input.$obj.after(input.$cage);
			this.after(inputName);
		}
	};
	var obj      = {
		/**
		 * Not working now
		 * Must complete fixing it if needed.
		 */
		triggerChange : function (current, target, value) {
			
			var currentI = _private.getInput(current);
			var targetI  = _private.getInput(target);

			console.info(arguments);

			if (targetI.cageStyle == 2) {
				targetI.$rows.find('select').trigger('change', value)
			}
		},
		manage : function (inputName) {
			_private.buildVars({
				inputName : inputName,
				cageStyle : 1
			});
			_private.buildJsonCage(inputName);
			_private.arrestInput(inputName);
		},
		manageClassic : function (inputName) {
			_private.buildVars({
				inputName : inputName,
				cageStyle : 2
			});
			_private.buildJsonCage(inputName);
			_private.arrestInputClassic(inputName);
		},
		language : function () {
			_l_params = {};
			_l_private = {};

			
			return {
				isValidKey : function (key) {
					if (COMMON.inArray(COMMON.getKeys(_l_params.langs), key)) {
						return true;
					}
					return false;
				},
				lock : function (inputName, cageStyle, textarea, afterClosure) {
					_l_params.langs = LANG.CONFIG.LANGUAGES;
					_private.buildVars({
						inputName 	: inputName,
						cageStyle 	: ((cageStyle && COMMON.inArray([1,2], cageStyle)) ? cageStyle : 2),
						isLangInput : true,
						textarea 	: (textarea) ? true : false,
						afterChange : typeof afterClosure == 'function' ? afterClosure : function () {},
					});
					_private.buildJsonCage(inputName);
					var input = _private.getInput(inputName);
					input.$new.find('.JIM-nKey').prop('disabled', true);
					for (var lng in _l_params.langs) {
						var currentKeys = COMMON.getKeys(input.value);
						if (!COMMON.inArray(currentKeys, lng)) {
							input.value[lng] = '';
						}
					}
					
					if (input.cageStyle == 2) 
						_private.arrestInputClassic(inputName);
					else
						_private.arrestInput(inputName);
					/*
					if (typeof afterClosure == 'function') {
						obj[inputName+'afterClosure'] = afterClosure;
						obj[inputName+'afterClosure']();
					}*/
				}
			};
		} (),
		array  : function () {
			return {
				lock : function (inputName, cageStyle) {

					_private.buildVars({
						inputName : inputName,
						cageStyle : ((cageStyle && COMMON.inArray([1,2], cageStyle)) ? cageStyle : 2),
						isLangInput : true
					});
					
					_private.buildArrayCage(inputName);

					var input = _private.getInput(inputName);
					input.$new.find('.JIM-nKey').prop('disabled', true);

					_private.arrestInput(inputName);
				}
			};
		} (),
		addNew : function (inputName, newK, newV) {
			var input = _private.getInput(inputName);
			if (newK.toString().trim() != '' && newV.toString().trim() != '') {

				_private.alterInputValue(inputName, newK, newV);
				if (input.cageStyle == 1) {
					_private.readValue(inputName);
				} else if (input.cageStyle == 2) {
					_private.readClassic(inputName,newK);
				}
			}
		},
		arrayAddNew : function (inputName, newK, newV) {
			var input = _private.getInput(inputName);

			if (newK.toString().trim() == '' && newV.toString().trim() == '')
				return;

			if (COMMON.inArray(input.value, newV)) 
				return;

			_private.alterArrayValue(inputName, newK, newV);
			if (input.cageStyle == 1) {
				_private.readValue(inputName);
			} else if (input.cageStyle == 2) {
				_private.readClassic(inputName,newK);
			}
		},
		setValueProvider : function (inputName, jsonData) {
			if (! COMMON.isEmpty(jsonData)) {
				var input = _private.getInput(inputName);
				input.$new.find('.JIM-nKey,.JIM-nVal').hide();
				var $select = $('<select></select>').addClass('JIM-providerSelect').append($('<option value=\'\'></option>'));
				for (var i in jsonData) {
					$select.append($('<option></option>').val(i).html(jsonData[i]));
				}
				input.$new.prepend($select);
				$select.on('change', function () {
					// $('.JIM-nKey').val($(this).val());
					$('.JIM-nVal').val($('option:selected', this).html());
				});
			}
		}
	};
	return obj;
} ();

var JELLY_POPUP = function () {
	var _params  = {
		currentLink : '',
		links : {},
		gridDefaults : {
			"processing": true,
			"searching": false,
			"serverSide": true,
		}
	};

	var _private = {
		initLink	  : function (name, args) {
			args.popup = (args.popup) ? args.popup : 'jellyEdit';
			_params.links[name] = args;
		},
		initClick     : function (name) {
			_params.currentLink = name;
		},
		mixArguements : function (params, newParams) {
			var mainParams = COMMON.isJson(params) ? params : {};
			var newParams = COMMON.isJson(newParams) ? newParams : {};
			return $.extend({}, mainParams, newParams);
		},
		openPOPUP : function (params) {
			var args = _params['links'][_params.currentLink];

			try {

				POPUP.injectValue('close', (args.close) ? args.close : '');
				POPUP.injectValue('open', (args.open) ? args.open : '');
				POPUP.injectValue('title', (args.title) ? args.title : 'Form Popup');
				POPUP.injectValue('content', params.content);
				POPUP.injectValue('cancel', (args.cancel) ? args.cancel : 'Cancel');
				
				if (typeof args.before == 'function') {
					obj.before = args.before;
					obj.before(_private.mixArguements(args.params, params), params, args);
				}
				
				POPUP.modal(args.popup, true);

				if (typeof args.after == 'function') {
					obj.after = args.after;
					obj.after(_private.mixArguements(args.params, params), params, args);
				}
			} catch (e) {
				COMMON.logger.error(e);
			}
		},
		open : function (params) {
			var args = _params['links'][_params.currentLink];
			try {
				COMMON.JQueryAjax(
					args.url,
					_private.mixArguements(args.params, params),
					(args.options) ? args.options : {type:"get"},
					function(response){
					if (response.success) {
						if (response.data) {
							POPUP.injectValue('content', response.data);
						}

						if (response.submit) {
							POPUP.injectValue('submit', response.submit);
						}
						
						POPUP.injectValue('title', (args.title) ? args.title : 'Form Popup');
						POPUP.injectValue('cancel', (args.cancel) ? args.cancel : 'Cancel');
						
						if (args.formId) {
							POPUP.injectValue('formID', args.formId);
						}
						
						POPUP.injectValue('close', (response.close) ? response.close : '');
						POPUP.injectValue('open', (response.open) ? response.open : '');

						if (typeof args.before == 'function') {
							obj.before = args.before;
							obj.before(response, params, args)
						}

						POPUP.modal(args.popup, true);

						if (typeof args.after == 'function') {
							obj.after = args.after;
							obj.after(response, params, args);
						}

					} else {
						POPUP.injectValue('title', (args.title) ? args.title : 'Form Popup');
						POPUP.injectValue('cancel', (args.cancel) ? args.cancel : 'Cancel');
						POPUP.injectValue('content',response.message);
						POPUP.modal(args.popup, true);
					}
				});
			} catch (e) {
				COMMON.logger.error(e);
			}
		}
	};

	var obj      = {
		injectValue : function (name, value) {
			POPUP.injectValue(name, value);
		},
		setButton : function (btnLabel, callback) {

			POPUP.setButton(_params['links'][_params.currentLink].popup, btnLabel, callback);			
		},
		close : function () {
			console.info(arguments);
			POPUP.close(_params['links'][_params.currentLink].popup);
		},
		grid 	: function (grid, options, tableId) {
			var newOptions = _params.gridDefaults;
			if (COMMON.isJson(options)) {
				for (var i in options) {
					newOptions[i] = options[i];
				}
			}

			if (!newOptions['data']) {
				newOptions['data'] = grid.data;
			}

			if (!newOptions['columns']) {
				newOptions['columns'] = grid.gridComponents.js_columns;
			}
			// var rnd = Math.floor((Math.random()*10)+1);

			if (odt) {
				odt.fnClearTable( 0 );
				odt.fnDraw();
			}
			var odt = $('#'+(tableId || 'grid1')).dataTable(newOptions);
			// odt.fnAddData(grid.data);
			odt.fnDraw();

			return odt;
		},
		setLink : function (name, args) {
			_private.initLink(name, args);
			$(document).off('click', "[data-link='"+name+"']").on('click', "[data-link='"+name+"']", function (e) {
				_private.initClick(name);
 				_private.open($(this).data('link-params'));
			});
		},
		setPOPUP : function (name, args) {
			_private.initLink(name, args);
			$(document).off('click', "[data-link='"+name+"']").on('click', "[data-link='"+name+"']", function (e) {
				_private.initClick(name);
 				_private.openPOPUP($(this).data('link-params'));
			});
		}
	};

	return obj;
} ();


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* ************************************************************************** COMMON ************************************************************************** */
/* *********************************************************************** Core object ************************************************************************ */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var COMMON = new function () {
	_com_params  = {
		deepParseLevelts : 0
	};
	
	_com_private = {};
	
	com_obj      = {
		set    : function (objectName, object) {
			if (this[objectName]) 
				COMMON.logger.error ("COMMON.set : " + objectName + " is already defined.");
			else
				this[objectName] = object;
		},
		JQueryAjax : function (url, data, options, afterClosure ) {
			COMMON.logger.log('COMMON : JQueryAjax : ' + url + ', data : ', data, ', options : ', options);
			
			var func_res = false;

			var queryOptions = {
				type: (!COMMON.isEmpty(options) && options.type) ? options.type : 'GET',
				url: url,
				// timeout: 5000,
				beforeSend  : (!COMMON.isEmpty(options) && options.beforeSend) ? options.beforeSend : null,
				data: (COMMON.isEmpty(data)) ? {} : data,
				crossDomain : (options && options.crossDomain) ? options.crossDomain : false,
			};

			$.ajax(queryOptions).done(function(res,status,xhr) {
				func_res = res = com_obj.deepJsonParser(res);
				
				if (typeof afterClosure == 'function') 
					afterClosure(res);
				if (typeof options.closure == 'function') 
		            options.closure(res);

				// COMMON.always(res);
			}).fail(function(xhr, status, errorThrown) {
				if (typeof afterClosure == 'function') {
					var d = {};
					
					COMMON.logger.warn('COMMON.JQueryAjax : request problem, url : ', url);
					afterClosure(d);
				}
			});
			return func_res;
		},
		refreshContent   : function (args) {
			var targetEl = '';
			if (args.target && typeof args.target == 'object' && args.target.length > 0) {
				targetEl = $(args.target);
			} else if (args.targetId && typeof args.targetId == 'string' && args.targetId.length > 0) {
				targetEl = $('#'+args.targetId);
			}

			if (targetEl.length > 0 && args.url.length > 0) {
				
				targetEl.css({position : 'relative'});
				targetEl.append($(document.createElement('div')).addClass('loading-cover').css('display', 'block'));

				var res = COMMON.ajax(args.url, (args.data) ? args.data : {}, (args.options) ? args.options : {}, function (res) {
					targetEl.find('.loading-cover').fadeOut().remove();
				});

				targetEl.html(res);
			}
		},
		appendContent    : function (args) {
			var targetEl = '';
			if (args.target && typeof args.target == 'object' && args.target.length > 0) {
				targetEl = $(args.target);
			} else if (args.targetId && typeof args.targetId == 'string' && args.targetId.length > 0) {
				targetEl = $('#'+args.targetId);
			}

			if (targetEl.length > 0 && args.url.length > 0) {
				
				targetEl.css({position : 'relative'});
				targetEl.append($(document.createElement('div')).addClass('loading-cover').css('display', 'block'));

				var res = COMMON.ajax(args.url, (args.data) ? args.data : {}, (args.options) ? args.options : {}, function (res) {
					targetEl.find('.loading-cover').fadeOut().remove();
				});

				targetEl.append(res);
			}
		},
		inArray   : function (arr, searchfor) {
			for (var i in arr) {
				if (arr[i] == searchfor) {
					return true;
				}
			}
			return false;
		},
		deleteKey : function (arr, key) {
			if (arr[key]) {
				try {
					arr.splice(key, 1);
				} catch (e) {
					if (arr[key]) {
						delete arr[key];
					}
				}
			}
		},
		parseJson : function (jsonData) {
			try {
				jsonData = $.parseJSON(jsonData);
			} catch (e) {

			}
			return jsonData;
		},
		deepJsonParser : function (jsonData, deepParseLevels) {
			jsonData = this.parseJson(jsonData);

			if (typeof jsonData == 'object') {

				for (var i in jsonData) {
					var x = COMMON.parseJson(jsonData[i]);

					if (COMMON.isJson(x)) {
						jsonData[i] = x;
						this.deepJsonParser(jsonData[i]);
					}
				}
			}
			return jsonData;
		},
		always    : function (response) {
			try {

				if (/object/i.test(typeof response)) {

					if ( response.next_step && COMMON.inArray(['login_popup','verify_code_popup'], response.next_step) ) {
						if (COMMON.cookie.get('auth') == 1) {
							try {
								$(document).trigger(CUSTOM_EVENTS.get('logout'));
							} catch (e_refresh_header) {
								COMMON.logger.error(e_refresh_header);
							}
						}
						$(document).trigger(CUSTOM_EVENTS.get('login_popup'), response);
					}
					if (response.popup_message) {
						try {

							POPUP.injectValue('popup_message', response.popup_message);
                            POPUP.injectValue('popup_title', 'Message');
                            POPUP.modal('message', true);

						} catch (e_popup) {
							COMMON.logger.error(e_popup);
						}
					}
					if (response.refresh_redirect) {
						setTimeout(function(){
                            if (response.refresh_redirect){
                                window.location.href = response.refresh_redirect;
                            } else {
                                window.location.href = '/';
                            }
                        }, 4500);
					}
					if (response.redirect && typeof response.redirect == 'string') {
						window.location = response.redirect;
					}
				}

			} catch (e) {
				COMMON.logger.error(e);
			}
		},
		isEmpty   : function (obj) {
			return $.isEmptyObject(obj);
		},
		isJson 	  : function (data) {
			var isJson = false;
		    try {
		       var json = $.parseJSON(data);
		       isJson = (typeof json == 'object' && json != null) ? true : false;
		    } catch (ex) {
		        isJson = (typeof data === 'object') ? true : false ;
		    }
		    return isJson;
		},
		getKeys   : function (data) {
			if (Object.keys) {
				return Object.keys(data);
			}
			var keys = [];
			for (var i in data) {
				keys.push(i);
			}
			return keys;
		},
		getValues   : function (data) {
			var res = [];
			for (var i in data) {
				res.push(data[i]);
			}
			return res;
		},
		clone 	  : function (oldObject) {
			/* return this.deepJsonParser(JSON.stringify(oldObject));*/
			return $.extend(true, {}, oldObject);
		},
		count     : function (_obj) {
			var count = 0;
			for (var i in _obj) {
				count++;
			}
			return count;
		},
		userLang : function (locale_lang) {
			try {
				locale_lang = (COMMON.cookie.get('locale'));
			} catch (e) {
				COMMON.logger.error(e);
			}

			if (locale_lang && locale_lang != 'undefined' && locale_lang.length == 2) {
				return locale_lang;
			}
			return 'en';
		},
		userTimeZone : function () {
			var x = COMMON.cookie.get('time_zone');
			return (x) ? x : new Date().getTimezoneOffset(); /* if time_zone hasn't been set, set user's time_zone */
		},
		isIE 	  : function () {
			var myNav = navigator.userAgent.toLowerCase();
  			return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
		},
		new 	: function (tag, _class, attr, _html) {
			attr  = typeof attr == 'object' ? attr : {};
			_html = _html || '';
			return $(document.createElement(tag)).addClass(_class).attr(attr).html(_html);
		},
		init      : function () {

			if (!(/login/i.test(window.location.pathname))) {
				LANG.append('/config/');
			}

			window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {

				COMMON.logger.error(errorMsg, url, lineNumber);
				return false;
			}

			$( document ).ajaxComplete(function(e, xh) {
				
				COMMON.always(xh.responseJSON);
			});
			$(document).ready(function(){

			});
		}
	};

	return com_obj;
}();

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* *********************************************************************** COMMON.logger ********************************************************************** */
/* ***************************************************** logger object, used to handle all 'console' logs ***************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

COMMON.set('logger', function () {
	var _private = {
		/* 1 for development mode, 2 for*/
		debug_mode : true
	};

	var obj 	 = {
		log 	: function () {
			if (_private.debug_mode) {
				// if (typeof console != 'undefined') 
				// 	console.log.apply(console, arguments);
			}
		},
		info 	: function () {
			if (_private.debug_mode) {
				// if (typeof console != 'undefined') 
				// 	console.info.apply(console, arguments);
			}
		},
		warn 	: function () {
			if (_private.debug_mode) {
				// if (typeof console != 'undefined') 
				// 	console.warn.apply(console, arguments);
			}
		},
		error 	: function () {
			if (_private.debug_mode) {
				if (typeof console != 'undefined') 
					console.error.apply(console, arguments);
			}
		}
	};

	return obj;
}());

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* ************************************************************************* COMMON.uri *********************************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

COMMON.set('uri', function () {
	var _uri_params  = {
		/*set default values, in-case of ajax request failure has happened*/
		main_domain			: '.pbetting.com',
		site_url 			: 'http://bet-admin/',
		static_url 			: 'http://bet-admin/',
	};
	
	var _uri_private = {
	};

	var uri_obj      = {
		mainDomain : function () {
			return _uri_params.main_domain;
		},
		siteUrl : function() {
			return _uri_params.site_url;
		},
		staticUrl : function () {
			return _uri_params.static_url;
		},
		init : function () {
			try {
				_uri_params.main_domain          = (LANG.URL.MAIN_DOMAIN) ? LANG.URL.MAIN_DOMAIN : _uri_params.main_domain;
				_uri_params.site_url            = (LANG.URL && LANG.URL.DOMAIN) ? LANG.URL.DOMAIN : _uri_params.site_url;
				_uri_params.static_url          = (LANG.URL && LANG.URL.STATIC) ? LANG.URL.STATIC : _uri_params.static_url;
			} catch (e) {
				console.error(e);
			}
		}
	};

	return uri_obj;
}());

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* *********************************************************************** COMMON.cookie ********************************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

COMMON.set('cookie', function () {
	var _cookie_params  = {
		args 	: {},
		cookie  : '',
		exdays  : 2
	};
	var _cookie_private = {
		breakCookie : function () {
			var ca = document.cookie.split(';');
			if (ca.length > 0) {
				var d = new Date();
				d.setTime(d.getTime()+(_cookie_params.exdays*24*60*60*1000));

				for(var i in ca){
					var c = ca[i].trim().split('=');
					if (c[0] && c[1]) {
						try {
							var colName = c[0].trim();
							var newE = {};

							newE.value = c[1].trim();
							newE.expires = d.toGMTString();
							newE.domain = escape(COMMON.uri.mainDomain());
							newE.path = '/';

							_cookie_params.args[colName] = newE;

						} catch (e) {
							COMMON.logger.error(e);
						}
					}
				}
			}
		},
		argsToCookie : function (name, arg) {
			var str = '';

			str = name + '=' + arg.value + ';' + 'expires=' + arg.expires + ';' + 'path=' + arg.path;

			return str;
		}
	};
	var cookie_obj      = {
		set : function(cName,cValue, expires, path){
			try {
				if (! _cookie_params.args[cName]) {
					_cookie_params.args[cName] = {};
				}
				
				var d = new Date();
				d.setTime(d.getTime()+(_cookie_params.exdays*24*60*60*1000));
				
				_cookie_params.args[cName].value = cValue;
				_cookie_params.args[cName].path = (path) ? path : '/';
				_cookie_params.args[cName].expires = (expires) ? expires : d.toGMTString();
			} catch (e) {
				COMMON.logger.error(e);
			}
		},
		get : function(cName){
			return (_cookie_params.args[cName]) ? _cookie_params.args[cName].value : false;
		},
		commit : function () {
			for (var i in _cookie_params.args) {
				var _cookie = '';
				_cookie = _cookie_private.argsToCookie(i, _cookie_params.args[i]);
				
				COMMON.logger.warn('COOKIE : Committing cookies has been disabled.');
				// document.cookie = _cookie;
			}
		},
		init   : function () {
			_cookie_private.breakCookie();
		}
	};
	return cookie_obj;
}());

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* ******************************************************************** COMMON.localStorage ******************************************************************* */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

COMMON.set('localStorage' , {
	set : function(itemName,itemValue, expirationMin){
		var expirationMS = ((expirationMin) ? expirationMin : 24) * 60 * 1000;

		if (! COMMON.isJson(itemValue)){
			try {
				itemValue = $.parseJSON(itemValue);
			} catch (e) {
				COMMON.logger.error('Wrong string format, couldn\'t be parsed as JSON.');
				COMMON.logger.error(e);
				return;
			}
		}
		if (! COMMON.isEmpty(itemValue)) {
			itemValue['timestamp'] = new Date().getTime() + expirationMS;
			localStorage.setItem(itemName, JSON.stringify(itemValue));
		}
	},
	
	get : function(itemName){
		itemValue = localStorage.getItem(itemName);
		try {
			itemValue = $.parseJSON(itemValue);
			if (COMMON.isJson(itemValue)) {
				var dt = new Date();

				if (itemValue.timestamp && dt.getTime() < itemValue.timestamp) {
					return itemValue;
				}
			}
		} catch(e) {
			return false;
		}

		return false;
	},
	erase : function(itemName) {
		localStorage.removeItem(itemName);
	},
});

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* ******************************************************************** COMMON.sessionStorage ***************************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

COMMON.set('sessionStorage' , {
	set : function(itemName,itemValue, expirationMin){
		var expirationMS = ((expirationMin) ? expirationMin : 24) * 60 * 1000;

		if (! COMMON.isJson(itemValue)){
			try {
				itemValue = $.parseJSON(itemValue);
			} catch (e) {
				COMMON.logger.error('Wrong string format, couldn\'t be parsed as JSON.');
				COMMON.logger.error(e);
				return;
			}
		}
		if (! COMMON.isEmpty(itemValue)) {
			itemValue['timestamp'] = new Date().getTime() + expirationMS;
			sessionStorage.setItem(itemName, JSON.stringify(itemValue));
		}

	},
	
	get : function(itemName){
		itemValue = sessionStorage.getItem(itemName);
		try {
			itemValue = $.parseJSON(itemValue);
			if (COMMON.isJson(itemValue)) {
				var dt = new Date();

				if (itemValue.timestamp && dt.getTime() < itemValue.timestamp) {
					return itemValue;
				}
			}
		} catch(e) {
			return false;
		}

		return false;
	},
	erase : function(itemName) {
		sessionStorage.removeItem(itemName);
	},
});

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* ************************************************************************* COMMON.ajax ********************************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

COMMON.set('ajax', function (url, data, options, afterClosure) {
	var _ajax_params = {
		url      : url,
		type  	 : (options && options.hasOwnProperty('type') && /(get|post){1}/i.test(options.type)) ? options.type : 'GET',
		async 	 : (options && options.async && typeof options.async == 'boolean') ? options.async : false,
		response : false,
	};

	var _private = {
		data : function (data, type) {
			var args = '';
			if (/get/i.test(type)) {
				
				if (typeof options == 'object' && options.cached) {
					args = '?_=null';
				} else {
					args = '?_='+Math.floor(Math.random() * 100000 + 1);
				}

				for (key in data) {
					args += '&'+key+'='+data[key];
				}
			} else {
				args = new FormData();
				for (key in data) {
					args.append(key, data[key]);
				}
			}
			return args;
		}(data, _ajax_params.type),
	};

	var obj = {
		initRequest : function () {
		    if (window.XMLHttpRequest) {
		        _ajax_params.xmlhttp = new XMLHttpRequest(); /* code for IE7+, Firefox, Chrome, Opera, Safari */
		    } else {
		        	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); /* code for IE6, IE5 */
		    }
		}(),
		send     : function () {
			
			_ajax_params.xmlhttp.onreadystatechange = function(){

		        if (_ajax_params.xmlhttp.readyState==4 && _ajax_params.xmlhttp.status==200) {
		            _ajax_params.response = _ajax_params.xmlhttp.responseText;
		            // _ajax_params.response = COMMON.parseJson(_ajax_params.response);
		            
		            _ajax_params.response = com_obj.deepJsonParser(_ajax_params.response);

		            if (typeof afterClosure == 'function') {
		            	afterClosure(_ajax_params.response);
		            }
		            if (typeof options.closure == 'function') {
		            	options.closure(_ajax_params.response);
		            }
		            COMMON.always(_ajax_params.response);
		        } else if (_ajax_params.xmlhttp.status==404){
		        	throw 'error not found';
		        }
		    };

			if (/get/i.test(_ajax_params.type)) {

				_ajax_params.xmlhttp.open(_ajax_params.type,_ajax_params.url + _private.data,_ajax_params.async);
				if (! options.crossDomain)
			    	_ajax_params.xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				
				/*_ajax_params.xmlhttp = 5000;*/

			    _ajax_params.xmlhttp.send();

			} else {

				_ajax_params.xmlhttp.open(_ajax_params.type,_ajax_params.url,_ajax_params.async);

				if (! options.crossDomain)
			    	_ajax_params.xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

			    _ajax_params.xmlhttp.send(_private.data);
			}
		}(),
	};

	obj.initRequest;
	try {
    	obj.send;
	} catch (s) {
		COMMON.logger.warn('not found');
		COMMON.logger.warn(s);
	}

    return _ajax_params.response;
});

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* *********************************************************************** COMMON.include ********************************************************************* */
/* **************************************************** COMMON.include.json, COMMON.include.js, COMMON.include.css ******************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

COMMON.set('include', {
	json : function(url, data, options) {

		var res = COMMON.ajax(url, data, (options) ? options : {async : false});

		return res;
	},
	
	js : function(url){
		var script = document.createElement('script');
		script.onload = function() {
		  return true;
		};
		script.src = url;
		script.type = "text/javascript";
		script.language = "javascript";
		document.getElementsByTagName('head')[0].appendChild(script);		
	},
	
	css : function(url){
	
	}
});

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* *********************************************************************** COMMON.settings ******************************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

COMMON.set('settings', function () {
	var _settings_params  = {
		regional : {},
		currentDate : '',
		mainTimeZone : ''
	};

	var settings_obj      = {
		getDateTimeNumeric    : function (time) {
			return moment.unix(time).zone(COMMON.userTimeZone()).format('DD/MM HH:mm');
		},
		getTime    : function (time) {
			return moment.unix(time).zone(COMMON.userTimeZone()).format('HH:mm');
		},
		getDateTime 		  : function (time) {
			return moment.unix(time).zone(COMMON.userTimeZone()).format('dddd D MMMM ,YYYY');
		},
		getFullDateTime 		  : function (time) {
			return moment.unix(time).zone(COMMON.userTimeZone()).format('dddd D MMMM ,YYYY , HH:mm');
		},
		getFullDate 		  : function (time) {
			return moment.unix(time).zone(COMMON.userTimeZone()).format('DD.MM.YYYY HH:mm');
		},
		getGmtTimeZone 		  : function () {
			return moment(_settings_params.currentDate).zone(COMMON.userTimeZone()).format('Z');
		},
        webSiteClock 			  : function () {
			REFRESH_INTERVAL.start('website_clock', '', function (){
				var t = moment(new Date());
				$('[data-time="clock"]').html(t.zone(COMMON.userTimeZone()).format('HH:mm:ss') + ' GMT' + t.zone(COMMON.userTimeZone()).format('Z'));
				REFRESH_INTERVAL.idleIncrease();
			} ,1);
		},
		init 				  : function () {
			
			_settings_params.currentDate = new Date();
			_settings_params.mainTimeZone = settings_obj.getGmtTimeZone();
			/* if time_zone wasn't chosen before, set user's timezone as a default value */
			if (! COMMON.cookie.get('time_zone')) {
				COMMON.cookie.set('time_zone', _settings_params.mainTimeZone);
				COMMON.cookie.commit();
			}

			_settings_params.regional.time_zone = COMMON.userTimeZone();
			_settings_params.regional.lang = COMMON.userLang();
            this.webSiteClock();
			
			$(document).ready(function(){

			});
		}
	};

	return settings_obj;
} ());


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* ********************************************************************* JQuery Plugins *********************************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

(function ($) {

	/**
	 * A plugin used to conver a form to json format.
	 * @return Json
	 */
	$.fn.formToJson = function()
	{
	    var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
		    if (o[this.name] !== undefined) {
		        if (!o[this.name].push) {
		            o[this.name] = [o[this.name]];
		        }
		        o[this.name].push(this.value || '');
		    } else {
		        o[this.name] = this.value || '';
		    }
		});
		return o;
	};

	/**
	 * a plugin used to wait a dynamilcally added dom element
	 * @param  {[type]} handler      [description]
	 
	 * @return {[type]}              [description]
	 */
	$.fn.waitUntilExists    = function (handler, executeCount) {
		
		executeCount      = (/^\d+$/.test(executeCount)) ? executeCount : 0;

		var found         = 'found';
		var selector      = this.selector;
		var $this         = $(this.selector);
		var $elements     = $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);
		var maxTries           = 150;

		var stopListener = function () {
			if (window.waitUntilExists_Intervals) {
				if (window.waitUntilExists_Intervals[selector]) {
					window.clearInterval(window.waitUntilExists_Intervals[selector]);
				}
			}
		};

		var resetLinstener = function (fun) {
			stopListener();
			(window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[selector] = window.setInterval(fun, 20);
		};

	    if ($elements.length == 0 && executeCount < maxTries)
	    {
	    	resetLinstener(function (){
	    		$this.waitUntilExists(handler, executeCount + 1);
	    	});
	    }
	    else
	    {
	    	stopListener();
	    }

	    return $this;
	}

}(jQuery));

jQuery.fn.ForceNumericOnly = function(){
        return this.each(function()
        {
            $(this).keydown(function(e) {
                var key = e.charCode || e.keyCode || 0;
                if (e.shiftKey && (key >= 48 && key <= 57)) {
                	return false;
                }
                var values = $(this).val();
                for (var i in values) {
                	var deneme = values[i].charCodeAt(0);
                	if (String.fromCharCode(deneme) === '.' && key == 190) {
                		return false;
                	}
                };
                return (
                    key == 8 ||
                    key == 9 ||
                    key == 46 ||
                    key == 110 || 
                    key == 190 ||
                    (key >= 35 && key <= 40) ||
                    (key >= 48 && key <= 57) ||
                    (key >= 96 && key <= 105));
 
            });
        	$(this).keypress(function(e) {
                var key = e.charCode || e.keyCode || 0;
                var values = $(this).val();
                if (values.length == 0 && key == 46) {
            		$(this).val('0.');
            		return false;
            	};
                return ( 
                	key == 8 ||
                	key == 46 ||
                	(key >= 37 && key <= 40) || 
                	(key >= 48 && key <= 57) ||
                	key == 46
                	); 
                
				
            });
            $(this).keyup(function(e) {
            	var key = e.charCode || e.keyCode || 0;
            	var values = $(this).val();
            	if (values == '.' && key == 190) {
            		$(this).val('0.');
            		return false;
            	};
            });
        });
    };

/*!
 * accounting.js v0.3.2, copyright 2011 Joss Crowcroft, MIT license, http://josscrowcroft.github.com/accounting.js
 */
(function (p, z) {
    function q(a) {
        return !!("" === a || a && a.charCodeAt && a.substr)
    }

    function m(a) {
        return u ? u(a) : "[object Array]" === v.call(a)
    }

    function r(a) {
        return "[object Object]" === v.call(a)
    }

    function s(a, b) {
        var d, a = a || {},
            b = b || {};
        for (d in b) b.hasOwnProperty(d) && null == a[d] && (a[d] = b[d]);
        return a
    }

    function j(a, b, d) {
        var c = [],
            e, h;
        if (!a) return c;
        if (w && a.map === w) return a.map(b, d);
        for (e = 0, h = a.length; e < h; e++) c[e] = b.call(d, a[e], e, a);
        return c
    }

    function n(a, b) {
        a = Math.round(Math.abs(a));
        return isNaN(a) ? b : a
    }

    function x(a) {
        var b = c.settings.currency.format;
        "function" === typeof a && (a = a());
        return q(a) && a.match("%v") ? {
            pos: a,
            neg: a.replace("-", "").replace("%v", "-%v"),
            zero: a
        } : !a || !a.pos || !a.pos.match("%v") ? !q(b) ? b : c.settings.currency.format = {
            pos: b,
            neg: b.replace("%v", "-%v"),
            zero: b
        } : a
    }
    var c = {
            version: "0.3.2",
            settings: {
                currency: {
                    symbol: "$",
                    format: "%s%v",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                    grouping: 3
                },
                number: {
                    precision: 0,
                    grouping: 3,
                    thousand: ",",
                    decimal: "."
                }
            }
        },
        w = Array.prototype.map,
        u = Array.isArray,
        v = Object.prototype.toString,
        o = c.unformat = c.parse = function (a, b) {
            if (m(a)) return j(a, function (a) {
                return o(a, b)
            });
            a = a || 0;
            if ("number" === typeof a) return a;
            var b = b || ".",
                c = RegExp("[^0-9-" + b + "]", ["g"]),
                c = parseFloat(("" + a).replace(/\((.*)\)/, "-$1").replace(c, "").replace(b, "."));
            return !isNaN(c) ? c : 0
        },
        y = c.toFixed = function (a, b) {
            var b = n(b, c.settings.number.precision),
                d = Math.pow(10, b);
            return (Math.round(c.unformat(a) * d) / d).toFixed(b)
        },
        t = c.formatNumber = function (a, b, d, i) {
            if (m(a)) return j(a, function (a) {
                return t(a, b, d, i)
            });
            var a = o(a),
                e = s(r(b) ? b : {
                    precision: b,
                    thousand: d,
                    decimal: i
                }, c.settings.number),
                h = n(e.precision),
                f = 0 > a ? "-" : "",
                g = parseInt(y(Math.abs(a || 0), h), 10) + "",
                l = 3 < g.length ? g.length % 3 : 0;
            return f + (l ? g.substr(0, l) + e.thousand : "") + g.substr(l).replace(/(\d{3})(?=\d)/g, "$1" + e.thousand) + (h ? e.decimal + y(Math.abs(a), h).split(".")[1] : "")
        },
        A = c.formatMoney = function (a, b, d, i, e, h) {
            if (m(a)) return j(a, function (a) {
                return A(a, b, d, i, e, h)
            });
            var a = o(a),
                f = s(r(b) ? b : {
                    symbol: b,
                    precision: d,
                    thousand: i,
                    decimal: e,
                    format: h
                }, c.settings.currency),
                g = x(f.format);
            return (0 < a ? g.pos : 0 > a ? g.neg : g.zero).replace("%s", f.symbol).replace("%v", t(Math.abs(a), n(f.precision), f.thousand, f.decimal))
        };
    c.formatColumn = function (a, b, d, i, e, h) {
        if (!a) return [];
        var f = s(r(b) ? b : {
                symbol: b,
                precision: d,
                thousand: i,
                decimal: e,
                format: h
            }, c.settings.currency),
            g = x(f.format),
            l = g.pos.indexOf("%s") < g.pos.indexOf("%v") ? !0 : !1,
            k = 0,
            a = j(a, function (a) {
                if (m(a)) return c.formatColumn(a, f);
                a = o(a);
                a = (0 < a ? g.pos : 0 > a ? g.neg : g.zero).replace("%s", f.symbol).replace("%v", t(Math.abs(a), n(f.precision), f.thousand, f.decimal));
                if (a.length > k) k = a.length;
                return a
            });
        return j(a, function (a) {
            return q(a) && a.length < k ? l ? a.replace(f.symbol, f.symbol + Array(k - a.length + 1).join(" ")) : Array(k - a.length + 1).join(" ") + a : a
        })
    };
    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) exports = module.exports = c;
        exports.ACCOUNTING = c
    } else "function" === typeof define && define.amd ? define([], function () {
        return c
    }) : (c.noConflict = function (a) {
        return function () {
            p.ACCOUNTING = a;
            c.noConflict = z;
            return c
        }
    }(p.ACCOUNTING), p.ACCOUNTING = c)
})(this);


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* ********************************************************************* REFRESH_INTERVAL ********************************************************************* */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var REFRESH_INTERVAL = (function () {
	var idleSeconds   = 0;
	var counters      = {};
	var backup        = {};
	var paused		  = false;
	
	var counter_max_value = 30;

	var _private = {
		validateIdle : function () {
			return (parseInt(idleSeconds) > 120); /* LANG.CONFIG.IDLE_TIMEOUT */
		},
		pauseAll      : function () {
			for (var i in counters) {
				if (i != 'website_clock') {
					backup[i] = counters[i];
					obj.stop(i);
				}
			}
		},
		resumeAll 	 : function () {
				COMMON.logger.info('Intervals to recover : ' + COMMON.getKeys(backup));
				for (var i in backup) {
					if (i != 'website_clock') {
						var intrvl = backup[i];
						obj.start(i, intrvl.selector, intrvl.func, intrvl.totalSeconds);
						obj.forceRefresh(i, 1);
					}
				}
				backup = {};
		},
		resetIdle 	 : function () {
			idleSeconds = 0;
		}
	};

	var obj = {
		forceRefresh : function (pk, value) {
			if (! value || typeof value != 'number') {
				value = 4;
			}
			if (counters[pk]) {
				counters[pk].counterDown = value;
			} else {
				COMMON.logger.warn('REFRESH_INTERVAL : Trying to refresh non declared timer');
			}
		},
		countDown : function (pk) {
			
			counters[pk].counterDown--;
			
			if ($(counters[pk].selector).length > 0) {
				$(counters[pk].selector).html(counters[pk].counterDown);
			}

			if (counters[pk].counterDown <= 0) {
				counters[pk].func();
				obj.start(pk, counters[pk].selector, counters[pk].func, counters[pk].totalSeconds);
			}
		},
		start : function (pk, selector, func, totalSeconds) {

			if (counters[pk]) {
				obj.stop(pk);
			}

			counters[pk] = {};
			counters[pk].counterDown = (totalSeconds) ? totalSeconds : 60; /*Interval Counter down*/
			counters[pk].totalSeconds = (counters[pk].totalSeconds) ? counters[pk].totalSeconds : counters[pk].counterDown; /*Interval total seconds*/
			counters[pk].func = func;
			counters[pk].selector = selector;
			counters[pk].interval = setInterval(function(){
				obj.countDown(pk);
			}, 1000);

			if (pk != 'website_clock') { /* just for debugging issues */
				COMMON.logger.log("REFRESH_INTERVAL : Caused by : ", pk, " || Current Intervals count : ", COMMON.count(counters), '. Intervals : ', counters);
			}
		},
		stop  : function (pk) {
			if (counters[pk] && counters[pk].interval) {
				clearInterval(counters[pk].interval);
				delete counters[pk];
			}
		},
		idleIncrease : function () {
			
			idleSeconds++;

			if (_private.validateIdle()) {
				_private.pauseAll();
				$(document).trigger(CUSTOM_EVENTS.get('user_idle'), {});
				paused = true;
			} else if (paused) {
				_private.resumeAll();
				$(document).trigger(CUSTOM_EVENTS.get('user_cameback'), {});
				paused = false;
			}
		},
		init		  : function () {
			$(document).ready(function (){
				$(this).on('mousemove keypress', function (){
					_private.resetIdle();
				});
			});
			window.onfocus = function (){
				_private.resetIdle();
			};
		}
	};
	return obj;
}());


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* **************************************************************** Before document ready queue *************************************************************** */
/* ************************************************ The order of the following statements should not be changed *********************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

COMMON.init();
COMMON.uri.init();
COMMON.cookie.init();
moment.lang(COMMON.userLang());
COMMON.settings.init();
LANG.init();
REFRESH_INTERVAL.init();

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/* **************************************************************** On document Ready scripts ***************************************************************** */
/* **************************************************************** Prepare execution of Queue **************************************************************** */
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
var statusCheckClicks = true;
function statusCheckbox (identifier, url, params) {
	if (COMMON.isEmpty(params) || !COMMON.isJson(params) || url.toString().trim() == '') {
		console.warn("statusCheckbox func : wrong missing parameters.");
		return false;
	}

	params.status = (+($(identifier).prop('checked')));

	if (statusCheckClicks) {
		statusCheckClicks = false
		COMMON.ajax(url, params, {}, function (res) {
			$(identifier).prop('disabled', true);
			setTimeout(function () {
				statusCheckClicks = true;
				$(identifier).prop('disabled', false);
			}, 3000);
		});
	} else {
		return false;
	}
}

$(document).ready(function (){
    
});

function templatesPopup (formId, targetName) {
	$(document).off('click', '#'+formId+' [data-link=templatePopup]').on('click', '#'+formId+' [data-link=templatePopup]', function () {
		COMMON.ajax('/ajax/messages/templates_grid', {}, {}, function (res) {
			POPUP.injectValue('submit'		, '');
			POPUP.injectValue('tableId', 'tempTemplates');
			POPUP.injectValue('title'		, 'Message Templates');
			POPUP.injectValue('cancel'		, 'Cancel');
			//POPUP.resetElement('gridFormList');
			POPUP.modal('gridFormList', true);

			var gridData = res.data;
			odt = $('#tempTemplates').dataTable({
				"paging"		:   false,
				"bFilter"		:   false,
				"bSort"			:   false,
			    "data"			: gridData,
			    "columns"		: res.gridComponents.js_columns,
			    "aoColumnDefs"	: [
			          { sWidth: "55%", aTargets: [2] }
			    ]
			});

			$('a[data-link=pickupTemplate]').off('click').on('click', function () {
                var vl = $(this).parents('tr').find('td:eq(2) > span').attr('title') + '';
                vl = vl.toString().trim();
                if (vl == 'undefined' || vl == '') {
                    vl = $(this).parents('tr').find('td:eq(2)').text() + '';
                }
				$('#'+formId+' [name="'+targetName+'"]').val(vl);
				POPUP.close('gridFormList');
			});
		});
	});
}
