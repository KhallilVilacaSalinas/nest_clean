import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AccountsController } from './Controllers/accounts.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './Controllers/authenticate.controller'
import { CreateQuestionController } from './Controllers/create-question.controller'
import { FechRecentQuestionsController } from './Controllers/fetch-recent-questions.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule,
  ],
  controllers: [
    AccountsController,
    AuthenticateController,
    CreateQuestionController,
    FechRecentQuestionsController
  ],
  providers: [PrismaService],
})
export class AppModule { }
