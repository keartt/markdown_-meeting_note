
async function mdToPrettyPdf() {
  const fileNm = process.argv[2];

  const fs = require("fs");
  const { marked } = require("marked");
  const puppeteer = require("puppeteer");

  const md = fs.readFileSync(`./md/${fileNm}.md`, "utf-8");
  const content = marked(md);

  const html = `
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 12px;
        line-height: 1.5;
        color: #222;
      }

      .container {
        width: 100%;
      }

      h1 {
        font-size: 20px;
        border-bottom: 2px solid #111;
        padding-bottom: 6px;
        margin-bottom: 15px;
      }

      h2 {
        font-size: 15px;
        margin-top: 20px;
        border-left: 4px solid #2563eb;
        padding-left: 8px;
      }
      h1, h2, h3 {
        page-break-after: avoid;
        page-break-inside: avoid;
        break-after: avoid;
        break-inside: avoid;
      }

      /* ⭐ 이게 진짜 중요 (제목 다음 요소 같이 묶기) */
      h1 + *,
      h2 + *,
      h3 + * {
        page-break-before: avoid;
        break-before: avoid;
      }

      h3 {
        font-size: 13px;
        margin-top: 15px;
      }

      /* 문단/리스트/테이블 쪼개짐 방지 */
      p, ul, table {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        table-layout: fixed;
      }

      /* 🔥 헤더 숨기기 */
      table thead {
        display: none;
      }

      td {
        border: 1px solid #ddd;
        padding: 6px 8px;
        font-size: 12px;
      }

      /* 🔥 좌측 열만 회색 배경 */
      table td:nth-child(1) {
        background: #f3f4f6;
        font-weight: 600;
      }

      /* 🔥 비율 유지 */
      table td:nth-child(1) {
        width: 20%;
      }

      table td:nth-child(2) {
        width: 80%;
      }

      ul {
        padding-left: 18px;
      }

      li {
        margin-bottom: 4px;
      }

      ol {
        padding-left: 16px;   /* 기본 40px → 줄이기 */
        margin-left: 0;
      }

      ol li {
        margin-left: 0;
        padding-left: 2px;
      }

      .footer {
        margin-top: 20px;
        font-size: 10px;
        color: #888;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${content}
    </div>
  </body>
  </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.pdf({
    path: `./pdf/${fileNm}.pdf`,
    format: "A4",
    printBackground: true,
    margin: {
      top: "10mm",
      bottom: "10mm",
      left: "8mm",
      right: "8mm",
    },
  });

  await browser.close();

  console.log("생성 완료");
}

mdToPrettyPdf();

