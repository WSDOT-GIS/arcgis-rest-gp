import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import {
  IGPExecuteOptions,
  IGPResponse,
  IGPServiceInfo,
  IGPTask
} from "./gpInterfaces";

const gpServiceUrlRe = /GPServer\/?$/i;
const gpTaskUrlRe = /GPServer\/([^\/]+)\/?$/i;

export class URLFormatError extends Error {
  constructor(public url: string, public expectedFormat: RegExp) {
    super("Unexpected URL format");
  }
}

function testUrlFormat(url: string, re: RegExp) {
  if (!re.test) {
    throw new URLFormatError(url, re);
  }
}

/**
 *
 * @param gpServiceUrl
 * @param requestOptions
 * @throws {URLFormatError} Throws if input URL is not in expected format.
 */
export async function getGPServiceInfo(
  gpServiceUrl: string,
  requestOptions: IRequestOptions
): Promise<IGPServiceInfo> {
  testUrlFormat(gpServiceUrl, gpServiceUrlRe);
  return await request(gpServiceUrl, requestOptions);
}

/**
 *
 * @param taskUrl
 * @param requestOptions
 * @throws {URLFormatError} Throws if input URL is not in expected format.
 */
export async function getGPTaskInfo(
  taskUrl: string,
  requestOptions: IRequestOptions
): Promise<IGPTask> {
  testUrlFormat(taskUrl, gpTaskUrlRe);
  return await request(taskUrl, requestOptions);
}

export async function execute(
  options: IGPExecuteOptions
): Promise<IGPResponse> {
  const { taskUrl, params } = options;
  return await request(`${taskUrl}/execute`, {
    params
  });
}
