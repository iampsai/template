// A jQuery library is required
const jsonFile = "settings.json";

async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching JSON:', error);
    // Rethrow the error to propagate it
    throw error;
  }
}

function isNotSet(value) {
  return value !== "string" || value.trim() === "";
}

function customStyles(data) {
  data.enabled = true;

  if (data.enabled) {
    // Apply global styling to paragraph
    const paragraph = $('#course p');
    if (paragraph) {
      if (isNotSet(data.textColor.color)) {
        $('#course p').css('color', data.textColor.color);
      }
    }

    // Apply styling to cover page
    const coverPage = $('#coverPage');
    if (coverPage) {
      if (isNotSet(data.coverPage.headingColor)) {
        $('#coverPage h2').css('color', data.coverPage.headingColor);
      }
      if (isNotSet(data.coverPage.fontSize)) {
        $('#coverPage h2').css('font-size', data.coverPage.fontSize);
      }
      if (isNotSet(data.coverPage.coverImage)) {
        $('#coverPage img').attr({
          'src': data.coverPage.coverImage,
          'alt': 'cover image'
        });
      }
    }

    // Apply styling to footer
    const footer = $('#footer');
    if (footer) {
      if (isNotSet(data.footer.backgroundColor)) {
        $('#footer').css('background-color', data.footer.backgroundColor);
      }
      if (isNotSet(data.footer.backgroundImage)) {
        $('#footer').css('background-image', 'url(' + data.footer.backgroundImage + ')');
      }
      if (isNotSet(data.footer.copyrightText)) {
        $('#footer span.copyrightText').html(data.footer.copyrightText);
      }
    }

    // Apply styling to default button
    let defaultButton = $('#course button.btn-default'),
      primaryButton = $('#course button.btn-primary'),
      secondaryButton = $('#course button.btn-secondary'),
      dangerButton = $('#course button.btn-danger');
    let btnArray = ["defaultButton", "primaryButton", "secondaryButton", "dangerButton"];
    let btnClassArray = ["btn-default", "btn-primary", "btn-secondary", "btn-danger"];

    for (let i = 0; i < btnArray.length; i++) {
      if (btnArray[i]) {
        if (isNotSet(data[btnArray[i]].backgroundColor)) {
          $('#course button.' + btnClassArray[i]).css('background-color', data[btnArray[i]].backgroundColor);
        }
        if (isNotSet(data[btnArray[i]].borderColor)) {
          $('#course button.' + btnClassArray[i]).css('border-color', data[btnArray[i]].borderColor);
        }
        if (isNotSet(data[btnArray[i]].textColor)) {
          $('#course button.' + btnClassArray[i]).css('color', data[btnArray[i]].textColor);
        }
      }
    }
  }

  console.log('data:', data);
}

function initBulkStyles() {
  fetchJSON(jsonFile)
    .then(data => {
      customStyles(data);
    })
    .catch(error => {
      console.error('Error applying styles:', error);
    });
}