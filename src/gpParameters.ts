/**
 *
 * @see https://developers.arcgis.com/rest/services-reference/submit-gp-job.htm
 */

import type {
  GeometryType,
  IField,
  IGeometry,
  IHasZM,
  ISpatialReference,
} from "@esri/arcgis-rest-request";

export type GPParameterTypeSingle =
  | "GPBoolean"
  | "GPDouble"
  | "GPLong"
  | "GPString"
  | "GPLinearUnit"
  | "GPFeatureRecordSetLayer"
  | "GPRecordSetLayer"
  | "GPDate"
  | "GPDataFile"
  | "GPRasterData"
  | "GPRasterDataLayer"
  | "Field";

export type GPParameterType =
  | GPParameterTypeSingle
  | `GPMultiValue:${GPParameterTypeSingle}`;

export interface IGPLinearUnit {
  distance: number;
  units: string; // TODO: create units type
}

export type Attributes = Record<string, unknown>;

export interface IFeature<A extends Attributes> {
  attributes: A
}

export interface IGeoFeature<A extends Attributes> extends IFeature<A> {
  geometry: IGeometry;
}

export interface IGPRecordSetLayer<A extends Attributes> {
  fields: IField[];
  features: IFeature<A>[];
}

export interface IGPFeatureRecordSetLayer<A extends Attributes> extends IGPRecordSetLayer<A>, IHasZM {
  geometryType: GeometryType;
  spatialReference: ISpatialReference;
  features: IGeoFeature<A>[];
}
