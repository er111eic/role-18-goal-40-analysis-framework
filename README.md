# 散戶翻身系統｜法人級研究台

這是靜態研究網站，核心用途是把標的放進四個框架檢查：

- 產業趨勢與長線保護
- 籌碼動向與過熱度檢查
- 散戶優勢策略匹配
- 買賣紀律說明書

## 開啟網站

直接打開 `index.html` 可以看內建內容。

若要讓網站讀取 `data/institutional-flows.json`，建議在此資料夾執行：

```bash
python3 -m http.server 8080
```

然後用瀏覽器開：

```text
http://localhost:8080
```

## 更新三大法人資料

使用台灣證券交易所 T86 三大法人買賣超日報：

```bash
node scripts/update_twse_t86.mjs 20260526
```

日期格式為 `YYYYMMDD`。若不帶日期，腳本會以台北時間今天為基準，最多往前找 10 天內最近一個有資料的交易日。腳本會更新：

```text
data/institutional-flows.json
```

GitHub Actions 已設定每週一至週五台北時間 18:30 自動更新一次，也可在 GitHub 的 Actions 頁面手動執行 `Update institutional flows`。

## 紀律提醒

單日買超不是買點。網站只把資料轉成觀察清單，真正進場仍要看：

- 是否連續 3-5 日買超
- 是否已經新聞過熱
- 是否回測均線不破
- 是否有營收或法說會數據支撐
