var Exam = {
  preInit: false,
  nQuest: 0,
  nCurrentQuestion: 0,
  answerLength: 0,
  correctAnswer: 0,
  badAns: 0,
  rightAns: 0,
  exam_copy: null,
  showExamResult: true, // Enable or disable the exam result

  pre: function () {
    // Triggered only once
    if (!Exam.preInit) {
      Exam.preInit = true;

      Exam.exam_copy = exam_quest;

      $('button.btn-quiz-start').click(function () {
        $('#exam .exam-intro').hide();
        $('#exam .wrap').fadeIn(800);
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

      exam_quest[0].showResults = Exam.exam_copy[0].showResults;
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
  },

  randomized: function () {
    for (let i = 0; i < 1000; i++) {
      let n = Math.floor(Math.random * Exam.exam_copy.length);
      if (n >= Exam.exam_copy.length) continue;

      if (Exam.exam_copy[n].usedQ == 0) {
        Exam.exam_copy[n].usedQ = 1;
        return n;
      }
    }
    return 0;
  },

  loadQuestion: function (n) {
    if (exam_quest <= n || n < 0) {
      return false;
    }

    let q = exam_quest[n];

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

    console.log(q);

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

    $("div.fin-exam input[type=checkbox] + label").removeClass("ch-label-green ch-label-red");

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
      // console.log(questCount, examQuestion, userAnswer, true);
    } else {
      setQuizAnswer(questCount, examQuestion, userAnswer, false);
      exam_quest[questCount].user_result = 0;
      // console.log(questCount, examQuestion, userAnswer, false);
    }

    if (Exam.showExamResult) {
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
    $('#remarks .remarks-icon').removeClass('correct correct-border incorrect incorrect-border');
    $('#remarks .remarks-icon i').removeClass('bi-check-lg bi-x-lg');
    $('#remarks').animate({'opacity': 1});

    checkboxIds.forEach(function (id, index) {
      if (Exam.correctAnswer & Math.pow(2, index)) {
        $(id + ' + label').addClass('ch-label-green');
      } else {
        $(id + ' + label').addClass('ch-label-red');
      }
    });

    if (userAnswerCode == Exam.correctAnswer) {
      $('#remarks .remarks-icon').addClass('correct correct-border');
      $('#remarks .remarks-icon i').addClass('bi-check-lg');
      $('#remarks .remarks-text').html('Correct');
    } else {
      $('#remarks .remarks-icon').addClass('incorrect incorrect-border');
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
            Exam.next(0);
            return;
          }

          $('#exam .title, #exam .d-exam').fadeIn(500);
        }, 500)
        break;
    }
  }
}