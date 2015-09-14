(function($) {
	"use strict";
	$.treview = {};
	$.treview.defaults = {
		classes : {
			wrapper      : "tree well ztree",
			parentUl     : "",
			childUl      : "line",
			li           : "",
			collapsed    : "collapsed",
			expanded     : "expanded",
			root_open    : "button switch roots_open",
			root_close   : "button switch roots_close",
			folder_open  : "button ico_open",
			folder_close : "button ico_close",
			doc          : "button ico_docu",
			line_doc     : "button center_docu",
			checkbox     : "",
			line_hover   : "line_hover",
		},
		expanded : false, 
	};

	var TreeView = function (element, options) {
		// var self            = this;
		this.options        = $.extend({}, $.treview.defaults, options);
		this.classes        = this.options.classes;
		this.data           = this.options.data.data;
		this.checkboxTitles = this.options.data.titles;
		this.el             = element[0];
		this.el.className   = this.classes.wrapper;   
		this.el.setAttribute("data-treeview", "treeview");   
		this.html           = document.createElement("ul");
		this.html.className = this.classes.parentUl;
		this.postData       = {};
		this.init();
	};
	TreeView.prototype = {
		setAttributes : function (element,attr) {
			for(var i in attr) {
				element.setAttribute(i,attr[i]);
			}
			return element;
		},
		parseTree : function (data, parentUl) {
			if (!data || data.length === 0) return;

			var self    = this;
			var roots   = [], children = {};
			var node    = [];

			for (var i in data) {
				var item     = data[i];
				item.index   = i;
				var parentId = item.pId;
				var target   = (parentId == "0") ? roots : (children[parentId] || (children[parentId] = []));
				target.push({ value: item });

			}
			// console.info(node);
			var findChildren = function(parent,nodeElement) {

		        if (children[parent.value.id]) {
		            parent.children = children[parent.value.id];
		            var childNode = [];
		            var childParentUl = document.createElement("ul");
		            childParentUl.className = self.classes.childUl;

		            for (var j in parent.children) {
		            	if (children[parent.children[j].value.id]) {
		    				childNode[j] = self.createNode(parent.children[j].value,true); /* Create Child Node Parent Dom Object */
		            	} else {
		    				childNode[j] = self.createNode(parent.children[j].value,false); /* Create Childe Node Non Parent Dom Object */
		            	}
		                findChildren(parent.children[j],childNode[j]);
		                childParentUl.appendChild(childNode[j]);
		            }

		            nodeElement.appendChild(childParentUl);
		        } 
		    };
		    for (var k in roots) {
		    	if (children[roots[k].value.id]) {
			    	node[k] = self.createNode(roots[k].value,true); /* Create Root Node Parent Dom Object */
			        findChildren(roots[k],node[k]);
		        } else {
		        	node[k] = self.createNode(roots[k].value,false); /* Create Root Node Non Parent Dom Object */
		        }
				parentUl.appendChild(node[k]);
		    }
		},
		parseTitle : function () {

			this.titles           = document.createElement("div");
			this.titles.className = "pull-right";
			this.titleIds   = {};

			for (var i in this.checkboxTitles) {

				this.titleIds[this.checkboxTitles[i].id] = this.checkboxTitles[i].name; /* get Checkbox Title Id */
				var titleSpan       = document.createElement("span");
				titleSpan.className = this.classes.checkbox;
				titleSpan.innerHTML = this.checkboxTitles[i].name;
				this.titles.appendChild(titleSpan);
			}
		},
		parseCheckBoxes : function (data) {
			var checkboxesContainer       = document.createElement("span");
			checkboxesContainer.className = "pull-right";
			var operations = data.o;
			for (var i in operations) {
				
				var checkbox = document.createElement("input");

				if (this.lookupChildren(data.id, i)) {
					checkbox.indeterminate = false;
					checkbox.checked = operations[i];
				} else {
					if (operations[i]) {
						checkbox.indeterminate = true;
					}

				}

				checkbox = this.setAttributes(checkbox,{
					"data-checked"  : operations[i],
					"data-key"      : i,
					"data-id"       : data.id,
					"data-pId"      : data.pId,
					"data-uniq"     : data.id+"_"+i,
					"data-link"     : "change-state",
					"title"         : this.titleIds[i],
					"type"          : "checkbox",
					"class"			: "chekboxDiv"
				});
				
				checkboxesContainer.appendChild(checkbox);
			}
			return checkboxesContainer;
		},
		createNode : function (node, isParent) {
			
			var nodeElement = document.createElement("li");
			nodeElement.className = this.classes.li;

			var wrapperDiv = document.createElement("div");
			wrapperDiv.className = this.classes.line_hover;

			var anchorClass = this.classes.expanded;
			var folderClass = this.classes.folder_open;
			var rootClass   = this.classes.root_open;
			if (! this.options.expanded) {
				anchorClass = this.classes.collapsed;
			}
			var anchor  = document.createElement("a");
			anchor.text = node.name;
			anchor = this.setAttributes(anchor,{
				"data-level" : node.pId,
				"class"      : anchorClass,
				"href"       : "javascript:;"
			});

			var rootSpan   = document.createElement("span");
			var anchorSpan = document.createElement("span");
			if (isParent) {
				anchorSpan.className = "folder "+folderClass;
				rootSpan.className   = "root "+rootClass;
				rootSpan.setAttribute("data-link","collapsable");
				anchor.setAttribute("data-link", "collapsable");
			} else {
				rootSpan.className = "root "+this.classes.line_doc;
				anchorSpan.className = "folder "+this.classes.doc;
			}
			
			anchor.insertBefore(anchorSpan, anchor.firstChild);
			wrapperDiv.appendChild(anchor);

			var checkboxes = this.parseCheckBoxes(node);
			wrapperDiv.appendChild(checkboxes);

			wrapperDiv.insertBefore(rootSpan,wrapperDiv.firstChild);

			nodeElement.insertBefore(wrapperDiv,nodeElement.firstChild);

			return nodeElement;
		},
		collapse : function (el) {
			el.parent().parent().children("ul").removeClass(this.classes.expanded).addClass(this.classes.collapsed).children("li").fadeOut();
			el.parent().children("span.root").removeClass(this.classes.root_open).addClass(this.classes.root_close);
			el.parent().find("a").children("span.folder").removeClass(this.classes.folder_open).addClass(this.classes.folder_close);
		},
		expand : function (el) {
			el.parent().parent().children("ul").removeClass(this.classes.collapsed).addClass(this.classes.expanded).children("li").fadeIn();
        	el.parent().children("span.root").removeClass(this.classes.root_close).addClass(this.classes.root_open);
		    el.parent().find("a").children("span.folder").removeClass(this.classes.folder_close).addClass(this.classes.folder_open);
		},
		beginCollapsed : function () {
			var self = this;
			$("[data-level='0']").each(function () {
				self.collapse($(this));

			});
		},
		eventCollapsable: function () {
			var self = this;
			$(document).on("click","[data-link='collapsable']", function (e) {

				if ( $(this).parent().parent().find(">ul").hasClass(self.classes.collapsed) ) {
					self.expand($(this));
			    } else {
					self.collapse($(this));
			    }
		        e.stopPropagation();
			});
		},
		eventChangeState : function () {
			var self = this;
			$(document).on("change","[data-link='change-state']", function (e) {
				var key       = $(this).data("key");
				var checked   = $(this).prop("checked");
				var container =  $(this).parent().parent().parent();
	      	    container.find("[data-key='"+key+"'']").prop({
			        indeterminate: false,
			        checked: checked
			    });

	      	    self.checkNodes(container, $(this));
			    self.getSelectedNodes();
			    e.stopPropagation();
			});
		},
		lookupChildren   : function (index, p, res) {
			
			res = typeof res == "undefined" ? true : res;

			if (!res) {
				return false;
			}

			var children = this.getChildren(index);
			for (var i in children) {
				res = res && this.data[children[i]].o[p];
				
				if (!res) {
					break;
				}

				res = res && this.lookupChildren(children[i], p, res);
			}

			return res;
		},
		getChildren : function (index) {
			var res = [];

			for (var i in this.data) {
				if (this.data[i].pId == index) {
					res.push(this.data[i].id);
				}
			}

			return res;
		},
		getParentNodeIds : function (index, ids) {
			var idsArr = ids || [];


			if (index == "0") {
				return [];
			}

			var pId = this.data[index].pId;
			if (pId != "0") {
				this.getParentNodeIds(pId, idsArr);
				idsArr.push(pId);
			}

			return idsArr;
		},
		checkNodes : function (container, element) {
			
			var self     = this;
			var checked  = element.prop("checked");
			var parent   = container.parent().parent();
			var children = parent.children().children();
			var all      = true;
			var key      = element.data("key");
	        container.siblings().each(function() {
	            all = ($(this).find("[data-key='"+key+"']").prop("checked") === checked);
	            return all;

	        });
	        if (all && checked) {
	            children.children("[data-key='"+key+"']").prop({
	                indeterminate: false,
	                checked: checked
	            });
	            self.checkNodes(parent, element);
	        } else if (all && !checked) {  
	            children.children("[data-key='"+key+"']").prop("checked", checked);
	            children.children("[data-key='"+key+"']").prop("indeterminate", (children.find("[data-key='"+key+"']:checked").length > 0));
	            self.checkNodes(parent, element);
	        } else {
	            container.parents("li").children().children().children("[data-key='"+key+"']").prop({
	                indeterminate: true,
	                checked: false
	            });
	        }
		},
		getSelectedNodes : function () {
			var self = this;
			$("[data-link='change-state']").each(function () {
				var id      = $(this).data("id");
				var key     = $(this).data("key");
				var checked = ($(this).prop("checked")) ? $(this).prop("checked") : $(this).prop("indeterminate");
				if (self.data[id].o[key] !== checked) {
					if (typeof self.postData[id] == "undefined") {
						self.postData[id] = {};
					}
					self.postData[id][key] = checked;
				}
			});
			return self.postData;
		},
		init : function () {
			var self = this;
			self.parseTitle();
			self.parseTree(self.data, self.html,0);

			self.el.appendChild(self.titles);
			self.el.appendChild(self.html);

			self.eventCollapsable();
			self.eventChangeState();
			if (! this.options.expanded) {
				self.beginCollapsed();
			}
			self.getSelectedNodes();
		}

	};
	$.fn.treeview = function(options) {

        var treeview = $(this).data("treeview");

        if (!treeview) {
            treeview = new TreeView(this, options);
            $(this).data("treeview", treeview);
        }
        return treeview;
    };
})(jQuery); 