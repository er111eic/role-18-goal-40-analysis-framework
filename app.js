const stocks = [
  { code: "2330", name: "台積電", category: "core", score: "長線護體", note: "AI / HPC 先進製程實質成長；不追高，只做分批與回檔。", risk: "估值與地緣風險必須折價。" },
  { code: "2317", name: "鴻海", category: "core", score: "長線護體", note: "AI 伺服器與電動車題材可追蹤，但需看毛利率改善。", risk: "營收大不代表股東報酬一定高。" },
  { code: "2454", name: "聯發科", category: "growth", score: "波動成長", note: "手機、ASIC、邊緣 AI 需用產品週期驗證。", risk: "手機景氣反轉前不要過度樂觀。" },
  { code: "2308", name: "台達電", category: "core", score: "長線護體", note: "電源、散熱、資料中心能源效率是長線需求。", risk: "好公司若估值過滿，仍要等回檔。" },
  { code: "2382", name: "廣達", category: "growth", score: "波動成長", note: "AI 伺服器受惠明確，適合用法人籌碼與月線管理。", risk: "新聞熱度高，追價風險高。" },
  { code: "3231", name: "緯創", category: "growth", score: "波動成長", note: "AI 伺服器供應鏈，需看營收與毛利率同步。", risk: "波動大，不適合無停損長抱。" },
  { code: "2357", name: "華碩", category: "watch", score: "觀望", note: "PC 復甦需確認，不以 AI PC 口號直接買單。", risk: "題材可能先跑在獲利前面。" },
  { code: "2303", name: "聯電", category: "watch", score: "觀望", note: "成熟製程景氣復甦股，需看稼動率。", risk: "缺乏強成長時估值上限有限。" },
  { code: "2881", name: "富邦金", category: "core", score: "長線護體", note: "金融股看股息、資本適足率與壽險投資收益。", risk: "利率與匯率會直接干擾獲利。" },
  { code: "2882", name: "國泰金", category: "core", score: "長線護體", note: "壽險核心股，適合景氣循環與股息配置。", risk: "匯損與債券評價需定期檢查。" },
  { code: "2412", name: "中華電", category: "core", score: "長線護體", note: "防禦型現金流，適合降低組合波動。", risk: "成長性有限，不該用成長股估值買。" },
  { code: "3711", name: "日月光投控", category: "growth", score: "波動成長", note: "封測與先進封裝需求可追蹤。", risk: "半導體循環反轉時修正快。" },
  { code: "6669", name: "緯穎", category: "growth", score: "波動成長", note: "雲端與 AI 伺服器高 beta 標的。", risk: "股價昂貴時停損紀律更重要。" },
  { code: "3008", name: "大立光", category: "watch", score: "觀望", note: "光學規格升級需等手機週期確認。", risk: "長期成長敘事弱於過去。" },
  { code: "2891", name: "中信金", category: "core", score: "長線護體", note: "銀行獲利穩定，股息配置屬性較強。", risk: "上檔通常不如科技成長股。" },
  { code: "1301", name: "台塑", category: "watch", score: "觀望", note: "景氣循環股，需看石化利差修復。", risk: "不能只因股價低就買。" },
  { code: "1303", name: "南亞", category: "watch", score: "觀望", note: "電子材料與石化循環混合，需看利差。", risk: "產業逆風時配息也可能失色。" },
  { code: "2002", name: "中鋼", category: "watch", score: "觀望", note: "鋼鐵循環股，等需求與報價確認。", risk: "景氣未翻時低本益比是假便宜。" },
  { code: "1216", name: "統一", category: "core", score: "長線護體", note: "民生消費現金流，適合防禦配置。", risk: "成長有限，買點要保守。" },
  { code: "5871", name: "中租-KY", category: "watch", score: "觀望", note: "金融服務成長股，需看資產品質。", risk: "信用循環惡化時不能硬抱。" },
  { code: "2886", name: "兆豐金", category: "core", score: "長線護體", note: "公股金融代表，防禦與股息屬性強。", risk: "利率循環反轉會壓抑評價。" },
  { code: "2884", name: "玉山金", category: "core", score: "長線護體", note: "銀行體質穩健，適合長期股息配置觀察。", risk: "成長溢價過高時報酬率會下降。" },
  { code: "2892", name: "第一金", category: "core", score: "長線護體", note: "銀行獲利穩定，偏防禦型配置。", risk: "缺乏高成長，買貴會拖累總報酬。" },
  { code: "5880", name: "合庫金", category: "core", score: "長線護體", note: "公股金融，適合低波動資產配置。", risk: "資本效率與成長性需定期比較。" },
  { code: "2885", name: "元大金", category: "core", score: "長線護體", note: "券商與投信業務連動台股成交量。", risk: "大盤降溫時獲利彈性也會回落。" },
  { code: "3034", name: "聯詠", category: "watch", score: "觀望", note: "驅動 IC 需看消費電子與面板循環。", risk: "庫存循環未明朗前不宜追價。" },
  { code: "2379", name: "瑞昱", category: "watch", score: "觀望", note: "網通與 PC 相關晶片需看終端需求。", risk: "景氣回補不等於長線重估。" },
  { code: "2301", name: "光寶科", category: "growth", score: "波動成長", note: "電源與雲端產品線受惠資料中心。", risk: "題材升溫後必須看營收兌現。" },
  { code: "2327", name: "國巨", category: "watch", score: "觀望", note: "被動元件循環股，等庫存與報價翻正。", risk: "景氣循環股不能用永久成長估值。" },
  { code: "4938", name: "和碩", category: "watch", score: "觀望", note: "代工股需看產品組合與毛利率。", risk: "營收規模大但獲利彈性有限。" },
  { code: "2395", name: "研華", category: "core", score: "長線護體", note: "工業電腦長線需求穩定，適合景氣低檔觀察。", risk: "估值常有品質溢價，買點要耐心。" },
  { code: "1590", name: "亞德客-KY", category: "watch", score: "觀望", note: "自動化循環股，需看中國製造業需求。", risk: "景氣未起時不要過早押反轉。" },
  { code: "2912", name: "統一超", category: "core", score: "長線護體", note: "零售通路現金流穩定，偏防禦配置。", risk: "成長有限，估值過高會壓縮殖利率。" },
  { code: "2207", name: "和泰車", category: "core", score: "長線護體", note: "車市龍頭，品牌與通路優勢明確。", risk: "景氣與匯率會影響獲利。" },
  { code: "3045", name: "台灣大", category: "core", score: "長線護體", note: "電信現金流穩定，適合降低波動。", risk: "高殖利率不等於高成長。" },
  { code: "4904", name: "遠傳", category: "core", score: "長線護體", note: "電信防禦股，現金流可預測性高。", risk: "價格競爭與資本支出需追蹤。" },
  { code: "2603", name: "長榮", category: "watch", score: "觀望", note: "航運高度循環，必須看運價與供給。", risk: "股息回憶不能當作買進理由。" },
  { code: "2609", name: "陽明", category: "watch", score: "觀望", note: "航運波動高，適合事件型觀察不適合長抱。", risk: "運價反轉時股價修正速度很快。" },
  { code: "2615", name: "萬海", category: "watch", score: "觀望", note: "區域航線與運價循環需同步確認。", risk: "題材股化時散戶容易買在高點。" },
  { code: "5876", name: "上海商銀", category: "core", score: "長線護體", note: "銀行股偏穩定配置，需看資產品質。", risk: "成長性不高，買點必須保守。" }
];

