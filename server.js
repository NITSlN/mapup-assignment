const express = require('express');
const turf = require('@turf/turf');
const bodyParser = require('body-parser');

let spreadLines = require('./lines.json');
const PORT = process.env.PORT || 3000;
const app = express();

// Parse URL-encoded bodies
app.use(bodyParser.json({ limit: '10mb' }));

// Adding Ids to spreadLines
let index = 0;
spreadLines = spreadLines.map((sl) => {
  let id = `L${(index++ + 1).toString().padStart(2, '0')}`;
  return { id, ...sl };
});

// Middleware function for header-based authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication failed. Missing or invalid token.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Bad Request. Token is missing.' });
  }

  // Validate the token here
  if (token !== '1234') {
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }

  // If authentication succeeds, proceed to the next middleware or route handler
  next();
};

app.get('/', (req, res) => {
  res.send(spreadLines)
})
// Route for intersecting the linestring with the lines

app.post('/intersect', authenticate, (req, res) => {
  // Extract the linestring from the request body
  const linestring = req.body;

  // Validate the linestring object
  if (!linestring || linestring.type !== 'LineString' || !linestring.coordinates) {
    return res.status(400).json({
      message: 'Invalid linestring. Please provide a valid GeoJSON LineString.',
    });
  }
  let date = new Date()
  // Filter the spread lines to find the intersecting lines
  const intersectingLines = spreadLines.filter((spreadLine) => {
    const spreadLineString = turf.lineString(spreadLine.line.coordinates);
    return turf.booleanIntersects(spreadLineString, linestring);
  });

  // Prepare the results with intersecting line IDs and intersection coordinates
  const results = intersectingLines.map((intersectingLine) => {
    const spreadLineString = turf.lineString(intersectingLine.line.coordinates);
    const intersection = turf.lineIntersect(spreadLineString, linestring);
    return {
      id: intersectingLine.id,
      intersection: intersection.features.map((feature) => feature.geometry.coordinates),
    };
  });
  console.log(new Date()-date)
  // Return the results as JSON response
  res.json(results);
});

app.listen(PORT, () => {
  console.log('Server listening on port ',PORT);
});
