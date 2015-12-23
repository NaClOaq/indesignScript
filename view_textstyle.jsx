/**************************************************************************/
/*              段落スタイル・文字スタイルの適用状況を表示する            */
/*                                                            by お～まち */
/*                                               2009.04.30  Version 1.01 */
/**************************************************************************/
app.scriptPreferences.userInteractionLevel=UserInteractionLevels.interactWithAll;
if (app.documents.length == 0) {
	alert("ドキュメントを開いてください");
} else {
	var doc = app.activeDocument;
	if (doc.paragraphStyles.itemByName("[基本段落]").underline == true) {
		remove_line(doc);
	} else {
		add_line(doc);
	}
}

function remove_line(doc){
	var dlg = app.dialogs.add({name: "テキストスタイル適用情報の解除"});
	with (dlg.dialogColumns.add()){
		with (dialogRows.add()){
			var ch1 = enablingGroups.add({checkedState: true, staticLabel: "テキストスタイル適用情報の削除"})
		}
	}
	with (ch1.dialogColumns.add()){
		with (dialogRows.add()){
			var ch2 = checkboxControls.add({checkedState: false, staticLabel: "作業用スウォッチも削除する"})
		}
	}
	if (dlg.show() == false){dlg.destroy(); return;}
	if (ch1.checkedState == false){dlg.destroy(); return;}
	
	var dya = doc.strokeStyles.itemByName ("ホワイトダイヤモンド");
	for (i=0; i<doc.paragraphStyles.length; i++){
		if (doc.paragraphStyles[i].underline == true &&
			doc.paragraphStyles[i].underlineType == dya) {
			doc.paragraphStyles[i].underlineColor = doc.paragraphStyles[i].fillColor;
			doc.paragraphStyles[i].underline = false;
		}
	}
	for (i=0; i<doc.characterStyles.length; i++){
		if (doc.characterStyles[i].strikeThru == true &&
			doc.characterStyles[i].strikeThroughType == dya) {
			doc.characterStyles[i].strikeThroughColor = doc.characterStyles[i].fillColor;
			doc.characterStyles[i].strikeThru = false;
		}
	}
	if (ch2.checkedState == true) {
		for ( i=doc.swatches.length-1; i>-1; i--) {
			if (doc.swatches[i].name.substr(0,3) == "段落＞" ||
				doc.swatches[i].name.substr(0,3)  == "文字＞") {
					doc.swatches[i].remove();
			}
		}
	}
	dlg.destroy();
}

function add_line(doc){
	var dlg = app.dialogs.add({name: "テキストスタイル適用情報の表示設定"});
	with (dlg.dialogColumns.add()){
		with (dialogRows.add()){
			var ch1 = checkboxControls.add({checkedState: true, staticLabel: "段落スタイルに適用"})
		}
		with (dialogRows.add()){
			var ch2 = checkboxControls.add({checkedState: true, staticLabel: "文字スタイルに適用"})
		}
	}
	if (dlg.show() == false){dlg.destroy(); return;}
	if (ch1.checkedState == false && ch2.checkedState == false){dlg.destroy(); return;}
	
	pcount = doc.paragraphStyles.length
	//段落スタイル
	if (ch1.checkedState == true){
		for (i=0; i<pcount; i++){
			if (doc.paragraphStyles[i].name != "[段落スタイルなし]"){
				cname = "段落＞" + doc.paragraphStyles[i].name.replace(/\[/,"").replace(/\]/,"");
				if (doc.swatches.itemByName(cname) == null) {
					var cl = doc.colors.add();
					cl.name = cname;
					cl.model = 1936748404; //スポットカラー
					cl.space = 1666336578; //RGBカラー
					cl.colorValue = setColor(i);
				}
				with (doc.paragraphStyles[i]) {
					underlineType = "ホワイトダイヤモンド";
					underlineColor = cname;
					underlineTint = 100;
					underlineWeight = "2mm";
					underlineOffset = "0mm";
					underline = true;
				}
			}
		}
	}
	//文字スタイル
	if (ch2.checkedState == true){
		for (i=0; i<doc.characterStyles.length; i++){
			if (doc.characterStyles[i].name != "[なし]"){
				cname = "文字＞" + doc.characterStyles[i].name.replace(/\[/,"").replace(/\]/,"");
				if (doc.swatches.itemByName(cname) == null) {
					var cl = doc.colors.add();
					cl.name = cname;
					cl.model = 1936748404; //スポットカラー
					cl.space = 1666336578; //RGBカラー
					cl.colorValue = setColor(pcount + i);
				}
				with (doc.characterStyles[i]) {
					strikeThroughType = "ホワイトダイヤモンド";
					strikeThroughColor = cname;
					strikeThroughTint = 100;
					strikeThroughWeight = "2mm";
					strikeThroughOffset = "2mm";
					strikeThru = true;
				}
			}
		}
	}
	dlg.destroy();
}

