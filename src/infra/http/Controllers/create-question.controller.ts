import { Body, ConflictException, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

const createQuestionSchema = z.object({
    title: z.string(),
    content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionSchema);
type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(
        private readonly createQuestion: CreateQuestionUseCase,
    ) {}

    @Post()
    async create(
        @Body(bodyValidationPipe) body: CreateQuestionSchema,
        @CurrentUser() user: UserPayload
    ) {
        const { title, content } = createQuestionSchema.parse(body);

        await this.createQuestion.execute({
            title,
            content,
            authorId: user.sub,
            attachmentsIds: []
        });
    }
}
