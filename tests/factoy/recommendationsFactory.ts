import { faker } from "@faker-js/faker"

export async function bodyRecommendation() {
    return {
        name: faker.name.fullName(),
        youtubeLink: "https://youtu.be/TMr_83laADw"
    }
}