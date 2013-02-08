/**
 * jQuery.stickTo.js
 *
 * v.1.0.0
 *
 * jQuery Plugin for fixing elements on scroll with respect to another element.
 *
 * Copyright (c) 2013 Joseph Nudell
 * Freely distributable under the MIT License.
 */
 
(function($) {
	// Put jn namespace inside of jQuery, put plugin globals
	// in namespace inside of that. Don't overwrite anything.
	$.jn = $.jn || {};
	if(!$.jn.hasOwnProperty('stickTo')) {
		// These are plugin globals. Put scroll handler and scroll boxes
		// to handle here.
		$.jn.stickTo = {
			//
			// Global variables associated with stickTo.
			//
			//
			needsLoadScroll : false,
			lastHScroll : 0,
			didHScroll : function() {
				var did = $.jn.stickTo.lastHScroll!=$(window).scrollLeft();
				if(did) $.jn.stickTo.lastHScroll = $(window).scrollLeft();
				return did;
			},
			//
			// Scroll Handler
			//
			scrollHandler : function(e, forceAll) {
				// Manage scrolling.
				// forceAll makes handler lay everything out, even elements with classes
				// that would prevent their positions from being calculated. Useful for
				// init, or in any similar situation where not all classes are set yet. 
				if(forceAll===undefined) forceAll = $.jn.stickTo.needsLoadScroll;
				if($.jn.stickTo.needsLoadScroll) $.jn.stickTo.needsLoadScroll = false;
				
				if($.jn.stickTo.didHScroll()) {
					// Recalculate horizontal position on horizontal scroll.
					// Note: only necessary for fixed elements. Improve performance
					// by being more selective. 
					$(window).stickTo('updateBounds', 'x');
					forceAll = true;
				}
				
				var visTop = $(window).scrollTop(),
					visLeft = $(window).scrollLeft();
				
				$('.jn-stickto').each(function(i, me) {
					var data = $(me).data('stickTo'),
						alignBottom = data.valign=='bottom',
						voffset = alignBottom? $(window).height() - $(me).height() - data.margin.bottom : data.margin.top;
						
					if(visTop+voffset >= data.range.top && visTop+voffset < data.range.bottom) {
						// Scroll is within this elements vertical boundaries
						if(!$(me).hasClass('jn-stickto-fixed') || forceAll) {
							// Element is not stuck yet; stick this element to the screen
							$(me).css({
								position : 'fixed',
							 	top : voffset,
								left : data.range.left - visLeft,
							}).addClass('jn-stickto-fixed');
							
							// Execute scrollIn callback if available
							if(!forceAll && typeof data.scrollIn=='function') {
								data.scrollIn.call($(me));
							}
						}
					}else{
						// Scroll is outside of element's bounds
						if($(me).hasClass('jn-stickto-fixed') || forceAll) {
							// Element is stuck; unstick it.
							$(me).css({
								position : 'absolute',
								top : (visTop+voffset<=data.range.top)? data.range.top : data.range.bottom,
								left : data.range.left,
							}).removeClass('jn-stickto-fixed');
							
							// Execute scrollOut callback if available
							if(!forceAll && typeof data.scrollOut=='function') {
								data.scrollOut.call($(me));
							}
						}
					}
					
					// Execute onScroll callback (if present) for active element. Unlike other callbacks,
					// this one is executed even in manual forceAll call.
					if((forceAll || $(me).hasClass('jn-stickto-fixed')) && typeof data.onScroll=='function') {
						// Callback gets executed with the parameter of how far into the scroll it is
						var scrollPct = (visTop - data.range.top) / (data.range.bottom - data.range.top);
						data.onScroll.call($(me), scrollPct, data);
					}
				});
			}
		};
		
		// Lastly, install the scrollhandler
		$(window).bind('scroll', $.jn.stickTo.scrollHandler);
    }
	
	
	var methods = {
		// $.fn.stickTo definition
		//
		//
		//
		updateBounds : function(axis) {
			// Update boundaries. Called on init, call again if target
			// OR element chage. This updates bounds for EVERY instance of .stickTo.
			if(axis===undefined) axis='all';
			
			$('.jn-stickto').each(function(i, me) {
				$this = $(me);
				
				var data = $this.data('stickTo');
				
				if(axis=='y' || axis=='all') {
					// Update vertical scroll boundaries
					var $tg = $(data.target);
					
					data.range = data.range || {};
					
					// Calculate boundaries that determine where to fix and unfix the box
					// Boundaries are based on top position of target, height of target,
					// height of this element, and specified margins.
					data.range.top = $tg.offset().top + data.margin.top;
					data.range.bottom = $tg.offset().top + $tg.outerHeight(false) - $this.outerHeight(false) - data.margin.bottom;
				}
				
				if(axis=='x' || axis=='all') {
					// Update horizontal positioning
					// Calculate side alignment offset
					var leftOffset = 0,
						$aw = $(data.alignWith);
	
					data.range = data.range || {};
					
					switch(data.align) {
						// Calculate position relative to $(alignWith) element, based on
						// specified alignment mode, this element's width, $(alignWith)
						// element's width, and specified margins.
						case 'outside-left':
							leftOffset = -data.margin.right - $this.width();
							break;
						case 'inside-left':
							leftOffset = data.margin.right;
							break;
						case 'center':
							// Note: margin's aren't used if center is specified
							leftOffset = ($aw.width() - $this.width()) / 2;
							break;
						case 'inside-right':
							leftOffset = $aw.width() - data.margin.left - $this.width();
							break;
						default: 
							// AKA align "outside-right"
							leftOffset = $aw.width() + data.margin.left;
							break;
					}
					
					// Real left value will be modified by $(window).scrollLeft
					data.range.left = $aw.offset().left + leftOffset;
				}
				
				// Update data object
				$this.data('stickTo', data);
			});
			
			return this;
		},
		//
		//
		//
		init : function(args) {
			var params = {
				target : null,
				margin : {
					top: 10,
					bottom: 10,
					left: 10,
					right: 10
				},
				align : 'outside-right',
				valign : 'top',
				alignWith : null,
				scrollIn : null,
				scrollOut : null,
				onScroll : null
			};
			
			// Put element as a direct child of <body/>, but save old parent and save former styles
			params.$oldParent = this.parent();
			params.oldStyle = this.attr('style'); // yum!
			if(params.oldStyle===undefined) params.oldStyle = "";
			this.appendTo('body');
			
			// Load options. If args is a string, assume it's a selector.
			// Usually an object will be passed, though.
			if(typeof args=='string') {
				params.target = args;
			}else{
				var newMargin = {};
				if(args.hasOwnProperty('margin')) {
					// Parse margin value
					if(typeof args['margin']=='string') {
						// Margin can be in any valid CSS shorthand
						var parts = args.margin.split(' ');
						for(var i=0; i<parts.length; i++) parts[i]=parseInt(parts[i]);
						switch(parts.length) {
							case 1:
								// All margins are same length
								newMargin.top = newMargin.right = newMargin.bottom = newMargin.left = parts[0];
								break;
							case 2:
								// Top and bottom are same, left and right are same
								newMargin.top = newMargin.bottom = parts[0];
								newMargin.left = newMargin.right = parts[1];
								break;
							case 3:
								// Top, left=right, bottom
								newMargin.top = parts[0];
								newMargin.left = newMargin.right = parts[1];
								newMargin.bottom = parts[2];
								break;
							case 4:
								// Everything is different: top right bottom left
								newMargin.top = parts[0];
								newMargin.right = parts[1];
								newMargin.bottom = parts[2];
								newMargin.left = parts[3];
								break;
							default:
								// Use defaults on error
								newMargin = params.margin;
						}			
					}else{
						newMargin = args.margin;
					}
				}else{
					newMargin = params.margin;
				}
				
				// Add init options to configuration
				$.extend(params, args);
				
				params.margin = newMargin;
			}
			
			// Make sure target was specified. If it wasn't, fail.
			if(params.target==null) {
				$.error('$.fn.stickTo.init called without a target.');
				return false;
			}
			
			// By default align with target
			if(params.alignWith==null) params.alignWith = params.target;
			
			// Save configuration in elements data object (in stickTo namespace)
			this.data('stickTo', params);
			
			// Set initial horizontal position of element.
			this.addClass('jn-stickto').css('position', 'absolute');
			this.stickTo('updateBounds', 'all');
			
			// Run the scroll handler to set the inital vertical position.
			$.jn.stickTo.scrollHandler(null, true);
			
			return this;
		},
		//
		//
		//
		touch : function() {
			// Update layout. Reset bounds and trigger a hard scroll
			// handler so that all the elements are put in the right places.
			$(document).stickTo('updateBounds');
			$.jn.stickTo.scrollHandler(null, true);
			return this;
		},
		//
		//
		//
		remove : function() {
			// In case you didn't want toast.
			this.removeClass('jn-stickto')
				.removeClass('jn-stickto-fixed')
				.attr('style', this.data('stickTo').oldStyle)
				.appendTo(this.data('stickTo').$oldParent);
				
			$(document).stickTo('touch');
			return this;
		}
	};
	
	
	$.fn.stickTo = function(method) {
		// .stickTo calling paradigms:
		/// INIT
		// $(selector).stickTo('init', params);       // params = { /* options */ };
		// $(selector).stickTo(params);
		// $(selector).stickTo('init', selector);     // selector = div#mySelector;
		// METHODS
		// $(selector).stickTo(method, params);
		// 
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on $.fn.stickTo' );
		}    
	};
	
	$(window).on('load', function() {
		// Chrome executes a scroll to preserve document position on refresh / back.
		// It does this after window's ready event is fired. Set this variable to
		// tell scrollHandler that it needs to force every element into the position
		// it should be in, instead of only modifying the positions of active elements.
		$.jn.stickTo.needsLoadScroll = true;
	});
	
	
	$(window).resize(function() {
		// Keep things laid out prettily on window resize
		$(document).stickTo('touch');
	});
		
	
})(jQuery);