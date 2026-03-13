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

export const PredefinedErrors = {
  Invalid_File_Upload: new ClientError("Invalid File Upload", 11000, "Invalid File Upload"),
  File_Upload_Failed: new ClientError("File Upload Failed", 11001, "File Upload Failed"),
  File_Not_Found: new ClientError("File Not Found", 11002, "File Not Found"),
  File_Delete_Failed: new ClientError("File Delete Failed", 11003, "File Delete Failed"),
  File_Upload_Invalid: new ClientError("File Upload Invalid", 11004, "File Upload Invalid"),
  File_Upload_Invalid_Type: new ClientError("File Upload Invalid Type", 11005, "File Upload Invalid Type"),
  File_Upload_Invalid_Size: new ClientError("File Upload Invalid Size", 11006, "File Upload Invalid Size"),

  //client req
  Invalid_Req: new ClientError("Invalid Request", 11007, "Invalid Request"),
  Invalid_Req_Data: new ClientError("Invalid Request Data", 11008, "Invalid Request Data"),
  Invalid_Req_Params: new ClientError("Invalid Request Params", 11009, "Invalid Request Params"),
  Invalid_Req_Query: new ClientError("Invalid Request Query", 11010, "Invalid Request Query"),
  Invalid_Req_Body: new ClientError("Invalid Request Body", 11011, "Invalid Request Body"),

  //server req
  Invalid_Req_Method: new ClientError("Invalid Request Method", 11012, "Invalid Request Method"),
  Invalid_Req_URL: new ClientError("Invalid Request URL", 11013, "Invalid Request URL"),
  Invalid_Req_Header: new ClientError("Invalid Request Header", 11014, "Invalid Request Header"),

  //server internal
  Server_Internal_Error: new ClientError("Server Internal Error", 11015, "Server Internal Error"),
  Server_Unknown_Error: new ClientError("Server Unknown Error", 11016, "Server Unknown Error"),
}
