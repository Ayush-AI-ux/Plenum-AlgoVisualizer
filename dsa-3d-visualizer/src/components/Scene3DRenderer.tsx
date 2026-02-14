// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";

// interface Scene3DProps {
//   sceneData: any;
// }

// export default function Scene3DRendererEnhanced({ sceneData }: Scene3DProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const objectsRef = useRef<THREE.Object3D[]>([]);
  
//   const [autoRotate, setAutoRotate] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
//   const rotationRef = useRef({ x: 0, y: 0 });
//   const zoomRef = useRef(1);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Cleanup previous renderer
//     if (rendererRef.current) {
//       rendererRef.current.dispose();
//       if (containerRef.current.contains(rendererRef.current.domElement)) {
//         containerRef.current.removeChild(rendererRef.current.domElement);
//       }
//     }

//     clearObjects();

//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0a0a0a);
//     sceneRef.current = scene;

//     // Camera setup
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       containerRef.current.clientWidth / containerRef.current.clientHeight,
//       0.1,
//       1000
//     );
    
//     const camPos = sceneData.camera?.position || [0, 5, 15];
//     camera.position.set(camPos[0] * 0.8, camPos[1] * 0.8, camPos[2] * 0.8);
    
//     if (sceneData.camera?.lookAt) {
//       const lookAt = sceneData.camera.lookAt;
//       camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]));
//     } else {
//       camera.lookAt(0, 0, 0);
//     }
//     cameraRef.current = camera;

//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({ 
//       antialias: true, 
//       alpha: false,
//     });
//     renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     containerRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // Enhanced lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);
    
//     const pointLight1 = new THREE.PointLight(0xffffff, 1.2);
//     pointLight1.position.set(10, 10, 10);
//     pointLight1.castShadow = true;
//     scene.add(pointLight1);
    
//     const pointLight2 = new THREE.PointLight(0x60a5fa, 0.6);
//     pointLight2.position.set(-10, 5, -5);
//     scene.add(pointLight2);
    
//     const pointLight3 = new THREE.PointLight(0xa855f7, 0.4);
//     pointLight3.position.set(0, -5, 10);
//     scene.add(pointLight3);

//     // Create 3D objects with animations
//     if (sceneData.objects) {
//       sceneData.objects.forEach((objData: any, index: number) => {
//         const obj = createObject(objData);
//         if (obj) {
//           obj.position.y -= 5;
//           obj.scale.set(0.1, 0.1, 0.1);
          
//           scene.add(obj);
//           objectsRef.current.push(obj);
          
//           animateObjectIn(obj, index * 100);
//         }
//       });
//     }

//     // Animation loop
//     let animationId: number;
//     const clock = new THREE.Clock();
    
//     const animate = () => {
//       animationId = requestAnimationFrame(animate);
      
//       // Auto-rotate
//       if (autoRotate) {
//         rotationRef.current.y += 0.005;
//       }
      
//       // Apply rotation to camera
//       const radius = Math.sqrt(
//         camera.position.x ** 2 + 
//         camera.position.z ** 2
//       );
//       camera.position.x = radius * Math.sin(rotationRef.current.y);
//       camera.position.z = radius * Math.cos(rotationRef.current.y);
//       camera.position.y += rotationRef.current.x * 0.1;
//       camera.lookAt(0, 0, 0);
      
//       // Animate rotating objects
//       objectsRef.current.forEach(obj => {
//         if (obj.userData.rotate) {
//           obj.rotation.y += 0.01;
//         }
        
//         if (obj.userData.highlight) {
//           const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.1 + 1;
//           obj.scale.setScalar(pulse);
//         }
//       });
      
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Mouse controls
//     const handleMouseDown = (e: MouseEvent) => {
//       setIsDragging(true);
//       setPreviousMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isDragging) return;
      
//       const deltaX = e.clientX - previousMousePosition.x;
//       const deltaY = e.clientY - previousMousePosition.y;
      
//       rotationRef.current.y += deltaX * 0.005;
//       rotationRef.current.x += deltaY * 0.005;
//       rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));
      
//       setPreviousMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//     };

//     const handleWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const zoomSpeed = 0.1;
//       zoomRef.current += e.deltaY > 0 ? zoomSpeed : -zoomSpeed;
//       zoomRef.current = Math.max(0.5, Math.min(2, zoomRef.current));
      
//       if (cameraRef.current) {
//         const camPos = sceneData.camera?.position || [0, 5, 15];
//         const scale = 0.8 / zoomRef.current;
//         cameraRef.current.position.set(
//           camPos[0] * scale,
//           camPos[1] * scale,
//           camPos[2] * scale
//         );
//       }
//     };

//     renderer.domElement.addEventListener('mousedown', handleMouseDown);
//     renderer.domElement.addEventListener('mousemove', handleMouseMove);
//     renderer.domElement.addEventListener('mouseup', handleMouseUp);
//     renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

//     // Handle resize
//     const handleResize = () => {
//       if (!containerRef.current || !camera || !renderer) return;
//       const width = containerRef.current.clientWidth;
//       const height = containerRef.current.clientHeight;
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//       renderer.setSize(width, height);
//     };
//     window.addEventListener("resize", handleResize);

//     // Cleanup
//     return () => {
//       cancelAnimationFrame(animationId);
//       window.removeEventListener("resize", handleResize);
      
//       renderer.domElement.removeEventListener('mousedown', handleMouseDown);
//       renderer.domElement.removeEventListener('mousemove', handleMouseMove);
//       renderer.domElement.removeEventListener('mouseup', handleMouseUp);
//       renderer.domElement.removeEventListener('wheel', handleWheel);
      
//       clearObjects();
      
//       if (sceneRef.current) {
//         sceneRef.current.clear();
//       }
      
//       if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
//         containerRef.current.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//     };
//   }, [sceneData, autoRotate, isDragging, previousMousePosition]);

//   const animateObjectIn = (obj: THREE.Object3D, delay: number) => {
//     setTimeout(() => {
//       const targetY = obj.position.y + 5;
//       const animate = () => {
//         if (obj.position.y < targetY) {
//           obj.position.y += 0.2;
//           obj.scale.x = Math.min(obj.scale.x + 0.05, 1);
//           obj.scale.y = Math.min(obj.scale.y + 0.05, 1);
//           obj.scale.z = Math.min(obj.scale.z + 0.05, 1);
//           requestAnimationFrame(animate);
//         }
//       };
//       animate();
//     }, delay);
//   };

//   const clearObjects = () => {
//     objectsRef.current.forEach(obj => {
//       if ((obj as any).geometry) (obj as any).geometry.dispose();
//       if ((obj as any).material) {
//         const mat = (obj as any).material;
//         if (Array.isArray(mat)) {
//           mat.forEach((m: any) => {
//             if (m.map) m.map.dispose();
//             m.dispose();
//           });
//         } else {
//           if (mat.map) mat.map.dispose();
//           mat.dispose();
//         }
//       }
//     });
//     objectsRef.current = [];
//   };

//   const createObject = (objData: any): THREE.Object3D | null => {
//     const { type } = objData;

