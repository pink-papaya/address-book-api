import express, { Response, Request } from 'express';
import addressBookRouter from '@/routes/addressBook';

const PORT = process.env.PORT || 5000;

express()
  .use(express.json())
  .use('/', addressBookRouter)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
