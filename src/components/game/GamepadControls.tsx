'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/lib/store';

/*
  Physical game controller support via the browser Gamepad API.
  Polls the first connected pad each animation frame and maps it to the same
  store controls the keyboard/touch buttons use.

  Mapping (standard gamepad layout — Xbox/PlayStation/most USB pads):
    • Accelerate : Right Trigger (RT/R2, button 7)  OR  A/✕ (button 0)
    • Brake      : Left Trigger  (LT/L2, button 6)  OR  B/○ (button 1)
    • Steer      : Left stick X (axis 0)  OR  D-pad left/right (buttons 14/15)
*/

const DEADZONE = 0.35;

export function GamepadControls() {
  const setControl = useGameStore((s) => s.setControl);

  useEffect(() => {
    let raf = 0;
    // remember last-sent state so we only push changes into the store
    const last = { left: false, right: false, accelerate: false, brake: false };

    const apply = (key: keyof typeof last, value: boolean) => {
      if (last[key] !== value) {
        last[key] = value;
        setControl(key, value);
      }
    };

    const pressed = (b: GamepadButton | undefined) => !!b && (b.pressed || b.value > 0.4);

    const loop = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = pads && Array.from(pads).find((p) => p && p.connected);

      if (gp) {
        const axisX = gp.axes[0] ?? 0;
        const dpadLeft = pressed(gp.buttons[14]);
        const dpadRight = pressed(gp.buttons[15]);

        apply('left', dpadLeft || axisX < -DEADZONE);
        apply('right', dpadRight || axisX > DEADZONE);
        apply('accelerate', pressed(gp.buttons[7]) || pressed(gp.buttons[0]));
        apply('brake', pressed(gp.buttons[6]) || pressed(gp.buttons[1]));
      } else {
        // pad disconnected — release anything we were holding
        (Object.keys(last) as (keyof typeof last)[]).forEach((k) => apply(k, false));
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [setControl]);

  return null;
}
