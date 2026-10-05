# Interactive Map: Interviewer Overview

## 30-second explanation

The map helps people discover accessible places to rest around a city. It is built with React and Leaflet, and uses OpenStreetMap tiles, so it does not need a Google Maps API key. Each place is plotted from its latitude and longitude and shown with a marker colored by its accessibility score. Selecting a marker focuses the map and shows the place's details, accessibility information, and a link to its detail page.

## The user problem

Space records are easier to understand when they are connected to real geography. A list can describe a place's address and accessibility, but a map lets people see where places are, compare nearby options, and choose one to inspect.

## How the map works

1. **Data source:** `MapView` reads spaces from the shared application context. The context loads the spaces through the backend API; bundled sample data is available as a fallback if the API is unavailable.
2. **Coordinates:** Each mapped space needs numeric `lat` and `lng` values. Records without valid coordinates are omitted from the map.
3. **Map and tiles:** React Leaflet renders an interactive Leaflet map. Its `TileLayer` displays map tiles from OpenStreetMap, with the required contributor attribution visible.
4. **Markers:** Each space is placed at its stored coordinates. The marker shows the accessibility score and uses a color scale:
   - Green: 85 or above
   - Amber: 65–84
   - Red: below 65
5. **Selection:** Clicking a marker or an item in the mapped-spaces list selects that space. The map moves to it, and the side panel shows its image, address, scores, features, and a link to the full details.
6. **Score overlay:** The optional overlay draws a translucent circle with an approximate 350-metre radius around each space, colored using the same score scale.
7. **Nearby line:** The optional line connects the selected space (or the first mapped space if none is selected) to its closest other space by straight-line distance. The distance shown uses the Haversine formula.
8. **Reset:** Reset clears the current selection and fits the map to the available spaces again.

## Why Leaflet and OpenStreetMap?

- **No Google Maps API key** is needed for this implementation.
- **Leaflet** provides an interactive map with zoom, pan, markers, circles, popups, and lines.
- **OpenStreetMap** provides the map data displayed by the tile layer.
- The choice keeps a prototype simple while allowing the tile source to be changed independently if deployment requirements change.

OpenStreetMap's public tile servers have a usage policy and are not unlimited or guaranteed production infrastructure. A higher-traffic deployment should select a tile provider or host tiles that meet its usage, reliability, and licensing requirements. See the [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

## Current scope and limitations

- The sample space coordinates are demo data; they should be checked and replaced with accurate, verified locations before real-world use.
- The score circles are approximate visual indicators around locations. They are **not** a statistical heatmap, live crowd data, or proof that the surrounding area has a particular accessibility level.
- The nearby line is a straight-line comparison, not a road route, walking distance, or turn-by-turn navigation.
- The map does not currently geocode addresses, obtain the user's current location, calculate routes, or retrieve live place data.
- Map tiles require an internet connection.

Being explicit about these limits matters: an attractive map should not imply location precision, live measurements, or navigation capabilities that the application does not provide.

## Interview talking points

### Design decisions

- **Use coordinates already associated with each space:** this keeps the mapping feature connected to the same records used by the explorer and detail views.
- **Use score-based colors:** a consistent green/amber/red legend makes relative accessibility scores scannable.
- **Keep place details beside the map:** users can compare locations without losing the map context.
- **Keep the map provider separate from the application data:** Leaflet renders the map while the backend remains the source for spaces and reviews.

### Trade-offs

- OpenStreetMap avoids requiring a Google API key for this use case, but public tile-server use has a policy and capacity limits.
- Stored coordinates make marker rendering straightforward, but inaccurate input coordinates will still produce inaccurate markers.
- The fixed-radius score overlay communicates approximate proximity, but does not account for roads, barriers, or real service coverage.
- The nearest-place line is inexpensive and easy to explain, but cannot replace a routing engine.

### Possible next steps

1. Validate coordinates when spaces are created or edited.
2. Add an accessible list-based alternative and keyboard-friendly map interactions.
3. Use a production-appropriate OpenStreetMap tile provider or self-hosted tiles if usage requires it.
4. Add a routing provider if walking directions are a product requirement.
5. Add real, timestamped accessibility observations before presenting map overlays as measured area-level insights.

## Quick project references

- Map UI and behavior: [`src/pages/MapView.jsx`](./src/pages/MapView.jsx)
- Map-specific styles: [`src/pages/MapView.css`](./src/pages/MapView.css)
- Sample spaces and coordinates: [`src/data/restSpaces.js`](./src/data/restSpaces.js)
- Shared API-loaded spaces and sample fallback: [`src/context/AppContext.jsx`](./src/context/AppContext.jsx)
- React Leaflet and Leaflet dependencies: [`package.json`](./package.json)
