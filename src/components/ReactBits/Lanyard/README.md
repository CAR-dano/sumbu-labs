# Lanyard Component - Interactive Lanyards with Click Navigation

This component creates interactive lanyards with physics simulation that support both drag interaction and click navigation to URLs.

## Features

- ✅ **Same Height**: All lanyards are positioned at the same height
- ✅ **Different GLB Content**: Each lanyard can display different 3D models
- ✅ **Interactive Dragging**: Each lanyard can be dragged and moves with physics
- ✅ **Click Navigation**: Click (without dragging) opens specified URLs
- ✅ **Smart Detection**: Automatically differentiates between click and drag
- ✅ **Color Variations**: Subtle color differences for visual distinction
- ✅ **Responsive**: Adapts to different screen sizes

## Usage

### Basic Usage (Default URLs)

```tsx
import { FiveLanyards } from "./components/ReactBits/Lanyard/Lanyard";

function App() {
  return <FiveLanyards />; // Uses default GitHub profile URLs
}
```

### Advanced Usage (Custom URLs and Content)

```tsx
import { Lanyard } from "./components/ReactBits/Lanyard/Lanyard";

function App() {
  const customGLBs = [
    "/assets/others/card1.glb",
    "/assets/others/card2.glb",
    "/assets/others/card3.glb",
    "/assets/others/card4.glb",
    "/assets/others/card5.glb",
  ];

  const customUrls = [
    "https://sumbu-labs.com",
    "https://github.com/sumbu-labs",
    "https://linkedin.com/company/sumbu-labs",
    "https://twitter.com/sumbu_labs",
    "https://instagram.com/sumbu.labs",
  ];

  return (
    <Lanyard
      count={5}
      glbPaths={customGLBs}
      urls={customUrls}
      position={[0, 0, 20]}
      fov={25}
    />
  );
}
```

## Props

### Lanyard Component

- `position`: Camera position `[x, y, z]` (default: `[0, 0, 0]`)
- `gravity`: Physics gravity `[x, y, z]` (default: `[0, -40, 0]`)
- `fov`: Camera field of view (default: `20`)
- `transparent`: Background transparency (default: `true`)
- `count`: Number of lanyards (default: `1`)
- `glbPaths`: Array of GLB file paths for different content
- `urls`: Array of URLs to open when each lanyard is clicked

### FiveLanyards Component

Same props as Lanyard but `count` is fixed at 5.

## Interaction Behavior

### Click vs Drag Detection

The component automatically detects the difference between clicking and dragging:

- **Click**: Duration < 200ms AND mouse movement < 5 pixels

  - **Action**: Opens the specified URL in a new tab
  - **Security**: Uses `noopener,noreferrer` for security

- **Drag**: Mouse movement > 5 pixels OR duration > 200ms
  - **Action**: Activates physics-based dragging interaction

### Default URLs

```tsx
const defaultURLs = [
  "https://github.com/gigzz", // Giga's profile
  "https://github.com/dzikranalfansyah", // Dzikran's profile
  "https://github.com/maul112", // Maul's profile
  "https://github.com/farhan", // Farhan's profile
  "https://github.com/azfar", // Azfar's profile
];
```

## Adding Different GLB Content

1. **Add GLB files** to `public/assets/others/`:

   ```bash
   public/assets/others/
   ├── card1.glb
   ├── card2.glb
   ├── card3.glb
   ├── card4.glb
   └── card5.glb
   ```

2. **Create array of paths**:

   ```tsx
   const glbPaths = [
     "/assets/others/card1.glb",
     "/assets/others/card2.glb",
     "/assets/others/card3.glb",
     "/assets/others/card4.glb",
     "/assets/others/card5.glb",
   ];
   ```

3. **Pass to component**:

   ```tsx
   <FiveLanyards glbPaths={glbPaths} urls={customUrls} />
   ```

## Current Status

- ✅ Five lanyards with same height implemented
- ✅ Support for different GLB content per lanyard
- ✅ Click navigation to URLs implemented
- ✅ Smart click vs drag detection
- ✅ Security features (noopener, noreferrer)
- ⚠️ Currently using same GLB file for all (only one GLB available)
- 🔄 Ready to use different GLB files when available

## Next Steps

To fully utilize different content:

1. Create or obtain 5 different GLB files
2. Add them to the assets folder
3. Update the glbPaths array
4. Configure custom URLs for each lanyard
5. Import and use the component

## Examples

Check out `LanyardExample.tsx` for practical implementation examples.

## Technical Details

- Uses Three.js with React Three Fiber
- Physics simulation with Rapier
- MeshLine for rope rendering
- Responsive design with window resize handling
- Interactive dragging with pointer events
- Click detection with time and movement thresholds
- Secure URL opening with proper attributes
