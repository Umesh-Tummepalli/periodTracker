import express from 'express'

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Quora API is running');
});

export default router;