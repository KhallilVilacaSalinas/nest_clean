import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FechRecentQuestionsController {
    constructor(
        private readonly fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase
    ) {}

    @Get()
    async fetchRecentQuestions(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload
    ) {
        const result = await this.fetchRecentQuestionsUseCase.execute({
            page
        });

        if (result.isLeft()) {
            throw new Error('Failed to fetch recent questions');
        }

        const questions = result.value.questions;

        return { questions: questions.map(QuestionPresenter.toHTTTP) };
    }
}