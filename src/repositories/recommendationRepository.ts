import { Prisma } from "@prisma/client";
import { prisma } from "../database";
import { CreateRecommendationData } from "../services/recommendationsService";

async function create(createRecommendationData: CreateRecommendationData) {
  await prisma.recommendation.create({
    data: createRecommendationData,
  });
}

interface FindAllWhere {
  score: number;
  scoreFilter: "lte" | "gt";
}

async function findAll(findAllWhere?: FindAllWhere) {
  const filter = getFindAllFilter(findAllWhere);

  return await prisma.recommendation.findMany({
    where: filter,
    orderBy: { id: "desc" },
    take: 10
  });
}

async function getAmountByScore(take: number) {
  return await prisma.recommendation.findMany({
    orderBy: { score: "desc" },
    take,
  });
}

function getFindAllFilter(findAllWhere?: FindAllWhere): Prisma.RecommendationWhereInput {
  if (!findAllWhere) return {};

  const { score, scoreFilter } = findAllWhere;

  return {
    score: { [scoreFilter]: score },
  };
}

async function find(id: number) {
  return await prisma.recommendation.findUnique({
    where: { id },
  });
}

async function findByName(name: string) {
  return await prisma.recommendation.findUnique({
    where: { name },
  });
}

async function updateScore(id: number, operation: "increment" | "decrement") {
  return await prisma.recommendation.update({
    where: { id },
    data: {
      score: { [operation]: 1 },
    },
  });
}

async function remove(id: number) {
  await prisma.recommendation.delete({
    where: { id },
  });
}

export const recommendationRepository = {
  create,
  findAll,
  find,
  findByName,
  updateScore,
  getAmountByScore,
  remove,
};
