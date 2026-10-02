export interface StateInfo {
  readonly name: string;
  /** True for codes no longer issued (e.g. OR, TS, UA, DN). */
  readonly legacy: boolean;
}

export interface StandardRegistration {
  type: "standard";
  /** e.g. "MH12AB1234" */
  normalized: string;
  /** e.g. "MH 12 AB 1234" */
  formatted: string;
  state: string;
  stateName: string;
  legacy: boolean;
  rto: string;
  /** Series letters; may be empty. */
  series: string;
  number: string;
}

export interface BharatRegistration {
  type: "bh";
  /** e.g. "22BH1234AA" */
  normalized: string;
  /** e.g. "22 BH 1234 AA" */
  formatted: string;
  /** Year of registration, e.g. 2022. */
  year: number;
  number: string;
  series: string;
}

export type Registration = StandardRegistration | BharatRegistration;

export declare const STATES: Readonly<Record<string, StateInfo>>;
export declare function parse(input: unknown): Registration | null;
export declare function isValid(input: unknown): boolean;
export declare function normalize(input: unknown): string | null;
export declare function format(input: unknown): string | null;
export declare function getStateName(code: unknown): string | null;
