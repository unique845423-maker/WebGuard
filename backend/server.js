const express = require("express");
const cors = require("cors");
const dns = require("dns").promises;
const net = require("net");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10kb" }));

// --------------------------------------------------
// Security helper: check whether an IP is private/local
// --------------------------------------------------
function isPrivateOrReservedIP(ip) {
    if (!net.isIP(ip)) {
        return false;
    }

    // IPv4
    if (net.isIPv4(ip)) {
        const parts = ip.split(".").map(Number);
        const [a, b] = parts;

        return (
            a === 10 ||
            (a === 172 && b >= 16 && b <= 31) ||
            (a === 192 && b === 168) ||
            a === 127 ||
            a === 0 ||
            (a === 169 && b === 254)
        );
    }

    // IPv6
    const normalized = ip.toLowerCase();

    return (
        normalized === "::1" ||
        normalized === "::" ||
        normalized.startsWith("fc") ||
        normalized.startsWith("fd") ||
        normalized.startsWith("fe80:")
    );
}

// --------------------------------------------------
// Security helper: validate hostname
// --------------------------------------------------
async function validateTarget(urlObject) {
    const hostname = urlObject.hostname.toLowerCase();

    // Block obvious local hostnames
    if (
        hostname === "localhost" ||
        hostname.endsWith(".localhost") ||
        hostname.endsWith(".local")
    ) {
        throw new Error("Local or private destinations are not allowed.");
    }

    // If hostname itself is an IP, check it
    if (net.isIP(hostname)) {
        if (isPrivateOrReservedIP(hostname)) {
            throw new Error("Private or reserved IP addresses are not allowed.");
        }

        return;
    }

    // Resolve hostname and check returned addresses
    const addresses = await dns.lookup(hostname, {
        all: true,
        verbatim: true
    });

    if (!addresses || addresses.length === 0) {
        throw new Error("Unable to resolve hostname.");
    }

    for (const address of addresses) {
        if (isPrivateOrReservedIP(address.address)) {
            throw new Error("Target resolves to a private or reserved IP address.");
        }
    }
}

// --------------------------------------------------
// Basic URL signal analysis
// --------------------------------------------------
function analyzeURL(url) {
    const parsedUrl = new URL(url);

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

    return {
        parsedUrl,
        score,
        result,
        signals
    };
}

// --------------------------------------------------
// Test route
// --------------------------------------------------
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "WebGuard Backend is Running!"
    });
});

// --------------------------------------------------
// Real website check
// --------------------------------------------------
app.post("/api/check", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            status: "error",
            message: "URL is required."
        });
    }

    if (typeof url !== "string" || url.length > 2048) {
        return res.status(400).json({
            status: "error",
            message: "Invalid URL length."
        });
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(url.trim());
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Invalid URL."
        });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({
            status: "error",
            message: "Only HTTP and HTTPS URLs are supported."
        });
    }

    try {
        // Security check before making an outbound request
        await validateTarget(parsedUrl);

        // Basic WebGuard analysis
        const analysis = analyzeURL(parsedUrl.href);

        let reachable = false;
        let statusCode = null;
        let contentType = null;
        let finalUrl = parsedUrl.href;
        let redirectCount = 0;

        let currentUrl = parsedUrl.href;

        // Follow a limited number of redirects manually
        for (let i = 0; i < 4; i++) {
            const controller = new AbortController();

            const timeout = setTimeout(() => {
                controller.abort();
            }, 8000);

            try {
                const response = await fetch(currentUrl, {
                    method: "GET",
                    redirect: "manual",
                    signal: controller.signal,
                    headers: {
                        "User-Agent": "WebGuard/1.0"
                    }
                });

                reachable = true;
                statusCode = response.status;
                contentType = response.headers.get("content-type");

                // Redirect handling
                if (
                    response.status >= 300 &&
                    response.status < 400
                ) {
                    const location = response.headers.get("location");

                    if (!location) {
                        break;
                    }

                    const nextUrl = new URL(location, currentUrl);

                    if (!["http:", "https:"].includes(nextUrl.protocol)) {
                        break;
                    }

                    // Validate every redirect destination
                    await validateTarget(nextUrl);

                    currentUrl = nextUrl.href;
                    redirectCount++;

                    continue;
                }

                break;
            } finally {
                clearTimeout(timeout);
            }
        }

        finalUrl = currentUrl;

        res.json({
            status: "success",
            url: parsedUrl.href,

            score: analysis.score,
            result: analysis.result,
            signals: analysis.signals,

            websiteCheck: {
                reachable,
                statusCode,
                contentType,
                finalUrl,
                redirectCount
            }
        });

    } catch (error) {
        res.json({
            status: "success",
            url: parsedUrl.href,

            score: analyzeURL(parsedUrl.href).score,
            result: "Review recommended",
            signals: [
                ...analyzeURL(parsedUrl.href).signals,
                "WebGuard could not complete the remote website check."
            ],

            websiteCheck: {
                reachable: false,
                statusCode: null,
                contentType: null,
                finalUrl: parsedUrl.href,
                redirectCount: 0
            }
        });
    }
});

// --------------------------------------------------
// Start server
// --------------------------------------------------
app.listen(PORT, () => {
    console.log(`WebGuard Backend running at http://localhost:${PORT}`);
});