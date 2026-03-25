const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/feed", async (req, res) => {
    try {
        const response = await fetch("https://feed.familyrp.es/");
        const html = await response.text();

        const $ = cheerio.load(html);

        // pillamos el div que quieres
        const content = $(".flex.flex-col.relative.h-full.w-full").html();

        res.json({ html: content });

    } catch (err) {
        res.status(500).json({ error: "Error cargando feed" });
    }
});

app.listen(3000, () => console.log("Server en http://localhost:3000"));