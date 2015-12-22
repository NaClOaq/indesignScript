var sel = app.activeDocument.selection;
  var actDocFolder = app.activeDocument.filePath;
  createFile(actDocFolder+'\\output');
  var sliceFolder = createFileSlice(actDocFolder+'\\output')
  // var myFile = new File(actDocFolder + "/"+ pname.substr(0,pname.lastIndexOf(".")) + ".jpg");
  app.jpegExportPreferences.jpegQuality = JPEGOptionsQuality.maximum;
  app.jpegExportPreferences.jpegExportRange = ExportRangeOrAllPages.EXPORT_RANGE;
for (i = 0; i < sel.length; i++){
  // pname = sel[0].graphics[0].itemLink.name;
  sel[i].exportFile(ExportFormat.PNG_FORMAT, new File(sliceFolder+"\\image"+i+".png"), false);
}


function createFile(Path){
  folderObj = new Folder(Path);
  flag = folderObj.exists;
  if (flag == false){
    var autputFolder = new Folder(Path);
  }
}

function createFileSlice(Path){
  for (var i = 0; i < 10; i++) {
    folderObj = new Folder(Path+"\\slice"+i);
    flag = folderObj.exists;
    if (flag == false){
      var autputFolder = new Folder(Path+"\\slice"+i);
      flag = autputFolder.create();
      return Path+"\\slice"+i;
    }
  }
};