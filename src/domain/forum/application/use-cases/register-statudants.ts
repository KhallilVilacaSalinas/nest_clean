import { Either, left, right } from "@/core/either"
import { Student } from "../../enterprise/entities/student"
import { Injectable } from "@nestjs/common"
import { HashGenerator } from "../cryptography/hash-generator"
import { StudantsRepository } from "../repositories/studants-repository"
import { StudantAlreadyExistsError } from "./errors/studant-already-exists-error"

interface RegisterStudantUseCaseRequest {
    name: string
    email: string
    password: string
}

type RegisterStudantUseCaseResponse = Either<
    StudantAlreadyExistsError,
    {
        studant: Student
    }
>

@Injectable()
export class RegisterStudants {
    constructor(
        private readonly studantsRepository: StudantsRepository,
        private readonly hashGenerator: HashGenerator
    ) {}

    async register({
        name,
        email,
        password,
    }: RegisterStudantUseCaseRequest): Promise<RegisterStudantUseCaseResponse> {
        const studentAlreadyExists = await this.studantsRepository.findByEmail(email)

        if (studentAlreadyExists) {
            return left(new StudantAlreadyExistsError(email))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        const student = Student.create({
            name,
            email,
            password: hashedPassword
        })

        await this.studantsRepository.create(student)

        return right({
            studant: student
        }) 
    }
}
