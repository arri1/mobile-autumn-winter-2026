import { floors12 } from './floors12';
import { floors34 } from './floors34';
import { floors567 } from './floors567';
import type { PlanFloor, PlanRoom, Point } from './types';

export const kfenFloors = [...floors12, ...floors34, ...floors567];

const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const pointKey = ([x, y]: Point) => `${x.toFixed(6)},${y.toFixed(6)}`;

function project(point: Point, [x, y]: Point, end: Point) {
  const dx = end[0] - x;
  const dy = end[1] - y;
  const t = Math.max(0, Math.min(1, ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy)));
  const target: Point = [x + t * dx, y + t * dy];
  return { t, target, distance: distance(point, target) };
}

function onOutline(door: Point, outline: Point[]) {
  return outline.map((start, index) => project(door, start, outline[(index + 1) % outline.length]))
    .reduce((best, edge) => edge.distance < best.distance ? edge : best).target;
}

type Neighbor = { id: string; length: number };

function crossesOutline(a: Point, b: Point, outline: Point[]) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const stops = [0, 1];
  for (let i = 0; i < outline.length; i += 1) {
    const [x, y] = outline[i];
    const [u, v] = outline[(i + 1) % outline.length];
    const determinant = dx * (v - y) - dy * (u - x);
    if (Math.abs(determinant) < 0.0001) continue;
    const t = ((x - a[0]) * (v - y) - (y - a[1]) * (u - x)) / determinant;
    const s = ((x - a[0]) * dy - (y - a[1]) * dx) / determinant;
    if (t > 0 && t < 1 && s >= 0 && s <= 1) stops.push(t);
  }
  stops.sort((left, right) => left - right);
  return stops.slice(1).some((end, i) => {
    if (end - stops[i] < 0.001) return false;
    const t = (stops[i] + end) / 2;
    const x = a[0] + t * dx;
    const y = a[1] + t * dy;
    let inside = false;
    for (let j = 0; j < outline.length; j += 1) {
      const [left, top] = outline[j];
      const [right, bottom] = outline[(j + 1) % outline.length];
      if ((top > y) !== (bottom > y) && x < left + ((right - left) * (y - top)) / (bottom - top)) inside = !inside;
    }
    return inside;
  });
}

function compileFloor(floor: PlanFloor) {
  const edges = new Map<string, Neighbor[]>();
  const points = new Map<string, Point>();
  const obstacles = [...floor.rooms, ...(floor.landmarks ?? [])];
  const isPassable = (a: Point, b: Point) => distance(a, b) <= 0.05 ||
    !obstacles.some(({ outline }) => crossesOutline(a, b, outline));

  function connect(a: string, pointA: Point, b: string, pointB: Point) {
    if (a === b) return;
    const length = distance(pointA, pointB);
    if (!isPassable(pointA, pointB)) return;
    points.set(a, pointA);
    points.set(b, pointB);
    edges.set(a, [...(edges.get(a) ?? []), { id: b, length }]);
    edges.set(b, [...(edges.get(b) ?? []), { id: a, length }]);
  }

  floor.halls.forEach((hall, hallIndex) => {
    const segments = hall.points.slice(1).map((end, index) => {
      const start = hall.points[index];
      const stops = [{ t: 0, point: start }, { t: 1, point: end }];
      return { start, end, stops };
    });
    const anchors = [
      ...floor.stairs.flatMap((stair, index) => stair.hall === hallIndex ? [{ id: `stair:${index}`, point: stair.point }] : []),
      ...floor.rooms.flatMap((room) => room.hall === hallIndex && room.door ? [{ id: `room:${room.number}`, point: onOutline(room.door, room.outline) }] : []),
    ];

    for (const { id, point } of anchors) {
      const projections = segments.map((segment) => ({ ...project(point, segment.start, segment.end), segment }));
      const nearest = projections.reduce((best, candidate) => candidate.distance < best.distance ? candidate : best);
      nearest.segment.stops.push({ t: nearest.t, point: nearest.target });
      connect(id, point, pointKey(nearest.target), nearest.target);
    }

    for (const segment of segments) {
      const stops = segment.stops.sort((a, b) => a.t - b.t);
      for (let index = 1; index < stops.length; index += 1) {
        const a = stops[index - 1].point;
        const b = stops[index].point;
        connect(pointKey(a), a, pointKey(b), b);
      }
    }
  });
  return { edges, points };
}

const graphs = new Map(kfenFloors.map((floor) => [floor.level, compileFloor(floor)]));

export type FloorRoute = { stairIndex: number; points: Point[]; length: number };

export function routesToRoom(floor: PlanFloor, room: PlanRoom): FloorRoute[] {
  const graph = graphs.get(floor.level);
  const destination = `room:${room.number}`;
  if (!graph?.points.has(destination)) return [];

  const costs = new Map([[destination, 0]]);
  const next = new Map<string, string>();
  const pending = new Set([destination]);

  while (pending.size) {
    const current = [...pending].reduce((best, id) => costs.get(id)! < costs.get(best)! ? id : best);
    pending.delete(current);
    for (const edge of graph.edges.get(current) ?? []) {
      const cost = costs.get(current)! + edge.length;
      if (cost >= (costs.get(edge.id) ?? Infinity)) continue;
      costs.set(edge.id, cost);
      next.set(edge.id, current);
      pending.add(edge.id);
    }
  }

  return floor.stairs.flatMap((_, stairIndex) => {
    let node: string | undefined = `stair:${stairIndex}`;
    const length = costs.get(node);
    if (length === undefined) return [];
    const points: Point[] = [];
    while (node) {
      const point = graph.points.get(node)!;
      if (!points.length || distance(points[points.length - 1], point) > 0.01) points.push(point);
      node = next.get(node);
    }
    return [{ stairIndex, points, length }];
  }).sort((a, b) => a.length - b.length);
}
