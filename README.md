# 島嶼天氣

整合中央氣象署開放資料的響應式氣象 Dashboard，包含：

- 自動雨量站近 24 小時雨量
- 紫外線觀測與分級
- 臺灣 22 縣市今明 36 小時預報
- API 無法連線時顯示明確錯誤狀態，不使用示範資料

## 啟動方式

1. 複製 `js/config.example.js` 為 `js/config.js`。
2. 在 `js/config.js` 填入中央氣象署 API 授權碼。
3. 使用本機 HTTP Server 開啟，請勿直接雙擊 `index.html`：

```bash
python3 -m http.server 8000
```

接著開啟 `http://localhost:8000`。

> 正式網站已使用 Vercel Serverless Function 作為後端 API 代理。API 金鑰安全保存在 Vercel 環境變數中，不會出現在前端程式碼或瀏覽器；更新 GitHub `main` 分支後，Vercel 會自動重新部署。

## Vercel 部署

專案包含 `api/weather.js` Serverless Function。請在 Vercel 專案的 Environment Variables 新增：

```text
CWA_API_KEY=你的中央氣象署 API 授權碼
```

部署後，前端會透過 `/api/weather` 取得即時資料，API 授權碼只存在 Vercel 後端環境。
