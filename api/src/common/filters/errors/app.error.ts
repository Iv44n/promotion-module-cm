export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  protected constructor(message: string) {
    super(message);
  }
}
