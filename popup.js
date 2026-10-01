const websiteName =
    document.getElementById("websiteName");

const pageTitle =
    document.getElementById("pageTitle");

const domainName =
    document.getElementById("domainName");

const scanTime =
    document.getElementById("scanTime");

const copyUrl =
    document.getElementById("copyUrl");


const scoreValue =
    document.getElementById("scoreValue");

const scoreTitle =
    document.getElementById("scoreTitle");

const scoreDescription =
    document.getElementById("scoreDescription");


const httpsStatus =
    document.getElementById("httpsStatus");

const urlStatus =
    document.getElementById("urlStatus");

const connectionStatus =
    document.getElementById("connectionStatus");


const signalList =
    document.getElementById("signalList");

const result =
    document.getElementById("result");


const tipsText =
    document.getElementById("tipsText");

const scanAgain =
    document.getElementById("scanAgain");


const scanHistory =
    document.getElementById("scanHistory");

const clearHistory =
    document.getElementById("clearHistory");


let currentPageUrl = "";


const HISTORY_KEY =
    "webguardScanHistory";

const MAX_HISTORY = 5;


/* =========================
   BASIC HELPERS
========================= */

function addSignal(signals, message) {

    signals.push(message);

}


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================
   SCORE
========================= */

function updateScore(score) {

    scoreValue.textContent = score;


    if (score >= 90) {

        scoreTitle.textContent =
            "Strong basic signals";

        scoreDescription.textContent =
            "WebGuard found no obvious warning signals.";

        scoreValue.style.color =
            "#4ade80";

        return;

    }


    if (score >= 70) {

        scoreTitle.textContent =
            "Mostly normal";

        scoreDescription.textContent =
            "A few signals may need a quick review.";

        scoreValue.style.color =
            "#a3e635";

        return;

    }


    if (score >= 50) {

        scoreTitle.textContent =
            "Review recommended";

        scoreDescription.textContent =
            "Some website signals need attention.";

        scoreValue.style.color =
            "#fbbf24";

        return;

    }


    scoreTitle.textContent =
        "Multiple signals detected";

    scoreDescription.textContent =
        "Several website signals should be reviewed.";

    scoreValue.style.color =
        "#f87171";

}


/* =========================
   SECURITY TIP
========================= */

function updateSecurityTip(score, signals) {

    if (signals.length === 0) {

        tipsText.textContent =
            "HTTPS is enabled, but always verify the website address before entering sensitive information.";

        return;

    }


    if (score >= 70) {

        tipsText.textContent =
            "Some website signals need attention. Double-check the domain before entering passwords or personal information.";

        return;

    }


    tipsText.textContent =
        "Several warning signals were detected. Avoid entering passwords, payment details, or personal information until you verify the website.";

}


/* =========================
   SIGNAL DETAILS
========================= */

function updateSignalDetails(signals) {

    if (signals.length === 0) {

        signalList.innerHTML =
            "✓ No obvious warning signals detected<br>" +
            "HTTPS, URL structure and connection checks look normal.";

        return;

    }


    const visibleSignals =
        signals.slice(0, 4);


    signalList.innerHTML =
        "<strong style='color:#fbbf24;'>Signals to review:</strong><br>" +
        visibleSignals
            .map(
                signal =>
                    "⚠ " +
                    escapeHtml(signal)
            )
            .join("<br>");


    if (signals.length > 4) {

        signalList.innerHTML +=
            "<br>+ " +
            (signals.length - 4) +
            " additional signal(s)";

    }

}


/* =========================
   HISTORY STATUS
========================= */

function getHistoryStatus(score, signals) {

    if (signals.length === 0) {

        return {
            icon: "✓",
            text: "Normal",
            color: "#4ade80"
        };

    }


    if (score >= 70) {

        return {
            icon: "!",
            text: "Review",
            color: "#fbbf24"
        };

    }


    return {
        icon: "⚠",
        text: "Attention",
        color: "#f87171"
    };

}


/* =========================
   STORAGE CHECK
========================= */

function storageAvailable() {

    return (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
    );

}


/* =========================
   SAVE HISTORY
========================= */

