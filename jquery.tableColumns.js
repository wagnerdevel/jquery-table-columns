
/**
 * jQuery Table Columns Plugin
 * 
 * http://jsfiddle.net/wagnerdevel/Hmh48/
 * 
 * Depends: 
 * - jquery.js (http://jquery.com)
 * - jquery.cookie.js (https://github.com/carhartl/jquery-cookie)
 * 
 * Copyright 2012, Wagner Silveira
 * The MIT License - http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	$.fn.tableColumns = function(options) {
		var columns = [];
		var el = $(this);
		
		options = $.extend({
			controllerClass: '',
			useCookie: true,
			classPosition: '',
			tableCookieKey: '',
			hideColumns: [], // colunas escondidas (1 ... N).
			callback: null // function (columnPosition, hide) { ... } exec. apos show/hide uma coluna
		}, options);
		
		if (options.useCookie && $.cookie(options.tableCookieKey) != null) {
			if ($.cookie(options.tableCookieKey) != "") {
				options.hideColumns = $.cookie(options.tableCookieKey).split(',');
			} else {
				options.hideColumns = [];
			}
		}
		
		if (options.hideColumns.length > 0) {
			for (key in options.hideColumns) {
				displaying(options.hideColumns[key], true, false);
			}
		}
		
		function displaying(position, hide, saveCookie) {
			var elements = 'td:nth-child('+ position +'), th:nth-child('+ position +')';
			
			if (hide === undefined || ! hide) {
				$(el).find(elements).fadeIn();
				
				columns.splice(columns.indexOf(position), 1);
				
				if (options.callback) {
					options.callback(position, false);
				}
			} else {
				$(el).find(elements).fadeOut();
				
				columns.push(position);
				
				if (options.callback) {
					options.callback(position, true);
				}
			}
			
			if (options.useCookie && saveCookie) {
				$.cookie(options.tableCookieKey, columns.join(','));
			}
		}
		
		return this.each(function() {
			$('.'+ options.controllerClass).bind('click', function () {
				var position = $(this).attr('class');
				
				position = position.substring(position.indexOf(options.classPosition) + options.classPosition.length);
				
				if (position.indexOf(' ') > -1)
					position = position.substring(0, position.indexOf(' '));
				
				displaying(position, (columns.indexOf(position) == -1), true);
			});
		});
	}
})(jQuery);
