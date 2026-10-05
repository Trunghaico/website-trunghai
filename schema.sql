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
  published INTEGER DEFAULT 1,
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
  working_hours TEXT,
  type TEXT,
  description TEXT, -- JSON array
  requirements TEXT, -- JSON array
  benefits TEXT, -- JSON array
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Slides Trang Chủ (Hero Slides)
CREATE TABLE IF NOT EXISTS slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  tag TEXT,
  image TEXT NOT NULL,
  projectLink TEXT,
  stats TEXT, -- JSON string { label, value }
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Cấu Hình Doanh Nghiệp (Settings)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Bảng Người Dùng Quản Trị (Users)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tài khoản quản trị mặc định: username = 'admin', password = 'trunghai@2026'
INSERT OR IGNORE INTO users (id, username, password_hash, name, role)
VALUES (
  'user-admin-1',
  'admin',
  '03f2abc18e5d21007000b9c04c17edfea0800450ab1198a72fc535d589baf506',
  'Quản Trị Viên Trung Hải',
  'admin'
);

