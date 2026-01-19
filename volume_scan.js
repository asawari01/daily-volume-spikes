// import dependencies
import fs from "fs";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["ripHistorical"],
});

// load symbols
const symbols = JSON.parse(fs.readFileSync("symbols.json", "utf-8"));

async function run() {
  const period1 = Math.floor(Date.now() / 1000) - 40 * 24 * 60 * 60;
  const results = [];

  for (const symbol of symbols) {
    try {
      const result = await yahooFinance.chart(symbol, {
        period1,
        interval: "1d",
      });

      const quotes = result.quotes.filter((q) => q.volume != null);
      if (quotes.length < 21) continue;

      const todayVolume = quotes[quotes.length - 1].volume;
      const last20 = quotes.slice(-21, -1);
      const avg20 =
        last20.reduce((sum, q) => sum + q.volume, 0) / last20.length;

      const ratio = todayVolume / avg20;

      results.push({
        symbol,
        ratio,
        volume: todayVolume,
      });
    } catch {
      console.error(`Error fetching ${symbol}`);
    }
  }

  results.sort((a, b) => b.ratio - a.ratio);
  saveToHTML(results.slice(0, 10));
}

run();

// ---------------- HTML GENERATION ----------------

function formatVolume(v) {
  if (v >= 1e7) return (v / 1e7).toFixed(1) + " Cr";
  if (v >= 1e6) return (v / 1e6).toFixed(1) + " M";
  if (v >= 1e3) return (v / 1e3).toFixed(1) + " K";
  return v.toString();
}

function saveToHTML(results) {
  const now = new Date();

  const updatedDate = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const updatedTime = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const rows = results
    .map(
      (r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="stock">${r.symbol}</td>
          <td class="ratio">${r.ratio.toFixed(2)}</td>
          <td class="volume">${formatVolume(r.volume)}</td>
        </tr>`,
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Daily Volume Spikes — NIFTY 50</title>

<style>
:root {
  --bg: #020617;
  --card: #0b1220;
  --border: #1e293b;
  --text: #e5e7eb;
  --muted: #9ca3af;
  --accent: #38bdf8;
  --ratio: #22c55e;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  padding: 32px;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
}

.container {
  max-width: 900px;
  margin: auto;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.title-row h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.date {
  font-size: 14px;
  color: var(--muted);
  white-space: nowrap;
}

.time {
  margin-top: 6px;
  font-size: 15px;
  font-weight: 500;
  color: var(--accent);
}

.subtitle {
  margin-top: 14px;
  font-size: 14px;
  color: var(--accent);
}

.support {
  margin-top: 18px;
  padding: 14px 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
}

.support a {
  color: var(--accent);
  text-decoration: underline;
}

.card {
  margin-top: 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.explain {
  padding: 12px 16px;
  font-size: 13px;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
}

/* MOBILE HORIZONTAL SCROLL FIX */
.table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px; /* ensures horizontal scroll on small screens */
}

th, td {
  padding: 14px 16px;
  font-size: 14px;
}

th {
  text-align: left;
  font-size: 12px;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
}

td {
  border-bottom: 1px solid var(--border);
}

td.stock {
  font-weight: 600;
}

td.ratio {
  color: var(--ratio);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  text-align: right;
}

td.volume {
  text-align: right;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--muted);
}

.footer {
  margin-top: 16px;
  font-size: 12px;
  color: var(--muted);
}
</style>
</head>

<body>
<div class="container">

  <div class="title-row">
    <h1>Daily Volume Spikes — NIFTY 50</h1>
    <div class="date">${updatedDate}</div>
  </div>

  <div class="time">Updated at ${updatedTime} IST</div>

  <div class="subtitle">
    Stocks showing unusually high trading volume compared to their recent average.
  </div>

  <div class="support">
    This page is open access and updated daily after market close.
    If you find it useful, you may support its maintenance with a
    <strong>one-time ₹99 support fee</strong>.
    <br />
    <a href="https://rzp.io/rzp/WF8Nxfql" target="_blank" rel="noopener noreferrer">
      Support this project
    </a>
  </div>

  <div class="card">
    <div class="explain">
      Volume Ratio = Today’s volume ÷ 20-day average volume
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Stock</th>
            <th style="text-align:right;">Volume Ratio</th>
            <th style="text-align:right;">Today’s Volume</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  </div>

  <div class="footer">
    Data source: Yahoo Finance<br />
    For informational purposes only. Not investment advice.
  </div>

</div>
</body>
</html>
`;

  fs.writeFileSync("index.html", html);
}
