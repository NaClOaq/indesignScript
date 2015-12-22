// visibleBounds ボーダーを含む場合[左上のy座標、左上のx座標、右下のy座標、右下のx座標]
// geometricBounds　ボーダーを含まない場合[左上のy座標、左上のx座標、右下のy座標、右下のx座標]
var roundObj = function(obj){
    var s=obj.visibleBounds;
    var y1=s[0];
    var x1=s[1];
    var y2=s[2];
    var x2=s[3];
    var h =Math.round(y2-y1);
    var w =Math.round(x2-x1);

    y1 =Math.round(y1);
    x1 =Math.round(x1);
    y2 = y1 + h;
    x2 = x1 + w;

    obj.visibleBounds = [y1,x1,y2,x2];
};

sel = app.activeDocument.selection;
if(sel!=""){
  for (i=0,j=sel.length; i<j; i++) {
    roundObj(sel[i]);
  }
}else{
  alert("Select object!");
};