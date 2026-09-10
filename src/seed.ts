import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds the database with a consistent set of artists and tracks for the application.
 * The script clears existing records before creating the initial dataset to keep the app state predictable.
 */
async function main() {
  console.log("⏳ Starting database seeding...");

  // Clear previous records to avoid duplicates during repeated local seeding runs.
  await prisma.track.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Database cleared. Creating new data...");

  // Seed the primary artists and their related tracks.
  const theWeeknd = await prisma.artist.create({
    data: {
      name: "The Weeknd",
      bio: "Канадський співак, автор пісень і музичний продюсер.",
      avatarUrl: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
      tracks: {
        create: [
          {
            title: "Blinding Lights",
            duration: 200,
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            coverUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=500&q=80",
          },
          {
            title: "Starboy",
            duration: 230,
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
          },
        ],
      },
    },
  });

  const daftPunk = await prisma.artist.create({
    data: {
      name: "Daft Punk",
      bio: "Французький електронний дует.",
      avatarUrl: "https://i.scdn.co/image/ab6761610000e5eb1439247c4731f50a80521e15",
      tracks: {
        create: [
          {
            title: "Get Lucky",
            duration: 249,
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
          },
        ],
      },
    },
  });

  // Populate the remaining artist grid so the library contains a 3x3 dataset.
  await prisma.artist.create({
    data: {
      name: "M83",
      bio: "Французький електронний гурт.",
      avatarUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80",
      tracks: {
        create: [{
          title: "Midnight City",
          duration: 210,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
          coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80",
        }],
      },
    },
  });

  await prisma.artist.create({
    data: {
      name: "Duke Dumont",
      bio: "Британський діджей та музичний продюсер.",
      avatarUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
      tracks: {
        create: [{
          title: "Ocean Drive",
          duration: 245,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
        }],
      },
    },
  });

  await prisma.artist.create({
    data: {
      name: "RÜFÜS DU SOL",
      bio: "Австралійський альтернативний танцювальний гурт.",
      avatarUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
      tracks: {
        create: [{
          title: "Innerbloom",
          duration: 180,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
          coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
        }],
      },
    },
  });

  await prisma.artist.create({
    data: {
      name: "Muse",
      bio: "Британський рок-гурт.",
      avatarUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80",
      tracks: {
        create: [{
          title: "Starlight",
          duration: 230,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
          coverUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80",
        }],
      },
    },
  });

  await prisma.artist.create({
    data: {
      name: "Gorillaz",
      bio: "Британський віртуальний гурт.",
      avatarUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
      tracks: {
        create: [{
          title: "Feel Good Inc",
          duration: 220,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
          coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
        }],
      },
    },
  });

  await prisma.artist.create({
    data: {
      name: "Coldplay",
      bio: "Британський поп-рок гурт.",
      avatarUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
      tracks: {
        create: [{
          title: "Yellow",
          duration: 260,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
          coverUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=500&q=80",
        }],
      },
    },
  });

  console.log(`✅ Created artist: ${theWeeknd.name} (with tracks)`);
  console.log(`✅ Created artist: ${daftPunk.name} (with tracks)`);
  console.log("✅ Added 6 more tracks for the grid");
  console.log("🎉 Database seeding completed successfully (9 tracks total)!");
}

main()
  .catch((e) => {
    console.error("❌ An error occurred:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });