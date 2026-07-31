import { useEffect, useMemo, useState } from 'react';

const columns = 63;
const rows = 35;

type GlobeNode = {
  lat: number;
  lon: number;
};

const fogNodes: GlobeNode[] = [
  { lat: 39.9, lon: 116.4 },
  { lat: 1.3, lon: 103.8 },
  { lat: 50.1, lon: 8.7 },
  { lat: 37.8, lon: -122.4 },
  { lat: -23.6, lon: -46.6 },
  { lat: -33.9, lon: 151.2 },
  { lat: 35.7, lon: 139.7 },
  { lat: 19.1, lon: 72.9 },
];

const links = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 5],
  [2, 4],
  [1, 6],
  [2, 7],
  [6, 5],
] as const;

const toRadians = (degrees: number) => degrees * Math.PI / 180;

function wrappedLongitudeDistance(longitude: number, center: number) {
  return Math.atan2(Math.sin(longitude - center), Math.cos(longitude - center));
}

function insideLand(longitude: number, latitude: number) {
  const ellipse = (lon: number, lat: number, lonRadius: number, latRadius: number) => {
    const dx = wrappedLongitudeDistance(longitude, toRadians(lon)) / toRadians(lonRadius);
    const dy = (latitude - toRadians(lat)) / toRadians(latRadius);
    return dx * dx + dy * dy < 1;
  };

  return (
    ellipse(-104, 43, 34, 25)
    || ellipse(-83, 16, 18, 20)
    || ellipse(-61, -17, 18, 34)
    || ellipse(17, 7, 20, 34)
    || ellipse(52, 47, 58, 25)
    || ellipse(103, 27, 40, 28)
    || ellipse(137, -25, 17, 13)
    || latitude < toRadians(-72)
  );
}

function projectNode(node: GlobeNode, angle: number) {
  const latitude = toRadians(node.lat);
  const longitude = toRadians(node.lon);
  const objectX = Math.cos(latitude) * Math.sin(longitude);
  const objectY = -Math.sin(latitude);
  const objectZ = Math.cos(latitude) * Math.cos(longitude);
  const cameraX = objectX * Math.cos(angle) - objectZ * Math.sin(angle);
  const cameraZ = objectX * Math.sin(angle) + objectZ * Math.cos(angle);

  return {
    column: Math.round((cameraX + 1) * 0.5 * (columns - 1)),
    row: Math.round((objectY + 1) * 0.5 * (rows - 1)),
    visible: cameraZ > 0.02,
  };
}

function drawDottedLine(grid: string[][], start: ReturnType<typeof projectNode>, end: ReturnType<typeof projectNode>) {
  if (!start.visible || !end.visible) return;
  const steps = Math.max(Math.abs(end.column - start.column), Math.abs(end.row - start.row));
  for (let step = 1; step < steps; step += 2) {
    const progress = step / steps;
    const column = Math.round(start.column + (end.column - start.column) * progress);
    const row = Math.round(start.row + (end.row - start.row) * progress);
    if (row >= 0 && row < rows && column >= 0 && column < columns && grid[row][column] === ' ') {
      grid[row][column] = '.';
    }
  }
}

function renderGlobe(angle: number, activeStage: number) {
  const grid = Array.from({ length: rows }, () => Array.from({ length: columns }, () => ' '));
  const landCharacters = ['=', '+', '*', '#', '@'];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = column / (columns - 1) * 2 - 1;
      const y = row / (rows - 1) * 2 - 1;
      const radiusSquared = x * x + y * y;
      if (radiusSquared > 1) continue;

      const z = Math.sqrt(1 - radiusSquared);
      const objectX = x * Math.cos(angle) + z * Math.sin(angle);
      const objectZ = -x * Math.sin(angle) + z * Math.cos(angle);
      const longitude = Math.atan2(objectX, objectZ);
      const latitude = Math.asin(-y);
      const light = Math.max(0, Math.min(1, 0.24 + z * 0.72 - x * 0.12 - y * 0.08));
      const boundary = radiusSquared > 0.91;
      const gridLine = Math.abs(Math.sin(longitude * 6)) < 0.055 || Math.abs(Math.sin(latitude * 6)) < 0.045;

      if (insideLand(longitude, latitude)) {
        grid[row][column] = landCharacters[Math.min(landCharacters.length - 1, Math.floor(light * landCharacters.length))];
      } else if (boundary) {
        grid[row][column] = ':';
      } else if (gridLine) {
        grid[row][column] = '.';
      }
    }
  }

  const projectedNodes = fogNodes.map((node) => projectNode(node, angle));
  links.forEach(([start, end]) => drawDottedLine(grid, projectedNodes[start], projectedNodes[end]));
  projectedNodes.forEach((node, index) => {
    if (!node.visible || node.row < 0 || node.row >= rows || node.column < 0 || node.column >= columns) return;
    const highlighted = activeStage === 1 || activeStage === 2 || activeStage === 3;
    grid[node.row][node.column] = highlighted && index === activeStage % fogNodes.length ? '@' : '*';
  });

  return grid.map((line) => line.join('')).join('\n');
}

export function AsciiGlobe({ running, activeStage }: { running: boolean; activeStage: number }) {
  const [angle, setAngle] = useState(0.58);

  useEffect(() => {
    if (!running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setAngle((current) => (current + 0.032) % (Math.PI * 2)), 100);
    return () => window.clearInterval(timer);
  }, [running]);

  const frame = useMemo(() => renderGlobe(angle, activeStage), [activeStage, angle]);

  return (
    <div className="ascii-globe" aria-hidden="true">
      <span className="ascii-globe-axis" />
      <pre>{frame}</pre>
      <span className="ascii-globe-caption"><i /> 08 FOG REGIONS / LIVE ROUTING</span>
    </div>
  );
}
