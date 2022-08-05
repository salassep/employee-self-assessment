const express = require('express');
const CriteriaControllers = require('../controllers/CriteriaControllers');
const requireUser = require('../middleware/requireUser');

const router = express.Router();
const criteriaControllers = new CriteriaControllers();

router.post('/', requireUser, criteriaControllers.createCriteria); // Create new criteria

router.get('/', requireUser, criteriaControllers.getAllCriteria); // Get all criteria
router.get('/:criterionId', requireUser, criteriaControllers.getCriterionById); // Get one critetia by its id

router.put('/:criterionId', requireUser, criteriaControllers.updateCriteria); // Update criteria

router.delete('/:criterionId', requireUser, criteriaControllers.deleteCriteria); // Delete Criteria

module.exports = router;
