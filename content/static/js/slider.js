function slider() {
  let viewed_slides = 0;
  let slideCount = 0;
  let slideProgress = 0;
  let self = {};

  self.setProgress = function () {
    var n = 0, i;
    for (i = 0; i <= slideCount; i++) {
      if((viewed_slides >> i) & 1) n++;
    }

    slideProgress = (n / slideCount) * 100;
    console.log(n, "progress:", slideProgress);

    if (n == slideCount) {
      Course.enaBotNextButton(1, true);
    }
  }

  $(".tips-slider").on('init', function (event, slick) {
    slideCount = slick.slideCount;
    viewed_slides = 1;
    self.setProgress();
    console.log('Total Slides:', slideCount);
  }).slick({
    dots: true,
    arrows: true,
    infinite: false,
    slidesToScroll: 1,
    speed: 800,
    cssEase: 'ease',
    easing: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false
        }
      }
    ]
    // appendDots: '.process-card__inner'
  }).on('afterChange', function (event, slick, currentSlide) {
    var curr_slide = currentSlide;

    switch (curr_slide) {
      case 0: viewed_slides |= 1; break;
      case 1: viewed_slides |= 2; break;
      case 2: viewed_slides |= 4; break;
      case 3: viewed_slides |= 8; break;
      case 4: viewed_slides |= 16; break;
      case 5: viewed_slides |= 32; break;
      case 6: viewed_slides |= 64; break;
    }

    self.setProgress();
  });

  // Generate slick dots for each slide
  // $(slPage + " .tips-item").each(function (index) {
  //   var ul = $('<ul class="slick-dots"></ul>');
  //   for (var j = 0; j < nslides; j++) {
  //     var active_class = j === index ? "slick-active" : "";
  //     var n = j + 1;
  //     ul.append(
  //       '<li class="' +
  //       (active_class ? "slick-active" : "") +
  //       '">' +
  //       '<button type="button" tabindex="0" data-id="' +
  //       j +
  //       '">' +
  //       n +
  //       "</button>" +
  //       "</li>"
  //     );
  //   }
  //   $(this).append(ul);
  // });

  // Click event handler for number buttons (tabs)
  // $(slPage + " .slick-dots li button").click(function () {
  //   var slideIndex = $(this).attr("data-id");
  //   $(slPage + " .tips-slider").slick("slickGoTo", slideIndex);
  // });

  // // Click event handler for PREV button
  // $(slPage + " .btn-prev").click(function () {
  //   preventDefault();
  //   $(slPage + " .tips-slider").slick("slickPrev");
  // });

  // // Click event handler for NEXT button
  // $(slPage + " .btn-next").click(function () {
  //   preventDefault();
  //   $(slPage + " .tips-slider").slick("slickNext");
  // });

  // function resetSlide() {
  //   $(".tips-slider .slick-slide").removeClass("opened");
  //   opened = 0;
  // }

  // $(".tips-slider").on("afterChange", function (event, slick, currentSlide) {
  //   var $currentSlide = $(slick.$slides[currentSlide]);

  //   if (!$currentSlide.hasClass("opened")) {
  //     $currentSlide.addClass("opened");
  //     opened++;
  //   } else {
  //     console.log("opened");
  //   }

  //   if (opened === slick.slideCount) {
  //     btnNext.removeClass("disabled");
  //     Course.enaBotNextButton(4, true);
  //   }
  // });

  // $(btnNext).on("click", function () {
  //   resetSlide();
  // });
}