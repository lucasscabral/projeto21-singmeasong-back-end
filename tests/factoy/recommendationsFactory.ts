import { faker } from "@faker-js/faker"
import supertest from "supertest"
import app from "../../src/app"


export async function bodyRecommendation() {
    return {
        name: faker.name.fullName(),
        youtubeLink: "https://youtu.be/TMr_83laADw"
    }
}

export async function removeRecommendationByScore(idRecommendation: number) {
    const downvotes = 6

    for (let i = 0; i < downvotes; i++) {
        await supertest(app).post(`/recommendations/${idRecommendation}/downvote`).send({})
    }
}


export async function createManyRecommendations() {
    const createMany = 20

    for (let i = 0; i < createMany; i++) {
        await supertest(app).post("/recommendations/").send(await bodyRecommendation())
    }
}