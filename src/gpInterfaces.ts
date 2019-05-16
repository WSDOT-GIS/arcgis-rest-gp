import { IParams, IRequestOptions } from "@esri/arcgis-rest-request";
import { IExtent, ISpatialReference } from "@esri/arcgis-rest-types";

export type GPExecutionType =
  | "esriExecutionTypeSynchronous"
  | "esriExecutionTypeAsynchronous";

export type GPParameterDirection =
  | "esriGPParameterDirectionInput"
  | "esriGPParameterDirectionOutput";

export type GPParameterType =
  | "esriGPParameterTypeRequired"
  | "esriGPParameterTypeOptional";

export type GPJobStatus =
  | "esriJobSubmitted"
  | "esriJobWaiting"
  | "esriJobExecuting"
  | "esriJobSucceeded"
  | "esriJobFailed"
  | "esriJobTimedOut"
  | "esriJobCancelling"
  | "esriJobCancelled";

export type GPJobMessageType =
  | "esriJobMessageTypeInformative"
  | "esriJobMessageTypeWarning"
  | "esriJobMessageTypeError";

export interface IGPServiceInfo {
  currentVersion: number;
  serviceDescription: string;
  /**
   * List of services
   */
  tasks: string[];
  executionType: GPExecutionType;
  /**
   * Can be an empty string if not applicable
   */
  resultMapServerName?: string;
  /**
   * Added at 10.1
   */
  maximumRecords?: number;
}

export interface IGPParameter {
  name: string;
  dataType: string; // "<dataType1>";
  displayName: string;
  description?: string; // Added at 10.1 SP1
  direction: GPParameterDirection;
  defaultValue: any;
  parameterType: GPParameterType;
  category: string;
  choiceList: string[];
}

export interface IGPTask {
  name: string;
  displayName: string;
  description?: string; // Added at 10.1 SP1
  category: string;
  helpUrl: string;
  executionType: GPExecutionType;
  parameters: IGPParameter[];
}

export interface IGPContext {
  outSR?: number | ISpatialReference;
  processSR?: number | ISpatialReference;
  extent?: IExtent;
}

export interface IGPExecuteOptions extends IRequestOptions {
  taskUrl: string;
  params: IGPExecuteParameters;
}

export interface IGPExecuteParameters extends IParams {
  /**
   * Description: The various input parameters accepted by the corresponding GP task. These parameters are
   * listed in the parameters property of the JSON representation associated with the GP task resource.
   *
   * The valid values for the input parameters are dependent on the data type of the parameter.
   * These values are discussed in more detail in Submit GP Job.
   */
  [gpParameter: string]: any;
  /**
   * @deprecated at 10.6.1. Use context parameter instead.
   */
  "env:outSR"?: number | ISpatialReference;
  /**
   * @deprecated at 10.6.1. Use context parameter instead.
   */
  "env:processSR"?: number | ISpatialReference;
  returnZ?: boolean;
  returnM?: boolean;
  returnTrueCurves?: boolean;
  returnFeatureCollection?: boolean;
}

export interface IGPJobParams extends IParams {
  // f: "html" | "json" | "kmz";
  returnMessages: boolean;
}

export interface IGPJobOptions extends IRequestOptions {
  taskUrl: string;
  jobId: string;
  params: IGPJobParams;
}

export interface IGPMessage {
  type: GPJobMessageType;
  description: string;
}

export interface IGPBasicJobInfo {
  /**
   * Job ID string consisting of letters and digits.
   */
  jobId: string;
  jobStatus: GPJobStatus;
}

export interface IGPJob extends IGPBasicJobInfo {
  results: IGPResult[];
  messages: IGPMessage[];
}

export interface IGPResult {
  paramName: string;
  dataType: string;
  value: any;
}

export interface IGPResponse {
  results: IGPResult[];
  messages: IGPMessage[];
}
