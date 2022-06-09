const express = require('express');
const logger = require('morgan');
require('dotenv').config();

const app = express();
app.use(logger('tiny'));
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`server listen on ${process.env.PORT}`);
});
