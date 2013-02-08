jquery-stickto
==============

jQuery plugin for fixing elements to other elements on scroll, while that element is in view.

See [a melding of examples](http://joenoodles.com/widgets/stickto/ "examples") I used to test the plugin.


Usage
-----

### Options

- *target*

  CSS Selector pointing to element to which this element will stick.

- *alignWith*
  
  Pass a CSS selector to use as a horizontal reference point for aligning this element. If none is given, defaults to aligning with respect to target. Good alternatives are aligning to 'body', or even composing "stuck" elements. Examples of this are given on the demo page.

- *margin*
  
  Specify the top, right, bottom, and left margins for the element, with respect to the screen top and bottom, and the target specified for horizontal alignment. Margins can be passed as an object with properties 'top', 'right', 'bottom', and 'left', or, more conveniently, using any valid CSS shorthand, minus the unit part. So for example to set top-bottom margins to 10 and left-right margins to 20, pass {'margin' : "10 20"}. Uses pixel values. Default value is 10px margins all around.

- *align*
  
  Horizontal alignment relative to alignWith element. Options are `outside-left`, `inside-left`, `center`, `inside-right`, 'outside-right'. Defaults to 'outside-right'. See demo page for examples of all of these.

- *valign*
  
  Vertical alignment relative to top / bottom of page. Permitted values are `top` and `bottom`. Default is `top`.

- *scrollIn*
  
  Function to call when element becomes fixed. The `*this*` context is the jQuery-selected sticky element.

- *scrollOut*
  
  Function to call when element ceases to be fixed. The `*this*` context is the jQuery-selected sticky element.

- *onScroll*
  
  Function to call whenever a scroll event occurs and the element is fixed. The `*this*` context is the jQuery-selected sticky element. Passes two parameters, first is the decimal value [0-1] revealing how far the user has scrolled through the active scroll area. Second argument is the elements jQuery data object for stickTo, which will contain all of the configuration parameters you've passed, as well as the calculated scroll target boundaries (in the data.range object). See demos / source for details.

- *meta*
  
  Pass something here if you want to store any of your own data in the `stickTo` namespace. This data will be accessible in data.meta of the onScroll callback, which might be useful to some.

### Methods

- *init*
  
  `$(element).stickTo('init', { /* options */ });`

  Initialize the sticky element. There are other valid ways to call 'init':
  
  `$(element).stickTo('init', target);`      // Target is CSS selector
  
  `$(element).stickTo({ options });`

  You'll get an error message if target is not specified, either in the options object or directly as the second argument.
  
- *touch*

  `$(element).stickTo('touch');`
  
  Refreshes bounds on ALL sticky elements and repositions them appropriately. This method is called whenever the page is resized to keep everything looking decent. You should be sure to call it if anything in the page resizes and affects the flow layout (e.g., after executing AJAX calls and putting new data on the page). Even though the sticky elements are not positioned with respect to the flow layout, the elements they stick to usually are.

- *updateBounds*

  `$(element).stickTo('updateBounds');`

  Update the scroll targets for ALL sticky elements (not just selected one). the 'touch' method uses this to recalculate bounds before it redraws sticky elements. This method does NOT redraw sticky elements.

- *remove*

  `$(element).remove();`

  Makes the element unsticky. Returns element to the position where stickTo found it (inside the DOM) and returns to it its initial styles.
  
  
  
