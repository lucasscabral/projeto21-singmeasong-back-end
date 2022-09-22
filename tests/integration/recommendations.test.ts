import supertest from "supertest";
import app from "../../src/app";
import * as recommendationsFactory from "../factoy/recommendationsFactory";
import { prisma } from "../../src/database"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`
})



describe("Testa inserção de recomendação", () => {
    it("Deve Retornar status 201 Para a criação de uma recomendação", async () => {
        const bodyRecommendation = await recommendationsFactory.bodyRecommendation()

        const createRecommendation = await supertest(app).post("/recommendations/").send(bodyRecommendation)

        expect(createRecommendation.status).toBe(201)
    })

    it("Deve Retornar status 409 Para a criação de uma recomendação igual há uma existente no Banco de Dados", async () => {
        const bodyRecommendation = await recommendationsFactory.bodyRecommendation()

        await supertest(app).post("/recommendations/").send(bodyRecommendation)

        const createRecommendationAgain = await supertest(app).post("/recommendations/").send(bodyRecommendation)

        expect(createRecommendationAgain.status).toBe(409)
    })
})

describe("Testa adição de pontos na recomendação", () => {
    it("Deve retornar 200 para a adição de um ponto na recomendação", async () => {
        const bodyRecommendation = await recommendationsFactory.bodyRecommendation()

        await supertest(app).post("/recommendations/").send(bodyRecommendation)

        const getRecommendations = await supertest(app).get("/recommendations/").send()
        const idRecommendation = getRecommendations.body[0].id

        const upvote = await supertest(app).post(`/recommendations/${idRecommendation}/upvote`).send({})
        const getByIdRecommendation = await supertest(app).get(`/recommendations/${idRecommendation}`).send()
        const score = getByIdRecommendation.body.score

        expect(upvote.status).toBe(200)
        expect(score).toBe(1)
    })
})

describe("Testa remoção de pontos na recomendação", () => {
    it("Deve retornar 200 para a remoção de um ponto na recomendação", async () => {
        const bodyRecommendation = await recommendationsFactory.bodyRecommendation()

        await supertest(app).post("/recommendations/").send(bodyRecommendation)

        const getRecommendations = await supertest(app).get("/recommendations/").send()
        const idRecommendation = getRecommendations.body[0].id

        const upvote = await supertest(app).post(`/recommendations/${idRecommendation}/upvote`).send({})
        const getByIdRecommendation = await supertest(app).get(`/recommendations/${idRecommendation}`).send()
        const score = getByIdRecommendation.body.score

        expect(upvote.status).toBe(200)
        expect(score).toBe(1)
    })
})

describe("Testa a listagem das Recomendações", () => {
    it("Deve retornar um array de recomendações", async () => {
        const getRecommendations = await supertest(app).get("/recommendations/").send()

        expect(getRecommendations.status).toBe(200)
        expect(getRecommendations.body).toBeInstanceOf(Array)
    })
})


afterAll(async () => {
    await prisma.$disconnect()
})