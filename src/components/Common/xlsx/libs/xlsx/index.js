/*
 * @Author: 高年蒙
 * @Date: 2018-04-06 23:45:48
 * @Last Modified by: 高年蒙
 * @Last Modified time: 2018-05-14 13:12:42
 * @Descriptions: 基于Microsoft Corporation的xlsx.js实现HtmlTable转为Excel
 */

require('script-loader!file-saver');
const { xlsx } = require('./xlsx.js');
import { unescapeXML } from './utils';
Array.prototype.objIncludes = function (key) {
  for (var i = 0, temp = {}, result = [], ci; ci = this[i++];) {
    if (ci[key]) return true;
  }
  return false;
};
/**
 * 获取当前表格的列数
 * @param {HtmlTable} table HtmlTable对象
 */
function getColNum(table) {
  if (table.rows.length == 0) return 0;
  let tbCmnCnt = 0;
  [...table.rows[0].cells].forEach((cell, index) => {
    let colspan = cell.getAttribute('colspan');
    if (cell.getAttribute('class') !== 'gutter') {//elementui的表头最后一个单元格是多余的
      colspan ? tbCmnCnt += parseInt(colspan) : tbCmnCnt++;
    }
    // colspan ? tbCmnCnt += parseInt(colspan) : tbCmnCnt++;
  });
  return tbCmnCnt;
}

/**
 * 将数据表格转换为xlsx需要的数组
 * {vAlign:'center', borders:{bottom:'DEE31D'}, value:'B1'}
 * @param {HtmlTable} table 要导出的数据表格
 * @param {Number} hRow 要根据表头的行数进行单独处理
 */
function generateMatrix(table, hRow, tbTitle) {
  const dataMatrix = []
  const rows = table.querySelectorAll('tr');// 获取所有行
  const cells = []
  let totalRows = rows.length;// 数据行数
  const totalCols = getColNum(table);// 数据列数

  if (tbTitle != '') { // 如果有标题列
    cells.push({
      vAlign: 'center',
      hAlign: 'center',
      bold: 1,
      fontSize: 13,
      colSpan: totalCols,
      rowSpan: 1,
      value: tbTitle
    });
    totalRows++;
  }
  // Excel对于跨行跨列的处理（放到merges属性中）和HtmlTable有区别，merges范围内的单元格是空值但存在
  // 所以先创建空白数据矩阵，后面再填冲相关数据
  for (let rIndex = 0; rIndex < totalRows; rIndex++) {
    let row = []
    for (let cIndex = 0; cIndex < totalCols; cIndex++) {
      row.push(1)// 需要处理
    }
    dataMatrix.push(row)
  }
  // 先创建所有单元格对象数组
  Array.from(rows).forEach((row, rIndex) => {
    Array.from(row.cells).forEach(cell => {
      if (cell.getAttribute('class') !== 'gutter') {//elementui的表头最后一个单元格是多余的
        let cellObject = { vAlign: 'center', borders: { bottom: 64, left: 64, top: 64, right: 64 } };// 单元格边框样式
        let cellValue = cell.innerText.trim();
        if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;//如果是数字
        if (cell.innerHTML.includes('sup') || cell.innerHTML.includes('sub')) {// 如果有上下标
          cellValue = unescapeXML(cell.children[0].innerHTML); // 默认取单元格内第一个子元素的内容,ElementUi中对div内的Html标签进行了转义
          let htmlReg = new RegExp(/<(.[^>]*)>/igm);// 文本内的HTML要去掉
          cellObject.text = cell.innerText.replace(htmlReg, '').trim();// 方便后期处理，单独存储文本内容
        }
        cellObject.value = cellValue;// 此值可能是一般文本可能是带有上下标元素的文本
        //如果rowspan、colspan属性不为空并且大于1
        let rowspan = cell.getAttribute('rowspan') || 1;
        let colspan = cell.getAttribute('colspan') || 1;
        // 也有可能是既跨行也跨列
        cellObject.colSpan = parseInt(colspan);
        cellObject.rowSpan = parseInt(rowspan);
        if (parseInt(colspan) == 1) {
          cellObject.autoWidth = true;// 非跨列单元格的宽度自适应
        }
        if (parseInt(rowspan) > 1) {// 如果是跨行，则配置文字垂直居中
          cellObject.hAlign = 'center';
        }
        if (hRow > 0 && rIndex < parseInt(hRow)) {// 如果设置了表头行数，则对表头风格进行配置
          cellObject.bold = 1;
          cellObject.hAlign = 'center';
        }
        cells.push(cellObject);
      }
    });
  });
  // 向矩阵中添加相关数据
  let cursor = 0;
  for (let rIndex1 = 0; rIndex1 < totalRows; rIndex1++) {
    for (let cIndex1 = 0; cIndex1 < totalCols; cIndex1++) {
      // 如果当前单元格已处理过则跳过
      // 用某个属性是否存在来判断更快些
      // 但可读性上下面的语名更好些
      // if (JSON.stringify(dataMatrix[rIndex][cIndex]) === "{}") {
      if (dataMatrix[rIndex1][cIndex1] === 1) {
        let cell = cells[cursor++];
        if (!cell) continue;
        dataMatrix[rIndex1][cIndex1] = cell;
        const { rowSpan, colSpan } = cell;
        for (let y = rIndex1; y < rIndex1 + rowSpan; y++) {
          for (let x = cIndex1; x < cIndex1 + colSpan; x++) {
            if (!dataMatrix[y]) {// ElementUi中tableBUG ,跨行的最后一行rowSpan配置有问题
              dataMatrix[y - 1][cIndex1].rowSpan = y - rIndex1; //
              break;
            }
            if (!(y === rIndex1 && x === cIndex1))// 填冲空值单元格
              dataMatrix[y][x] = { vAlign: 'center', borders: { bottom: 64, left: 64, top: 64, right: 64 } };
          }
        }
      }
    }
  }
  return dataMatrix;
}
/**
 * 实现base64到Blob的转换
 * @param {String} dataurl 内存中的数据
 */
function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
function blobToDataURL(blob, callback) {
  var a = new FileReader();
  a.onload = function (e) { callback(e.target.result); }
  a.readAsDataURL(blob);
}

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
/**
 * 实现从HtmlTable到Excel的转换
 * 可以是一个表，也可以是多个表，生成多个sheet
 * @param {String} id 要导出的数据表格ID
 * @param {String} title 导出的Excel中的标题
 * @param {String} name 要生成的文件名称
 * @param {Number} hRow 数据表表头的行数
 * @param {String} tbTitle 数据表的大标题
 */
export function export2excel({ fName = 'export', expTbArr } = {}) {
  return new Promise(
    function (resolve, reject) {
      try {
        let sheetObj = {
          creator: '高年蒙',
          lastModifiedBy: '高年蒙',
          application: '靶点软件',
          company: '靶点软件',
          worksheets: []
        };
        expTbArr.forEach(tb => {
          let theTable = document.getElementById(tb.id);
          let xlsData = generateMatrix(theTable, tb.hRow, tb.tbTitle);
          sheetObj.worksheets.push({
            data: xlsData,
            name: tb.shName
          });

        })
        saveAs(dataURLtoBlob(xlsx(sheetObj).href()), fName + ".xlsx");
        resolve('ok')
      } catch (error) {
        reject(error.message)
      }
    }
  )

}
