import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outputPath = resolve(root, "data", "market-history.json");

const symbols = [
  { code: "2330", name: "台積電", yahoo: "2330.TW", tradingView: "TWSE:2330" },
  { code: "2317", name: "鴻海", yahoo: "2317.TW", tradingView: "TWSE:2317" },
  { code: "2454", name: "聯發科", yahoo: "2454.TW", tradingView: "TWSE:2454" },
  { code: "2308", name: "台達電", yahoo: "2308.TW", tradingView: "TWSE:2308" },
  { code: "2382", name: "廣達", yahoo: "2382.TW", tradingView: "TWSE:2382" },
  { code: "3231", name: "緯創", yahoo: "3231.TW", tradingView: "TWSE:3231" },
  { code: "TAIEX", name: "加權指數", yahoo: "^TWII", tradingView: "TWSE:TAIEX" },
  { code: "IXIC", name: "NASDAQ", yahoo: "^IXIC", tradingView: "NASDAQ:IXIC" },
  { code: "SOX", name: "費半", yahoo: "^SOX", tradingView: "NASDAQ:SOX" },
  { code: "DXY", name: "美元指數", yahoo: "DX-Y.NYB", tradingView: "TVC:DXY" },
  { code: "US10Y", name: "美債 10 年", yahoo: "^TNX", tradingView: "TVC:US10Y" }
];

function compactPoints(result) {
  const timestamps = result.timestamp || [];
  const quote = result.indicators?.quote?.[0] || {};
  const closes = quote.close || [];
  const volumes = quote.volume || [];

  return timestamps
    .map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().slice(0, 10),
      close: closes[index],
      volume: volumes[index] || 0
    }))
    .filter((point) => Number.isFinite(point.close));
}

async function fetchSymbol(item) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.yahoo)}?range=6mo&interval=1d`;
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 research-dashboard" }
  });

  if (!response.ok) {
    throw new Error(`${item.code} request failed: ${response.status}`);
  }

  const payload = await response.json();
  const result = payload.chart?.result?.[0];
  if (!result) {
    throw new Error(`${item.code} returned no chart data`);
  }

  const points = compactPoints(result);
  const latest = points.at(-1);
  const previous = points.at(-2);
  const change = latest && previous ? latest.close - previous.close : 0;
  const changePercent = latest && previous ? (change / previous.close) * 100 : 0;

  return {
    code: item.code,
    name: item.name,
    yahoo: item.yahoo,
    tradingView: item.tradingView,
    currency: result.meta?.currency || "",
    exchangeName: result.meta?.exchangeName || "",
    regularMarketTime: result.meta?.regularMarketTime
      ? new Date(result.meta.regularMarketTime * 1000).toISOString()
      : null,
    latestClose: latest?.close || null,
    latestDate: latest?.date || null,
    change,
    changePercent,
    points
  };
}

async function main() {
  const rows = [];

  for (const item of symbols) {
    try {
      rows.push(await fetchSymbol(item));
    } catch (error) {
      console.warn(error.message);
    }
  }

  if (!rows.length) {
    throw new Error("No market history rows updated");
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify({
      asOf: new Date().toISOString(),
      source: "Yahoo Finance chart API",
      rows
    }, null, 2)}\n`
  );

  console.log(`Updated ${outputPath}`);
  console.log(`Rows: ${rows.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
