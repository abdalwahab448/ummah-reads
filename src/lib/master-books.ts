import type { Track } from "@/lib/types";
import { prisma } from "@/lib/prisma";

export function normalizeBookTitle(title: string) {
  return title.trim().replace(/\s+/g, " ");
}

export async function ensureMasterBook(title: string, track: Track, createdById?: string, pagesCount = 0) {
  const normalizedTitle = normalizeBookTitle(title);

  if (!normalizedTitle) {
    return null;
  }

  const existing = await prisma.masterBook.findFirst({
    where: {
      track,
      title: normalizedTitle
    }
  });

  if (existing) {
    return existing;
  }

  return prisma.masterBook.create({
    data: {
      title: normalizedTitle,
      track,
      pagesCount,
      createdById: createdById ?? null
    }
  });
}
