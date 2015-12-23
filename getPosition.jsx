// visibleBounds ボーダーを含む場合[左上のy座標、左上のx座標、右下のy座標、右下のx座標]
// geometricBounds　ボーダーを含まない場合[左上のy座標、左上のx座標、右下のy座標、右下のx座標]
var sel = app.activeDocument.selection;

var xmlModule = {};
xmlModule.prototype = {

}




function Obj(frame,mType){
    var s = frame.visibleBounds;
    this.y1 = s[0];
    this.x1 = s[1];
    this.y2 = s[2];
    this.x2 = s[3];
    this.h = Math.round(this.y2-this.y1);
    this.w = Math.round(this.x2-this.x1);

    this.y1 = Math.round(this.y1);
    this.x1 = Math.round(this.x1);
    this.y2 = this.y1 + this.h;
    this.x2 = this.x1 + this.w;

    this.txt =frame.contents;
    this.moduleType = mType;
}

Obj.prototype = {
    message : function(){
        // this.addEle()
    },

    addEle : function(){
        if(this.moduleType == 'text')this.elm = this.textModule();
        if(this.moduleType == 'image')this.elm = this.imageModule();
    },
    textModule : function(){
        var elm = '\
<element>\
    <text>\
        <value>'+this.txt+'</value>\
        <hidden_value>'+this.txt+'</hidden_value>\
        <hidden_display></hidden_display>\
        <align>left</align>\
        <class>bodyTextGray</class>\
        <height></height>\
        <width></width>\
        <x>'+this.x1+'</x>\
        <y>'+this.y1+'</y>\
        <layer></layer>\
    </text>\
</element>\
        ';
    return elm;
    },
    imageModule : function (){
        var elm = '\
<element>\
    <image>\
        <source></source>\
        <alt></alt>\
        <seoText></seoText>\
        <height></height>\
        <width></width>\
        <x>'+this.x1+'</x>\
        <y>'+this.y1+'</y>\
        <layer></layer>\
    </image>\
</element>\
        ';
    return elm;
    },
}


function Msg(){};
Msg.prototype = {
    dialog : function(elm){
        var wObj = app.dialogs.add({ name:"XML" });
        var tmp1 = wObj.dialogColumns.add();
        var tObj = tmp1.textEditboxes.add({editContents:elm, minWidth:200 });
        wObj.show();
    },
    alert : function(elm){
        alert(elm);
    }
}



function Tag(){
    this.q = '&lt;';
    this.p = '&gt;';
};
Tag.prototype = {
    addTag : function(tag,text){
        var tagText = this.q+tag+this.p+text+this.q+'/'+tag+this.p;
        return tagText;
    },
    addBrake: function(text){
        var tagText = text+this.q+'br'+this.p;
        return tagText;
    },
    addLink: function(URL,text){
        //ここに処理
    }
};





// function Character(){
// }
// Character.prototype = {
//     fontName :function(cha){return cha.appliedFont.name;},
//     fontSize : function(cha){return cha.pointSize;},
//     fontTest : function(cha){return cha.verticalScale},//倍率
//     fontCha : function(cha){return cha.contents}
// }





// var style = new Character();
// alert(style.fontSize(sel[0].paragraphs[2].characters[8]));
// alert(style.fontTest(sel[0].paragraphs[2].characters[7]));
// alert(style.fontCha(sel[0].paragraphs[2].characters[7]));


// function myerror(mess) { 
// if (arguments.length > 0) { alert(mess); } 
// exit(); 
// } 
// if (sel.length == 0) {myerror("何も選択されていません")} 
// if (sel[0].reflect.name != "TextFrame") {myerror("テキストフレームを選択してください")} 
// var i = 1;//行数 
// if (sel[0].paragraphs[i].characters.length < 2) {myerror("空行です")} 

// var my_first_character = sel[0].paragraphs[i].characters[0];//１文字目 
// my_first_character.appliedFont.name;//フォント名 
// my_first_character.pointSize//文字サイズ 

// var my_last_character = sel[0].paragraphs[i].characters[-2];//最後の文字 
// my_last_character.appliedFont.name;//フォント名 
// my_last_character.pointSize//文字サイズ













var obj = [];
var elm = '';
for (var i = 0; i < sel.length; i++) {
    obj[i] = new Obj(sel[i],'text');
    obj[i].addEle();
    elm += obj[i].elm;
};
var msg = new Msg();
// alert(msg.alert(elm));
alert(msg.dialog(elm));




// var tag = new Tag();
// var test = tag.addTag('b','太字テキストです');
// alert(msg.alert(test));



























var ObjPosition = function(obj){
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

    return x1+':'+y1;
};


var putPosition = function(sel){
    var position = [];
    var text = [];
    if(sel!=""){
        for (i=0,j=sel.length; i<j; i++) {
            position[i] = ObjPosition(sel[i]);
            text[i] = sel[i].contents
        }
    }else{
        alert("Select object!");
    };
    alert(position.join(','));
}



// putPosition(sel);

