const fs = require("fs");
const qrcode = require("qrcode");
const {
  Client,
  MessageMedia,
  LocalAuth,
  // LegacySessionAuth,
} = require("whatsapp-web.js");
const axios = require("axios");
const express = require("express");

const port = process.env.PORT || 3000;
const app = express();

// const sessionPath = "./session.json";

// let sessionConfig;

// if (fs.existsSync(sessionPath)) {
//   sessionConfig = require(sessionPath);
// }

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {},
});

client.initialize();

client.on("qr", (qr) => {
  console.log("QRCODE : ", qr);
  qrcode.toDataURL(qr, (err, url) => {
    app.get("/qr", (req, res) => {
      res.send(`<img src="${url}" width="200" height="200" />`);
    });
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

// client.on("authenticated", (session) => {
//   sessionConfig = session;

//   fs.writeFile(sessionPath, JSON.stringify(session), (err) => {
//     if (err) {
//       console.error(err);
//     }
//   });
// });

// client.on("disconnected", () => {
//   if (fs.existsSync(sessionPath)) {
//     fs.unlinkSync(sessionPath, (err) => {
//       if (err) {
//         console.error(err);
//       }
//     });

//     client.destroy();
//     client.initialize();
//   }
// });

client.on("message", async (msg) => {
  if (msg.body.toLowerCase() == "p") {
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

  if (msg.body.toLowerCase() == "kalimat anime dong puh") {
    const res = await axios.get("https://katanime.vercel.app/api/getrandom");
    const item = res.data.result[0];

    msg.reply(`"${item.indo}" \n ~ ${item.character} (${item.anime})`);
  }

  if (msg.body.toLowerCase() == "waifu dong puh") {
    const res = await axios.get("https://api.waifu.pics/sfw/waifu");
    const imageUrl = res.data.url;

    const media = await MessageMedia.fromUrl(imageUrl);

    msg.reply(media);
  }

  if (msg.type == "image") {
    if (msg.body == "stiker") {
      if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        const chat = await msg.getChat();

        chat.sendMessage(media, { sendMediaAsSticker: true });
        msg.delete();
      }
    }
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("I'ts works!");
});

app.post("/send", (req, res) => {
  const phone = req.body.phone + "@c.us";
  const msg = req.body.message;

  client
    .sendMessage(phone, msg)
    .then(() => {
      res.send({
        success: true,
        message: "pesan berhasil terkirim",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "gagal mengirimkan pesan",
        error: err,
      });
    });
});

app.listen(port, () => {
  console.log("Running on http://localhost:" + port);
});

module.exports = app;
