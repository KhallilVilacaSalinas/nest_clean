import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answers-comments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

@Module({
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository,
        },
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentsRepository,
        PrismaQuestionsRepository,
        PrismaAnswersRepository,
        PrismaAnswerCommentsRepository,
        PrismaQuestionAttachmentsRepository
    ],
    exports: [
        PrismaService,
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentsRepository,
        QuestionsRepository,
        PrismaAnswersRepository,
        PrismaAnswerCommentsRepository,
        PrismaQuestionAttachmentsRepository
    ],
})
export class DatabaseModule {}