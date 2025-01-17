import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";

const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

type CreateUserSchema = z.infer<typeof createUserSchema>;

@Controller('/accounts')
export class AccountsController {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createUserSchema))
    async create(@Body() body: CreateUserSchema) {
        const { name, email, password } = createUserSchema.parse(body);

        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (user) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await hash(password, 8);

        return this.prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });
                
    }
}
