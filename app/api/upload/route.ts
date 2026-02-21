import DataAPI from "@/data/data-api";
import { ClientError } from "@/lib/error-codes";
import { DataModelMap } from "@/model/server/data-model-mappings";
import ObjectUtil from "@/util/ObjectUtil";
import R2API from "@/util/server/file/S3Util";
import { tDataModels } from "@/util/util-type";
import { NextRequest, NextResponse } from "next/server";

interface UploadRequest {
  files: { key: string; type: string }[];
  path: string;
}

export async function POST(request: NextRequest) {
  try {
    const requestJson = await request.json();
    const { id, modelName, uploadRequest } = requestJson;
    const uploadUrls = await handleRequest(modelName, id, uploadRequest);
    return NextResponse.json({ message: "success", uploadUrls }, { status: 200 });
  } catch (e) {
    if (e instanceof ClientError) {
      return NextResponse.json({ ...e.toJSon() }, { status: e.clientCode });
    }
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

async function handleRequest(
  modelName: tDataModels,
  id: string,
  request: UploadRequest | UploadRequest[],
): Promise<{ key: string; url: string }[]> {
  const uploadRequests = Array.isArray(request) ? request : [request];

  const allPathsAllowed =
    DataModelMap[modelName].fileObjects &&
    uploadRequests.reduce<boolean>(
      (pre, curr) =>
        pre &&
        DataModelMap[modelName].fileObjects!.reduce(
          (pre, { path }) => pre || path === curr.path,
          false,
        ),
      true,
    );
  if (allPathsAllowed == true) {
    const data = await DataAPI.getData({
      modelName,
      operation: "GET_DATA_BY_ID_RAW",
      request: {
        id,
        options: {
          select: DataModelMap[modelName].fileObjects!.map(({ path }) => path),
        },
      },
    });
    const isallValidKeys = uploadRequests.reduce((pre, curr) => {
      const value = ObjectUtil.getValue({ obj: data, path: curr.path });
      const values = Array.isArray(value) ? value : [value];
      return (
        pre && curr.files.reduce((pre, currFile) => pre && values.includes(currFile.key), true)
      );
    }, true);
    if (isallValidKeys) {
      // ensure none of the keys already exist
      for (const { files } of uploadRequests) {
        for (const { key } of files) {
          if (await R2API.isFileExists(key)) {
            throw new ClientError("INVALID_UPLOAD_REQUEST", 401, "invalid file upload operation");
          }
        }
      }
      // build upload URL promises and await them
      const uploadPromises = uploadRequests.flatMap(({ files }) =>
        files.map(({ key, type }) =>
          R2API.getUploadUrl(key, type).then((urlResult) => ({
            key,
            url:
              typeof urlResult === "string"
                ? urlResult
                : (urlResult.uploadUrl ?? String(urlResult)),
          })),
        ),
      );
      const uploadUrls: { key: string; url: string }[] = await Promise.all(uploadPromises);
      return uploadUrls;
    }
  }
  throw new ClientError("INVALID_UPLOAD_REQUEST", 401, "invalid file upload operation");
}
