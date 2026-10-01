const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "WebGuard Backend is Running!"
    });
});

// Website URL checker
app.post("/api/check", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            status: "error",
            message: "URL is required."
        });
    }

    try {
        const parsedUrl = new URL(url);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                status: "error",
                message: "Only HTTP and HTTPS URLs are supported."
            });
        }

        let score = 100;
        const signals = [];

        if (parsedUrl.protocol !== "https:") {
            score -= 25;
            signals.push("Website is not using HTTPS.");
        }

        if (url.length > 180) {
            score -= 10;
            signals.push("URL is unusually long.");
        }

        const hostnameParts = parsedUrl.hostname.split(".");

        if (hostnameParts.length >= 5) {
            score -= 10;
            signals.push("Domain has many subdomains.");
        }

        if (parsedUrl.hostname.includes("@") || url.includes("\\")) {
            score -= 15;
            signals.push("URL contains unusual characters.");
        }

        score = Math.max(0, Math.min(100, score));

        let result;

        if (score >= 90) {
            result = "Strong basic signals";
        } else if (score >= 70) {
            result = "Review recommended";
        } else {
            result = "Multiple signals detected";
        }

        res.json({
            status: "success",
            url: url,
            score: score,
            result: result,
            signals: signals
        });

    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Invalid URL."
        });
    }
});

app.listen(PORT, () => {
    console.log(`WebGuard Backend running at http://localhost:${PORT}`);
});