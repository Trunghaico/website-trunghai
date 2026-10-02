-- Bảng Dự Án (Projects)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  categoryName TEXT NOT NULL,
  client TEXT,
  location TEXT,
  year TEXT,
  value TEXT,
  scale TEXT,
  thumbnail TEXT,
  gallery TEXT, -- JSON array of URLs
  description TEXT,
  highlights TEXT, -- JSON array
  featured INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Tin Tức (News)
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  categoryName TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  date TEXT,
  author TEXT,
  thumbnail TEXT,
  featured INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Tuyển Dụng (Jobs)
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  salary TEXT,
  deadline TEXT,
  type TEXT,
  description TEXT, -- JSON array
  requirements TEXT, -- JSON array
  benefits TEXT, -- JSON array
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Cấu Hình Doanh Nghiệp (Settings)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
