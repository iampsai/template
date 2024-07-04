function accordionOne() {
  jQuery(document).ready(function () {
    var accordionItems = jQuery("#accordionRisk .accordion-item");
    function resetAccordion() {
      accordionItems.each(function () {
        var accordionItem = jQuery(this);
        var accordionButton = accordionItem.find(".accordion-button");
        var collapseElement = accordionItem.find(".collapse");
        accordionButton.addClass("collapsed");
        collapseElement.removeClass("show");
        accordionItem.removeClass("opened");
        openedCount = 0;
      });
    }
    resetAccordion();
    checkAccordionStatus();

    accordionItems.on("show.bs.collapse", function (e) {
      var collapseItem = $(this);
      if (!collapseItem.hasClass("opened")) {
        collapseItem.addClass("opened");
        openedCount++;
        checkAccordionStatus();
      } else if (collapseItem.hasClass("opened")) {
        checkAccordionStatus();
      }
    });

    function checkAccordionStatus() {
      if (openedCount === accordionItems.length) {
        Course.enaBotNextButton(3, true);
      } else {
        Course.enaBotNextButton(3, false);
      }
    }
  });
}
