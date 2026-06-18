export interface DragCallbacks {
  onMove?: (event: PointerEvent) => void;
  onEnd?: (event: PointerEvent) => void;
}

export interface DragSession {
  destroy(): void;
}

export function createDrag(doc: Document, callbacks: DragCallbacks): DragSession {
  const onMove = (e: PointerEvent): void => callbacks.onMove?.(e);
  const onUp = (e: PointerEvent): void => {
    doc.removeEventListener('pointermove', onMove);
    doc.removeEventListener('pointerup', onUp);
    callbacks.onEnd?.(e);
  };

  doc.addEventListener('pointermove', onMove);
  doc.addEventListener('pointerup', onUp);

  return {
    destroy(): void {
      doc.removeEventListener('pointermove', onMove);
      doc.removeEventListener('pointerup', onUp);
    },
  };
}
