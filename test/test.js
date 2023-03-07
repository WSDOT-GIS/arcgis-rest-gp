import { strict as assert } from "assert";
import { execute } from "../dist/index";

const iltFolder = "https://data.wsdot.wa.gov/arcgis/rest/services/ILT";
const iltGPServiceUrl = `${iltFolder}/ILTGeoprocessors/GPServer`;
const iltGetPointOnStreetGPServiceUrl = `${iltFolder}/GetPointOnStreet/GPServer`;

assert.doesNotReject(async () => {
  const response = await execute({
    taskUrl: `${iltGPServiceUrl}/GetBlockNumber`,
    params: {
      ClickPointX: -13680704.57,
      ClickPointY: 5947457.27,
      PrimaryTrafficway: "17th Ave SE",
      BufferDistance: 50,
    },
  });
  assert(response.results.length >= 1, "must be at least one result");
  const [result] = response.results;
  assert(Array.isArray(result.value), "first result must be an array");
  const blockNoStr = result.value;
  const blockNo = parseInt(blockNoStr, 10);
  const expectedBlockNo = 500;
  assert.strictEqual(blockNo, expectedBlockNo);
});

assert.doesNotReject(async () => {
  const response = await execute({
    taskUrl: `${iltGPServiceUrl}/GetNearestCity`,
    params: {
      PointX: 1027094.11,
      PointY: 604815.69,
    },
  });
  assert.strictEqual(
    response.results.length,
    1,
    `Expected one result. Got ${response.results.length}.`
  );
  /** @type: string[] */
  const [distance, x, y, angle, cityName, cityCode] = response.results[0].value;
  assert.strictEqual(distance, "2850.52891882");
  assert.strictEqual(x, "1027982.41005");
  assert.strictEqual(y, "607524.276162");
  assert.strictEqual(angle, "71.8427302279");
  assert.strictEqual(cityName, "Tumwater");
  assert.strictEqual(cityCode, "1325");
});

assert.doesNotReject(async () => {
  const response = await execute({
    taskUrl: `${iltGPServiceUrl}/GetNearestIntersectionAlongRoad`,
    params: {
      ClickPointX: -13683860.47,
      ClickPointY: 5939740.83,
    },
  });
  assert.strictEqual(response.results.length, 1);
  const [rd1, rd2, x, y, msg] = response.results[0].value;
  assert.strictEqual(rd1, "I-5 S");
  assert.strictEqual(rd2, "Israel Rd SW");
  assert.strictEqual(x, "-13683736.2734998");
  assert.strictEqual(y, "5939717.40622477");
  assert.strictEqual(msg, "NO ERROR");
});

assert.doesNotReject(async () => {
  const response = await execute({
    taskUrl: `${iltGPServiceUrl}/GetNearStreets`,
    params: {
      ClickPointX_WM: -13629339.41,
      ClickPointY_WM: 5966184.32,
      ClickPointX_SP: 1159118.03,
      ClickPointY_SP: 667485.76,
      BufferDistance: 30,
    },
  });
  assert.strictEqual(response.results.length, 2);
  // Each of the two parameter's values is a string containing a JSON array,
  // but with strings delimited with JSON-invalid single quotes instead of double
  // quotes.
  // For each parameter's string value:
  // * Replace single quotes with double quotes.
  // * Parse the string into an array.
  // * Create a Set from the array to remove duplicates.
  let [roadNames, srNames] = response.results
    .map((r) => r.value[0].replace(/'/g, '"'))
    .map(JSON.parse)
    .map((a) => new Set(a));
  const expectedRoadNames = ["121st St S", "WA-7", "Pacific Ave S"];
  const expectedSRs = ["007"];
  expectedRoadNames.forEach((roadName) => {
    assert(
      roadNames.has(roadName),
      `Expected road names did not contain "${roadName}"`
    );
  });
  expectedSRs.forEach((srName) => {
    assert(
      srNames.has(srName),
      `Expected SR names did not contain "${srName}"`
    );
  });
});

assert.doesNotReject(async () => {
  const response = await execute({
    taskUrl: `${iltGPServiceUrl}/GetPointAlongRoad`,
    params: {
      ClickPointX: -13679699.38,
      ClickPointY: 5951163.67,
      GraphicPointX: -13679764.57,
      GraphicPointY: 5951165.57,
      Distance: 100,
    },
  });
  assert.strictEqual(response.results.length, 1);
  let [x, y, road, message] = response.results[0].value.map((value, i) => {
    if (i < 2) {
      return parseFloat(value);
    }
    return value;
  });
  assert.strictEqual(x, 1045532.47762);
  assert.strictEqual(y, 637088.633457);
  assert.strictEqual(road, "Leavenworth Ave NE");
  assert.strictEqual(message, "NO ERROR");
});

assert.doesNotReject(async () => {
  const response = await execute({
    taskUrl: `${iltGetPointOnStreetGPServiceUrl}/GetPointOnStreet`,
    params: {
      ClickPointX_WM: -13680719.69,
      ClickPointY_WM: 5947460.38,
      StreetName: "17th Ave SE",
      BufferDistance: 30,
    },
  });
  // Parse the result coordinates.
  const xy = response.results[0].value.map(parseFloat);
  const expected = [-13680719.6404, 5947460.67748];

  xy.forEach((coord, i) => {
    assert.strictEqual(coord, expected[i]);
  });
});

assert.doesNotReject(async () => {
  const response = await execute({
    taskUrl: `${iltGPServiceUrl}/GetStateRouteLocalRoadIntersection`,
    params: {
      RouteId: "005",
      RoadName: "Israel Rd SW",
    },
  });

  const xy = response.results[0].value.map(parseFloat);
  const expected = [-13683711.5415, 5939713.5623];

  xy.forEach((coord, i) => {
    assert.strictEqual(coord, expected[i]);
  });
});
