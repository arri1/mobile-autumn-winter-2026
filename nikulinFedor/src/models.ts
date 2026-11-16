import { footprints, type Footprint } from './footprints';

type Point = { x: number; y: number; z: number };
type PlanPoint = Pick<Point, 'x' | 'z'>;

type Polygon = {
  id: string;
  vertices: Point[];
  fill: string;
  stroke?: string;
};

type Surface = {
  normal: Point;
  center: Point;
  polygons: Polygon[];
};

type Scene = {
  foundation: Surface[];
  building: Surface[];
  center: Point;
  scale: number;
  bearing: number;
};

export type BuildingModel = {
  id: string;
  shortName: string;
  name: string;
  address: string;
  accent: string;
  levels: number;
  height?: number;
  footprintSource: string;
  floorPlan?: { complexId: string };
  scene: Scene;
};

type ProjectedPolygon = Pick<Polygon, 'id' | 'fill' | 'stroke'> & { points: string };
type Palette = { wall: string; roof: string; trim: string; glass: string; darkGlass: string };
type Facade = { glassFrom?: number; pilasters?: boolean };

const view = { width: 400, height: 300, yaw: Math.PI / 7, pitch: Math.PI / 5.5 };
const tiltCos = Math.cos(view.pitch);
const tiltSin = Math.sin(view.pitch);

const foundationPalette = {
  wall: '#B8BEAA', roof: '#E1E4D5', trim: '#B8BEAA', glass: '#B8BEAA', darkGlass: '#B8BEAA',
};
const kfenPalette = {
  wall: '#DFD1C7', roof: '#B7B6AE', trim: '#B9ACA1', glass: '#75929E', darkGlass: '#536C7A',
};
const gukPalette = {
  wall: '#EDE5D0', roof: '#71828B', trim: '#CABFA9', glass: '#82979A', darkGlass: '#607780',
};
const ulkPalette = {
  wall: '#F1EBDB', roof: '#B9B6AA', trim: '#C9B087', glass: '#879CA7', darkGlass: '#5F7382',
};
const entryPalette = { wall: '#F7F1DF', roof: '#D5C7AB', trim: '#C6B99C', glass: '#71828B', darkGlass: '#54656E' };

function average(vertices: Point[]): Point {
  const total = vertices.reduce((sum, vertex) => ({
    x: sum.x + vertex.x,
    y: sum.y + vertex.y,
    z: sum.z + vertex.z,
  }), { x: 0, y: 0, z: 0 });
  return { x: total.x / vertices.length, y: total.y / vertices.length, z: total.z / vertices.length };
}

function surface(polygon: Polygon, normal: Point): Surface {
  return { normal, center: average(polygon.vertices), polygons: [polygon] };
}

function shade(color: string, light: number): string {
  const rgb = Number.parseInt(color.slice(1), 16);
  const channel = (shift: number) => {
    const value = (rgb >> shift) & 255;
    const target = light < 0 ? 0 : 255;
    return Math.round(value + (target - value) * Math.abs(light)).toString(16).padStart(2, '0');
  };
  return `#${channel(16)}${channel(8)}${channel(0)}`;
}

function rectangle(left: number, back: number, right: number, front: number): PlanPoint[] {
  return [{ x: left, z: back }, { x: right, z: back }, { x: right, z: front }, { x: left, z: front }];
}

function roof(id: string, footprint: PlanPoint[], y: number, fill: string): Surface {
  return surface({ id, vertices: footprint.map((point) => ({ ...point, y })), fill, stroke: shade(fill, -0.12) }, { x: 0, y: 1, z: 0 });
}

