import express from 'express';
import bodyParser from 'body-parser';
import addressBookRouter from '@/routes/addressBook';
import contactRouter from '@/routes/contact';
import contactGroupRouter from '@/routes/contactGroup';

const PORT = process.env.PORT || 5000;

express()
  .use(express.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use('/', addressBookRouter)
  .use('/', contactRouter)
  .use('/', contactGroupRouter)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));