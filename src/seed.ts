import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⏳ Починаємо наповнення бази даних...");

  // 1. Очищаємо старі дані (щоб не було дублікатів при повторному запуску)
  await prisma.track.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Базу очищено. Створюємо нові дані...");

  // 2. Створюємо Артиста №1 разом із його треками
  const theWeeknd = await prisma.artist.create({
    data: {
      name: "The Weeknd",
      bio: "Канадський співак, автор пісень і музичний продюсер.",
      avatarUrl:
        "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
      tracks: {
        create: [
          {
            title: "Blinding Lights",
            duration: 200,
            audioUrl:
              "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            coverUrl:
              "https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=500&q=80",
          },
          {
            title: "Starboy",
            duration: 230,
            audioUrl:
              "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            coverUrl:
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
          },
        ],
      },
    },
  });

  // 3. Створюємо Артиста №2
  const daftPunk = await prisma.artist.create({
    data: {
      name: "Daft Punk",
      bio: "Французький електронний дует.",
      avatarUrl:
        "https://i.scdn.co/image/ab6761610000e5eb1439247c4731f50a80521e15",
      tracks: {
        create: [
          {
            title: "Get Lucky",
            duration: 249,
            audioUrl:
              "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            coverUrl:
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
          },
        ],
      },
    },
  });

  console.log(`✅ Створено артиста: ${theWeeknd.name} (з треками)`);
  console.log(`✅ Створено артиста: ${daftPunk.name} (з треками)`);
  console.log("🎉 Базу успішно наповнено!");
}

// Запускаємо головну функцію
main()
  .catch((e) => {
    console.error("❌ Сталася помилка:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Обов'язково закриваємо з'єднання після завершення
    await prisma.$disconnect();
  });