function setColor(i) {
	myColor = new Array();
	i = i % 57;
	if (i == 0) myColor = [0,0,135];	//ダークブルー
	if (i == 1) myColor = [156,255,156];	//若菜色
	if (i == 2) myColor = [153,0,0];	//赤茶色
	if (i == 3) myColor = [235,217,173];	//小麦色
	if (i == 4) myColor = [0,181,212];	//アクア色
	if (i == 5) myColor = [255,0,221];	//紅紫色
	if (i == 6) myColor = [253,255,199];	//カナリヤ色
	if (i == 7) myColor = [0,179,5];	//森林色
	if (i == 8) myColor = [19,19,103];	//ミッドナイト色
	if (i == 9) myColor = [153,0,51];	//暗紅色
	if (i == 10) myColor = [192,241,255];	//シトラス色
	if (i == 11) myColor = [207,130,181];	//乳紫色
	if (i == 12) myColor = [210,255,0];	//レモン色
	if (i == 13) myColor = [225,248,255];	//エーテル
	if (i == 14) myColor = [239,219,247];	//菖蒲色
	if (i == 15) myColor = [169,255,0];	//電解質
	if (i == 16) myColor = [79,153,255];	//ライトブルー
	if (i == 17) myColor = [255,153,204];	//ピンク
	if (i == 18) myColor = [215,208,202];	//スモーク色
	if (i == 19) myColor = [153,204,0];	//若草色
	if (i == 20) myColor = [122,186,217];	//スカイブルー
	if (i == 21) myColor = [247,89,107];	//いちご
	if (i == 22) myColor = [255,153,153];	//ピーチ
	if (i == 23) myColor = [137,255,0];	//ライム色
	if (i == 24) myColor = [153,153,255];	//ラベンダー
	if (i == 25) myColor = [218,216,251];	//ブルーベリー色
	if (i == 26) myColor = [153,51,0];	//茶色
	if (i == 27) myColor = [231,247,222];	//モスグリーン
	if (i == 28) myColor = [89,82,162];	//石板色
	if (i == 29) myColor = [247,231,231];	//カーネーション色
	if (i == 30) myColor = [140,166,107];	//鶯色
	if (i == 31) myColor = [153,51,255];	//すみれ色
	if (i == 32) myColor = [102,22,22];	//モカ色
	if (i == 33) myColor = [102,102,0];	//黄緑色
	if (i == 34) myColor = [171,163,181];	//藤紫
	if (i == 35) myColor = [143,0,145];	//茄子紺色
	if (i == 36) myColor = [255,102,0];	//オレンジ
	if (i == 37) myColor = [0,84,0];	//ダークグリーン
	if (i == 38) myColor = [102,0,102];	//紫色
	if (i == 39) myColor = [153,102,0];	//黄土色
	if (i == 40) myColor = [0,153,153];	//濃青緑色
	if (i == 41) myColor = [204,0,255];	//葡萄色
	if (i == 42) myColor = [255,153,0];	//金色
	if (i == 43) myColor = [0,255,195];	//翡翠色
	if (i == 44) myColor = [255,181,107];	//ほおずき色
	if (i == 45) myColor = [130,207,194];	//ベイビーブルー
	if (i == 46) myColor = [215,193,1];	//辛子色
	if (i == 47) myColor = [2,100,132];	//群青色
	if (i == 48) myColor = [204,153,102];	//黄褐色
	if (i == 49) myColor = [0,255,255];	//シアン
	if (i == 50) myColor = [247,244,199];	//コーンスターチ
	if (i == 51) myColor = [79,255,79];	//緑
	if (i == 52) myColor = [255,79,255];	//マゼンタ
	if (i == 53) myColor = [255,255,79];	//イエロー
	if (i == 54) myColor = [0,0,255];	//青
	if (i == 55) myColor = [255,0,0];	//赤
	if (i == 56) myColor = [207,207,130];	//ミルキー
	return myColor;
}