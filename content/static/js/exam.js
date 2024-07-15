var Exam = {
  preInit: false,
  nCurrentQuestion: 0,
  answerLength: 0,
  correctAnswer: 0,
  badAns: 0,
  rightAns: 0,
  exam_copy: null,
  showExamAnswers: true, // Enable or disable the exam result

  pre: function () {
    // Triggered only once
    if (!Exam.preInit) {
      Exam.preInit = true;

      Exam.exam_copy = exam_quest;

      $('button.btn-quiz-start').click(function () {
        $('#exam .exam-intro').hide();
        $('#exam .wrap').fadeIn(800);
        setLessonLocation("quiz");
      });

      $('#exam button.btn-submit').click(function () {
        Exam.selectAnswer();
      });

      $('#exam button.btn-next').click(function () {
        Exam.nextQuestion();
      });

      $('#exam input[type=checkbox]').change(function () {
        Exam.checkBoxChange(this);
      });
    }

    $("div.fin-exam .btn-submit").addClass("disabled");
  },

  init: function () {
    Exam.nCurrentQuestion = 0;

    // Randomized questions
    if (Exam.exam_copy[0].randQ) {
      let i, n;
      for (i = 0; i < Exam.exam_copy.length; i++) {
        Exam.exam_copy[i].usedQ = 0;
        Exam.exam_copy[i].nQ = i;
      }

      exam_quest = [];
      for (i = 0; i < Exam.exam_copy[0].countQ; i++) {
        n = Exam.randomized();
        exam_quest.push(Exam.exam_copy[n]);
      }

      exam_quest[0].showAnswers = Exam.exam_copy[0].showAnswers;
      exam_quest[0].randQ = Exam.exam_copy[0].randQ;
      exam_quest[0].countQ = Exam.exam_copy[0].countQ;
    } else {
      for (let i = 0; i < Exam.exam_copy.length; i++) {
        Exam.exam_copy[i].usedQ = 0;
        Exam.exam_copy[i].nQ = i;
      }

      exam_quest = Exam.exam_copy;
      exam_quest[0].countQ = exam_quest.length;
    }

    console.log('init');
  },

  randomized: function () {
    for (let i = 0; i < 1000; i++) {
      let n = Math.floor(Math.random() * Exam.exam_copy.length);
      if (n >= Exam.exam_copy.length) continue;

      if (Exam.exam_copy[n].usedQ == 0) {
        Exam.exam_copy[n].usedQ = 1;
        return n;
      }
    }
    return 0;
  },

  loadQuestion: function (n) {
    if (exam_quest.length <= n || n < 0) {
      console.error("Invalid index or exam_quest array is empty:", n);
      return false;
    }

    let q = exam_quest[n];

    if (!q) {
      console.error("Question at index", n, "is undefined:", q);
      return false;
    }

    Exam.nCurrentQuestion = n;
    Exam.answerLength = q.answers.length;
    Exam.correctAnswer = q.answer;

    let quizCounter = n + 1;

    $('#exam .title .quiz-counter').html(quizCounter + "/" + exam_quest.length);
    $('#exam .title h2').html(q.question);

    for (let i = 0; i < 6; i++) {
      if (q.answers.length > i) {
        $("#fin-exam-a" + i).show();
        $("#fin-exam-a" + i + " td label").html(q.answers[i]);

        if (q.answers.length > (i + 1)) {
          $("#fin-exam-a" + i).addClass('dotted')
        } else {
          $("#fin-exam-a" + i).removeClass('dotted');
        }
      } else {
        $("#fin-exam-a" + i).hide();
      }
    }

    // Unchecked all inputs
    $("div.fin-exam input[type=checkbox]").prop("checked", false);
    $("div.fin-exam input[type=checkbox] + label").removeClass("ch-label-green ch-label-red");

    // console.log(q);

    return true;
  },

  checkBoxChange: function (el) {
    el = $(el);

    // Uncheck all checkbox except selected
    var el_id = el.attr('id');
    $('#exam .table-quiz input:checked').each(function () {
      if ($(this).attr('id') != el_id)
        $(this).prop('checked', false);
    });

    //is answered?
    for (i = 1; i <= 6; i++) {
      if ($('#ch-' + i + 'a').is(':checked')) {
        //answered
        $("div.fin-exam .btn-submit").removeClass("disabled");
        break;
      } else {
        $("div.fin-exam .btn-submit").addClass("disabled");
      }
    }
  },

  getAnswerCode: function () {
    let code = 0;
    let checkboxIds = [];

    $("div.chbox > input").each(function () {
      checkboxIds.push("#" + $(this).attr('id'));
    });

    checkboxIds.forEach(function (id, index) {
      if ($(id).is(':checked')) {
        code += Math.pow(2, index);
      }
    });

    return code;
  },

  selectAnswer: function () {
    let questCount = Exam.nCurrentQuestion;
    let correct_answer = Exam.correctAnswer;

    let userAnswerCode = Exam.getAnswerCode();

    let answerIndex;
    switch (userAnswerCode) {
      case 1: answerIndex = 0; break;
      case 2: answerIndex = 1; break;
      case 4: answerIndex = 2; break;
      case 8: answerIndex = 3; break;
      case 16: answerIndex = 4; break;
    }

    let examQuestion = exam_quest[questCount].question;
    let userAnswer = exam_quest[questCount].answers[answerIndex];

    if (userAnswerCode == correct_answer) {
      setQuizAnswer(questCount, examQuestion, userAnswer, true);
      exam_quest[questCount].user_result = 1;
      Exam.setScore();
      // console.log(questCount, examQuestion, userAnswer, true);
    } else {
      setQuizAnswer(questCount, examQuestion, userAnswer, false);
      exam_quest[questCount].user_result = 0;
      Exam.setScore();
      // console.log(questCount, examQuestion, userAnswer, false);
    }

    if (Exam.showExamAnswers) {
      Exam.showAnswers();
    }
  },

  showAnswers: function () {
    let checkboxIds = [];
    let userAnswerCode = Exam.getAnswerCode();

    $("div.chbox > input").each(function () {
      checkboxIds.push("#" + $(this).attr('id'));
    });

    $('#remarks').removeClass('correct wrong');
    $('#remarks .remarks-icon').removeClass('correct green-border incorrect red-border');
    $('#remarks .remarks-icon i').removeClass('bi-check-lg bi-x-lg');
    $('#remarks').animate({ 'opacity': 1 });

    checkboxIds.forEach(function (id, index) {
      if (Exam.correctAnswer & Math.pow(2, index)) {
        $(id + ' + label').addClass('ch-label-green');
      } else {
        $(id + ' + label').addClass('ch-label-red');
      }
    });

    if (userAnswerCode == Exam.correctAnswer) {
      $('#remarks .remarks-icon').addClass('correct green-border');
      $('#remarks .remarks-icon i').addClass('bi-check-lg');
      $('#remarks .remarks-text').html('Correct');
    } else {
      $('#remarks .remarks-icon').addClass('incorrect red-border');
      $('#remarks .remarks-icon i').addClass('bi-x-lg');
      $('#remarks .remarks-text').html('Incorrect');
    }

    $('#exam button.btn-submit').hide();
    $('#exam button.btn-next').fadeIn(500);
  },

  nextQuestion: function () {
    let nextQuest = Exam.nCurrentQuestion;
    nextQuest++;

    $('#remarks').animate({ 'opacity': 0 });
    $('#exam button.btn-next').hide();

    setTimeout(function () {
      $('#exam button.btn-submit').fadeIn();
    }, 500);

    // Exam.selectAnswer();
    Exam.next(nextQuest);
  },

  setScore: function () {
    let i, n = 0;
    for (i = 0; i < exam_quest.length; i++) {
      if (exam_quest[i].user_result == 1) n++;
    }

    Course.oState.quizScore = n / exam_quest.length * 100;
    console.log('Quiz score:', Course.oState.quizScore);
  },

  showResults: function () {
    $('.exam-container').hide();
    $('.exam-results').fadeIn();

    let theme_color, icon;

    if (Course.oState.quizScore >= Course.passRate) {
      theme_color = "DarkGreen";
      icon = "bi bi-check-lg";
    } else {
      theme_color = "Red";
      icon = "bi bi-x-lg";
    }

    let gauge_label = "Your score " + Course.oState.quizScore + "%";
    let gauge_icon = $('<i class="' + icon + '"></i>')

    $('#gaugeMeter').append(gauge_icon);

    $('#gaugeMeter').gaugeMeter({
      percent: Course.oState.quizScore,
      color: "#000",
      style: "Arch",
      append: "%",
      size: 500,
      text_size: 0.4,
      width: 3,
      animate_gauge_colors: true,
      label: gauge_label,
      label_color: "#000",
      callback: function () {
        // Your logic here after gauge animation ended
        setTimeout(function () {
          $('#gaugeMeter span').hide()
          $('#gaugeMeter b, #gaugeMeter i').fadeIn(500, function () {
            if (Course.oState.quizScore >= Course.passRate) {
              $('.exam-results-failed').hide();
              $('.exam-results-passed').fadeIn();
            } else {
              $('.exam-results-passed').hide();
              $('.exam-results-failed').fadeIn();
            }
          });
        }, 1000)
      }
    });

    $('#gaugeMeter span').show();
    $('#gaugeMeter b, #gaugeMeter i').hide();
    $('.exam-results span.passingScore').html(Course.passRate + "%");

    setCompletionStatus("passed");
    setLessonLocation("end-training");
  },

  reset: function () {
    $('#exam .wrap, #exam .exam-results, .exam-results-passed, .exam-results-failed').hide();
    $('#exam .exam-container, #exam .exam-intro').show();
    $('#exam .title, #exam .d-exam').fadeIn(500);
    $('#gaugeMeter i').remove();

    Exam.next(0);
  },

  next: function (n) {
    switch (n) {
      case 0:
        Exam.pre();
        Exam.init();
        Exam.loadQuestion(0);
        break;
      default: // go to the next questions
        Exam.pre();

        $('#exam .title, #exam .d-exam').fadeOut(500);

        setTimeout(function () {
          if (!Exam.loadQuestion(n)) {
            Exam.showResults();
            return;
          }

          $('#exam .title, #exam .d-exam').fadeIn(500);
        }, 500)
        break;
    }
  }
}