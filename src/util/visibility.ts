import type { ConditionGroup } from "@/types";

export type FormScalar = string | number | boolean | null | undefined;
export type FormValues = Record<string, FormScalar | string[]>;

function toBoolLike(x: unknown): boolean | undefined {
  if (typeof x === "boolean") return x;
  if (typeof x === "string") {
    const s = x.trim().toLowerCase();
    if (["true", "1", "yes", "y", "on"].includes(s)) return true;
    if (["false", "0", "no", "n", "off"].includes(s)) return false;
  }
  return undefined;
}

function toNumLike(x: unknown): number | undefined {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string" && x.trim() !== "") {
    const n = Number(x);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

export function evaluateVisibility(
  group: ConditionGroup | undefined,
  values: FormValues
): boolean {
  if (!group || !group.conditions?.length) return true;

  const op = String(group.op ?? "AND").toUpperCase() as "AND" | "OR";

  const checks = group.conditions.map((c) => {
    const v = values[c.targetElementId];
    const t = c.valueToMatch;

    if (Array.isArray(v)) return v.map(String).includes(String(t));

    const vb = toBoolLike(v);
    const tb = toBoolLike(t);
    if (vb !== undefined && tb !== undefined) return vb === tb;

    const vn = toNumLike(v);
    const tn = toNumLike(t);
    if (vn !== undefined && tn !== undefined) return vn === tn;

    return String(v) === String(t);
  });

  return op === "AND" ? checks.every(Boolean) : checks.some(Boolean);
}