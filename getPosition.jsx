// visibleBounds ボーダーを含む場合[左上のy座標、左上のx座標、右下のy座標、右下のx座標]
// geometricBounds　ボーダーを含まない場合[左上のy座標、左上のx座標、右下のy座標、右下のx座標]
var sel = app.activeDocument.selection;

function Character(){
}
Character.prototype = {
    fontName :function(cha){return cha.appliedFont.name},
    fontWeight :function(cha){return ~cha.appliedFont.name.indexOf('B')},// Boolean
    fontStyle :function(cha){return cha.appliedCharacterStyle.name},
    fontSize : function(cha){return cha.pointSize},
    fontLeading :function(cha){return cha.leading},
    fontScale : function(cha){return cha.verticalScale},//　倍率
    fontCha : function(cha){return cha.contents},
    fontDeco : function(cha){return cha.strikeThroughWeight},// 打ち消し線
    fontColor :function(cha){return cha.fillColor.colorValue},
}

function Obj(frame,mType){
    var s = frame.visibleBounds;
    var adj = 5;
    this.y1 = s[0];
    this.x1 = s[1];
    this.y2 = s[2];
    this.x2 = s[3];
    this.h = Math.round(this.y2-this.y1);
    this.w = Math.round(this.x2-this.x1);
    this.y1 = Math.round(this.y1)+adj;
    this.x1 = Math.round(this.x1)+adj;
    this.y2 = this.y1 + this.h;
    this.x2 = this.x1 + this.w;
    editPara = new EditPara(frame);
    this.txtClass = editPara.getTxtClass(frame);
    this.txt = editPara.addTag(this.txtClass);
    this.url = [];
    this.moduleType = mType;
}

