import { prisma } from "../database"


export async function reset() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`
}