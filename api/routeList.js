const axios = require('axios');
const queryString = require('query-string');

const URL = 'http://webservices.nextbus.com/service/publicXMLFeed';

module.exports = async (req, res) => {
  const { data } = await axios.get(
    URL + '?' + queryString.stringify(req.query)
  );
  return res.send(data);
};
