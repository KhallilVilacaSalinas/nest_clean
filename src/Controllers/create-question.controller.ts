import { Body, ConflictException, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

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
        private readonly prisma: PrismaService,
    ) {}

    @Post()
    async create(
        @Body(bodyValidationPipe) body: CreateQuestionSchema,
        @CurrentUser() user: UserPayload
    ) {
        const { title, content } = createQuestionSchema.parse(body);
        const slug = title.toLowerCase().replace(/ /g, '-');

        const question = await this.prisma.question.findUnique({
            where: {
                slug: slug,
            },
        });

        if (question) {
            throw new ConflictException('Question already exists');
        }

        return this.prisma.question.create({
            data: {
                title: title,
                slug: slug,
                content: content,
                authorId: user.sub,
            },
        });
    }
}
