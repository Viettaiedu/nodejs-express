const { default: axios } = require("axios");
const express = require("express");
const app = express();
const redis = require("redis");

const client = redis.createClient(6379);
client.on("error", (err) => console.log(err));
app.get("/photos", async (req, res) => {
  const keyRedis = "photos";
  await client.connect();
  try {
    const photos = await client.get(keyRedis);

    if (photos) {
      res.status(304).json({ message: "OK", photos });
      await client.disconnect();
      return;
    }
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/photos"
    );
    await client.setEx(keyRedis, 3600, JSON.stringify(response.data));
    await client.disconnect();
    res.status(200).json(response.data);
    // // await client.disc onnect();
  } catch (error) {
    console.log(error);
  }
});
app.listen(3000, () => console.log("Server listening on port" + 3000));
