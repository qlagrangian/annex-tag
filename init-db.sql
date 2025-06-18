CREATE TABLE IF NOT EXISTS annexes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  file_path TEXT NOT NULL,
  order_num INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO annexes(label,file_path,order_num) VALUES
  ('別紙1　証憑','annexes/test1.pdf',0),
  ('別紙2　甲第2号証','annexes/test2.pdf',1);