async function saveScanHistory(data) {

    if (!storageAvailable()) {

        console.warn(
            "WebGuard storage permission is unavailable."
        );

        return;

    }


    try {

        const stored =
            await chrome.storage.local.get(
                HISTORY_KEY
            );


        let history =
            Array.isArray(
                stored[HISTORY_KEY]
            )
                ? stored[HISTORY_KEY]
                : [];


        history.unshift(data);


        history =
            history.slice(
                0,
                MAX_HISTORY
            );


        await chrome.storage.local.set({

            [HISTORY_KEY]:
                history

        });


        await displayHistory();

    }
    catch (error) {

        console.error(
            "Could not save history:",
            error
        );

    }

}


/* =========================
   DISPLAY HISTORY
========================= */

async function displayHistory() {

    if (!storageAvailable()) {

        scanHistory.innerHTML =
            '<div class="history-empty">' +
            "History unavailable." +
            "</div>";

        return;

    }


    try {

        const stored =
            await chrome.storage.local.get(
                HISTORY_KEY
            );


        const history =
            Array.isArray(
                stored[HISTORY_KEY]
            )
                ? stored[HISTORY_KEY]
                : [];


        if (history.length === 0) {

            scanHistory.innerHTML =
                '<div class="history-empty">' +
                "No recent scans." +
                "</div>";

            return;

        }


        scanHistory.innerHTML = "";


        history.forEach(item => {

            const signals =
                Array.isArray(item.signals)
                    ? item.signals
                    : [];


            const status =
                getHistoryStatus(
                    Number(item.score) || 0,
                    signals
                );


            const historyItem =
                document.createElement("div");


            historyItem.className =
                "history-item";


            historyItem.innerHTML = `

                <div
                    class="history-icon"
                    style="color:${status.color};"
                >
                    ${status.icon}
                </div>


                <div class="history-content">

                    <span class="history-domain">
                        ${escapeHtml(
                            item.domain ||
                            "Unknown"
                        )}
                    </span>


                    <span class="history-time">
                        ${escapeHtml(
                            item.time ||
                            "Unknown time"
                        )}
                    </span>

                </div>


                <div class="history-score">

                    <div
                        style="color:${status.color};"
                    >
                        ${Number(item.score) || 0}
                    </div>


                    <div
                        class="history-status"
                        style="color:${status.color};"
                    >
                        ${status.text}
                    </div>

                </div>

            `;


            scanHistory.appendChild(
                historyItem
            );

        });

    }
    catch (error) {

        console.error(
            "Could not display history:",
            error
        );


        scanHistory.innerHTML =
            '<div class="history-empty">' +
            "History unavailable." +
            "</div>";

    }

}


/* =========================
   CLEAR HISTORY
========================= */

async function clearScanHistory() {

    if (!storageAvailable()) {

        console.warn(
            "WebGuard storage permission is unavailable."
        );

        clearHistory.textContent =
            "⚠ Storage unavailable";

        setTimeout(() => {

            clearHistory.textContent =
                "🗑️ Clear History";

        }, 1500);

        return;

    }


    try {

        await chrome.storage.local.remove(
            HISTORY_KEY
        );


        await displayHistory();


        clearHistory.textContent =
            "✓ History Cleared";


        setTimeout(() => {

            clearHistory.textContent =
                "🗑️ Clear History";

        }, 1500);

    }
    catch (error) {

        console.error(
            "Could not clear history:",
            error
        );


        clearHistory.textContent =
            "⚠ Clear failed";


        setTimeout(() => {

            clearHistory.textContent =
                "🗑️ Clear History";

        }, 1500);

    }

}


/* =========================
   COPY URL
========================= */

async function copyCurrentUrl() {

    if (!currentPageUrl) {

        return;

    }


    const originalText =
        copyUrl.textContent;


    try {

        await navigator.clipboard.writeText(
            currentPageUrl
        );


        copyUrl.textContent =
            "✓ URL Copied";


        setTimeout(() => {

            copyUrl.textContent =
                originalText;

        }, 1500);

    }
    catch (error) {

        try {

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                currentPageUrl;


            textarea.style.position =
                "fixed";

            textarea.style.opacity =
                "0";


            document.body.appendChild(
                textarea
            );


            textarea.focus();

            textarea.select();


            document.execCommand(
                "copy"
            );


            textarea.remove();


            copyUrl.textContent =
                "✓ URL Copied";


            setTimeout(() => {

                copyUrl.textContent =
                    originalText;

            }, 1500);

        }
        catch (fallbackError) {

            console.error(
                "Copy failed:",
                fallbackError
            );


            copyUrl.textContent =
                "⚠ Copy failed";


            setTimeout(() => {

                copyUrl.textContent =
                    originalText;

            }, 1500);

        }

    }

}


