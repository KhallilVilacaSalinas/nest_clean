import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { StudantsRepository } from "../repositories/studants-repository"
import { HashCompare } from "../cryptography/hash-compare"
import { Encrypter } from "../cryptography/encrypter"
import { WrongCredentialsError } from "./errors/wrong-credential-error"

interface AuthenticateStudantUseCaseRequest {
    email: string
    password: string
}

type AuthenticateStudantUseCaseResponse = Either<
    WrongCredentialsError,
    {
        accessToken: string
    }
>

@Injectable()
export class AuthenticateStudants {
    constructor(
        private readonly studantsRepository: StudantsRepository,
        private readonly hashCompare: HashCompare,
        private readonly encrypter: Encrypter
    ) {}

    async register({
        email,
        password,
    }: AuthenticateStudantUseCaseRequest): Promise<AuthenticateStudantUseCaseResponse> {
        const studant = await this.studantsRepository.findByEmail(email);

        if (!studant) {
            return left(new WrongCredentialsError());
        }

        const isPasswordValid = await this.hashCompare.compare(password, studant.password);

        if (!isPasswordValid) {
            return left(new WrongCredentialsError());
        }

        const accessToken = await this.encrypter.encrypt({ sub: studant.id.toString() });

        return right({
            accessToken
        }) 
    }
}
