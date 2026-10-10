import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FixtureService {
  /** Shows a message. */
  show(message: string, duration = 3000): number {
    return duration + message.length;
  }

  private hidden(): void {
    return;
  }

  _internal(): void {
    this.hidden();
  }
}