//     switch (type) {
//       case "array":
//         return createArray(objData);
//       case "hashmap-container":
//         return createHashMapContainer(objData);
//       case "text-3d":
//         return createText3D(objData);
//       case "target-display":
//         return createTargetDisplay(objData);
//       case "container":
//         return createContainer(objData);
//       case "pointer-arrow":
//         return createPointerArrow(objData);
//       case "math-equation":
//         return createMathEquation(objData);
//       case "connection-arc":
//         return createConnectionArc(objData);
//       case "result-box":
//         return createResultBox(objData);
//       case "key-value-pair":
//         return createKeyValuePair(objData);
//       case "search-magnifier":
//       case "comparison-table":
//       case "hash-function-visualizer":
//       case "array-buckets":
//       case "arrow-flow":
//       case "checkmark-icon":
//       case "particle-trail":
//       case "connection-line":
//       case "result-display":
//       case "complexity-card":
//         return createPlaceholder(objData);
//       default:
//         console.warn(`Unknown object type: ${type}`);
//         return null;
//     }
//   };

//   const createArray = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { values, positions, highlights = [], highlightColor = "#22c55e", boxColor = "#3b82f6" } = data;

//     values.forEach((value: number, index: number) => {
//       const pos = positions[index];
//       const isHighlighted = highlights.includes(index);

//       const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
//       const material = new THREE.MeshStandardMaterial({
//         color: isHighlighted ? highlightColor : boxColor,
//         emissive: isHighlighted ? highlightColor : boxColor,
//         emissiveIntensity: isHighlighted ? 0.6 : 0.2,
//         metalness: 0.3,
//         roughness: 0.5,
//       });
//       const box = new THREE.Mesh(geometry, material);
//       box.position.set(pos[0], pos[1], pos[2]);
//       box.castShadow = true;
//       box.receiveShadow = true;
      
//       if (isHighlighted) {
//         box.userData.highlight = true;
//       }
      
//       group.add(box);

//       const edges = new THREE.EdgesGeometry(geometry);
//       const lineMat = new THREE.LineBasicMaterial({ 
//         color: isHighlighted ? highlightColor : "#60a5fa",
//       });
//       const wireframe = new THREE.LineSegments(edges, lineMat);
//       wireframe.position.set(pos[0], pos[1], pos[2]);
//       group.add(wireframe);

//       if (isHighlighted) {
//         const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
//         const glowMaterial = new THREE.MeshBasicMaterial({
//           color: highlightColor,
//           transparent: true,
//           opacity: 0.2,
//         });
//         const glow = new THREE.Mesh(glowGeometry, glowMaterial);
//         glow.position.set(pos[0], pos[1], pos[2]);
//         group.add(glow);
//       }

//       const valueSprite = createTextSprite(String(value), '#ffffff', 120);
//       valueSprite.position.set(pos[0], pos[1], pos[2] + 1);
//       valueSprite.scale.set(2, 2, 1);
//       group.add(valueSprite);

//       const indexSprite = createTextSprite(`[${index}]`, '#60a5fa', 100);
//       indexSprite.position.set(pos[0], pos[1] - 1.8, pos[2]);
//       indexSprite.scale.set(2.5, 1.25, 1);
//       group.add(indexSprite);
//     });

//     return group;
//   };

//   const createHashMapContainer = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { position, size = [4, 5, 1.5], opacity = 0.25, contents = [], label } = data;

//     const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
//     const material = new THREE.MeshStandardMaterial({
//       color: "#6366f1",
//       transparent: true,
//       opacity: opacity,
//       emissive: "#4338ca",
//       emissiveIntensity: 0.2,
//     });
//     const box = new THREE.Mesh(geometry, material);
//     box.position.set(position[0], position[1], position[2]);
//     box.receiveShadow = true;
//     group.add(box);

//     const edges = new THREE.EdgesGeometry(geometry);
//     const lineMat = new THREE.LineBasicMaterial({ color: "#818cf8" });
//     const wireframe = new THREE.LineSegments(edges, lineMat);
//     wireframe.position.set(position[0], position[1], position[2]);
//     group.add(wireframe);

//     if (label) {
//       const labelSprite = createTextSprite(label, '#a5b4fc', 56);
//       labelSprite.position.set(position[0] + size[0]/2 + 2, position[1] + 1, position[2]);
//       labelSprite.scale.set(4, 2, 1);
//       group.add(labelSprite);
//     }

//     contents.forEach((item: any, index: number) => {
//       const kvText = `${item.key} → ${item.value}`;
//       const kvSprite = createTextSprite(kvText, item.glow ? '#22c55e' : '#ffffff', 80);
//       const yPos = position[1] + 1.5 - (index * 1.2);
//       kvSprite.position.set(position[0], yPos, position[2] + 1);
//       kvSprite.scale.set(4, 2, 1);
//       group.add(kvSprite);
//     });

//     return group;
//   };

//   const createText3D = (data: any): THREE.Sprite => {
//     const { text, color = "#ffffff", size = 0.5, position = [0, 0, 0] } = data;
//     const sprite = createTextSprite(text, color, Math.floor(size * 100));
//     sprite.position.set(position[0], position[1], position[2]);
//     sprite.scale.set(size * 6, size * 3, 1);
//     return sprite;
//   };

//   const createPointerArrow = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { position, label = "→" } = data;

//     const geometry = new THREE.ConeGeometry(0.5, 1.5, 8);
//     const material = new THREE.MeshStandardMaterial({
//       color: "#fbbf24",
//       emissive: "#f59e0b",
//       emissiveIntensity: 0.7,
//     });
//     const cone = new THREE.Mesh(geometry, material);
//     cone.position.set(position[0], position[1], position[2]);
//     cone.rotation.x = Math.PI;
//     cone.castShadow = true;
//     group.add(cone);

//     const labelSprite = createTextSprite(label, '#fbbf24', 60);
//     labelSprite.position.set(position[0], position[1] + 2.5, position[2]);
//     labelSprite.scale.set(2.5, 1.25, 1);
//     group.add(labelSprite);

//     return group;
//   };

//   const createTargetDisplay = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { value, position, color = "#FFD700" } = data;

//     const geometry = new THREE.SphereGeometry(0.8, 32, 32);
//     const material = new THREE.MeshStandardMaterial({
//       color: color,
//       emissive: color,
//       emissiveIntensity: 0.8,
//       metalness: 0.5,
//       roughness: 0.2,
//     });
//     const sphere = new THREE.Mesh(geometry, material);
//     sphere.position.set(position[0], position[1], position[2]);
//     sphere.castShadow = true;
//     group.add(sphere);

//     const sprite = createTextSprite(String(value), '#000000', 80);
//     sprite.position.set(position[0], position[1], position[2] + 0.9);
//     sprite.scale.set(1.5, 1.5, 1);
//     group.add(sprite);

//     group.userData.rotate = true;

//     return group;
//   };

//   const createContainer = (data: any): THREE.Mesh => {
//     const { position, size, color = "#3b82f6", opacity = 0.3 } = data;
//     const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
//     const material = new THREE.MeshStandardMaterial({
//       color: color,
//       transparent: true,
//       opacity: opacity,
//       emissive: color,
//       emissiveIntensity: 0.2,
//     });
//     const box = new THREE.Mesh(geometry, material);
//     box.position.set(position[0], position[1], position[2]);
//     return box;
//   };

//   const createMathEquation = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { parts, position } = data;

