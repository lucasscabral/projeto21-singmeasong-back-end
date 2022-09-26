import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import recommendationFactory from '../unit/factory/recommendationFactory';

describe('Testes unitário para a função de criação de uma recomendações', () => {
    it('Deve criar uma recomendação', async () => {
        const recommendation = await recommendationFactory();

        jest
            .spyOn(recommendationRepository, 'findByName')
            .mockImplementationOnce((): any => { });

        jest
            .spyOn(recommendationRepository, 'create')
            .mockImplementationOnce((): any => { });

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it('Não deve criar uma recomendação duplicada', async () => {
        const recomendation = await recommendationFactory();

        jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce({
            id: 1,
            name: '',
            youtubeLink: '',
            score: 0,
        });

        const promise = recommendationService.insert(recomendation);

        expect(promise).rejects.toEqual({
            type: 'conflict',
            message: 'Recommendations names must be unique',
        });
    });
});

describe('Testes unitário para a função de upvote do serviço de recomendação', () => {
    it('Deve pontuar uma recomendação', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce({
            id: 1,
            name: '',
            youtubeLink: '',
            score: 0,
        });

        jest
            .spyOn(recommendationRepository, 'updateScore')
            .mockImplementationOnce((): any => { });

        await recommendationService.upvote(1);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it('Não deve votar a favor de uma recomendação que não existe', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

        const promise = recommendationService.upvote(1);

        expect(promise).rejects.toEqual({ type: 'not_found', message: '' });
    });
});

describe('Testes unitário para a função de downvote do serviço de recomendação', () => {
    it('Deve da um voto negativo em uma recomendação', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce({
            id: 1,
            name: '',
            youtubeLink: '',
            score: 0,
        });

        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce({
            id: 1,
            name: '',
            youtubeLink: '',
            score: -1,
        });

        jest.spyOn(recommendationRepository, 'remove');

        await recommendationService.downvote(1);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).not.toBeCalled();
    });

    it('Não deve da um voto negativo em uma recomendação que não existe', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

        const promise = recommendationService.downvote(1);

        expect(promise).rejects.toEqual({ type: 'not_found', message: '' });
    });

    it('Deve excluir uma recomendação que tenha uma pontuação inferior a -5 após ter sido rejeitada', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce({
            id: 1,
            name: '',
            youtubeLink: '',
            score: -5,
        });

        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce({
            id: 1,
            name: '',
            youtubeLink: '',
            score: -6,
        });

        jest
            .spyOn(recommendationRepository, 'remove')
            .mockImplementationOnce((): any => { });

        await recommendationService.downvote(1);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    });
});

describe('Testes unitário para a função get do serviço de recomendação', () => {
    it('Deve obter todas as recomendações', async () => {
        jest
            .spyOn(recommendationRepository, 'findAll')
            .mockImplementationOnce((): any => { });

        await recommendationService.get();

        expect(recommendationRepository.findAll).toBeCalled();
    });
});

describe('Testes unitário para a função getTop do serviço de recomendação', () => {
    it('Deve obter as principais recomendações', async () => {
        jest
            .spyOn(recommendationRepository, 'getAmountByScore')
            .mockImplementationOnce((): any => { });

        await recommendationService.getTop(10);

        expect(recommendationRepository.getAmountByScore).toBeCalled();
    });
});

describe('Testes unitário para a função getRandom do serviço de recomendação', () => {
    it('Deve receber recomendações aleatórias', async () => {
        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([
            {
                id: 1,
                name: '',
                youtubeLink: '',
                score: 0,
            },
        ]);

        await recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalled();
    });

    it('Deve retornar não encontrado caso nenhuma recomendação for encontrada', async () => {
        jest
            .spyOn(recommendationRepository, 'findAll')
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);

        const promise = recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalled();
        expect(promise).rejects.toEqual({ type: 'not_found', message: '' });
    });

    it('Deve retornar uma recomendação com pontuação maior que 10', async () => {
        jest.spyOn(Math, 'random').mockImplementationOnce((): number => {
            return 0.5;
        });

        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([
            {
                id: 1,
                name: '',
                youtubeLink: '',
                score: 12,
            },
        ]);

        await recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalled();
    });

    it('Deve retornar uma recomendação com pontuação entre -5 e 10', async () => {
        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([
            {
                id: 1,
                name: '',
                youtubeLink: '',
                score: 7,
            },
        ]);

        jest.spyOn(Math, 'random').mockImplementationOnce((): number => {
            return 0.8;
        });

        await recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalled();
    });
});