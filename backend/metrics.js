const client = require("prom-client");
const register = new client.Registry();

const shortenedUrlsCounter = new client.Counter({
  name: "url_shortener_shortened_total",
  help: "Total number of shortened URLs created",
  registers: [register],
});

const redirectCounter = new client.Counter({
  name: "url_shortener_redirects_total",
  help: "Total number of successful redirects",
  registers: [register],
});

const notFoundCounter = new client.Counter({
  name: "url_shortener_404_total",
  help: "Total number of 404 errors for invalid short codes",
  registers: [register],
});

const totalErrorCounter = new client.Counter({
  name: "Error_Found_Total",
  help: "Total number of errors for the whole system requests",
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

module.exports = {
shortenedUrlsCounter,
redirectCounter,
notFoundCounter,
totalErrorCounter,
httpRequestDuration,
register

}