//     let xOffset = 0;
//     parts.forEach((part: any) => {
//       const sprite = createTextSprite(part.value, part.color, 48);
//       sprite.position.set(position[0] + xOffset, position[1], position[2]);
//       sprite.scale.set(1.5, 0.75, 1);
//       group.add(sprite);
//       xOffset += 0.8;
//     });

//     return group;
//   };

//   const createConnectionArc = (data: any): THREE.Line => {
//     const { from, to, color = "#22c55e" } = data;
    
//     const curve = new THREE.QuadraticBezierCurve3(
//       new THREE.Vector3(from[0], from[1], from[2]),
//       new THREE.Vector3((from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 2, (from[2] + to[2]) / 2),
//       new THREE.Vector3(to[0], to[1], to[2])
//     );

//     const points = curve.getPoints(50);
//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//     const material = new THREE.LineBasicMaterial({ color });
//     const line = new THREE.Line(geometry, material);

//     return line;
//   };

//   const createResultBox = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { position, content, color = "#22c55e", size = 1.5 } = data;

//     const geometry = new THREE.BoxGeometry(size * 2, size, size);
//     const material = new THREE.MeshStandardMaterial({
//       color: color,
//       emissive: color,
//       emissiveIntensity: 0.5,
//     });
//     const box = new THREE.Mesh(geometry, material);
//     box.position.set(position[0], position[1], position[2]);
//     box.castShadow = true;
//     group.add(box);

//     const sprite = createTextSprite(content, '#ffffff', 120);
//     sprite.position.set(position[0], position[1], position[2] + size/2 + 0.2);
//     sprite.scale.set(4, 2, 1);
//     group.add(sprite);

//     group.userData.rotate = true;

//     return group;
//   };

//   const createKeyValuePair = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { key, value, position } = data;

//     const geometry = new THREE.BoxGeometry(2.5, 1.2, 0.5);
//     const material = new THREE.MeshStandardMaterial({
//       color: "#a855f7",
//       emissive: "#a855f7",
//       emissiveIntensity: 0.5,
//     });
//     const box = new THREE.Mesh(geometry, material);
    
//     const pos = position || [0, 0, 0];
//     box.position.set(pos[0], pos[1], pos[2]);
//     group.add(box);

//     const text = `${key} → ${value}`;
//     const sprite = createTextSprite(text, '#ffffff', 80);
//     sprite.position.set(pos[0], pos[1], pos[2] + 0.3);
//     sprite.scale.set(3, 1.5, 1);
//     group.add(sprite);

//     return group;
//   };

//   const createPlaceholder = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { position = [0, 0, 0] } = data;

//     const geometry = new THREE.SphereGeometry(0.2, 16, 16);
//     const material = new THREE.MeshStandardMaterial({
//       color: "#60a5fa",
//       emissive: "#60a5fa",
//       emissiveIntensity: 0.5,
//       transparent: true,
//       opacity: 0.3,
//     });
//     const sphere = new THREE.Mesh(geometry, material);
//     sphere.position.set(position[0], position[1], position[2]);
//     group.add(sphere);

//     return group;
//   };

//   const createTextSprite = (text: string, color: string, fontSize: number): THREE.Sprite => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 1024;
//     canvas.height = 512;
//     const ctx = canvas.getContext('2d')!;
    
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = 'high';
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     ctx.fillStyle = color;
//     ctx.font = `bold ${fontSize}px Arial, sans-serif`;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
    
//     ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
//     ctx.shadowBlur = 4;
//     ctx.shadowOffsetX = 2;
//     ctx.shadowOffsetY = 2;
    
//     ctx.fillText(text, 512, 256);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     texture.minFilter = THREE.LinearFilter;
//     texture.magFilter = THREE.LinearFilter;
    
//     const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
//     return new THREE.Sprite(material);
//   };

//   const handleZoomIn = () => {
//     zoomRef.current = Math.min(zoomRef.current + 0.2, 2);
//     if (cameraRef.current) {
//       const camPos = sceneData.camera?.position || [0, 5, 15];
//       const scale = 0.8 / zoomRef.current;
//       cameraRef.current.position.set(
//         camPos[0] * scale,
//         camPos[1] * scale,
//         camPos[2] * scale
//       );
//     }
//   };

//   const handleZoomOut = () => {
//     zoomRef.current = Math.max(zoomRef.current - 0.2, 0.5);
//     if (cameraRef.current) {
//       const camPos = sceneData.camera?.position || [0, 5, 15];
//       const scale = 0.8 / zoomRef.current;
//       cameraRef.current.position.set(
//         camPos[0] * scale,
//         camPos[1] * scale,
//         camPos[2] * scale
//       );
//     }
//   };

//   const handleResetCamera = () => {
//     rotationRef.current = { x: 0, y: 0 };
//     zoomRef.current = 1;
//     if (cameraRef.current) {
//       const camPos = sceneData.camera?.position || [0, 5, 15];
//       cameraRef.current.position.set(camPos[0] * 0.8, camPos[1] * 0.8, camPos[2] * 0.8);
//       cameraRef.current.lookAt(0, 0, 0);
//     }
//   };

//   return (
//     <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//       <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />

//       {/* Camera Controls UI */}
//       <div style={{
//         position: 'absolute',
//         bottom: '20px',
//         right: '20px',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '10px',
//         zIndex: 10
//       }}>
//         <button onClick={handleZoomIn} style={{
//           padding: '12px', backgroundColor: 'rgba(59, 130, 246, 0.9)', border: 'none',
//           borderRadius: '8px', color: 'white', fontSize: '20px', cursor: 'pointer',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s'
//         }} title="Zoom In">🔍+</button>

//         <button onClick={handleZoomOut} style={{
//           padding: '12px', backgroundColor: 'rgba(59, 130, 246, 0.9)', border: 'none',
//           borderRadius: '8px', color: 'white', fontSize: '20px', cursor: 'pointer',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s'
//         }} title="Zoom Out">🔍-</button>

//         <button onClick={handleResetCamera} style={{
//           padding: '12px', backgroundColor: 'rgba(168, 85, 247, 0.9)', border: 'none',
//           borderRadius: '8px', color: 'white', fontSize: '16px', cursor: 'pointer',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s'
//         }} title="Reset View">🎯</button>

//         <button onClick={() => setAutoRotate(!autoRotate)} style={{
//           padding: '12px',
//           backgroundColor: autoRotate ? 'rgba(34, 197, 94, 0.9)' : 'rgba(107, 114, 128, 0.9)',
//           border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px',
//           cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
//           transition: 'transform 0.2s'
//         }} title={autoRotate ? "Stop Rotation" : "Auto Rotate"}>
//           {autoRotate ? '⏸️' : '🔄'}
//         </button>
//       </div>

//       {/* Instructions */}
//       <div style={{
//         position: 'absolute', top: '10px', left: '10px',
//         backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '12px 16px',
//         borderRadius: '8px', color: 'white', fontSize: '12px', zIndex: 10,
//         backdropFilter: 'blur(10px)'
//       }}>
//         <div style={{ marginBottom: '4px', fontWeight: '600' }}>🖱️ Controls:</div>
//         <div>• Click + drag: Rotate</div>
//         <div>• Scroll: Zoom</div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";