function wall(
  id: string,
  from: PlanPoint,
  to: PlanPoint,
  bottom: number,
  top: number,
  palette: Palette,
  levels: number,
  facade: Facade = {},
): Surface {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const width = Math.hypot(dx, dz);
  const normal = { x: dz / width, y: 0, z: -dx / width };
  const light = 0.06 * normal.z - 0.11 * normal.x - 0.055;

  function at(offset: number, y: number): Point {
    return { x: from.x + (offset / width) * dx, z: from.z + (offset / width) * dz, y };
  }

  function panel(name: string, left: number, low: number, right: number, high: number, color: string): Polygon {
    return {
      id: `${id}-${name}`,
      vertices: [at(left, low), at(right, low), at(right, high), at(left, high)],
      fill: shade(color, light),
    };
  }

  const base = panel('face', 0, bottom, width, top, palette.wall);
  const result = surface({ ...base, stroke: shade(base.fill, -0.13) }, normal);
  if (levels === 0) return result;

  result.polygons.push(
    panel('plinth', 0, bottom, width, bottom + 0.6, palette.trim),
    panel('cornice', 0, top - 0.75, width, top - 0.15, palette.trim),
  );

  if (width < 2.6) return result;
  const columns = Math.max(1, Math.round(width / 5.2));
  const cell = width / columns;
  const storey = (top - bottom) / levels;
  if (facade.glassFrom !== undefined) {
    result.polygons.push(panel('glazing', 0, bottom + facade.glassFrom * storey, width, top - 0.75, palette.darkGlass));
  }
  if (facade.pilasters) {
    for (let column = 0; column <= columns; column++) {
      const offset = column * cell;
      result.polygons.push(panel(`pilaster-${column}`, Math.max(0, offset - 0.24), bottom + 0.6, Math.min(width, offset + 0.24), top - 0.75, palette.trim));
    }
  }
  for (let row = 0; row < levels; row++) {
    const glazed = facade.glassFrom !== undefined && row >= facade.glassFrom;
    const inset = cell * (glazed ? 0.055 : 0.22);
    const sill = bottom + (row + (glazed ? 0.08 : 0.26)) * storey;
    const lintel = Math.min(top - 0.76, sill + storey * (glazed ? 0.77 : 0.53));
    for (let column = 0; column < columns; column++) {
      const color = (column + row) % 4 === 0 ? palette.darkGlass : palette.glass;
      result.polygons.push(panel(`window-${row}-${column}`, column * cell + inset, sill, (column + 1) * cell - inset, lintel, color));
    }
  }
  return result;
}

function block(
  id: string,
  footprint: PlanPoint[],
  bottom: number,
  top: number,
  palette: Palette,
  levels = 0,
  facade?: (from: PlanPoint, to: PlanPoint) => Facade,
): Surface[] {
  const sides = footprint.map((point, index) => {
    const next = footprint[(index + 1) % footprint.length];
    return wall(`${id}-${index}`, point, next, bottom, top, palette, levels, facade?.(point, next));
  });
  return [...sides, roof(`${id}-roof`, footprint, top, palette.roof)];
}

function planPoints(points: Footprint['points']): PlanPoint[] {
  return points.map(([x, z]) => ({ x, z }));
}

function buildStructure(footprint: Footprint, outline: PlanPoint[], palette: Palette, height: number): Surface[] {
  const parts = footprint.parts ?? [];
  const glass = parts.find((part) => part.style === 'glass');
  const portico = parts.find((part) => part.style === 'portico');
  const canopy = parts.find((part) => part.style === 'canopy');

  if (glass) {
    const levels = glass.levels ?? footprint.levels;
    const wingHeight = height * levels / footprint.levels;
    const glassPoints = planPoints(glass.points);
    const isGlazed = (point: PlanPoint) => glassPoints.some((vertex) => Math.hypot(point.x - vertex.x, point.z - vertex.z) < 0.2);
    const lowerWings = block('building', outline, 0, wingHeight, palette, levels, (from, to) => (
      isGlazed(from) && isGlazed(to) ? { glassFrom: glass.minLevel } : {}
    ));
    const upperWings = parts.filter((part) => (part.levels ?? 0) > levels).flatMap((part, index) => (
      block(`upper-${index}`, planPoints(part.points), wingHeight, height, palette, footprint.levels - levels)
    ));
    return [...lowerWings, ...upperWings];
  }

  if (portico?.height) {
    const points = planPoints(portico.points);
    const base = Math.min(...points.map(({ z }) => z));
    const front = Math.max(...points.map(({ z }) => z));
    const left = Math.min(...points.map(({ x }) => x));
    const right = Math.max(...points.map(({ x }) => x));
    const top = portico.height;
    const main = outline.filter(({ x, z }) => !points.some((point) => point.z > base && point.x === x && point.z === z));
    const columns = Array.from({ length: 6 }, (_, index) => {
      const x = left + ((right - left) * (index + 0.65)) / 6.3;
      return block(`column-${index}`, rectangle(x - 0.42, front - 1.1, x + 0.42, front - 0.25), 0, top - 1.15, entryPalette);
    }).flat();
    const pediment = surface({
      id: 'pediment',
      fill: '#E4D6B8',
      stroke: '#AF9F83',
      vertices: [{ x: left, y: top, z: front }, { x: right, y: top, z: front }, { x: (left + right) / 2, y: top + 2.1, z: front }],
    }, { x: 0, y: 0, z: 1 });
    return [...block('building', main, 0, height, palette, footprint.levels), ...columns,
      ...block('portico', points, top - 1.15, top, entryPalette), pediment];
  }

  const tower = canopy && parts.find((part) => part !== canopy);
  if (canopy?.height && tower?.height) {
    const points = planPoints(canopy.points);
    const left = Math.min(...points.map(({ z }) => z));
    const right = Math.max(...points.map(({ z }) => z));
    const front = Math.max(...points.map(({ x }) => x));
    const eave = canopy.height - 0.85;
    const supports = Array.from({ length: 4 }, (_, index) => {
      const z = left + (right - left) * (index + 0.5) / 4;
      return block(`support-${index}`, rectangle(front - 1.45, z - 0.32, front - 0.8, z + 0.32), 0, eave, entryPalette);
    }).flat();
    return [...block('tower', planPoints(tower.points), 0, tower.height, palette, tower.levels ?? footprint.levels, () => ({ pilasters: true })),
      ...supports, ...block('canopy', points, eave, canopy.height, entryPalette)];
  }

  return block('building', outline, 0, height, palette, footprint.levels);
}

