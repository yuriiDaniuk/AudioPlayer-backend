import express, { Request, Response } from 'express';

import cors from 'cors';

import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing and CORS configuration.
app.use(cors());
app.use(express.json());

/**
 * Returns all tracks with their related artist data.
 */
app.get('/api/tracks', async (req: Request, res: Response) => {
  try {
    const tracks = await prisma.track.findMany({
      include: { artist: true },
    });

    res.status(200).json(tracks);
  } catch (error) {
    console.error("Помилка отримання треків:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
});

// =============================================================
// Playlist routes
// =============================================================

/**
 * Returns the default playlist and all of its track data.
 */
app.get('/api/playlist', async (req: Request, res: Response) => {
  try {
    const playlist = await prisma.playlist.findFirst({
      include: {
        tracks: {
          include: { artist: true },
        },
      },
    });

    res.json(playlist || { tracks: [] });
  } catch (error) {
    console.error("Помилка отримання плейлиста:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

/**
 * Adds a track to the default playlist for the guest user.
 */
app.post('/api/playlist/add', async (req: Request, res: Response) => {
  try {
    const { trackId } = req.body;

    if (!trackId) {
      return res.status(400).json({ error: "Не передано ID треку" });
    }

    // Reuse a single guest user and default playlist to keep the library state stable.
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "guest@audioplayer.com",
          passwordHash: "default",
          name: "Guest",
        },
      });
    }

    let playlist = await prisma.playlist.findFirst({
      where: { userId: user.id },
    });

    if (!playlist) {
      playlist = await prisma.playlist.create({
        data: {
          title: "Улюблені треки",
          userId: user.id,
        },
      });
    }

    // Prisma connects the track through the relation by ID.
    await prisma.playlist.update({
      where: { id: playlist.id },
      data: {
        tracks: {
          connect: { id: trackId },
        },
      },
    });

    res.json({ success: true, message: "Трек успішно додано!" });
  } catch (error) {
    console.error("Помилка додавання треку:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

/**
 * Removes a track from the default playlist for the guest user.
 */
app.post('/api/playlist/remove', async (req: Request, res: Response) => {
  try {
    const { trackId } = req.body;

    if (!trackId) {
      return res.status(400).json({ error: "Не передано ID треку" });
    }

    // The app keeps a single shared guest playlist, so we resolve it before disconnecting the track.
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

    const playlist = await prisma.playlist.findFirst({
      where: { userId: user.id },
    });

    if (!playlist) return res.status(404).json({ error: "Плейлист не знайдено" });

    // Remove the track relationship without deleting the track itself.
    await prisma.playlist.update({
      where: { id: playlist.id },
      data: {
        tracks: {
          disconnect: { id: trackId },
        },
      },
    });

    res.json({ success: true, message: "Трек видалено з плейлиста" });
  } catch (error) {
    console.error("Помилка видалення треку:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Start the HTTP server.
app.listen(PORT, () => {
  console.log(`🚀 Сервер успішно запущено на http://localhost:${PORT}`);
});