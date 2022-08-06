const express = require('express');
const requireUser = require('../middleware/requireUser');
const AssessmentControllers = require('../controllers/AssessmentControllers');

const router = express.Router();
const assessmentController = new AssessmentControllers();

router.get('/', requireUser, assessmentController.getAllAssessments); // Get all assessments
router.get('/senders', requireUser, assessmentController.getAllAssessmentSenders); // Get all assessments per senders
router.get('/receivers', requireUser, assessmentController.getAllAssessmentReceivers); // Get all assessments per receivers
router.get('/period/:period', requireUser, assessmentController.getAssessmentsPerPeriod); // Get assessments per period
router.get('/period/:period/:receiverId', requireUser, assessmentController.getAssessmentsPerPeriodPerReceiver); // Get assessments per period per receiver
router.get('/:employeeId', requireUser, assessmentController.getOneEmployeeAssessment);
router.get('/admin-check/:employeeId', requireUser, assessmentController.assessmentCheckByAdmin);
router.get('/employee-check/:receiverId', requireUser, assessmentController.assessmentCheckByEmployee);

router.post('/:employeeId', requireUser, assessmentController.createAssessment); // Create an assessment

router.put('/:employeeId', requireUser, assessmentController.updateAssessment);

module.exports = router;
