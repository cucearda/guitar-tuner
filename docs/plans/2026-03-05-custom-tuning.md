# Custom Tuning Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Custom tuning panel where users can edit each string's note via a scrollable drawer, and tune to each string when not in edit mode.

**Architecture:** Extend `TuningSelector.jsx` with `editCustomTuning` toggle, `customTuning` array state, and `editingStringIndex` state. A Chakra UI `Drawer` lists all GUITAR_NOTE_NAMES for note selection. The `targetNote` derivation is updated to read from `customTuning` when selectedTuning is "Custom".

**Tech Stack:** React, Chakra UI v3 (Drawer, Button, VStack, HStack, Text, Box)

---

### Task 1: Fix the broken `handleCustomString` syntax and wire up edit-mode routing

**Files:**
- Modify: `src/components/TuningSelector.jsx`

**Step 1: Read the current file**

Open `src/components/TuningSelector.jsx` and confirm the current state.

**Step 2: Add `editingStringIndex` state and fix `handleCustomString`**

Replace the broken `handleCustomString` stub with:

```jsx
const [editingStringIndex, setEditingStringIndex] = useState(null);

const handleCustomString = (index) => {
  if (editCustomTuning) {
    setEditingStringIndex(index);
  } else {
    setSelectedString(index);
  }
};
```

Also fix the `if editCustomTuning{` syntax error — it was never valid JSX/JS.

**Step 3: Update `targetNote` to handle Custom tuning**

Find the line:
```js
const targetNote =
  selectedTuning !== null && selectedString !== null
    ? GUITAR_TUNINGS[selectedTuning][selectedString]
    : null;
```

Replace with:
```js
const targetNote =
  selectedTuning !== null && selectedString !== null
    ? selectedTuning === "Custom"
      ? customTuning[selectedString]
      : GUITAR_TUNINGS[selectedTuning][selectedString]
    : null;
```

**Step 4: Verify no console errors by running the dev server**

```bash
npm run dev
```

Expected: No syntax errors, app loads.

**Step 5: Commit**

```bash
git add src/components/TuningSelector.jsx
git commit -m "fix: repair handleCustomString and wire custom tuning targetNote"
```

---

### Task 2: Update the Custom panel to show `customTuning` notes and add "Edit Tuning" button

**Files:**
- Modify: `src/components/TuningSelector.jsx`

**Step 1: Replace hardcoded Standard reference in Custom panel**

Find the Custom panel JSX block (`{selectedTuning === "Custom" && ...}`).

Change `GUITAR_TUNINGS["Standard"].map(...)` to `customTuning.map(...)` so string buttons always reflect the live custom tuning:

```jsx
{customTuning.map((note, index) => (
  <Button
    key={index}
    variant={selectedString === index ? "solid" : "outline"}
    onClick={() => handleCustomString(index)}
  >
    String {6 - index} — {note}
  </Button>
))}
```

**Step 2: Add "Edit Tuning" toggle button above the string list**

Inside the Custom panel `VStack`, add before the `.map(...)`:

```jsx
<Button
  variant={editCustomTuning ? "solid" : "outline"}
  colorScheme="blue"
  onClick={() => {
    setEditCustomTuning((prev) => !prev);
    setEditingStringIndex(null);
    setSelectedString(null);
  }}
>
  {editCustomTuning ? "Done Editing" : "Edit Tuning"}
</Button>
```

**Step 3: Verify in browser**

- Select "Custom" in the left nav
- Button reads "Done Editing" (edit mode starts on)
- Click it → becomes "Edit Tuning"
- Click again → back to "Done Editing"
- String buttons show Standard notes by default

**Step 4: Commit**

```bash
git add src/components/TuningSelector.jsx
git commit -m "feat: custom panel shows live tuning and has edit mode toggle"
```

---

### Task 3: Add the note-selection Drawer

**Files:**
- Modify: `src/components/TuningSelector.jsx`

**Step 1: Import Drawer components from Chakra UI**

Chakra UI v3 uses a namespaced Drawer. Add to imports:

```jsx
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "@chakra-ui/react";
```

> Note: In Chakra UI v3, Drawer is composed with `DrawerRoot` as the container (takes `open` and `onOpenChange` props), `DrawerContent`, `DrawerHeader`, `DrawerBody`, and `DrawerCloseTrigger`. There is no single `<Drawer>` import.

**Step 2: Add the Drawer JSX at the bottom of the return, before closing `</HStack>`**

```jsx
<DrawerRoot
  open={editingStringIndex !== null}
  onOpenChange={(details) => {
    if (!details.open) setEditingStringIndex(null);
  }}
  placement="end"
>
  <DrawerBackdrop />
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>
        Select note for String {editingStringIndex !== null ? 6 - editingStringIndex : ""}
      </DrawerTitle>
    </DrawerHeader>
    <DrawerCloseTrigger />
    <DrawerBody overflowY="auto">
      <VStack align="stretch">
        {GUITAR_NOTE_NAMES.map((note) => (
          <Button
            key={note}
            variant={
              editingStringIndex !== null &&
              customTuning[editingStringIndex] === note
                ? "solid"
                : "outline"
            }
            onClick={() => {
              setCustomTuning((prev) => {
                const next = [...prev];
                next[editingStringIndex] = note;
                return next;
              });
              setEditingStringIndex(null);
            }}
          >
            {note}
          </Button>
        ))}
      </VStack>
    </DrawerBody>
  </DrawerContent>
</DrawerRoot>
```

**Step 3: Verify in browser**

1. Select "Custom" → edit mode is on ("Done Editing" shown)
2. Click any string button → drawer slides in from right
3. All notes from GUITAR_NOTE_NAMES are listed; current note for that string is highlighted (solid)
4. Click a note → drawer closes, string button now shows new note
5. Click "Edit Tuning" / "Done Editing" to toggle edit mode off
6. Click a string button → FrequencyBar appears (no drawer)

**Step 4: Commit**

```bash
git add src/components/TuningSelector.jsx
git commit -m "feat: add scrollable note-selection drawer for custom tuning"
```
