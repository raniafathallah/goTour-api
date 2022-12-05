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
const {signup,
       login,
       logout,
       protect,restrictTo
    }=require(`./../controllers/authController`);

router
.route('/signup')
.post(signup);
router
.route('/login')
.post(login);

router
.route('/logout')
.get(logout);


 router.route('/').get(protect,restrictTo('admin'),getAllUsers).post(createUser);
 router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);
 router.route('/deleteme/:id').patch(deleteMe);


 module.exports = router;