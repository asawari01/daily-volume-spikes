//import yahoo
import fs from "fs";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["ripHistorical"],
});

// define symbols
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

      const today = quotes[quotes.length - 1].volume;
      const last20 = quotes.slice(-21, -1);
      const avg20 =
        last20.reduce((sum, q) => sum + q.volume, 0) / last20.length;

      const ratio = today / avg20;

      results.push({
        symbol,
        ratio,
      });
    } catch (err) {
      console.error(`Error for ${symbol}`);
    }
  }

  results.sort((a, b) => b.ratio - a.ratio);

  console.log("\nTop Volume Spikes:");
  results.slice(0, 10).forEach((r, i) => {
    console.log(`${i + 1}. ${r.symbol} | Volume Ratio: ${r.ratio.toFixed(2)}`);
  });

  saveToHTML(results.slice(0, 10));
}

run();

function saveToHTML(results) {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const rows = results
    .map(
      (r, i) =>
        `<tr>
          <td>${i + 1}</td>
          <td class="symbol">${r.symbol}</td>
          <td class="ratio">${r.ratio.toFixed(2)}</td>
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
          --bg: #0f172a;
          --card: #111827;
          --text: #e5e7eb;
          --muted: #9ca3af;
          --border: #1f2933;
          --accent: #22c55e;
          --highlight: #38bdf8;
          --callout-bg: #020617;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 32px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          background: #020617;
          color: var(--text);
        }

        .container {
          max-width: 900px;
          margin: auto;
        }

        .header {
          margin-bottom: 24px;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .open-access {
          margin-top: 16px;
          padding: 16px 18px;
          border-radius: 10px;
          background: var(--callout-bg);
          border: 1px solid var(--border);
        }

        .open-access h2 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--highlight);
        }

        .open-access p {
          margin: 6px 0;
          font-size: 14px;
          color: var(--text);
        }

        .open-access a {
          color: #60a5fa;  
          text-decoration: underline;
          font-weight: 500;
        }

        .open-access a:hover {
          color: #93c5fd;
        }

        .subtitle {
          margin-top: 16px;
          font-size: 14px;
          color: var(--highlight);
        }

        .meta {
          margin-top: 8px;
          font-size: 12px;
          color: var(--muted);
        }

        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: rgba(255, 255, 255, 0.03);
        }

        th,
        td {
          padding: 14px 16px;
          text-align: left;
          font-size: 14px;
        }

        th {
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 12px;
          color: var(--highlight);
          border-bottom: 1px solid var(--border);
        }

        tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background 0.15s ease;
        }

        tbody tr:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        td.symbol {
          font-weight: 600;
        }

        td.ratio {
          font-weight: 600;
          color: var(--accent);
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
        <div class="header">
          <h1>Daily Volume Spikes — NIFTY 50</h1>

          <div class="open-access">
            <h2>🔓 Currently open access</h2>
            <p>
              This page shows daily NIFTY 50 stocks with unusual trading volume, updated after market close.
            </p>
            <p>
              If you find this useful, support continued daily updates for ₹49 (early supporter price).
            </p>
            <p>
              👉 Support here: <a href="https://rzp.io/rzp/WF8Nxfql" target="_blank" rel="noopener noreferrer">
                https://rzp.io/rzp/WF8Nxfql
              </a>
            </p>
            <p>
              (Price may increase as features and coverage expand.)
            </p>
          </div>

          <div class="subtitle">
            Identifies NIFTY 50 stocks showing unusually high trading volume compared to their recent average.
          </div>

          <div class="meta">
            Universe: NIFTY 50 constituents • Updated daily after market close
          </div>

          <div class="meta">
            Generated on: ${time} IST
          </div>
        </div>

        <div class="card">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Symbol</th>
                <th>Volume Ratio</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>

        <div class="footer">
          This list highlights unusual trading activity based on volume.
          <br />
          For informational purposes only. Not investment advice.
        </div>
      </div>
    </body>
  </html>
  `;

  fs.writeFileSync("index.html", html);
}
