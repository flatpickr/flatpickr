export declare const pad: (number: string | number) => string;
export declare const int: (bool: boolean) => 0 | 1;
export declare function debounce<F extends Function>(
  func: F,
  wait: number,
  immediate?: boolean
): (this: Function) => void;
export declare const arrayify: <T>(obj: T | T[]) => T[];
export declare function mouseDelta(e: MouseWheelEvent): number;
export declare type IncrementEvent = MouseEvent & {
  delta: number;
  type: "increment";
};
