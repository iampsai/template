function exam() {
  var fin_exam_ = fin_exam;
  var fin_exam_copy = fin_exam;
  var nQuestion = 0;
  var bad_ans = 0;
  var right_ans_exam = 0;
  var fin_exam_percent = 0;

  function changeBg() {
    $(".content").toggleClass("bgGray");
    $(".content").toggleClass("centerExam");
    $("#exam").css({ "box-shadow": "0 0.3rem 1rem rgba(0, 0, 0, 0.1)" });
    $(document.body).toggleClass("bgGray");
  }
  $(".final-exam-start").addClass("examText");
  $("#examTitle").addClass("examWidth");
  $(".final-exam-start").show();
  $(".wrap").hide();
  initExamen();

  //show results
  $("#page-9 .b-xx-res").click(function () {
    showResults();
  });
  $(".startbtn").click(function () {
    $(".final-exam-start").hide();
    // $(".title").removeClass("examTitle");
    $(".final-exam-start").removeClass("examText");
    // Show the .wrap element when the button is clicked
    $(".wrap").show();
    // Initialize the game if it's the game section
    if ($(this).hasClass("game-start")) {
      initializeGame();
    }
    // Initialize the exam if it's the exam section
    else if ($(this).hasClass("exam-start")) {
      initExamen();
    }
  });

  $(".startbtn").click(function () {
    $("#examTitle").removeClass("examWidth");
  });

  function initExamen() {
    fin_exam_copy = fin_exam_;
    nQuestion = 0;
    bad_ans = 0;
    right_ans_exam = 0;

    changeBg();
    $("#les47-quest").val(0);

    $(".progress-bar .score-text").css({ color: "#000" });
    $(".progress-bar .perc-1").css({ color: "#000" });
    $(".progress-bar .perc-1").html("");
    $(".progress-bar .perc-2").show();
    $(".progress-bar .failed").hide();
    $(".progress-bar .success").hide();
    $(".remarks-container").show();
    $("#exam .title .fin-exam-results").css("display", "none");
    $("#exam .fin-exam-results").css("display", "none");
    // $('div.fin-exam .title h2').css('display', 'inline-block');

    //show exam
    $("#exam .title .fin-exam-exam").css("display", "block");
    $("#exam .wrap  .fin-exam-exam").css("display", "block");
    //hide exam results
    // $("#exam ").css("display", "none");
    $("div.fin-exam h1.fin-exam-results").css("display", "none");
    //$('div.fin-exam .wrap').css('padding-bottom', '0');

    initQ();
    loadQuestion(0);
  }

  function finExamNext() {
    var nquest = parseInt($("#les47-quest").val()); //# of question
    nquest++;

    $("div.fin-exam .b-xx-res").addClass("disabled");
    $("div.fin-exam .b-xx-res").show();
    $("div.fin-exam .b-xx-next").hide();

    chBg();
    setTimeout(function () {
      if (!loadQuestion(nquest)) {
        //hide exam
        $("div.fin-exam .fin-exam-exam").hide();
        $(".remarks-container").hide();
        //show exam results
        $("div.fin-exam .fin-exam-results").show();
        $("div.fin-exam h1.fin-exam-results").css("display", "inline-block");
        //$('div.fin-exam .wrap').css('padding-bottom', '22px');
        updateGaugeMeter();
      }
    }, 500);
  }

  function initQ() {
    if (fin_exam_copy[0].randQ) {
      var i, n;
      for (i = 0; i < fin_exam_copy.length; i++) {
        fin_exam_copy[i].usedQ = 0;
        fin_exam_copy[i].nQ = i;
      }

      fin_exam = [];
      for (i = 0; i < fin_exam_copy[0].countQ; i++) {
        n = randQ();
        fin_exam.push(fin_exam_copy[n]);
      }
      fin_exam[0].showResults = fin_exam_copy[0].showResults;
      fin_exam[0].skipExam = fin_exam_copy[0].skipExam;
      fin_exam[0].randQ = fin_exam_copy[0].randQ;
      fin_exam[0].countQ = fin_exam_copy[0].countQ;
    } //all questions
    else {
      var i, n;
      for (i = 0; i < fin_exam_copy.length; i++) {
        fin_exam_copy[i].usedQ = 0;
        fin_exam_copy[i].nQ = i;
      }

      fin_exam = fin_exam_copy;
    }
  }

  function randQ() {
    var i;
    for (i = 0; i < 1000; i++) {
      var n = Math.floor(Math.random() * fin_exam_copy.length);
      if (n >= fin_exam_copy.length) continue;

      if (fin_exam_copy[n].usedQ == 0) {
        fin_exam_copy[n].usedQ = 1;
        return n;
      }
    }
    return 0;
  }

  //Load questions. n = 0..9
  function loadQuestion(n) {
    if (fin_exam.length <= n) return false;

    var q = fin_exam[n];

    $(".dotted").removeClass("correct-border incorrect-border");
    $("#remarks .correct-container").css({ display: "none" });
    $("#remarks .incorrect-container").css({ display: "none" });
    $("#les47-quest").val(n); //# of question
    $("#les47-countansw").val(q.answers.length); //count of answers (1..5)
    $("#les47-answer").val(q.answer);

    $("div.fin-exam .title2 h1").html(n + 1 + "" + q.question + "/5");
    $("div.fin-exam .title2 h2").html(q.question2);

    var ians;
    for (
      ians = 0;
      ians < 8;
      ians++ //5 answers max
    ) {
      if (q.answers.length > ians) {
        $("#fin-exam-a" + ians).show();
        $("#fin-exam-a" + ians + " td label").html(q.answers[ians]);
      } else {
        $("#fin-exam-a" + ians).hide();
      }
    }

    $(document).ready(function () {
      $("div.fin-exam tr").hover(
        function () {
          $(".chbox", this).css("background", "#f7f7f8");
        },
        function () {
          $(".chbox", this).css("background", "");
        }
      );
    });

    //uncheck all
    $("div.fin-exam input[type=checkbox]").prop("checked", false);
    $("div.fin-exam input[type=checkbox] + label").removeClass(
      "ch-label-green ch-label-red"
    );
    $("div.fin-exam input[type=checkbox] + label").removeClass("pointerNone");
    $("div.fin-exam input[type=checkbox] + label").removeClass(
      "incorrectBorder"
    );

    //hide buttons
    $("div.fin-exam .b-xx-next").hide();
    return true;
  }

  //show results
  function showResults() {
    chBg();

    $("div.fin-exam .b-xx-next").show();
    $("div.fin-exam .b-xx-res").hide();
    return false;
  }

  function getCheckedCode() {
    var code = 0;
    if ($("#ch47-1a").is(":checked")) code += 1;
    if ($("#ch47-2a").is(":checked")) code += 2;
    if ($("#ch47-3a").is(":checked")) code += 4;
    if ($("#ch47-4a").is(":checked")) code += 8;
    if ($("#ch47-5a").is(":checked")) code += 16;
    return code;
  }

  function chBg() {
    var correct_answer = parseInt($("#les47-answer").val());
    var nquest = parseInt($("#les47-quest").val());
    var nq = nquest;
    nquest += 1;

    $("div.fin-exam input[type=checkbox]").removeClass(
      "ch-label-green ch-label-red"
    );

    var ians;
    switch (correct_answer) {
      case 1:
        ians = 0;
        break;
      case 2:
        ians = 1;
        break;
      case 4:
        ians = 2;
        break;
      case 8:
        ians = 3;
        break;
      case 16:
        ians = 4;
        break;
    }

    $(document).ready(function () {
      $("div.fin-exam tr").hover(
        function () {
          $(".chbox", this).css("background", "#ffff");
        },
        function () {
          $(".chbox", this).css("background", "");
        }
      );
    });

    var userAnswer = getCheckedCode();
    var userAnswerN = fin_exam[nq].nQ;

    $("div.fin-exam input[type=checkbox]")
      .siblings("label")
      .removeClass("ch-label-red ch-label-green");

    fin_exam[nq].answers.forEach(function (answer, index) {
      var answerCode = Math.pow(2, index);
      var userSelected = (userAnswer & answerCode) !== 0;
      var correctSelected = (correct_answer & answerCode) !== 0;
      var label = $("#ch47-" + (index + 1) + "a + label");
      var border = $("#fin-exam-a" + index);

      label.removeClass("pointerNone");
      label.removeClass("ch-label-green ch-label-red");

      if (correctSelected) {
        label.addClass("ch-label-green");
        label.addClass("pointerNone");
      } else {
        label.addClass("ch-label-red");
        label.addClass("pointerNone");
        label.addClass("incorrectBorder");
      }
    });

    if (userAnswer === correct_answer) {
      setQuizAnswer(
        userAnswerN,
        fin_exam[nq].question2,
        fin_exam[nq].answers[ians],
        true
      );
      fin_exam[nq].user_result = 1;
      right_ans_exam++;
      $("#remarks .correct-container").css({ display: "flex" });
      $("#remarks .incorrect-container").css({ display: "none" });
      console.log(
        "setQuizAnswer",
        userAnswerN,
        fin_exam[nq].question2,
        fin_exam[nq].answers[ians],
        true
      );
    } else {
      setQuizAnswer(
        userAnswerN,
        fin_exam[nq].question2,
        fin_exam[nq].answers[ians],
        false
      );
      fin_exam[nq].user_result = 0;
      bad_ans++;
      $("#remarks .correct-container").css({ display: "none" });
      $("#remarks .incorrect-container").css({ display: "flex" });
      console.log(
        "setQuizAnswer",
        userAnswerN,
        fin_exam[nq].question2,
        fin_exam[nq].answers[ians],
        false
      );
    }
  }

  function chboxChange(el) {
    el = $(el);
    var id = el.attr("id");
    var idl = id.substr(0, 6);
    var idr = id.substr(6, 1);
    var idr2;

    if (idr == "a") idr2 = "b";
    else idr2 = "a";

    var nch = parseInt(id.substr(5, 1));

    var el1 = el;
    var el2 = $("#ch47-" + nch + idr2);
    var i;

    if (idr == "b") {
      el1.prop("checked", true);
      el2.prop("checked", false);
    }

    if (idr == "a") {
      el2.prop("checked", false);

      //uncheck all except el1
      for (i = 0; i < 5; i++) {
        if (i == nch) continue;
        $("#ch47-" + i + "a").prop("checked", false);
        $("#ch47-" + i + "b").prop("checked", true);
      }
    }

    //is answered?
    for (i = 0; i < 5; i++) {
      if ($("#ch47-" + i + "a").is(":checked")) {
        //answered
        $("div.fin-exam .b-xx-res").fadeIn();
        $("div.fin-exam .b-xx-res").removeClass("disabled");
        // $("div.fin-exam .butnext").show();

        //percent of EXAM
        if (window.funcExamCnt && fin_exam.length) {
          //user func
          var lesAns = parseInt($("#les47-quest").val());
          var perc = lesAns / 9;
          console.log("nquest", perc);
          funcExamCnt(perc);
        }

        break;
      } else {
        $("div.fin-exam .b-xx-res").addClass("disabled");
        $("div.fin-exam .b-xx-next").hide();
      }
    }
  }

  $("div.fin-exam input[type=checkbox]").change(function () {
    chboxChange(this);
  });

  //next question
  $("button.b-47-next").click(function () {
    finExamNext();
  });

  function calculateResults() {
    var nresults = 0;
    for (var n = 0; n < fin_exam.length; n++) {
      if (fin_exam[n].user_result > 0) {
        nresults++;
      }
    }
    return nresults;
  }

  function gaugeresult() {
    $(".content").removeClass("bgGray");
    $(".content").removeClass("centerExam");
    $("#examTitle").removeClass("examWidth");
    $(document.body).removeClass("bgGray");
    $("#exam").css({ "box-shadow": "none" });
    var nresults = calculateResults();
    var percentageValue = Math.floor((nresults / fin_exam.length) * 100);
    const passButton = document.querySelector(".proceed-btn-cert");
    const retryButton = document.querySelector(".try-again-btn");
    $(".default-meter").css({ display: "block" });
    $(".GaugeMeter span").css({ display: "block" });
    $(".failed-meter").css({ display: "none" });
    $(".pass-meter").css({ display: "none" });
    passButton.classList.add("d-none");
    retryButton.classList.remove("d-none");
    $(".failedContainer").addClass("d-none");
    fail.classList.add("d-none");
    pass.classList.add("d-none");
    score.textContent = " ";
    setCompletionStatus("passed");
    setLessonLocation("end-training");

    // Calculate score
    Course.score = nresults / fin_exam.length;
    setScore(Course.score);
    console.log("Score:", Course.score);
    console.log("correctAnswerCount:", nresults);

    if (percentageValue <= 79) {
      const elements = document.querySelectorAll(
        ".GaugeMeter span, .GaugeMeter output, .GaugeMeter u"
      );
      const score = document.getElementById("score");
      const fail = document.getElementById("fail");

      setTimeout(() => {
        $(".GaugeMeter span").css({ display: "none" });
        fail.classList.remove("d-none");
        score.textContent = percentageValue + "%";
        fail.style.transition = "opacity 300ms";
        fail.style.opacity = 1;
        fail.addEventListener("transitionend", () => {});
        $(".failed-meter").css({ display: "block" });
        $(".pass-meter").css({ display: "none" });
        $(".default-meter").css({ display: "none" });
        $(".failedContainer").removeClass("d-none");
      }, 2500);

      setTimeout(() => {
        elements.forEach((element) => {
          element.style.transition = "opacity 300ms";
          element.style.opacity = 0;
          element.addEventListener("transitionend", () => {});
        });
      }, 2100);
    } else {
      const elements = document.querySelectorAll(
        ".GaugeMeter span, .GaugeMeter output, .GaugeMeter u"
      );
      const pass = document.getElementById("pass");
      passButton.classList.remove("d-none");
      retryButton.classList.add("d-none");

      setTimeout(() => {
        $(".GaugeMeter span").css({ display: "none" });
        pass.classList.remove("d-none");
        pass.style.transition = "opacity 300ms";
        pass.style.opacity = 1;
        score.textContent = percentageValue + "%";
        pass.addEventListener("transitionend", () => {});
        $(".pass-meter").css({ display: "block" });
        $(".failed-meter").css({ display: "none" });
        $(".default-meter").css({ display: "none" });
        $(".failedContainer").addClass("d-none");
      }, 2500);

      setTimeout(() => {
        elements.forEach((element) => {
          element.style.transition = "opacity 300ms";
          element.style.opacity = 0;
          element.addEventListener("transitionend", () => {});
        });
      }, 2500);
    }
  }

  function updateGaugeMeter() {
    $(".GaugeMeter").each(function () {
      try {
        gaugeresult();
        var nresults = calculateResults();
        var percentageValue = (nresults / fin_exam.length) * 100;
        console.log("Percentage Value:", percentageValue);

        $(this).gaugeMeter({
          percent: percentageValue,
        });

        console.log(percentageValue + "precent");
      } catch (error) {
        console.error("Error updating GaugeMeter:", error);
      }
    });
  }

  $(".restartBtn").on("click", function () {
    OCookies.setCookie("page3_accordion", -3600);
    OCookies.setCookie("page4_accordion", -3600);
    OCookies.setCookie("page5_accordion", -3600);
    openedCount = 0;
  });

  $(".try-again-btn").on("click", function () {
    const score = document.getElementById("score");
    score.textContent = "";
    initExamen();
    pass.classList.add("d-none");
    fail.classList.add("d-none");
    $(".content").addClass("bgGray");
    $(".content").addClass("centerExam");
    $(document.body).addClass("bgGray");
    $("#exam").css({ "box-shadow": "0 0.3rem 1rem rgba(0, 0, 0, 0.1)" });

    const elements = document.querySelectorAll(
      ".GaugeMeter span, .GaugeMeter output, .GaugeMeter u"
    );
    elements.forEach((element) => {
      element.style.opacity = 0;

      element.style.transition = "opacity 300ms";

      setTimeout(() => {
        element.style.opacity = 1;
        element.addEventListener("transitionend", () => {});
      }, 0);
    });
  });
}
