const parseDomain = require('parse-domain');
const eshops = require('require-all')(`${__dirname}/eshops`);

module.exports = async link => {
  const {'domain': eshop} = parseDomain(link);
  const products = await eshops[eshop].scrape(link);

  return products;
};
