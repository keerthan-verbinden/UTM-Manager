import { PrismaClient, Prisma } from "@prisma/client";
import type { User as DbUser, CampaignLink as DbLink } from "@prisma/client";
import { User, CampaignLink, DashboardStats } from "../types/index.js";

// Reuse one PrismaClient (avoids exhausting connections in dev / hot reload)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Prisma returns Date objects; the rest of the app expects ISO strings
function toUser(u: DbUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

function toLink(l: DbLink): CampaignLink {
  return {
    id: l.id,
    userId: l.userId,
    landingPageUrl: l.landingPageUrl,
    source: l.source,
    medium: l.medium,
    campaign: l.campaign,
    content: l.content,
    term: l.term,
    generatedUrl: l.generatedUrl,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  };
}

class DatabaseService {
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    return user ? toUser(user) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? toUser(user) : null;
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    // Throws Prisma error P2002 if the email already exists
    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password, // must already be hashed by the caller
      },
    });
    return toUser(user);
  }

  async createLink(data: {
    userId: string;
    landingPageUrl: string;
    source: string;
    medium: string;
    campaign: string;
    content?: string | null;
    term?: string | null;
    generatedUrl: string;
  }): Promise<CampaignLink> {
    const link = await prisma.campaignLink.create({
      data: {
        userId: data.userId,
        landingPageUrl: data.landingPageUrl,
        source: data.source,
        medium: data.medium,
        campaign: data.campaign,
        content: data.content || null,
        term: data.term || null,
        generatedUrl: data.generatedUrl,
      },
    });
    return toLink(link);
  }

  async getLinks(
    userId: string,
    filters?: { search?: string; source?: string; medium?: string },
  ): Promise<CampaignLink[]> {
    const and: Prisma.CampaignLinkWhereInput[] = [{ userId }];

    if (filters?.search) {
      const q = filters.search.trim();
      if (q) {
        const contains = { contains: q, mode: "insensitive" as const };
        and.push({
          OR: [
            { campaign: contains },
            { source: contains },
            { medium: contains },
            { content: contains },
            { term: contains },
            { landingPageUrl: contains },
          ],
        });
      }
    }

    if (filters?.source && filters.source !== "ALL") {
      and.push({
        source: { equals: filters.source.trim(), mode: "insensitive" },
      });
    }

    if (filters?.medium && filters.medium !== "ALL") {
      and.push({
        medium: { equals: filters.medium.trim(), mode: "insensitive" },
      });
    }

    const links = await prisma.campaignLink.findMany({
      where: { AND: and },
      orderBy: { createdAt: "desc" },
    });
    return links.map(toLink);
  }

  async getLinkById(id: string, userId: string): Promise<CampaignLink | null> {
    const link = await prisma.campaignLink.findFirst({ where: { id, userId } });
    return link ? toLink(link) : null;
  }

  async deleteLink(id: string, userId: string): Promise<boolean> {
    const result = await prisma.campaignLink.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }

  async getStats(userId: string): Promise<DashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalLinks, linksThisMonth, unique] = await Promise.all([
      prisma.campaignLink.count({ where: { userId } }),
      prisma.campaignLink.count({
        where: { userId, createdAt: { gte: startOfMonth } },
      }),
      prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(DISTINCT LOWER(TRIM("campaign")))::int AS count
        FROM "campaign_links"
        WHERE "userId" = ${userId}`,
    ]);

    return {
      totalLinks,
      linksThisMonth,
      uniqueCampaigns: unique[0]?.count ?? 0,
    };
  }
}

export const dbService = new DatabaseService();
