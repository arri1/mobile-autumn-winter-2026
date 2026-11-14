export type Point = [number, number];

export type PlanRoom = {
  number: string;
  aliases?: string[];
  outline: Point[];
  door?: Point;
  hall?: number;
};

export type PlanFloor = {
  level: number;
  viewBox: [number, number, number, number];
  halls: { points: Point[]; width: number }[];
  stairs: { point: Point; hall: number; label: string }[];
  rooms: PlanRoom[];
  landmarks?: { outline: Point[]; label: string }[];
};

export function rect(left: number, top: number, right: number, bottom: number): Point[] {
  return [[left, top], [right, top], [right, bottom], [left, bottom]];
}

export function room(number: string, outline: Point[], door?: Point, hall?: number): PlanRoom {
  return { number, outline, door, hall };
}

// Each tuple describes a visible label and the bounds of its room along a corridor.
export function row(
  entries: [string, number, number][], top: number, bottom: number, side: 'top' | 'bottom', hall: number,
): PlanRoom[] {
  return entries.map(([number, left, right]) => room(
    number, rect(left, top, right, bottom), [(left + right) / 2, side === 'top' ? top : bottom], hall,
  ));
}

export function stair(x: number, y: number, hall: number, label: string) {
  return { point: [x, y] as Point, hall, label };
}
