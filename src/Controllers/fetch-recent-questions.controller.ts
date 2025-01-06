import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/questions/recent')
@UseGuards(JwtAuthGuard)
export class FechRecentQuestionsController {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    @Get()
    async fetchRecentQuestions(
        @CurrentUser() user: UserPayload
    ) {
        return this.prisma.question.findMany({
            where: {
                authorId: user.sub,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
        });
    }
}