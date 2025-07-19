import dbConnect from "@/lib/mongoose";
import { DataModelService } from "./db-core";

export class DataUtil {
  private constructor() {}

  static async persistOnDB<K extends keyof DataModelService>(
    userId: string,
    operation: K,
    ...args: Parameters<(typeof DataModelService)[K]>
  ): Promise<ReturnType<(typeof DataModelService)[K]>> {
    try {
      await dbConnect();
      const method = DataModelService[operation] as (...args: any[]) => Promise<any>;
      return await method(...args);
    } catch (err) {
      console.error("Error connecting to the database:", userId, this.arguments, err);
      throw new Error("Database operation failed");
    }

    return {} as any;
  }

  public static async fetchFromDB<K extends StaticFunctionKeys<typeof DataModelService>>(
    userId: string | undefined,
    operation: K,
    ...args: Parameters<(typeof DataModelService)[K]>
  ): Promise<ReturnType<(typeof DataModelService)[K]>> {
    try {
      await dbConnect();
      const method = DataModelService[operation] as (...args: any[]) => Promise<any>;
      return await method(...args);
    } catch (err) {
      console.error("Error connecting to the database:", err);
      throw new Error("Database operation failed");
    }
    return {} as any;
  }
}

export async function fetchFromDB<K extends StaticFunctionKeys<typeof DataUtil>>(
  userId: string | undefined,
  operation: K,
  ...args: Parameters<(typeof DataUtil)[K]>
): Promise<ReturnType<(typeof DataUtil)[K]>> {
  try {
    await dbConnect();
    const method = DataUtil[operation] as (...args: any[]) => Promise<any>;
    return await method(...args);
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw new Error("Database operation failed");
  }
  return {} as any;
}

type StaticFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
