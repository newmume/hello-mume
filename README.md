# Mume Personal Dashboard & AI 課程簡介

歡迎來到 **Mume** 的個人化專屬儀表板！本專案旨在提供一個美觀且實用的個人首頁，結合了即時時鐘、互動式月曆、動態天氣系統，並整合了在 **NotebookLM** 上精心整理的 **AI 課程精華簡介**。

🔗 **線上展示（Live Demo）**：[https://newmume.github.io/hello-mume/](https://newmume.github.io/hello-mume/)

---

## 🌟 儀表板功能特色

- ⏱️ **動態數位時鐘**：毫秒級高精準度同步時間、日期及星期顯示。
- 📅 **互動月曆系統**：支援前後月份切換、自動高亮顯示今日日期，並有精美的選取狀態。
- 🌤️ **即時氣象小工具**：免 API Key 連接 Open-Meteo，支援瀏覽器定位與全球城市搜尋，卡片圖示會隨天氣自動播放精緻的 SVG 微動畫（如太陽旋轉、下雨滴落等）。
- 🌌 **極致毛玻璃美學**：採用 Modern Glassmorphic UI 設計，配合深色模式背景與動態流動的三色渲染光暈，帶來極致視覺體驗。

---

## 📚 NotebookLM 整理：AI 課程簡介

以下是利用 **NotebookLM** 深度學習工具所彙整的 AI 前沿課程精華，涵蓋了從基礎理論到當代生成式 AI 的核心技能。

### 📊 課程一：機器學習基礎與實務應用 (Fundamentals of ML)
* **課程簡介**：深入探索機器學習的經典演算法，包括監督式學習（迴歸、決筆樹、SVM）與非監督式學習（K-Means、PCA 分群），並著重於資料特徵工程與模型評估指標。
* **NotebookLM 整理精華**：
  > 💡 *「機器學習的關鍵在於『垃圾進，垃圾出（Garbage in, Garbage out）』。良好的特徵工程往往比模型本身的複雜度更能決定預測結果的上限。」*
* **核心主題**：
  - 特徵選擇與降維技術（PCA）
  - 迴歸預測與分類演算法
  - 模型過擬合（Overfitting）與正規化（L1/L2）

### 🧠 課程二：深度學習與神經網路結構 (Deep Learning & CNNs)
* **課程簡介**：探討多層神經網路的數學原理與反向傳播（Backpropagation）演算法。重點介紹卷積神經網路（CNN）在電腦視覺（CV）領域的影像辨識與物件偵測應用。
* **NotebookLM 整理精華**：
  > 💡 *「卷積層透過『局部感受野』與『權重共享』大幅降低了參數量，這使得神經網路能夠像人類視覺皮層一樣，逐層提取影像的邊緣、紋理及高階語義特徵。」*
* **核心主題**：
  - 反向傳播與激活函數（ReLU, Sigmoid）
  - 卷積與池化操作（Max Pooling）
  - 電腦視覺經典架構（ResNet, YOLO）

### 🤖 課程三：生成式 AI 與大型語言模型 (Generative AI & LLMs)
* **課程簡介**：解密現代生成式 AI 的基石 —— Transformer 架構與自注意力機制（Self-Attention）。本課程著重於預訓練（Pre-training）、微調（Fine-tuning）以及當前最受矚目的檢索增強生成（RAG）架構。
* **NotebookLM 整理精華**：
  > 💡 *「大型語言模型本質上是高度複雜的『下一個詞預測器』。透過檢索增強生成（RAG）技術，我們可以將外部即時知識庫無縫導入 LLM，徹底解決模型的『幻覺（Hallucination）』問題。」*
* **核心主題**：
  - Transformer 架構與 Self-Attention 原理
  - Prompt Engineering（提示詞工程）高級技巧（CoT, Few-shot）
  - RAG 系統架構與向量資料庫（Vector DB）整合

### 🌐 課程四：AI 代理人與多代理協作系統 (AI Agents)
* **課程簡介**：前瞻性研究自主 AI 代理人（AI Agents）的規劃能力、記憶機制（長期與短期記憶）以及工具調用（Tool Use）。設計並實現多個 Agent 之間的對話、協作與任務分工。
* **NotebookLM 整理精華**：
  > 💡 *「未來的軟體開發不再只是編寫靜態程式碼，而是協調多個具備專業背景的 AI Agents。透過 ReAct 框架，Agents 能進行『思考-行動-觀察』的循環，自主解決複雜的探索性任務。」*
* **核心主題**：
  - 代理人決策框架（ReAct, Plan-and-Solve）
  - 記憶庫架構（Vector Search & Scratchpad）
  - 多代理人工作流協作（如 AutoGen、CrewAI 等原理）

---

## 🛠️ 開發架構與技術棧

- **網頁結構**：HTML5 Semantic Elements
- **樣式視覺**：Vanilla CSS3（客製化 Glassmorphism 變數、網格布局與 `@keyframes` 自訂動畫）
- **互動邏輯**：ECMAScript 6+（原生 JS 非同步 `fetch` 連接氣象與地理解碼 API）
- **圖示庫**：Lucide Icons
- **資料來源**：Open-Meteo Keyless API

---

## 🚀 如何啟動專案

1. **取得程式碼**：將本目錄下的所有檔案下載至您的電腦。
2. **運行網頁**：直接雙擊 [index.html](file:///e:/Mume_AI/NCHU%20HW/20260531/index.html)。它會以靜態網頁形式直接在您的瀏覽器（Chrome, Edge, Safari 等）中運行。
3. **客製化內容**：如果您想修改 AI 課程的筆記，可以直接編輯本 [README.md](file:///e:/Mume_AI/NCHU%20HW/20260531/README.md) 檔案，或使用 HTML 編輯器在 `index.html` 中加入新區塊。
