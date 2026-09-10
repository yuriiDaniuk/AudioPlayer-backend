import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware для парсингу JSON та налаштування CORS
app.use(cors());
app.use(express.json());

// НАШ ПЕРШИЙ ЕНДПОІНТ (Отримання всіх пісень)
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

// ==========================================
//           РОУТИ ДЛЯ ПЛЕЙЛИСТА
// ==========================================

// 1. Отримати плейлист (для екрана Бібліотеки)
app.get('/api/playlist', async (req: Request, res: Response) => {
  try {
    const playlist = await prisma.playlist.findFirst({
      include: {
        tracks: {
          include: { artist: true } 
        }
      }
    });

    res.json(playlist || { tracks: [] });
  } catch (error) {
    console.error("Помилка отримання плейлиста:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// 2. Додати трек у плейлист
app.post('/api/playlist/add', async (req: Request, res: Response) => {
  try {
    const { trackId } = req.body;

    if (!trackId) {
      return res.status(400).json({ error: "Не передано ID треку" });
    }

    // Шукаємо або створюємо дефолтного юзера
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "guest@audioplayer.com",
          passwordHash: "default",
          name: "Guest"
        }
      });
    }

    // Шукаємо або створюємо дефолтний плейлист
    let playlist = await prisma.playlist.findFirst({
      where: { userId: user.id }
    });

    if (!playlist) {
      playlist = await prisma.playlist.create({
        data: {
          title: "Улюблені треки",
          userId: user.id
        }
      });
    }

    // Додаємо трек до плейлиста (Prisma автоматично з'єднає їх по ID)
    await prisma.playlist.update({
      where: { id: playlist.id },
      data: {
        tracks: {
          connect: { id: trackId } 
        }
      }
    });

    res.json({ success: true, message: "Трек успішно додано!" });
  } catch (error) {
    console.error("Помилка додавання треку:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// 3. Видалити трек з плейлиста
app.post('/api/playlist/remove', async (req: Request, res: Response) => {
  try {
    const { trackId } = req.body;

    if (!trackId) {
      return res.status(400).json({ error: "Не передано ID треку" });
    }

    // Знаходимо нашого дефолтного юзера
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

    // Знаходимо його плейлист
    const playlist = await prisma.playlist.findFirst({
      where: { userId: user.id }
    });

    if (!playlist) return res.status(404).json({ error: "Плейлист не знайдено" });

    // Видаляємо зв'язок треку з плейлистом (disconnect)
    await prisma.playlist.update({
      where: { id: playlist.id },
      data: {
        tracks: {
          disconnect: { id: trackId } 
        }
      }
    });

    res.json({ success: true, message: "Трек видалено з плейлиста" });
  } catch (error) {
    console.error("Помилка видалення треку:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер успішно запущено на http://localhost:${PORT}`);
});