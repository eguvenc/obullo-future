/*! DataTables UL GRID
 * ©2008-2014 Paradoks Ltd
 */

/**
 * @summary     DataTables UL GRID
 * @description Paginate, search and order datatables json response in a ul element
 * @version     0.1
 * @author      Rabih Abou Zaid <rabihsyw@gmail.com>
 * @contact     www.paradoks.com.tr
 *
 **/
(function ($) {

	$.fn.FlixGrid    = function (options) {

		"use strict";
		
		var selector           = this.selector,
			$this              = $(this.selector),
			_params = {
				done_call_stack   : [],
				output_objects    : [],
				output_html_stack : [],
			},
			_options 		   = {
				data              : options.data || {},
				columns 		: (options.columns) ? function (cols) {
					var newCols = [];
	
					for (var i in cols) {

						newCols[i]           = {};
						newCols[i].data      = cols[i].sName || '';
						newCols[i].name      = cols[i].sName || '';
						newCols[i].title     = cols[i].sTitle || '';
						newCols[i].class     = cols[i].sClass || '';
						newCols[i].orderable = cols[i].sOrderable || false;
						newCols[i].search    = {
							regex : true,
							value : ''
						};
						newCols[i].searchable = cols[i].sSearchable || true;
					}
					return newCols;
				} (options.columns) : {},

				draw			: options.draw || 1,
				recordsFiltered	: options.recordsFiltered || 1,
				length 			: options.length || 10,
				start 			: 0,
				row 			: (options.element) ? (options.element.row) || 'div' : 'div',
				col 			: (options.element) ? (options.element.col) || 'div' : 'div',
				col_class 		: 'FlixGrid-col',
				row_class       : 'FlixGrid-row FlixGrid-r-',
				bootstrap 		: 	(options.bootstrap) ? {
										colsPerRow : parseInt(options.bootstrap.colsCount) || 2
									} : false,
				initComplete  : (typeof options.fnInitComplete == 'function') ? options.fnInitComplete : function(){}
			},
			_p = {
			setResponse : function (res) {
				_options.data          = res.data;
				_options.draw         = res.draw;
				_options.recordsFiltered = res.recordsFiltered;
			},
			getColClass : function (index) {
				var c = _options.col_class;
				if (_options.bootstrap) {
					c += ' col-sm-' + (_options.bootstrap.colsPerRow);
				} else {
					c += ' FlixGrid-c-width';
				}
				c += ' FlixGrid-c-' + (parseInt(index) % 2);
				return c;
			},
			buildCol : function (index) {
				var $row = $(document.createElement(_options.col)).addClass(_p.getColClass(index));
				return $row;
			},
			buildRow : function (index) {
				var $col   = $(document.createElement(_options.row)).addClass(_options.row_class + (parseInt(index) % 2)).attr({'id' : 'FlixGrid-row-' + index});

				var $label = $(document.createElement('label')).addClass('FlixGrid-row-label ').appendTo($col);
				var $colContent = $(document.createElement('div')).addClass('FlixGrid-row-content ').appendTo($col);

				if (_options.columns[index]) {
					$col.addClass(_options.columns[index].class || '');
					$label.html(_options.columns[index].title || '');
				}
				return [$col, $colContent];
			},
			eraseContent : function () {
				
				$this.html('');

				_params.done_call_stack   = [];
				_params.output_objects    = [];
				_params.output_html_stack = [];
			},
			render : function () {
				console.warn(_options);
				_p.eraseContent();
				$.each(_options.data, function ($cK, $col1){
					var $r = _p.buildCol($cK);
					$.each($col1, function ($rK, $row) {
						var cA = _p.buildRow($rK);
						var $c = cA[0];
						$c.find(cA[1]).append($row);
						$r.append($c);
					});
					_params.output_objects.push($r);
					_params.output_html_stack.push($r[0].outerHTML);
				});
				$this.append(_params.output_html_stack.join(''));

				_options.initComplete($this, _options);
			},
			set_call_stack : function (func, args) {
				for (var i in _params.done_call_stack) {
					if (''+_params.done_call_stack[i].func == ''+func || _params.done_call_stack[i].func == func) {
						return;
					}
				}
				var x = {
					func : typeof func == 'function' ? func : function (){},
					args : args
				};
				_params.done_call_stack.push(x);			
			},
			call_stack : function () {
				$.each(_params.done_call_stack, function (i, item) {
					item.func.apply(undefined, item.args);
				});
			},
			generateDataQuery : function () {
				var q = {'columns' : []};
				for (var i in _options.columns) {
					q.columns[i] = q.columns[i] || {};
					q.columns[i].name = _options.columns[i].name;
					q.columns[i].data = _options.columns[i].data;
					q.columns[i].orderable = _options.columns[i].orderable;
					q.columns[i].search = _options.columns[i].search;
					q.columns[i].searchable = _options.columns[i].searchable;
				}
				q.draw   = _options.draw;
				q.length = _options.length || 10;
				q.start  = _options.start || 0;
				return q;
			},
			generateAjaxObj : function (ajaxO) {
				var newA = {};
				try {
					newA.url = ajaxO.url;
					newA.type = ajaxO.type || 'post';
					newA.data = typeof ajaxO.data == 'function' ? function () {
						ajaxO.data(_options);

						return _p.generateDataQuery();
					} () : typeof ajaxO.data == 'object' ? ajaxO.data : {};
				} catch (e) {
					console.error(e);
					return {};
				}
				return newA;
			},
			getData : function () {
				$.ajax(_p.generateAjaxObj(options.ajax)).done(function(res,status,xhr) {
					var response = $.parseJSON(res);
					_p.setResponse(response);
					_p.call_stack();
					$(document).trigger('flixGrid-loaded');
				});
			},
			pagination : function () {
				var _2param = {
					link 		: 'data-dt-idx',
					pagesCount 	: 0,
					$container : {},
					shown 		: false,
				};

				return {
					calculatePagesNum : function () {
						_2param.pagesCount = Math.ceil(((_options.recordsFiltered || 0) / (_options.length || 1))) || 1;
						return _2param.pagesCount;
					},
					createButton : function (idx) {
						var attrs = {
							'href' 			: 'javascript:;'
						};
						attrs[_2param.link] = idx;
						var $b = $(document.createElement('a')).addClass('paginate_button btn btn-default').attr(attrs).html(idx);
						return $b;
					},
					buildNavigator : function () {
						_2param.$container = $(document.createElement('div')).addClass('pagination dataTables_paginate paging_simple_numbers');
						var $span = $(document.createElement('span'));

						var skip = false;
						for (var i = 1 ; i <= _2param.pagesCount ; i++) {
							var $b = _p.pagination.createButton(i);
							if (i > 5 && i < _2param.pagesCount - 4) {
								if (!skip) {
									$span.append('.....');
									skip = true;
								}
							} else {
								$b.appendTo($span);
							}
						}
						$span.appendTo(_2param.$container);

						$span.prepend(_p.pagination.getLeftRightButtons('left'));
						$span.append(_p.pagination.getLeftRightButtons('right'));
					},
					getLeftRightButtons : function (leftRight) {
						var pos = (leftRight == 'left') ? 'previous' : 'next';
						var attrs = {'href' : 'javascript:;'};
						attrs[_2param.link] = (pos == 'previous') ? '-' : '+';
						var $x = $(document.createElement('a')).addClass('paginate_button btn btn-default ' + pos).attr(attrs).html(pos);
						return $x;
					},
					handler : function () {

						$('['+_2param.link+']').off('click').on('click', function () {

							var x = $(this).data('dt-idx');
							var start = +_options.start;
							var current = 0;
							var oldCurrent = current = ((start) / (+_options.length));
							if (!/\d/.test(x)) {
								current = (x == '-') ? (current == 0) ? 0 : +(--current) : +(++current);
							} else {
								current = x - 1;
							}
							if (current == oldCurrent || (current * _options.length) >= _options.recordsFiltered) {
								return;
							}
							_options.start = current * _options.length;
							obj.redraw();
						});
					},
					buildWrapper : function () {
						var $row;
						var $buttonsBlock;
						if (_2param.shown) {
							$row = $(document).find('.FlixGrid-pagination-row');
							$buttonsBlock = $row.find('.FlixGrid-pagination-buttons');
						} else {
							$row = $(document.createElement('div')).addClass('row FlixGrid-pagination-row');
							$(document.createElement('div')).addClass('col-xs-4').appendTo($row);
							$buttonsBlock = $(document.createElement('div')).addClass('FlixGrid-pagination-buttons col-xs-8').appendTo($row);
							$this.after($row);
						}

						return $buttonsBlock;
					},
					create : function () {
						/**
						 * Rerender pagination just if the count of pages has changed.
						 */
						if (_2param.pagesCount != _p.pagination.calculatePagesNum()) {
							_p.pagination.buildNavigator();
							var $buttonsBlock = _p.pagination.buildWrapper();
							$buttonsBlock.html(_2param.$container);
							_p.pagination.handler();
						}
						
						/**
						 * Set as show
						 */
						if (!_2param.shown) {
							_2param.shown = true;
						}
					},
					activate : function (start) {
						var current = 0;
						current = ((start) / (+_options.length));
						$('['+_2param.link+']').removeClass('active');
						$('['+_2param.link+'='+(current+1)+']').addClass('active');
					}
				};
			} (),
			init : function () {
				$(document).off('flixGrid-loaded').on('flixGrid-loaded', function () {
					_p.pagination.activate(_options.start);
				});
			}
		},
		obj = {
			redraw : function (func) {
				
				_p.set_call_stack(_p.render, {});
				_p.set_call_stack(_p.pagination.create, {});
				_p.getData();

				if (typeof func == 'function') {
					func();
				}
			}
		};

		_p.init();
		obj.redraw();
		return obj;
	    // return $this;
	};

}(jQuery));