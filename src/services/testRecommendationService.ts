import * as testRecommendationResporitory from "../repositories/testRecommendationRepository"


export async function reset() {
    await testRecommendationResporitory.reset()
}