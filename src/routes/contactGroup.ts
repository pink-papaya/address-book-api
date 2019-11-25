import express from 'express';
import contactGroupController from '@/controllers/contactGroupController';

const router = express.Router();

router.get('/:addressBookId/groups/', contactGroupController.getAll);
router.get('/:addressBookId/groups/:id', contactGroupController.getById);
router.post('/:addressBookId/groups/', contactGroupController.create);
router.put('/:addressBookId/groups/:id', contactGroupController.update);
router.delete('/:addressBookId/groups/:id', contactGroupController.delete);

export default router;
