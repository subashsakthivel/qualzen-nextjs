import dbConnect from "@/lib/mongoose";
import R2Util from "./file/S3Util";

class ServerUtil {
  static IS_SERVER_INITIALIZED = false;
  static COOLING_PERIOD_MS = 5 * 60 * 1000; // 5 minutes
  static lastInitAttemptTime = 0;
  static async initserver() {
    // Initialization code for server
    try {
      if (
        this.IS_SERVER_INITIALIZED ||
        Date.now() - this.lastInitAttemptTime < this.COOLING_PERIOD_MS
      ) {
        console.log(
          "Skipping server initialization due to cooling period :",
          (Date.now() - this.lastInitAttemptTime) / 1000,
          " seconds"
        );
        return;
      }
      await dbConnect();
      // todo : health check for other services
      this.IS_SERVER_INITIALIZED = true;
      console.log("Server initialized successfully");
    } catch (error) {
      this.IS_SERVER_INITIALIZED = false;
      this.lastInitAttemptTime = Date.now();
      console.error("Error during server initialization:", error);
    }
  }

  static isAnyIssueInServer() {
    this.initserver();
    return !this.IS_SERVER_INITIALIZED;
  }
}

export default ServerUtil;