function scene(footprint: Footprint, palette: Palette): Scene {
  const outline = planPoints(footprint.points);
  const height = footprint.height ?? footprint.levels * 3.4;
  const building = buildStructure(footprint, outline, palette, height);
  const top = Math.max(...building.flatMap(({ polygons }) => polygons[0].vertices.map(({ y }) => y)));
  const margin = 4;
  const slab = 1.3;
  const left = Math.min(...outline.map(({ x }) => x)) - margin;
  const right = Math.max(...outline.map(({ x }) => x)) + margin;
  const back = Math.min(...outline.map(({ z }) => z)) - margin;
  const front = Math.max(...outline.map(({ z }) => z)) + margin;
  const center = { x: (left + right) / 2, y: (top - slab) / 2, z: (front + back) / 2 };
  const base = rectangle(left, back, right, front);
  const radius = Math.hypot((right - left) / 2, (front - back) / 2);
  const scale = Math.min(368 / (radius * 2), 250 / ((top + slab) * tiltCos + radius * 2 * tiltSin));
  const foundation = block('base', base, -slab, 0, foundationPalette);
  const bearing = footprint.parts?.some((part) => part.style === 'canopy') ? Math.PI / 2 : 0;
  return { foundation, building, center, scale, bearing };
}

const campus = [
  {
    id: 'kfen',
    shortName: 'КФЕН',
    name: 'Корпус факультетов естественных наук',
    address: 'ул. Кулаковского, 48',
    accent: '#087C70',
    floorPlan: { complexId: '7037510072933142' },
    palette: kfenPalette,
  },
  {
    id: 'guk',
    shortName: 'ГУК',
    name: 'Главный учебный корпус',
    address: 'ул. Кулаковского, 42',
    accent: '#7A633E',
    palette: gukPalette,
  },
  {
    id: 'ulk',
    shortName: 'УЛК',
    name: 'Учебно-лабораторный корпус',
    address: 'ул. Белинского, 58',
    accent: '#537B76',
    palette: ulkPalette,
  },
] as const;

export const buildings: BuildingModel[] = campus.map(({ palette, ...building }) => {
  const footprint = footprints[building.id];
  return {
    ...building,
    levels: footprint.levels,
    height: footprint.height,
    footprintSource: footprint.source,
    scene: scene(footprint, palette),
  };
});

export function projectBuilding(building: BuildingModel, angle: number): ProjectedPolygon[] {
  const { foundation, building: structure, center, scale, bearing } = building.scene;
  const yaw = (Number.isFinite(angle) ? angle : 0) + view.yaw + bearing;
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);

  const facing = ({ x, y, z }: Point) => (x * sin + z * cos) * tiltCos + y * tiltSin;

  function ordered(surfaces: Surface[]): Polygon[] {
    return surfaces
      .filter(({ normal }) => facing(normal) > 0.001)
      .sort((left, right) => facing(left.center) - facing(right.center))
      .flatMap(({ polygons }) => polygons);
  }

  function screenPoint({ x, y, z }: Point): string {
    const dx = x - center.x;
    const dz = z - center.z;
    const lateral = dx * cos - dz * sin;
    const vertical = (y - center.y) * tiltCos - (dx * sin + dz * cos) * tiltSin;
    return `${(view.width / 2 + lateral * scale).toFixed(1)},${(view.height / 2 - vertical * scale).toFixed(1)}`;
  }

  return [...ordered(foundation), ...ordered(structure)].map(({ id, vertices, fill, stroke }) => ({
    id,
    points: vertices.map(screenPoint).join(' '),
    fill,
    stroke,
  }));
}
