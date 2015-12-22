imgs = app.activeDocument.allGraphics;
for (i = 0; i < imgs.length; i++)
{
app.selection = imgs[i].parent;
pname = app.activeDocument.selection[0].graphics[0].itemLink.name;;
// mypath = app.activeDocument.filePath;
// var myFile = new File(mypath + "/"+ pname.substr(0,pname.lastIndexOf(".")) + ".jpg");
app.jpegExportPreferences.jpegQuality = JPEGOptionsQuality.maximum;
app.jpegExportPreferences.jpegExportRange = ExportRangeOrAllPages.EXPORT_RANGE;
// app.jpegExportPreferences.resolution = 72;
app.selection[0].exportFile("JPEG", "C:\\Users\\John Do\\Desktop\\indesign\\image"+i+".jpg", false);
}