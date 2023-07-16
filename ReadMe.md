# Turf Intersection API

The Turf Intersection API is a Node.js API that allows you to find intersecting lines with a given linestring using the Turf.js library. It provides a simple and efficient way to perform intersection calculations between a linestring and a set of predefined lines.

## Features

- **Line Intersection**: The API can identify which lines intersect with the provided linestring.
- **Intersection Details**: For each intersecting line, the API returns the line ID and the coordinates of the intersection points.
- **Authentication**: The API implements authentication using a Bearer token to secure the endpoint.

## API Endpoint

### `POST /intersect`

- Authenticates the request using a Bearer token.
- Expects a GeoJSON LineString object in the request body.
- Finds the intersecting lines with the provided linestring.
- Returns an array of intersecting line IDs along with the coordinates of the intersections.

## Usage

1. Obtain a valid Bearer token for authentication. (For simplicity I have used 1234)
2. Send a POST request to `/intersect` with the following:

   - Set the `Authorization` header to `Bearer 1234`.
   - Set the `Content-Type` header to `application/json`.
   - Include the linestring in the request body as a GeoJSON LineString object.

3. The API will respond with an array of intersecting spread lines with the line IDs and their corresponding intersection coordinates.

## Example Request

http
POST /intersect
Content-Type: application/json
Authorization: Bearer 1234

{
  "type": "LineString",
  "coordinates": [
    [longitude, latitude],
    ...
  ]
}


## Example Request

HTTP 200 OK
Content-Type: application/json

[
  {
    "id": "L01",
    "intersection": [
      [longitude, latitude],
    ]
  },
  ...
]


## How to use in PostMan

- Go to Authorizatin Tab in PostMan, select type of token as Bearer, set token as "1234".
- Add LineString in Body as raw as JSON.
- Send post request to /intersect.
- 