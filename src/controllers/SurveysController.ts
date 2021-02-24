import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';

class SurveysController {

    async create(request: Request, response: Response) {
        const { titulo, description } = request.body;

        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = surveysRepository.create({
            titulo,
            description
        })

        await surveysRepository.save(survey);

        return response.status(201).json(survey)
    }
};


export { SurveysController };