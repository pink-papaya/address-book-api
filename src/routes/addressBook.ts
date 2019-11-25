import express from 'express';
import addressBookController from '@/controllers/addressBookController';

const router = express.Router();

router.get('/', addressBookController.getAll);
router.get('/:id', addressBookController.getById);
router.post('/', addressBookController.create);
router.put('/:id', addressBookController.update);
router.delete('/:id', addressBookController.delete);

export default router;
