import { Module } from "@nestjs/common";
import { AccountsController } from "./Controllers/accounts.controller";
import { AuthenticateController } from "./Controllers/authenticate.controller";
import { CreateQuestionController } from "./Controllers/create-question.controller";
import { FechRecentQuestionsController } from "./Controllers/fetch-recent-questions.controller";
import { PrismaService } from "../database/prisma/prisma.service";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

@Module({
    imports: [DatabaseModule],
    controllers: [
        AccountsController,
        AuthenticateController,
        CreateQuestionController,
        FechRecentQuestionsController
    ],
    providers: [
        CreateQuestionUseCase
    ]
})
export class HttpModule { }