Obj.prototype = {
    addEle : function(){
        if(this.moduleType == 'text')this.elm = this.textModule();
        if(this.moduleType == 'image')this.elm = this.imageModule();
    },
    textModule : function(){
        var elm = '\
<element>\
    <text>\
        <value>\r\r'+this.txt+'\r\r</value>\
        <hidden_value>'+this.txt+'</hidden_value>\
        <hidden_display></hidden_display>\
        <align>left</align>\
        <class>'+this.txtClass+'</class>\
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

function EditPara(textFrame){
    this.textFrame = textFrame;
    this.textStyle = textFrame.textStyleRanges;
    this.textStyleL = textFrame.textStyleRanges.length;
    this.txt = '';
};
EditPara.prototype = {
    getTxtClass : function (textFrame){
        var charcter = new Character();
        var contentParaStyle = textFrame.paragraphs[0].appliedParagraphStyle;
        var fontSize = charcter.fontSize(contentParaStyle);
        var color = 'Gray';
        if(charcter.fontColor(contentParaStyle).toString() =='0,0,0,0'){color = 'White'};
        if (fontSize == 18 )return 'headOne' + color;
        if (fontSize == 24 )return 'headTwo' + color;
        if (fontSize == 36 )return 'headThree' + color;
        return 'bodyText' + color;
    },
    addTag : function(){
        var type = this.textFrame.paragraphs[0].appliedParagraphStyle.name;
        var content = this.tagInline();
        // if(type.indexOf('Product') >= 0){
        //     this.tagDiv();
        // }else{
        //     this.tagBr();
        // };
        return content;
    },
    addSpan : function(content){
        var charcter = new Character();
        var contentParaStyle = content.paragraphs[0].appliedParagraphStyle;
        if(charcter.fontStyle(content) != '[なし]'){
            var getCSS = {
                fontWeight : function(){
                    if(charcter.fontName(contentParaStyle) != charcter.fontName(content)){
                        if(charcter.fontWeight(content)){
                            return 'font-weight: bold;';
                        }else{
                            return 'font-weight: normal;';
                        }
                    }
                },
                fontSize : function(){
                    if(charcter.fontSize(contentParaStyle) != charcter.fontSize(content)){
                        return 'font-size: '+charcter.fontSize(content)+'px;';
                    }else if(charcter.fontScale(content.paragraphs[0]) != charcter.fontScale(content)){
                        return 'font-size: '+charcter.fontScale(content)/100+'em;';
                    }
                },
                lineHeight : function(){
                    if(charcter.fontLeading(contentParaStyle) != charcter.fontLeading(content)){
                        return 'line-hegiht'+charcter.fontLeading(content)+';';
                    }
                },
                fontDeco : function(){
                    if(charcter.fontDeco(contentParaStyle) != charcter.fontDeco(content)){
                        if(~charcter.fontDeco(content)){
                            return 'text-decoration: line-through;';
                        }
                    }
                }
            }
            var cssStyle = [getCSS.fontWeight(),getCSS.fontSize(),getCSS.lineHeight(),getCSS.fontDeco()];

            var tagText = '<span style="' + cssStyle.join('') + '">' + content.contents + '</span>'
            tagText = tagText.replace('\r</span>','</span>\r')
            // alert(tagText);
            if(cssStyle.join('') != ''){return tagText;}else{return content.contents}
        } else {return content.contents}
    },
    addDiv : function(text,blockObj){
        var txtclass = this.getTxtClass(this.textFrame);
        var charcter = new Character();
        var getCSS = {
            fontWeight : function(){
                var value = charcter.fontWeight(blockObj.appliedParagraphStyle)
                if(~txtclass.indexOf('bodyText') && value){return 'font-weight: bold;'}
            },
            fontSize : function(){
                var value = charcter.fontSize(blockObj.appliedParagraphStyle)
                if(~txtclass.indexOf('bodyText') && value != 12){return 'font-size: ' + value + 'px;'}
            },
            lineHeight : function(){
                var value = charcter.fontLeading(blockObj.appliedParagraphStyle)
                if(~txtclass.indexOf('bodyText') && value != 18){return 'line-height: ' + value + 'px;'};
                if(~txtclass.indexOf('headOne') && value != 20){return 'line-height: ' + value + 'px;'};
                if(~txtclass.indexOf('headTwo') && value != 28){return 'line-height: ' + value + 'px;'};
                if(~txtclass.indexOf('headThree') && value != 45){return 'line-height: ' + value + 'px;'};
            },
        }
        var cssStyle = [getCSS.fontWeight(),getCSS.fontSize(),getCSS.lineHeight()];
        var tagText = '<div style="'+cssStyle.join('')+'">'+text+'</div>'
        tagText = tagText.replace('\r</div>','</div>\r')
        if(cssStyle.join('') !=''){return tagText;}else{return text};
    },
    tagInline : function(){
        var blocks = [''];
        for (var i = 0; i < this.textStyleL; i++) {
            var textStyleParaName = this.textStyle[i].paragraphs[0].appliedParagraphStyle.name;
            var textStyleCharName = this.textStyle[i].appliedCharacterStyle.name;
            // 末尾処理
            var brakeL = this.textStyle[i].contents.split('\r').length-1;
            if(i+1 == this.textStyleL){brakeL += 2};
            // span処理
            blocks[i] = this.addSpan(this.textStyle[i]);
            blocks[i] = blocks[i].replace(/^\r/gm,'<br>\r').replace(/\r([^$])/g,'<br>\r$1');
            // alert(blocks[i]);
            if(i != 0 && this.textStyle[i-1].contents.split('\r').length-1 == 0){
            // if(i != 0 && this.textStyle[i].appliedParagraphStyle.name == this.textStyle[i-1].appliedParagraphStyle.name){
                alert(blocks[i-1]);
                blocks[i] = blocks[i-1] + this.addSpan(this.textStyle[i]);
                blocks[i-1] = '';
                // alert(i+':'+blocks[i-1] + this.textStyle[i].contents);
            }
            // div処理
            if(brakeL){
                blocks[i] = this.addDiv(blocks[i],this.textStyle[i]);
            }
            // alert(blocks[i]);
        };

// blocks[i]にaddSpanで終了
// blocks[i]とblocks[i-1]が同じ名前ならblocks[i-1]='',blocks[i-1]+blocks[i]
// blocks[i]とblocks[i+1]が同じ名前ならblock

// blocks[i]とblocks[i+1]が違う名前ならaddDiv



        // msg.alert(blocks.join(''));
        return blocks.join('')
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
    },
    console : function(elm){
        $.write(elm);
    }
}

var msg = new Msg();
var obj = [];
var elm = '';
for (var i = 0; i < sel.length; i++) {
    obj[i] = new Obj(sel[i],'text');
    obj[i].addEle();
    elm += obj[i].elm;
};

msg.alert(elm);
// msg.dialog(elm);
