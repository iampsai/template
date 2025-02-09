$(function () {
  let fNames = [
    "0020.html",
    "0030.html",
    "0040.html",
    "0050.html",
    "0060.html",
    "end.html",
  ];

  loadFiles_obj.nAll = fNames.length;
  loadFiles_obj.loadFiles(fNames, function () {
    //all HTMLs loaded

    setTimeout(() => {
      initBulkStyles();
      Course.init();
    }, 100);

    if (scormAPI.api == null) {
      (window.setQuizAnswer = function (a, b, c, d) { console.log("setQuizAnswer", a, b, c, d); });
      (window.setScore = function (a) { console.log("setScore", a); });
      (window.setLessonLocation = function (a) { console.log("setLessonLocation", a); });
      (window.setCompletionStatus = function (a) { console.log("setCompletionStatus", a); });
    }
  });
});

$(window).on('load', function () {
  setTimeout(function () {
    // slider();
  }, 1000)
})

var Course = {
  oState: {
    quizScore: 0,
  },
  tipsInit: false,
  accordionInit: false,

  passRate: 80,

  //
  init: function () {
    // Add page id, page class to content div
    $(".course section.holder > .content").each(function (id) {
      $(this).attr("id", "page-" + (id + 1));
      $(this).addClass("page-" + (id + 1));
    });

    // Handles input and button
    for (let i = 0; i < 99; i++) {
      $("#page-" + i + " .bot-section input").change(function () {
        if ($("#page-" + i + " input").is(":checked")) {
          $("#page-" + i + " .bot-section button.btn-next").removeClass("disabled");
        } else {
          $("#page-" + i + " .bot-section button.btn-next").addClass("disabled");
        }
      });

      // Add lesson count
      $(".course section.holder").find('lessonTracker').each(function (n) {
        $(this).html(n + 1);
        console.log(this);
      })

      let btnNext = $("#page-" + i + " .bot-section button.btn-next")[0];
      let btnPrev = $("#page-" + i + " .bot-section button.btn-prev")[0];

      // Next Page
      $(btnNext).click(function () {
        Course.goPage(i + 1);
      });

      // Previous Page
      $(btnPrev).click(function () {
        Course.goPage(i - 1);
      });
    }

    // Clear cookies on reload if in development
    if (Course.dev) {
      for (let i = 1; i < 99; i++) {
        if (Course.oState["pageCookie" + i] != 0) {
          OCookies.clearCookies(i);
        }
      }
    }
    $(".loader-container").addClass("d-none");
    Course.goPage(1);
  },

  /**
   * @param {number} nPage - page number
   */
  goPage: function (nPage) {
    // Hide all pages except current page
    let i,
      count = $("section.holder > div").length;

    for (i = 1; i <= count; i++) {
      if (i != nPage) {
        $("#page-" + i)
          .removeClass("active")
          .css({
            display: "none",
            opacity: "0",
          });
        var scroll = ".lesson__content_wrapper";
        $(scroll).scrollTop(0);
      }
    }

    // Show current
    $("#page-" + nPage)
      .addClass("active")
      .css("display", "block")
      .animate({ opacity: "1" }, "slow");

    // // Set active nav

    switch (nPage) {
      case 0:
        break;
      case 1:
        // Exam.next(0);
        // Course.slider();
        break;
      case 2:
        break;
      case 3:
        Course.accordion(3, true);
        break;
      case 4:
        Course.enaBotNextButton(4, false);

        $(window).resize();
        $(".tips-slider").css("opacity", "0");
        Course.slider(4);

        setTimeout(function () {
          $(".tips-slider").css("opacity", "1");
        }, 1000);
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        dragAndDrop();
        break;
      case 9:
        Exam.next(0);
        break;
      case 10:
        break;
    }
  },

  /** Global Functions */
  enaBotNextButton: function (nPage, mode) {
    let btn = $("#page-" + nPage + " .bot-section button.btn-next");
    let inp = $("#page-" + nPage + " .bot-section input");

    if (mode === true || inp.is(":checked")) {
      btn.removeClass("disabled");
    } else {
      btn.addClass("disabled");
    }
  },

  enaBotPrevButton: function (nPage, mode) {
    let btn = $("#page-" + nPage + " .bot-section button.btn-prev");

    if (mode === false) {
      btn.addClass("disabled");
    } else {
      btn.removeClass("disabled");
    }
  },

  enaBotResultButton: function (nPage, mode) {
    let btn = $("#page-" + nPage + " .bot-section button.btn-result");

    if (mode === true) {
      btn.removeClass("disabled");
    } else {
      btn.addClass("disabled");
    }
  },

  enaExamNextButton: function (nPage, mode) {
    let btn = $("#page-" + nPage + " .bot-section button.btn-exam-next");

    if (mode === true) {
      btn.removeClass("disabled");
    } else {
      btn.addClass("disabled");
    }
  },

  enaBotButtons: function (nPage, mode) {
    let btn = $("#page-" + nPage + " .bot-section button");

    if (mode === false) {
      btn.addClass("disabled");
    } else {
      btn.removeClass("disabled");
    }
  },

  showBotButtons: function (nPage, mode) {
    let btn = $("#page-" + nPage + " .bot-section button");

    if (mode === false) {
      btn.hide();
    } else {
      if ($(btn[0]).is(":visible")) return;
      btn.fadeIn(500);
    }
  },

  /** Custom slider function */
  slider: function (nPage) {
    let viewed_slides = 0;
    let slideCount = 0;
    let slideProgress = 0;

    if (!Course["page" + nPage + "TipsInit"] || Course["page" + nPage + "TipsInit"] === "undefined") {
      Course["page" + nPage + "TipsInit"] = true;
      console.log("Course.page" + nPage + "TipsInit", Course["page" + nPage + "TipsInit"]);

      viewed_slides = 1;

      $(".tips-slider").slick({
        dots: true,
        arrows: true,
        infinite: false,
        slidesToScroll: 1,
        speed: 600,
        cssEase: 'ease',
        easing: 'linear',
        appendDots: '.process-card__inner',
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              arrows: false
            }
          }
        ]
      }).on('afterChange', function (event, slick, currentSlide) {
        let curr_slide = currentSlide;
        let slideBitValues = [];

        slideCount = slick.slideCount;

        /** Calculate slide progress */
        let n = 0, i;
        for (i = 0; i <= slideCount; i++) {
          slideBitValues.push(Math.pow(2, i));

          if (curr_slide >= 0 && curr_slide < slideBitValues.length) {
            viewed_slides |= slideBitValues[curr_slide];
          }

          if ((viewed_slides >> i) & 1) n++;
        }

        slideProgress = (n / slideCount) * 100;
        console.log(n, "progress:", slideProgress, slideBitValues, curr_slide);

        if (n === slideCount) {
          Course.enaBotNextButton(nPage, true);
        }
      });
    }

    $(".tips-slider").slick("slickGoTo", 0);
  },

  /**
   * @param {number} nPage
   * @param {bool} buttonState
   * Custom function for accordion 
   */
  accordion: function (nPage, buttonState) {
    let accordion = $("#page-" + nPage + " .accordion");
    let accordionLength = accordion.children(".accordion-item").length;
    let childEl = accordion.children();

    if (!accordion.data('active')) {
      accordion.data('active', true);

      let viewed_accordion = 0;

      if (buttonState) {
        Course.enaBotNextButton(nPage, false);
      }

      // Check if first accordion panel is already opened
      if (childEl.eq(0).children('.show').length > 0) {
        let panel = childEl.children('.show')[0].id

        $("#" + panel).data('count', 1);
        viewed_accordion = 1;
        console.log("Viewed panel:", viewed_accordion, "out of", accordionLength);
      }

      // Count the viewed_accordion
      accordion.on("show.bs.collapse", function (event) {
        let panel = event.target.id;

        if (!$("#" + panel).data('count')) {
          $("#" + panel).data('count', 1);
          viewed_accordion++;
        }

        if (buttonState && viewed_accordion === accordionLength) {
          Course.enaBotNextButton(nPage, true);
        }
        console.log("Viewed panel:", viewed_accordion, "out of", accordionLength);
      });
    }
  }
};