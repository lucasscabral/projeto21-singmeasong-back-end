import * as testRecommendationResporitory from "../repositories/testRecommendationRepository"

import { Recommendation } from "@prisma/client";

export type CreateRecommendationData = Omit<Recommendation, 'id' | 'score'>;

export async function reset() {
    await testRecommendationResporitory.reset()
}

export async function createManyRecomendations() {
    await testRecommendationResporitory.createManyRecomendations()
}