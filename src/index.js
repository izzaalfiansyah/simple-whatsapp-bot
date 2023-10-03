const qrcode = require("qrcode-terminal");

const { Client, MessageMedia } = require("whatsapp-web.js");
const client = new Client();

const axios = require("axios");

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  console.log(msg);

  if (msg.body == "p") {
    msg.reply("q");
  }

  if (msg.body.toLowerCase().includes("hitung")) {
    const bilangan = msg.body
      .toLowerCase()
      .replace("hitung", "")
      .replace(":", "")
      .replace(" ", "");

    try {
      const value = eval(bilangan);
      msg.reply(`Hasil dari ${bilangan} adalah ${value}`);
    } catch (e) {
      msg.reply("Bilangan tidak valid");
    }
  }

  if (msg.body == "kalimat anime dong puh") {
    const res = await axios.get("https://katanime.vercel.app/api/getrandom");
    const item = res.data.result[0];

    msg.reply(`"${item.indo}" \n ~ ${item.character} (${item.anime})`);
  }

  if (msg.body == "waifu dong puh") {
    const res = await axios.get("https://api.waifu.pics/sfw/waifu");
    const imageUrl = res.data.url;

    const media = await MessageMedia.fromUrl(imageUrl);

    msg.reply(media);
  }
});
