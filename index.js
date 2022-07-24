const axios = require("axios");
const { performance } = require("perf_hooks");
const TokenBucketRateLimiter = require("./Token");
const express = require("express");
const app = express();
const port = "3000";
const API_URL = "Your Url";


function callTheAPI(item) {
  axios.get(API_URL);
}

async function fetchAndRetryIfNecessary(callAPIFn) {
  const response = await callAPIFn();
  if (response.status === 429) {
    const retryAfter = response.headers.get("retry-after");
    const millisToSleep = getMillisToSleep(retryAfter);
    await sleep(millisToSleep);
    return fetchAndRetryIfNecessary(callAPIFn);
  }
  return response;
}

app.get("/", async (req, res) => {
  let items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const tokenBucket = new TokenBucketRateLimiter({
    maxRequests: 6, // number of request you want
    maxRequestWindowMS: 3000, //time window for request
  });
  var startTime = performance.now();
  const promises = items.map((item) =>
    tokenBucket.acquireToken(() => callTheAPI(item))
  );

  
  const responses = await Promise.all(promises);
  var endTime = performance.now();
  console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
  res.json({
    time: responses,
  });
});

app.listen(port, () => {
  console.log(`[INFO] Listening on http://localhost:${port}`);
});
