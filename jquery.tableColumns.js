
/**
 * jquery.tableColumns Plugin
 * 
 * Dependences: 
 * - jquery-cookie (https://github.com/carhartl/jquery-cookie)
 * 
 * Copyright 2012, Wagner Silveira
 * The MI License - http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	$.fn.tableColumns = function(options) {
		var columns = [];
		
		options = $.extend({
			controllerClass: '',
			tableId: '',
			useCookie: true,
			hideColumns: [], // colunas escondidas (1 ... N).
			callback: null // function (columnPosition, hide) { ... } exec. apos show/hide uma coluna
		}, options);
		
		if (options.useCookie && $.cookie('table-column-plugin') != null) {
			if ($.cookie('table-column-plugin') != "") {
				options.hideColumns = $.cookie('table-column-plugin').split(',');
			} else {
				options.hideColumns = [];
			}
		}
		
		if (options.hideColumns.length > 0) {
			console.log(options.hideColumns);
			for (key in options.hideColumns) {
				displaying(options.hideColumns[key], true, false);
			}
		}
		
		function displaying(position, hide, saveCookie) {
			var elements = '#'+ options.tableId +' td:nth-child('+ position +'), #';
			elements += options.tableId +' th:nth-child('+ position +')';
			
			if (hide === undefined || ! hide) {
				$(elements).show();
				
				columns.splice(columns.indexOf(position), 1);
				
				if (options.callback) {
					options.callback(position, false);
				}
			} else {
				$(elements).hide();
				
				columns.push(position);
				
				if (options.callback) {
					options.callback(position, true);
				}
			}
			
			if (options.useCookie && saveCookie) {
				console.log('saving');
				$.cookie('table-column-plugin', columns.join(','));
			}
		}
		
		return this.each(function() {
			$('.'+ options.controllerClass).bind('click', function () {
				var position = $(this).attr('class').replace(options.controllerClass, '').trim();
				
				displaying(position, (columns.indexOf(position) == -1), true);
			});
		});
	}
})(jQuery);
