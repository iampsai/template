$(function () {
  let fNames = [
    "0020.html",
    "0030.html",
    "0040.html",
    "0050.html",
    "0060.html",
    "end.html",
  ];

  typeof window.quizAnswer === "undefined" && (window.quizAnswer = function (a, b) { console.log("_quizAnswer", a, b); });

  loadFiles_obj.nAll = fNames.length;
  loadFiles_obj.loadFiles(fNames, function () {
    //all HTMLs loaded

    setTimeout(() => {
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
  oState: {},
  tipsInit: false,

  //
  init: function () {
    // Add page id, page class to content div
    $(".course section.holder > .content").each(function (id) {
      $(this).attr("id", "page-" + (id + 1));
      $(this).addClass("page-" + (id + 1));
    });

    // Handles input and button
    for (let i = 0; i < 99; i++) {
      $(
        $("#page-" + i + " .bot-section input").change(function () {
          if ($("#page-" + i + " input").is(":checked")) {
            $("#page-" + i + " .bot-section button.btn-next").removeClass(
              "disabled"
            );
          } else {
            $("#page-" + i + " .bot-section button.btn-next").addClass(
              "disabled"
            );
          }
        })
      );

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
        break;
      case 2:
        break;
      case 3:
        // accordionOne();
        break;
      case 4:
        Course.enaBotNextButton(4, false);

        $(window).resize();
        $(".tips-slider").css("opacity", "0");
        Course.slider();

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
        setLessonLocation("quiz");
        exam();
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
  slider: function () {
    let viewed_slides = 0;
    let slideCount = 0;
    let slideProgress = 0;

    if (!Course.tipsInit) {
      Course.tipsInit = true;

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

        switch (curr_slide) {
          case 0: viewed_slides |= 1; break;
          case 1: viewed_slides |= 2; break;
          case 2: viewed_slides |= 4; break;
          case 3: viewed_slides |= 8; break;
          case 4: viewed_slides |= 16; break;
          case 5: viewed_slides |= 32; break;
          case 6: viewed_slides |= 64; break;
        }

        slideCount = slick.slideCount;

        /** Calculate slide progress */
        let n = 0, i;
        for (i = 0; i <= slideCount; i++) {
          if ((viewed_slides >> i) & 1) n++;
        }

        slideProgress = (n / slideCount) * 100;
        console.log(n, "progress:", slideProgress);

        if (n === slideCount) {
          Course.enaBotNextButton(4, true);
        }
      });
    }

    $(".tips-slider").slick("slickGoTo", 0);
  }
};
