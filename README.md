# 🔐 WebGuard

### Basic Website Security Signal Checker

WebGuard is a lightweight browser extension designed to help users quickly review basic security-related signals of a website before interacting with it.

It analyzes common URL and connection characteristics and presents the results through a simple, user-friendly dashboard.

> ⚠️ **Important:** WebGuard is a basic security signal checker. A high score does **not** guarantee that a website is safe, legitimate, or free from phishing, malware, or other threats.

---

## ✨ Features

- 🔒 HTTPS connection check
- 🔗 URL structure analysis
- 🌐 Website connection status
- 🚨 Suspicious URL signal detection
- 📊 Security signal score
- 📝 Signal details and warnings
- 💡 Security tips
- 🔄 Scan Again
- 📋 Copy URL
- 🕘 Recent scan history
- 🗑️ Clear scan history
- 📱 Responsive popup interface
- 🔐 Local browser storage for scan history

---

## 🛡️ Security Signals

WebGuard currently checks several basic website signals, including:

- HTTPS availability
- Valid website URL structure
- Supported HTTP/HTTPS connection
- IP address usage instead of a normal domain
- Unusually long URLs
- Large numbers of subdomains
- Suspicious URL characters such as `@`
- Non-standard URL protocols

These checks are **heuristic signals** and are not intended to provide complete website security analysis.

---

## 📊 Signal Score

WebGuard provides a score from **0 to 100** based on the basic signals detected during a scan.

The score is designed to provide a quick summary of the checks performed by WebGuard.

### Important Limitations

The score:

- Does not prove that a website is safe
- Does not prove that a website is malicious
- Does not replace antivirus or browser security protection
- Does not verify website ownership
- Does not guarantee protection against phishing or malware

Users should independently verify a website before entering passwords, payment information, or other sensitive information.

---

## 💡 Security Tip

Always carefully check the website address before entering:

- Passwords
- Payment information
- Personal information
- Login credentials

Be especially careful with links received through unexpected messages, emails, or websites.

---

## ⚙️ How WebGuard Works

The basic workflow is:

```text
Open Website
     ↓
WebGuard Reads Website URL
     ↓
Security Signals Are Checked
     ↓
Signals Are Analyzed
     ↓
Security Score Is Generated
     ↓
Results Are Displayed
```

The extension presents the detected signals in a simple dashboard so users can quickly review the results.

---

## 🚀 Installation

WebGuard can currently be installed as an **unpacked browser extension** in a Chromium-based browser.

### Step 1 — Download the Project

Clone the repository:

```bash
git clone https://github.com/unique845423-maker/WebGuard.git
```

Or download the repository as a ZIP file from GitHub and extract it.

### Step 2 — Open Extensions

Open the extensions management page in your Chromium-based browser.

For Microsoft Edge:

```text
edge://extensions/
```

For Google Chrome:

```text
chrome://extensions/
```

### Step 3 — Enable Developer Mode

Turn on:

```text
Developer mode
```

### Step 4 — Load WebGuard

Select:

```text
Load unpacked
```

Choose the WebGuard project folder containing:

```text
manifest.json
```

### Step 5 — Launch WebGuard

After installation, WebGuard should appear in the browser's extension list.

Pin the extension to the browser toolbar for convenient access.

---

## 🧪 Basic Usage

1. Open a website in the browser.
2. Open the WebGuard extension.
3. Start a scan.
4. Review the security signal score.
5. Check the individual signal details.
6. Read the security tip when provided.
7. Use **Scan Again** if required.
8. Review previous scans through **Recent Scans**.

---

## 🌐 Live Demo

**WebGuard Website:**
https://webguard-extension.vercel.app/

The website provides information about the WebGuard project and its security-checking concept.

---

## 🖼️ Project Visuals

The repository includes visual assets representing different parts of the WebGuard project:

- `webguard-hero.jpg`
- `webguard-scanner.jpg`
- `webguard-how-it-works.jpg`
- `webguard-extension.jpg`
- `webguard-mobile.jpg`
- `webguard-security.jpg`
- `webguard-privacy.jpg`

These assets are used to present the project and its features visually.

---

## 🧰 Tech Stack

### Frontend / Website

- HTML
- CSS
- JavaScript

### Browser Extension

- Chrome/Chromium Extension APIs
- JavaScript
- HTML
- CSS
- Browser local storage

### Project Components

```text
WebGuard
├── backend/
├── index.html
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── webguard-hero.jpg
├── webguard-scanner.jpg
├── webguard-how-it-works.jpg
├── webguard-extension.jpg
├── webguard-mobile.jpg
├── webguard-security.jpg
├── webguard-privacy.jpg
└── README.md
```

---

## 🔐 Privacy

WebGuard is designed around basic website-signal checking.

Scan history is stored using browser-local storage for the extension's recent scan functionality.

WebGuard should not be considered a replacement for dedicated security software, browser protection, antivirus software, or professional security analysis.

---

## ⚠️ Limitations

WebGuard is a basic security-signal project and has several limitations.

It does not guarantee that a website is:

- Safe
- Legitimate
- Free from malware
- Free from phishing
- Owned by the claimed organization
- Secure against all types of attacks

A website can have valid HTTPS and still be malicious.

Therefore, WebGuard's score should be treated only as an informational signal and not as a definitive security verdict.

---

## 🔮 Future Improvements

Possible future improvements include:

- More advanced URL analysis
- Domain reputation checking
- Threat-intelligence integration
- Phishing detection
- Malware-related indicators
- Certificate information
- Improved risk analysis
- More detailed scan reports
- Additional browser support
- Improved mobile experience
- Advanced security APIs

---

## 🎯 Project Goal

The main goal of WebGuard is to create a simple and understandable security tool that helps users become more aware of basic website security signals.

The project also provides practical experience with:

- Web development
- JavaScript
- Browser extensions
- URL analysis
- Security concepts
- Frontend design
- Local browser storage
- Basic security automation

---

## 👨‍💻 Project

**WebGuard — Basic Website Security Signal Checker**

GitHub Repository:

https://github.com/unique845423-maker/WebGuard

Live Website:

https://webguard-extension.vercel.app/

---

## ⚠️ Disclaimer

WebGuard is an educational and informational project.

It does not provide guaranteed protection against phishing, malware, fraud, malicious websites, or other online threats.

Always use appropriate browser security features, antivirus/security software, and safe browsing practices.

**Stay aware. Verify before you trust. 🔐**