/* =========================
   RESET UI
========================= */

function resetScanUI() {

    websiteName.textContent =
        "Checking...";


    pageTitle.textContent =
        "Checking...";


    domainName.textContent =
        "Checking...";


    scanTime.textContent =
        "Checking...";


    copyUrl.textContent =
        "📋 Copy URL";


    scoreValue.textContent =
        "--";


    scoreValue.style.color =
        "";


    scoreTitle.textContent =
        "Checking website";


    scoreDescription.textContent =
        "WebGuard is analyzing basic signals.";


    httpsStatus.textContent =
        "Checking...";


    urlStatus.textContent =
        "Checking...";


    connectionStatus.textContent =
        "Checking...";


    httpsStatus.style.color =
        "";

    urlStatus.style.color =
        "";

    connectionStatus.style.color =
        "";


    signalList.textContent =
        "Analyzing...";


    tipsText.textContent =
        "Always check the website address before entering passwords, payment details, or personal information.";


    result.style.background =
        "";

    result.style.borderColor =
        "";


    result.innerHTML =
        "<strong>Checking website...</strong>" +
        "<span>" +
        "Please wait while WebGuard analyzes this page." +
        "</span>";

}


/* =========================
   UNAVAILABLE PAGE
========================= */

function showUnavailable(message) {

    websiteName.textContent =
        "Unable to read page";


    pageTitle.textContent =
        "Unavailable";


    domainName.textContent =
        "Unavailable";


    scanTime.textContent =
        new Date().toLocaleTimeString();


    currentPageUrl =
        "";


    copyUrl.textContent =
        "📋 Copy URL";


    scoreValue.textContent =
        "—";


    scoreValue.style.color =
        "#94a3b8";


    scoreTitle.textContent =
        "Scan unavailable";


    scoreDescription.textContent =
        message ||
        "WebGuard could not access the current page.";


    httpsStatus.textContent =
        "Checking...";


    urlStatus.textContent =
        "Checking...";


    connectionStatus.textContent =
        "Checking...";


    signalList.textContent =
        "The browser did not provide enough page information.";


    tipsText.textContent =
        "Always check the website address before entering passwords, payment details, or personal information.";


    result.style.background =
        "#78350f";


    result.style.borderColor =
        "#92400e";


    result.innerHTML =
        "<strong>⚠ Scan unavailable</strong>" +
        "<span>" +
        "WebGuard could not access this page. " +
        "Try a normal website such as Google and scan again." +
        "</span>";

}


/* =========================
   MAIN SCAN
========================= */

