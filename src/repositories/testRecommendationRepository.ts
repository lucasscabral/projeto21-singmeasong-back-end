import { prisma } from "../database"
import { faker } from "@faker-js/faker";

export async function reset() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`
}
export async function createManyRecomendations() {
    await prisma.recommendation.createMany({
        data: [
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
            {
                name: faker.lorem.words(),
                youtubeLink: "https://www.youtube.com/watch?v=_U4SwIilh6E",
                score: Math.ceil(Math.random() * (1000 - 5) + 5)
            },
        ]
    });
}