const Koa = require('koa');
const axios = require('axios');
const app = new Koa();

const URL = 'http://webservices.nextbus.com/service/publicXMLFeed';

app.use(async ctx => {
  const { url } = ctx;
  const query = url.slice(url.indexOf('?'));
  const { data } = await axios.get(URL + query);

  ctx.status = 200;
  ctx.set('Content-Type', 'text/xml');
  ctx.body = data;
});

app.listen(3000);
