import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.json({ ok: true }));
router.get('/:id', (req, res) => res.json({ ...req.params }));
router.post('/', (req, res) => res.json({ ...req.body }));
router.put('/:id', (req, res) => res.json({ ...req.body }));
router.delete('/:id', (req, res) => res.json({ ...req.body }));

export default router;
