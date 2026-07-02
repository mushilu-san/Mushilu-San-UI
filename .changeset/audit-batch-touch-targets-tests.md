---
"@mushilu-san/ui": patch
---

Fixes 10 audit findings in one batch: touch targets brought up to the WCAG 2.5.5 44px minimum on ComboboxItem, CommandItem, MenubarTrigger, and CarouselDots; ResizablePanel now unregisters itself on destroy instead of leaving a stale entry in the panel group when panels are removed dynamically; Menubar's arrow-key navigation now uses the shared `handleRovingFocus()` helper instead of a duplicated hand-rolled implementation. Also adds missing ARIA-behavior specs for AccordionItem, CarouselNext, CarouselPrev, and CarouselDots.
