import { Controller, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/questions')
export class CreateQuestionController {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    @Post()
    async create() {

    }
}
