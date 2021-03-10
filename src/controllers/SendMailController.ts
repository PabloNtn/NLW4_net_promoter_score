import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUserRepository } from "../repositories/SurveyUserRepository";
import { UsersRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveyUserRepository = getCustomRepository(SurveysUserRepository);

        const userAlreadyExists = await usersRepository.findOne({ email });

        if (!userAlreadyExists) {
            return response.status(400).json({
                error: "User does not exists"
            })
        }

        const survey = await surveyRepository.findOne({ id: survey_id })

        if (!survey) {
            return response.status(400).json({
                error: "Survey does not exists"
            })
        }

        //Salvar dados na tabela SurveyUser

        const surveyUser = surveyUserRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        })
        await surveyUserRepository.save(surveyUser);

        //Enviar e-mail para usuario

        await SendMailService.execute(email, survey.titulo, survey.description);

        return response.json(surveyUser)
    }

}

export { SendMailController };