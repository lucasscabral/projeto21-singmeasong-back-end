import { CreateRecommendationData } from '../../../src/services/testRecommendationService';
import { faker } from '@faker-js/faker';

async function recommendationFactory() {
    const recommendations: CreateRecommendationData[] = [];

    for (let i = 0; i < 10; i++) {
        const recomendation = {
            name: faker.lorem.words(2),
            youtubeLink: 'https://www.youtube.com/watch?v=QKcNyMBw818'
        }
        recommendations.push(recomendation)
    }

    const randomIndex = Math.floor(Math.random() * recommendations.length);

    return recommendations[randomIndex];
}

export default recommendationFactory;