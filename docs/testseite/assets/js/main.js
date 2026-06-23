/**
 * Future Imperfect by HTML5 UP
 * html5up.net | @ajlkn
 * Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
 */

(function($) {

	/**
	 * Apply "placeholder" attribute polyfill to one or more forms.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function() {

		if (typeof document.createElement('input').placeholder != 'undefined')
			return $(this);

		return this.each(function() {
			var $this = $(this);

			if ($this.is('input, textarea')) {

				// Input/textarea
				var $form = $this.closest('form'),
					$label = $this.closest('.form').find('label[for="' + $this.attr('id') + '"]');

				if (!$label.length)
					$label = $this.prev('label');

				// Only if there's a label
				if ($label.length) {

					// Settings.
					var settings = {
						value: $this.attr('placeholder'),
						className: 'placeholder',
						focusClassName: 'placeholder-focus'
					};

					// Label.
					$label
						.addClass(settings.className);

					// Form.
					$form
						.addClass(settings.className);

					// Events.
					$label
						.bind('click.placeholder', function() {
							if ($this.val() == '') {
								$this
									.focus()
									.trigger('focus.placeholder');
							}
						});

					$this
						.bind('focus.placeholder blur.placeholder change.placeholder', function(event) {

							if (event.type == 'focus' || event.type == 'change') {

								if ($this.val() == '')
									$form.addClass(settings.focusClassName);
								else
									$form.removeClass(settings.focusClassName);

							}
							else if (event.type == 'blur') {

								if ($this.val() == '')
									$form
										.removeClass(settings.focusClassName)
										.val(settings.value)
										.trigger('change.placeholder');
								else
									$form.removeClass(settings.focusClassName);

							}

						});

					// Init.
					$this
						.val(settings.value)
						.addClass(settings.className)
						.trigger('blur.placeholder');

				}

			}

		});

	};

	/**
	 * Miscellaneous helper methods.
	 */
	var $misc = {

		/**
		 * IE8 polyfill for window.getComputedStyle
		 * @param {Element} el Target element.
		 * @param {string?} pseudo Pseudo-element (eg, ':before').
		 * @return {CSSStyleDeclaration} Style object.
		 */
		getComputedStyle: function(el, pseudo) {

			if (window.getComputedStyle)
				return window.getComputedStyle(el, pseudo);

			return el.currentStyle;

		},

		/**
		 * Get the height of an element's content (including padding).
		 * @param {Element} el Target element.
		 * @return {number} Content height.
		 */
		getContentHeight: function(el) {

			var style = $misc.getComputedStyle(el),
				paddingTop = parseInt(style.getPropertyValue('padding-top')),
				paddingBottom = parseInt(style.getPropertyValue('padding-bottom')),
				height = el.offsetHeight;

			return height - paddingTop - paddingBottom;

		},

		/**
		 * Get the width of an element's content (including padding).
		 * @param {Element} el Target element.
		 * @return {number} Content width.
		 */
		getContentWidth: function(el) {

			var style = $misc.getComputedStyle(el),
				paddingLeft = parseInt(style.getPropertyValue('padding-left')),
				paddingRight = parseInt(style.getPropertyValue('padding-right')),
				width = el.offsetWidth;

			return width - paddingLeft - paddingRight;

		},

		/**
		 * Get the height of an element's content + border.
		 * @param {Element} el Target element.
		 * @return {number} Inner height.
		 */
		getInnerHeight: function(el) {

			var style = $misc.getComputedStyle(el),
				paddingTop = parseInt(style.getPropertyValue('padding-top')),
				paddingBottom = parseInt(style.getPropertyValue('padding-bottom')),
				borderTop = parseInt(style.getPropertyValue('border-top-width')),
				borderBottom = parseInt(style.getPropertyValue('border-bottom-width')),
				height = el.offsetHeight;

			return height - borderTop - borderBottom;

		},

		/**
		 * Get the width of an element's content + border.
		 * @param {Element} el Target element.
		 * @return {number} Inner width.
		 */
		getInnerWidth: function(el) {

			var style = $misc.getComputedStyle(el),
				paddingLeft = parseInt(style.getPropertyValue('padding-left')),
				paddingRight = parseInt(style.getPropertyValue('padding-right')),
				borderLeft = parseInt(style.getPropertyValue('border-left-width')),
				borderRight = parseInt(style.getPropertyValue('border-right-width')),
				width = el.offsetWidth;

			return width - borderLeft - borderRight;

		},

		/**
		 * Get the height of the viewport.
		 * @return {number} Viewport height.
		 */
		getViewportHeight: function() {

			if (window.innerHeight)
				return window.innerHeight;

			return document.documentElement.clientHeight;

		},

		/**
		 * Get the width of the viewport.
		 * @return {number} Viewport width.
		 */
		getViewportWidth: function() {

			if (window.innerWidth)
				return window.innerWidth;

			return document.documentElement.clientWidth;

		}

	};

	/**
	 * Apply "skel" functionality to one or more elements.
	 * @param {object} options Settings.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.skel = function(options) {

		// Settings.
		var settings = $.extend({

			// Prefix for generated IDs.
			prefix: 'skel',

			// Breakpoints (name: width).
			breakpoints: {
				'wide': { range: '-1920', lockViewport: true },
				'normal': { range: '1920-1200' },
				'narrow': { range: '1200-980' },
				'narrower': { range: '980-736' },
				'mobile': { range: '736-480' },
				'mobilep': { range: '-480' }
			},

			// Default styleset.
			defaultStyle: 'mobilep',

			// Current styleset.
			currentStyle: null,

			// Current breakpoint.
			currentBreakpoint: null,

			// Current viewport size.
			currentViewport: {
				width: null,
				height: null
			},

			// Locked?
			locked: false

		}, options);

		// Breakpoints (sorted by range).
		var breakpoints = [],
			breakpointNames = [];

		for (var k in settings.breakpoints) {

			var bp = settings.breakpoints[k];

			// Skip if this breakpoint is locked and the viewport is locked.
			if (bp.lockViewport && settings.locked)
				continue;

			// Parse range.
			var range = bp.range.split('-'),
				min = parseInt(range[0]),
				max = parseInt(range[1]);

			if (isNaN(min))
				min = 0;

			if (isNaN(max))
				max = Infinity;

			// Add to list.
			breakpoints.push({
				name: k,
				min: min,
				max: max,
				lockViewport: bp.lockViewport
			});

			breakpointNames.push(k);

		}

		// Sort breakpoints by min (descending).
		breakpoints.sort(function(a, b) {
			return b.min - a.min;
		});

		// Helper to get the current breakpoint.
		var getCurrentBreakpoint = function() {

			var i, bp;

			for (i = 0; i < breakpoints.length; i++) {

				bp = breakpoints[i];

				if (settings.currentViewport.width >= bp.min && settings.currentViewport.width <= bp.max)
					return bp;

			}

			return null;

		};

		// Helper to get the current styleset.
		var getCurrentStyle = function() {

			var bp = getCurrentBreakpoint();

			if (bp)
				return bp.name;

			return settings.defaultStyle;

		};

		// Helper to determine if we're in a specific breakpoint.
		var isBreakpoint = function(name) {

			return (settings.currentBreakpoint && settings.currentBreakpoint.name == name);

		};

		// Helper to determine if we're in a specific breakpoint (or larger).
		var isBreakpointOrLarger = function(name) {

			if (!settings.currentBreakpoint)
				return false;

			var index = breakpointNames.indexOf(name);

			if (index < 0)
				return false;

			for (var i = index; i < breakpointNames.length; i++) {

				if (breakpointNames[i] == settings.currentBreakpoint.name)
					return true;

			}

			return false;

		};

		// Helper to determine if we're in a specific breakpoint (or smaller).
		var isBreakpointOrSmaller = function(name) {

			if (!settings.currentBreakpoint)
				return false;

			var index = breakpointNames.indexOf(name);

			if (index < 0)
				return false;

			for (var i = 0; i <= index; i++) {

				if (breakpointNames[i] == settings.currentBreakpoint.name)
					return true;

			}

			return false;

		};

		// Helper to determine if we're in a specific range.
		var isRange = function(min, max) {

			if (!settings.currentBreakpoint)
				return false;

			return (settings.currentViewport.width >= min && settings.currentViewport.width <= max);

		};

		// Helper to determine if we're in a specific range (or larger).
		var isRangeOrLarger = function(min, max) {

			if (!settings.currentBreakpoint)
				return false;

			return (settings.currentViewport.width >= min);

		};

		// Helper to determine if we're in a specific range (or smaller).
		var isRangeOrSmaller = function(min, max) {

			if (!settings.currentBreakpoint)
				return false;

			return (settings.currentViewport.width <= max);

		};

		// Helper to get the current viewport size.
		var getViewportSize = function() {

			return {
				width: $misc.getViewportWidth(),
				height: $misc.getViewportHeight()
			};

		};

		// Helper to generate a unique ID.
		var generateID = function() {

			var id = settings.prefix + '-';

			for (var i = 0; i < 6; i++)
				id += Math.floor(Math.random() * 16).toString(16);

			return id;

		};

		// Helper to reset an element.
		var resetElement = function($element, $style) {

			// Remove classes.
			$element
				.removeClass('skel-layers-ignore')
				.removeClass(function(index, className) {
					return className.match(/\\bskel-layers-[^\\s]+/g).join(' ');
				});

			// Remove styles.
			$style
				.removeClass('active')
				.empty();

		};

		// Helper to apply a styleset to an element.
		var applyStyle = function($element, name, $style) {

			// Reset.
			resetElement($element, $style);

			// Skip if this is the default style.
			if (name == settings.defaultStyle)
				return;

			// Add class.
			$element.addClass('skel-layers-ignore skel-layers-' + name);

			// Add styles.
			$style
				.addClass('active')
				.html($element.attr('data-skelsrc-' + name));

		};

		// Helper to apply the current styleset to an element.
		var applyCurrentStyle = function($element, $style) {

			applyStyle($element, settings.currentStyle, $style);

		};

		// Helper to apply the current styleset to all elements.
		var applyCurrentStyleToAll = function() {

			$elements.each(function() {

				var $this = $(this),
					$style = $this.children('.skel-layers-style');

				applyCurrentStyle($this, $style);

			});

		};

		// Elements.
		var $elements = this;

		// Initialize elements.
		$elements.each(function() {

			var $this = $(this);

			// Skip if already initialized.
			if ($this.hasClass('skel-layers-init'))
				return;

			// Mark as initialized.
			$this.addClass('skel-layers-init');

			// Generate ID if one isn't set.
			if (!$this.attr('id'))
				$this.attr('id', generateID());

			// Create style element.
			var $style = $('<style class="skel-layers-style" type="text/css"></style>');

			// Insert style element.
			$this.append($style);

			// Apply default style.
			applyStyle($this, settings.defaultStyle, $style);

		});

		// Initialize.
		var init = function() {

			// Get viewport size.
			settings.currentViewport = getViewportSize();

			// Determine current breakpoint.
			settings.currentBreakpoint = getCurrentBreakpoint();

			// Determine current style.
			settings.currentStyle = getCurrentStyle();

			// Apply current style to all elements.
			applyCurrentStyleToAll();

			// Trigger event.
			$(window).trigger('skel-init');

		};

		// Reset.
		var reset = function() {

			// Reset elements.
			$elements.each(function() {

				var $this = $(this),
					$style = $this.children('.skel-layers-style');

				resetElement($this, $style);

			});

			// Reset settings.
			settings.currentBreakpoint = null;
			settings.currentStyle = null;
			settings.currentViewport = {
				width: null,
				height: null
			};

			// Trigger event.
			$(window).trigger('skel-reset');

		};

		// Lock.
		var lock = function() {

			settings.locked = true;

			// Trigger event.
			$(window).trigger('skel-lock');

		};

		// Unlock.
		var unlock = function() {

			settings.locked = false;

			// Reinitialize breakpoints.
			breakpoints = [];
			breakpointNames = [];

			for (var k in settings.breakpoints) {

				var bp = settings.breakpoints[k];

				// Skip if this breakpoint is locked and the viewport is locked.
				if (bp.lockViewport && settings.locked)
					continue;

				// Parse range.
				var range = bp.range.split('-'),
					min = parseInt(range[0]),
					max = parseInt(range[1]);

				if (isNaN(min))
					min = 0;

				if (isNaN(max))
					max = Infinity;

				// Add to list.
				breakpoints.push({
					name: k,
					min: min,
					max: max,
					lockViewport: bp.lockViewport
				});

				breakpointNames.push(k);

			}

			// Sort breakpoints by min (descending).
			breakpoints.sort(function(a, b) {
				return b.min - a.min;
			});

			// Reinitialize.
			init();

			// Trigger event.
			$(window).trigger('skel-unlock');

		};

		// Change style.
		var changeStyle = function(name) {

			// Skip if already in this style.
			if (settings.currentStyle == name)
				return;

			// Update current style.
			settings.currentStyle = name;

			// Apply current style to all elements.
			applyCurrentStyleToAll();

			// Trigger event.
			$(window).trigger('skel-changeStyle', [name]);

		};

		// Add public methods.
		$elements
			.skelInit = init
			.skelReset = reset
			.skelLock = lock
			.skelUnlock = unlock
			.skelChangeStyle = changeStyle
			.skelIsBreakpoint = isBreakpoint
			.skelIsBreakpointOrLarger = isBreakpointOrLarger
			.skelIsBreakpointOrSmaller = isBreakpointOrSmaller
			.skelIsRange = isRange
			.skelIsRangeOrLarger = isRangeOrLarger
			.skelIsRangeOrSmaller = isRangeOrSmaller;

		// Initialize.
		init();

		// Window.
		$(window)
			.on('resize.skel orientationchange.skel', function(event) {

				// Get viewport size.
				var viewportSize = getViewportSize();

				// Skip if the viewport size hasn't changed.
				if (settings.currentViewport.width == viewportSize.width
				&& settings.currentViewport.height == viewportSize.height)
					return;

				// Update current viewport.
				settings.currentViewport = viewportSize;

				// Determine current breakpoint.
				var newBreakpoint = getCurrentBreakpoint();

				// Skip if the breakpoint hasn't changed.
				if (settings.currentBreakpoint && newBreakpoint && settings.currentBreakpoint.name == newBreakpoint.name)
					return;

				// Update current breakpoint.
				settings.currentBreakpoint = newBreakpoint;

				// Determine current style.
				var newStyle = getCurrentStyle();

				// Skip if the style hasn't changed.
				if (settings.currentStyle == newStyle)
					return;

				// Update current style.
				settings.currentStyle = newStyle;

				// Apply current style to all elements.
				applyCurrentStyleToAll();

				// Trigger event.
				$(window).trigger('skel-changeStyle', [newStyle]);

			});

		return $elements;

	};

	/**
	 * Apply "layers" functionality to one or more elements.
	 * @param {object} options Settings.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.layers = function(options) {

		// Settings.
		var settings = $.extend({

			// Current styleset.
			currentStyle: null,

			// Default styleset.
			defaultStyle: 'default',

			// Prefix for generated IDs.
			prefix: 'layers',

			// Onchange callback.
			onchange: null

		}, options);

		// Helper to generate a unique ID.
		var generateID = function() {

			var id = settings.prefix + '-';

			for (var i = 0; i < 6; i++)
				id += Math.floor(Math.random() * 16).toString(16);

			return id;

		};

		// Helper to reset an element.
		var resetElement = function($element, $style) {

			// Remove classes.
			$element
				.removeClass('layers-ignore')
				.removeClass(function(index, className) {
					return className.match(/\\blayers-[^\\s]+/g).join(' ');
				});

			// Remove styles.
			$style
				.removeClass('active')
				.empty();

		};

		// Helper to apply a styleset to an element.
		var applyStyle = function($element, name, $style) {

			// Reset.
			resetElement($element, $style);

			// Skip if this is the default style.
			if (name == settings.defaultStyle)
				return;

			// Add class.
			$element.addClass('layers-ignore layers-' + name);

			// Add styles.
			$style
				.addClass('active')
				.html($element.attr('data-layersrc-' + name));

		};

		// Helper to apply the current styleset to an element.
		var applyCurrentStyle = function($element, $style) {

			applyStyle($element, settings.currentStyle, $style);

		};

		// Helper to apply the current styleset to all elements.
		var applyCurrentStyleToAll = function() {

			$elements.each(function() {

				var $this = $(this),
					$style = $this.children('.layers-style');

				applyCurrentStyle($this, $style);

			});

		};

		// Elements.
		var $elements = this;

		// Initialize elements.
		$elements.each(function() {

			var $this = $(this);

			// Skip if already initialized.
			if ($this.hasClass('layers-init'))
				return;

			// Mark as initialized.
			$this.addClass('layers-init');

			// Generate ID if one isn't set.
			if (!$this.attr('id'))
				$this.attr('id', generateID());

			// Create style element.
			var $style = $('<style class="layers-style" type="text/css"></style>');

			// Insert style element.
			$this.append($style);

			// Apply default style.
			applyStyle($this, settings.defaultStyle, $style);

		});

		// Initialize.
		var init = function(style) {

			// Update current style.
			settings.currentStyle = style || settings.defaultStyle;

			// Apply current style to all elements.
			applyCurrentStyleToAll();

			// Trigger event.
			$(window).trigger('layers-init');

			// Call onchange.
			if (settings.onchange)
				settings.onchange(settings.currentStyle);

		};

		// Reset.
		var reset = function() {

			// Reset elements.
			$elements.each(function() {

				var $this = $(this),
					$style = $this.children('.layers-style');

				resetElement($this, $style);

			});

			// Reset settings.
			settings.currentStyle = null;

			// Trigger event.
			$(window).trigger('layers-reset');

			// Call onchange.
			if (settings.onchange)
				settings.onchange(null);

		};

		// Change style.
		var changeStyle = function(name) {

			// Skip if already in this style.
			if (settings.currentStyle == name)
				return;

			// Update current style.
			settings.currentStyle = name;

			// Apply current style to all elements.
			applyCurrentStyleToAll();

			// Trigger event.
			$(window).trigger('layers-changeStyle', [name]);

			// Call onchange.
			if (settings.onchange)
				settings.onchange(name);

		};

		// Add public methods.
		$elements
			.layersInit = init
			.layersReset = reset
			.layersChangeStyle = changeStyle;

		// Initialize.
		init();

		return $elements;

	};

	/**
	 * Apply "responsive" functionality to one or more elements.
	 * @param {object} options Settings.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.responsive = function(options) {

		// Settings.
		var settings = $.extend({

			// Current styleset.
			currentStyle: null,

			// Default styleset.
			defaultStyle: 'default',

			// Prefix for generated IDs.
			prefix: 'responsive',

			// Onchange callback.
			onchange: null,

			// Breakpoints (name: width).
			breakpoints: {
				'wide': { width: '1920px' },
				'normal': { width: '1200px' },
				'narrow': { width: '980px' },
				'narrower': { width: '736px' },
				'mobile': { width: '480px' }
			},

			// Current viewport size.
			currentViewport: {
				width: null,
				height: null
			}

		}, options);

		// Helper to get the current viewport size.
		var getViewportSize = function() {

			return {
				width: $misc.getViewportWidth(),
				height: $misc.getViewportHeight()
			};

		};

		// Helper to generate a unique ID.
		var generateID = function() {

			var id = settings.prefix + '-';

			for (var i = 0; i < 6; i++)
				id += Math.floor(Math.random() * 16).toString(16);

			return id;

		};

		// Helper to reset an element.
		var resetElement = function($element, $style) {

			// Remove classes.
			$element
				.removeClass('responsive-ignore')
				.removeClass(function(index, className) {
					return className.match(/\\bresponsive-[^\\s]+/g).join(' ');
				});

			// Remove styles.
			$style
				.removeClass('active')
				.empty();

		};

		// Helper to apply a styleset to an element.
		var applyStyle = function($element, name, $style) {

			// Reset.
			resetElement($element, $style);

			// Skip if this is the default style.
			if (name == settings.defaultStyle)
				return;

			// Add class.
			$element.addClass('responsive-ignore responsive-' + name);

			// Add styles.
			$style
				.addClass('active')
				.html($element.attr('data-respsrc-' + name));

		};

		// Helper to apply the current styleset to an element.
		var applyCurrentStyle = function($element, $style) {

			applyStyle($element, settings.currentStyle, $style);

		};

		// Helper to apply the current styleset to all elements.
		var applyCurrentStyleToAll = function() {

			$elements.each(function() {

				var $this = $(this),
					$style = $this.children('.responsive-style');

				applyCurrentStyle($this, $style);

			});

		};

		// Helper to determine the current style.
		var getCurrentStyle = function() {

			var i, bp, lastMatch = null;

			for (i in settings.breakpoints) {

				bp = settings.breakpoints[i];

				if (settings.currentViewport.width <= parseInt(bp.width))
					lastMatch = i;

			}

			return lastMatch || settings.defaultStyle;

		};

		// Elements.
		var $elements = this;

		// Initialize elements.
		$elements.each(function() {

			var $this = $(this);

			// Skip if already initialized.
			if ($this.hasClass('responsive-init'))
				return;

			// Mark as initialized.
			$this.addClass('responsive-init');

			// Generate ID if one isn't set.
			if (!$this.attr('id'))
				$this.attr('id', generateID());

			// Create style element.
			var $style = $('<style class="responsive-style" type="text/css"></style>');

			// Insert style element.
			$this.append($style);

			// Apply default style.
			applyStyle($this, settings.defaultStyle, $style);

		});

		// Initialize.
		var init = function() {

			// Get viewport size.
			settings.currentViewport = getViewportSize();

			// Determine current style.
			settings.currentStyle = getCurrentStyle();

			// Apply current style to all elements.
			applyCurrentStyleToAll();

			// Trigger event.
			$(window).trigger('responsive-init');

			// Call onchange.
			if (settings.onchange)
				settings.onchange(settings.currentStyle);

		};

		// Reset.
		var reset = function() {

			// Reset elements.
			$elements.each(function() {

				var $this = $(this),
					$style = $this.children('.responsive-style');

				resetElement($this, $style);

			});

			// Reset settings.
			settings.currentStyle = null;
			settings.currentViewport = {
				width: null,
				height: null
			};

			// Trigger event.
			$(window).trigger('responsive-reset');

			// Call onchange.
			if (settings.onchange)
				settings.onchange(null);

		};

		// Change style.
		var changeStyle = function(name) {

			// Skip if already in this style.
			if (settings.currentStyle == name)
				return;

			// Update current style.
			settings.currentStyle = name;

			// Apply current style to all elements.
			applyCurrentStyleToAll();

			// Trigger event.
			$(window).trigger('responsive-changeStyle', [name]);

			// Call onchange.
			if (settings.onchange)
				settings.onchange(name);

		};

		// Add public methods.
		$elements
			.responsiveInit = init
			.responsiveReset = reset
			.responsiveChangeStyle = changeStyle;

		// Initialize.
		init();

		// Window.
		$(window)
			.on('resize.responsive orientationchange.responsive', function(event) {

				// Get viewport size.
				var viewportSize = getViewportSize();

				// Skip if the viewport size hasn't changed.
				if (settings.currentViewport.width == viewportSize.width
				&& settings.currentViewport.height == viewportSize.height)
					return;

				// Update current viewport.
				settings.currentViewport = viewportSize;

				// Determine current style.
				var newStyle = getCurrentStyle();

				// Skip if the style hasn't changed.
				if (settings.currentStyle == newStyle)
					return;

				// Update current style.
				settings.currentStyle = newStyle;

				// Apply current style to all elements.
				applyCurrentStyleToAll();

				// Trigger event.
				$(window).trigger('responsive-changeStyle', [newStyle]);

				// Call onchange.
				if (settings.onchange)
					settings.onchange(newStyle);

			});

		return $elements;

	};

	/**
	 * Apply "priority" functionality to one or more elements.
	 * @param {object} options Settings.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.priority = function(options) {

		// Settings.
		var settings = $.extend({

			// Items.
			items: null,

			// Breakpoints (name: max items).
			breakpoints: {
				'wide': { items: 4 },
				'normal': { items: 3 },
				'narrow': { items: 2 },
				'narrower': { items: 1 },
				'mobile': { items: 1 },
				'mobilep': { items: 1 }
			},

			// Current breakpoint.
			currentBreakpoint: null,

			// Current items.
			currentItems: null,

			// Onchange callback.
			onchange: null

		}, options);

		// Helper to determine the current breakpoint.
		var getCurrentBreakpoint = function() {

			var i, bp, lastMatch = null;

			for (i in settings.breakpoints) {

				bp = settings.breakpoints[i];

				if ($misc.getViewportWidth() <= parseInt(bp.range))
					lastMatch = i;

			}

			return lastMatch || 'mobilep';

		};

		// Helper to determine the current max items.
		var getCurrentMaxItems = function() {

			var bp = getCurrentBreakpoint();

			if (bp && settings.breakpoints[bp])
				return settings.breakpoints[bp].items;

			return 1;

		};

		// Elements.
		var $elements = this;

		// Initialize.
		var init = function() {

			// Determine current breakpoint.
			settings.currentBreakpoint = getCurrentBreakpoint();

			// Determine current max items.
			var maxItems = getCurrentMaxItems();

			// Initialize items.
			settings.currentItems = [];

			// Add items.
			if (settings.items && settings.items.length > 0) {

				for (var i = 0; i < Math.min(settings.items.length, maxItems); i++)
					settings.currentItems.push(settings.items[i]);

			}

			// Update elements.
			update();

			// Trigger event.
			$(window).trigger('priority-init');

			// Call onchange.
			if (settings.onchange)
				settings.onchange(settings.currentItems);

		};

		// Reset.
		var reset = function() {

			// Reset items.
			settings.currentItems = null;

			// Reset elements.
			$elements.empty();

			// Trigger event.
			$(window).trigger('priority-reset');

			// Call onchange.
			if (settings.onchange)
				settings.onchange(null);

		};

		// Update elements.
		var update = function() {

			$elements.empty();

			if (settings.currentItems && settings.currentItems.length > 0) {

				for (var i = 0; i < settings.currentItems.length; i++) {

					var $item = $(settings.currentItems[i]);

					// Skip if this is a jQuery object.
					if ($item.jquery)
						$item = $item[0];

					$elements.append($item);

				}

			}

		};

		// Change items.
		var changeItems = function(newItems) {

			// Update items.
			settings.items = newItems;

			// Determine current max items.
			var maxItems = getCurrentMaxItems();

			// Initialize items.
			settings.currentItems = [];

			// Add items.
			if (settings.items && settings.items.length > 0) {

				for (var i = 0; i < Math.min(settings.items.length, maxItems); i++)
					settings.currentItems.push(settings.items[i]);

			}

			// Update elements.
			update();

			// Trigger event.
			$(window).trigger('priority-changeItems', [newItems]);

			// Call onchange.
			if (settings.onchange)
				settings.onchange(settings.currentItems);

		};

		// Add public methods.
		$elements
			.priorityInit = init
			.priorityReset = reset
			.priorityChangeItems = changeItems;

		// Initialize.
		init();

		// Window.
		$(window)
			.on('resize.priority orientationchange.priority', function(event) {

				// Determine current breakpoint.
				var newBreakpoint = getCurrentBreakpoint();

				// Skip if the breakpoint hasn't changed.
				if (settings.currentBreakpoint == newBreakpoint)
					return;

				// Update current breakpoint.
				settings.currentBreakpoint = newBreakpoint;

				// Determine current max items.
				var maxItems = getCurrentMaxItems();

				// Initialize items.
				settings.currentItems = [];

				// Add items.
				if (settings.items && settings.items.length > 0) {

					for (var i = 0; i < Math.min(settings.items.length, maxItems); i++)
						settings.currentItems.push(settings.items[i]);

				}

				// Update elements.
				update();

				// Trigger event.
				$(window).trigger('priority-changeBreakpoint', [newBreakpoint]);

				// Call onchange.
				if (settings.onchange)
					settings.onchange(settings.currentItems);

			});

		return $elements;

	};

	/**
	 * Apply "dropotron" functionality to one or more menus.
	 * @param {object} options Settings.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.dropotron = function(options) {

		// Settings.
		var settings = $.extend({

			// Base z-index.
			baseZIndex: 1000,

			// Speed.
			speed: 300,

			// Alignment (left, center, right).
			alignment: 'center',

			// Offset (horizontal, vertical).
			offset: [0, 0],

			// Detach?
			detach: true,

			// Hide delay.
			hideDelay: 350,

			// No-op blank.
			noOpBlank: false

		}, options);

		// Helper to show a dropdown.
		var showDropdown = function($parent, $dropdown, $trigger) {

			// Skip if already visible.
			if ($dropdown.css('display') == 'block')
				return;

			// Hide all other dropdowns.
			$parent.find('.dropdown').hide();

			// Show this dropdown.
			$dropdown
				.css('display', 'block')
				.css('opacity', '')
				.css('visibility', 'visible');

			// Position this dropdown.
			positionDropdown($parent, $dropdown, $trigger);

			// Focus first link.
			var $firstLink = $dropdown.find('a').first();

			if ($firstLink.length > 0)
				$firstLink[0].focus();

		};

		// Helper to hide a dropdown.
		var hideDropdown = function($dropdown) {

			// Skip if already hidden.
			if ($dropdown.css('display') != 'block')
				return;

			// Hide.
			$dropdown
				.fadeOut(settings.speed, function() {

					// Reset.
					$dropdown
						.css('display', '')
						.css('opacity', '')
						.css('visibility', '');

				});

		};

		// Helper to position a dropdown.
		var positionDropdown = function($parent, $dropdown, $trigger) {

			var parentOffset = $parent.offset(),
				dropdownWidth = $dropdown.outerWidth(),
				triggerWidth = $trigger.outerWidth(),
				triggerOffset = $trigger.offset(),
				triggerPos = triggerOffset.left - parentOffset.left,
				left = 0;

			// Calculate left position.
			switch (settings.alignment) {

				case 'left':
					left = triggerPos;
					break;

				case 'right':
					left = triggerPos + triggerWidth - dropdownWidth;
					break;

				default:
				case 'center':
					left = triggerPos + Math.floor((triggerWidth - dropdownWidth) / 2);
					break;

			}

			// Apply left position.
			$dropdown.css('left', left + settings.offset[0]);

			// Apply top position.
			$dropdown.css('top', $trigger.position().top + $trigger.outerHeight() + settings.offset[1]);

		};

		// Helper to detach a dropdown.
		var detachDropdown = function($dropdown) {

			// Skip if not detached.
			if (!$dropdown.hasClass('detached')) {

				// Detach.
				$dropdown
					.detach()
					.addClass('detached')
					.appendTo($('body'));

				// Reposition.
				var $parent = $dropdown.data('parent'),
					$trigger = $dropdown.data('trigger');

				positionDropdown($parent, $dropdown, $trigger);

			}

		};

		// Helper to reattach a dropdown.
		var reattachDropdown = function($dropdown) {

			// Skip if not detached.
			if ($dropdown.hasClass('detached')) {

				// Reattach.
				$dropdown
					.removeClass('detached')
					.appendTo($dropdown.data('parent'));

			}

		};

		// Helper to handle hover events.
		var handleHover = function($parent, $dropdown, $trigger) {

			// Show on hover.
			$trigger.on('mouseenter.dropotron', function(event) {

				// Skip if we're already inside the dropdown.
				if ($dropdown.has(event.relatedTarget).length > 0)
					return;

				// Show dropdown.
				showDropdown($parent, $dropdown, $trigger);

				// Detach dropdown.
				if (settings.detach)
					detachDropdown($dropdown);

			});

			// Hide on mouse leave.
			$parent.on('mouseleave.dropotron', function(event) {

				// Skip if we're moving to the dropdown.
				if ($dropdown.has(event.relatedTarget).length > 0)
					return;

				// Hide dropdown.
				hideDropdown($dropdown);

				// Reattach dropdown.
				if (settings.detach)
					reattachDropdown($dropdown);

			});

			// Hide on dropdown mouse leave.
			$dropdown.on('mouseleave.dropotron', function(event) {

				// Skip if we're moving to the parent.
				if ($parent.has(event.relatedTarget).length > 0)
					return;

				// Hide dropdown.
				hideDropdown($dropdown);

				// Reattach dropdown.
				if (settings.detach)
					reattachDropdown($dropdown);

			});

		};

		// Helper to handle click events.
		var handleClick = function($parent, $dropdown, $trigger) {

			// Toggle on click.
			$trigger.on('click.dropotron', function(event) {

				// Skip if we're already inside the dropdown.
				if ($dropdown.has(event.target).length > 0)
					return;

				// Prevent default.
				event.preventDefault();

				// Toggle dropdown.
				if ($dropdown.css('display') == 'block') {

					// Hide dropdown.
					hideDropdown($dropdown);

					// Reattach dropdown.
					if (settings.detach)
						reattachDropdown($dropdown);

				}
				else {

					// Show dropdown.
					showDropdown($parent, $dropdown, $trigger);

					// Detach dropdown.
					if (settings.detach)
						detachDropdown($dropdown);

				}

			});

			// Hide on body click.
			$(document).on('click.dropotron', function(event) {

				// Skip if the click is inside the dropdown or the parent.
				if ($dropdown.has(event.target).length > 0 || $parent.has(event.target).length > 0)
					return;

				// Hide dropdown.
				hideDropdown($dropdown);

				// Reattach dropdown.
				if (settings.detach)
					reattachDropdown($dropdown);

			});

		};

		// Helper to handle keyboard events.
		var handleKeyboard = function($parent, $dropdown, $trigger) {

			// Hide on escape.
			$(document).on('keydown.dropotron', function(event) {

				// Skip if the dropdown isn't visible.
				if ($dropdown.css('display') != 'block')
					return;

				// Skip if the escape key wasn't pressed.
				if (event.keyCode != 27)
					return;

				// Prevent default.
				event.preventDefault();

				// Hide dropdown.
				hideDropdown($dropdown);

				// Reattach dropdown.
				if (settings.detach)
					reattachDropdown($dropdown);

				// Focus trigger.
				$trigger.focus();

			});

		};

		// Menus.
		var $menus = this;

		// Initialize menus.
		$menus.each(function() {

			var $this = $(this);

			// Skip if already initialized.
			if ($this.hasClass('dropotron-init'))
				return;

			// Mark as initialized.
			$this.addClass('dropotron-init');

			// Find all dropdowns.
			$this.find('> li > .dropdown').each(function() {

				var $this = $(this),
					$parent = $this.parent(),
					$trigger = $parent.find('> a, > span').first();

				// Skip if no trigger.
				if ($trigger.length == 0)
					return;

				// Store data.
				$this
					.data('parent', $this.parent())
					.data('trigger', $trigger);

				// Set z-index.
				$this.css('z-index', settings.baseZIndex);

				// Hide.
				$this.hide();

				// Handle hover events.
				handleHover($parent, $this, $trigger);

				// Handle click events.
				handleClick($parent, $this, $trigger);

				// Handle keyboard events.
				handleKeyboard($parent, $this, $trigger);

				// Increment base z-index.
				settings.baseZIndex++;

			});

		});

		// Reset.
		var reset = function() {

			// Hide all dropdowns.
			$menus.find('.dropdown').hide();

			// Reattach all dropdowns.
			$menus.find('.dropdown.detached').each(function() {

				var $this = $(this);

				// Reattach.
				$this
					.removeClass('detached')
					.appendTo($this.data('parent'));

			});

		};

		// Add public methods.
		$menus
			.dropotronReset = reset;

		return $menus;

	};

	/**
	 * Apply "selectnav" functionality to one or more selects.
	 * @param {object} options Settings.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.selectnav = function(options) {

		// Settings.
		var settings = $.extend({

			// Nav class.
			navClass: 'selectnav',

			// Active class.
			activeClass: 'active',

			// Label.
			label: 'Select a page ...'

		}, options);

		// Selects.
		var $selects = this;

		// Initialize selects.
		$selects.each(function() {

			var $this = $(this);

			// Skip if already initialized.
			if ($this.hasClass('selectnav-init'))
				return;

			// Mark as initialized.
			$this.addClass('selectnav-init');

			// Create nav.
			var $nav = $('<nav class="' + settings.navClass + '"></nav>'),
				$list = $('<ul></ul>');

			// Add options.
			$this.find('option').each(function() {

				var $this = $(this),
					value = $this.attr('value'),
					text = $this.text();

				// Skip if no value.
				if (!value)
					return;

				// Add list item.
				$list.append('<li><a href="#' + value + '">' + text + '</a></li>');

			});

			// Add list to nav.
			$nav.append($list);

			// Insert nav.
			$this.after($nav);

			// Hide select.
			$this.hide();

			// Handle click events.
			$nav.on('click.selectnav', 'a', function(event) {

				// Prevent default.
				event.preventDefault();

				// Get href.
				var href = $(this).attr('href');

				// Skip if no href.
				if (!href)
					return;

				// Get value.
				var value = href.substring(1);

				// Set select value.
				$this.val(value);

				// Trigger change.
				$this.trigger('change');

				// Update active class.
				$nav.find('a').removeClass(settings.activeClass);
				$(this).addClass(settings.activeClass);

			});

			// Update active class.
			$nav.find('a[href="#' + $this.val() + '"]').addClass(settings.activeClass);

		});

		// Reset.
		var reset = function() {

			// Show all selects.
			$selects.show();

			// Remove all navs.
			$selects.next('nav.' + settings.navClass).remove();

		};

		// Add public methods.
		$selects
			.selectnavReset = reset;

		return $selects;

	};

	/**
	 * Apply "scrollTo" functionality to one or more elements.
	 * @param {object} options Settings.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.scrollTo = function(options) {

		// Settings.
		var settings = $.extend({

			// Speed.
			speed: 1000,

			// Easing.
			easing: 'swing',

			// Offset.
			offset: 0,

			// Onstart callback.
			onstart: null,

			// Oncomplete callback.
			oncomplete: null

		}, options);

		// Elements.
		var $elements = this;

		// Scroll to element.
		var scrollTo = function($target, options) {

			// Settings.
			var options = $.extend({

				speed: settings.speed,
				easing: settings.easing,
				offset: settings.offset,
				onstart: settings.onstart,
				oncomplete: settings.oncomplete

			}, options);

			// Target position.
			var pos = $target.offset().top - options.offset;

			// Scroll.
			$('html,body').animate({

				scrollTop: pos

			}, options.speed, options.easing, function() {

				// Call oncomplete.
				if (options.oncomplete)
					options.oncomplete($target);

			});

		};

		// Initialize elements.
		$elements.each(function() {

			var $this = $(this);

			// Skip if already initialized.
			if ($this.hasClass('scrollTo-init'))
				return;

			// Mark as initialized.
			$this.addClass('scrollTo-init');

			// Handle click events.
			$this.on('click.scrollTo', function(event) {

				// Prevent default.
				event.preventDefault();

				// Get href.
				var href = $this.attr('href');

				// Skip if no href.
				if (!href)
					return;

				// Get target.
				var $target = $(href);

				// Skip if no target.
				if ($target.length == 0)
					return;

				// Call onstart.
				if (settings.onstart)
					settings.onstart($this, $target);

				// Scroll to target.
				scrollTo($target);

			});

		});

		// Add public methods.
		$elements
			.scrollToScroll = scrollTo;

		return $elements;

	};

	/**
	 * Apply "scrolly" functionality to one or more elements.
	 * @param {object} options Settings.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.scrolly = function(options) {

		// Settings.
		var settings = $.extend({

			// Speed.
			speed: 1000,

			// Easing.
			easing: 'swing',

			// Offset.
			offset: 0,

			// Parent selector.
			parent: null,

			// Poll once?
			pollOnce: false,

			// Onstart callback.
			onstart: null,

			// Onscroll callback.
			onscroll: null,

			// Onstop callback.
			onstop: null

		}, options);

		// Elements.
		var $elements = this;

		// Initialize elements.
		$elements.each(function() {

			var $this = $(this);

			// Skip if already initialized.
			if ($this.hasClass('scrolly-init'))
				return;

			// Mark as initialized.
			$this.addClass('scrolly-init');

			// Parent.
			var $parent = (settings.parent ? $this.parents(settings.parent).first() : $this.parent());

			// Deactivate.
			var deactivate = function() {

				// Remove active class.
				$this.removeClass('active');

				// Call onstop.
				if (settings.onstop)
					settings.onstop($this);

			};

			// Activate.
			var activate = function() {

				// Add active class.
				$this.addClass('active');

				// Call onstart.
				if (settings.onstart)
					settings.onstart($this);

			};

			// Scroll to element.
			var scrollTo = function(speed, easing, offset, callback) {

				// Settings.
				var speed = speed || settings.speed,
					easing = easing || settings.easing,
					offset = offset || settings.offset,
					callback = callback || null;

				// Target position.
				var pos = $this.offset().top - offset;

				// Scroll.
				$parent.animate({

					scrollTop: pos

				}, speed, easing, function() {

					// Activate.
					activate();

					// Call callback.
					if (callback)
						callback($this);

				});

			};

			// Handle click events.
			$this.on('click.scrolly', function(event) {

				// Prevent default.
				event.preventDefault();

				// Deactivate all.
				$parent.find('.scrolly').each(function() {

					var $this = $(this);

					// Skip if not initialized.
					if (!$this.hasClass('scrolly-init'))
						return;

					// Deactivate.
					deactivate.call($this);

				});

				// Scroll to element.
				scrollTo();

			});

			// Poll.
			var poll = function() {

				// Get viewport position.
				var viewportTop = $parent.scrollTop(),
					viewportBottom = viewportTop + $parent.height();

				// Get element position.
				var elementTop = $this.offset().top - $parent.offset().top,
					elementBottom = elementTop + $this.height();

				// Check if element is in viewport.
				var inViewport = (elementBottom > viewportTop && elementTop < viewportBottom);

				// Activate/deactivate.
				if (inViewport)
					activate();
				else
					deactivate();

				// Call onscroll.
				if (settings.onscroll)
					settings.onscroll($this, inViewport);

			};

			// Poll once.
			if (settings.pollOnce)
				poll();

			// Poll on scroll.
			else
				$parent.on('scroll.scrolly', poll);

			// Poll now.
			poll();

		});

		// Reset.
		var reset = function() {

			// Deactivate all.
			$elements.each(function() {

				var $this = $(this);

				// Skip if not initialized.
				if (!$this.hasClass('scrolly-init'))
					return;

				// Deactivate.
				deactivate.call($this);

			});

			// Unbind scroll event.
			$elements
				.unbind('scroll.scrolly')
				.parent()
				.unbind('scroll.scrolly');

		};

		// Add public methods.
		$elements
			.scrollyScroll = scrollTo
			.scrollyReset = reset;

		return $elements;

	};

	/**
	 * Copyright year.
	 * @param {integer} startYear Start year.
	 * @return {string} Copyright year string.
	 */
	$.copyrightYear = function(startYear) {

		var currentYear = new Date().getFullYear();

		if (startYear == currentYear)
			return startYear;

		return startYear + ' - ' + currentYear;

	};

	/**
	 * Initialize the page.
	 */
	$.prioritize = function() {

		// Variables.
		var $window = $(window),
				$body = $('body'),
				$main = $('#main');

		// Breakpoints.
			breakpoints({

				xlarge: [ '1281px', '1680px' ],
				large: [ '981px', '1280px' ],
				medium: [ '737px', '980px' ],
				small: [ '481px', '736px' ],
				xsmall: [ null, '480px' ]

			});

		// Play initial animations on page load.
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Enable IE workarounds.
			if (skel.vars.IEVersion < 12)
				$body.addClass('is-ie');

		// Fix: Object fit images.
			if (!skel.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img'),
						position = $this.data('position');

					// Set image.
						$img.css('object-fit', position);

				});

			}

		// Prioritize #main content on mobile.
			// skel.on('+mobile -mobile', function() {
			// 	$main.priority({
			// 		items: [
			// 			'.article',
			// 			'.sidebar'
			// 		],
			// 		breakpoints: {
			// 			'mobile': { items: 1 }
			// 		}
			// 	});
			// });

		// Items.
			var $items = $('.item');

			if ($items.length > 0) {

				// Scrolly.
				$items.scrolly({
					speed: 1500,
					offset: 50
				});

				// In view.
				$items.on('scroll.scrolly', function() {

					var $this = $(this);

					// No longer in view? Deactivate.
					if ($this.hasClass('active')) {

						var viewportTop = $window.scrollTop(),
							viewportBottom = viewportTop + $window.height(),
							elementTop = $this.offset().top,
							elementBottom = elementTop + $this.height();

						if (elementBottom <= viewportTop || elementTop >= viewportBottom)
							$this.removeClass('active');

					}

				});

			}

		// Offset anchors.
			$main.find('a[href^="#"]').each(function() {

				var $this = $(this),
					href = $this.attr('href');

				if (href == '#')
					return;

				$this.scrollTo({
					offset: -100
				});

			});

		// Header.
			var $header = $('#header');

			if ($header.length > 0) {

				// Parallax header.
					$header.on('mousemove', function(event) {

						var $this = $(this),
							x = event.clientX,
							y = event.clientY,
							width = $this.width(),
							height = $this.height(),
							bg = $this.css('background-image');

						if (bg.indexOf('url(') >= 0) {

							var posX = (x / width) * 100,
								posY = (y / height) * 100;

							$this.css('background-position', posX + '% ' + posY + '%');

						}

					});

				// Fix header on mobile.
					if (skel.vars.mobile) {

						$header.addClass('alt');

						// Header title.
							var $headerTitle = $header.find('h1');

							if ($headerTitle.length > 0) {

								$headerTitle.addClass('visible');

								$headerTitle.on('click', function() {
									window.location.href = '#';
								});

							}

						// Header nav.
							var $headerNav = $header.find('nav');

							if ($headerNav.length > 0) {

								// Add select.
								var $select = $('<select></select>');

								// Add options.
								$headerNav.find('a').each(function() {

									var $this = $(this),
										text = $this.text(),
										href = $this.attr('href');

									$select.append('<option value="' + href + '">' + text + '</option>');

								});

								// Insert select.
								$headerNav.append($select);

								// Handle change event.
								$select.on('change', function() {

									window.location.href = $(this).val();

								});

							}

					}

			}

		// Main sections.
			$main.children('.row').each(function() {

				var $this = $(this),
					$articles = $this.children('.col-12').first().children('.article'),
					$sidebar = $this.children('.col-12').last().children('.sidebar');

				if ($articles.length > 0 && $sidebar.length > 0) {

					// Move sidebar to the end on mobile.
					if (skel.vars.mobile) {

						$sidebar.insertAfter($articles);

						// Reset on non-mobile.
						$window.on('resize.prioritize', function() {

							if (!skel.vars.mobile)
								$sidebar.insertBefore($articles);

						});

					}

					else {

						// Reset on mobile.
						$window.on('resize.prioritize', function() {

							if (skel.vars.mobile)
								$sidebar.insertAfter($articles);

						});

					}

				}

			});

	};

	// Initialize.
		$(function() {

			// Prioritize.
			$.prioritize();

		});

})(jQuery);
