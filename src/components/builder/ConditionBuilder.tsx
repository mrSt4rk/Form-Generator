import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import type { Element, ConditionGroup, Condition } from "@/types";

export function ConditionBuilder({
  element,
  onChange,
  allElements,
}: {
  element: Element;
  onChange: (el: Element) => void;
  allElements: Element[];
}) {
  const group = element.visibility ?? { op: "AND" as const, conditions: [] };
  const updateGroup = (g: ConditionGroup) =>
    onChange({ ...element, visibility: g });
  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <FormControl size="small" sx={{ width: 140 }}>
          <InputLabel id={`op-${element.id}`}>شرط</InputLabel>
          <Select
            labelId={`op-${element.id}`}
            label="Operator"
            value={group.op}
            onChange={(e) =>
              updateGroup({
                ...group,
                op: e.target.value as ConditionGroup["op"],
              })
            }
          >
            <MenuItem value="AND">AND</MenuItem>
            <MenuItem value="OR">OR</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() =>
            updateGroup({
              ...group,
              conditions: [
                ...group.conditions,
                { targetElementId: "", valueToMatch: "" },
              ],
            })
          }
        >
          افزودن شرط
        </Button>
      </Stack>
      <Stack sx={{ mt: 1 }} spacing={1}>
        {group.conditions.map((c: Condition, idx: number) => (
          <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={1}>
            <FormControl fullWidth size="small">
              <InputLabel id={`target-${element.id}-${idx}`}>
                المان موردنظر
              </InputLabel>
              <Select
                labelId={`target-${element.id}-${idx}`}
                label="Target element"
                value={c.targetElementId}
                onChange={(e) => {
                  const current = { ...group };
                  current.conditions[idx] = {
                    ...c,
                    targetElementId: e.target.value,
                  };
                  updateGroup(current);
                }}
              >
                {allElements
                  .filter((el) => el.id !== element.id)
                  .map((el) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              label="مقدار مقایسه"
              value={String(c.valueToMatch ?? "")}
              onChange={(e) => {
                const current = { ...group };
                current.conditions[idx] = {
                  ...c,
                  valueToMatch: e.target.value,
                };
                updateGroup(current);
              }}
            />
            <Button
              color="error"
              onClick={() => {
                const current = {
                  ...group,
                  conditions: group.conditions.filter(
                    (_, i: number) => i !== idx
                  ),
                };
                updateGroup(current);
              }}
            >
              حذف
            </Button>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
