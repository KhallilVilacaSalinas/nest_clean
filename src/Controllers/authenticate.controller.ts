import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";

const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type AuthenticateUserSchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async create(@Body() body: AuthenticateUserSchema) {
        const { email, password } = authenticateBodySchema.parse(body);

        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User credenciais are invalid');
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('User credenciais are invalid');
        }

        const token = this.jwt.sign({ sub: user.id });
                
        return { 
            access_token: token,
         };
    }
}
