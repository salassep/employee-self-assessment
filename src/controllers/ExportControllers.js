const fs = require('fs');
const autoBind = require('auto-bind');
const exportExcelService = require('../services/export/ExportExcelServices');
const AssessmentServices = require('../services/db/AssessmentServices');

class ExportControllers {
  constructor() {
    this._assessmentServices = new AssessmentServices();
    autoBind(this);
  }

  async exportExcel(req, res, next) {
    try {
      const assessments = await this._assessmentServices
        .getAssessmentTotalAllEmployeePerPeriod(req.params.period);

      const result = await exportExcelService(req.params.period, assessments);

      fs.readFile(result, (err, data) => {
        const base64String = data.toString('base64');
        return res.status(201).send({
          statusCode: 201,
          status: 'OK',
          base64String,
        });
      });

      return true;

    // res.status(201).send({statusCode: 201,
    //   status: 'OK',
    //   url: result,
    // });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = ExportControllers;
