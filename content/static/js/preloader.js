//preloader
loadFiles_obj = {
  sContent: "div.container > section.holder",
  curr_fname: 0, //number of current file name
  fNames: [],
  end_fu: null,
  nImg: 0, //# images: preload_objects() ... objs
  nAll: 0, //number of preloaded files (htmls+imgs)
  progress_el: null,

  loadFiles: function (fNames, fu) {
    loadFiles_obj.end_fu = fu;
    loadFiles_obj.fNames = fNames;
    loadFiles_obj.curr_fname = 0;
    loadFiles_obj.mergeFile();
  },

  mergeFile: function () {
    if (loadFiles_obj.curr_fname >= loadFiles_obj.fNames.length) {
      loadFiles_obj.end_fu();
      return;
    }

    fname =
      pathStatic + "/htm/" + loadFiles_obj.fNames[loadFiles_obj.curr_fname];
    console.log("mergeFile", fname);

    $.ajax({
      type: "GET",
      cache: false,
      dataType: "html",
      success: function (res) {
        $(loadFiles_obj.sContent).append(res.replace(/static/g, pathStatic));
        loadFiles_obj.curr_fname++;
        loadFiles_obj.mergeFile();
      },
      url: fname,
    });
  },

  progress: function () {
    var cx_max = loadFiles_obj.progress_el.width();
    var cx = (loadFiles_obj.curr_fname * cx_max) / loadFiles_obj.nAll;
    cx = cx.toFixed(1);
    loadFiles_obj.progress_el.find(".line").css("width", cx + "px");
  },
};
