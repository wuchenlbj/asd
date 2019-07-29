/*
 * @Author: 高年蒙 
 * @Date: 2018-04-09 00:43:28 
 * @Last Modified by: 高年蒙
 * @Last Modified time: 2018-04-11 11:19:37
 * @Descriptions: 导出Excel文件公共方法及xml模板变量(其实可以用标签函数实现更好，懒得改了)
 */

// 'use strict'
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
String.prototype.trimXml = function () {
  return this.replace(/\r\n/g, '').replace(/\n/g, '').replace(/>\s+</g, '> <').trim();
};
/**
 * 获取单元格中具有上下标元素的文本（主要用在表头内容的处理）
 * @param {String} sHtml 具有上下标标志（sup,sub）的字串
 * @param {String} sptType 上下标标志（sup,sub）
 */
const splitScriptText = (sHtml, sptType) => {
  let sReg = new RegExp(`<${sptType}`, 'im')
  let eReg = new RegExp(`<\\/${sptType}`, 'im')
  let txtReg = new RegExp(`<${sptType}.*?>(.*?)<\\/${sptType}>`, 'im')
  let sIndex = sHtml.search(sReg)
  let eIndex = sHtml.search(eReg)
  let sptText = txtReg.exec(sHtml)[1]
  return {
    sIndex,
    eIndex,
    sptText
  }
}
/**
 * 实现单元格内上下标的循环处理
 * @param {String} unesItem 要处理的单元格内容
 */
const getScriptXml = (unesItem) => {
  let boldFlag = unesItem.includes('#B#') ? '<b/>' : '';
  unesItem = unesItem.replace('#B#', '');
  let pReg = unesItem.search(/<sup/im);
  let bReg = unesItem.search(/<sub/im);
  let sptType = pReg < bReg ? pReg == -1 ? 'sub' : 'sup' : bReg == -1 ? 'sup' : 'sub';// 根据上下标的位置确定先处理哪种
  let splitObj = splitScriptText(unesItem, sptType);
  let htmlReg = new RegExp(/<(.[^>]*)>/igm);// 文本内的HTML要去掉
  let preText = unesItem.substring(0, parseInt(splitObj.sIndex)).replace(htmlReg, '').trim();// 字串前部分
  let nextText = unesItem.substring(parseInt(splitObj.eIndex) + 6);
  let partXml = `<r><rPr>${boldFlag}<sz val="12"/><color theme="1"/><rFont val="宋体"/><family val="3"/><charset val="134"/></rPr><t>${preText}</t></r>`;
  sptType = sptType === 'sub' ? 'subscript' : 'superscript';
  partXml += `<r><rPr>${boldFlag}<vertAlign val="${sptType}"/><sz val="12"/><color theme="1"/><rFont val="宋体"/><family val="3"/><charset val="134"/></rPr><t>${splitObj.sptText}</t></r>`;
  if (nextText.length > 0) {
    if (nextText.includes('<sub') || nextText.includes('<sup')) // 如果后面的字串还有上下标则递归
      partXml += getScriptXml(nextText + (boldFlag != '' ? '#B#' : ''));
    else
      partXml += `<r><rPr>${boldFlag}<sz val="12"/><color theme="1"/><rFont val="宋体"/><family val="3"/><charset val="134"/></rPr><t>${nextText.replace(htmlReg, '').trim()}</t></r>`;
  }
  return partXml
}
/**
 * 实现sharedString.xml中核心内容的生成
 * @param {String} shrString 各单元格共享的文本内容(已转义)
 */
