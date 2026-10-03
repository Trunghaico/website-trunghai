import { Project, NewsPost, JobPosting, CompanySettings, HeroSlide, User } from "@/types";
import {
  initialCompanySettings,
  initialProjects,
  initialNews,
  initialJobs,
  initialHeroSlides,
  initialUsers,
} from "@/data/initialData";
import { verifyPassword } from "@/lib/auth";

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
  users: User[];
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
    users: [...initialUsers],
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
          published: r.published === undefined || r.published === null ? true : Boolean(r.published),
        }));
      } catch (err) {
        console.warn("Cloudflare D1 query error for news:", err);
      }
    }
    return memoryStore.news.map((r) => ({
      ...r,
      published: r.published === undefined || r.published === null ? true : Boolean(r.published),
    }));
  },

  async getNewsBySlug(slug: string): Promise<NewsPost | undefined> {
    const list = await this.getNews();
    return list.find((n) => n.slug === slug || n.id === slug);
  },

  async saveNews(post: NewsPost): Promise<NewsPost> {
    const postToSave: NewsPost = {
      ...post,
      published: post.published === false ? false : true,
    };

    if (isCloudflareD1Configured) {
      try {
        await executeD1Query(
          `INSERT OR REPLACE INTO news (id, title, slug, category, categoryName, summary, content, date, author, thumbnail, featured, published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            postToSave.id,
            postToSave.title,
            postToSave.slug,
            postToSave.category,
            postToSave.categoryName,
            postToSave.summary,
            postToSave.content,
            postToSave.date,
            postToSave.author,
            postToSave.thumbnail,
            postToSave.featured ? 1 : 0,
            postToSave.published === false ? 0 : 1,
          ]
        );
      } catch (err) {
        console.warn("Cloudflare D1 save news error:", err);
      }
    }

    const index = memoryStore.news.findIndex((n) => n.id === postToSave.id);
    if (index >= 0) {
      memoryStore.news[index] = postToSave;
    } else {
      memoryStore.news.unshift(postToSave);
    }
    return postToSave;
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
    if (isCloudflareD1Configured) {
      try {
        const rows = await executeD1Query<any>(
          "SELECT * FROM slides ORDER BY order_index ASC, created_at ASC"
        );
        if (rows.length > 0) {
          return rows.map((r, idx) => ({
            id: r.id,
            title: r.title || "",
            subtitle: r.subtitle || "",
            tag: r.tag || "",
            image: r.image,
            projectLink: r.projectLink || "",
            stats: (() => {
              if (!r.stats) return undefined;
              if (typeof r.stats === "object") return r.stats;
              try {
                return JSON.parse(r.stats);
              } catch {
                return undefined;
              }
            })(),
            orderIndex: r.order_index ?? idx,
          }));
        } else {
          // Auto-seed initial slides into Cloudflare D1
          for (let i = 0; i < initialHeroSlides.length; i++) {
            const s = initialHeroSlides[i];
            await executeD1Query(
              `INSERT OR REPLACE INTO slides (id, title, subtitle, tag, image, projectLink, stats, order_index)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                s.id,
                s.title,
                s.subtitle || "",
                s.tag || "",
                s.image,
                s.projectLink || "",
                s.stats ? JSON.stringify(s.stats) : null,
                i,
              ]
            );
          }
          return initialHeroSlides.map((s, idx) => ({ ...s, orderIndex: idx }));
        }
      } catch (err) {
        console.warn("Cloudflare D1 get slides error, fallback to memory:", err);
      }
    }
    return memoryStore.slides;
  },

  async saveSlide(slide: HeroSlide): Promise<HeroSlide> {
    if (isCloudflareD1Configured) {
      try {
        await executeD1Query(
          `INSERT OR REPLACE INTO slides (id, title, subtitle, tag, image, projectLink, stats, order_index)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            slide.id,
            slide.title || "",
            slide.subtitle || "",
            slide.tag || "",
            slide.image,
            slide.projectLink || "",
            slide.stats ? JSON.stringify(slide.stats) : null,
            slide.orderIndex ?? 0,
          ]
        );
      } catch (err) {
        console.warn("Cloudflare D1 save slide error:", err);
      }
    }
    const index = memoryStore.slides.findIndex((s) => s.id === slide.id);
    if (index >= 0) {
      memoryStore.slides[index] = slide;
    } else {
      memoryStore.slides.push(slide);
    }
    return slide;
  },

  async deleteSlide(id: string): Promise<boolean> {
    if (isCloudflareD1Configured) {
      try {
        await executeD1Query("DELETE FROM slides WHERE id = ?", [id]);
      } catch (err) {
        console.warn("Cloudflare D1 delete slide error:", err);
      }
    }
    const idx = memoryStore.slides.findIndex((s) => s.id === id);
    if (idx >= 0) {
      memoryStore.slides.splice(idx, 1);
      return true;
    }
    return false;
  },

  // === SETTINGS ===
  async getSettings(): Promise<CompanySettings> {
    if (isCloudflareD1Configured) {
      try {
        const rows = await executeD1Query<{ key: string; value: string }>("SELECT key, value FROM settings");
        if (rows.length > 0) {
          const loaded: Record<string, any> = {};
          for (const r of rows) {
            if (r.key === "slideInterval" || r.key === "slide_interval") {
              loaded.slideInterval = Number(r.value) || 5;
            } else {
              loaded[r.key] = r.value;
            }
          }
          return {
            ...memoryStore.settings,
            ...loaded,
          } as CompanySettings;
        }
      } catch (err) {
        console.warn("Cloudflare D1 get settings error, fallback to memory:", err);
      }
    }
    return memoryStore.settings;
  },

  async updateSettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    if (isCloudflareD1Configured) {
      try {
        for (const [key, value] of Object.entries(settings)) {
          if (value !== undefined) {
            await executeD1Query(
              "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
              [key, String(value)]
            );
          }
        }
      } catch (err) {
        console.warn("Cloudflare D1 update settings error:", err);
      }
    }
    memoryStore.settings = { ...memoryStore.settings, ...settings };
    return memoryStore.settings;
  },

  // === USERS / AUTHENTICATION ===
  async getUserByUsername(username: string): Promise<User | undefined> {
    if (isCloudflareD1Configured) {
      try {
        const rows = await executeD1Query<any>("SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1", [username]);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            username: r.username,
            passwordHash: r.password_hash,
            name: r.name,
            role: r.role || "admin",
            createdAt: r.created_at,
          };
        }
      } catch (err) {
        console.warn("Cloudflare D1 get user error, fallback to memory:", err);
      }
    }
    return memoryStore.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  },

  async verifyCredentials(username: string, passwordPlain: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    const isValid = await verifyPassword(passwordPlain, user.passwordHash);
    if (!isValid) return null;
    return user;
  },

  async updatePassword(username: string, newPasswordHash: string): Promise<boolean> {
    if (isCloudflareD1Configured) {
      try {
        await executeD1Query("UPDATE users SET password_hash = ? WHERE LOWER(username) = LOWER(?)", [newPasswordHash, username]);
      } catch (err) {
        console.warn("Cloudflare D1 update password error:", err);
      }
    }
    const user = memoryStore.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      user.passwordHash = newPasswordHash;
      return true;
    }
    return false;
  },

  async createUser(user: User): Promise<User> {
    if (isCloudflareD1Configured) {
      try {
        await executeD1Query(
          "INSERT OR REPLACE INTO users (id, username, password_hash, name, role) VALUES (?, ?, ?, ?, ?)",
          [user.id, user.username, user.passwordHash, user.name, user.role]
        );
      } catch (err) {
        console.warn("Cloudflare D1 create user error:", err);
      }
    }
    const idx = memoryStore.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      memoryStore.users[idx] = user;
    } else {
      memoryStore.users.push(user);
    }
    return user;
  },
};
