# 第三組「島嶼天氣」專案建置與協作 SOP

本文件記錄「島嶼天氣」從需求整理、前端開發、中央氣象署資料串接、API 金鑰保護、Vercel 部署，到三人使用 Fork、develop 與 Pull Request 協作的完整做法。

- 正式網站：[https://team3-taiwan-weather-dashboard.vercel.app](https://team3-taiwan-weather-dashboard.vercel.app)
- GitHub Repository：[https://github.com/jessicaKY/team3-taiwan-weather-dashboard](https://github.com/jessicaKY/team3-taiwan-weather-dashboard)
- 中央氣象署開放資料：[https://opendata.cwa.gov.tw/](https://opendata.cwa.gov.tw/)

> 安全提醒：不要把中央氣象署 API 金鑰寫進本文件、前端程式、Git Commit、Pull Request 或聊天室。若金鑰曾公開，應立即到中央氣象署平臺更換。

---

## 一、整體流程步驟

1. 確認網站目標、頁面區塊與組員分工。
2. 規劃四個主要區塊：導覽列、雨量觀測、紫外線觀測、36 小時天氣預報與頁尾。
3. 建立分開存放的 HTML、CSS、JavaScript 與後端 API 檔案。
4. 從中央氣象署選擇需要的四個資料集。
5. 先完成前端版面與響應式設計，再串接真實資料。
6. 將不同資料格式整理成畫面需要的統一格式。
7. 雨量資料依近 24 小時累積雨量排序，顯示最高六站。
8. 紫外線資料搭配測站資料，顯示測站名稱與正確縣市，再顯示今日最大值最高六站。
9. 顯示臺灣 22 縣市今明 36 小時天氣預報。
10. 移除所有示範資料；API 失敗時顯示錯誤訊息與重新整理按鈕。
11. 在本機啟動 HTTP Server，檢查桌機版、手機版、資料與錯誤狀態。
12. 將專案上傳到 GitHub，建立 Host 的 `develop` 分支。
13. 在 Vercel 建立專案，將 API 金鑰放入 Environment Variables。
14. 透過 Vercel Serverless Function 向中央氣象署取資料，避免前端看見金鑰。
15. 組員 Fork 專案，在各自的 `develop` 分支開發。
16. 組員提交 Pull Request 到 Host 的 `develop` 分支。
17. Host 檢查並整合所有修改，在 `develop` 完成測試。
18. Host 將 `develop` 合併到 `main`，由 Vercel 自動部署正式網站。

### 整體資料流程

```text
使用者瀏覽器
    ↓ 請求 /api/weather
Vercel Serverless Function（api/weather.js）
    ↓ 從環境變數讀取 CWA_API_KEY
中央氣象署開放資料 API
    ↓ 回傳真實 JSON 資料
Vercel Serverless Function
    ↓ 將資料安全地回傳前端
js/app.js 整理、排序、配對資料
    ↓
雨量六站／紫外線六站／22 縣市預報畫面
```

### GitHub 協作與部署流程

```text
Host main（正式穩定版本）
    ↓ 建立 develop
Host develop（整合與測試版本）
    ↓ 組員 Fork
組員自己的 develop 分支
    ↓ 開發、Commit、Push
Pull Request：組員 develop → Host develop
    ↓ Host 檢查與 Merge
Host develop 完成整合測試
    ↓ Pull Request／Merge
Host develop → Host main
    ↓
Vercel 自動部署正式網站
```

---

## 二、簡化的解題順序總覽

遇到類似專案時，可以按照以下中文順序處理：

1. **先定義問題**：網站要讓使用者看到哪些氣象資訊？
2. **再拆分畫面**：每一種資料各自放在哪個區塊？
3. **確認資料來源**：需要哪些中央氣象署資料集？
4. **觀察資料格式**：欄位名稱、時間、數值與測站資訊是否完整？
5. **補足資料關係**：單一 API 資訊不足時，用共同欄位交叉配對。
6. **整理顯示邏輯**：過濾無效值、排序、取前六名或整理 22 縣市。
7. **處理失敗狀態**：沒有資料時顯示錯誤，不用假資料代替。
8. **保護敏感資料**：把 API 金鑰放在後端環境變數。
9. **本機測試**：檢查資料正確性、RWD、搜尋與重新整理功能。
10. **分支協作**：先進 develop 測試，確認後才合併 main。
11. **自動部署**：main 更新後交給 Vercel 發布正式版本。
12. **最後驗收**：正式網址、GitHub、README 與簡報內容保持一致。

簡化成一句話就是：

```text
需求 → 畫面 → 資料集 → 資料整理 → 錯誤處理 → 金鑰保護 → 本機測試 → develop 協作 → main 部署 → 正式驗收
```

---

## 三、專案目標與功能規劃

### 3.1 網站目標

將中央氣象署較複雜的開放資料整理成容易閱讀的氣象 Dashboard，讓使用者可以快速掌握：

- 全臺近 24 小時累積雨量最高的六個測站
- 全臺今日紫外線指數最大值最高的六個測站
- 臺灣 22 縣市今明 36 小時天氣概況
- API 是否正常，以及資料無法取得時的處理方式

### 3.2 頁面結構

由上到下分成：

1. 導覽列與首頁主視覺
2. 雨量觀測
3. 紫外線觀測
4. 所有縣市最新氣象預測
5. 頁尾與相關連結

### 3.3 組員分工

#### 林冠儀（組長）

- 收集氣象網頁版面參考資料
- 網站架構與功能規劃
- 雨量觀測前端畫面與 RWD
- GitHub 整合、Vercel 部署與簡報製作

#### 陳柏宏

- 收集氣象網頁參考資料
- 網站架構與功能規劃
- 所有縣市最新 36 小時氣象預測畫面
- 報告

#### 黃劭傑

- 收集氣象網頁參考資料
- 網站架構與功能規劃
- 紫外線觀測前端畫面
- 報告

---

## 四、專案檔案結構

```text
team3-taiwan-weather-dashboard/
├── index.html                 # 網頁結構與文字
├── css/
│   └── style.css              # 桌機版、手機版與元件樣式
├── js/
│   ├── app.js                 # API 請求、資料整理與畫面渲染
│   └── config.example.js      # 本機設定範例，不含真正金鑰
├── api/
│   └── weather.js             # Vercel 後端 API 代理
├── README.md                  # 專案簡介與協作說明
└── .gitignore                 # 排除 js/config.js 等敏感檔案
```

檔案分開的目的：

- HTML 專心處理內容結構。
- CSS 專心處理視覺與 RWD。
- `app.js` 專心處理前端功能與資料顯示。
- `api/weather.js` 專心處理金鑰與中央氣象署請求。
- 組員修改不同功能時，比較容易找到檔案並減少衝突。

---

## 五、選擇中央氣象署資料集

本專案使用中央氣象署「即時／開放資料 API」：

[https://opendata.cwa.gov.tw/dist/opendata-swagger.html#/](https://opendata.cwa.gov.tw/dist/opendata-swagger.html#/)

使用的資料集如下：

| 資料集編號 | 用途 | 畫面顯示 |
| --- | --- | --- |
| `O-A0002-001` | 自動雨量站雨量觀測 | 近 24 小時累積雨量最高六站 |
| `O-A0005-001` | 紫外線指數觀測 | 今日紫外線最大值最高六站 |
| `O-A0001-001` | 氣象測站資訊 | 紫外線 StationID 對應測站名稱與縣市 |
| `F-C0032-001` | 一般天氣預報 | 臺灣 22 縣市今明 36 小時預報 |

### 為什麼紫外線需要兩個資料集？

`O-A0005-001` 提供紫外線指數與 `StationID`，但顯示地區時不能只寫「臺灣」。因此再取得 `O-A0001-001`，用共同的 `StationID` 建立對照：

```text
O-A0005-001.StationID
        ↓ 配對
O-A0001-001.StationID
        ↓ 取得
StationName + CountyName
```

最後才能顯示成：

```text
東吉島　澎湖縣
嘉義　　嘉義市
恆春　　屏東縣
```

這個方法稱為「用共同編號交叉配對資料」。

---

## 六、申請與保護 API 金鑰

### 6.1 取得 API 金鑰

1. 開啟中央氣象署開放資料平臺。
2. 註冊並登入帳號。
3. 進入會員或授權碼頁面。
4. 複製自己的 API 授權碼。
5. 不要把真正的授權碼貼到 GitHub 或任何公開文件。

### 6.2 本機開發設定

1. 複製設定範例：

```bash
cp js/config.example.js js/config.js
```

2. 打開 `js/config.js`，填入自己的 API 金鑰。
3. 確認 `.gitignore` 包含：

```gitignore
js/config.js
```

4. 提交前執行：

```bash
git status
```

5. 確認清單中沒有 `js/config.js`，也沒有任何包含真正金鑰的檔案。

### 6.3 正式網站設定

正式環境不要讓瀏覽器直接帶著金鑰呼叫中央氣象署。正確方式是：

```text
公開網頁 → Vercel 後端代理 → 中央氣象署 API
                         ↑
                   金鑰只存在 Vercel
```

---

## 七、建立前端畫面

### 7.1 建立 HTML 區塊

在 `index.html` 建立：

- 導覽列與首頁標題
- 雨量觀測容器
- 紫外線觀測容器
- 縣市搜尋與預報容器
- 錯誤訊息和重新整理按鈕需要放置的位置
- 頁尾連結

不要把每張卡片的固定假資料寫死在 HTML；真實卡片應由 JavaScript 根據 API 回傳結果建立。

### 7.2 建立 CSS 與 RWD

在 `css/style.css` 統一設定：

- 深色 Dashboard 主題
- 標題、說明文字與區塊間距
- 卡片網格與卡片圓角
- 雨量、紫外線分級顏色
- 頁尾按鈕與 Hover 樣式
- 桌機、平板與手機版斷點

手機版要特別檢查：

- 卡片是否改成單欄或適合的欄數
- 文字是否超出卡片
- 頁尾三個連結是否靠左對齊
- 按鈕是否容易點擊
- 測站名稱與縣市之間是否有清楚間距

---

## 八、撰寫前端資料邏輯

### 8.1 集中管理 API 端點

在 `js/app.js` 中集中記錄資料集，避免網址散落在不同函式：

```javascript
const endpoints = {
  rainfall: "O-A0002-001",
  uv: "O-A0005-001",
  stations: "O-A0001-001",
  forecast: "F-C0032-001",
};
```

### 8.2 同時取得資料

可使用 `Promise.allSettled()` 同時請求不同資料。這樣其中一組失敗時，其他成功的區塊仍可顯示，不會整頁一起失效。

基本思路：

```text
同時請求四組資料
    ↓
逐組判斷成功或失敗
    ↓
成功：整理並渲染真實資料
失敗：該區塊顯示錯誤與重新整理按鈕
```

### 8.3 雨量資料處理

1. 取得 `O-A0002-001`。
2. 找出每個測站的近 24 小時累積雨量欄位。
3. 將無效值、空值或特殊代碼排除。
4. 將雨量轉成數字。
5. 由大到小排序。
6. 取前六個測站。
7. 顯示測站、縣市與累積雨量。

畫面說明文字：

> 顯示全臺近 24 小時累積雨量最高的六個測站，資料約每 10 分鐘更新

### 8.4 紫外線資料處理

1. 同時取得 `O-A0005-001` 與 `O-A0001-001`。
2. 先將測站資料整理成 `StationID` 對照表。
3. 逐筆讀取紫外線資料的 `StationID`。
4. 用相同 `StationID` 找到測站名稱和縣市。
5. 將紫外線值轉成數字並排除無效值。
6. 依今日最大紫外線指數由大到小排序。
7. 取前六個測站。
8. 顯示測站名稱、縣市、指數與分級。

畫面說明文字：

> 顯示全臺今日紫外線指數最大值最高的六個測站，外出前別忘了做好防曬

### 8.5 36 小時天氣預報處理

1. 取得 `F-C0032-001`。
2. 整理 22 縣市名稱。
3. 取出天氣現象、最低溫、最高溫與降雨機率。
4. 將時間區段整理成方便翻頁或切換的資料結構。
5. 搜尋時先統一「台／臺」等文字差異。
6. 找到縣市後更新畫面；找不到時顯示清楚提示。

若加入翻頁功能，建議將功能拆開：

```text
fetchForecast()        負責取得資料
normalizeForecast()    負責整理資料
renderForecastPage()   負責顯示指定時間頁
bindForecastControls() 負責上一頁／下一頁按鈕
```

不要把請求、整理、搜尋、翻頁和畫面產生全部塞進同一個很長的函式。

---

## 九、移除假資料並處理 API 失敗

### 9.1 為什麼不能保留示範資料？

如果 API 失敗後自動顯示預先寫好的數字，使用者可能會誤以為那是即時資料。氣象資訊具有時間性，因此錯誤訊息比假資料更誠實。

### 9.2 正確處理方式

- API 正常時才顯示該組氣象資料。
- 雨量失敗，只讓雨量區塊顯示錯誤。
- 紫外線或測站資料失敗，只讓紫外線區塊顯示錯誤。
- 預報失敗，只讓預報區塊顯示錯誤。
- 錯誤區塊顯示「資料暫時無法取得」。
- 提供「重新整理資料」按鈕。
- 導覽列可顯示目前有幾組資料無法取得。
- 不用假資料冒充即時資料。

### 9.3 驗收方式

測試時可暫時將某個資料集編號改錯，確認：

1. 該區塊顯示錯誤。
2. 其他資料區塊仍能顯示。
3. 畫面沒有出現預設假數字。
4. 重新整理按鈕可以再次發出請求。

測試完成後，要把正確資料集編號改回來。

---

## 十、建立 Vercel Serverless Function

### 10.1 後端代理的責任

`api/weather.js` 應負責：

1. 接收前端指定的資料集編號。
2. 只允許專案需要的資料集，避免變成任意代理服務。
3. 從 `process.env.CWA_API_KEY` 讀取金鑰。
4. 在後端向中央氣象署發送請求。
5. 將成功資料或適當錯誤狀態回傳前端。
6. 不將 API 金鑰回傳給瀏覽器。

允許清單應包括：

```text
O-A0002-001
O-A0005-001
O-A0001-001
F-C0032-001
```

### 10.2 前端請求方式

正式網站的前端呼叫自己的後端：

```text
/api/weather?dataset=O-A0002-001
```

而不是把中央氣象署金鑰直接放進瀏覽器請求。

---

## 十一、不使用 VS Code 的本機啟動方式

### 11.1 使用 macOS「終端機」

1. 打開 macOS 的「終端機」。
2. 進入專案資料夾：

```bash
cd /Users/jessicalin/WeHelp/week16
```

3. 啟動本機伺服器：

```bash
python3 -m http.server 8000
```

4. 看到以下訊息代表成功：

```text
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

5. 用瀏覽器開啟：

[http://localhost:8000](http://localhost:8000)

6. 修改程式後，在瀏覽器重新整理。
7. 要停止伺服器時，回到終端機按 `Control + C`。

### 11.2 為什麼網址重新整理後仍有 `#forecast`？

`#forecast` 是頁面內的錨點，代表瀏覽器目前定位在預報區塊。重新整理不會自動移除它。

回到首頁可使用：

```text
https://team3-taiwan-weather-dashboard.vercel.app/
```

這不是錯誤，也不會多開一個網頁。

---

## 十二、建立 GitHub Repository

### 12.1 建立主專案

1. 登入 GitHub。
2. 建立新 Repository。
3. 名稱輸入：`team3-taiwan-weather-dashboard`。
4. 設為 Public，方便組員 Fork。
5. 將本機檔案加入 Git。
6. 提交並 Push 到 `main`。

常用指令如下：

```bash
git init
git add .
git commit -m "建立島嶼天氣專案"
git branch -M main
git remote add origin https://github.com/jessicaKY/team3-taiwan-weather-dashboard.git
git push -u origin main
```

執行 `git add .` 前，務必先確認 `.gitignore` 已排除金鑰檔案。

### 12.2 建立 Host develop 分支

在 Host Repository 建立整合用分支：

```bash
git switch main
git pull origin main
git switch -c develop
git push -u origin develop
```

建立後，GitHub 會同時有：

- `main`：正式穩定版，Vercel 從此分支部署。
- `develop`：組員 PR 的目標與整合測試分支。

不需要重新建立 Repository，也不需要產生新的 Fork 連結。組員仍然 Fork 同一個 Repository。

---

## 十三、組員 Fork 與 develop 分支操作

### 13.1 組員第一次 Fork

每位組員依序操作：

1. 開啟 Host Repository。
2. 按右上角 **Fork**。
3. 建立在自己的 GitHub 帳號下。
4. 將自己的 Fork Clone 到電腦：

```bash
git clone https://github.com/組員帳號/team3-taiwan-weather-dashboard.git
cd team3-taiwan-weather-dashboard
```

5. 加入 Host Repository 作為 `upstream`：

```bash
git remote add upstream https://github.com/jessicaKY/team3-taiwan-weather-dashboard.git
git remote -v
```

6. 取得 Host 最新分支：

```bash
git fetch upstream
```

7. 建立自己的 `develop`：

```bash
git switch -c develop upstream/develop
git push -u origin develop
```

### 13.2 每次開始工作前先同步

```bash
git switch develop
git fetch upstream
git merge upstream/develop
git push origin develop
```

這樣可以降低和其他組員程式發生衝突的機率。

### 13.3 修改、Commit 與 Push

```bash
git status
git add 修改的檔案
git commit -m "新增預報翻頁功能"
git push origin develop
```

Commit 訊息要簡單說明完成了什麼，不要只寫 `update`。

---

## 十四、建立正確的 Pull Request

### 14.1 組員提交 PR

在 GitHub 建立 Pull Request 時，最重要的是確認方向：

```text
base repository：jessicaKY/team3-taiwan-weather-dashboard
base branch：develop

head repository：組員自己的 Fork
compare branch：develop
```

也就是：

```text
組員 develop → Host develop
```

不是直接送到 Host `main`。

### 14.2 PR 內容建議

PR 標題範例：

```text
新增 36 小時預報翻頁功能
```

PR 說明至少包含：

- 修改了什麼功能
- 修改了哪些檔案
- 如何測試
- 桌機版與手機版是否正常
- 是否有已知問題

### 14.3 Fork 數字代表什麼？

GitHub 顯示 `Fork 2`，代表目前有兩份由此 Repository 建立的公開 Fork。通常可以理解為有兩個帳號建立了副本，但不代表他們現在正在使用，也不代表已經送出 PR。

Fork 和 PR 是兩件事：

- Fork：建立自己的專案副本。
- PR：請求把自己副本中的修改合併回 Host Repository。

完成協作時，組員通常需要在 Fork 修改後再提交 PR。

---

## 十五、Host 檢查與合併流程

### 15.1 檢查組員 PR

Host 收到 PR 後：

1. 確認目標是 Host `develop`，不是 `main`。
2. 查看 **Files changed**。
3. 確認沒有 API 金鑰、`js/config.js` 或其他敏感資料。
4. 檢查是否誤刪其他組員功能。
5. 檢查命名、排版與程式結構。
6. 在桌機版與手機版測試。
7. 測試正常後才按 Merge。
8. 若有問題，在 PR 留言請組員修改；組員再次 Push 後，同一個 PR 會自動更新。

不一定要指定 Reviewer 才能讓老師或組長檢查。將 PR 網址傳給對方即可，例如：

```text
老師您好，這是我們的 Pull Request，麻煩您協助查看：PR 網址
```

### 15.2 develop 整合測試

所有組員 PR 合併到 Host `develop` 後：

```bash
git switch develop
git pull origin develop
```

接著完整測試：

- 雨量是否顯示六站且依近 24 小時雨量排序
- 紫外線是否顯示六站、正確測站與縣市
- 22 縣市是否都能搜尋與顯示
- 翻頁或時間切換是否正確
- API 失敗時是否沒有假資料
- 重新整理按鈕是否可用
- 手機版版面是否正常
- 瀏覽器 Console 是否有錯誤

### 15.3 develop 合併到 main

整合測試完成後，在 GitHub 建立最後一個 PR：

```text
Host develop → Host main
```

確認無誤後 Merge。只有這一步完成後，`main` 才會得到所有通過測試的修改。

---

## 十六、部署到 Vercel

### 16.1 第一次部署

1. 登入 Vercel。
2. 使用 GitHub 帳號連線。
3. 選擇 `team3-taiwan-weather-dashboard`。
4. 匯入專案。
5. Framework Preset 可依專案自動判斷或選擇一般靜態專案。
6. 在 Environment Variables 新增：

```text
Name：CWA_API_KEY
Value：你的中央氣象署 API 金鑰
```

7. 將變數套用到 Production；需要預覽測試時也可套用到 Preview。
8. 按下 Deploy。

Vercel 介面中的 Sensitive 選項是用來隱藏環境變數值；即使介面名稱或位置更新，核心原則仍是把金鑰放在 Environment Variables，不放進 GitHub。

### 16.2 自動部署

Vercel 連接 GitHub 後：

```text
Host develop 更新 → 用於整合與測試，不應直接改變正式網站
Host main 更新    → Vercel 自動重新部署正式網站
```

若 Vercel 專案的 Production Branch 被改過，請到 Vercel 專案設定確認 Production Branch 是 `main`。

### 16.3 環境變數更新後

新增或修改環境變數後，需要重新部署，讓新的部署讀到最新設定。可在 Vercel 的 Deployments 頁面重新部署，或在確認程式有修改時 Push 到 `main` 觸發新部署。

---

## 十七、正式網站驗收清單

### 17.1 資料驗收

- [ ] 雨量顯示六個測站
- [ ] 雨量使用近 24 小時累積值
- [ ] 紫外線顯示六個測站
- [ ] 紫外線使用今日最大值
- [ ] 紫外線測站名稱與縣市正確
- [ ] 預報包含完整 22 縣市
- [ ] 搜尋「台南」與「臺南」都能正確處理
- [ ] API 正常時顯示真實資料
- [ ] API 失敗時不顯示假資料

### 17.2 介面驗收

- [ ] 桌機版文字、間距與卡片排列正常
- [ ] 手機版不超出畫面
- [ ] 測站名稱和縣市之間有足夠距離
- [ ] 頁尾連結在手機版靠左
- [ ] 頁尾按鈕有間距、圓角與 Hover 效果
- [ ] 頁面內錨點可以正確前往各區塊

### 17.3 安全驗收

- [ ] GitHub 搜尋不到真正 API 金鑰
- [ ] `js/config.js` 沒有被提交
- [ ] Vercel 已設定 `CWA_API_KEY`
- [ ] 前端只呼叫 `/api/weather`
- [ ] 瀏覽器開發者工具看不到 API 金鑰

### 17.4 協作驗收

- [ ] Host 有 `main` 與 `develop`
- [ ] 組員 PR 目標為 Host `develop`
- [ ] `develop` 測試完成後才合併 `main`
- [ ] Vercel Production Branch 是 `main`
- [ ] README、簡報與實際流程一致

---

## 十八、常見問題與解法

### 問題 1：為什麼網頁顯示假資料？

原因通常是程式在 API 失敗時使用示範陣列。解法是移除所有 fallback 假資料，失敗時直接顯示「資料暫時無法取得」。

### 問題 2：為什麼紫外線地區只顯示「臺灣」？

因為紫外線資料本身沒有完整顯示名稱。用 `StationID` 將 `O-A0005-001` 與 `O-A0001-001` 配對，即可取得測站名稱和縣市。

### 問題 3：為什麼台南搜尋不到？

資料可能使用「臺南市」，使用者可能輸入「台南」。搜尋前應統一「台」和「臺」，也要決定是否自動補上「市／縣」。

### 問題 4：為什麼修改直接進 main？

建立 PR 時，GitHub 常預設把目標分支設為 Repository 的預設分支，通常是 `main`。送出前要手動把 **base branch** 改成 Host 的 `develop`。

### 問題 5：建立 develop 後需要讓組員重新 Fork 嗎？

不用。仍使用同一個 Repository 與 Fork。組員只要 `fetch upstream`，再從 `upstream/develop` 建立自己的 `develop` 即可。

### 問題 6：老師檢查 PR 一定要設成 Reviewer 嗎？

不用。只要將 PR 網址傳給老師，老師就能查看 Conversation、Commits 與 Files changed。若作業要求正式 Review，再使用 GitHub 的 Reviewer 功能。

### 問題 7：為什麼 Vercel 沒有更新？

依序檢查：

1. 修改是否已經 Merge 到 Host `main`。
2. Vercel Production Branch 是否為 `main`。
3. 最新 Deployment 是否成功。
4. Build Logs 是否有錯誤。
5. 瀏覽器是否仍使用快取，可嘗試強制重新整理。

### 問題 8：API 金鑰更新後是否要重新上傳 GitHub？

不用把金鑰上傳 GitHub。只要在 Vercel 更新 Environment Variable，再重新部署即可。只有程式碼有修改時才需要 Commit 與 Push。

### 問題 9：app.js 越來越大怎麼辦？

先依責任拆成小函式；功能再增加時，可進一步拆成多個模組，例如：

```text
js/api.js          API 請求
js/rainfall.js     雨量整理與渲染
js/uv.js           紫外線整理與渲染
js/forecast.js     預報搜尋、翻頁與渲染
js/ui.js           共用錯誤、按鈕與狀態
js/app.js          初始化與整合
```

拆檔前先和組員約定命名與載入方式，避免多人同時大幅搬動程式造成衝突。

---

## 十九、建議的每日協作 SOP

### 組員每天開始工作

```bash
git switch develop
git fetch upstream
git merge upstream/develop
git push origin develop
```

### 組員完成一個功能

```bash
git status
git add 修改的檔案
git commit -m "清楚描述完成的功能"
git push origin develop
```

接著建立：

```text
組員 develop → Host develop
```

### Host 每次整合

1. 檢查 PR 目標分支。
2. 檢查修改內容與敏感資料。
3. 測試功能與 RWD。
4. Merge 到 Host `develop`。
5. 完成所有整合測試。
6. 建立 Host `develop` → Host `main` 的 PR。
7. Merge 後查看 Vercel 部署結果。
8. 開啟正式網站做最後驗收。

---

## 二十、成果展示與報告重點

報告時可依以下順序，在 10 分鐘內說明：

1. 專案目標：讓氣象資料更容易閱讀。
2. 組員分工：每人負責的畫面、功能與報告內容。
3. 網站展示：雨量、紫外線、22 縣市預報與 RWD。
4. 技術難題：紫外線測站資料需要兩個 API 用 StationID 配對。
5. 資料安全：API 金鑰放在 Vercel，不進 GitHub 或前端。
6. 協作流程：Fork → 組員 develop → Host develop → Host main。
7. 自動部署：main 更新後由 Vercel 發布正式網站。
8. 心得：多人協作需要清楚分工、分支規則、測試與溝通。

簡報上的協作說明建議使用：

> 組員在各自的 develop 分支進行開發，完成後提交 PR 到 Host 的 develop 分支。確認功能正常後，再將 Host develop 合併到 main，並由 Vercel 自動部署正式網站。

---

## 二十一、完成標準

當以下項目全部成立，就代表專案流程完整完成：

- 網站只顯示中央氣象署真實資料，不使用示範資料。
- 雨量、紫外線與 22 縣市預報功能正常。
- API 失敗時有清楚錯誤訊息與重新整理按鈕。
- API 金鑰只存在本機忽略檔案或 Vercel 環境變數。
- GitHub 有清楚的 `develop` 整合流程。
- 組員透過 Fork 與 PR 協作，不直接修改 Host `main`。
- Host 在 `develop` 完成測試後才合併到 `main`。
- Vercel 從 `main` 自動部署正式網站。
- README、SOP、簡報、GitHub 與正式網站內容一致。

