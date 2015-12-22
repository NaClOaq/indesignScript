var sel = app.activeDocument.selection;
for (i = 0; i < sel.length; i++)
{
// pname = sel[0].graphics[0].itemLink.name;
var actDocFolder = app.activeDocument.filePath;
var actDocFolder = 'C:\\Users\\John Do\\Desktop\\indesign';
var success = Folder(actDocFolder+'output').create();
// var folderObj = Folder(actDocFolder+'output');
// var myFile = new File(actDocFolder + "/"+ pname.substr(0,pname.lastIndexOf(".")) + ".jpg");
app.jpegExportPreferences.jpegQuality = JPEGOptionsQuality.maximum;
app.jpegExportPreferences.jpegExportRange = ExportRangeOrAllPages.EXPORT_RANGE;
sel[i].exportFile("JPEG", actDocFolder+"\\output\\image"+i+".jpg", false);
}

