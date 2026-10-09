---
'@mushilu-san/ui': minor
---

RTL support for gesture/direction-sensitive components. Carousel slide translation, drag direction, ArrowLeft/ArrowRight and prev/next chevrons now follow `dir="rtl"`. Resizable pointer drag and horizontal arrow keys are mirrored under RTL. `SwipeSide` gains logical `'start' | 'end'` (physical `'left' | 'right'` kept) and `SheetSide` gains logical `'start' | 'end'` with logical borders and slide-in animation; both are additive.
