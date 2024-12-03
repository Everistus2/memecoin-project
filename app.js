const fs = require("fs");
const axios = require("axios");

const main = async () => {
  setInterval(async () => {
    try {
      // Get Latest Token list
      console.log("app starting");
      const data = await fetchLatest();
      if (data.length === 0) {
        console.log("No New Tokens");
        return;
      }
      // Save List
      saveToList(data);
    } catch (err) {
      console.log("Error occured: ", err);
    }
  }, [parseInt(process.env.FETCH_INTERVAL) * 1000]);
};

//fetch latest data and only take updated data compared to the last-saved data.
const fetchLatest = async () => {
  try {
    const res = await axios.get(process.env.FETCH_LATEST);
    const data = res.data;

    // Load existing list from saved file
    let existingList = fs.readFileSync("./result/tokenList.json", "utf-8");
    existingList = JSON.parse(existingList);

    // get the saved last token
    const lastOne = existingList[0];
    const index =
      existingList.length > 0 && lastOne.tokenAddress
        ? data.map((d) => d.tokenAddress).indexOf(lastOne.tokenAddress)
        : data.length;

    console.log("Index: ", index);
    let newData = [];
    if (index < 0) newData = data;
    else {
      newData = data.slice(0, index);
    }

    // Populate with timestamp
    newData = newData.map((d) => ({ ...d, timeStamp: new Date() })); //updated tokens
    console.log("New tokens: ", newData.length);

    // Populate with Pair
    const tokens = newData.map((d) => d.tokenAddress); //updated token addresses
    const pairs = await fetchPairByGroup(tokens); //pairs list
    newData = newData.map((d, index) => ({ ...d, pair: pairs[index] })); //{token, pair}
    return newData;
  } catch (err) {
    console.log("fetchLatest error:", err);
  }
};

const fetchPairByGroup = async (tokens) => {
  const promises = Promise.all(tokens.map((t) => fetchPair(t)));
  const res = await promises.then();
  return res;
};

const fetchPair = async (token) => {
  const res = await axios.get(`${process.env.FETCH_PAIR}/${token}`);
  const data = res.data;
  return data.pairs;
};

const saveToList = (data) => {
  try {
    // Load existing list from saved file
    let existingList = fs.readFileSync("./result/tokenList.json", "utf-8");
    existingList = JSON.parse(existingList);
    existingList = [...data, ...existingList];
    fs.writeFileSync("./result/tokenList.json", JSON.stringify(existingList));
    console.log(`Added ${data.length} new tokens`);
  } catch (err) {
    console.log("save error:", err);
  }
};

module.exports = main;
