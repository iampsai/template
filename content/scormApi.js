var maxTries = 500;
var nFindAPITries = 0;
var scormAPI = {
  completionStatus: "incomplete",
  lessonLocation: "",
};

function scanForAPI(win) {
  while (win.API_1484_11 == null && win.parent != null && win.parent !== win) {
    nFindAPITries++;
    if (nFindAPITries > maxTries) {
      return null;
    }
    win = win.parent;
  }

  return win.API_1484_11;
}

// Function to find the SCORM API
function findSCORMAPI() {
  let api = null;

  if (window.parent != null && window.parent != window) {
    api = scanForAPI(window.parent);
  }

  if (api == null && window.opener != null) {
    api = scanForAPI(window.opener);
  }

  return api;
}

// Function to initialize the SCORM API
function initializeSCORM() {
  scormAPI.api = findSCORMAPI();

  if (scormAPI.api == null) {
    console.error("SCORM API not found.");
    return;
  } else console.log("SCORM", scormAPI.api);
}

// Function to get the learner's name from the LMS
function getLearnerName() {
  return scormAPI.api.GetValue("cmi.core.student_name");
}

// Function to set the learner's completion status
function setCompletionStatus(status) {
  scormAPI.api.SetValue("cmi.success_status", status);
  scormAPI.completionStatus = status;
}

function setQuizAnswer(questionNumber, question, answer, correct) {
  scormAPI.api.SetValue(
    `cmi.interactions.${questionNumber}.id`,
    questionNumber
  );
  scormAPI.api.SetValue(`cmi.interactions.${questionNumber}.type`, "choice");
  scormAPI.api.SetValue(
    `cmi.interactions.${questionNumber}.learner_response`,
    answer
  );
  scormAPI.api.SetValue(
    `cmi.interactions.${questionNumber}.result`,
    correct ? "correct" : "incorrect"
  );
  scormAPI.api.SetValue(
    `cmi.interactions.${questionNumber}.description`,
    question
  );
  scormAPI.api.SetValue(
    `cmi.interactions.${questionNumber}.timestamp`,
    new Date()
  );
}

function setVideoProgress(progress) {
  scormAPI.api.SetValue(`cmi.video_progress`, progress);
}

function setScore(score) {
  scormAPI.api.SetValue(`cmi.score.scaled`, score);
}

// Function to set the lesson location
function setLessonLocation(location) {
  scormAPI.api.SetValue("cmi.location", location);
  scormAPI.lessonLocation = location;
}

// Function to terminate communication with the SCORM API
function terminateSCORM() {
  scormAPI.api.Terminate("");
  scormAPI.api = null;
}
