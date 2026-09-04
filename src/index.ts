import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware для парсингу JSON та налаштування CORS
app.use(cors());
app.use(express.json());

// НАШ ПЕРШИЙ ЕНДПОІНТ
app.get('/api/tracks', async (req: Request, res: Response) => {
  try {
    // Prisma автоматично підтягне всі треки з MongoDB
    // include: { artist: true } одразу додасть об'єкт виконавця до кожного треку
    const tracks = await prisma.track.findMany({
      include: { artist: true },
    });
    
    res.status(200).json(tracks);
  } catch (error) {
    console.error("Помилка отримання треків:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер успішно запущено на http://localhost:${PORT}`);
});