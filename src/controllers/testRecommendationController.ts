import { Request, Response } from "express";
import * as testRecommendationService from "../services/testRecommendationService";


export async function resetDb(req: Request, res: Response) {
    await testRecommendationService.reset()
    res.sendStatus(200)
}