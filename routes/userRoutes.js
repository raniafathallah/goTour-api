const express=require('express');
const router = express.Router();
const 
    { 
        getAllUsers,
        createUser,
        getUser,
        updateUser,
        deleteMe,
        deleteUser
    } = require(`./../controllers/userController`);

 router.route('/').get(getAllUsers).post(createUser);
 router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);
 router.route('/deleteme/:id').patch(deleteMe);


 module.exports = router;