// interface Scene3DProps {
//   sceneData: any;
// }

// export default function Scene3DRendererEnhanced({ sceneData }: Scene3DProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const objectsRef = useRef<THREE.Object3D[]>([]);
  
//   const [autoRotate, setAutoRotate] = useState(false);
//   const rotationRef = useRef({ x: 0, y: 0 });
//   const zoomRef = useRef(1);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Cleanup previous renderer
//     if (rendererRef.current) {
//       rendererRef.current.dispose();
//       if (containerRef.current.contains(rendererRef.current.domElement)) {
//         containerRef.current.removeChild(rendererRef.current.domElement);
//       }
//     }

//     clearObjects();

//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0a0a0a);
//     sceneRef.current = scene;

//     // Camera setup
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       containerRef.current.clientWidth / containerRef.current.clientHeight,
//       0.1,
//       1000
//     );
    
//     const camPos = sceneData.camera?.position || [0, 5, 15];
//     camera.position.set(camPos[0] * 0.8, camPos[1] * 0.8, camPos[2] * 0.8);
    
//     if (sceneData.camera?.lookAt) {
//       const lookAt = sceneData.camera.lookAt;
//       camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]));
//     } else {
//       camera.lookAt(0, 0, 0);
//     }
//     cameraRef.current = camera;

//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({ 
//       antialias: true, 
//       alpha: false,
//     });
//     renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     containerRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // Enhanced lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);
    
//     const pointLight1 = new THREE.PointLight(0xffffff, 1.2);
//     pointLight1.position.set(10, 10, 10);
//     pointLight1.castShadow = true;
//     scene.add(pointLight1);
    
//     const pointLight2 = new THREE.PointLight(0x60a5fa, 0.6);
//     pointLight2.position.set(-10, 5, -5);
//     scene.add(pointLight2);
    
//     const pointLight3 = new THREE.PointLight(0xa855f7, 0.4);
//     pointLight3.position.set(0, -5, 10);
//     scene.add(pointLight3);

//     // Create 3D objects with animations
//     if (sceneData.objects) {
//       sceneData.objects.forEach((objData: any, index: number) => {
//         const obj = createObject(objData);
//         if (obj) {
//           obj.position.y -= 5;
//           obj.scale.set(0.1, 0.1, 0.1);
          
//           scene.add(obj);
//           objectsRef.current.push(obj);
          
//           animateObjectIn(obj, index * 100);
//         }
//       });
//     }

//     // Animation loop
//     let animationId: number;
//     const clock = new THREE.Clock();
    
//     const animate = () => {
//       animationId = requestAnimationFrame(animate);
      
//       // Auto-rotate
//       if (autoRotate) {
//         rotationRef.current.y += 0.005;
//       }
      
//       // Apply rotation to camera
//       const radius = Math.sqrt(
//         camera.position.x ** 2 + 
//         camera.position.z ** 2
//       );
//       camera.position.x = radius * Math.sin(rotationRef.current.y);
//       camera.position.z = radius * Math.cos(rotationRef.current.y);
//       camera.position.y += rotationRef.current.x * 0.1;
//       camera.lookAt(0, 0, 0);
      
//       // Animate rotating objects and make sprites face camera
//       objectsRef.current.forEach(obj => {
//         if (obj.userData.rotate) {
//           obj.rotation.y += 0.01;
//         }
        
//         if (obj.userData.highlight) {
//           const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.1 + 1;
//           obj.scale.setScalar(pulse);
//         }

//         // Make all sprites always face the camera
//         obj.traverse((child) => {
//           if (child instanceof THREE.Sprite) {
//             child.lookAt(camera.position);
//           }
//         });
//       });
      
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Handle resize
//     const handleResize = () => {
//       if (!containerRef.current || !camera || !renderer) return;
//       const width = containerRef.current.clientWidth;
//       const height = containerRef.current.clientHeight;
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//       renderer.setSize(width, height);
//     };
//     window.addEventListener("resize", handleResize);

//     // Cleanup
//     return () => {
//       cancelAnimationFrame(animationId);
//       window.removeEventListener("resize", handleResize);
      
//       clearObjects();
      
//       if (sceneRef.current) {
//         sceneRef.current.clear();
//       }
      
//       if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
//         containerRef.current.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//     };
//   }, [sceneData, autoRotate]);

//   const animateObjectIn = (obj: THREE.Object3D, delay: number) => {
//     setTimeout(() => {
//       const targetY = obj.position.y + 5;
//       const animate = () => {
//         if (obj.position.y < targetY) {
//           obj.position.y += 0.2;
//           obj.scale.x = Math.min(obj.scale.x + 0.05, 1);
//           obj.scale.y = Math.min(obj.scale.y + 0.05, 1);
//           obj.scale.z = Math.min(obj.scale.z + 0.05, 1);
//           requestAnimationFrame(animate);
//         }
//       };
//       animate();
//     }, delay);
//   };

//   const clearObjects = () => {
//     objectsRef.current.forEach(obj => {
//       if ((obj as any).geometry) (obj as any).geometry.dispose();
//       if ((obj as any).material) {
//         const mat = (obj as any).material;
//         if (Array.isArray(mat)) {
//           mat.forEach((m: any) => {
//             if (m.map) m.map.dispose();
//             m.dispose();
//           });
//         } else {
//           if (mat.map) mat.map.dispose();
//           mat.dispose();
//         }
//       }
//     });
//     objectsRef.current = [];
//   };

//   const createObject = (objData: any): THREE.Object3D | null => {
//     const { type } = objData;

//     switch (type) {
//       case "array":
//         return createArray(objData);
//       case "hashmap-container":
//         return createHashMapContainer(objData);
//       case "text-3d":
//         return createText3D(objData);
//       case "target-display":
//         return createTargetDisplay(objData);
//       case "container":
//         return createContainer(objData);
//       case "pointer-arrow":
//         return createPointerArrow(objData);
//       case "math-equation":
//         return createMathEquation(objData);
//       case "connection-arc":
//         return createConnectionArc(objData);
//       case "result-box":
//         return createResultBox(objData);
//       case "key-value-pair":
//         return createKeyValuePair(objData);
//       case "search-magnifier":
//       case "comparison-table":
//       case "hash-function-visualizer":
//       case "array-buckets":
//       case "arrow-flow":
//       case "checkmark-icon":
//       case "particle-trail":
//       case "connection-line":
//       case "result-display":
//       case "complexity-card":
//         return createPlaceholder(objData);
//       default:
//         console.warn(`Unknown object type: ${type}`);
//         return null;
//     }
//   };

//   const createArray = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { values, positions, highlights = [], highlightColor = "#22c55e", boxColor = "#3b82f6" } = data;

//     values.forEach((value: number, index: number) => {
//       const pos = positions[index];
//       const isHighlighted = highlights.includes(index);

//       const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
//       const material = new THREE.MeshStandardMaterial({
//         color: isHighlighted ? highlightColor : boxColor,
//         emissive: isHighlighted ? highlightColor : boxColor,
//         emissiveIntensity: isHighlighted ? 0.6 : 0.2,
//         metalness: 0.3,
//         roughness: 0.5,
//       });
//       const box = new THREE.Mesh(geometry, material);
//       box.position.set(pos[0], pos[1], pos[2]);
//       box.castShadow = true;
//       box.receiveShadow = true;
      
