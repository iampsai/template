function slider() {
  let viewed_slides = 0;
  let slideCount = 0;
  let slideProgress = 0;
  let self = {};

  self.setProgress = function () {
    let n = 0, i;
    for (i = 0; i <= slideCount; i++) {
      if ((viewed_slides >> i) & 1) n++;
    }

    slideProgress = (n / slideCount) * 100;
    console.log(n, "progress:", slideProgress);

    if (n === slideCount) {
      Course.enaBotNextButton(4, true);
    }
  }

  if (!Course.tipsInit) {
    Course.tipsInit = true;
    
    $(".tips-slider").on('init', function (event, slick) {
      slideCount = slick.slideCount;
      viewed_slides = 1;
      self.setProgress();
      console.log('Total Slides:', slideCount);
    });
  
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
  
      self.setProgress();
    });
  }

  $(".tips-slider").slick("slickGoTo", 0);
}