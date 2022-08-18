const util = require('util');
const xl = require('excel4node');

const ExportExcelService = async (filename, data) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Worksheet Name');
  wb.writeP = util.promisify(wb.write);

  const mappedData = data.map((elem) => ({
    userId: elem.userId,
    email: elem.email,
    name: elem.name,
    position: elem.position,
    workDate: elem.workDate,
    ...elem.assessments,
  }));

  const headingColumn = Object.keys(mappedData[0]);

  let headingColumnIndex = 1;

  headingColumn.forEach((heading) => {
    ws.cell(1, headingColumnIndex++)
      .string(heading);
  });

  let rowIndex = 2;

  mappedData.forEach((record) => {
    let columnIndex = 1;
    Object.keys(record).forEach((columnName) => {
      if (typeof (record[columnName]) === 'string') {
        ws.cell(rowIndex, columnIndex++)
          .string(record[columnName]);
      } else {
        ws.cell(rowIndex, columnIndex++)
          .number(record[columnName]);
      }
    });
    rowIndex++;
  });

  const path = `${__dirname}/file/data-${filename}.xlsx`;

  await wb.writeP(path);

  return path;
};

module.exports = ExportExcelService;
