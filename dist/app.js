import express from 'express';
const PORT = process.env.PORT || 5000;
express()
    .get('/', (req, res) => 'yolo' && console.log(res))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
//# sourceMappingURL=app.js.map