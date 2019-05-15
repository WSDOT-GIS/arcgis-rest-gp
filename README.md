# Geoprocessing client

For use with [ArcGIS REST JS].

## Install and use

Run this command to install into your NPM project.

```
npm install @wsdot/arcgis-rest-gp
```

### Importing the module

### ES6 Modules / TypeScript

```JavaScript
import { execute } from "@wsdot/arcgis-rest-gp";
```

### Node

```JavaScript
const gp = require("@wsdot/arcgis-rest-gp");
```

## For Node only

This package depends on the [Fetch API]. Use a package such as [isomorphic-fetch] to make this API available in Node.

```javascript
require("isomorphic-fetch");
require("isomorphic-form-data");
```

## Example

```JavaScript
import { execute } from "@wsdot/arcgis-rest-gp";

(async () => {
  const response = await execute({
    taskUrl: "https://example.com/ArcGIS/rest/services/MyFolder/MyGP/GPServer/GetBlockNumber",
    params: {
      ClickPointX: -13680704.57,
      ClickPointY: 5947457.27,
      PrimaryTrafficway: "17th Ave SE",
      BufferDistance: 50
    }
  });
  const { results, messages } = response;
  // Get the values from each result.
  const resultValues = results.map(r => r.value);
})();
```

[ArcGIS REST JS]:https://esri.github.io/arcgis-rest-js/
[Fetch API]:https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[isomorphic-fetch]:https://github.com/matthew-andrews/isomorphic-fetch