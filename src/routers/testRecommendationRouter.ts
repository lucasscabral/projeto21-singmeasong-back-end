import { Router } from "express";
import * as testRecommendationController from "../controllers/testRecommendationController"

const testRecommendationRouter = Router()

testRecommendationRouter.post("/e2e/reset", testRecommendationController.resetDb)
testRecommendationRouter.post("/e2e/seed", testRecommendationController.populateRecommendations);

export default testRecommendationRouter