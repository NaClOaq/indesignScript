// visibleBounds ボーダーを含む場合[左上のy座標、左上のx座標、右下のy座標、右下のx座標]
// geometricBounds　ボーダーを含まない場合[左上のy座標、左上のx座標、右下のy座標、右下のx座標]
function Character(){
}
Character.prototype = {
    fontName :function(cha){return cha.appliedFont.name;},
    fontWeight :function(cha){return ~cha.appliedFont.name.indexOf('B');},// Boolean
    fontStyle :function(cha){return cha.appliedCharacterStyle.name;},
    fontSize : function(cha){return cha.pointSize;},
    fontLeading :function(cha){return cha.leading;},
    fontScale : function(cha){return cha.verticalScale;},//　倍率
    fontCha : function(cha){return cha.contents;},
    fontDeco : function(cha){return cha.strikeThroughWeight;},// 打ち消し線
    fontColor :function(cha){return cha.fillColor.colorValue;},// font-color(CMYK)
    fontMBottom : function(cha){return cha.spaceAfter;},// 段落後のアキ
    fontMTop : function(cha){return cha.spaceBefore;},// 段落前のアキ
};

function Obj(frame){
    this.f = frame;
    var s = frame.visibleBounds;
    this.y1 = s[0];
    this.x1 = s[1];
    this.y2 = s[2];
    this.x2 = s[3];
    this.h = Math.round(this.y2-this.y1);
    this.w = Math.round(this.x2-this.x1);
    this.y1 = Math.round(s[0]);
    this.x1 = Math.round(s[1]);
    this.y2 = this.y1 + this.h;
    this.x2 = this.x1 + this.w;
    this.objLable = this.getLable();//{URL:[], article:[]], CSS:[], width[]}
    // alert(this.objLable.URL[1]);
    this.moduleType = this.mType();
    this.xmlElement = this.addEle();
}

