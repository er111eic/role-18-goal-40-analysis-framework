import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outputPath = resolve(root, "data", "institutional-flows.json");

const dateArg = process.argv[2];
const maxLookbackDays = dateArg ? 0 : 10;

const numeric = (value) => Number(String(value || "0").replaceAll(",", "")) || 0;
const lots = (shares) => Math.round(shares / 1000);
const isCommonStockCode = (code) => /^[1-9][0-9]{3}$/.test(String(code || "").trim());

function formatTaipeiDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}${values.month}${values.day}`;
}

function shiftDate(dateText, days) {
  const year = Number(dateText.slice(0, 4));
  const month = Number(dateText.slice(4, 6));
  const day = Number(dateText.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function endpointFor(dateText) {
  return `https://www.twse.com.tw/rwd/zh/fund/T86?date=${dateText}&selectType=ALLBUT0999&response=json`;
}

function columnIndex(fields, candidates) {
  return candidates
    .map((candidate) => fields.findIndex((field) => field.includes(candidate)))
    .find((index) => index >= 0);
}

function classify(row) {
  if (row.totalNetBuyLots <= 0) return "法人合計賣超，排除追價";
  if (row.foreignNetBuyLots > 0 && row.trustNetBuyLots > 0) return "外資與投信同步買超，列入優先觀察";
  if (row.trustNetBuyLots > 0) return "投信買超，偏波段籌碼";
  if (row.foreignNetBuyLots > 0) return "外資買超，需追蹤連續性";
  return "自營或零散買超，訊號較弱";
}

function action(row) {
  if (row.totalNetBuyLots <= 0) return "不買，等三日以上轉強";
  if (row.totalNetBuyLots >= 10000) return "可能已受市場注意，只等回檔不追高";
  if (row.trustNetBuyLots > 0 && row.foreignNetBuyLots > 0) return "列入觀察，回測月線不破才分批";
  return "僅觀察，不用單日買超進場";
}

async function fetchRows(dateText) {
  const endpoint = endpointFor(dateText);
  const response = await fetch(endpoint, {
    headers: {
      "user-agent": "Mozilla/5.0 research-dashboard"
    }
  });

  if (!response.ok) {
    throw new Error(`TWSE request failed: ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload.data) || !Array.isArray(payload.fields)) {
    throw new Error(payload.stat || "TWSE returned no tabular data");
  }

  const fields = payload.fields;
  const codeIdx = columnIndex(fields, ["證券代號"]);
  const nameIdx = columnIndex(fields, ["證券名稱"]);
  const foreignIdx = columnIndex(fields, ["外陸資買賣超股數"]);
  const trustIdx = columnIndex(fields, ["投信買賣超股數"]);
  const dealerIdx = columnIndex(fields, ["自營商買賣超股數"]);
  const totalIdx = columnIndex(fields, ["三大法人買賣超股數"]);

  const rows = payload.data
    .map((item) => {
      const row = {
        code: String(item[codeIdx] || "").trim(),
        name: String(item[nameIdx] || "").trim(),
        totalNetBuyLots: lots(numeric(item[totalIdx])),
        foreignNetBuyLots: lots(numeric(item[foreignIdx])),
        trustNetBuyLots: lots(numeric(item[trustIdx])),
        dealerNetBuyLots: lots(numeric(item[dealerIdx]))
      };
      row.signal = classify(row);
      row.action = action(row);
      return row;
    })
    .filter((row) => isCommonStockCode(row.code))
    .filter((row) => row.totalNetBuyLots > 0)
    .sort((a, b) => b.totalNetBuyLots - a.totalNetBuyLots)
    .slice(0, 30);

  if (!rows.length) {
    throw new Error("TWSE returned no common-stock net-buy rows");
  }

  return { dateText, endpoint, rows };
}

async function main() {
  const baseDate = dateArg || formatTaipeiDate();
  let result;
  let lastError;

  for (let daysBack = 0; daysBack <= maxLookbackDays; daysBack += 1) {
    const dateText = shiftDate(baseDate, -daysBack);
    try {
      result = await fetchRows(dateText);
      break;
    } catch (error) {
      lastError = error;
      console.warn(`Skipped ${dateText}: ${error.message}`);
    }
  }

  if (!result) {
    throw lastError || new Error("Unable to load TWSE T86 data");
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify({
      asOf: result.dateText,
      source: "TWSE T86 三大法人買賣超日報",
      endpoint: result.endpoint,
      rows: result.rows
    }, null, 2)}\n`
  );

  console.log(`Updated ${outputPath}`);
  console.log(`Date: ${result.dateText}`);
  console.log(`Rows: ${result.rows.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
