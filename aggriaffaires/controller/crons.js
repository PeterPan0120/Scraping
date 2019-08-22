const Scrapper = require("./scrapper");

module.exports.prepareCron = function(con, result) {
	Scrapper.doScrape(con, result);
};
