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
    fontAlign : function(cha){return cha.justification.toString().match('CENTER') || cha.justification.toString().match('RIGHT') || 'LEFT'},// 揃え
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
    this.objLable = this.getLable();//{url:[], art:[]], css:[], width[]}
    // alert(this.objLable.url[1]);
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
            if(key.match(/(url)|(art)|(css)|(width)|(img)|(alt)|(height)/)){
                objLable[key] || (objLable[key] = []);
                objLable[key].push(value);
            }
        }
        return objLable;
    },
    getURL : function(){
        var tsr = this.f.textStyleRanges;
        var text = [];
        var url = this.objLable.url;
        var array = []
        for (var i = 0; i < tsr.length; i++) {
            // alert(tsr.length);
            if(tsr[i].appliedCharacterStyle.name == 'リンクテキスト'){text.push(tsr[i].contents);}
        };
        
        for (var i = 0; i < text.length; i++) {
            array[i] = {"linkText":text[i],"linkURL":url[i].replace('\r','')};
        };
        return array;
    },
    mType : function(){
        // if(this.f.label.match(/^art/)) return 'product';
        if(this.objLable.img) return 'image';
        if(this.objLable.art) return 'product';
        else return 'text';
    },
    addEle : function(){
        if(this.moduleType == 'text')return this.textModule();
        if(this.moduleType == 'product')return this.productModule();
        if(this.moduleType == 'image')return this.imageModule();
    },
    productModule : function (){
        editPM = new EditProductModule();
        this.art = this.objLable.art[0];
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
            <product>'+this.art+'</product>\
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
        this.urlNo = 0;
        editTM = new EditTextModule(this.f,this.objLable);
        this.txtClass = editTM.getTxtClass(this.f);
        this.txt = editTM.addTag(this.txtClass);
        character = new Character();
        this.align = character.fontAlign(this.f.paragraphs[0]).toString().toLowerCase();
        this.width = (function(labelWidth,objWidth,align){
            if(align != 'left' && labelWidth){return labelWidth};
            if(align != 'left'){return objWidth};
            if(!labelWidth){return ''};
            if(labelWidth[0] == ''){return objWidth;};
            if(labelWidth[0] != ''){return labelWidth[0];};
        })(this.objLable.width,this.w,this.align);
        this.links = this.getURL();

        // this.links = [{'linkText':'詳細を見る >','linkURL':'http://www.ikea.com/'},{'linkText':'詳細を見る >','linkURL':'http://www.ikea.com/'}];

        for (var i = 0; i < this.links.length; i++) {
            this.links[i] = '    <links_module>\
        <link_text>'+this.links[i].linkText+'</link_text>\
        <noFollow></noFollow>\
        <link_url>'+this.links[i].linkURL+'</link_url>\
        <displaymode></displaymode>\
    </links_module>';
        };
        this.linkElem = this.links.join('\n') && '<link>\n'+this.links.join('\n')+'\n</link>';
        var elm = '\
<element>\
    <text>\
        <value>'+this.txt+'</value>\
        <hidden_value>'+this.txt+'</hidden_value>\
        <hidden_display></hidden_display>\
        <align>'+this.align+'</align>\
        <class>'+this.txtClass+'</class>\
        <height></height>\
        <width>'+this.width+'</width>\
        <x>'+this.x1+'</x>\
        <y>'+this.y1+'</y>\
        <layer></layer>\
        '+this.linkElem+'\
    </text>\
</element>\
        ';
    return elm;
    },
    imageModule : function (){
        this.objLable.alt = this.objLable.alt || (this.objLable.alt = ['']);
        this.objLable.width = this.objLable.width || (this.objLable.width = ['']);
        this.objLable.height = this.objLable.height || (this.objLable.height = ['']);
        var elm = '\
<element>\
    <image>\
        <source></source>\
        <alt>'+this.objLable.alt[0].replace(/[\r\n]/,'')+'</alt>\
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
    this.urlNo = 0;
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
        var charcter = new Character();
        var text = content.contents.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        if(content.appliedCharacterStyle.name == 'リンクテキスト'){
            text = text.replace(/.*/,'{'+this.urlNo+'}');
            alert(content.contents);
            this.urlNo++;
        }
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
            var tagText = '&lt;span style="' + cssStyle.join('') + '"&gt;' + text + '&lt;/span&gt;';
            tagText = tagText.replace('\r&lt;/span&gt;','&lt;/span&gt;\r');

            if(cssStyle.join('') !== ''){return tagText;}else{return text}
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
            },
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
                blocks[i] = blocks[i-1] + blocks[i];
                blocks[i-1] = '';
            }
            // div処理
            if(typeof blocksObj[i+1] == 'undefined'){
                blocks[i] = this.addDiv(blocks[i],blocksObj[i]);
            }else if(blocksObj[i].appliedParagraphStyle.name != blocksObj[i+1].appliedParagraphStyle.name){
                blocks[i] = this.addDiv(blocks[i],blocksObj[i]);
            }

        }

        // msg.alert(blocks.join(''));
        if(this.objLable.css){
            return '&lt;div style="'+this.objLable.css.join('')+'"&gt;'+blocks.join('')+'&lt;/div&gt;';
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