//       if (isHighlighted) {
//         box.userData.highlight = true;
//       }
      
//       group.add(box);

//       const edges = new THREE.EdgesGeometry(geometry);
//       const lineMat = new THREE.LineBasicMaterial({ 
//         color: isHighlighted ? highlightColor : "#60a5fa",
//       });
//       const wireframe = new THREE.LineSegments(edges, lineMat);
//       wireframe.position.set(pos[0], pos[1], pos[2]);
//       group.add(wireframe);

//       if (isHighlighted) {
//         const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
//         const glowMaterial = new THREE.MeshBasicMaterial({
//           color: highlightColor,
//           transparent: true,
//           opacity: 0.2,
//         });
//         const glow = new THREE.Mesh(glowGeometry, glowMaterial);
//         glow.position.set(pos[0], pos[1], pos[2]);
//         group.add(glow);
//       }

//       const valueSprite = createTextSprite(String(value), '#ffffff', 160);
//       valueSprite.position.set(pos[0], pos[1], pos[2] + 0.8);
//       valueSprite.scale.set(3, 3, 1);
//       group.add(valueSprite);

//       const indexSprite = createTextSprite(`[${index}]`, '#60a5fa', 140);
//       indexSprite.position.set(pos[0], pos[1] - 1.5, pos[2]);
//       indexSprite.scale.set(2.5, 2.5, 1);
//       group.add(indexSprite);
//     });

//     return group;
//   };

//   const createHashMapContainer = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { position, size = [4, 5, 1.5], opacity = 0.25, contents = [], label } = data;

//     const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
//     const material = new THREE.MeshStandardMaterial({
//       color: "#6366f1",
//       transparent: true,
//       opacity: opacity,
//       emissive: "#4338ca",
//       emissiveIntensity: 0.2,
//     });
//     const box = new THREE.Mesh(geometry, material);
//     box.position.set(position[0], position[1], position[2]);
//     box.receiveShadow = true;
//     group.add(box);

//     const edges = new THREE.EdgesGeometry(geometry);
//     const lineMat = new THREE.LineBasicMaterial({ color: "#818cf8" });
//     const wireframe = new THREE.LineSegments(edges, lineMat);
//     wireframe.position.set(position[0], position[1], position[2]);
//     group.add(wireframe);

//     if (label) {
//       const labelSprite = createTextSprite(label, '#a5b4fc', 120);
//       labelSprite.position.set(position[0] + size[0]/2 + 2.5, position[1] + 1, position[2]);
//       labelSprite.scale.set(4, 3, 1);
//       group.add(labelSprite);
//     }

//     contents.forEach((item: any, index: number) => {
//       const kvText = `${item.key} → ${item.value}`;
//       const kvSprite = createTextSprite(kvText, item.glow ? '#22c55e' : '#ffffff', 120);
//       const yPos = position[1] + 1.5 - (index * 1.2);
//       kvSprite.position.set(position[0], yPos, position[2] + 0.8);
//       kvSprite.scale.set(4, 3, 1);
//       group.add(kvSprite);
//     });

//     return group;
//   };

//   const createText3D = (data: any): THREE.Sprite => {
//     const { text, color = "#ffffff", size = 0.5, position = [0, 0, 0] } = data;
//     const sprite = createTextSprite(text, color, Math.floor(size * 180));
//     sprite.position.set(position[0], position[1], position[2]);
//     sprite.scale.set(size * 8, size * 4, 1);
//     return sprite;
//   };

//   const createPointerArrow = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { position, label = "→" } = data;

//     const geometry = new THREE.ConeGeometry(0.5, 1.5, 8);
//     const material = new THREE.MeshStandardMaterial({
//       color: "#fbbf24",
//       emissive: "#f59e0b",
//       emissiveIntensity: 0.7,
//     });
//     const cone = new THREE.Mesh(geometry, material);
//     cone.position.set(position[0], position[1], position[2]);
//     cone.rotation.x = Math.PI;
//     cone.castShadow = true;
//     group.add(cone);

//     const labelSprite = createTextSprite(label, '#fbbf24', 100);
//     labelSprite.position.set(position[0], position[1] + 2.5, position[2]);
//     labelSprite.scale.set(3, 2, 1);
//     group.add(labelSprite);

//     return group;
//   };

//   const createTargetDisplay = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { value, position, color = "#FFD700" } = data;

//     const geometry = new THREE.SphereGeometry(0.8, 32, 32);
//     const material = new THREE.MeshStandardMaterial({
//       color: color,
//       emissive: color,
//       emissiveIntensity: 0.8,
//       metalness: 0.5,
//       roughness: 0.2,
//     });
//     const sphere = new THREE.Mesh(geometry, material);
//     sphere.position.set(position[0], position[1], position[2]);
//     sphere.castShadow = true;
//     group.add(sphere);

//     const sprite = createTextSprite(String(value), '#000000', 140);
//     sprite.position.set(position[0], position[1], position[2] + 0.9);
//     sprite.scale.set(2.5, 2.5, 1);
//     group.add(sprite);

//     group.userData.rotate = true;

//     return group;
//   };

//   const createContainer = (data: any): THREE.Mesh => {
//     const { position, size, color = "#3b82f6", opacity = 0.3 } = data;
//     const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
//     const material = new THREE.MeshStandardMaterial({
//       color: color,
//       transparent: true,
//       opacity: opacity,
//       emissive: color,
//       emissiveIntensity: 0.2,
//     });
//     const box = new THREE.Mesh(geometry, material);
//     box.position.set(position[0], position[1], position[2]);
//     return box;
//   };

//   const createMathEquation = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { parts, position } = data;

//     let xOffset = 0;
//     parts.forEach((part: any) => {
//       const sprite = createTextSprite(part.value, part.color, 100);
//       sprite.position.set(position[0] + xOffset, position[1], position[2]);
//       sprite.scale.set(2.5, 2, 1);
//       group.add(sprite);
//       xOffset += part.value.length * 0.35 + 0.35;
//     });

//     return group;
//   };

//   const createConnectionArc = (data: any): THREE.Line => {
//     const { from, to, color = "#22c55e" } = data;
    
//     const curve = new THREE.QuadraticBezierCurve3(
//       new THREE.Vector3(from[0], from[1], from[2]),
//       new THREE.Vector3((from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 2, (from[2] + to[2]) / 2),
//       new THREE.Vector3(to[0], to[1], to[2])
//     );

//     const points = curve.getPoints(50);
//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//     const material = new THREE.LineBasicMaterial({ color, linewidth: 2 });
//     const line = new THREE.Line(geometry, material);

//     return line;
//   };

//   const createResultBox = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { position, content, color = "#22c55e", size = 1.5 } = data;

//     const geometry = new THREE.BoxGeometry(size * 2, size, size);
//     const material = new THREE.MeshStandardMaterial({
//       color: color,
//       emissive: color,
//       emissiveIntensity: 0.5,
//     });
//     const box = new THREE.Mesh(geometry, material);
//     box.position.set(position[0], position[1], position[2]);
//     box.castShadow = true;
//     group.add(box);

