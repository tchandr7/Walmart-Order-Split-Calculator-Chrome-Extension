# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest on `main` | ✅ |
| Older releases | ❌ — always update to latest |

## Reporting a Vulnerability

**Please do NOT open a public GitHub Issue for security vulnerabilities.**

Instead, report privately:
- Open a [GitHub Security Advisory](https://github.com/tchandr7/Walmart-Order-Split-Calculator-Chrome-Extension/security/advisories/new) (preferred)
- Or email the maintainer directly (check the GitHub profile)

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional but appreciated)

You will receive a response within **48 hours** and a fix within **7 days** for critical issues.

## Security Design Principles

This extension is designed with the following security principles:

1. **Zero network calls** — The extension UI has `connect-src 'none'` in its Content Security Policy. No data ever leaves your computer.
2. **Local storage only** — All data (roster, receipt data) is stored in `chrome.storage.local` and `localStorage`, both sandboxed to this extension only.
3. **Minimal permissions** — The content script runs only on Walmart order and purchase history pages, not all of Walmart.com.
4. **HTTPS only** — The extension only activates on `https://` Walmart pages, never `http://`.
5. **No framing** — `frame-ancestors 'none'` in CSP prevents any webpage from embedding the extension UI.
6. **Verified builds** — Every push to `main` triggers a GitHub Actions build from source. Releases include SHA256 checksums so you can verify the ZIP you downloaded matches what CI built.

## Verifying a Download

Every release includes a `*-checksums.txt` file. After downloading the ZIP:

```bash
# Download both files from the release, then:
sha256sum -c walmart-split-extension-vX.X.X-checksums.txt
```

A `OK` result means the ZIP you downloaded is byte-for-byte identical to what GitHub Actions built from the public source code.
