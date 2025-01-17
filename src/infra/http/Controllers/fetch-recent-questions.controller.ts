import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { z } from "zod";

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
        private readonly prisma: PrismaService
    ) {}

    @Get()
    async fetchRecentQuestions(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload
    ) {
        const perPage = 1;

        return this.prisma.question.findMany({
            where: {
                authorId: user.sub,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: perPage,
            skip: (page - 1) * perPage,
        });
    }
}