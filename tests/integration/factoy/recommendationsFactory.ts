import { faker } from "@faker-js/faker"
import supertest from "supertest"
import app from "../../../src/app"
import { prisma } from "../../../src/database"


export async function bodyRecommendation() {
    return {
        name: faker.name.fullName(),
        youtubeLink: "https://youtu.be/TMr_83laADw"
    }
}

export async function addScoreRecommendation(idRecommendation: number, upvote: number) {
    await prisma.recommendation.update({
        where: {
            id: idRecommendation
        },
        data: {
            score: upvote
        }
    })
}


export async function removeRecommendationByScore(idRecommendation: number, downvotes: number) {

    for (let i = 0; i < downvotes; i++) {
        await supertest(app).post(`/recommendations/${idRecommendation}/downvote`).send({})
    }
}


export async function createManyRecommendations(createMany: number) {
    for (let i = 0; i < createMany; i++) {
        await supertest(app).post("/recommendations/").send(await bodyRecommendation())
    }
}

export async function visitRouterRandom(visitsRoute: number, random: string) {
    const listRecommendations = []

    if (random === "random_big_10") {
        for (let i = 0; i < visitsRoute; i++) {
            const recommendationRendom = await supertest(app).get("/recommendations/random").send()
            const recommendation = recommendationRendom?.body
            if (recommendation.score > 10) {
                listRecommendations.push(recommendation)
            }
        }
    }
    if (random === "random_less_or_equal_10") {
        for (let i = 0; i < visitsRoute; i++) {
            const recommendationRendom = await supertest(app).get("/recommendations/random").send()
            const recommendation = recommendationRendom?.body
            if (recommendation.score <= 10) {
                listRecommendations.push(recommendation)
            }
        }
    }
    return listRecommendations
}