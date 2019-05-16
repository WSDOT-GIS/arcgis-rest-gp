/**
 *
 * @see https://developers.arcgis.com/rest/services-reference/submit-gp-job.htm
 */

import {
  GeometryType,
  IField,
  IGeometry,
  IHasZM,
  ISpatialReference
} from "@esri/arcgis-rest-types";

export type GPParameterType =
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
  | "Field"
  | "GPMultiValue:GPBoolean"
  | "GPMultiValue:GPDouble"
  | "GPMultiValue:GPLong"
  | "GPMultiValue:GPString"
  | "GPMultiValue:GPLinearUnit"
  | "GPMultiValue:GPFeatureRecordSetLayer"
  | "GPMultiValue:GPRecordSetLayer"
  | "GPMultiValue:GPDate"
  | "GPMultiValue:GPDataFile"
  | "GPMultiValue:GPRasterData"
  | "GPMultiValue:GPRasterDataLayer"
  | "GPMultiValue:Field";

export interface IGPLinearUnit {
  distance: number;
  units: string; // TODO: create units type
}

export interface IFeature {
  attributes: {
    [key: string]: any;
  };
}

export interface IGeoFeature extends IFeature {
  geometry: IGeometry;
}

export interface IGPRecordSetLayer {
  fields: IField[];
  features: IFeature[];
}

export interface IGPFeatureRecordSetLayer extends IGPRecordSetLayer, IHasZM {
  geometryType: GeometryType;
  spatialReference: ISpatialReference;
  features: IGeoFeature[];
}
