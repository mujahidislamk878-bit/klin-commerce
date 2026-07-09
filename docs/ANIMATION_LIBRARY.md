# Animation Library Documentation (Enterprise v2.0)

This manual lists the custom Framer Motion presets, spring physics config options, and interactive wrapper components available in the Klin Design System.

---

## 1. Motion Presets

All content components supporting the `AnimationProps` interface can trigger the following entrance animations:

| Preset | Target Initial State | Target Final State | Description |
|---|---|---|---|
| `fadeIn` | `opacity: 0` | `opacity: 1` | Standard fade reveal |
| `fadeInUp` | `opacity: 0, y: 40` | `opacity: 1, y: 0` | Bottom upward fade-in slide |
| `fadeInDown` | `opacity: 0, y: -40` | `opacity: 1, y: 0` | Top downward fade-in slide |
| `scaleIn` | `scale: 0` | `scale: 1` | Scale from center point |
| `rotateIn` | `rotate: -180, opacity: 0` | `rotate: 0, opacity: 1` | Spinning fade reveal |
| `flipInX` | `rotateX: -90, opacity: 0` | `rotateX: 0, opacity: 1` | Flip vertically |
| `flipInY` | `rotateY: -90, opacity: 0` | `rotateY: 0, opacity: 1` | Flip horizontally |

### Spring Presets
Physics values are optimized to prioritize high speed and zero responsiveness lag:
```typescript
const springConfig = {
  type: "spring",
  damping: 15,
  stiffness: 220, // Tuned for rapid response
};
```

---

## 2. Interactive Animation Wrapper Components

### TiltCard (`<TiltCard />`)
Computes hover mouse coords on mouse moves to dynamically rotate containers along a 3D perspective vector.
- **Props:** `maxTilt?: number` (default: `15` degrees)
- **Usage:**
  ```tsx
  import { TiltCard } from "@klin/animation";

  <TiltCard maxTilt={10}>
    <div>Hover me to tilt</div>
  </TiltCard>
  ```

### HoverGlow (`<HoverGlow />`)
Paints a radial gradient overlay spotlight under the cursor during hover events.
- **Props:** `glowColor?: string`, `glowSize?: number`
- **Usage:**
  ```tsx
  import { HoverGlow } from "@klin/animation";

  <HoverGlow glowColor="rgba(99,102,241,0.15)" glowSize={200}>
    <Card>Glow card container</Card>
  </HoverGlow>
  ```

### Ripple (`<Ripple />`)
Renders a growing ripple animation circle on click events, suitable for custom buttons.
- **Props:** `color?: string`

### Confetti (`<Confetti />`)
Triggers an overhead stream of random colored falling shapes for checkout confirmations or successful signups.
- **Props:** `active?: boolean`
