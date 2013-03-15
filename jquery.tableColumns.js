
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

;(function($) {
	$.fn.tableColumns = function(options) {
		var columns = [];
		var el = $(this);
		var restore = false;
		
		options = $.extend({
			controllerClass: '',
			useCookie: true,
			classPosition: '',
			tableCookieKey: 'table-columns-plugin',
			hideColumns: [], // colunas escondidas (1 ... N).
			callback: null // function (columnPosition, hide) { ... } exec. apos show/hide uma coluna
		}, options);
		
		if (options.useCookie && $.cookie(options.tableCookieKey) != null) {
			if ($.cookie(options.tableCookieKey) != "") {
				options.hideColumns = $.cookie(options.tableCookieKey).split(',');
			} else {
				options.hideColumns = [];
			}
			
			restore = true;
		}
		
		if (options.hideColumns.length > 0) {
			for (key in options.hideColumns) {
				displaying(options.hideColumns[key], true, restore);
			}
		}
		
		function displaying(position, hide, restore) {
			var elements = 'td:nth-child('+ position +'), th:nth-child('+ position +')';
			
			if (hide === undefined || ! hide) {
				$(el).find(elements).fadeIn();
				
				columns.splice(getPosition(position), 1);
				
				if (options.callback) {
					options.callback(position, false);
				}
			} else {
				if (restore) {
					$(el).find(elements).fadeOut(0);
				} else {
					$(el).find(elements).fadeOut();
				}
				
				columns.push(position);
				
				if (options.callback) {
					options.callback(position, true);
				}
			}

			if (options.useCookie && ! restore) {
				$.cookie(options.tableCookieKey, columns.join(','), {path: '/'});
			}
		}
		
		function getPosition(columnPosition) {
			for (k in columns) {
				if (columns[k] === columnPosition)
					return k;
			}

			return -1;
		}
		
		return this.each(function() {
			$('.'+ options.controllerClass).bind('click', function () {
				var position = $(this).attr('class');
				
				position = position.substring(position.indexOf(options.classPosition) + options.classPosition.length);
				
				if (position.indexOf(' ') > -1)
					position = position.substring(0, position.indexOf(' '));
				
				displaying(position, (getPosition(position) == -1), false);

				return false;
			});
		});
	}
})(jQuery);