const navButtons = document.querySelectorAll(".nav-button");
const panels = document.querySelectorAll(".panel");
const stockGrid = document.querySelector("#stockGrid");
const filter = document.querySelector("#filter");
const rawInput = document.querySelector("#rawInput");
const buildBtn = document.querySelector("#buildBtn");
const draft = document.querySelector("#draft");
const flowList = document.querySelector("#flowList");
const flowStatus = document.querySelector("#flowStatus");

const fallbackFlows = {
  asOf: "範例資料",
  source: "內建示範",
  rows: [
    {
      code: "2330",
      name: "台積電",
      totalNetBuyLots: 0,
      foreignNetBuyLots: 0,
      trustNetBuyLots: 0,
      dealerNetBuyLots: 0,
      signal: "等待官方資料更新",
      action: "只作為版面示範，不作為交易判斷"
    },
    {
      code: "2382",
      name: "廣達",
      totalNetBuyLots: 0,
      foreignNetBuyLots: 0,
      trustNetBuyLots: 0,
      dealerNetBuyLots: 0,
      signal: "等待官方資料更新",
      action: "匯入 T86 後再判斷是否連續買超"
    },
    {
      code: "2308",
      name: "台達電",
      totalNetBuyLots: 0,
      foreignNetBuyLots: 0,
      trustNetBuyLots: 0,
      dealerNetBuyLots: 0,
      signal: "等待官方資料更新",
      action: "未驗證資料一律不追價"
    }
  ]
};

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((item) => item.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.target}`).classList.add("active");
  });
});

function renderStocks(category = "all") {
  const visible = category === "all" ? stocks : stocks.filter((stock) => stock.category === category);

  stockGrid.innerHTML = visible
    .map((stock) => {
      const tone = stock.category === "watch" ? "watch" : stock.category === "growth" ? "risk" : "";
      return `
        <article class="stock-card">
          <span>${stock.code}</span>
          <strong>${stock.name}</strong>
          <p>${stock.note}</p>
          <p><strong>風險：</strong>${stock.risk}</p>
          <em class="score ${tone}">${stock.score}</em>
        </article>
      `;
    })
    .join("");
}

function formatLots(value) {
  return Number(value || 0).toLocaleString("zh-TW");
}

function renderFlows(payload) {
  const rows = (payload.rows || []).slice(0, 9);
  flowStatus.textContent = `${payload.asOf}｜${payload.source}`;
  flowList.innerHTML = rows
    .map((row) => `
      <article class="flow-card">
        <span>${row.code}</span>
        <strong>${row.name}</strong>
        <p>三大法人合計：${formatLots(row.totalNetBuyLots)} 張</p>
        <p class="flow-meta">外資 ${formatLots(row.foreignNetBuyLots)}｜投信 ${formatLots(row.trustNetBuyLots)}｜自營 ${formatLots(row.dealerNetBuyLots)}</p>
        <p><strong>訊號：</strong>${row.signal}</p>
        <p><strong>動作：</strong>${row.action}</p>
      </article>
    `)
    .join("");
}

async function loadFlows() {
  try {
    const response = await fetch("data/institutional-flows.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("missing data file");
    }
    renderFlows(await response.json());
  } catch {
    renderFlows(fallbackFlows);
  }
}

filter.addEventListener("change", (event) => {
  renderStocks(event.target.value);
});

buildBtn.addEventListener("click", () => {
  const input = rawInput.value.trim();
  const subject = input.match(/[0-9]{4}\s*[\u4e00-\u9fa5A-Za-z-]+/)?.[0] || "待分析標的";

  draft.classList.add("active");
  draft.innerHTML = `
    <h3>${subject}｜四框架草稿</h3>
    <p><strong>1. 產業趨勢：</strong>請先確認這段資料是否包含營收、毛利率、訂單、產能或客戶指引。沒有硬數據的題材，先視為低可信。</p>
    <p><strong>2. 籌碼檢查：</strong>若只有單日買超，不足以進場；至少要看 3-5 日連續性、量價是否失控、是否已被媒體過度報導。</p>
    <p><strong>3. 散戶策略：</strong>核心權值股偏長線護體；高波動供應鏈股只做回檔月線與明確停損。</p>
    <p><strong>4. 操作紀律：</strong>買點等回測，營收確認才加碼；波段股跌破月線或進場價 -8% 至 -10% 退出。</p>
    <p><strong>原始資料：</strong>${input || "尚未貼入資料。"}</p>
  `;
});

renderStocks();
loadFlows();
