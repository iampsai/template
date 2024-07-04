var SCORMDriver = window.parent;
var fSCORM = false;

$(function () {
  loadState();
});

function loadState() {
  var sChunk = "";

  if (typeof SCORMDriver.SetScore === "undefined") {
    console.log("no SCORM", SCORMDriver);

    // Read state from cookies
  } else {
    console.log("SCORM");
    fSCORM = true;

    sChunk = SCORMDriver.GetDataChunk();
    console.log("chunk:", sChunk);
  }

  if (sChunk) Course.oState = JSON.parse(sChunk);
  else sChunk = "empty";

  console.log("loadState", Course.oState);
}

function saveState() {
  var s = JSON.stringify(Course.oState);
  var score = Course.oState.allPoints;

  if (fSCORM) {
    SCORMDriver.SetDataChunk(s);
    SCORMDriver.SetScore(score, 100, 0);
    SCORMDriver.CommitData();
  }
  console.log("saveState", score, Course.oState);
}

function endCourse() {
  console.log("End of Course");

  if (fSCORM) {
    SCORMDriver.SetPassed();
    SCORMDriver.SetReachedEnd();
    SCORMDriver.CommitData();
  }
}

function closeCourse() {
  if (fSCORM) {
    var answer = confirm("Are You Sure You Wish To Exit This Course?");

    if (answer) {
      SCORMDriver.ConcedeControl();
    }
  }
  // Do something after end of course
  else return;
}
