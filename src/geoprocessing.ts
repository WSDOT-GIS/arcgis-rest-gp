import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import {
  GPJobStatus,
  IGPBasicJobInfo,
  IGPExecuteOptions,
  IGPJob,
  IGPJobOptions,
  IGPMessage,
  IGPResponse,
  IGPResult,
  IGPServiceInfo,
  IGPTask
} from "./gpInterfaces";
import URLFormatError from "./URLFormatError";

const gpServiceUrlRe = /GPServer\/?$/i;
const gpTaskUrlRe = /GPServer\/([^\/]+)\/?$/i;

function testUrlFormat(url: string, re: RegExp) {
  if (!re.test) {
    throw new URLFormatError(url, re);
  }
}

function createJobUrl(options: IGPJobOptions) {
  return `${options.taskUrl}/jobs/${options.jobId}`;
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

export class GPJob implements IGPJob {
  // tslint:disable: variable-name
  private _jobOptions: IGPJobOptions;
  private _jobId: string;
  private _jobStatus: GPJobStatus;
  private _results: IGPResult[];
  private _messages: IGPMessage[];
  // tslint:enable: variable-name

  public get jobId(): string {
    return this._jobId;
  }

  public get jobStatus(): GPJobStatus {
    return this._jobStatus;
  }

  public get results(): IGPResult[] {
    return this._results;
  }

  public get messages(): IGPMessage[] {
    return this._messages;
  }

  public get jobOptions(): IGPJobOptions {
    return this._jobOptions;
  }

  public get jobUrl(): string {
    return createJobUrl(this.jobOptions);
  }

  /**
   *
   */
  constructor(jobInfo: IGPJob, options: IGPJobOptions) {
    this._jobId = jobInfo.jobId;
    this._jobStatus = jobInfo.jobStatus;
    this._results = jobInfo.results;
    this._messages = jobInfo.messages;
    this._jobOptions = options;
  }

  /**
   * Queries the GP service for the status of the job.
   * Updates the properties of the object with the results.
   */
  public async checkStatus() {
    const jobInfo = await getJob(this._jobOptions);
    // Update properties
    // this._jobId = jobInfo.jobId; // job id won't change
    this._jobStatus = jobInfo.jobStatus;
    this._results = jobInfo.results;
    this._messages = jobInfo.messages;
  }

  /**
   * Cancels the job associated with this object.
   */
  public async cancelJob(): Promise<IGPBasicJobInfo> {
    return await request(`${this.jobUrl}/cancel`);
  }
}

export async function getJob(options: IGPJobOptions): Promise<IGPJob> {
  const url = createJobUrl(options);
  return await request(url, options);
}

/**
 * Submits a job to an asynchronous GP task.
 * @param options
 */
export async function submitJob(options: IGPExecuteOptions) {
  const jobInfo: IGPJob = await request(`${options.taskUrl}/execute`, options);
  const jobOptions: IGPJobOptions = {
    jobId: jobInfo.jobId,
    taskUrl: options.taskUrl,
    params: {
      returnMessages: true
    }
  };
  return new GPJob(jobInfo, jobOptions);
}