Obj.prototype = {

    getLable : function(){
        var label = this.f.label.split("\n");
        var objLable = {};
        for (var i = 0; i < label.length; i++) {
            var key = label[i].replace(/^(.*?) *: *(.*)$/g,'$1');
            var value = RegExp.$2;
            if(key.match(/(URL)|(article)|(CSS)|(width)/)){
                objLable[key] || (objLable[key] = []);
                objLable[key].push(value);
            }
        }
        return objLable;
    },
    mType : function(){
        // if(this.f.label.match(/^article:/)) return 'product';
        if(this.objLable.article) return 'product';
        else return 'text';
    },
    addEle : function(){
        if(this.moduleType == 'text')return this.textModule();
        if(this.moduleType == 'product')return this.productModule();
        if(this.moduleType == 'image')return this.imageModule();
    },
    productModule : function (){
        editPM = new EditProductModule();
        this.article = this.objLable.article[0];
        this.txtClass = editPM.getTxtClass(this.f);
        var elm = '\
<element>\
    <product>\
        <class>'+this.txtClass+'</class>\
        <x>'+this.x1+'</x>\
        <y>'+this.y1+'</y>\
        <layer>\
        </layer>\
        <link>\
            <product>'+this.article+'</product>\
            <global_article_num>\
            </global_article_num>\
        </link>\
        <product_seperator>,</product_seperator>\
    </product>\
</element>\
        ';
    return elm;
    },
    textModule : function(){
        var adj = 5;
        this.y1 = Math.round(this.y1)+adj;
        this.x1 = Math.round(this.x1)+adj;
        editTM = new EditTextModule(this.f,this.objLable);
        this.txtClass = editTM.getTxtClass(this.f);
        this.txt = editTM.addTag(this.txtClass);
        this.url = [];
        this.width = (function(labelWidth,objWidth){
            if(typeof labelWidth == 'undefined'){return ''};
            if(labelWidth && (labelWidth[0] == '')){return objWidth;};
            if(labelWidth && (labelWidth[0] != '')){return labelWidth[0];};
        })(this.objLable.width,this.w);
        var elm = '\
<element>\
    <text>\
        <value>'+this.txt+'</value>\
        <hidden_value>'+this.txt+'</hidden_value>\
        <hidden_display></hidden_display>\
        <align>left</align>\
        <class>'+this.txtClass+'</class>\
        <height></height>\
        <width>'+this.width+'</width>\
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
};






function EditProductModule(){}
EditProductModule.prototype = {
    getTxtClass : function(textFrame){
        var color = 'B';
        var charcter = new Character();
        var contentParaStyle = textFrame.paragraphs[0].appliedParagraphStyle;
        for (var i = 0; i < textFrame.paragraphs.length; i++) {
            if(textFrame.paragraphs[i].appliedParagraphStyle.name.match('PM_ItemPrice')){// 判定注意
                contentParaStyle = textFrame.paragraphs[i].appliedParagraphStyle;
            }
        }
        if(charcter.fontColor(contentParaStyle).toString() =='0,0,0,0'){color = 'W';}
        if(charcter.fontSize(contentParaStyle) == 36)return 'prodStyle3_'+color;
        if(charcter.fontSize(contentParaStyle) == 24)return 'prodStyle2_'+color;
        if(charcter.fontSize(contentParaStyle) == 18)return 'prodStyle1_'+color;
        return 'prodStyle1_' + color;
    }
};




function EditTextModule(textFrame,objLable){
    this.textFrame = textFrame;
    this.textStyle = textFrame.textStyleRanges;
    this.textStyleL = textFrame.textStyleRanges.length;
    this.txt = '';
    this.objLable = objLable;
}
EditTextModule.prototype = {
    getTxtClass : function (textFrame){
        var charcter = new Character();
        var contentParaStyle = textFrame.paragraphs[0].appliedParagraphStyle;
        var fontSize = charcter.fontSize(contentParaStyle);
        var color = 'Gray';
        if(charcter.fontColor(contentParaStyle).toString() =='0,0,0,0'){color = 'White';}
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
        // 実体参照
        var text = content.contents.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        var charcter = new Character();
        var contentParaStyle = content.paragraphs[0].appliedParagraphStyle;
        if(charcter.fontStyle(content) != '[なし]'){// 判定注意
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
            };
            var cssStyle = [getCSS.fontWeight(),getCSS.fontSize(),getCSS.lineHeight(),getCSS.fontDeco()];
            var tagText = '&lt;span style="' + cssStyle.join('') + '">' + text + '&lt;/span&gt;';

            tagText = tagText.replace('\r&lt;/span&gt;','&lt;/span&gt;\r');
            if(cssStyle.join('') !== ''){return tagText;}else{return content.contents;}
        } else {return text;}
    },
    addDiv : function(text,blockObj){
        var txtclass = this.getTxtClass(this.textFrame);
        var charcter = new Character();
        var getCSS = {
            fontWeight : function(){
                var value = charcter.fontWeight(blockObj.appliedParagraphStyle);
                if(~txtclass.indexOf('bodyText') && value){return 'font-weight: bold;';}
            },
            fontSize : function(){
                var value = charcter.fontSize(blockObj.appliedParagraphStyle);
                if(~txtclass.indexOf('bodyText') && value != 12){return 'font-size: ' + value + 'px;';}
            },
            lineHeight : function(){
                var value = charcter.fontLeading(blockObj.appliedParagraphStyle);
                if(~txtclass.indexOf('bodyText') && value != 18){return 'line-height: ' + value + 'px;';}
                if(~txtclass.indexOf('headOne') && value != 20){return 'line-height: ' + value + 'px;';}
                if(~txtclass.indexOf('headTwo') && value != 28){return 'line-height: ' + value + 'px;';}
                if(~txtclass.indexOf('headThree') && value != 45){return 'line-height: ' + value + 'px;';}
            },
            margineTop : function(){
                var value = charcter.fontMTop(blockObj.appliedParagraphStyle);
                value = value && (value+'px');
                if(value){return 'margin-top: '+value+';';}
            },
            margineBottom : function(){
                var value = charcter.fontMBottom(blockObj.appliedParagraphStyle);
                value = value && (value+'px');
                if(value){return 'margin-bottom: '+value+';';}
            }
        };
        var cssStyle = [getCSS.fontWeight(),getCSS.fontSize(),getCSS.lineHeight(),getCSS.margineTop(),getCSS.margineBottom()];
        var tagText = '&lt;div style="'+cssStyle.join('')+'"&gt;'+text+'&lt;/div&gt;';
        tagText = tagText.replace('\r&lt;/div&gt;','&lt;/div&gt;\r');
        if(cssStyle.join('') !==''){return tagText;}else{return text;}
    },
    tagInline : function(){
        var blocks = [''];
        var blocksObj = [];
        //テキストオブジェクト取得
        for (var i = 0; i < this.textStyle.length; i++) {
            blocksObj[i] = this.textStyle[i];
        }
        for (var i = 0; i < blocksObj.length; i++) {
            var textStyleParaName = blocksObj[i].paragraphs[0].appliedParagraphStyle.name;
            var textStyleCharName = blocksObj[i].appliedCharacterStyle.name;
            // span処理
            blocks[i] = this.addSpan(blocksObj[i]);
            // br処理
            blocks[i] = blocks[i].replace(/\r([^$])/g,'&lt;br&gt;\r$1');
            if(typeof blocksObj[i+1] != 'undefined' && blocksObj[i].appliedParagraphStyle.name == blocksObj[i+1].appliedParagraphStyle.name){
                blocks[i] = blocks[i].replace(/\r$/,'&lt;br&gt;\r');
            }
            // inline結合
            // if(i != 0 && blocksObj[i-1].contents.split('\r').length-1 == 0){
            if(i != 0 && blocksObj[i].appliedParagraphStyle.name == blocksObj[i-1].appliedParagraphStyle.name){
                blocks[i] = blocks[i-1] + this.addSpan(blocksObj[i]);
                blocks[i-1] = '';
            }
            // div処理
            if(typeof blocksObj[i+1] == 'undefined'){
                blocks[i] = this.addDiv(blocks[i],blocksObj[i]);
            }else if(blocksObj[i].appliedParagraphStyle.name != blocksObj[i+1].appliedParagraphStyle.name){
                blocks[i] = this.addDiv(blocks[i],blocksObj[i]);
            }

            // alert(blocks[i]);
        }

        // msg.alert(blocks.join(''));
        if(this.objLable.CSS){
            return '&lt;div style="'+this.objLable.CSS.join('')+'"&gt;'+blocks.join('')+'&lt;/div&gt;';
        }else{
            return blocks.join('');
        }
        
    },
};














function Msg(){}
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
};




var sel = app.activeDocument.selection;
var msg = new Msg();
var obj = [];
var elm = '';
for (var i = 0; i < sel.length; i++) {
    obj[i] = new Obj(sel[i]);
    // obj[i].addEle();this.xmlElement
    elm += obj[i].xmlElement;
}
msg.alert(elm);
// msg.dialog(elm);