const assistSharedString = (shrArray) => {
  // <si><t>${xml.cntStr.join('</t></si><si><t>')}</t></si>
  let shrXml = '';
  if (shrArray.join('').includes('&lt;sub') || shrArray.join('').includes('&lt;sup')) { // 如果有上下标内容
    shrArray.forEach((item, index) => {
      let unesItem = unescapeXML(item);//
      if (unesItem.includes('<sub') || unesItem.includes('<sup')) {// 当前单元格内容有上下标
        shrXml += `<si>${getScriptXml(unesItem)}</si>`;
      } else {
        shrXml += `<si><t>${item}</t></si>`;
      }
    });
  } else { // 如果没有则直接拼接
    shrXml = `<si><t>${shrArray.join('</t></si><si><t>')}</t></si>`.trimXml();
  }
  return shrXml;
}
export const Constants = {
  /**
   * 表格列的默认最大宽度，超过此宽度要配置自动换行并调整行高
   */
  clmnWidth: 80,
  /**
   * 单元格内容如果是数字，则根据此格式进行转换
   */
  numFmts: ['General', '0', '0.00', '#,##0', '#,##0.00', , , , , '0%', '0.00%', '0.00E+00', '# ?/?', '# ??/??', 'mm-dd-yy', 'd-mmm-yy', 'd-mmm', 'mmm-yy', 'h:mm AM/PM', 'h:mm:ss AM/PM',
    'h:mm', 'h:mm:ss', 'm/d/yy h:mm', , , , , , , , , , , , , , , '#,##0 ;(#,##0)', '#,##0 ;[Red](#,##0)', '#,##0.00;(#,##0.00)', '#,##0.00;[Red](#,##0.00)', , , , , 'mm:ss', '[h]:mm:ss', 'mmss.0', '##0.0E+0', '@'],
  /**
   * workSheet.xml模板，参数为对象，内容如下：
   * 参1：列范围结束值
   * 参2：默认要显示的sheet索引
   * 参3：相关列地应的列宽配置xml
   * 参4：sheet对应的xml
   */
  workSheetTlp: (xml) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" 
      xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
      xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
      mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">
        <dimension ref="A1:${xml.nfClmn}"/><sheetViews><sheetView ${xml.shvName}
        workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="25" x14ac:dyDescent="0.25"/>
        ${xml.clmnXml}
        <sheetData>
          ${xml.shtData}
        </sheetData>`.trimXml();
  },
  /**
   * Sheet页的页面布局配置
   */
  pgMgrns: '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>',
  /**
   * 页面中数据表格为table模式时,在sheet中要添加的内容模板
   */
  tbPartTlp: '<tableParts count="1"><tablePart r:id="rId1"/></tableParts>',

  /**
   * .rels文件模板
   */
  relTlp: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
          <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
          <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
          <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,

  /**
   * them.xml文件模板
   */
  themTlp: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS P????"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS P????"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:shade val="93000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`,
  /**
   * core.xml模板，参数为对象，内容如下
   * 参1：文件基本信息
   */
  coreTlp: (file) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties 
    xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" 
    xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" 
    xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <dc:creator>${file.creator || '靶点软件'}</dc:creator><cp:lastModifiedBy>${file.lastModifiedBy || '靶点软件'}</cp:lastModifiedBy>
    <dcterms:created xsi:type="dcterms:W3CDTF">${(file.created || new Date()).toISOString()}</dcterms:created>
    <dcterms:modified xsi:type="dcterms:W3CDTF">${(file.modified || new Date()).toISOString()}</dcterms:modified></cp:coreProperties>`.trimXml();
  },
  /**
   * 页面中数据表格为table模式时的table.xml模板头部，参数为对象，内容如下
   * 参1：table的ID号
   * 参2：table单元格的范围
   * 参3：table单元格的列数
   */
  stbxmlTlp: (xml) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="${xml.id}"
        name="Table${xml.id}" displayName="Table${xml.id}" ref="A1:${xml.nfClmn}" totalsRowShown="0">
        <autoFilter ref="A1:${xml.nfClmn}"/><tableColumns count="${xml.clmnCount}">`.trimXml();
  },
  /**
   * 页面中数据表格为table模式时的table.xml模板尾部
   */
  etbxmlTlp: '</tableColumns><tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>',
  /**
   * 页面中数据表格为table模式时的xml.rels模板
   * 参1：table的ID号
   */
  tbrelTlp: (id) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" 
      Target="../tables/table${id}.xml"/></Relationships>`.trimXml();
  },
  /**
   * styles.xml文件对应的模板，参数为对象，内容如下
   * 参1：单元格内容格式要求
   * 参2：字体内容
   * 参3：默认字体大小
   * 参4：默认字体
   * 参5：单元格边框样式
   * 参6：样式详细内容
   */
  styleTlp: (xml) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" 
      xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
      mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">
      ${xml.clmnFrmt} <fonts count="${xml.fonts.length}" x14ac:knownFonts="1"><font><sz val="${xml.fontSize}"/>
      <color theme="1"/><name val="${xml.fontName}"/><family val="2"/>
      <scheme val="minor"/></font>${xml.fonts.join('')}</fonts><fills count="2"><fill><patternFill patternType="none"/></fill>
      <fill><patternFill patternType="gray125"/></fill></fills><borders count="${xml.borders.length}">
      <border><left/><right/><top/><bottom/><diagonal/></border>${xml.borders.join('')}</borders><cellStyleXfs count="1">
      <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xml.styles.length}">
      <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>${xml.styles.join('')}</cellXfs><cellStyles count="1">
      <cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/>
     <tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>
     <extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">
     <x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext></extLst></styleSheet>`.trimXml();
  },
  /**
   * [Content_Types].xml文件对应的模板，参数为对象，内容如下
   * 参1：table内容格式要求
   * 参2：sheet内容格式要求
   */
  cntTypeTlp: (xml) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
      ${xml.tbCntType}<Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
      <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
      <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
      ${xml.sheetType}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
      <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`.trimXml();
  },
  /**
   * app.xml文件对应的模板，参数为对象，内容如下
   * 参1：excel文件程序信息
   * 参2：excel文件属性信息
   */
  appTlp: (xml) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" 
      xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
      <Application>${xml.file.application}</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop>
      <HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>
        ${xml.file.worksheets.length}</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="${xml.props.length}" baseType="lpstr">
        <vt:lpstr>${xml.props.join('</vt:lpstr><vt:lpstr>')}</vt:lpstr></vt:vector></TitlesOfParts>
        <Manager></Manager><Company>${xml.file.company}</Company><LinksUpToDate>false</LinksUpToDate>
        <SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>`.trimXml();
  },
  /**
   * workbook.xml.rels文件对应的模板，参数为对象，内容如下
   * 参1：rels内容数组
   */
  wkrelTlp: (xlRels) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        ${xlRels.join('')}<Relationship Id="rId${xlRels.length + 1}" 
        Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
        <Relationship Id="rId${xlRels.length + 2}" 
        Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
        <Relationship Id="rId${xlRels.length + 3}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/></Relationships>`.trimXml();
  },
  /**
   * sharedStrings.xml文件对应的模板，参数为对象，内容如下
   * 参1：共享文字内容个数
   * 参2：共享文字详细内容
   */
  shdStrTlp: (xml) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${xml.cntCount}" uniqueCount="${xml.cntStr.length}">
    ${assistSharedString(xml.cntStr)}</sst>`.trimXml();
  },
  /**
   * workbook.xml文件对应的模板，参数为对象，内容如下
   * 参1：打开时要显示的sheet索引
   * 参2：worksheets详细内容
   */
  wkbkTlp: (xml) => {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" 
      xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
      <fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="9303"/>
      <workbookPr defaultThemeVersion="124226"/><bookViews><workbookView 
        ${xml.sheetIndex ? 'activeTab="' + xml.sheetIndex + '" ' : ''}
        xWindow="480" yWindow="60" windowWidth="18195" windowHeight="8505"/></bookViews><sheets>
        ${xml.worksheets.join('')}</sheets><calcPr fullCalcOnLoad="1"/></workbook>`.trimXml();
  },
}

