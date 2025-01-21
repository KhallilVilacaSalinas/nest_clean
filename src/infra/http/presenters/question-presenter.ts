import { Question } from "@/domain/forum/enterprise/entities/question";

export class QuestionPresenter {
  static toHTTTP(question: Question) {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId ? question.bestAnswerId.toString() : null,
      title: question.title,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}