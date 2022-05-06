const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

//create, find, update, delete
router.get('/',userController.view);
router.post('/',userController.find);

router.get('/user',userController.view_user);
router.get('/collaborator',userController.view_collab);
router.get('/sponsor',userController.view_sponsor);
router.get('/employee',userController.view_emp);
router.get('/service',userController.view_service);
router.get('/event',userController.view_event);

router.get('/adduser',userController.form);
router.post('/adduser',userController.create);
router.get('/edituser/:id',userController.edit);
router.post('/edituser/:id',userController.update);
router.get('/viewuser/:id',userController.viewall);
router.get('/:id',userController.delete);

 
module.exports = router;