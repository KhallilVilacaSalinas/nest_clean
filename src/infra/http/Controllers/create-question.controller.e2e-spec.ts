import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Create question (E2E)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports:[AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);

        await app.init();
    });

    test('[POST] /questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'johndoe1@gmail.com',
                password: await hash('123456', 8),
            }
        });

        const accessToken = jwt.sign({ sub: user.id });

        let title = 'Queimadas amazonia';
        const response = await request(app.getHttpServer())
        .post('/questions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            title: title,
            content: 'Como proteger a floresta amazonica das queimadas?',
        })
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(String)
        }));

        const userDatabase = await prisma.question.findUnique({
            where: {
                slug: title.toLowerCase().replace(/ /g, '-'),
            }
        });

        expect(userDatabase).toBeTruthy();
    });
});