async function scanWebsite() {

    resetScanUI();


    try {

        const tabs =
            await chrome.tabs.query({

                active: true,

                currentWindow: true

            });


        const tab =
            tabs &&
            tabs.length > 0
                ? tabs[0]
                : null;


        if (!tab || !tab.url) {

            showUnavailable(
                "WebGuard could not access the current browser page."
            );

            return;

        }


        currentPageUrl =
            tab.url;


        pageTitle.textContent =
            tab.title ||
            "Untitled page";


        scanTime.textContent =
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        let url;


        try {

            url =
                new URL(tab.url);

        }
        catch (error) {

            showUnavailable(
                "WebGuard could not validate the current page URL."
            );

            return;

        }


        const hostname =
            url.hostname;


        websiteName.textContent =
            hostname ||
            "Current page";


        domainName.textContent =
            hostname ||
            "Unknown";


        /* =========================
           SCORE
        ========================= */

        let score =
            100;


        const suspiciousSignals =
            [];


        /* =========================
           HTTPS
        ========================= */

        if (
            url.protocol === "https:"
        ) {

            httpsStatus.textContent =
                "✓ Secure";


            httpsStatus.style.color =
                "#4ade80";

        }
        else {

            httpsStatus.textContent =
                "⚠ Review";


            httpsStatus.style.color =
                "#fbbf24";


            score -= 25;


            addSignal(
                suspiciousSignals,
                "The page is not using HTTPS."
            );

        }


        /* =========================
           URL STRUCTURE
        ========================= */

        const hostnameParts =
            hostname
                .split(".")
                .filter(Boolean);


        const hostnameLooksNormal =
            hostname.length > 0 &&
            hostname.includes(".") &&
            !hostname.startsWith(".") &&
            !hostname.endsWith(".");


        if (
            hostnameLooksNormal
        ) {

            urlStatus.textContent =
                "✓ Normal";


            urlStatus.style.color =
                "#4ade80";

        }
        else {

            urlStatus.textContent =
                "⚠ Review";


            urlStatus.style.color =
                "#fbbf24";


            score -= 20;


            addSignal(
                suspiciousSignals,
                "The website address has an unusual structure."
            );

        }


        /* =========================
           CONNECTION
        ========================= */

        if (
            url.protocol === "http:" ||
            url.protocol === "https:"
        ) {

            connectionStatus.textContent =
                "✓ Active";


            connectionStatus.style.color =
                "#4ade80";

        }
        else {

            connectionStatus.textContent =
                "⚠ Review";


            connectionStatus.style.color =
                "#fbbf24";


            score -= 20;


            addSignal(
                suspiciousSignals,
                "The page uses a non-standard web protocol."
            );

        }


        /* =========================
           IP ADDRESS
        ========================= */

        const ipAddressPattern =
            /^(?:\d{1,3}\.){3}\d{1,3}$/;


        if (
            ipAddressPattern.test(
                hostname
            )
        ) {

            score -= 15;


            addSignal(
                suspiciousSignals,
                "The website uses an IP address instead of a normal domain name."
            );

        }


        /* =========================
           LONG URL
        ========================= */

        if (
            tab.url.length > 180
        ) {

            score -= 10;


            addSignal(
                suspiciousSignals,
                "The URL is unusually long."
            );

        }


        /* =========================
           MANY SUBDOMAINS
        ========================= */

        if (
            hostnameParts.length >= 5
        ) {

            score -= 10;


            addSignal(
                suspiciousSignals,
                "The domain contains many subdomain levels."
            );

        }


        /* =========================
           UNUSUAL CHARACTERS
        ========================= */

        if (
            tab.url.includes("@") ||
            tab.url.includes("\\")
        ) {

            score -= 15;


            addSignal(
                suspiciousSignals,
                "The URL contains unusual characters that should be reviewed."
            );

        }


        /* =========================
           NON-STANDARD PROTOCOL
        ========================= */

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {

            score -= 20;


            addSignal(
                suspiciousSignals,
                "The page is not using a standard HTTP/HTTPS protocol."
            );

        }


        /* =========================
           CLAMP SCORE
        ========================= */

        score =
            Math.max(
                0,
                Math.min(
                    100,
                    score
                )
            );


        /* =========================
           UPDATE UI
        ========================= */

        updateScore(
            score
        );


        updateSignalDetails(
            suspiciousSignals
        );


        updateSecurityTip(
            score,
            suspiciousSignals
        );


        /* =========================
           RESULT
        ========================= */

        if (
            suspiciousSignals.length === 0
        ) {

            result.style.background =
                "#14532d";


            result.style.borderColor =
                "#166534";


            result.innerHTML =
                "<strong>✓ Basic checks look normal</strong>" +
                "<span>" +
                "WebGuard found no obvious warning signals on this page." +
                "</span>";

        }
        else {

            result.style.background =
                "#78350f";


            result.style.borderColor =
                "#92400e";


            result.innerHTML =
                "<strong>⚠ Review this website</strong>" +
                "<span>" +
                "WebGuard detected one or more signals that deserve attention." +
                "</span>";

        }


        /* =========================
           SAVE HISTORY
        ========================= */

        const historyStatus =
            getHistoryStatus(
                score,
                suspiciousSignals
            );


        const historyData = {

            domain:
                hostname ||
                "Unknown",


            score:
                score,


            signals:
                suspiciousSignals,


            status:
                historyStatus.text,


            time:
                new Date().toLocaleString(
                    [],
                    {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )

        };


        await saveScanHistory(
            historyData
        );

    }
    catch (error) {

        console.error(
            "WebGuard scan error:",
            error
        );


        showUnavailable(
            "WebGuard could not complete the basic scan."
        );

    }

}


/* =========================
   BUTTON EVENTS
========================= */

copyUrl.addEventListener(
    "click",
    copyCurrentUrl
);


scanAgain.addEventListener(
    "click",
    scanWebsite
);


clearHistory.addEventListener(
    "click",
    clearScanHistory
);


/* =========================
   START
========================= */

async function startWebGuard() {

    await displayHistory();

    await scanWebsite();

}


startWebGuard();