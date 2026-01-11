function getClientStatusCode(code: number) {
  // HTTP code
  switch (code) {
    case 11000: //duplicate entry
      return 439;
    default:
      return 500;
  }
}

export class ClientError extends Error {
  code: number;
  error: string;
  name: string;
  clientCode: number;
  constructor(error: string, code: number, message: string, cause?: ErrorOptions) {
    super(message, cause);
    this.code = code;
    this.error = error;
    this.name = "ClientError";
    this.clientCode = getClientStatusCode(code);
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }

  toJSon() {
    return {
      message: this.message,
      cause: this.cause,
      code: this.code,
      error: this.error,
      status: this.clientCode,
    };
  }
}