//     const sprite = createTextSprite(content, '#ffffff', 160);
//     sprite.position.set(position[0], position[1], position[2] + size/2 + 0.3);
//     sprite.scale.set(5, 3, 1);
//     group.add(sprite);

//     group.userData.rotate = true;

//     return group;
//   };

//   const createKeyValuePair = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { key, value, position } = data;

//     const geometry = new THREE.BoxGeometry(2.5, 1.2, 0.5);
//     const material = new THREE.MeshStandardMaterial({
//       color: "#a855f7",
//       emissive: "#a855f7",
//       emissiveIntensity: 0.5,
//     });
//     const box = new THREE.Mesh(geometry, material);
    
//     const pos = position || [0, 0, 0];
//     box.position.set(pos[0], pos[1], pos[2]);
//     group.add(box);

//     const text = `${key} → ${value}`;
//     const sprite = createTextSprite(text, '#ffffff', 120);
//     sprite.position.set(pos[0], pos[1], pos[2] + 0.3);
//     sprite.scale.set(4, 2.5, 1);
//     group.add(sprite);

//     return group;
//   };

//   const createPlaceholder = (data: any): THREE.Group => {
//     const group = new THREE.Group();
//     const { position = [0, 0, 0] } = data;

//     const geometry = new THREE.SphereGeometry(0.2, 16, 16);
//     const material = new THREE.MeshStandardMaterial({
//       color: "#60a5fa",
//       emissive: "#60a5fa",
//       emissiveIntensity: 0.5,
//       transparent: true,
//       opacity: 0.3,
//     });
//     const sphere = new THREE.Mesh(geometry, material);
//     sphere.position.set(position[0], position[1], position[2]);
//     group.add(sphere);

//     return group;
//   };

//   const createTextSprite = (text: string, color: string, fontSize: number): THREE.Sprite => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 1536;
//     canvas.height = 768;
//     const ctx = canvas.getContext('2d')!;
    
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = 'high';
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     // Add semi-transparent background for better visibility
//     ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
//     ctx.font = `bold ${fontSize}px Arial, sans-serif`;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     const textMetrics = ctx.measureText(text);
//     const padding = 20;
//     const bgX = 768 - textMetrics.width / 2 - padding;
//     const bgY = 384 - fontSize / 2 - padding;
//     const bgWidth = textMetrics.width + padding * 2;
//     const bgHeight = fontSize + padding * 2;
//     ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 12);
//     ctx.fill();
    
//     // Draw text with shadow
//     ctx.fillStyle = color;
//     ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
//     ctx.shadowBlur = 6;
//     ctx.shadowOffsetX = 3;
//     ctx.shadowOffsetY = 3;
    
//     ctx.fillText(text, 768, 384);
    
//     // Add stroke for clarity
//     ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
//     ctx.lineWidth = 3;
//     ctx.shadowBlur = 0;
//     ctx.strokeText(text, 768, 384);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     texture.minFilter = THREE.LinearFilter;
//     texture.magFilter = THREE.LinearFilter;
    
//     const material = new THREE.SpriteMaterial({ 
//       map: texture, 
//       transparent: true,
//       depthTest: true,
//       depthWrite: false
//     });
//     return new THREE.Sprite(material);
//   };

//   const handleZoomIn = () => {
//     zoomRef.current = Math.min(zoomRef.current + 0.2, 2);
//     if (cameraRef.current) {
//       const camPos = sceneData.camera?.position || [0, 5, 15];
//       const scale = 0.8 / zoomRef.current;
//       cameraRef.current.position.set(
//         camPos[0] * scale,
//         camPos[1] * scale,
//         camPos[2] * scale
//       );
//     }
//   };

//   const handleZoomOut = () => {
//     zoomRef.current = Math.max(zoomRef.current - 0.2, 0.5);
//     if (cameraRef.current) {
//       const camPos = sceneData.camera?.position || [0, 5, 15];
//       const scale = 0.8 / zoomRef.current;
//       cameraRef.current.position.set(
//         camPos[0] * scale,
//         camPos[1] * scale,
//         camPos[2] * scale
//       );
//     }
//   };

//   const handleResetCamera = () => {
//     rotationRef.current = { x: 0, y: 0 };
//     zoomRef.current = 1;
//     if (cameraRef.current) {
//       const camPos = sceneData.camera?.position || [0, 5, 15];
//       cameraRef.current.position.set(camPos[0] * 0.8, camPos[1] * 0.8, camPos[2] * 0.8);
//       cameraRef.current.lookAt(0, 0, 0);
//     }
//   };

//   return (
//     <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//       <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />

//       {/* Camera Controls UI */}
//       <div style={{
//         position: 'absolute',
//         bottom: '20px',
//         right: '20px',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '10px',
//         zIndex: 10
//       }}>
//         <button onClick={handleZoomIn} style={{
//           padding: '14px', backgroundColor: 'rgba(59, 130, 246, 0.95)', border: 'none',
//           borderRadius: '10px', color: 'white', fontSize: '22px', cursor: 'pointer',
//           boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)', transition: 'all 0.2s',
//           fontWeight: 'bold', minWidth: '50px'
//         }} 
//         onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//         onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//         title="Zoom In">🔍+</button>

//         <button onClick={handleZoomOut} style={{
//           padding: '14px', backgroundColor: 'rgba(59, 130, 246, 0.95)', border: 'none',
//           borderRadius: '10px', color: 'white', fontSize: '22px', cursor: 'pointer',
//           boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)', transition: 'all 0.2s',
//           fontWeight: 'bold', minWidth: '50px'
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//         onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//         title="Zoom Out">🔍-</button>

//         <button onClick={handleResetCamera} style={{
//           padding: '14px', backgroundColor: 'rgba(168, 85, 247, 0.95)', border: 'none',
//           borderRadius: '10px', color: 'white', fontSize: '22px', cursor: 'pointer',
//           boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)', transition: 'all 0.2s',
//           fontWeight: 'bold', minWidth: '50px'
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//         onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//         title="Reset View">🎯</button>

//         <button onClick={() => setAutoRotate(!autoRotate)} style={{
//           padding: '14px',
//           backgroundColor: autoRotate ? 'rgba(34, 197, 94, 0.95)' : 'rgba(107, 114, 128, 0.95)',
//           border: 'none', borderRadius: '10px', color: 'white', fontSize: '22px',
//           cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
//           transition: 'all 0.2s', fontWeight: 'bold', minWidth: '50px'
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//         onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//         title={autoRotate ? "Stop Rotation" : "Auto Rotate"}>
//           {autoRotate ? '⏸️' : '🔄'}
//         </button>
//       </div>

//       {/* Instructions */}
//       <div style={{
//         position: 'absolute', top: '15px', left: '15px',
//         backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '14px 18px',
//         borderRadius: '10px', color: 'white', fontSize: '13px', zIndex: 10,
//         backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)'
//       }}>
//         <div style={{ marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>🎮 Controls:</div>
//         <div style={{ lineHeight: '1.6' }}>• Zoom In/Out</div>
//         <div style={{ lineHeight: '1.6' }}>• Reset View</div>
//         <div style={{ lineHeight: '1.6' }}>• Auto Rotate</div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Scene3DProps {
  sceneData: any;
}