/**
 * 对字符串进行编码转义
 * @param {String} s 要进行编码转义的字串
 */
export const escapeXML = (s) => {
  return typeof s === 'string' ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;') : '';
}
/**
 * 对已编码的字串进行解码
 * @param {String} s 已编码的字串
 */
export const unescapeXML = (s) => {
  return typeof s === 'string' ? s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, '\'').replace(/&apos;/g, '\'').replace(/&#10;/g, '\n') : '';
}
/**
 * 由数字转为Excel中列的英文字母
 * @param {Number} i 要转成字母的数字
 */
export const numAlpha = function (i) {
  var t = Math.floor(i / 26) - 1; return (t > -1 ? numAlpha(t) : '') + alphabet.charAt(i % 26);
}
/**
 * 由Excel中列的英文字母转为数字
 * @param {String} s 要转成字母的数字
 */
export const alphaNum = function (s) {
  var t = 0; if (s.length === 2) { t = alphaNum(s.charAt(0)) + 1; } return t * 26 + alphabet.indexOf(s.substr(-1));
}

export const convertDate = function (input) {
  var d = new Date(1900, 0, 0),
    isDateObject = typeof input === 'object',
    offset = ((isDateObject ? input.getTimezoneOffset() : (new Date()).getTimezoneOffset()) - d.getTimezoneOffset()) * 60000;
  return isDateObject ? ((input - d - offset) / 86400000) + 1 : new Date(+d - offset + (input - 1) * 86400000);
}

export const typeOf = function (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

export const getAttr = function (s, n) {
  s = s.substr(s.indexOf(n + '="') + n.length + 2);
  return s.substring(0, s.indexOf('"'));
}

