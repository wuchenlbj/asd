/* 修改了一些细节
 * @Author: 高年蒙
 * @Date: 2018-04-07 15:05:18
 * @Last Modified by: 高年蒙
 * @Last Modified time: 2018-04-11 11:12:34
 * @Descriptions:
 * 1、修改中文字串长度问题
 * 2、调整单元格默认宽度
 * 3、调整行的默认高度
 * 4、表格（特别是表头内）文字换行处理
 * 5、文字中有上下标的处理
 * 6、将公共变量静态全局化
 * 7、解决复杂表头跨行跨列时，单元格内容显示
 */
// ----------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
// Released under the Microsoft Office Extensible File License
// https://raw.github.com/stephen-hardy/xlsx.js/master/LICENSE.txt
// ----------------------------------------------------------
/* eslint-disable */
if ((typeof JSZip === 'undefined' || !JSZip) && typeof require === 'function') {
  var JSZip = require('node-zip');
}

import { Constants, numAlpha, alphaNum, convertDate, typeOf, getAttr, escapeXML, unescapeXML } from './utils';
export function xlsx(file) {
  'use strict'; // v2.3.2
  var result, zip = new JSZip(), zipTime, processTime, s, f, i, j, k, l, t, w, sharedStrings, styles, index, data, val, style, borders, border, borderIndex, fonts, font, fontIndex,
    docProps, xl, xlWorksheets, worksheet, contentTypes = [[], []], props = [], xlRels = [], worksheets = [], id, columns, cols, colWidth, cell, row, merges, merged,
    numFmts = Constants.numFmts,
    defaultFontName = '宋体',
    defaultFontSize = 12;
  if (typeof file === 'string') { // Load
    zipTime = Date.now();
    zip = zip.load(file, { base64: true });
    result = { worksheets: [], zipTime: Date.now() - zipTime };
    processTime = Date.now();
    sharedStrings = [];
    styles = [];

    if (s = zip.file('xl/sharedStrings.xml')) { // Process sharedStrings
      s = s.asText().split(/<si.*?>/g); i = s.length;
      while (--i) {
        sharedStrings[i - 1] = unescapeXML(s[i].replace(/<\/?[^>]+(>|$)/g, ''));
      } // Do not process i === 0, because s[0] is the text before first t element
    }
    if (s = zip.file('docProps/core.xml')) { // Get file info from "docProps/core.xml"
      s = s.asText();
      s = s.substr(s.indexOf('<dc:creator>') + 12);
      result.creator = s.substring(0, s.indexOf('</dc:creator>'));
      s = s.substr(s.indexOf('<cp:lastModifiedBy>') + 19);
      result.lastModifiedBy = s.substring(0, s.indexOf('</cp:lastModifiedBy>'));
      s = s.substr(s.indexOf('<dcterms:created xsi:type="dcterms:W3CDTF">') + 43);
      result.created = new Date(s.substring(0, s.indexOf('</dcterms:created>')));
      s = s.substr(s.indexOf('<dcterms:modified xsi:type="dcterms:W3CDTF">') + 44);
      result.modified = new Date(s.substring(0, s.indexOf('</dcterms:modified>')));
    }
    if (s = zip.file('xl/workbook.xml')) { // Get workbook info from "xl/workbook.xml" - Worksheet names exist in other places, but "activeTab" attribute must be gathered from this file anyway
      s = s.asText(); index = s.indexOf('activeTab="');
      if (index > 0) {
        s = s.substr(index + 11); // Must eliminate first 11 characters before finding the index of " on the next line. Otherwise, it finds the " before the value.
        result.activeWorksheet = +s.substring(0, s.indexOf('"'));
      } else {
        result.activeWorksheet = 0;
      }
      s = s.split('<sheet '); i = s.length;
      while (--i) { // Do not process i === 0, because s[0] is the text before the first sheet element
        id = s[i].substr(s[i].indexOf('name="') + 6);
        result.worksheets.unshift({ name: id.substring(0, id.indexOf('"')), data: [] });
      }
    }
    if (s = zip.file('xl/styles.xml')) { // Get style info from "xl/styles.xml"
      s = s.asText().split('<numFmt '); i = s.length;
      while (--i) { t = s[i]; numFmts[+getAttr(t, 'numFmtId')] = getAttr(t, 'formatCode'); }
      s = s[s.length - 1]; s = s.substr(s.indexOf('cellXfs')).split('<xf '); i = s.length;
      while (--i) {
        id = getAttr(s[i], 'numFmtId'); f = numFmts[id];
        if (f.indexOf('m') > -1) { t = 'date'; }
        else if (f.indexOf('0') > -1) { t = 'number'; }
        else if (f === '@') { t = 'string'; }
        else { t = 'unknown'; }
        styles.unshift({ formatCode: f, type: t });
      }
    }

    // Get worksheet info from "xl/worksheets/sheetX.xml"
    i = result.worksheets.length;
    while (i--) {
      s = zip.file('xl/worksheets/sheet' + (i + 1) + '.xml').asText().split('<row ');
      w = result.worksheets[i];
      w.table = s[0].indexOf('<tableParts ') > 0;
      t = getAttr(s[0].substr(s[0].indexOf('<dimension')), 'ref');
      t = t.substr(t.indexOf(':') + 1);
      w.maxCol = alphaNum(t.match(/[a-zA-Z]*/g)[0]) + 1;
      w.maxRow = +t.match(/\d*/g).join('');
      w = w.data;
      j = s.length;
      while (--j) { // Don't process j === 0, because s[0] is the text before the first row element
        row = w[+getAttr(s[j], 'r') - 1] = [];
        columns = s[j].split('<c ');
        k = columns.length;
        while (--k) { // Don't process l === 0, because k[0] is the text before the first c (cell) element
          cell = columns[k];
          f = styles[+getAttr(cell, 's')] || { type: 'General', formatCode: 'General' };
          t = getAttr(cell, 't') || f.type;
          val = cell.substring(cell.indexOf('<v>') + 3, cell.indexOf('</v>'));
          val = val ? +val : ''; // turn non-zero into number
          switch (t) {
            case 's': val = sharedStrings[val]; break;
            case 'b': val = val === 1; break;
            case 'date': val = convertDate(val); break;
          }
          row[alphaNum(getAttr(cell, 'r').match(/[a-zA-Z]*/g)[0])] = { value: val, formatCode: f.formatCode };
        }
      }
    }

    result.processTime = Date.now() - processTime;
  }
  else { // Save
    processTime = Date.now();
    //[0]存放各单元的内容数组(不重复存)
    //[1]放唯一性计数
    sharedStrings = [[], 0];
    // Fully static
    zip.folder('_rels').file('.rels', Constants.relTlp);
    docProps = zip.folder('docProps');

    xl = zip.folder('xl');
    xl.folder('theme').file('theme1.xml', Constants.themTlp);
    xlWorksheets = xl.folder('worksheets');

    // Not content dependent
    docProps.file('core.xml', Constants.coreTlp(file));

    // Content dependent
    styles = new Array(1);
    borders = new Array(1);
    fonts = new Array(1);

    w = file.worksheets.length;
    while (w--) {// 循环处理要生成的各Sheet
      // Generate worksheet (gather sharedStrings), and possibly table files, then generate entries for constant files below
      id = w + 1;
      // Generate sheetX.xml in var s
      worksheet = file.worksheets[w];
      data = worksheet.data;
      s = '';
      columns = [];
      merges = [];
      i = -1; l = data.length;
      while (++i < l) {
        j = -1; k = data[i].length;
        let rowHeight = 25;// 调整高度
        s += '<row r="' + (i + 1) + '" x14ac:dyDescent="0.25" customHeight="1" ht="0000">';/////行信息，后面替换高度
        while (++j < k) {
          cell = data[i][j];
          val = cell.hasOwnProperty('value') ? cell.value : cell; t = '';
          style = { // supported styles: borders, hAlign, formatCode and font style
            borders: cell.borders,
            hAlign: cell.hAlign,
            vAlign: cell.vAlign,
            bold: cell.bold,
            italic: cell.italic,
            fontName: cell.fontName,
            fontSize: cell.fontSize,
            formatCode: cell.formatCode || 'General'
          };
          colWidth = 0;
          if ((cell.type && cell.type === 'text') || (val && typeof val === 'string' && !isFinite(val))) {
            // If value is string, and not string of just a number, place a sharedString reference instead of the value
            val = escapeXML(val);// 特殊字符转义
            sharedStrings[1]++; // Increment total count, unique count derived from sharedStrings[0].length
            index = sharedStrings[0].indexOf(val);
            colWidth = val.replace(/[^\x00-\xff]/g, "aa").length + 2;///////汉字占两个字符
            if (cell.text) {
              // 如果单元格内容有HTML元素，则宽度只算文本内容的
              colWidth = cell.text.replace(/[^\x00-\xff]/g, "aa").length + 2;
              // 方便后面在style.xml中的fonts属性中添加相关属性
              style.sptType = cell.value.includes('<sub') ? cell.value.includes('<sup') ? 'all' : 'subscript' : cell.value.includes('<sup') ? 'superscript' : undefined;
              if (cell.bold)// 如果是加粗显示
                val += '#B#';// 方便在sharedStrings中添加相关属性
            }
            if (index < 0) {
              index = sharedStrings[0].push(val) - 1;
            }
            val = index;//将值索引作为单元格的内容
            t = 's';
          }
          else if (typeof val === 'boolean') {
            val = (val ? 1 : 0); t = 'b';
            colWidth = 1;
          }
          else if (typeOf(val) === 'date') {
            val = convertDate(val);
            style.formatCode = cell.formatCode || 'mm-dd-yy';
            colWidth = val.replace(/[^\x00-\xff]/g, "aa").length + 1;////
          }
          else if (typeof val === 'object') { val = null; } // unsupported value
          else {
            colWidth = ('' + val).replace(/[^\x00-\xff]/g, "aa").length + 2;////
            t = 'n';
          } // number, or string which is a number

          if (colWidth > Constants.clmnWidth) {// 对于超长字串，要进行自动换行，并调整行高
            style.wrapText = true;
            let crntht = parseInt(colWidth / Constants.clmnWidth) * 17;// 此处17是每行文字大概的像素高度
            rowHeight = rowHeight > crntht ? rowHeight : crntht;
          } else if (colWidth > parseInt(Constants.clmnWidth * 0.5)) { // 对于总长度接近默认长度的作换行处理（此情部下，只有两行）
            style.wrapText = true;
            rowHeight = rowHeight > 50 ? rowHeight : 50;
            colWidth = parseInt(Constants.clmnWidth * 0.5);// 重新配置列宽
          }
          // keeps largest cell in column, and autoWidth flag that may be set on any cell
          if (columns[j] == null) { columns[j] = { autoWidth: false, max: 0 }; }
          if (cell.autoWidth) { columns[j].autoWidth = true; }
          if (colWidth > columns[j].max && cell.colSpan === 1) {// 对于跨列的单元格的宽度，不能作为当列的最大宽度 
            // 控制单元格最大的宽度
            columns[j].max = colWidth > Constants.clmnWidth ? Constants.clmnWidth : colWidth;
          }
          // use stringified version as unic and reproductible style signature
          style = JSON.stringify(style);
          index = styles.indexOf(style);
          if (index < 0) { style = styles.push(style) - 1; }
          else { style = index; }
          // store merges if needed and add missing cells. Cannot have rowSpan AND colSpan
          // 这里对于跨行跨列的处理有问题，中国滴报表是相当复杂滴，会有既跨行又跨列的单元格，这代码没考虑这情况
          // 对于填冲空值单元格的部分，移到外面（遍历HtmlTable时）处理，原有代码不能用
          if (cell.rowSpan > 1 && cell.colSpan > 1) {// 既跨行又跨列ex: B12:E15
            merges.push([numAlpha(j) + (i + 1), numAlpha(j + cell.colSpan - 1) + (i + cell.rowSpan)]);
          } else if (cell.colSpan > 1) {// 只跨列,
            // horizontal merge. ex: B12:E12. Add missing cells (with same attribute but value) to current row
            merges.push([numAlpha(j) + (i + 1), numAlpha(j + cell.colSpan - 1) + (i + 1)]);
          } else if (cell.rowSpan > 1) {// 只跨行
            // vertical merge. ex: B12:B15. Add missing cells (with same attribute but value) to next columns
            merges.push([numAlpha(j) + (i + 1), numAlpha(j) + (i + cell.rowSpan)]);
          }
          s += '<c r="' + numAlpha(j) + (i + 1) + '"' + (style ? ' s="' + style + '"' : '') + (t ? ' t="' + t + '"' : '');
          if (val != null) {
            s += '>' + (cell.formula ? '<f>' + cell.formula + '</f>' : '') + '<v>' + val + '</v></c>';
          } else {
            s += '/>';
          }
        }
        s = s.replace('ht="0000">', 'ht="' + rowHeight + '">');
        s += '</row>';

      }
      cols = []
      for (i = 0; i < columns.length; i++) {
        if (columns[i].autoWidth) {
          cols.push('<col min="', i + 1, '" max="', i + 1, '" width="', columns[i].max, '" bestFit="1"/>');
        }
      }
      // only add cols definition if not empty
      if (cols.length > 0) {
        cols = ['<cols>'].concat(cols, ['</cols>']).join('');
      }

      // sheet对应的xml，参1：列范围结束值；参2：默认要显示的sheet索引；参3：相关列地应的列宽配置xml；参4：sheet对应的xml
      s = Constants.workSheetTlp({
        nfClmn: numAlpha(data[0].length - 1) + data.length,
        shvName: w === file.activeWorksheet ? 'tabSelected="1" ' : '',
        clmnXml: cols,
        shtData: s
      });
      if (merges.length > 0) {
        s += '<mergeCells count="' + merges.length + '">';
        for (i = 0; i < merges.length; i++) {
          s += '<mergeCell ref="' + merges[i].join(':') + '"/>';
        }
        s += '</mergeCells>';
      }
      s += Constants.pgMgrns;
      if (worksheet.table) {
        s += Constants.tbPartTlp;
      }
      // 将当前sheet内容添加到压缩文件中
      xlWorksheets.file('sheet' + id + '.xml', s + '</worksheet>');

      if (worksheet.table) {
        i = -1; l = data[0].length; t = numAlpha(data[0].length - 1) + data.length;

        s = Constants.stbxmlTlp({
          id: id,
          nfClmn: t,
          clmnCount: data[0].length
        });
        while (++i < l) {
          s += '<tableColumn id="' + (i + 1) + '" name="' + (data[0][i].hasOwnProperty('value') ? data[0][i].value : data[0][i]) + '"/>';
        }
        s += Constants.etbxmlTlp;

        xl.folder('tables').file('table' + id + '.xml', s);
        xlWorksheets.folder('_rels').file('sheet' + id + '.xml.rels', Constants.tbrelTlp(id));
        contentTypes[1].unshift('<Override PartName="/xl/tables/table' + id + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>');
      }

      contentTypes[0].unshift('<Override PartName="/xl/worksheets/sheet' + id + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>');
      props.unshift(escapeXML(worksheet.name) || 'Sheet' + id);
      xlRels.unshift('<Relationship Id="rId' + id + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + id + '.xml"/>');
      worksheets.unshift('<sheet name="' + (escapeXML(worksheet.name) || 'Sheet' + id) + '" sheetId="' + id + '" r:id="rId' + id + '"/>');
    }

    // xl/styles.xml
    i = styles.length; t = [];
    while (--i) {
      // Don't process index 0, already added
      style = JSON.parse(styles[i]);

      // cell formating, refer to it if necessary
      if (style.formatCode !== 'General') {
        index = numFmts.indexOf(style.formatCode);
        if (index < 0) {
          index = 164 + t.length;
          t.push('<numFmt formatCode="' + style.formatCode + '" numFmtId="' + index + '"/>');
        }
        style.formatCode = index
      } else {
        style.formatCode = 0
      }

      // border declaration: add a new declaration and refer to it in style
      borderIndex = 0
      if (style.borders) {
        border = ['<border>']
        // order is significative
        for (var edge in { left: 0, right: 0, top: 0, bottom: 0, diagonal: 0 }) {
          if (style.borders[edge]) {
            var color = style.borders[edge];
            // add transparency if missing
            if (color.length === 6) {
              color = 'FF' + color;
            }
            border.push('<', edge, ' style="thin">', '<color rgb="', style.borders[edge], '"/></', edge, '>');
          } else {
            border.push('<', edge, '/>');
          }
        }
        border.push('</border>');
        border = border.join('');
        // try to reuse existing border
        borderIndex = borders.indexOf(border);
        if (borderIndex < 0) {
          borderIndex = borders.push(border) - 1;
        }
      }

      // font declaration: add a new declaration and refer to it in style
      fontIndex = 0
      if (style.bold || style.italic || style.fontSize || style.fontName || style.sptType) {
        font = ['<font>']
        if (style.bold) {
          font.push('<b/>');
        }
        if (style.italic) {
          font.push('<i/>');
        }
        if (style.sptType) {
          if (style.sptType === 'all') {

          } else {
            font.push('<vertAlign val="' + style.sptType + '"/>');
            font.push('<family val="3"/>');
            font.push('<charset val="134"/>');
          }
        } else
          font.push('<family val="2"/>');
        font.push('<sz val="', style.fontSize || defaultFontSize, '"/>');
        font.push('<color theme="1"/>');
        font.push('<name val="', style.fontName || defaultFontName, '"/>');
        font.push('</font>');
        font = font.join('');
        // try to reuse existing font
        fontIndex = fonts.indexOf(font);
        if (fontIndex < 0) {
          fontIndex = fonts.push(font) - 1;
        }
      }

      // declares style, and refer to optionnal formatCode, font and borders

      styles[i] = ['<xf xfId="0" fillId="0" borderId="',
        borderIndex,
        '" fontId="',
        fontIndex,
        '" numFmtId="',
        style.formatCode,
        '" ',
        (style.hAlign || style.vAlign ? 'applyAlignment="1" ' : ' '),
        (style.formatCode > 0 ? 'applyNumberFormat="1" ' : ' '),
        (borderIndex > 0 ? 'applyBorder="1" ' : ' '),
        (fontIndex > 0 ? 'applyFont="1" ' : ' '),
        '>'
      ];
      if (style.hAlign || style.vAlign || style.wrapText) {
        styles[i].push('<alignment');
        if (style.hAlign) {
          styles[i].push(' horizontal="', style.hAlign, '"');
        }
        if (style.vAlign) {
          styles[i].push(' vertical="', style.vAlign, '"');
        }
        if (style.wrapText) {
          styles[i].push(' wrapText="1"');
        }
        styles[i].push('/>');
      }
      styles[i].push('</xf>');
      styles[i] = styles[i].join('');
    }

    // console.log(styles)
    // return;
    t = t.length ? '<numFmts count="' + t.length + '">' + t.join('') + '</numFmts>' : '';

    xl.file('styles.xml', Constants.styleTlp({
      clmnFrmt: t,
      fonts: fonts,
      fontSize: defaultFontSize,
      fontName: defaultFontName,
      borders: borders,
      styles: styles
    }));
    // [Content_Types].xml
    zip.file('[Content_Types].xml', Constants.cntTypeTlp({
      tbCntType: contentTypes[0].join(''),
      sheetType: contentTypes[1].join('')
    }));
    // docProps/app.xml
    docProps.file('app.xml', Constants.appTlp({
      file: file,
      props: props
    }));
    // xl/_rels/workbook.xml.rels
    xl.folder('_rels').file('workbook.xml.rels', Constants.wkrelTlp(xlRels));
    // xl/sharedStrings.xml
    xl.file('sharedStrings.xml', Constants.shdStrTlp({
      cntCount: sharedStrings[1],
      cntStr: sharedStrings[0]
    }));
    // xl/workbook.xml
    xl.file('workbook.xml', Constants.wkbkTlp({
      sheetIndex: file.activeWorksheet,
      worksheets: worksheets
    }));
    processTime = Date.now() - processTime;
    zipTime = Date.now();
    result = {
      base64: zip.generate({ compression: 'DEFLATE' }), zipTime: Date.now() - zipTime, processTime: processTime,
      href: function () { return 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + this.base64; }
    };
  }
  return result;
}

// if (typeof exports === 'object' && typeof module === 'object') { module.exports = xlsx; } // NodeJs export
