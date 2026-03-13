import { tGet } from "@/types/api-type";
import Persistance from "../../util/server/db-core";
import { tDataModels, TFilter, TUpdate } from "../../util/util-type";
import { tFormConfigMeta } from "@/app/(admin)/table/[model]/modelform";
import { ClientError } from "@/lib/error-codes";
import ObjectUtil from "@/util/ObjectUtil";

//response structure need to types
class DBAPI {
    async getData({ modelName, operation, request }: tGet): Promise<any> {
        try {
            const response = await Persistance.getData({
                modelName,
                operation,
                request,
            } as tGet);
            return response;
        } catch (err) {
            console.error("Error in getData:", err);
        }
    }

    async saveData({
        modelName,
        operation,
        request,
    }: {
        modelName: tDataModels;
        operation: string;
        request: any;
    }): Promise<any> {
        try {

            const response = await Persistance.saveData({ modelName, operation, data: request });
            return response;
        } catch (err: any) {
            if (err.name === "MongoServerError") {
                //duplicate entry
                if (err.code === 11000) {
                    const field = Object.keys(err.keyValue)[0];
                    const value = err.keyValue[field];
                    const error = new ClientError(
                        "DUPLICATE_ENTRY",
                        err.code,
                        `${field} "${value}" already exists`,
                    );
                    throw error;
                }
            }
            console.error("Error in saveData:", err);
            throw new Error("Failed to add data");
        }
    }

    async updateData({
        modelName,
        operation,
        request,
    }: {
        modelName: tDataModels;
        operation: string;
        request: {
            id: string;
            updateQuery: TUpdate<any>;
            queryFilter: TFilter;
        };
    }): Promise<any> {
        try {
            const response = await Persistance.updateData({
                modelName,
                operation,
                id: request.id,
                data: request,
                updateQuery: request.updateQuery,
                queryFilter: request.queryFilter,
            });
            return response;
        } catch (err) {
            console.error("Error in getData:", err);
            throw new Error("Request Failed");
        }
    }

    async deleteData({
        modelName,
        operation,
        request,
    }: {
        modelName: tDataModels;
        operation: string;
        request: any;
    }): Promise<any> {
        try {
            const response = await Persistance.deleteData({
                modelName,
                operation,
                filter: request.filter,
                id: request.id,
            });
            return response;
        } catch (err) {
            console.error("Error in getData:", err);
            throw new Error("Failed to fetch data");
        }
    }

    buildTranformedObject(flat: Record<string, any>, configMeta: tFormConfigMeta) {
        const result: Record<string, any> = {};
        for (const { name, path } of configMeta.fields) {
            if (flat[name]) {
                ObjectUtil.setValue({ obj: result, path, value: ObjectUtil.getValue({ obj: flat, path: name }) });
            }
        }

        return result;
    }
}

const DB_API = new DBAPI();
export default DB_API;
