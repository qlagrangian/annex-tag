import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());

const port = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 3001;

const db = new Database(path.resolve(__dirname, '../../annex.db'));

// Annex 一覧取得
app.get('/api/annexes', (_req, res) => {
  const rows = db.prepare('SELECT * FROM annexes ORDER BY order_num').all();
  res.json(rows);
});

// PDF 結合・出力
app.get('/api/export', async (_req, res) => {
  const annexes = db.prepare('SELECT file_path FROM annexes ORDER BY order_num').all();
  const merged = await PDFDocument.create();
  for (const { file_path } of annexes) {
    const fileBytes = fs.readFileSync(path.resolve(__dirname, '../../', file_path));
    const doc = await PDFDocument.load(fileBytes);
    const copied = await merged.copyPages(doc, doc.getPageIndices());
    copied.forEach(p => merged.addPage(p));
  }
  const buf = await merged.save();
  const filename = `Annexes_${new Date().toISOString().slice(0,10)}.pdf`;
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${filename}"`
  });
  res.send(Buffer.from(buf));
});



app.listen(port, () => console.log(`Annex API listening on http://localhost:${port}`));
