import { Request, Response } from "express";
import * as testRecommendationService from "../services/testRecommendationService";

export async function resetDb(_: Request, res: Response) {
    await testRecommendationService.reset()
    res.sendStatus(200)
}

export async function populateRecommendations(_: Request, res: Response) {

    await testRecommendationService.createManyRecomendations()

    res.sendStatus(200);
}