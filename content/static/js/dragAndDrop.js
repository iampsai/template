function dragAndDrop() {
  var field = $("#game .field");
  var draggableWrapper = $("#game .draggable-wrapper");
  var correctAns = 0;
  var wrongAns = 0;
  var cardCount = 0;
  var score_percent = 0;
  var init = false;

  function loadDrag() {
    Course.enaBotNextButton(8, false);
    $("#game .draggable").remove();

    for (let i = 0; i < fin_game.length; i++) {
      let question = fin_game[i].question,
        answer = fin_game[i].answer,
        iEl = i;

      iEl++;

      draggableWrapper.append(
        '<div class="ui-widget-content draggable item item' +
          iEl +
          " ans" +
          answer +
          '" data-ok="0">' +
          '<div class="question">' +
          question +
          "</div>" +
          '<div class="card_status"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" /></svg></div>' +
          "</div>"
      );
    }
  }

  function gameInit() {
    init = false;

    if (!init) {
      init = true;

      loadDrag();
      $("#resetButton, #congratulations").hide();
      $("#result").addClass("d-none");

      $("#game .draggable").draggable({
        touch: true,
        snap: "[data-action='droppable']",
        snapMode: "inner",
        snapTolerance: 50,
        revert: function (event, ui) {
          // Check if the item has been dropped correctly
          if ($(this).data("dropped")) {
            // Clear the attribute for the next drag
            return false;
          } else {
            // Perform the shake effect
            $(this).effect(
              "shake",
              {
                distance: 5,
                times: 2,
              },
              500
            );
            return true;
          }
        },
        drag: function (event, ui) {
          $(this).css("transform", "rotate(3deg)");
        },
        stop: function (event, ui) {
          $(this).css("transform", "");
        },
      });

      field.droppable({
        drop: function (event, ui) {
          let quest,
            nItem = 0,
            nAns = (nFld = false);

          for (quest = 1; quest <= fin_game.length; quest++) {
            if (ui.draggable.hasClass("item-" + quest)) nItem = quest;
          }

          if (ui.draggable.hasClass("ans1")) nAns = true;
          if (ui.draggable.hasClass("ans2")) nAns = false;

          if ($(this).hasClass("true")) nFld = true;
          if ($(this).hasClass("false")) nFld = false;

          if (nFld == nAns) {
            ui.draggable.attr("data-ok", "1");

            if (ui.draggable.attr("data-ok") == 1) {
              $("#game ." + nFld).append(ui.draggable);
            }

            $(ui.draggable).fadeIn(600, function () {
              // After fadeIn, show the card status and scale the element
              $(this).css({
                top: 0,
                left: 0,
              });
              $(this).transition(
                {
                  scale: 0.8,
                },
                200,
                function () {
                  // After the scale, perform the slide down animation
                  $(this).css({
                    transform: "scale(0.8)",
                    top: 0,
                    left: 0,
                  });
                  $(this).find(".card_status").show();
                  $(this).animate(
                    {
                      top: "+=100", // Adjust this value to your needs
                    },
                    1000,
                    function () {
                      // Finally, fade out and hide the item
                      $(this).fadeOut(function () {
                        $(this).hide();
                      });
                    }
                  );
                }
              );
              if ($(window).width() < 600) {
                $(this).transition(
                  {
                    scale: 1,
                    width: "95%",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  },
                  200
                );
              }
            });

            if (!ui.draggable.data("wasDropped")) {
              correctAns++;
            }

            $(ui.draggable).data("dropped", true);
            $(ui.draggable).data("wasDropped", true);

            cardCount++;

            // When all cards are consumed
            if (fin_game.length == cardCount) {
              if (correctAns == cardCount) {
                $("#congratulations").show();
                $("#resetButton").hide();
                $("#result").removeClass("d-none");
                Course.enaBotNextButton(8, true);
              } else {
                $("#resetButton").show();
                $("#congratulations").hide();
                $("#result").removeClass("d-none");
                Course.enaBotNextButton(8, true);
              }
            }
            $(".correctAns").html(correctAns);
          } else {
            if (!ui.draggable.data("wasDropped")) {
              wrongAns++;
            }
            $(".wrongAns").html(wrongAns);
            $(ui.draggable).data("wasDropped", true);
          }
        },
      });
    }
  }

  function initializeGame() {
    gameInit();
    $(".totalQuest").html(fin_game.length);
  }

  function gameReset() {
    gameInit();
    cardCount = 0;
    correctAns = 0;
    console.log("Game Reset!");
  }

  // Initialize the game
  initializeGame();

  $("#resetButton").click(function () {
    gameReset();
  });
}
