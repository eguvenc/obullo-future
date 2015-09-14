"use strict";

var TABNAVIGATOR  = (function(){
	var _params = {
		json               : {},
		tabs               : [],
		subNav 			   : false,
		hash               : "",
		activeTab          : "",		
		firstTab           : "",		
		firstUrl           : "",		
		activeUrl          : "",		
		divID              : "",		
		loadedContent      : {},
		navTabContainer    : {},
		tabContent         : {},
		wrapper 		   : {},
		viewFuncs 		   : {}

	};

	var obj = {
		setJson : function(id,jsonData) {
			_params.hash      = window.location.hash.replace('#', '');
			_params.divID     = id;
			_params.activeTab = '';

			_params.navTabContainer = $("<ul>").addClass("nav nav-tabs");
			_params.tabContent      = $("<div>").addClass("tab-content");
			var first = true
			for(var i in jsonData) {
				if (jsonData[i].success) {
					if (_params.hash === jsonData[i].tab) {
						_params.activeTab = jsonData[i].tab;
						_params.activeUrl = jsonData[i].url;
						window.location.hash = _params.hash;
						_params.subNav       = true;
					}
					if (first) {
						_params.firstTab = jsonData[i].tab;
						_params.firstUrl = jsonData[i].url;
						first = false;
					}
					if (jsonData[i].wrapper) {
						_params.wrapper = jsonData[i].wrapper;
					}
					_params.json[i] = jsonData[i];
					obj.buildTabs(jsonData[i]);
				}
			}
			if (! $.isEmptyObject(_params.wrapper)) {
				if (_params.wrapper.tab) {
					var tempTab = $('<div>').addClass(_params.wrapper.tab);
					_params.navTabContainer.appendTo(tempTab);
					_params.navTabContainer = tempTab;
				}
				if (_params.wrapper.pane) {
					var tempPane =  $('<div>').addClass(_params.wrapper.pane);
					_params.tabContent.appendTo(tempPane);
					_params.tabContent = tempPane;
				}
			}
			if (_params.activeTab === '') {
				if (! _params.subNav) {
					window.location.hash = _params.firstTab;
					_params.subNav       = true;
				}
				_params.activeTab    = _params.firstTab;
				_params.activeUrl    = _params.firstUrl;
			}

			$('#'+id).append(_params.navTabContainer,_params.tabContent);
			$('#'+id).find('[data-tab="'+_params.activeTab+'"]').addClass('in active');
			$('#'+id).find('[data-pane="'+_params.activeTab+'"]').addClass('in active');
			obj.getActiveContent();

		},
		buildTabs : function(jsonData) {

			var navTabList          = $('<li>').attr('data-tab', jsonData.tab);
			var navTabAnchor        = $('<a>').attr('data-toggle','tab');
			var tabPane             = $('<div>').addClass('tab-pane fade').attr('data-pane', jsonData.tab);
			
			// if (jsonData.tab == _params.activeTab) {
			// 	navTabList.addClass('active');
			// 	tabPane.addClass('in active');
			// }
			navTabAnchor.text(jsonData.title);

			navTabAnchor.attr('data-url',jsonData.url);
			navTabAnchor.attr('data-tab',jsonData.tab);
			navTabAnchor.attr('href','#'+jsonData.tab);
			navTabAnchor.appendTo(navTabList);
			navTabList.appendTo(_params.navTabContainer);
			tabPane.attr('id',jsonData.tab);
			tabPane.appendTo(_params.tabContent);
			_params.viewFuncs[jsonData.tab] = jsonData.view || false;
			
		},
		getActiveContent : function() {
			
			COMMON.ajax(_params.activeUrl,{},{type:'POST'},function(response) {
				_params.loadedContent[_params.activeTab] = 1;
				$("#"+_params.activeTab).html(response[0]);
				if (_params.viewFuncs[_params.activeTab]) {
					if (typeof obj[_params.viewFuncs[_params.activeTab]] == 'function') {
						obj[_params.viewFuncs[_params.activeTab]](response);
					}
				}
			});
		},
		isLoaded : function (){
			// console.info(_params.loadedContent[_params.activeTab])
			if (_params.loadedContent[_params.activeTab]) {
				return true;
			}
			return false;
		},
		datatable : function (response) {
		},
		chart : function (response) {
		},
		init : function(){
		
			$(document).off("show.bs.tab","[data-toggle=tab]").on("show.bs.tab","[data-toggle=tab]", function(e) {
				_params.activeTab = $(this).data('tab');
				_params.hash = _params.activeTab;
				window.location.hash = _params.hash;
				_params.activeUrl = $(this).data('url');
				if (obj.isLoaded()) {
					return;
				}
				obj.getActiveContent();
			});
		},
	}
	return obj;
})();

TABNAVIGATOR.init();