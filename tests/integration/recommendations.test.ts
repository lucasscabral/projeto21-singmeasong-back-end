import supertest from "supertest";
import app from "../../src/app";
import * as recommendationsFactory from "./factoy/recommendationsFactory";
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
    it("Deve retornar status 200 para a adição de um ponto na recomendação", async () => {
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
    it("Deve retornar status 200 para a remoção de um ponto na recomendação", async () => {
        const bodyRecommendation = await recommendationsFactory.bodyRecommendation()

        //PRIMEIRO CRIA UMA RECOMENDAÇÃO
        await supertest(app).post("/recommendations/").send(bodyRecommendation)

        //LISTA A RECOMENDAÇÃO CRIADA
        const getRecommendations = await supertest(app).get("/recommendations/").send()
        const idRecommendation = getRecommendations.body[0].id

        //ADICIONA UMA PONTUAÇÃO NA RECOMENDAÇÃO 
        await supertest(app).post(`/recommendations/${idRecommendation}/upvote`).send({})

        //REMOVE UMA PONTUAÇÃO NA RECOMENDAÇÃO
        const downvote = await supertest(app).post(`/recommendations/${idRecommendation}/downvote`).send({})

        //BUSCA A RECOMENDAÇÃO CRIADA NO INÍCIO E PEGA O SCORE DESSA RECOMENDAÇÃO
        const getByIdRecommendation = await supertest(app).get(`/recommendations/${idRecommendation}`).send()
        const score = getByIdRecommendation.body.score

        expect(downvote.status).toBe(200)
        expect(score).toBe(0)
    })

    it("Deve remover a recomendação,caso a sua pontuação seja menor que -5", async () => {
        const bodyRecommendation = await recommendationsFactory.bodyRecommendation()

        //PRIMEIRO CRIA UMA RECOMENDAÇÃO
        await supertest(app).post("/recommendations/").send(bodyRecommendation)

        const idRecommendation = 1
        const downvotes = 6

        await recommendationsFactory.removeRecommendationByScore(idRecommendation, downvotes)

        const recommendation = await supertest(app).get(`/recommendations/${idRecommendation}`).send()

        expect(recommendation.status).toBe(404)
    })

})

describe("Testa a listagem das Recomendações", () => {
    it("Deve retornar um array de recomendações", async () => {
        const getRecommendations = await supertest(app).get("/recommendations/").send()

        expect(getRecommendations.status).toBe(200)
        expect(getRecommendations.body).toBeInstanceOf(Array)
    })
    it("Deve retornar apenas as 10 últimas recomendações", async () => {
        const createRecommendation = 20

        await recommendationsFactory.createManyRecommendations(createRecommendation)
        const getRecommendations = await supertest(app).get("/recommendations/").send()

        expect(getRecommendations.status).toBe(200)
        expect(getRecommendations.body).toHaveLength(10)
    })
})

describe("Testa o retorno de uma única Recomendação", () => {
    it("Deve retornar status 200 para o sucesso do retorno", async () => {
        const bodyRecommendation = await recommendationsFactory.bodyRecommendation()

        await supertest(app).post("/recommendations/").send(bodyRecommendation)

        const getRecommendations = await supertest(app).get("/recommendations/").send()
        const idRecommendation = getRecommendations.body[0].id

        const recommendation = await supertest(app).get(`/recommendations/${idRecommendation}`).send()

        expect(recommendation.status).toBe(200)
        expect(recommendation.body.id).toBe(idRecommendation)
    })
    it("Deve retornar status 404 caso não encontre uma recomendação", async () => {
        const recommendation = await supertest(app).get("/recommendations/999999999999999999").send()

        expect(recommendation.status).toBe(404)
    })
})

