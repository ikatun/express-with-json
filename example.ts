import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

import { JsonErrorResponse, withJson } from './index';

const app = withJson(express());
const app2 = withJson(express.Router());
app.use(bodyParser.json());

const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));
app.getJson('/ok', () => {
  return { ok: true };
});
app.getJson('/fail', () => {
  throw new JsonErrorResponse({ ok: false });
});
app.postJson('/echo', req => {
  return req.body;
});
app.getJson('/async-demo', async () => {
  const response = await fetch('https://api.github.com/repos/ikatun/mapix');
  return await response.json();
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
