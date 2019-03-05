# express-with-json
Add functions which return objects as middlewares to express.

Avoid calling `res.json()` and calling `next` with error.
Just return the object you want JSON-ed to the client or throw `JsonErrorResponse` to return JSON-ed error to the client.

Installation:
```
npm install express-with-json
```

Usage example:
```typescript
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import withJson, { JsonErrorResponse } from 'express-with-json';

const app = withJson(express());
// app is a regular express instance just with a few extra methods

app.use(bodyParser.json());

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
  const response = await fetch('https://api.github.com/repos/ikatun/express-with-json');
  return await response.json();
});

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

```
