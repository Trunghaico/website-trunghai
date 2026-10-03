export interface Project {
  id: string;
  title: string;
  slug: string;
  category: "ham" | "cau-duong" | "quoc-lo" | "ha-tang";
  categoryName: string;
  client: string;
  location: string;
  year: string;
  value?: string;
  scale: string; // Quy mô kỹ thuật (ví dụ: "Chiều dài hầm 4.125m, 2 ống hầm độc lập")
  thumbnail: string;
  gallery: string[];
  description: string;
  highlights: string[];
  featured?: boolean;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  thumbnail: string;
  featured?: boolean;
  published?: boolean;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  deadline: string;
  type: "Toàn thời gian" | "Theo dự án";
  description: string[];
  requirements: string[];
  benefits: string[];
  active: boolean;
}

export interface HeroSlide {
  id: string;
  title?: string;
  subtitle?: string;
  tag?: string;
  image: string;
  projectLink?: string;
  stats?: { label: string; value: string };
  orderIndex?: number;
}

export interface CompanySettings {
  name: string;
  shortName: string;
  slogan: string;
  taxCode: string;
  address: string;
  phone: string;
  hotline: string;
  email: string;
  facebook: string;
  youtube: string;
  profilePdfUrl: string;
  slideInterval?: number;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: "admin" | "editor";
  createdAt?: string;
}

