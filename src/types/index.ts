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
  title: string; // Chức danh / vị trí
  department?: string; // Phòng ban
  location: string; // Địa điểm làm việc
  salary: string; // Mức lương
  deadline: string; // Hạn nộp
  workingHours?: string; // Thời gian làm việc
  type?: string; // Hình thức (Toàn thời gian / Theo dự án)
  description: string[]; // Mô tả công việc
  requirements: string[]; // Yêu cầu ứng viên
  benefits: string[]; // Quyền lợi ứng viên
  active?: boolean;
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

  // Cấu hình trang Liên hệ
  workingHours?: string;
  workingNote?: string;
  googleMapsUrl?: string;
  googleMapsEmbedUrl?: string;
  directionGuide?: string;

  // Chỉ số nổi bật trên thẻ Liên hệ
  establishedYear?: string;
  experienceYears?: string;
  completedProjects?: string;
  isoStandard?: string;

  // Bộ phận & Khối chuyên môn liên hệ
  projectEmail?: string;
  projectHotline?: string;
  equipmentPhone?: string;
  equipmentAddress?: string;
  recruitmentEmail?: string;

  // Cấu hình Header
  headerLogoUrl?: string;
  headerAddress?: string;
  headerWorkingHours?: string;
  headerPhoneDisplay?: string;
  headerHotline?: string;
  headerEmail?: string;
  headerCtaText?: string;
  headerNavItemsJson?: string;

  // Cấu hình Footer
  footerCompanyName?: string;
  footerDescription?: string;
  footerTaxAuthority?: string;
  footerAddress?: string;
  footerPhone?: string;
  footerHotline?: string;
  footerEmail?: string;
  footerCopyright?: string;
  footerIsoCertification?: string;
  footerShowMap?: boolean | string;
  footerMapTitle?: string;
  footerMapEmbedUrl?: string;
  footerMapUrl?: string;
  footerMapAddress?: string;
  footerQuickLinksJson?: string;
  footerProjectsLinksJson?: string;

  // Cấu hình Cloudinary Storage
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  cloudinaryQuotaGb?: number;
}

export interface CloudinaryUsageData {
  connected: boolean;
  source: "cloudinary_api" | "database_estimate";
  plan?: string;
  lastUpdated?: string;
  cloudName: string;
  storage: {
    usedBytes: number;
    usedFormatted: string;
    limitBytes: number;
    limitFormatted: string;
    remainingBytes: number;
    remainingFormatted: string;
    percentUsed: number;
  };
  objects: {
    count: number;
  };
  bandwidth?: {
    usedBytes: number;
    usedFormatted: string;
  };
  transformations?: {
    count: number;
  };
  credits?: {
    usage?: number;
    percentUsage?: number;
    limit?: number;
  };
  error?: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: "admin" | "editor";
  createdAt?: string;
}

export interface Partner {
  id: string;
  name: string;
  website?: string;
  logo: string;
  orderIndex?: number;
  active?: boolean;
}

