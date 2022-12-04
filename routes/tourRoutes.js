const express=require('express');
const router = express.Router();
const 
    { 
        getAllTours,
        createTour,
        getTour,
        deleteTour,
        updateTour
    } = require(`./../controllers/tourController`);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);

module.exports = router;