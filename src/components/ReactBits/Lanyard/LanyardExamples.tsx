import { FiveLanyards } from "./Lanyard";

// Example of how to use FiveLanyards with different GLB files
export function FiveLanyardsWithDifferentContent() {
  // Example GLB paths - replace these with your actual GLB files
  const customGLBs = [
    "/assets/others/card.glb", // Card 1
    "/assets/others/card.glb", // Card 2 (same for now, replace with different GLB)
    "/assets/others/card.glb", // Card 3 (same for now, replace with different GLB)
    "/assets/others/card.glb", // Card 4 (same for now, replace with different GLB)
    "/assets/others/card.glb", // Card 5 (same for now, replace with different GLB)
  ];

  return <FiveLanyards glbPaths={customGLBs} position={[0, 0, 20]} fov={25} />;
}

// Example with just the default five lanyards (all same height)
export function DefaultFiveLanyards() {
  return <FiveLanyards />;
}

/*
TO ADD DIFFERENT GLB CONTENT:

1. Add your GLB files to the public/assets/others/ directory:
   - card1.glb
   - card2.glb
   - card3.glb
   - card4.glb
   - card5.glb

2. Update the customGLBs array above:
   const customGLBs = [
     "/assets/others/card1.glb",
     "/assets/others/card2.glb", 
     "/assets/others/card3.glb",
     "/assets/others/card4.glb",
     "/assets/others/card5.glb",
   ];

3. Use the FiveLanyardsWithDifferentContent component in your page

FEATURES:
- All 5 lanyards have the same height (y-position)
- Each lanyard can have different GLB content
- Subtle color variations for visual distinction
- Interactive dragging on each lanyard
- Physics-based rope simulation
- Responsive design
*/
