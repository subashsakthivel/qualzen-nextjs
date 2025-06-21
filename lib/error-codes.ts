export const ERROR_MESSAGES = {
  1000: "VALIDATION_ERROR",
};

class ValidationError extends Error {
  code: number;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.code = 1000;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
