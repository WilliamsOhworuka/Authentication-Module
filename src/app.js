import express from 'express';
import bodyParser from 'body-parser';
import '@babel/polyfill';
import cors from 'cors';
import authRoute from './routes/auth.route';

const app = express();
app.use(cors('*'));

app.get('/', (req, res) => {
  res.json({
    message: 'welcome to Authentication-module',
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/v1/user', authRoute);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening at ${port}`));

export default app;
