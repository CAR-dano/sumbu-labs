/* eslint-disable react/no-unknown-property */
"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

// replace with your own imports, see the usage snippet for details
const defaultGLBs = [
  "/assets/others/Giga.glb",
  "/assets/others/Dzikran.glb", // You can replace these with different GLB files
  "/assets/others/Maul.glb",
  "/assets/others/Farhan.glb",
  "/assets/others/Azfar.glb",
];

// Default URLs for each lanyard - you can customize these
const defaultURLs = [
  "https://www.gigahidjrikaaa.my.id/gigzz", // Giga's profile
  "https://dzikran.sumbu.xyz", // Dzikran's profile
  "https://maul.sumbu.xyz", // Maul's profile
  "https://frhnn.my.id", // Farhan's profile (placeholder)
  "https://azfar.sumbu.xyz", // Azfar's profile (placeholder)
];

const lanyard = "/assets/others/lanyard.png";

extend({ MeshLineGeometry, MeshLineMaterial });

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  count?: number;
  glbPaths?: string[]; // Array of GLB file paths for different content
  urls?: string[]; // Array of URLs to redirect to when each lanyard is clicked
}

export default function Lanyard({
  position = [0, 0, 0],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  count = 1,
  glbPaths = defaultGLBs,
  urls = [], // Default empty array for URLs
}: LanyardProps) {
  return (
    <div className="relative z-0 w-full h-screen flex justify-center items-center transform scale-100 origin-center lg:flex hidden">
      <Canvas
        camera={{ position, fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          // Ensure orthographic-like projection to minimize perspective distortion
          camera.near = 0.1;
          camera.far = 1000;
        }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          {Array.from({ length: count }, (_, index) => (
            <Band
              key={index}
              index={index}
              totalCount={count}
              glbPath={glbPaths[index] || glbPaths[0]}
              url={urls[index]} // Pass URL for this specific lanyard
            />
          ))}
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  index?: number;
  totalCount?: number;
  glbPath?: string; // GLB file path for this specific lanyard
  url?: string; // URL to redirect to when clicked
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  index = 0,
  totalCount = 1,
  glbPath = defaultGLBs[0],
  url, // URL for this specific lanyard
}: BandProps) {
  // Using "any" for refs since the exact types depend on Rapier's internals
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: "dynamic" as RigidBodyProps["type"],
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(glbPath) as any;
  const texture = useTexture(lanyard);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState(0);
  const [mouseDownPosition, setMouseDownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [isSmall, setIsSmall] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Calculate position offset - ALL lanyards have IDENTICAL size and position
  const calculateOffset = (index: number, totalCount: number) => {
    const spreadX = 3.0; // Fixed horizontal spread - same for all
    const centerOffset = ((totalCount - 1) * spreadX) / 2;

    // ALL lanyards at EXACT same height and depth - NO variations
    const baseHeight = 0;
    const baseDepth = 0; // Same Z position for all to eliminate perspective differences

    // No rotation to ensure identical appearance
    const rotationY = 0;

    return {
      x: index * spreadX - centerOffset,
      y: baseHeight, // IDENTICAL height for ALL lanyards
      z: baseDepth, // IDENTICAL depth for ALL lanyards
      rotation: rotationY, // IDENTICAL rotation for ALL lanyards
    };
  };

  const offset = calculateOffset(index, totalCount);

  // Function to handle click (redirect to URL)
  const handleClick = () => {
    if (url && !isDragging) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Function to detect if mouse moved significantly (indicates drag)
  const hasMouseMoved = (currentPos: { x: number; y: number }) => {
    if (!mouseDownPosition) return false;
    const threshold = 5; // pixels
    const deltaX = Math.abs(currentPos.x - mouseDownPosition.x);
    const deltaY = Math.abs(currentPos.y - mouseDownPosition.y);
    return deltaX > threshold || deltaY > threshold;
  };

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  // Create more distinct color variations for each lanyard
  const getColorVariation = (index: number) => {
    const colors = [
      "#ffffff", // White
      "#e3f2fd", // Light blue
      "#f3e5f5", // Light purple
      "#e8f5e8", // Light green
      "#fff3e0", // Light orange
    ];
    return colors[index % colors.length];
  };

  const bandColor = totalCount > 1 ? getColorVariation(index) : "white";

  return (
    <>
      <group
        position={[offset.x, 4.6 + offset.y, offset.z]}
        rotation={[0, offset.rotation, 0]}
      >
        <RigidBody
          ref={fixed}
          {...segmentProps}
          type={"fixed" as RigidBodyProps["type"]}
        />
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={
            dragged
              ? ("kinematicPosition" as RigidBodyProps["type"])
              : ("dynamic" as RigidBodyProps["type"])
          }
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25} // Fixed scale for all lanyards
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              const currentTime = Date.now();
              const timeDiff = currentTime - mouseDownTime;
              const currentPos = { x: e.clientX, y: e.clientY };

              // Check if it's a click (short duration and minimal movement)
              if (timeDiff < 200 && !hasMouseMoved(currentPos)) {
                handleClick();
              }

              drag(false);
              setIsDragging(false);
              setMouseDownPosition(null);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              setMouseDownTime(Date.now());
              setMouseDownPosition({ x: e.clientX, y: e.clientY });
              setIsDragging(false);

              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
            onPointerMove={(e: any) => {
              if (dragged && mouseDownPosition) {
                const currentPos = { x: e.clientX, y: e.clientY };
                if (hasMouseMoved(currentPos)) {
                  setIsDragging(true);
                }
              }
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color={bandColor}
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-2, 1]} // Changed from -4 to -2 for less repetition
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

// Convenience component for 5 lanyards - ALL with IDENTICAL size and height
export function FiveLanyards({
  position = [0, 5, 35], // Increased distance to reduce perspective effect
  gravity = [0, -40, 0],
  fov = 15, // Reduced FOV for less perspective distortion
  transparent = true,
  glbPaths = defaultGLBs, // Use default GLBs or provide custom ones
  urls = defaultURLs, // Use default URLs or provide custom ones
}: Omit<LanyardProps, "count">) {
  return (
    <Lanyard
      position={position}
      gravity={gravity}
      fov={fov}
      transparent={transparent}
      count={5}
      glbPaths={glbPaths}
      urls={urls}
    />
  );
}
