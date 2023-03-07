# Geoprocessing client

For use with [ArcGIS REST JS].

## Install and use

Run this command to install into your NPM project.

```console
npm install @wsdot/arcgis-rest-gp
```

### Importing the module

```javascript
import { execute } from "@wsdot/arcgis-rest-gp";
```

## Example

```javascript
import { execute } from "@wsdot/arcgis-rest-gp";

(async () => {
  const response = await execute({
    // URL and params properties will differ depending on your service.
    taskUrl:
      "https://example.com/ArcGIS/rest/services/MyFolder/MyGP/GPServer/GetBlockNumber",
    params: {
      ClickPointX: -13680704.57,
      ClickPointY: 5947457.27,
      PrimaryTrafficway: "17th Ave SE",
      BufferDistance: 50,
    },
  });
  const { results, messages } = response;
  // Get the values from each result.
  const resultValues = results.map((r) => r.value);
})();
```

[ArcGIS REST JS]: https://esri.github.io/arcgis-rest-js/
