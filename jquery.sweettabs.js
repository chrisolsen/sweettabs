/**
 * SweetTabs
 * Copyright (c) 2011 Chris Olsen [olsen.chris@gmail.com]
 * 
 * Licensed under the MIT license.
 * 
 * ex.
 * <div id="myTabs">
 *   <ul>
 *     <li><a href="#" rel="static-content">Some static content"</a></li>
 *     <li><a href="some/url" rel="dynamic-content">Some dynamic content"</a></li>
 *   </ul>
 *   <div id="static-content">This is the pre-existing data</div>
 *   <!-- note there is no empty div for the dynamic content -->
 * </div>
 * 
 * <script type="text/javascript">
 *   $("#myTabs").sweetTabs();
 * </script>
 */

(function($) {
  $.fn.sweetTabs = function(options) {
    return this.each(function() {
      var self = $(this);
      var sections = [];
      options = $.extend({
        autoBind: true // setting to false will not autobind the link to the ajax request
      }, options);

      // set first tab as the active one
      self.find('> ul > li:first').addClass('active');

      // setup static links
      $.each(self.find('a[href^=#]'), function(index, link) {
        // setup container for linked data for ajax links
        var div = $('#' + this.rel);
        div
          .attr('id', link.rel)
          .attr('data-tab', link.rel)
          .css('display: none')
        sections.push(div[0]);
      });

      // setup ajax links
      $.each(self.find('a[data-remote=true]'), function(index, link) {
        // create container for linked data for ajax links
        var div = $('<div>', {
          id: link.rel, 
          "data-tab": link.rel,
          "style": "display:none"
        });
        div.appendTo(self);
        sections.push(div[0]);

        // bind to ajax links
        if (options.autoBind)
          $(link).bind("ajax:success", function(xhr, data, status) {
            div.html(data);
          });
      });

      // bind click events for tabs
      $.each(self.find('> ul > li > a'), function() {
        $(this).click(function(e) {
          var tabName = $(this).attr("rel");
          var content = $('#' + this.rel).html();

          // hide all tab sections except the clicked tab
          $.each(sections, function(index, section) {
            section = $(section);
            if (section.data('tab') == tabName)
              section.fadeIn();
            else
              section.hide();
          });

          // set active class
          self.find('li.active').removeClass('active');
          $(this).parent().addClass('active');

          // prevent ajax request from being made if content already exists
          if (content != null && content != '')
            return false;
        });
      });

    }); // plugin method
  }; // sweetTabs()

})(jQuery);
