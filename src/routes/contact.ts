import express from 'express';
import contactController from '@/controllers/contactController';

const router = express.Router();

router.get('/:addressBookId/contacts/', contactController.getAll);
router.get('/:addressBookId/contacts/:name', contactController.getByName);
router.post('/:addressBookId/contacts/', contactController.create);
router.put('/:addressBookId/contacts/:name', contactController.update);
router.delete('/:addressBookId/contacts/:name', contactController.delete);

export default router;