export default function Scene3DRendererEnhanced({ sceneData }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<THREE.Object3D[]>([]);
  
  const [autoRotate, setAutoRotate] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    }

    clearObjects();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    const camPos = sceneData.camera?.position || [0, 5, 15];
    camera.position.set(camPos[0] * 0.8, camPos[1] * 0.8, camPos[2] * 0.8);
    
    if (sceneData.camera?.lookAt) {
      const lookAt = sceneData.camera.lookAt;
      camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]));
    } else {
      camera.lookAt(0, 0, 0);
    }
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 1.2);
    pointLight1.position.set(10, 10, 10);
    pointLight1.castShadow = true;
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x60a5fa, 0.6);
    pointLight2.position.set(-10, 5, -5);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xa855f7, 0.4);
    pointLight3.position.set(0, -5, 10);
    scene.add(pointLight3);

    // Create 3D objects with animations
    if (sceneData.objects) {
      sceneData.objects.forEach((objData: any, index: number) => {
        const obj = createObject(objData);
        if (obj) {
          obj.position.y -= 5;
          obj.scale.set(0.1, 0.1, 0.1);
          
          scene.add(obj);
          objectsRef.current.push(obj);
          
          animateObjectIn(obj, index * 100);
        }
      });
    }

    // Animation loop
    let animationId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Auto-rotate
      if (autoRotate) {
        rotationRef.current.y += 0.005;
      }
      
      // Apply rotation to camera
      const radius = Math.sqrt(
        camera.position.x ** 2 + 
        camera.position.z ** 2
      );
      camera.position.x = radius * Math.sin(rotationRef.current.y);
      camera.position.z = radius * Math.cos(rotationRef.current.y);
      camera.position.y += rotationRef.current.x * 0.1;
      camera.lookAt(0, 0, 0);
      
      // Animate rotating objects
      objectsRef.current.forEach(obj => {
        if (obj.userData.rotate) {
          obj.rotation.y += 0.01;
        }
        
        if (obj.userData.highlight) {
          const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.1 + 1;
          obj.scale.setScalar(pulse);
        }
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // Mouse controls
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setPreviousMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      rotationRef.current.y += deltaX * 0.005;
      rotationRef.current.x += deltaY * 0.005;
      rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));
      
      setPreviousMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      zoomRef.current += e.deltaY > 0 ? zoomSpeed : -zoomSpeed;
      zoomRef.current = Math.max(0.5, Math.min(2, zoomRef.current));
      
      if (cameraRef.current) {
        const camPos = sceneData.camera?.position || [0, 5, 15];
        const scale = 0.8 / zoomRef.current;
        cameraRef.current.position.set(
          camPos[0] * scale,
          camPos[1] * scale,
          camPos[2] * scale
        );
      }
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      clearObjects();
      
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      
      if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [sceneData, autoRotate, isDragging, previousMousePosition]);

  const animateObjectIn = (obj: THREE.Object3D, delay: number) => {
    setTimeout(() => {
      const targetY = obj.position.y + 5;
      const animate = () => {
        if (obj.position.y < targetY) {
          obj.position.y += 0.2;
          obj.scale.x = Math.min(obj.scale.x + 0.05, 1);
          obj.scale.y = Math.min(obj.scale.y + 0.05, 1);
          obj.scale.z = Math.min(obj.scale.z + 0.05, 1);
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, delay);
  };

  const clearObjects = () => {
    objectsRef.current.forEach(obj => {
      if ((obj as any).geometry) (obj as any).geometry.dispose();
      if ((obj as any).material) {
        const mat = (obj as any).material;
        if (Array.isArray(mat)) {
          mat.forEach((m: any) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        } else {
          if (mat.map) mat.map.dispose();
          mat.dispose();
        }
      }
    });
    objectsRef.current = [];
  };

  const createObject = (objData: any): THREE.Object3D | null => {
    const { type } = objData;

    switch (type) {
      case "array":
        return createArray(objData);
      case "hashmap-container":
        return createHashMapContainer(objData);
      case "text-3d":
        return createText3D(objData);
      case "target-display":
        return createTargetDisplay(objData);
      case "container":
        return createContainer(objData);
      case "pointer-arrow":
        return createPointerArrow(objData);
      case "math-equation":
        return createMathEquation(objData);
      case "connection-arc":
        return createConnectionArc(objData);
      case "result-box":
        return createResultBox(objData);
      case "key-value-pair":
        return createKeyValuePair(objData);
      case "search-magnifier":
      case "comparison-table":
      case "hash-function-visualizer":
      case "array-buckets":
      case "arrow-flow":
      case "checkmark-icon":
      case "particle-trail":
      case "connection-line":
      case "result-display":
      case "complexity-card":
        return createPlaceholder(objData);
      default:
        console.warn(`Unknown object type: ${type}`);
        return null;
    }
  };

  const createArray = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { values, positions, highlights = [], highlightColor = "#22c55e", boxColor = "#3b82f6" } = data;

    values.forEach((value: number, index: number) => {
      const pos = positions[index];
      const isHighlighted = highlights.includes(index);

      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const material = new THREE.MeshStandardMaterial({
        color: isHighlighted ? highlightColor : boxColor,
        emissive: isHighlighted ? highlightColor : boxColor,
        emissiveIntensity: isHighlighted ? 0.6 : 0.2,
        metalness: 0.3,
        roughness: 0.5,
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(pos[0], pos[1], pos[2]);
      box.castShadow = true;
      box.receiveShadow = true;
      
      if (isHighlighted) {
        box.userData.highlight = true;
      }
      
      group.add(box);

      const edges = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({ 
        color: isHighlighted ? highlightColor : "#60a5fa",
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.set(pos[0], pos[1], pos[2]);
      group.add(wireframe);

      if (isHighlighted) {
        const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: highlightColor,
          transparent: true,
          opacity: 0.2,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(pos[0], pos[1], pos[2]);
        group.add(glow);
      }

      const valueSprite = createTextSprite(String(value), '#ffffff', 120);
      valueSprite.position.set(pos[0], pos[1], pos[2] + 1);
      valueSprite.scale.set(2, 2, 1);
      group.add(valueSprite);

      const indexSprite = createTextSprite(`[${index}]`, '#60a5fa', 100);
      indexSprite.position.set(pos[0], pos[1] - 1.8, pos[2]);
      indexSprite.scale.set(2.5, 1.25, 1);
      group.add(indexSprite);
    });

    return group;
  };

  const createHashMapContainer = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position, size = [4, 5, 1.5], opacity = 0.25, contents = [], label } = data;

    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const material = new THREE.MeshStandardMaterial({
      color: "#6366f1",
      transparent: true,
      opacity: opacity,
      emissive: "#4338ca",
      emissiveIntensity: 0.2,
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0], position[1], position[2]);
    box.receiveShadow = true;
    group.add(box);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: "#818cf8" });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.set(position[0], position[1], position[2]);
    group.add(wireframe);

    if (label) {
      const labelSprite = createTextSprite(label, '#a5b4fc', 56);
      labelSprite.position.set(position[0] + size[0]/2 + 2, position[1] + 1, position[2]);
      labelSprite.scale.set(4, 2, 1);
      group.add(labelSprite);
    }

    contents.forEach((item: any, index: number) => {
      const kvText = `${item.key} → ${item.value}`;
      const kvSprite = createTextSprite(kvText, item.glow ? '#22c55e' : '#ffffff', 80);
      const yPos = position[1] + 1.5 - (index * 1.2);
      kvSprite.position.set(position[0], yPos, position[2] + 1);
      kvSprite.scale.set(4, 2, 1);
      group.add(kvSprite);
    });

    return group;
  };

  const createText3D = (data: any): THREE.Sprite => {
    const { text, color = "#ffffff", size = 0.5, position = [0, 0, 0] } = data;
    const sprite = createTextSprite(text, color, Math.floor(size * 100));
    sprite.position.set(position[0], position[1], position[2]);
    sprite.scale.set(size * 6, size * 3, 1);
    return sprite;
  };

  const createPointerArrow = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position, label = "→" } = data;

    const geometry = new THREE.ConeGeometry(0.5, 1.5, 8);
    const material = new THREE.MeshStandardMaterial({
      color: "#fbbf24",
      emissive: "#f59e0b",
      emissiveIntensity: 0.7,
    });
    const cone = new THREE.Mesh(geometry, material);
    cone.position.set(position[0], position[1], position[2]);
    cone.rotation.x = Math.PI;
    cone.castShadow = true;
    group.add(cone);

    const labelSprite = createTextSprite(label, '#fbbf24', 60);
    labelSprite.position.set(position[0], position[1] + 2.5, position[2]);
    labelSprite.scale.set(2.5, 1.25, 1);
    group.add(labelSprite);

    return group;
  };

  const createTargetDisplay = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { value, position, color = "#FFD700" } = data;

    const geometry = new THREE.SphereGeometry(0.8, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.2,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position[0], position[1], position[2]);
    sphere.castShadow = true;
    group.add(sphere);

    const sprite = createTextSprite(String(value), '#000000', 80);
    sprite.position.set(position[0], position[1], position[2] + 0.9);
    sprite.scale.set(1.5, 1.5, 1);
    group.add(sprite);

    group.userData.rotate = true;

    return group;
  };

  const createContainer = (data: any): THREE.Mesh => {
    const { position, size, color = "#3b82f6", opacity = 0.3 } = data;
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      emissive: color,
      emissiveIntensity: 0.2,
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0], position[1], position[2]);
    return box;
  };

  const createMathEquation = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { parts, position } = data;

    let xOffset = 0;
    parts.forEach((part: any) => {
      const sprite = createTextSprite(part.value, part.color, 48);
      sprite.position.set(position[0] + xOffset, position[1], position[2]);
      sprite.scale.set(1.5, 0.75, 1);
      group.add(sprite);
      xOffset += 0.8;
    });

    return group;
  };

  const createConnectionArc = (data: any): THREE.Line => {
    const { from, to, color = "#22c55e" } = data;
    
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(from[0], from[1], from[2]),
      new THREE.Vector3((from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 2, (from[2] + to[2]) / 2),
      new THREE.Vector3(to[0], to[1], to[2])
    );

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(geometry, material);

    return line;
  };

  const createResultBox = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position, content, color = "#22c55e", size = 1.5 } = data;

    const geometry = new THREE.BoxGeometry(size * 2, size, size);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0], position[1], position[2]);
    box.castShadow = true;
    group.add(box);

    const sprite = createTextSprite(content, '#ffffff', 120);
    sprite.position.set(position[0], position[1], position[2] + size/2 + 0.2);
    sprite.scale.set(4, 2, 1);
    group.add(sprite);

    group.userData.rotate = true;

    return group;
  };

  const createKeyValuePair = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { key, value, position } = data;

    const geometry = new THREE.BoxGeometry(2.5, 1.2, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: "#a855f7",
      emissive: "#a855f7",
      emissiveIntensity: 0.5,
    });
    const box = new THREE.Mesh(geometry, material);
    
    const pos = position || [0, 0, 0];
    box.position.set(pos[0], pos[1], pos[2]);
    group.add(box);

    const text = `${key} → ${value}`;
    const sprite = createTextSprite(text, '#ffffff', 80);
    sprite.position.set(pos[0], pos[1], pos[2] + 0.3);
    sprite.scale.set(3, 1.5, 1);
    group.add(sprite);

    return group;
  };

  const createPlaceholder = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position = [0, 0, 0] } = data;

    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: "#60a5fa",
      emissive: "#60a5fa",
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.3,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position[0], position[1], position[2]);
    group.add(sphere);

    return group;
  };

  const createTextSprite = (text: string, color: string, fontSize: number): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(text, 512, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    return new THREE.Sprite(material);
  };

  const handleZoomIn = () => {
    zoomRef.current = Math.min(zoomRef.current + 0.2, 2);
    if (cameraRef.current) {
      const camPos = sceneData.camera?.position || [0, 5, 15];
      const scale = 0.8 / zoomRef.current;
      cameraRef.current.position.set(
        camPos[0] * scale,
        camPos[1] * scale,
        camPos[2] * scale
      );
    }
  };

  const handleZoomOut = () => {
    zoomRef.current = Math.max(zoomRef.current - 0.2, 0.5);
    if (cameraRef.current) {
      const camPos = sceneData.camera?.position || [0, 5, 15];
      const scale = 0.8 / zoomRef.current;
      cameraRef.current.position.set(
        camPos[0] * scale,
        camPos[1] * scale,
        camPos[2] * scale
      );
    }
  };

  const handleResetCamera = () => {
    rotationRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    if (cameraRef.current) {
      const camPos = sceneData.camera?.position || [0, 5, 15];
      cameraRef.current.position.set(camPos[0] * 0.8, camPos[1] * 0.8, camPos[2] * 0.8);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />

      {/* Camera Controls UI */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10
      }}>
        <button onClick={handleZoomIn} style={{
          padding: '12px', backgroundColor: 'rgba(59, 130, 246, 0.9)', border: 'none',
          borderRadius: '8px', color: 'white', fontSize: '20px', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s'
        }} title="Zoom In">🔍+</button>

        <button onClick={handleZoomOut} style={{
          padding: '12px', backgroundColor: 'rgba(59, 130, 246, 0.9)', border: 'none',
          borderRadius: '8px', color: 'white', fontSize: '20px', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s'
        }} title="Zoom Out">🔍-</button>

        <button onClick={handleResetCamera} style={{
          padding: '12px', backgroundColor: 'rgba(168, 85, 247, 0.9)', border: 'none',
          borderRadius: '8px', color: 'white', fontSize: '16px', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s'
        }} title="Reset View">🎯</button>

        <button onClick={() => setAutoRotate(!autoRotate)} style={{
          padding: '12px',
          backgroundColor: autoRotate ? 'rgba(34, 197, 94, 0.9)' : 'rgba(107, 114, 128, 0.9)',
          border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px',
          cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.2s'
        }} title={autoRotate ? "Stop Rotation" : "Auto Rotate"}>
          {autoRotate ? '⏸️' : '🔄'}
        </button>
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute', top: '10px', left: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '12px 16px',
        borderRadius: '8px', color: 'white', fontSize: '12px', zIndex: 10,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ marginBottom: '4px', fontWeight: '600' }}>🖱️ Controls:</div>
        <div>• Click + drag: Rotate</div>
        <div>• Scroll: Zoom</div>
      </div>
    </div>
  );
}