import { Project, NewsPost, JobPosting, CompanySettings, HeroSlide } from "@/types";
import {
  initialCompanySettings,
  initialProjects,
  initialNews,
  initialJobs,
  initialHeroSlides,
} from "@/data/initialData";

// Environment variables for Cloudflare D1
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const isCloudflareD1Configured = Boolean(
  CF_ACCOUNT_ID && CF_DATABASE_ID && CF_API_TOKEN
);

// In-Memory state for development / fallback
interface DatabaseStore {
  projects: Project[];
  news: NewsPost[];
  jobs: JobPosting[];
  slides: HeroSlide[];
  settings: CompanySettings;
}

// Global cached store to persist across API requests in Node runtime
const globalForDb = globalThis as unknown as {
  __trunghaiDb?: DatabaseStore;
};

if (!globalForDb.__trunghaiDb) {
  globalForDb.__trunghaiDb = {
    projects: [...initialProjects],
    news: [...initialNews],
    jobs: [...initialJobs],
    slides: [...initialHeroSlides],
    settings: { ...initialCompanySettings },
  };
}

const memoryStore = globalForDb.__trunghaiDb;

// Execute query on Cloudflare D1 via REST API
export async function executeD1Query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!isCloudflareD1Configured) {
    throw new Error("Cloudflare D1 is not configured with environment variables.");
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_DATABASE_ID}/query`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.errors?.[0]?.message || "Cloudflare D1 query failed");
  }

  return (data.result?.[0]?.results || []) as T[];
}

// Database Service Layer with automatic Cloudflare D1 / Memory fallback
export const db = {
  isCloudflareConfigured(): boolean {
    return isCloudflareD1Configured;
  },

  // === PROJECTS ===
  async getProjects(): Promise<Project[]> {
    if (isCloudflareD1Configured) {
      try {
        const rows = await executeD1Query<any>("SELECT * FROM projects ORDER BY created_at DESC");
        return rows.map((r) => ({
          ...r,
          gallery: typeof r.gallery === "string" ? JSON.parse(r.gallery) : r.gallery || [],
          highlights: typeof r.highlights === "string" ? JSON.parse(r.highlights) : r.highlights || [],
          featured: Boolean(r.featured),
        }));
      } catch (err) {
        console.warn("Cloudflare D1 query error, falling back to memory store:", err);
      }
    }
    return memoryStore.projects;
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    const list = await this.getProjects();
    return list.find((p) => p.id === id);
  },

  async saveProject(project: Project): Promise<Project> {
    if (isCloudflareD1Configured) {
      try {
        await executeD1Query(
          `INSERT OR REPLACE INTO projects (id, title, slug, category, categoryName, client, location, year, value, scale, thumbnail, gallery, description, highlights, featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            project.id,
            project.title,
            project.slug,
            project.category,
            project.categoryName,
            project.client,
            project.location,
            project.year,
            project.value || "",
            project.scale,
            project.thumbnail,
            JSON.stringify(project.gallery || []),
            project.description,
            JSON.stringify(project.highlights || []),
            project.featured ? 1 : 0,
          ]
        );
      } catch (err) {
        console.warn("Cloudflare D1 save error, updating memory store:", err);
      }
    }

    const index = memoryStore.projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      memoryStore.projects[index] = project;
    } else {
      memoryStore.projects.unshift(project);
    }
    return project;
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isCloudflareD1Configured) {
      try {
        await executeD1Query("DELETE FROM projects WHERE id = ?", [id]);
      } catch (err) {
        console.warn("Cloudflare D1 delete error:", err);
      }
    }
    const idx = memoryStore.projects.findIndex((p) => p.id === id);
    if (idx >= 0) {
      memoryStore.projects.splice(idx, 1);
      return true;
    }
    return false;
  },

  // === NEWS POSTS ===
  async getNews(): Promise<NewsPost[]> {
    if (isCloudflareD1Configured) {
      try {
        const rows = await executeD1Query<any>("SELECT * FROM news ORDER BY created_at DESC");
        return rows.map((r) => ({
          ...r,
          featured: Boolean(r.featured),
        }));
      } catch (err) {
        console.warn("Cloudflare D1 query error for news:", err);
      }
    }
    return memoryStore.news;
  },

  async saveNews(post: NewsPost): Promise<NewsPost> {
    if (isCloudflareD1Configured) {
      try {
        await executeD1Query(
          `INSERT OR REPLACE INTO news (id, title, slug, category, categoryName, summary, content, date, author, thumbnail, featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.id,
            post.title,
            post.slug,
            post.category,
            post.categoryName,
            post.summary,
            post.content,
            post.date,
            post.author,
            post.thumbnail,
            post.featured ? 1 : 0,
          ]
        );
      } catch (err) {
        console.warn("Cloudflare D1 save news error:", err);
      }
    }

    const index = memoryStore.news.findIndex((n) => n.id === post.id);
    if (index >= 0) {
      memoryStore.news[index] = post;
    } else {
      memoryStore.news.unshift(post);
    }
    return post;
  },

  async deleteNews(id: string): Promise<boolean> {
    if (isCloudflareD1Configured) {
      try {
        await executeD1Query("DELETE FROM news WHERE id = ?", [id]);
      } catch (err) {
        console.warn("Cloudflare D1 delete news error:", err);
      }
    }
    const idx = memoryStore.news.findIndex((n) => n.id === id);
    if (idx >= 0) {
      memoryStore.news.splice(idx, 1);
      return true;
    }
    return false;
  },

  // === JOBS ===
  async getJobs(): Promise<JobPosting[]> {
    if (isCloudflareD1Configured) {
      try {
        const rows = await executeD1Query<any>("SELECT * FROM jobs ORDER BY id DESC");
        return rows.map((r) => ({
          ...r,
          description: typeof r.description === "string" ? JSON.parse(r.description) : r.description || [],
          requirements: typeof r.requirements === "string" ? JSON.parse(r.requirements) : r.requirements || [],
          benefits: typeof r.benefits === "string" ? JSON.parse(r.benefits) : r.benefits || [],
          active: Boolean(r.active),
        }));
      } catch (err) {
        console.warn("Cloudflare D1 get jobs error:", err);
      }
    }
    return memoryStore.jobs;
  },

  async saveJob(job: JobPosting): Promise<JobPosting> {
    const index = memoryStore.jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      memoryStore.jobs[index] = job;
    } else {
      memoryStore.jobs.unshift(job);
    }
    return job;
  },

  async deleteJob(id: string): Promise<boolean> {
    const idx = memoryStore.jobs.findIndex((j) => j.id === id);
    if (idx >= 0) {
      memoryStore.jobs.splice(idx, 1);
      return true;
    }
    return false;
  },

  // === SLIDES ===
  async getSlides(): Promise<HeroSlide[]> {
    return memoryStore.slides;
  },

  async saveSlide(slide: HeroSlide): Promise<HeroSlide> {
    const index = memoryStore.slides.findIndex((s) => s.id === slide.id);
    if (index >= 0) {
      memoryStore.slides[index] = slide;
    } else {
      memoryStore.slides.push(slide);
    }
    return slide;
  },

  // === SETTINGS ===
  async getSettings(): Promise<CompanySettings> {
    return memoryStore.settings;
  },

  async updateSettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    memoryStore.settings = { ...memoryStore.settings, ...settings };
    return memoryStore.settings;
  },
};