describe("Testa retorno de uma recomendação aleatória", () => {
    it("Deve retonar uma música com a pontuação maior que 10", async () => {
        const createRecommendation = 50
        const visitsRoute = 50
        const idRecommendation1 = 1
        const random = "random_big_10"

        await recommendationsFactory.createManyRecommendations(createRecommendation)

        await recommendationsFactory.addScoreRecommendation(idRecommendation1, 15)

        const listRecommendations = await recommendationsFactory.visitRouterRandom(visitsRoute, random)

        expect(listRecommendations[0]).toHaveProperty("id");
        expect(listRecommendations[0]).toHaveProperty("name");
        expect(listRecommendations[0]).toHaveProperty("youtubeLink");
        expect(listRecommendations[0]).toHaveProperty("score");
        expect(listRecommendations[0].score).toBe(15);
    })

    it("Deve retonar uma música com a pontuação entre -5 e 10", async () => {
        const createRecommendation = 50
        const visitsRoute = 50
        const idRecommendation1 = 1
        const random = "random_less_or_equal_10"

        await recommendationsFactory.createManyRecommendations(createRecommendation)

        await recommendationsFactory.addScoreRecommendation(idRecommendation1, 12)

        const returnRecommendations = await recommendationsFactory.visitRouterRandom(visitsRoute, random)

        expect(returnRecommendations[0]).toHaveProperty("id");
        expect(returnRecommendations[0]).toHaveProperty("name");
        expect(returnRecommendations[0]).toHaveProperty("youtubeLink");
        expect(returnRecommendations[0]).toHaveProperty("score");
        expect(returnRecommendations[0].score).toBe(0);
    })

    it("Deve retonar uma música aleatória com a pontuação maior que 10,caso só exista recomendações com pontuações maiores que 10", async () => {
        const createRecommendation = 5
        const visitsRoute = 5
        const idRecommendation1 = 1
        const idRecommendation2 = 2
        const idRecommendation3 = 3
        const idRecommendation4 = 4
        const idRecommendation5 = 5

        const random = "random_big_10"

        await recommendationsFactory.createManyRecommendations(createRecommendation)

        await recommendationsFactory.addScoreRecommendation(idRecommendation1, 12)
        await recommendationsFactory.addScoreRecommendation(idRecommendation2, 12)
        await recommendationsFactory.addScoreRecommendation(idRecommendation3, 12)
        await recommendationsFactory.addScoreRecommendation(idRecommendation4, 12)
        await recommendationsFactory.addScoreRecommendation(idRecommendation5, 12)

        const returnRecommendations = await recommendationsFactory.visitRouterRandom(visitsRoute, random)

        // VAI SORTEAR UMA MÚSICA ALEATORIA
        const recommendationRandom = returnRecommendations[Math.floor(Math.random() * returnRecommendations.length)]
        const score = recommendationRandom.score

        expect(recommendationRandom.score > 10).toBe(score > 10)
        expect(returnRecommendations.length).toBe(5);
        expect(returnRecommendations[0]).toHaveProperty("id");
        expect(returnRecommendations[0]).toHaveProperty("name");
        expect(returnRecommendations[0]).toHaveProperty("youtubeLink");
        expect(returnRecommendations[0]).toHaveProperty("score");
    })

    it("Deve retonar uma música aleatória com a pontuação menor ou igual a 10,caso só exista recomendações com pontuações menores ou igual a 10", async () => {
        const createRecommendation = 5
        const visitsRoute = 5
        const idRecommendation1 = 1
        const idRecommendation2 = 2
        const idRecommendation3 = 3
        const idRecommendation4 = 4
        const idRecommendation5 = 5

        const random = "random_less_or_equal_10"

        await recommendationsFactory.createManyRecommendations(createRecommendation)

        await recommendationsFactory.addScoreRecommendation(idRecommendation1, 5)
        await recommendationsFactory.addScoreRecommendation(idRecommendation2, 4)
        await recommendationsFactory.addScoreRecommendation(idRecommendation3, 3)
        await recommendationsFactory.addScoreRecommendation(idRecommendation4, 1)
        await recommendationsFactory.addScoreRecommendation(idRecommendation5, 9)

        const returnRecommendations = await recommendationsFactory.visitRouterRandom(visitsRoute, random)

        // VAI SORTEAR UMA MÚSICA ALEATORIA
        const recommendationRandom = returnRecommendations[Math.floor(Math.random() * returnRecommendations.length)]
        const score = recommendationRandom.score

        expect(recommendationRandom.score <= 10).toBe(score <= 10)
        expect(returnRecommendations.length).toBe(5);
        expect(returnRecommendations[0]).toHaveProperty("id");
        expect(returnRecommendations[0]).toHaveProperty("name");
        expect(returnRecommendations[0]).toHaveProperty("youtubeLink");
        expect(returnRecommendations[0]).toHaveProperty("score");
    })

    it("Deve rotonar status 404 caso não exista nenhuma recomendação cadastrada", async () => {
        const recommendations = await supertest(app).get("/recommendations/random").send()

        expect(recommendations.status).toBe(404)
        expect(recommendations.body.id).toBeUndefined()
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})