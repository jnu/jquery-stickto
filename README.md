jquery-stickto
==============

jQuery plugin for fixing elements to other elements on scroll, while that element is in view.

See [a melding of examples](http://joenoodles.com/widgets/stickto/ "examples") I used to test the plugin. The source of this demo is available in `index.html` in this repo, and also on the website itself (obviously).

Overview
--------

This plugin simplifies and enhances the design of consolidated webpages where multiple "screens" are contained within a single page. The plugin allows for certain elements on a page to bind to specific regions, fixing their positions on the background until the user has scrolled all the way through this region.

This plugin is particularly valuable in text-heavy websites that seek to engage their audience more fully by displaying content-specific details, images, videos, animations, etc., as the user is reading about them. The concept is a natural extension of and improvement upon illustrations in books. (And who doesn't love picture books?)

Additionally, since this plugin allows for the definition of element-specific scroll handlers that will fire only when the element is fixed to the background (i.e., it is foregrounded; it is 'active'), this plugin can be used in the development of parallactic (three-dimensional) scroll effects.

The development of this plugin was inspired by the stunning visual presentation of the New York Times' [Snow Fall: The Avalanche at Tunnel Creek](http://www.nytimes.com/projects/2012/snow-fall/#/?part=tunnel-creek) (John Branch). Another inspiration was the [CasperJS API Documentation](http://casperjs.org/api.html). After failing to find a suitable general and configurable plugin that replecates this effect, I decided to write this one.

Usage
-----

### Options

- _target_

  CSS Selector pointing to element to which this element will stick.

- _alignWith_
  
  Pass a CSS selector to use as a horizontal reference point for aligning this element. If none is given, defaults to aligning with respect to target. Good alternatives are aligning to 'body', or even composing "stuck" elements. Examples of this are given on the demo page.

- _margin_
  
  Specify the top, right, bottom, and left margins for the element, with respect to the screen top and bottom, and the target specified for horizontal alignment. Margins can be passed as an object with properties `top`, `right`, `bottom`, and `left`, or, more conveniently, using any valid CSS shorthand, minus the unit part. So for example to set top-bottom margins to 10 and left-right margins to 20, pass {'margin' : "10 20"}. Uses pixel values. Default value is 10px margins all around.

- _align_
  
  Horizontal alignment relative to alignWith element. Options are `outside-left`, `inside-left`, `center`, `inside-right`, 'outside-right'. Defaults to 'outside-right'. See demo page for examples of all of these.

- _valign_
  
  Vertical alignment relative to top / bottom of page. Permitted values are `top` and `bottom`. Default is `top`.

- _scrollIn_
  
  Function to call when element becomes fixed. The `this` context is the jQuery-selected sticky element.

- _scrollOut_
  
  Function to call when element ceases to be fixed. The `this` context is the jQuery-selected sticky element.

- _onScroll_
  
  Function to call whenever a scroll event occurs and the element is fixed. The `this` context is the jQuery-selected sticky element. Passes two parameters, first is the decimal value [0-1] revealing how far the user has scrolled through the active scroll area. Second argument is the elements jQuery data object for `stickTo`, which will contain all of the configuration parameters you've passed, as well as the calculated scroll target boundaries (in the data.range object). See demos / source for details.

- _meta_
  
  Pass something here if you want to store any of your own data in the `stickTo` namespace. This data will be accessible in data.meta of the onScroll callback, which might be useful to some.

### Methods

- _init_
  
  `$(element).stickTo('init', { /* options */ });`

  Initialize the sticky element. There are other valid ways to call 'init':
  
  `$(element).stickTo('init', target);`      // Target is CSS selector in a string
  
  `$(element).stickTo({ options });`

  You'll get an error message if target is not specified, either in the options object or directly as the second argument.
  
- _touch_

  `$(element).stickTo('touch');`
  
  Refreshes bounds on ALL sticky elements and repositions them appropriately. This method is called whenever the page is resized to keep everything looking decent. You should be sure to call it if anything in the page resizes and affects the flow layout (e.g., after executing AJAX calls and putting new data on the page). Even though the sticky elements are not positioned with respect to the flow layout, the elements they stick to usually are.

- _updateBounds_

  `$(element).stickTo('updateBounds');`

  Update the scroll targets for ALL sticky elements (not just selected one). the 'touch' method uses this to recalculate bounds before it redraws sticky elements. This method does NOT redraw sticky elements.

- _remove_

  `$(element).stickTo('remove');`

  Makes the element unsticky. Returns element to the position where stickTo found it (inside the DOM) and returns to it its initial styles.
  
 
Author
------
Written in February 2013 by myself, Joe Nudell.
Freely distributable under the MIT License. 

None of the images used in the examples are mine; I found them on Google or Reddit. 
  
