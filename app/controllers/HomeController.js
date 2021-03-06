const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const {baseUrl} = require("../helpers/Constans");
const {extractId, extractCountry} = require('../helpers/Extractor');


const home = async (req, res, next) => {
  try {
    const response = await Axios.get(baseUrl);
    const $ = cheerio.load(response.data);

    const movieList = $("div.latest").eq(0).find("article.box");
    let latestMovie = [];
    movieList.each((i, elem) => {
      // const id = extractId($(elem).find("a").eq(0).attr("href"));
      // const url = $(elem).find(".ml-mask").attr("href");
        latestMovie.push({
          type: "movie",
          title: $(elem).find('h2.entry-title').text(),
          url: extractId($(elem).find('a.tip').attr("href")),
          country: ($(elem).find('div.c').find('a').text() != "") ? $(elem).find('div.c').find('a').text() : null,
          linkCountry: ($(elem).find('div.c').find('a').attr('href')) ? extractCountry($(elem).find('div.c').find('a').attr('href')) : null,
          quality: $(elem).find('span.quality').text(),
          image: $(elem).find('div.limit').find('img').attr('src'),
          dateCreated: $(elem).find('div.t').eq(0).find('time').text(),
        });
    });


   	const seriesList = $("div.latest").eq(1).find("article.box");
    let latestSeries = [];
    seriesList.each((i, elem) => {
        latestSeries.push({
          type: "series",
          title: $(elem).find('h2.entry-title').text(),
          url: extractId($(elem).find('a.tip').attr("href")),
          country: ($(elem).find('div.c').find('a').text() != "") ? $(elem).find('div.c').find('a').text() : null,
          linkCountry: ($(elem).find('div.c').find('a').attr('href')) ? extractCountry($(elem).find('div.c').find('a').attr('href')) : null,
          image: $(elem).find('div.limit').find('img').attr('src'),
          dateCreated: $(elem).find('div.t').eq(0).find('time').text(),
        });
    });


    res.send({
      status: true,
      message: "succes",
      data: { latestMovie, latestSeries},
    });
  } catch (err) {
    res.send({ status: false, message: err.stack });
  }
};

module.exports = { home };