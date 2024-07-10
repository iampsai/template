var Exam = {
  preInit: false,
  nQuest: 0,
  nCurrentQuestion: 0,
  answerLength: 0,
  correctAnswer: 0,
  badAns: 0,
  rightAns: 0,
  exam_copy: null,
  showExamResult: 0,

  pre: function () {
    // Triggered only once
    if (!Exam.preInit) {
      Exam.preInit = true;

      Exam.exam_copy = exam_quest;


    }
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

      fin_exam = [];
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

    $('#exam .title2 h2').html(q.question2);

    for (let ians = 0; ians < 6; ians++) {
      if (q.answers.length > ians) {
        $("#fin-exam-a" + ians).show();
        $("#fin-exam-a" + ians + " td label").html(q.answers[ians]);

        if (q.answers.length > (ians + 1)) {
          $("#fin-exam-a" + ians).addClass('dotted')
        } else {
          $("#fin-exam-a" + ians).removeClass('dotted');
        }
      } else {
        $("#fin-exam-a" + ians).hide();
      }
    }

    // Unchecked all inputs
    $("div.fin-exam input[type=checkbox]").prop("checked", false);
    $("div.fin-exam input[type=checkbox] + label").removeClass("ch-label-green ch-label-red");

    return true;
  },

  checkBoxChange: function (el) {
    el = $(el);

    // Uncheck all checkbox except selected
    var el_id = el.attr('id');
    $('#exam .tbl-check input:checked').each(function() {
      if ($(this).attr('id') != el_id)
        $(this).prop('checked', false);
    });

    //is answered?
    for (i = 1; i <= 6; i++) {
      if ($('#ch-' + i + 'a').is(':checked')) {
        //answered
        $("div.fin-exam .b-xx-res").removeClass("disabled");
        break;
      }
    }
  }
}