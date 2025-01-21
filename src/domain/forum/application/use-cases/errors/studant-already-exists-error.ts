import { UseCaseError } from "@/core/errors/use-case-error"

export class StudantAlreadyExistsError extends Error implements UseCaseError{
  constructor(indentifier: string) {
    super('Studant already exists')
  }
}
