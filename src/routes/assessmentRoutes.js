const express = require('express');
const requireUser = require('../middleware/requireUser');
const AssessmentControllers = require('../controllers/AssessmentControllers');
const ExportControllers = require('../controllers/ExportControllers');

const router = express.Router();
const assessmentController = new AssessmentControllers();
const exportController = new ExportControllers();

router.get('/', requireUser, assessmentController.getAllAssessments); // Get all assessments
router.get('/senders', requireUser, assessmentController.getAllAssessmentSenders); // Get all assessments per senders
router.get('/receivers', requireUser, assessmentController.getAllAssessmentReceivers); // Get all assessments per receivers
router.get('/period/:period', requireUser, assessmentController.getAssessmentsPerPeriod); // Get assessments per period
router.get('/period/:period/receivers', requireUser, assessmentController.getAssessmentsPerPeriodPerReceiver); // Get assessments per period per receiver
router.get('/period/:period/senders', requireUser, assessmentController.getAssessmentsPerPeriodPerSender); // Get assessments per period per sender
router.get('/:employeeId', requireUser, assessmentController.getOneEmployeeAssessment); // Get one employee assessment by employee id
router.get('/period/:period/:employeeId', requireUser, assessmentController.getOneEmployeeAssessmentPerPeriod); // Get one employee assessment per period by employee id
router.get('/admin-check/:period', requireUser, assessmentController.assessmentCheckByHr);
router.get('/employee-check/:period', requireUser, assessmentController.assessmentCheckByEmployee);
router.get('/total/:period', requireUser, assessmentController.getAssessmentTotalAllEmployeePerPeriod);
router.get('/total/:period/:employeeId', requireUser, assessmentController.getAssessmentTotalOneEmployeePerPeriod);
router.get('/criteria/total/:period', requireUser, assessmentController.getAssessmentTotalPerCriteriaPerPeriod);
router.get('/criteria/max-min/:period', requireUser, assessmentController.getMixMinPerCriteriaPerPeriod);
router.get('/report/:period', requireUser, exportController.exportExcel);

router.post('/:employeeId', requireUser, assessmentController.createAssessment); // Create an assessment

router.put('/:employeeId', requireUser, assessmentController.updateAssessment);

module.exports = router;
