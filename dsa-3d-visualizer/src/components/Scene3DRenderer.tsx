import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Scene3DProps {
  sceneData: any;
}

export default function Scene3DRenderer({ sceneData }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<THREE.Object3D[]>([]);
  const animationMixersRef = useRef<THREE.AnimationMixer[]>([]);
  
  const [autoRotate, setAutoRotate] = useState(true);
  const rotationRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const clockRef = useRef(new THREE.Clock());

  // Helper function to convert array to tree nodes
  const convertArrayToTreeNodes = (arr: number[]): any[] => {
    if (!arr || arr.length === 0) return [];
    
    const nodes: any[] = [];
    const levels = Math.floor(Math.log2(arr.length)) + 1;
    let nodeIndex = 0;
    
    for (let level = 0; level < levels; level++) {
      const nodesInLevel = Math.pow(2, level);
      const levelWidth = nodesInLevel * 3;
      const startX = -levelWidth / 2 + 1.5;
      
      for (let i = 0; i < nodesInLevel && nodeIndex < arr.length; i++) {
        const xPos = startX + i * (levelWidth / nodesInLevel);
        const yPos = 2 - level * 2;
        
        nodes.push({
          value: arr[nodeIndex],
          level: level,
          position: [xPos, yPos, 0],
          parent: nodeIndex > 0 ? arr[Math.floor((nodeIndex - 1) / 2)] : undefined
        });
        
        nodeIndex++;
      }
    }
    
    return nodes;
  };

  // Enhanced text sprite creator with better quality and glow effect
  const createEnhancedTextSprite = (
    text: string, 
    color: string, 
    fontSize: number, 
    withGlow: boolean = false
  ): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scaledFontSize = fontSize * 2.5;
    
    if (withGlow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = color;
        ctx.font = `bold ${scaledFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 2048, 1024);
      }
    }
    
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
    
    ctx.fillStyle = color;
    ctx.font = `900 ${scaledFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 2048, 1024);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = scaledFontSize * 0.05;
    ctx.strokeText(text, 2048, 1024);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
    
    const material = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true,
      depthWrite: false,
      depthTest: true
    });
    return new THREE.Sprite(material);
  };

  // Helper function for creating array boxes
  const createArrayBox = (value: number, x: number, y: number, z: number, color: string, glow = false): THREE.Group => {
    const group = new THREE.Group();

    const geometry = new THREE.BoxGeometry(2, 1.8, 1);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: glow ? 0.6 : 0.3,
      metalness: 0.4,
      roughness: 0.3
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z);
    box.castShadow = true;
    group.add(box);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: color });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(box.position);
    group.add(wireframe);

    const textSprite = createEnhancedTextSprite(String(value), '#ffffff', 130, glow);
    textSprite.position.set(x, y, z + 0.6);
    textSprite.scale.set(3, 3, 1);
    group.add(textSprite);

    return group;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    }

    clearObjects();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x050510, 0.015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    const camPos = sceneData.camera?.position || [0, 8, 20];
    camera.position.set(camPos[0], camPos[1], camPos[2]);
    
    if (sceneData.camera?.lookAt) {
      const lookAt = sceneData.camera.lookAt;
      camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]));
    } else {
      camera.lookAt(0, 0, 0);
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(10, 15, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    scene.add(keyLight);
    
    const fillLight = new THREE.PointLight(0x60a5fa, 1.2, 50);
    fillLight.position.set(-15, 8, -10);
    scene.add(fillLight);
    
    const rimLight = new THREE.PointLight(0xa855f7, 0.8, 50);
    rimLight.position.set(0, 10, -15);
    scene.add(rimLight);
    
    const bottomLight = new THREE.PointLight(0xff6b35, 0.5, 50);
    bottomLight.position.set(0, -10, 5);
    scene.add(bottomLight);

    const gridHelper = new THREE.GridHelper(40, 40, 0x3b82f6, 0x1e40af);
    gridHelper.position.y = -8;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    createParticleBackground(scene);

    if (sceneData.objects) {
      sceneData.objects.forEach((objData: any, index: number) => {
        const obj = createObject(objData);
        if (obj) {
          obj.position.y -= 10;
          obj.scale.set(0, 0, 0);
          obj.userData.targetY = obj.position.y + 10;
          
          scene.add(obj);
          objectsRef.current.push(obj);
          
          animateObjectIn(obj, index * 150);
        }
      });
    }

    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      const elapsedTime = clockRef.current.getElapsedTime();
      
      animationMixersRef.current.forEach(mixer => mixer.update(delta));
      
      if (autoRotate) {
        rotationRef.current.y += 0.003;
      }
      
      const radius = Math.sqrt(
        camera.position.x ** 2 + 
        camera.position.z ** 2
      );
      const targetX = radius * Math.sin(rotationRef.current.y);
      const targetZ = radius * Math.cos(rotationRef.current.y);
      
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.y += rotationRef.current.x * 0.05;
      camera.lookAt(0, 0, 0);
      
      objectsRef.current.forEach((obj, index) => {
        if (obj.userData.float) {
          obj.position.y += Math.sin(elapsedTime * 2 + index) * 0.01;
        }
        
        if (obj.userData.rotate) {
          obj.rotation.y += 0.01;
          obj.rotation.x = Math.sin(elapsedTime + index) * 0.1;
        }
        
        if (obj.userData.highlight) {
          const pulse = Math.sin(elapsedTime * 3) * 0.15 + 1;
          obj.scale.setScalar(obj.userData.baseScale * pulse);
          
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const mat = child.material as THREE.MeshStandardMaterial;
              if (mat.emissive) {
                mat.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 4) * 0.3;
              }
            }
          });
        }
        
        if (obj.userData.animating) {
          const progress = Math.min((elapsedTime - obj.userData.startTime) / 0.8, 1);
          const eased = easeOutElastic(progress);
          
          obj.scale.setScalar(eased);
          obj.position.y = obj.userData.startY + (obj.userData.targetY - obj.userData.startY) * eased;
          
          if (progress >= 1) {
            obj.userData.animating = false;
            obj.userData.float = true;
          }
        }
      });
      
      renderer.render(scene, camera);
    };
    animate();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.15;
      zoomRef.current += e.deltaY > 0 ? zoomSpeed : -zoomSpeed;
      zoomRef.current = Math.max(0.3, Math.min(3, zoomRef.current));
      
      if (cameraRef.current) {
        const camPos = sceneData.camera?.position || [0, 8, 20];
        const scale = 1 / zoomRef.current;
        cameraRef.current.position.set(
          camPos[0] * scale,
          camPos[1] * scale,
          camPos[2] * scale
        );
      }
    };

    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
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
  }, [sceneData, autoRotate]);

  const easeOutElastic = (x: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  };

  const createParticleBackground = (scene: THREE.Scene) => {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x3b82f6);
    const color2 = new THREE.Color(0xa855f7);
    const color3 = new THREE.Color(0xff6b35);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;
      
      const colorChoice = Math.random();
      const color = colorChoice < 0.33 ? color1 : colorChoice < 0.66 ? color2 : color3;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData.isBackground = true;
    scene.add(particles);
    
    objectsRef.current.push(particles);
  };

  const animateObjectIn = (obj: THREE.Object3D, delay: number) => {
    setTimeout(() => {
      obj.userData.animating = true;
      obj.userData.startTime = clockRef.current.getElapsedTime();
      obj.userData.startY = obj.position.y;
      obj.userData.baseScale = 1;
    }, delay);
  };

  const clearObjects = () => {
    objectsRef.current.forEach(obj => {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            const mat = child.material;
            if (Array.isArray(mat)) {
              mat.forEach((m: any) => {
                if (m.map) m.map.dispose();
                m.dispose();
              });
            } else {
              if ((mat as any).map) (mat as any).map.dispose();
              mat.dispose();
            }
          }
        }
      });
    });
    objectsRef.current = [];
    animationMixersRef.current = [];
  };
  const createDivisionCrossedOut = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { position = [0, 0, 0], symbol = "÷", crossed = true } = data;

  // Create division symbol
  const symbolSprite = createEnhancedTextSprite(symbol, '#ef4444', 200, true);
  symbolSprite.position.set(position[0], position[1], position[2]);
  symbolSprite.scale.set(8, 8, 1);
  group.add(symbolSprite);

  if (crossed) {
    // Create red X crossing it out
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: "#ef4444", 
      linewidth: 8,
      transparent: true,
      opacity: 0.9
    });

    // Diagonal line 1
    const line1Geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(position[0] - 2, position[1] - 2, position[2] + 0.1),
      new THREE.Vector3(position[0] + 2, position[1] + 2, position[2] + 0.1)
    ]);
    const line1 = new THREE.Line(line1Geometry, lineMaterial);
    group.add(line1);

    // Diagonal line 2
    const line2Geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(position[0] - 2, position[1] + 2, position[2] + 0.1),
      new THREE.Vector3(position[0] + 2, position[1] - 2, position[2] + 0.1)
    ]);
    const line2 = new THREE.Line(line2Geometry, lineMaterial);
    group.add(line2);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(3, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#ef4444",
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(position[0], position[1], position[2]);
    group.add(glow);
  }

  group.userData.rotate = true;
  return group;
};

// 2. Split Visualization (showing left and right products)
const createSplitVisualization = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { 
    index = 2, 
    left = {}, 
    right = {}, 
    result = 0, 
    position = [0, 0, 0] 
  } = data;

  const spacing = 3;
  const arrayStartX = -(3 * spacing) / 2;

  // Show the array with highlighting at index
  [1, 2, 3, 4].forEach((value, i) => {
    const xPos = arrayStartX + i * spacing;
    const color = i < index ? left.color || "#ef4444" : 
                  i > index ? right.color || "#22c55e" : 
                  "#FFD700";
    
    const geometry = new THREE.BoxGeometry(2, 2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: i === index ? 0.7 : 0.4,
      metalness: 0.4,
      roughness: 0.3
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0] + xPos, position[1] + 2, position[2]);
    box.castShadow = true;
    group.add(box);

    const valueSprite = createEnhancedTextSprite(String(value), '#ffffff', 140, i === index);
    valueSprite.position.set(position[0] + xPos, position[1] + 2, position[2] + 0.7);
    valueSprite.scale.set(3.5, 3.5, 1);
    group.add(valueSprite);
  });

  // Left product visualization
  if (left.product !== undefined) {
    const leftBox = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2, 0.5),
      new THREE.MeshStandardMaterial({
        color: left.color || "#ef4444",
        emissive: left.color || "#ef4444",
        emissiveIntensity: 0.5,
        metalness: 0.4,
        roughness: 0.3
      })
    );
    leftBox.position.set(position[0] - 4, position[1] - 1, position[2]);
    group.add(leftBox);

    const leftText = createEnhancedTextSprite(
      `Left: ${left.product}`, 
      '#ffffff', 
      110, 
      true
    );
    leftText.position.set(position[0] - 4, position[1] - 1, position[2] + 0.3);
    leftText.scale.set(4.5, 2.5, 1);
    group.add(leftText);
  }

  // Right product visualization
  if (right.product !== undefined) {
    const rightBox = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2, 0.5),
      new THREE.MeshStandardMaterial({
        color: right.color || "#22c55e",
        emissive: right.color || "#22c55e",
        emissiveIntensity: 0.5,
        metalness: 0.4,
        roughness: 0.3
      })
    );
    rightBox.position.set(position[0] + 4, position[1] - 1, position[2]);
    group.add(rightBox);

    const rightText = createEnhancedTextSprite(
      `Right: ${right.product}`, 
      '#ffffff', 
      110, 
      true
    );
    rightText.position.set(position[0] + 4, position[1] - 1, position[2] + 0.3);
    rightText.scale.set(4.5, 2.5, 1);
    group.add(rightText);
  }

  // Result
  if (result !== undefined && result !== 0) {
    const resultBox = new THREE.Mesh(
      new THREE.BoxGeometry(5, 2.5, 0.8),
      new THREE.MeshStandardMaterial({
        color: "#FFD700",
        emissive: "#FFD700",
        emissiveIntensity: 0.7,
        metalness: 0.5,
        roughness: 0.2
      })
    );
    resultBox.position.set(position[0], position[1] - 4, position[2]);
    resultBox.castShadow = true;
    group.add(resultBox);

    const resultText = createEnhancedTextSprite(
      `Result: ${result}`, 
      '#000000', 
      130, 
      true
    );
    resultText.position.set(position[0], position[1] - 4, position[2] + 0.5);
    resultText.scale.set(5.5, 3, 1);
    group.add(resultText);
  }

  return group;
};

// 3. Prefix Animation (showing prefix product build-up)
const createPrefixAnimation = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { steps = [], animated = true, position = [0, 0, 0] } = data;

  const spacing = 3;
  const startX = -(steps.length - 1) * spacing / 2;

  steps.forEach((step: any, index: number) => {
    const xPos = startX + index * spacing;
    
    // Result box
    const geometry = new THREE.BoxGeometry(2, 2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "#ef4444",
      emissive: "#ef4444",
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.3
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0] + xPos, position[1], position[2]);
    box.castShadow = true;
    group.add(box);

    // Result value
    const resultSprite = createEnhancedTextSprite(
      String(step.result), 
      '#ffffff', 
      140, 
      true
    );
    resultSprite.position.set(position[0] + xPos, position[1], position[2] + 0.7);
    resultSprite.scale.set(3.5, 3.5, 1);
    group.add(resultSprite);

    // Prefix value label above
    const prefixSprite = createEnhancedTextSprite(
      `p=${step.prefix}`, 
      '#ef4444', 
      90, 
      false
    );
    prefixSprite.position.set(position[0] + xPos, position[1] + 2, position[2]);
    prefixSprite.scale.set(2.5, 1.5, 1);
    group.add(prefixSprite);

    // Index label below
    const indexSprite = createEnhancedTextSprite(
      `[${step.index}]`, 
      '#94a3b8', 
      80, 
      false
    );
    indexSprite.position.set(position[0] + xPos, position[1] - 2, position[2]);
    indexSprite.scale.set(2, 1.2, 1);
    group.add(indexSprite);
  });

  // Add arrow showing direction
  const arrowGeometry = new THREE.ConeGeometry(0.3, 1, 8);
  const arrowMaterial = new THREE.MeshStandardMaterial({
    color: "#ef4444",
    emissive: "#ef4444",
    emissiveIntensity: 0.7
  });
  const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
  arrow.position.set(position[0] + startX + steps.length * spacing, position[1] + 3, position[2]);
  arrow.rotation.z = -Math.PI / 2;
  group.add(arrow);

  const arrowLabel = createEnhancedTextSprite("→", '#ef4444', 150, true);
  arrowLabel.position.set(position[0], position[1] + 3.5, position[2]);
  arrowLabel.scale.set(6, 3, 1);
  group.add(arrowLabel);

  return group;
};

// 4. Suffix Animation (showing suffix product build-up)
const createSuffixAnimation = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { steps = [], animated = true, position = [0, 0, 0] } = data;

  const spacing = 3;
  const startX = -(steps.length - 1) * spacing / 2;

  steps.forEach((step: any, index: number) => {
    const xPos = startX + index * spacing;
    
    // Result box (multiplied values)
    const geometry = new THREE.BoxGeometry(2, 2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "#22c55e",
      emissive: "#22c55e",
      emissiveIntensity: step.multiply ? 0.7 : 0.4,
      metalness: 0.4,
      roughness: 0.3
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0] + xPos, position[1], position[2]);
    box.castShadow = true;
    group.add(box);

    // Multiply indicator
    if (step.multiply) {
      const glowGeometry = new THREE.BoxGeometry(2.5, 2.5, 1.5);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: "#22c55e",
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(box.position);
      group.add(glow);
    }

    // Suffix value label above
    const suffixSprite = createEnhancedTextSprite(
      `s=${step.suffix}`, 
      '#22c55e', 
      90, 
      step.multiply
    );
    suffixSprite.position.set(position[0] + xPos, position[1] + 2, position[2]);
    suffixSprite.scale.set(2.5, 1.5, 1);
    group.add(suffixSprite);

    // Index label below
    const indexSprite = createEnhancedTextSprite(
      `[${step.index}]`, 
      '#94a3b8', 
      80, 
      false
    );
    indexSprite.position.set(position[0] + xPos, position[1] - 2, position[2]);
    indexSprite.scale.set(2, 1.2, 1);
    group.add(indexSprite);
  });

  // Add arrow showing direction (right to left)
  const arrowGeometry = new THREE.ConeGeometry(0.3, 1, 8);
  const arrowMaterial = new THREE.MeshStandardMaterial({
    color: "#22c55e",
    emissive: "#22c55e",
    emissiveIntensity: 0.7
  });
  const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
  arrow.position.set(position[0] + startX - 1, position[1] + 3, position[2]);
  arrow.rotation.z = Math.PI / 2;
  group.add(arrow);

  const arrowLabel = createEnhancedTextSprite("←", '#22c55e', 150, true);
  arrowLabel.position.set(position[0], position[1] + 3.5, position[2]);
  arrowLabel.scale.set(6, 3, 1);
  group.add(arrowLabel);

  return group;
};

// 5. Expected Output (ghosted preview of goal)
const createExpectedOutput = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { values = [], position = [0, 0, 0], opacity = 0.3, label = "Goal" } = data;

  const spacing = 3;
  const startX = -(values.length - 1) * spacing / 2;

  values.forEach((value: number, index: number) => {
    const xPos = startX + index * spacing;
    
    const geometry = new THREE.BoxGeometry(2, 2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "#22c55e",
      emissive: "#22c55e",
      emissiveIntensity: 0.3,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: opacity
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0] + xPos, position[1], position[2]);
    group.add(box);

    const valueSprite = createEnhancedTextSprite(
      String(value), 
      '#ffffff', 
      130, 
      false
    );
    valueSprite.position.set(position[0] + xPos, position[1], position[2] + 0.7);
    valueSprite.scale.set(3, 3, 1);
    valueSprite.material.opacity = opacity + 0.4;
    group.add(valueSprite);
  });

  // Label
  if (label) {
    const labelSprite = createEnhancedTextSprite(label, '#22c55e', 90, false);
    labelSprite.position.set(position[0] + startX - 2, position[1], position[2]);
    labelSprite.scale.set(2.5, 1.5, 1);
    labelSprite.material.opacity = opacity + 0.5;
    group.add(labelSprite);
  }

  return group;
};

// 6. Arrow Down (pointing from one array to another)
const createArrowDown = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { from = [0, 2, 0], to = [0, -1, 0] } = data;

  const start = new THREE.Vector3(from[0], from[1], from[2]);
  const end = new THREE.Vector3(to[0], to[1], to[2]);

  // Arrow line
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: "#60a5fa", 
    linewidth: 3 
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  group.add(line);

  // Arrow head
  const arrowGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
  const arrowMaterial = new THREE.MeshStandardMaterial({
    color: "#60a5fa",
    emissive: "#60a5fa",
    emissiveIntensity: 0.6
  });
  const arrowHead = new THREE.Mesh(arrowGeometry, arrowMaterial);
  arrowHead.position.copy(end);
  arrowHead.rotation.x = Math.PI;
  group.add(arrowHead);

  return group;
};

// 7. Multiplication Visual (showing a × b = c)
const createMultiplicationVisual = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { show = "", position = [0, 0, 0] } = data;

  // Parse the multiplication string (e.g., "2 × 4 = 8")
  const sprite = createEnhancedTextSprite(show, '#FFD700', 120, true);
  sprite.position.set(position[0], position[1], position[2]);
  sprite.scale.set(6, 3, 1);
  group.add(sprite);

  // Add glowing background
  const bgGeometry = new THREE.PlaneGeometry(show.length * 0.7, 2);
  const bgMaterial = new THREE.MeshBasicMaterial({
    color: "#FFD700",
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  const bg = new THREE.Mesh(bgGeometry, bgMaterial);
  bg.position.set(position[0], position[1], position[2] - 0.1);
  group.add(bg);

  group.userData.float = true;
  return group;
};

// 8. Verification Table (showing all calculations)
const createVerificationTable = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { rows = [], position = [0, 0, 0] } = data;

  rows.forEach((row: any, index: number) => {
    const yPos = position[1] - index * 1.8;

    // Row background
    const bgGeometry = new THREE.PlaneGeometry(8, 1.5);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: row.check ? "#065f46" : "#1e293b",
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const bg = new THREE.Mesh(bgGeometry, bgMaterial);
    bg.position.set(position[0], yPos, position[2]);
    group.add(bg);

    // Index
    const indexSprite = createEnhancedTextSprite(
      `[${row.index}]`, 
      '#60a5fa', 
      90, 
      false
    );
    indexSprite.position.set(position[0] - 3.5, yPos, position[2] + 0.1);
    indexSprite.scale.set(2, 1.5, 1);
    group.add(indexSprite);

    // Value
    const valueSprite = createEnhancedTextSprite(
      String(row.value), 
      '#ffffff', 
      100, 
      false
    );
    valueSprite.position.set(position[0] - 1.5, yPos, position[2] + 0.1);
    valueSprite.scale.set(2.5, 1.8, 1);
    group.add(valueSprite);

    // Calculation
    const calcSprite = createEnhancedTextSprite(
      row.calculation, 
      '#e2e8f0', 
      85, 
      false
    );
    calcSprite.position.set(position[0] + 1.5, yPos, position[2] + 0.1);
    calcSprite.scale.set(3.5, 1.5, 1);
    group.add(calcSprite);

    // Check mark
    if (row.check) {
      const checkSprite = createEnhancedTextSprite("✓", '#22c55e', 110, true);
      checkSprite.position.set(position[0] + 4, yPos, position[2] + 0.1);
      checkSprite.scale.set(2.5, 2.5, 1);
      group.add(checkSprite);
    }
  });

  // Table border
  const borderGeometry = new THREE.PlaneGeometry(9, rows.length * 1.8 + 0.5);
  const borderEdges = new THREE.EdgesGeometry(borderGeometry);
  const borderMaterial = new THREE.LineBasicMaterial({ color: "#3b82f6", linewidth: 2 });
  const border = new THREE.LineSegments(borderEdges, borderMaterial);
  border.position.set(position[0], position[1] - (rows.length - 1) * 0.9, position[2] - 0.05);
  group.add(border);

  return group;
};
const createTwoPhaseVisualization = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { divide = {}, merge = {}, position = [0, 0, 0] } = data;

  // Left side - Divide phase (top to bottom)
  const divideDepth = divide.depth || 3;
  const divideColor = divide.color || "#ef4444";
  
  for (let level = 0; level <= divideDepth; level++) {
    const yPos = position[1] + 4 - level * 2;
    const boxCount = Math.pow(2, level);
    const totalWidth = boxCount * 1.5;
    const startX = position[0] - 6 - totalWidth / 2;

    for (let i = 0; i < boxCount; i++) {
      const xPos = startX + i * (totalWidth / boxCount) + 0.75;
      
      const geometry = new THREE.BoxGeometry(1.2, 0.8, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: divideColor,
        emissive: divideColor,
        emissiveIntensity: 0.4,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(xPos, yPos, position[2]);
      box.castShadow = true;
      group.add(box);

      // Draw connecting lines to children
      if (level < divideDepth) {
        const childY = yPos - 2;
        const child1X = startX + i * 2 * (totalWidth / (boxCount * 2)) + 0.375;
        const child2X = child1X + totalWidth / (boxCount * 2);

        [child1X, child2X].forEach(childX => {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(xPos, yPos - 0.4, position[2]),
            new THREE.Vector3(childX, childY + 0.4, position[2])
          ]);
          const lineMaterial = new THREE.LineBasicMaterial({ color: divideColor });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          group.add(line);
        });
      }
    }
  }

  // Right side - Merge phase (bottom to top)
  const mergeDepth = merge.depth || 3;
  const mergeColor = merge.color || "#22c55e";
  
  for (let level = mergeDepth; level >= 0; level--) {
    const yPos = position[1] + 4 - level * 2;
    const boxCount = Math.pow(2, level);
    const totalWidth = boxCount * 1.5;
    const startX = position[0] + 6 - totalWidth / 2;

    for (let i = 0; i < boxCount; i++) {
      const xPos = startX + i * (totalWidth / boxCount) + 0.75;
      
      const geometry = new THREE.BoxGeometry(1.2, 0.8, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: mergeColor,
        emissive: mergeColor,
        emissiveIntensity: 0.4,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(xPos, yPos, position[2]);
      box.castShadow = true;
      group.add(box);
    }
  }

  // Add phase labels
  const divideLabel = createEnhancedTextSprite("DIVIDE", divideColor, 100, true);
  divideLabel.position.set(position[0] - 6, position[1] + 6, position[2]);
  divideLabel.scale.set(4, 2, 1);
  group.add(divideLabel);

  const mergeLabel = createEnhancedTextSprite("MERGE", mergeColor, 100, true);
  mergeLabel.position.set(position[0] + 6, position[1] + 6, position[2]);
  mergeLabel.scale.set(4, 2, 1);
  group.add(mergeLabel);

  return group;
};

// 2. Labels (text labels for phases)
const createLabels = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { divide, merge, position = [0, 0, 0] } = data;

  if (divide) {
    const divideSprite = createEnhancedTextSprite(divide, '#ef4444', 90, false);
    divideSprite.position.set(position[0] - 5, position[1], position[2]);
    divideSprite.scale.set(4, 2, 1);
    group.add(divideSprite);
  }

  if (merge) {
    const mergeSprite = createEnhancedTextSprite(merge, '#22c55e', 90, false);
    mergeSprite.position.set(position[0] + 5, position[1], position[2]);
    mergeSprite.scale.set(4, 2, 1);
    group.add(mergeSprite);
  }

  return group;
};

// 3. Single Elements (separated individual boxes)
const createSingleElements = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { values = [], position = [0, 0, 0], separated = false } = data;

  const spacing = separated ? 4 : 3;
  const startX = -(values.length - 1) * spacing / 2;

  values.forEach((value: number, index: number) => {
    const xPos = startX + index * spacing;
    
    const geometry = new THREE.BoxGeometry(2, 2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "#22c55e",
      emissive: "#22c55e",
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.3
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0] + xPos, position[1], position[2]);
    box.castShadow = true;
    group.add(box);

    const valueSprite = createEnhancedTextSprite(String(value), '#ffffff', 140, true);
    valueSprite.position.set(position[0] + xPos, position[1], position[2] + 0.7);
    valueSprite.scale.set(3.5, 3.5, 1);
    group.add(valueSprite);

    // Add checkmark above if separated
    if (separated) {
      const checkSprite = createEnhancedTextSprite("✓", '#22c55e', 110, true);
      checkSprite.position.set(position[0] + xPos, position[1] + 2, position[2]);
      checkSprite.scale.set(3, 3, 1);
      group.add(checkSprite);
    }
  });

  return group;
};

// 4. Merge Demonstration (animated merge of two arrays)
const createMergeDemonstration = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { left = [], right = [], result = [], animated = false, position = [0, 0, 0] } = data;

  const spacing = 2.5;

  // Left array (top-left)
  const leftStartX = -(left.length - 1) * spacing / 2 - 4;
  left.forEach((value: number, index: number) => {
    const box = createArrayBox(value, leftStartX + index * spacing, position[1] + 3, position[2], "#3b82f6");
    group.add(box);
  });
  const leftLabel = createEnhancedTextSprite("Left", '#3b82f6', 80, false);
  leftLabel.position.set(leftStartX + (left.length - 1) * spacing / 2, position[1] + 4.5, position[2]);
  leftLabel.scale.set(3, 1.5, 1);
  group.add(leftLabel);

  // Right array (top-right)
  const rightStartX = -(right.length - 1) * spacing / 2 + 4;
  right.forEach((value: number, index: number) => {
    const box = createArrayBox(value, rightStartX + index * spacing, position[1] + 3, position[2], "#a855f7");
    group.add(box);
  });
  const rightLabel = createEnhancedTextSprite("Right", '#a855f7', 80, false);
  rightLabel.position.set(rightStartX + (right.length - 1) * spacing / 2, position[1] + 4.5, position[2]);
  rightLabel.scale.set(3, 1.5, 1);
  group.add(rightLabel);

  // Result array (bottom-center)
  const resultStartX = -(result.length - 1) * spacing / 2;
  result.forEach((value: number, index: number) => {
    const box = createArrayBox(value, resultStartX + index * spacing, position[1] - 2, position[2], "#22c55e", true);
    group.add(box);
  });
  const resultLabel = createEnhancedTextSprite("Merged ✓", '#22c55e', 90, true);
  resultLabel.position.set(0, position[1] - 3.5, position[2]);
  resultLabel.scale.set(4, 2, 1);
  group.add(resultLabel);

  // Add merge arrows
  const arrowGeometry = new THREE.ConeGeometry(0.25, 0.9, 8);
  const arrowMaterial = new THREE.MeshStandardMaterial({
    color: "#22c55e",
    emissive: "#22c55e",
    emissiveIntensity: 0.7
  });
  
  [-2, 2].forEach(xOffset => {
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.set(position[0] + xOffset, position[1] + 0.5, position[2]);
    arrow.rotation.z = Math.PI;
    group.add(arrow);
  });

  return group;
};

// 5. Comparison Arrows (showing element comparisons)
const createComparisonArrows = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { showing = false, color = "#3b82f6" } = data;

  if (!showing) return group;

  // Create small pointer arrows
  [-3, 3].forEach(xPos => {
    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.6, 8);
    const arrowMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.6
    });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.set(xPos, 1, 0);
    arrow.rotation.z = Math.PI;
    group.add(arrow);
  });

  return group;
};

// 6. Complexity Visualization (tree showing work per level)
const createComplexityVisualization = (data: any): THREE.Group => {
  const group = new THREE.Group();
  const { levels = 3, work = "O(n)", position = [0, 0, 0] } = data;

  for (let level = 0; level < levels; level++) {
    const yPos = position[1] + 3 - level * 2;
    const nodeCount = Math.pow(2, level);
    const totalWidth = nodeCount * 3;
    const startX = -totalWidth / 2;

    // Nodes for this level
    for (let i = 0; i < nodeCount; i++) {
      const xPos = startX + i * (totalWidth / nodeCount) + (totalWidth / nodeCount / 2);
      
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: "#a855f7",
        emissive: "#a855f7",
        emissiveIntensity: 0.5,
        metalness: 0.5,
        roughness: 0.2
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(position[0] + xPos, yPos, position[2]);
      sphere.castShadow = true;
      group.add(sphere);
    }

    // Work label for this level
    const workSprite = createEnhancedTextSprite(work, '#60a5fa', 80, false);
    workSprite.position.set(position[0] + totalWidth / 2 + 3, yPos, position[2]);
    workSprite.scale.set(2.5, 1.5, 1);
    group.add(workSprite);
  }

  // Total complexity label
  const totalSprite = createEnhancedTextSprite(
    `${levels} levels × ${work} = O(n log n)`, 
    '#22c55e', 
    100, 
    true
  );
  totalSprite.position.set(position[0], position[1] - levels * 2 - 1, position[2]);
  totalSprite.scale.set(8, 4, 1);
  group.add(totalSprite);

  return group;
};
  const createObject = (objData: any): THREE.Object3D | null => {
    const { type } = objData;

    switch (type) {
      case "array":
        return createEnhancedArray(objData);
      case "pointer":
        return createPointer(objData);
      case "target-display":
        return createEnhancedTarget(objData);
      case "comparison":
        return createComparison(objData);
      case "arrow-indication":
        return createArrowIndication(objData);
      case "search-visualization":
        return createSearchVisualization(objData);
      case "complexity-comparison":
        return createComplexityComparison(objData);
      case "staircase":
        return createStaircase(objData);
      case "step-label":
        return createStepLabel(objData);
      case "addition-visual":
        return createAdditionVisual(objData);
      case "path-visualization":
        return createPathVisualization(objData);
      case "number-sequence":
        return createNumberSequence(objData);
      case "variable-boxes":
        return createVariableBoxes(objData);
      case "formula":
        return createFormula(objData);
      case "fibonacci-sequence":
        return createFibonacciSequence(objData);
      case "arrow-path":
        return createArrowPath(objData);
      case "binary-tree-structure":
        return createBinaryTreeStructure(objData);
      case "tree-3d":
        return createTree3D(objData);
      case "node-highlight":
        return createNodeHighlight(objData);
      case "swap-animation":
        return createSwapAnimation(objData);
      case "side-by-side-trees":
        return createSideBySideTrees(objData);
      case "recursion-tree-visual":
        return createRecursionTreeVisual(objData);
      case "linked-list-chain":
        return createLinkedListChain(objData);
      case "highlight-arrow":
        return createHighlightArrow(objData);
      case "stack-container":
        return createStackContainer(objData);
      case "stack-visualization":
        return createStackVisualization(objData);
      case "stack-items":
        return createStackItems(objData);
      case "empty-stack":
        return createEmptyStack(objData);
      case "match-indicator":
        return createMatchIndicator(objData);
      case "string-display":
        return createStringDisplay(objData);
      case "string-array":
        return createStringArray(objData);
      case "window-rectangle":
        return createWindowRectangle(objData);
      case "window-highlight":
        return createWindowHighlight(objData);
      case "hashmap-visualization":
        return createHashMapVisualization(objData);
      case "variable-display":
        return createVariableDisplay(objData);
      case "highlight-best-substring":
        return createHighlightBestSubstring(objData);
      case "best-substring-visual":
        return createBestSubstringVisual(objData);
      case "decision-visual":
        return createDecisionVisual(objData);
      case "variable-box":
        return createVariableBox(objData);
      case "subarray-highlight":
        return createSubarrayHighlight(objData);
      case "array-splitting":
        return createArraySplitting(objData);
      case "split-arrow":
        return createSplitArrow(objData);
      case "merge-animation":
        return createMergeAnimation(objData);
      case "merge-sort-tree":
        return createMergeSortTree(objData);
      case "checkmarks":
        return createCheckmarks(objData);
      case "hashmap-container":
        return createEnhancedHashMap(objData);
      case "text-3d":
        return createEnhancedText3D(objData);
      case "container":
        return createEnhancedContainer(objData);
      case "pointer-arrow":
        return createEnhancedPointer(objData);
      case "math-equation":
        return createEnhancedMathEquation(objData);
      case "connection-arc":
        return createEnhancedConnectionArc(objData);
      case "result-box":
        return createEnhancedResultBox(objData);
      case "key-value-pair":
        return createEnhancedKeyValuePair(objData);
      case "result-display":
        return createEnhancedResultDisplay(objData);
      case "complexity-card":
        return createEnhancedComplexityCard(objData);
      case "division-crossed-out":
        return createDivisionCrossedOut(objData);
      case "split-visualization":
        return createSplitVisualization(objData);
      case "prefix-animation":
        return createPrefixAnimation(objData);
      case "suffix-animation":
        return createSuffixAnimation(objData);
      case "expected-output":
        return createExpectedOutput(objData);
      case "arrow-down":
        return createArrowDown(objData);
      case "multiplication-visual":
        return createMultiplicationVisual(objData);
      case "verification-table":
        return createVerificationTable(objData);
      case "two-phase-visualization":
        return createTwoPhaseVisualization(objData);
      case "labels":
        return createLabels(objData);
      case "single-elements":
        return createSingleElements(objData);
      case "merge-demonstration":
        return createMergeDemonstration(objData);
      case "comparison-arrows":
        return createComparisonArrows(objData);
      case "complexity-visualization":
        return createComplexityVisualization(objData);
      default:
        return createEnhancedPlaceholder(objData);
    }
  };

  // ENHANCED OBJECT CREATORS
  const createEnhancedArray = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { 
      values, 
      positions, 
      highlights = [], 
      highlightIndex,
      eliminated = [],
      activeRange,
      highlightColor = "#22c55e", 
      boxColor = "#3b82f6" 
    } = data;

    const finalPositions = positions || values.map((_: any, i: number) => {
      const spacing = 3;
      const totalWidth = (values.length - 1) * spacing;
      const startX = -totalWidth / 2;
      return [startX + i * spacing, 0, 0];
    });

    values.forEach((value: number, index: number) => {
      const pos = finalPositions[index];
      const isHighlighted = highlights.includes(index) || highlightIndex === index;
      const isEliminated = eliminated.includes(index);
      const isInActiveRange = activeRange ? (index >= activeRange[0] && index <= activeRange[1]) : true;

      let color = boxColor;
      let opacity = 1;
      
      if (isEliminated) {
        opacity = 0.3;
        color = "#64748b";
      } else if (isHighlighted) {
        color = highlightColor;
      } else if (!isInActiveRange) {
        opacity = 0.4;
      }

      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: isHighlighted ? 0.7 : 0.3,
        metalness: 0.4,
        roughness: 0.3,
        transparent: opacity < 1,
        opacity: opacity
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(pos[0], pos[1], pos[2]);
      box.castShadow = true;
      box.receiveShadow = true;
      
      if (isHighlighted) {
        box.userData.highlight = true;
        box.userData.baseScale = 1;
      }
      
      group.add(box);

      const edges = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({ 
        color: isHighlighted ? highlightColor : "#60a5fa",
        linewidth: 2,
        transparent: opacity < 1,
        opacity: opacity
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.set(pos[0], pos[1], pos[2]);
      group.add(wireframe);

      if (isHighlighted && !isEliminated) {
        const glowGeometry = new THREE.SphereGeometry(1.6, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: highlightColor,
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(pos[0], pos[1], pos[2]);
        glow.scale.set(1.3, 1.3, 1.3);
        group.add(glow);
      }

      const valueSprite = createEnhancedTextSprite(
        String(value), 
        isEliminated ? '#94a3b8' : '#ffffff', 
        140, 
        isHighlighted
      );
      valueSprite.position.set(pos[0], pos[1], pos[2] + 1.2);
      valueSprite.scale.set(4, 4, 1);
      group.add(valueSprite);

      const indexGroup = new THREE.Group();
      const indexBg = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 0.8),
        new THREE.MeshBasicMaterial({ 
          color: 0x1e293b, 
          transparent: true, 
          opacity: 0.8 
        })
      );
      indexGroup.add(indexBg);
      
      const indexSprite = createEnhancedTextSprite(`[${index}]`, '#60a5fa', 90);
      indexSprite.position.z = 0.01;
      indexSprite.scale.set(1.5, 1.5, 1);
      indexGroup.add(indexSprite);
      
      indexGroup.position.set(pos[0], pos[1] - 2.2, pos[2]);
      group.add(indexGroup);
    });

    return group;
  };

  const createEnhancedHashMap = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position, size = [5, 6, 2], opacity = 0.3, contents = [], label } = data;

    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const material = new THREE.MeshPhysicalMaterial({
      color: "#6366f1",
      transparent: true,
      opacity: opacity,
      emissive: "#4338ca",
      emissiveIntensity: 0.3,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.5,
      thickness: 0.5,
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0], position[1], position[2]);
    box.receiveShadow = true;
    box.castShadow = true;
    group.add(box);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: "#818cf8", linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.set(position[0], position[1], position[2]);
    group.add(wireframe);

    if (label) {
      const labelSprite = createEnhancedTextSprite(label, '#a5b4fc', 64, true);
      labelSprite.position.set(position[0], position[1] + size[1]/2 + 1, position[2]);
      labelSprite.scale.set(5, 2.5, 1);
      group.add(labelSprite);
    }

    contents.forEach((item: any, index: number) => {
      const yPos = position[1] + (size[1]/2) - 1 - (index * 1.5);
      
      const cardGeometry = new THREE.PlaneGeometry(size[0] - 1, 1.2);
      const cardMaterial = new THREE.MeshBasicMaterial({
        color: item.glow ? 0x065f46 : 0x1e293b,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const card = new THREE.Mesh(cardGeometry, cardMaterial);
      card.position.set(position[0], yPos, position[2] + 1.1);
      group.add(card);
      
      const kvText = `${item.key} → ${item.value}`;
      const kvSprite = createEnhancedTextSprite(
        kvText, 
        item.glow ? '#22c55e' : '#e2e8f0', 
        90,
        item.glow
      );
      kvSprite.position.set(position[0], yPos, position[2] + 1.2);
      kvSprite.scale.set(4.5, 2.5, 1);
      group.add(kvSprite);
    });

    group.userData.float = true;
    return group;
  };

  const createEnhancedText3D = (data: any): THREE.Sprite => {
    const { text, color = "#ffffff", size = 0.6, position = [0, 0, 0] } = data;
    const sprite = createEnhancedTextSprite(text, color, Math.floor(size * 200), true);
    sprite.position.set(position[0], position[1], position[2]);
    sprite.scale.set(size * 14, size * 7, 1);
    return sprite;
  };

  const createPointer = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position, label = "→", color = "#fbbf24" } = data;

    const geometry = new THREE.ConeGeometry(0.6, 1.8, 8);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.2,
    });
    const cone = new THREE.Mesh(geometry, material);
    cone.position.set(position[0], position[1], position[2]);
    cone.rotation.x = Math.PI;
    cone.castShadow = true;
    group.add(cone);

    const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(position[0], position[1], position[2]);
    group.add(glow);

    const labelBg = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 0.9),
      new THREE.MeshBasicMaterial({ 
        color: 0x1e293b, 
        transparent: true, 
        opacity: 0.9 
      })
    );
    labelBg.position.set(position[0], position[1] + 2.8, position[2]);
    group.add(labelBg);

    const labelSprite = createEnhancedTextSprite(label, color, 80, true);
    labelSprite.position.set(position[0], position[1] + 2.8, position[2] + 0.05);
    labelSprite.scale.set(4, 2, 1);
    group.add(labelSprite);

    group.userData.rotate = false;
    return group;
  };

  const createEnhancedPointer = (data: any): THREE.Group => {
    return createPointer(data);
  };

  const createEnhancedTarget = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { value, position, color = "#FFD700" } = data;

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.9,
      metalness: 0.7,
      roughness: 0.1,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position[0], position[1], position[2]);
    sphere.castShadow = true;
    group.add(sphere);

    const ringGeometry = new THREE.TorusGeometry(1.5, 0.08, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(position[0], position[1], position[2]);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const sprite = createEnhancedTextSprite(String(value), '#000000', 100, true);
    sprite.position.set(position[0], position[1], position[2] + 1.1);
    sprite.scale.set(2, 2, 1);
    group.add(sprite);

    group.userData.rotate = true;
    return group;
  };

  const createEnhancedContainer = (data: any): THREE.Mesh => {
    const { position, size, color = "#3b82f6", opacity = 0.25 } = data;
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      emissive: color,
      emissiveIntensity: 0.25,
      metalness: 0.1,
      roughness: 0.3,
      transmission: 0.3,
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0], position[1], position[2]);
    box.receiveShadow = true;
    box.userData.float = true;
    return box;
  };

  const createEnhancedMathEquation = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { parts, position } = data;

    let xOffset = 0;
    parts.forEach((part: any) => {
      const isGlow = part.glow || false;
      const sprite = createEnhancedTextSprite(part.value, part.color, 56, isGlow);
      sprite.position.set(position[0] + xOffset, position[1], position[2]);
      sprite.scale.set(2, 1, 1);
      group.add(sprite);
      xOffset += part.value.length * 0.5 + 0.3;
    });

    return group;
  };

  const createEnhancedConnectionArc = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { from, to, color = "#22c55e", height = 3 } = data;
    
    const start = new THREE.Vector3(from[0], from[1], from[2]);
    const end = new THREE.Vector3(to[0], to[1], to[2]);
    const mid = new THREE.Vector3(
      (from[0] + to[0]) / 2,
      Math.max(from[1], to[1]) + height,
      (from[2] + to[2]) / 2
    );
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(100);
    const geometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      64,
      0.1,
      8,
      false
    );
    const material = new THREE.MeshStandardMaterial({ 
      color: color,
      emissive: color,
      emissiveIntensity: 0.5
    });
    const tube = new THREE.Mesh(geometry, material);
    group.add(tube);

    return group;
  };

  const createEnhancedResultBox = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position, content, color = "#22c55e", size = 2 } = data;

    const geometry = new THREE.BoxGeometry(size * 2.5, size, size);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.2,
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0], position[1], position[2]);
    box.castShadow = true;
    group.add(box);

    const sprite = createEnhancedTextSprite(content, '#ffffff', 160, true);
    sprite.position.set(position[0], position[1], position[2] + size/2 + 0.3);
    sprite.scale.set(6, 3, 1);
    group.add(sprite);

    group.userData.rotate = true;
    group.userData.highlight = true;
    group.userData.baseScale = 1;
    
    return group;
  };

  const createEnhancedKeyValuePair = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { key, value, position } = data;

    const geometry = new THREE.BoxGeometry(3, 1.5, 0.6);
    const material = new THREE.MeshStandardMaterial({
      color: "#a855f7",
      emissive: "#a855f7",
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.3,
    });
    const box = new THREE.Mesh(geometry, material);
    
    const pos = position || [0, 0, 0];
    box.position.set(pos[0], pos[1], pos[2]);
    box.castShadow = true;
    group.add(box);

    const text = `${key} → ${value}`;
    const sprite = createEnhancedTextSprite(text, '#ffffff', 90, true);
    sprite.position.set(pos[0], pos[1], pos[2] + 0.4);
    sprite.scale.set(3.5, 1.75, 1);
    group.add(sprite);

    group.userData.float = true;
    return group;
  };

  const createEnhancedResultDisplay = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position, title = "RESULT", value, color = "#FFD700", size = 2 } = data;

    const titleSprite = createEnhancedTextSprite(title, color, 70);
    titleSprite.position.set(position[0], position[1] + 1.5, position[2]);
    titleSprite.scale.set(4, 2, 1);
    group.add(titleSprite);

    const valueBox = createEnhancedResultBox({ position, content: value, color, size });
    group.add(valueBox);

    return group;
  };

  const createEnhancedComplexityCard = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position, data: complexityData, color = "#3b82f6" } = data;

    const cardGeometry = new THREE.BoxGeometry(6, 3, 0.3);
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.4,
    });
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    card.position.set(position[0], position[1], position[2]);
    card.castShadow = true;
    group.add(card);

    const timeSprite = createEnhancedTextSprite(
      `Time: ${complexityData.time}`, 
      '#22c55e', 
      80,
      true
    );
    timeSprite.position.set(position[0], position[1] + 0.7, position[2] + 0.2);
    timeSprite.scale.set(4, 2, 1);
    group.add(timeSprite);

    const spaceSprite = createEnhancedTextSprite(
      `Space: ${complexityData.space}`, 
      '#a855f7', 
      80,
      true
    );
    spaceSprite.position.set(position[0], position[1] - 0.7, position[2] + 0.2);
    spaceSprite.scale.set(4, 2, 1);
    group.add(spaceSprite);

    group.userData.float = true;
    return group;
  };

  const createEnhancedPlaceholder = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position = [0, 0, 0] } = data;

    const geometry = new THREE.IcosahedronGeometry(0.5, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "#60a5fa",
      emissive: "#60a5fa",
      emissiveIntensity: 0.5,
      metalness: 0.5,
      roughness: 0.2,
      wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    group.add(mesh);

    group.userData.rotate = true;
    return group;
  };

  const createComparison = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { left, right, result, position = [0, 0, 0] } = data;

    const boxGeometry = new THREE.BoxGeometry(6, 2, 0.5);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: "#3b82f6",
      emissive: "#3b82f6",
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.9
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(position[0], position[1], position[2]);
    group.add(box);

    const compText = `${left} ${result} ${right}`;
    const sprite = createEnhancedTextSprite(compText, '#ffffff', 140, true);
    sprite.position.set(position[0], position[1], position[2] + 0.3);
    sprite.scale.set(7, 3.5, 1);
    group.add(sprite);

    return group;
  };

  const createArrowIndication = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { text, position = [0, 0, 0], color = "#22c55e" } = data;

    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, 0.5);
    arrowShape.lineTo(2, 0.5);
    arrowShape.lineTo(2, 1);
    arrowShape.lineTo(3, 0);
    arrowShape.lineTo(2, -1);
    arrowShape.lineTo(2, -0.5);
    arrowShape.lineTo(0, -0.5);

    const geometry = new THREE.ExtrudeGeometry(arrowShape, {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 3
    });

    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.2
    });

    const arrow = new THREE.Mesh(geometry, material);
    arrow.position.set(position[0], position[1], position[2]);
    arrow.castShadow = true;
    group.add(arrow);

    const labelSprite = createEnhancedTextSprite(text, color, 110, true);
    labelSprite.position.set(position[0] + 1.5, position[1] + 1.5, position[2]);
    labelSprite.scale.set(8, 4, 1);
    group.add(labelSprite);

    return group;
  };

  const createSearchVisualization = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { steps = [], position = [0, 0, 0] } = data;

    steps.forEach((step: any, index: number) => {
      const yOffset = index * -2;
      
      const cardGeometry = new THREE.BoxGeometry(8, 1.5, 0.3);
      const cardMaterial = new THREE.MeshStandardMaterial({
        color: step.action.includes("found") ? "#22c55e" : "#3b82f6",
        emissive: step.action.includes("found") ? "#22c55e" : "#3b82f6",
        emissiveIntensity: 0.5
      });
      const card = new THREE.Mesh(cardGeometry, cardMaterial);
      card.position.set(position[0], position[1] + yOffset, position[2]);
      group.add(card);

      const stepText = `Index ${step.index}: ${step.value} ${step.action}`;
      const sprite = createEnhancedTextSprite(stepText, '#ffffff', 110, false);
      sprite.position.set(position[0], position[1] + yOffset, position[2] + 0.2);
      sprite.scale.set(9, 4, 1);
      group.add(sprite);
    });

    return group;
  };

  const createComplexityComparison = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { linear, binary, position = [0, 0, 0], winner } = data;

    const linearBox = new THREE.Mesh(
      new THREE.BoxGeometry(5, 3, 0.5),
      new THREE.MeshStandardMaterial({
        color: "#ef4444",
        emissive: "#ef4444",
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: winner === "linear" ? 1 : 0.5
      })
    );
    linearBox.position.set(position[0] - 4, position[1], position[2]);
    group.add(linearBox);

    const linearText = `Linear Search\n${linear.time}\n${linear.example}`;
    const linearSprite = createEnhancedTextSprite(linearText, '#ffffff', 90, false);
    linearSprite.position.set(position[0] - 4, position[1], position[2] + 0.3);
    linearSprite.scale.set(6, 3.5, 1);
    group.add(linearSprite);

    const binaryBox = new THREE.Mesh(
      new THREE.BoxGeometry(5, 3, 0.5),
      new THREE.MeshStandardMaterial({
        color: "#22c55e",
        emissive: "#22c55e",
        emissiveIntensity: winner === "binary" ? 0.7 : 0.3,
        transparent: true,
        opacity: 1
      })
    );
    binaryBox.position.set(position[0] + 4, position[1], position[2]);
    group.add(binaryBox);

    const binaryText = `Binary Search\n${binary.time}\n${binary.example}`;
    const binarySprite = createEnhancedTextSprite(binaryText, '#ffffff', 90, true);
    binarySprite.position.set(position[0] + 4, position[1], position[2] + 0.3);
    binarySprite.scale.set(6, 3.5, 1);
    group.add(binarySprite);

    if (winner) {
      const crownSprite = createEnhancedTextSprite("👑 WINNER", '#FFD700', 100, true);
      const winnerX = winner === "binary" ? 4 : -4;
      crownSprite.position.set(position[0] + winnerX, position[1] + 2, position[2]);
      crownSprite.scale.set(5, 2.5, 1);
      group.add(crownSprite);
    }

    return group;
  };

  const createStaircase = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { steps = 5, position = [0, 0, 0], highlightSteps = [], complete = false } = data;

    const stepWidth = 2;
    const stepHeight = 0.5;
    const stepDepth = 1.5;

    for (let i = 0; i < steps; i++) {
      const isHighlighted = highlightSteps.includes(i + 1);
      
      const geometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
      const material = new THREE.MeshStandardMaterial({
        color: complete ? "#22c55e" : (isHighlighted ? "#3b82f6" : "#64748b"),
        emissive: complete ? "#22c55e" : (isHighlighted ? "#3b82f6" : "#475569"),
        emissiveIntensity: isHighlighted || complete ? 0.6 : 0.3,
        metalness: 0.4,
        roughness: 0.3
      });

      const step = new THREE.Mesh(geometry, material);
      step.position.set(
        position[0] + i * 1.5,
        position[1] + i * stepHeight,
        position[2]
      );
      step.castShadow = true;
      step.receiveShadow = true;
      group.add(step);

      const edges = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({ 
        color: isHighlighted || complete ? "#60a5fa" : "#94a3b8" 
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.copy(step.position);
      group.add(wireframe);
    }

    return group;
  };

  const createStepLabel = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { step, value, position = [0, 0, 0], color = "#3b82f6", glow = false } = data;

    const bgGeometry = new THREE.CircleGeometry(0.8, 32);
    const bgMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: glow ? 0.7 : 0.4,
      metalness: 0.5,
      roughness: 0.2
    });
    const bg = new THREE.Mesh(bgGeometry, bgMaterial);
    bg.position.set(position[0], position[1], position[2]);
    group.add(bg);

    if (glow) {
      const glowGeometry = new THREE.SphereGeometry(1, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.copy(bg.position);
      group.add(glowMesh);
    }

    const valueSprite = createEnhancedTextSprite(String(value), '#ffffff', 150, glow);
    valueSprite.position.set(position[0], position[1], position[2] + 0.5);
    valueSprite.scale.set(4, 4, 1);
    group.add(valueSprite);

    group.userData.float = true;
    return group;
  };

  const createAdditionVisual = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { from = [], to, position = [0, 0, 0] } = data;

    const formula = `${from[0]} + ${from[1]} = ${to}`;
    const sprite = createEnhancedTextSprite(formula, '#a855f7', 130, true);
    sprite.position.set(position[0], position[1], position[2]);
    sprite.scale.set(8, 4, 1);
    group.add(sprite);

    const plusGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const plusMaterial = new THREE.MeshStandardMaterial({
      color: "#a855f7",
      emissive: "#a855f7",
      emissiveIntensity: 0.8
    });
    
    const plus1 = new THREE.Mesh(plusGeometry, plusMaterial);
    plus1.position.set(position[0] - 1, position[1] + 1.5, position[2]);
    group.add(plus1);
    
    const plus2 = plus1.clone();
    plus2.rotation.z = Math.PI / 2;
    group.add(plus2);

    return group;
  };

  const createPathVisualization = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { paths = 8, steps = 5, position = [0, 0, 0] } = data;

    const pathConfigs = [
      [1,1,1,1,1], [2,1,1,1], [1,2,1,1], [1,1,2,1],
      [1,1,1,2], [2,2,1], [2,1,2], [1,2,2]
    ];

    pathConfigs.slice(0, paths).forEach((pattern, index) => {
      const yOffset = Math.floor(index / 4) * -3;
      const xOffset = (index % 4) * 4 - 6;
      
      const cardGeometry = new THREE.BoxGeometry(3, 2, 0.3);
      const cardMaterial = new THREE.MeshStandardMaterial({
        color: "#3b82f6",
        emissive: "#3b82f6",
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.9
      });
      const card = new THREE.Mesh(cardGeometry, cardMaterial);
      card.position.set(position[0] + xOffset, position[1] + yOffset, position[2]);
      group.add(card);

      const pathText = pattern.join('+');
      const sprite = createEnhancedTextSprite(pathText, '#ffffff', 100, false);
      sprite.position.set(position[0] + xOffset, position[1] + yOffset, position[2] + 0.2);
      sprite.scale.set(3.5, 2, 1);
      group.add(sprite);
    });

    return group;
  };

  const createNumberSequence = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { values = [], position = [0, 0, 0] } = data;

    values.forEach((value: number, index: number) => {
      const xOffset = (index - values.length / 2) * 3;
      
      const geometry = new THREE.BoxGeometry(2, 2, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: "#a855f7",
        emissive: "#a855f7",
        emissiveIntensity: 0.5,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(position[0] + xOffset, position[1], position[2]);
      box.castShadow = true;
      group.add(box);

      const sprite = createEnhancedTextSprite(String(value), '#ffffff', 150, true);
      sprite.position.set(position[0] + xOffset, position[1], position[2] + 0.5);
      sprite.scale.set(4, 4, 1);
      group.add(sprite);

      if (index < values.length - 1) {
        const arrowGeometry = new THREE.ConeGeometry(0.2, 0.8, 8);
        const arrowMaterial = new THREE.MeshStandardMaterial({
          color: "#60a5fa",
          emissive: "#60a5fa",
          emissiveIntensity: 0.6
        });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.set(position[0] + xOffset + 1.5, position[1], position[2]);
        arrow.rotation.z = -Math.PI / 2;
        group.add(arrow);
      }
    });

    return group;
  };

  const createVariableBoxes = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { vars = [], position = [0, 0, 0] } = data;

    vars.forEach((variable: any, index: number) => {
      const xOffset = (index - vars.length / 2) * 4;
      
      const geometry = new THREE.BoxGeometry(3, 2, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: variable.color || "#3b82f6",
        emissive: variable.color || "#3b82f6",
        emissiveIntensity: variable.glow ? 0.7 : 0.4,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(position[0] + xOffset, position[1], position[2]);
      box.castShadow = true;
      group.add(box);

      const nameSprite = createEnhancedTextSprite(variable.name, '#ffffff', 90, false);
      nameSprite.position.set(position[0] + xOffset, position[1] + 0.5, position[2] + 0.3);
      nameSprite.scale.set(3.5, 2, 1);
      group.add(nameSprite);

      const valueSprite = createEnhancedTextSprite(String(variable.value), '#ffffff', 130, variable.glow);
      valueSprite.position.set(position[0] + xOffset, position[1] - 0.5, position[2] + 0.3);
      valueSprite.scale.set(4, 2.5, 1);
      group.add(valueSprite);
    });

    return group;
  };

  const createFormula = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { text, position = [0, 0, 0] } = data;

    const bgGeometry = new THREE.PlaneGeometry(8, 2);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: "#1e293b",
      transparent: true,
      opacity: 0.9
    });
    const bg = new THREE.Mesh(bgGeometry, bgMaterial);
    bg.position.set(position[0], position[1], position[2]);
    group.add(bg);

    const sprite = createEnhancedTextSprite(text, '#60a5fa', 120, true);
    sprite.position.set(position[0], position[1], position[2] + 0.1);
    sprite.scale.set(9, 4.5, 1);
    group.add(sprite);

    return group;
  };

  const createFibonacciSequence = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { values = [], position = [0, 0, 0] } = data;

    values.forEach((value: number, index: number) => {
      const xOffset = (index - values.length / 2) * 3.5;
      const scale = 1 + (index * 0.1);
      
      const geometry = new THREE.BoxGeometry(2 * scale, 2 * scale, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: "#FFD700",
        emissive: "#FFD700",
        emissiveIntensity: 0.6,
        metalness: 0.5,
        roughness: 0.2
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(position[0] + xOffset, position[1], position[2]);
      box.castShadow = true;
      group.add(box);

      const sprite = createEnhancedTextSprite(String(value), '#000000', 130, true);
      sprite.position.set(position[0] + xOffset, position[1], position[2] + 0.5);
      sprite.scale.set(3.5 * scale, 3.5 * scale, 1);
      group.add(sprite);

      if (index < values.length - 1) {
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(position[0] + xOffset + 1, position[1], position[2]),
          new THREE.Vector3(position[0] + xOffset + 1.75, position[1] + 1, position[2]),
          new THREE.Vector3(position[0] + xOffset + 3.5, position[1], position[2])
        );
        const points = curve.getPoints(30);
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const curveMaterial = new THREE.LineBasicMaterial({ color: "#FFD700", linewidth: 2 });
        const curveLine = new THREE.Line(curveGeometry, curveMaterial);
        group.add(curveLine);
      }
    });

    group.userData.float = true;
    return group;
  };

  const createArrowPath = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { from, to, label, position = [0, 0, 0], color = "#3b82f6" } = data;

    const startPos = new THREE.Vector3(from * 1.5, from * 0.5, 0);
    const endPos = new THREE.Vector3(to * 1.5, to * 0.5, 0);
    
    const curve = new THREE.QuadraticBezierCurve3(
      startPos,
      new THREE.Vector3((startPos.x + endPos.x) / 2, (startPos.y + endPos.y) / 2 + 2, 0),
      endPos
    );
    
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color, linewidth: 3 });
    const line = new THREE.Line(geometry, material);
    group.add(line);

    const arrowGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
    const arrowMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.7
    });
    const arrowHead = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrowHead.position.copy(endPos);
    arrowHead.lookAt(startPos);
    arrowHead.rotateX(Math.PI / 2);
    group.add(arrowHead);

    if (label) {
      const labelSprite = createEnhancedTextSprite(label, color, 90, true);
      const midPoint = curve.getPoint(0.5);
      labelSprite.position.set(midPoint.x, midPoint.y + 0.5, midPoint.z + 0.5);
      labelSprite.scale.set(4, 2, 1);
      group.add(labelSprite);
    }

    return group;
  };

  const createBinaryTreeStructure = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { nodes = [], position = [0, 0, 0] } = data;

    const nodeObjects = Array.isArray(nodes) && typeof nodes[0] === 'number' 
      ? convertArrayToTreeNodes(nodes)
      : nodes;

    nodeObjects.forEach((node: any) => {
      const pos = node.position || [0, 0, 0];
      
      const geometry = new THREE.SphereGeometry(0.8, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: node.highlighted ? "#FFD700" : "#3b82f6",
        emissive: node.highlighted ? "#FFD700" : "#3b82f6",
        emissiveIntensity: node.highlighted ? 0.7 : 0.4,
        metalness: 0.5,
        roughness: 0.2,
        transparent: node.opacity !== undefined,
        opacity: node.opacity || 1
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(pos[0], pos[1], pos[2]);
      sphere.castShadow = true;
      group.add(sphere);

      if (node.checkmark) {
        const checkSprite = createEnhancedTextSprite("✓", '#22c55e', 100, true);
        checkSprite.position.set(pos[0] + 1.2, pos[1] + 1.2, pos[2]);
        checkSprite.scale.set(2, 2, 1);
        group.add(checkSprite);
      }

      const valueSprite = createEnhancedTextSprite(String(node.value), '#ffffff', 130, true);
      valueSprite.position.set(pos[0], pos[1], pos[2] + 0.9);
      valueSprite.scale.set(3, 3, 1);
      group.add(valueSprite);

      if (node.parent !== undefined) {
        const parentNode = nodeObjects.find((n: any) => n.value === node.parent);
        if (parentNode && parentNode.position) {
          const start = new THREE.Vector3(parentNode.position[0], parentNode.position[1], parentNode.position[2]);
          const end = new THREE.Vector3(pos[0], pos[1], pos[2]);
          
          const points = [start, end];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ 
            color: node.highlighted ? "#FFD700" : "#60a5fa",
            linewidth: 2
          });
          const line = new THREE.Line(geometry, material);
          group.add(line);
        }
      }
    });

    group.position.set(position[0], position[1], position[2]);
    return group;
  };

  const createTree3D = (data: any): THREE.Group => {
    return createBinaryTreeStructure(data);
  };

  const createNodeHighlight = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { value, position = [0, 0, 0], color = "#FFD700" } = data;

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.2
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position[0], position[1], position[2]);
    sphere.castShadow = true;
    group.add(sphere);

    const ringGeometry = new THREE.TorusGeometry(1.3, 0.1, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(sphere.position);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const valueSprite = createEnhancedTextSprite(String(value), '#000000', 140, true);
    valueSprite.position.set(position[0], position[1], position[2] + 1);
    valueSprite.scale.set(3.5, 3.5, 1);
    group.add(valueSprite);

    group.userData.rotate = true;
    return group;
  };

  const createSwapAnimation = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { node1, node2, animated = true } = data;

    const start = new THREE.Vector3(node1.from[0], node1.from[1], node1.from[2]);
    const end = new THREE.Vector3(node1.to[0], node1.to[1], node1.to[2]);
    
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3((start.x + end.x) / 2, Math.max(start.y, end.y) + 2, (start.z + end.z) / 2),
      end
    );

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "#a855f7", linewidth: 3 });
    const line = new THREE.Line(geometry, material);
    group.add(line);

    const start2 = new THREE.Vector3(node2.from[0], node2.from[1], node2.from[2]);
    const end2 = new THREE.Vector3(node2.to[0], node2.to[1], node2.to[2]);
    
    const curve2 = new THREE.QuadraticBezierCurve3(
      start2,
      new THREE.Vector3((start2.x + end2.x) / 2, Math.max(start2.y, end2.y) + 2, (start2.z + end2.z) / 2),
      end2
    );

    const points2 = curve2.getPoints(50);
    const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    const material2 = new THREE.LineBasicMaterial({ color: "#22c55e", linewidth: 3 });
    const line2 = new THREE.Line(geometry2, material2);
    group.add(line2);

    const swapSprite = createEnhancedTextSprite("SWAP", '#a855f7', 110, true);
    swapSprite.position.set(0, 1, 0);
    swapSprite.scale.set(6, 3, 1);
    group.add(swapSprite);

    return group;
  };

  const createSideBySideTrees = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { before = [], after = [], position = [0, 0, 0], labels = [] } = data;

    const beforeNodes = convertArrayToTreeNodes(before);
    beforeNodes.forEach((node: any) => {
      if (node.position) {
        node.position = [node.position[0] - 6, node.position[1], node.position[2]];
      }
    });
    const beforeTree = createBinaryTreeStructure({ nodes: beforeNodes, position: [0, 0, 0] });
    group.add(beforeTree);

    if (labels[0]) {
      const labelSprite = createEnhancedTextSprite(labels[0], '#60a5fa', 90, true);
      labelSprite.position.set(-6, 4, 0);
      labelSprite.scale.set(5, 2.5, 1);
      group.add(labelSprite);
    }

    const afterNodes = convertArrayToTreeNodes(after);
    afterNodes.forEach((node: any) => {
      if (node.position) {
        node.position = [node.position[0] + 6, node.position[1], node.position[2]];
      }
    });
    const afterTree = createBinaryTreeStructure({ nodes: afterNodes, position: [0, 0, 0] });
    group.add(afterTree);

    if (labels[1]) {
      const labelSprite = createEnhancedTextSprite(labels[1], '#22c55e', 90, true);
      labelSprite.position.set(6, 4, 0);
      labelSprite.scale.set(5, 2.5, 1);
      group.add(labelSprite);
    }

    const arrowGeometry = new THREE.ConeGeometry(0.4, 1.5, 8);
    const arrowMaterial = new THREE.MeshStandardMaterial({
      color: "#a855f7",
      emissive: "#a855f7",
      emissiveIntensity: 0.7
    });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.set(0, 0, 0);
    arrow.rotation.z = -Math.PI / 2;
    group.add(arrow);

    group.position.set(position[0], position[1], position[2]);
    return group;
  };

  const createRecursionTreeVisual = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { calls = [], position = [0, 0, 0] } = data;

    calls.forEach((call: any, index: number) => {
      const xOffset = (call.depth - 1) * 3;
      const yOffset = -index * 1.5;

      const boxGeometry = new THREE.BoxGeometry(2.5, 1.2, 0.4);
      const boxMaterial = new THREE.MeshStandardMaterial({
        color: "#3b82f6",
        emissive: "#3b82f6",
        emissiveIntensity: 0.4,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.set(position[0] + xOffset, position[1] + yOffset, position[2]);
      group.add(box);

      const callText = `f(${call.node})`;
      const textSprite = createEnhancedTextSprite(callText, '#ffffff', 100, false);
      textSprite.position.set(position[0] + xOffset, position[1] + yOffset, position[2] + 0.3);
      textSprite.scale.set(3, 1.5, 1);
      group.add(textSprite);

      if (call.parent !== undefined) {
        const parentCall = calls.find((c: any) => c.node === call.parent);
        if (parentCall) {
          const parentIndex = calls.indexOf(parentCall);
          const parentX = position[0] + (parentCall.depth - 1) * 3;
          const parentY = position[1] - parentIndex * 1.5;
          
          const start = new THREE.Vector3(parentX, parentY - 0.6, position[2]);
          const end = new THREE.Vector3(position[0] + xOffset, position[1] + yOffset + 0.6, position[2]);
          
          const points = [start, end];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color: "#60a5fa" });
          const line = new THREE.Line(geometry, material);
          group.add(line);
        }
      }
    });

    return group;
  };

  const createLinkedListChain = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { nodes = [], position = [0, 0, 0], arrows = "forward", reversedUntil, glow = false, glowing = false } = data;

    const spacing = 3;
    const startX = -(nodes.length - 1) * spacing / 2;

    nodes.forEach((value: number, index: number) => {
      const xPos = startX + index * spacing;
      const isReversed = reversedUntil !== undefined && index <= reversedUntil;
      const shouldGlow = glow || glowing;

      const geometry = new THREE.BoxGeometry(2, 1.5, 1);
      const material = new THREE.MeshStandardMaterial({
        color: shouldGlow ? "#22c55e" : "#3b82f6",
        emissive: shouldGlow ? "#22c55e" : "#3b82f6",
        emissiveIntensity: shouldGlow ? 0.7 : 0.4,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(position[0] + xPos, position[1], position[2]);
      box.castShadow = true;
      group.add(box);

      const edges = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({ color: shouldGlow ? "#22c55e" : "#60a5fa" });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.copy(box.position);
      group.add(wireframe);

      const valueSprite = createEnhancedTextSprite(String(value), '#ffffff', 130, shouldGlow);
      valueSprite.position.set(position[0] + xPos, position[1], position[2] + 0.8);
      valueSprite.scale.set(3, 3, 1);
      group.add(valueSprite);

      if (index < nodes.length - 1) {
        const arrowStart = position[0] + xPos + 1;
        const arrowEnd = position[0] + xPos + spacing - 1;
        const arrowY = position[1];

        const arrowGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(arrowStart, arrowY, position[2]),
          new THREE.Vector3(arrowEnd, arrowY, position[2])
        ]);
        const arrowMaterial = new THREE.LineBasicMaterial({ 
          color: isReversed ? "#22c55e" : "#60a5fa",
          linewidth: 2
        });
        const arrowLine = new THREE.Line(arrowGeometry, arrowMaterial);
        group.add(arrowLine);

        const headGeometry = new THREE.ConeGeometry(0.2, 0.6, 8);
        const headMaterial = new THREE.MeshStandardMaterial({
          color: isReversed ? "#22c55e" : "#60a5fa",
          emissive: isReversed ? "#22c55e" : "#60a5fa",
          emissiveIntensity: 0.6
        });
        const arrowHead = new THREE.Mesh(headGeometry, headMaterial);
        arrowHead.position.set(
          arrows === "backward" || isReversed ? arrowStart : arrowEnd,
          arrowY,
          position[2]
        );
        arrowHead.rotation.z = (arrows === "backward" || isReversed) ? Math.PI / 2 : -Math.PI / 2;
        group.add(arrowHead);
      }
    });

    return group;
  };

  const createHighlightArrow = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { from, to, color = "#22c55e", animated = true } = data;

    const spacing = 3;
    const nodeCount = 4;
    const startX = -(nodeCount - 1) * spacing / 2;
    
    const fromX = startX + from * spacing;
    const toX = to === "null" ? fromX - 1.5 : startX + to * spacing;

    const start = new THREE.Vector3(fromX + 1, 0, 0);
    const end = new THREE.Vector3(toX, to === "null" ? -1.5 : 0, 0);
    
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3((start.x + end.x) / 2, Math.max(start.y, end.y) + 1.5, 0),
      end
    );

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color, linewidth: 3 });
    const line = new THREE.Line(geometry, material);
    group.add(line);

    const arrowGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
    const arrowMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.7
    });
    const arrowHead = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrowHead.position.copy(end);
    arrowHead.lookAt(start);
    arrowHead.rotateX(Math.PI / 2);
    group.add(arrowHead);

    return group;
  };

  const createStackContainer = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position = [0, 0, 0], size = [4, 6, 4], color = "#3b82f6", opacity = 0.2, empty = false } = data;

    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      emissive: color,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0], position[1], position[2]);
    group.add(box);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: color });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(box.position);
    group.add(wireframe);

    const labelSprite = createEnhancedTextSprite("STACK", color, 90, true);
    labelSprite.position.set(position[0], position[1] + size[1]/2 + 1, position[2]);
    labelSprite.scale.set(4, 2, 1);
    group.add(labelSprite);

    if (empty) {
      const emptySprite = createEnhancedTextSprite("(empty)", '#94a3b8', 70, false);
      emptySprite.position.set(position[0], position[1], position[2] + size[2]/2 + 0.5);
      emptySprite.scale.set(3, 1.5, 1);
      group.add(emptySprite);
    }

    return group;
  };

  const createStackVisualization = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { items = [], position = [0, 0, 0], topGlow = false, poppedItem, match, mismatch = false } = data;

    const itemHeight = 1.2;
    const startY = position[1] - (items.length * itemHeight) / 2;

    const containerSize = [3.5, Math.max(6, items.length * itemHeight + 2), 2];
    const containerGeometry = new THREE.BoxGeometry(...containerSize);
    const containerMaterial = new THREE.MeshStandardMaterial({
      color: mismatch ? "#ef4444" : "#3b82f6",
      transparent: true,
      opacity: 0.15,
      emissive: mismatch ? "#ef4444" : "#3b82f6",
      emissiveIntensity: 0.2
    });
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    container.position.set(position[0], position[1], position[2]);
    group.add(container);

    items.forEach((item: string, index: number) => {
      const yPos = startY + index * itemHeight;
      const isTop = index === items.length - 1;

      const boxGeometry = new THREE.BoxGeometry(3, 1, 1.5);
      const boxMaterial = new THREE.MeshStandardMaterial({
        color: isTop && topGlow ? "#22c55e" : "#60a5fa",
        emissive: isTop && topGlow ? "#22c55e" : "#60a5fa",
        emissiveIntensity: isTop && topGlow ? 0.7 : 0.4,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.set(position[0], yPos, position[2]);
      box.castShadow = true;
      group.add(box);

      const textSprite = createEnhancedTextSprite(item, '#ffffff', 130, isTop && topGlow);
      textSprite.position.set(position[0], yPos, position[2] + 0.8);
      textSprite.scale.set(3, 3, 1);
      group.add(textSprite);
    });

    if (poppedItem) {
      const popYPos = startY + items.length * itemHeight + 1.5;
      const popBox = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1, 1.5),
        new THREE.MeshStandardMaterial({
          color: match ? "#22c55e" : "#ef4444",
          emissive: match ? "#22c55e" : "#ef4444",
          emissiveIntensity: 0.7,
          transparent: true,
          opacity: 0.7
        })
      );
      popBox.position.set(position[0], popYPos, position[2]);
      group.add(popBox);

      const popText = createEnhancedTextSprite(poppedItem, '#ffffff', 130, true);
      popText.position.set(position[0], popYPos, position[2] + 0.8);
      popText.scale.set(3, 3, 1);
      group.add(popText);
    }

    const labelSprite = createEnhancedTextSprite("STACK", '#60a5fa', 80, false);
    labelSprite.position.set(position[0], position[1] + containerSize[1]/2 + 1, position[2]);
    labelSprite.scale.set(3.5, 1.75, 1);
    group.add(labelSprite);

    return group;
  };

  const createStackItems = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { items = [], position = [0, 0, 0] } = data;

    const itemHeight = 1.2;
    items.forEach((item: string, index: number) => {
      const yPos = position[1] + index * itemHeight;

      const geometry = new THREE.BoxGeometry(3, 1, 1.5);
      const material = new THREE.MeshStandardMaterial({
        color: "#60a5fa",
        emissive: "#60a5fa",
        emissiveIntensity: 0.4,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(position[0], yPos, position[2]);
      box.castShadow = true;
      group.add(box);

      const textSprite = createEnhancedTextSprite(item, '#ffffff', 120, false);
      textSprite.position.set(position[0], yPos, position[2] + 0.8);
      textSprite.scale.set(3, 3, 1);
      group.add(textSprite);
    });

    return group;
  };

  const createEmptyStack = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { position = [0, 0, 0], glow = false } = data;

    const containerSize = [3.5, 6, 2];
    const containerGeometry = new THREE.BoxGeometry(...containerSize);
    const containerMaterial = new THREE.MeshStandardMaterial({
      color: glow ? "#22c55e" : "#3b82f6",
      transparent: true,
      opacity: 0.15,
      emissive: glow ? "#22c55e" : "#3b82f6",
      emissiveIntensity: glow ? 0.6 : 0.2
    });
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    container.position.set(position[0], position[1], position[2]);
    group.add(container);

    const emptySprite = createEnhancedTextSprite("EMPTY", glow ? '#22c55e' : '#94a3b8', 110, glow);
    emptySprite.position.set(position[0], position[1], position[2] + 1.5);
    emptySprite.scale.set(4, 2, 1);
    group.add(emptySprite);

    if (glow) {
      const glowGeometry = new THREE.BoxGeometry(containerSize[0] + 1, containerSize[1] + 1, containerSize[2] + 1);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: "#22c55e",
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });
      const glowBox = new THREE.Mesh(glowGeometry, glowMaterial);
      glowBox.position.copy(container.position);
      group.add(glowBox);
    }

    return group;
  };

  const createMatchIndicator = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { show = true, color = "#22c55e" } = data;

    if (!show) return group;

    const symbol = color === "#22c55e" ? "✓ MATCH" : "✗ MISMATCH";
    const sprite = createEnhancedTextSprite(symbol, color, 120, true);
    sprite.position.set(0, 0, 0);
    sprite.scale.set(6, 3, 1);
    group.add(sprite);

    return group;
  };

  const createStringDisplay = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { text = "", position = [0, 0, 0], highlightIndex, highlightRange, allMatched = false, error = false, glowColor } = data;

    const spacing = 2.5;
    const startX = -(text.length - 1) * spacing / 2;

    text.split('').forEach((char: string, index: number) => {
      const xPos = startX + index * spacing;
      const isHighlighted = highlightIndex === index || 
                           (highlightRange && index >= highlightRange[0] && index <= highlightRange[1]);
      const boxColor = error && isHighlighted ? "#ef4444" :
                      allMatched ? "#22c55e" :
                      isHighlighted ? (glowColor || "#FFD700") : "#60a5fa";

      const geometry = new THREE.BoxGeometry(2, 2, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: boxColor,
        emissive: boxColor,
        emissiveIntensity: isHighlighted ? 0.7 : 0.3,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(position[0] + xPos, position[1], position[2]);
      box.castShadow = true;
      group.add(box);

      if (isHighlighted) {
        const glowGeometry = new THREE.BoxGeometry(2.5, 2.5, 1);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: boxColor,
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(box.position);
        group.add(glow);
      }

      const charSprite = createEnhancedTextSprite(char, '#ffffff', 140, isHighlighted);
      charSprite.position.set(position[0] + xPos, position[1], position[2] + 0.5);
      charSprite.scale.set(3.5, 3.5, 1);
      group.add(charSprite);

      const indexSprite = createEnhancedTextSprite(`${index}`, '#94a3b8', 70, false);
      indexSprite.position.set(position[0] + xPos, position[1] - 1.5, position[2]);
      indexSprite.scale.set(2, 1, 1);
      group.add(indexSprite);
    });

    return group;
  };

  const createStringArray = (data: any): THREE.Group => {
    return createStringDisplay(data);
  };

  const createWindowRectangle = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { start = 0, end = 2, position = [0, 0, 0], color = "#3b82f6", opacity = 0.3 } = data;

    const spacing = 2.5;
    const width = (end - start + 1) * spacing;
    const centerOffset = ((start + end) / 2 - 3.5) * spacing;

    const geometry = new THREE.PlaneGeometry(width + 0.5, 3);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(position[0] + centerOffset, position[1], position[2] - 0.3);
    group.add(plane);

    const borderGeometry = new THREE.EdgesGeometry(geometry);
    const borderMaterial = new THREE.LineBasicMaterial({ color: color, linewidth: 3 });
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    border.position.copy(plane.position);
    group.add(border);

    return group;
  };

  const createWindowHighlight = (data: any): THREE.Group => {
    return createWindowRectangle(data);
  };

  const createHashMapVisualization = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { entries = [], position = [0, 0, 0] } = data;

    const containerHeight = Math.max(4, entries.length * 1.5 + 1);
    const containerGeometry = new THREE.BoxGeometry(5, containerHeight, 1.5);
    const containerMaterial = new THREE.MeshStandardMaterial({
      color: "#a855f7",
      transparent: true,
      opacity: 0.2,
      emissive: "#a855f7",
      emissiveIntensity: 0.3
    });
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    container.position.set(position[0], position[1], position[2]);
    group.add(container);

    const labelSprite = createEnhancedTextSprite("Hash Map", '#a855f7', 90, true);
    labelSprite.position.set(position[0], position[1] + containerHeight/2 + 1, position[2]);
    labelSprite.scale.set(5, 2.5, 1);
    group.add(labelSprite);

    const startY = position[1] + containerHeight/2 - 1;
    entries.forEach((entry: any, index: number) => {
      const yPos = startY - index * 1.3;
      
      const entryText = `'${entry.key}': ${entry.value}`;
      const entrySprite = createEnhancedTextSprite(entryText, '#ffffff', 90, false);
      entrySprite.position.set(position[0], yPos, position[2] + 0.8);
      entrySprite.scale.set(4, 2, 1);
      group.add(entrySprite);
    });

    return group;
  };

  const createVariableDisplay = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { name = "var", value, position = [0, 0, 0], glow = false, color = "#3b82f6" } = data;

    const geometry = new THREE.BoxGeometry(3, 2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: glow ? "#FFD700" : color,
      emissive: glow ? "#FFD700" : color,
      emissiveIntensity: glow ? 0.7 : 0.4,
      metalness: 0.4,
      roughness: 0.3
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0], position[1], position[2]);
    box.castShadow = true;
    group.add(box);

    const nameSprite = createEnhancedTextSprite(name, '#ffffff', 80, false);
    nameSprite.position.set(position[0], position[1] + 0.5, position[2] + 0.6);
    nameSprite.scale.set(2.5, 1.5, 1);
    group.add(nameSprite);

    const valueSprite = createEnhancedTextSprite(String(value), '#ffffff', 120, glow);
    valueSprite.position.set(position[0], position[1] - 0.5, position[2] + 0.6);
    valueSprite.scale.set(3.5, 2, 1);
    group.add(valueSprite);

    return group;
  };

  const createHighlightBestSubstring = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { text = "", position = [0, 0, 0], color = "#22c55e", glow = true } = data;

    const boxGeometry = new THREE.BoxGeometry(text.length * 2 + 1, 2.5, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.2
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(position[0], position[1], position[2]);
    box.castShadow = true;
    group.add(box);

    if (glow) {
      const glowGeometry = new THREE.BoxGeometry(boxGeometry.parameters.width + 1, 3, 1.5);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glowBox = new THREE.Mesh(glowGeometry, glowMaterial);
      glowBox.position.copy(box.position);
      group.add(glowBox);
    }

    const textSprite = createEnhancedTextSprite(`"${text}"`, '#ffffff', 130, true);
    textSprite.position.set(position[0], position[1], position[2] + 0.6);
    textSprite.scale.set(5, 2.5, 1);
    group.add(textSprite);

    group.userData.rotate = true;
    return group;
  };

  const createBestSubstringVisual = (data: any): THREE.Group => {
    return createHighlightBestSubstring(data);
  };

  const createSubarrayHighlight = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { start, end, position = [0, 0, 0], color = "#22c55e", glow = false, glowing = false } = data;

    const spacing = 3;
    const width = (end - start + 1) * spacing;
    const centerX = ((start + end) / 2 - 4) * spacing;

    const geometry = new THREE.BoxGeometry(width + 0.5, 2.5, 1);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: glow || glowing ? 0.7 : 0.4,
      metalness: 0.5,
      roughness: 0.2,
      transparent: true,
      opacity: 0.6
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0] + centerX, position[1], position[2] - 0.5);
    box.castShadow = true;
    group.add(box);

    if (glow || glowing) {
      const glowGeometry = new THREE.BoxGeometry(width + 1.5, 3, 1.5);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
        side: THREE.BackSide
      });
      const glowBox = new THREE.Mesh(glowGeometry, glowMaterial);
      glowBox.position.copy(box.position);
      group.add(glowBox);
    }

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: color, linewidth: 3 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(box.position);
    group.add(wireframe);

    return group;
  };

  const createDecisionVisual = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { options = [], chosen = 0, position = [0, 0, 0] } = data;

    options.forEach((option: string, index: number) => {
      const isChosen = index === chosen;
      const xOffset = (index - options.length / 2) * 5 + 2.5;

      const geometry = new THREE.BoxGeometry(4, 1.5, 0.5);
      const material = new THREE.MeshStandardMaterial({
        color: isChosen ? "#22c55e" : "#64748b",
        emissive: isChosen ? "#22c55e" : "#64748b",
        emissiveIntensity: isChosen ? 0.7 : 0.3,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(position[0] + xOffset, position[1], position[2]);
      box.castShadow = true;
      group.add(box);

      const textSprite = createEnhancedTextSprite(option, '#ffffff', 90, isChosen);
      textSprite.position.set(position[0] + xOffset, position[1], position[2] + 0.3);
      textSprite.scale.set(3.5, 2, 1);
      group.add(textSprite);

      if (isChosen) {
        const checkSprite = createEnhancedTextSprite("✓", '#22c55e', 100, true);
        checkSprite.position.set(position[0] + xOffset, position[1] + 1.5, position[2]);
        checkSprite.scale.set(3, 3, 1);
        group.add(checkSprite);
      }
    });

    return group;
  };

  const createVariableBox = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { name = "var", value = "?", position = [0, 0, 0], color = "#3b82f6" } = data;

    const geometry = new THREE.BoxGeometry(3.5, 2.5, 1);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.3
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(position[0], position[1], position[2]);
    box.castShadow = true;
    group.add(box);

    const nameSprite = createEnhancedTextSprite(name, '#ffffff', 85, false);
    nameSprite.position.set(position[0], position[1] + 0.7, position[2] + 0.6);
    nameSprite.scale.set(3, 1.5, 1);
    group.add(nameSprite);

    const valueSprite = createEnhancedTextSprite(String(value), '#ffffff', 130, false);
    valueSprite.position.set(position[0], position[1] - 0.6, position[2] + 0.6);
    valueSprite.scale.set(4, 2, 1);
    group.add(valueSprite);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: color });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(box.position);
    group.add(wireframe);

    return group;
  };

  const createArraySplitting = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { values = [], position = [0, 0, 0] } = data;

    const spacing = 2.5;
    const startX = -(values.length - 1) * spacing / 2;

    values.forEach((value: number, index: number) => {
      const xPos = startX + index * spacing;
      
      const geometry = new THREE.BoxGeometry(2, 2, 1);
      const material = new THREE.MeshStandardMaterial({
        color: "#a855f7",
        emissive: "#a855f7",
        emissiveIntensity: 0.4,
        metalness: 0.4,
        roughness: 0.3
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(position[0] + xPos, position[1], position[2]);
      box.castShadow = true;
      group.add(box);

      const valueSprite = createEnhancedTextSprite(String(value), '#ffffff', 130, false);
      valueSprite.position.set(position[0] + xPos, position[1], position[2] + 0.6);
      valueSprite.scale.set(3, 3, 1);
      group.add(valueSprite);
    });

    if (values.length > 1) {
      const midX = position[0];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(midX, position[1] - 1.5, position[2]),
        new THREE.Vector3(midX, position[1] + 1.5, position[2])
      ]);
      const lineMaterial = new THREE.LineDashedMaterial({
        color: "#ef4444",
        linewidth: 3,
        dashSize: 0.3,
        gapSize: 0.2
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.computeLineDistances();
      group.add(line);
    }

    return group;
  };

  const createSplitArrow = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { from = [0, 0, 0], to = [[0, 0, 0], [0, 0, 0]], animated = false } = data;

    to.forEach((target: number[]) => {
      const start = new THREE.Vector3(from[0], from[1], from[2]);
      const end = new THREE.Vector3(target[0], target[1], target[2]);
      
      const curve = new THREE.QuadraticBezierCurve3(
        start,
        new THREE.Vector3((start.x + end.x) / 2, start.y - 1, (start.z + end.z) / 2),
        end
      );

      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: "#60a5fa", linewidth: 2 });
      const line = new THREE.Line(geometry, material);
      group.add(line);

      const arrowGeometry = new THREE.ConeGeometry(0.2, 0.6, 8);
      const arrowMaterial = new THREE.MeshStandardMaterial({
        color: "#60a5fa",
        emissive: "#60a5fa",
        emissiveIntensity: 0.6
      });
      const arrowHead = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrowHead.position.copy(end);
      arrowHead.lookAt(start);
      arrowHead.rotateX(Math.PI / 2);
      group.add(arrowHead);
    });

    return group;
  };

  const createMergeAnimation = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { left = [], right = [], result = [], position = [0, 0, 0], animated = false } = data;

    const spacing = 2.5;

    const leftStartX = -(left.length - 1) * spacing / 2 - 3;
    left.forEach((value: number, index: number) => {
      const box = createArrayBox(value, leftStartX + index * spacing, position[1] + 2, position[2], "#3b82f6");
      group.add(box);
    });
    const leftLabel = createEnhancedTextSprite("Left", '#3b82f6', 80, false);
    leftLabel.position.set(leftStartX, position[1] + 3.5, position[2]);
    leftLabel.scale.set(3, 1.5, 1);
    group.add(leftLabel);

    const rightStartX = -(right.length - 1) * spacing / 2 + 3;
    right.forEach((value: number, index: number) => {
      const box = createArrayBox(value, rightStartX + index * spacing, position[1] + 2, position[2], "#a855f7");
      group.add(box);
    });
    const rightLabel = createEnhancedTextSprite("Right", '#a855f7', 80, false);
    rightLabel.position.set(rightStartX, position[1] + 3.5, position[2]);
    rightLabel.scale.set(3, 1.5, 1);
    group.add(rightLabel);

    const resultStartX = -(result.length - 1) * spacing / 2;
    result.forEach((value: number, index: number) => {
      const box = createArrayBox(value, resultStartX + index * spacing, position[1] - 2, position[2], "#22c55e", true);
      group.add(box);
    });
    const resultLabel = createEnhancedTextSprite("Merged", '#22c55e', 90, true);
    resultLabel.position.set(0, position[1] - 3.5, position[2]);
    resultLabel.scale.set(4, 2, 1);
    group.add(resultLabel);

    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.8, 8);
    const arrowMaterial = new THREE.MeshStandardMaterial({
      color: "#22c55e",
      emissive: "#22c55e",
      emissiveIntensity: 0.6
    });
    const arrow1 = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow1.position.set(-1.5, position[1], position[2]);
    arrow1.rotation.z = Math.PI;
    group.add(arrow1);

    const arrow2 = arrow1.clone();
    arrow2.position.set(1.5, position[1], position[2]);
    group.add(arrow2);

    return group;
  };

  const createMergeSortTree = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { original = [], position = [0, 0, 0], showAllSteps = false } = data;

    const createTreeLevel = (arr: number[], depth: number, xOffset: number, yPos: number) => {
      if (arr.length === 0) return;

      const spacing = Math.max(2.5, 12 / Math.pow(2, depth));
      const boxWidth = Math.min(2, spacing - 0.5);

      arr.forEach((value: number, index: number) => {
        const xPos = xOffset + (index - arr.length / 2) * spacing;
        
        const geometry = new THREE.BoxGeometry(boxWidth, 1.5, 0.8);
        const material = new THREE.MeshStandardMaterial({
          color: depth === 0 ? "#a855f7" : arr.length === 1 ? "#22c55e" : "#3b82f6",
          emissive: depth === 0 ? "#a855f7" : arr.length === 1 ? "#22c55e" : "#3b82f6",
          emissiveIntensity: 0.4,
          metalness: 0.3,
          roughness: 0.3
        });
        const box = new THREE.Mesh(geometry, material);
        box.position.set(xPos, yPos, 0);
        box.castShadow = true;
        group.add(box);

        const textSprite = createEnhancedTextSprite(String(value), '#ffffff', 100, false);
        textSprite.position.set(xPos, yPos, 0.5);
        textSprite.scale.set(2, 2, 1);
        group.add(textSprite);
      });

      if (arr.length > 1 && depth < 3) {
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);

        const nextY = yPos - 3;
        createTreeLevel(left, depth + 1, xOffset - spacing * arr.length / 4, nextY);
        createTreeLevel(right, depth + 1, xOffset + spacing * arr.length / 4, nextY);
      }
    };

    createTreeLevel(original, 0, position[0], position[1]);

    return group;
  };

  const createCheckmarks = (data: any): THREE.Group => {
    const group = new THREE.Group();
    const { count = 1, positions, position = [0, 0, 0], color = "#22c55e" } = data;

    if (positions) {
      positions.forEach((pos: number[]) => {
        const checkSprite = createEnhancedTextSprite("✓", color, 120, true);
        checkSprite.position.set(pos[0], pos[1], pos[2]);
        checkSprite.scale.set(3, 3, 1);
        group.add(checkSprite);
      });
    } else {
      const spacing = 3;
      for (let i = 0; i < count; i++) {
        const xOffset = (i - (count - 1) / 2) * spacing;
        const checkSprite = createEnhancedTextSprite("✓", color, 120, true);
        checkSprite.position.set(position[0] + xOffset, position[1], position[2]);
        checkSprite.scale.set(3, 3, 1);
        group.add(checkSprite);
      }
    }

    return group;
  };

  // Control functions
  const handleZoomIn = () => {
    zoomRef.current = Math.min(zoomRef.current + 0.25, 3);
    updateCameraZoom();
  };

  const handleZoomOut = () => {
    zoomRef.current = Math.max(zoomRef.current - 0.25, 0.3);
    updateCameraZoom();
  };

  const updateCameraZoom = () => {
    if (cameraRef.current) {
      const camPos = sceneData.camera?.position || [0, 8, 20];
      const scale = 1 / zoomRef.current;
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
    setAutoRotate(true);
    updateCameraZoom();
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden' }} />

      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 10
      }}>
        <button onClick={handleZoomIn} style={{
          padding: '14px 18px', 
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          border: 'none',
          borderRadius: '12px', 
          color: 'white', 
          fontSize: '18px', 
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.2s',
          fontWeight: '600'
        }} title="Zoom In"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >+</button>

        <button onClick={handleZoomOut} style={{
          padding: '14px 18px', 
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          border: 'none',
          borderRadius: '12px', 
          color: 'white', 
          fontSize: '18px', 
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.2s',
          fontWeight: '600'
        }} title="Zoom Out"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >−</button>

        <button onClick={handleResetCamera} style={{
          padding: '14px 18px', 
          background: 'linear-gradient(135deg, #a855f7, #9333ea)',
          border: 'none',
          borderRadius: '12px', 
          color: 'white', 
          fontSize: '16px', 
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(168, 85, 247, 0.4)',
          transition: 'all 0.2s',
          fontWeight: '600'
        }} title="Reset View"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >🎯</button>

        <button onClick={() => setAutoRotate(!autoRotate)} style={{
          padding: '14px 18px',
          background: autoRotate 
            ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
            : 'linear-gradient(135deg, #6b7280, #4b5563)',
          border: 'none', 
          borderRadius: '12px', 
          color: 'white', 
          fontSize: '16px',
          cursor: 'pointer', 
          boxShadow: autoRotate 
            ? '0 6px 20px rgba(34, 197, 94, 0.4)'
            : '0 6px 20px rgba(107, 114, 128, 0.4)',
          transition: 'all 0.2s',
          fontWeight: '600'
        }} title={autoRotate ? "Stop Rotation" : "Auto Rotate"}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {autoRotate ? '⏸' : '▶'}
        </button>
      </div>

      <div style={{
        position: 'absolute', 
        top: '16px', 
        left: '16px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        padding: '16px 20px',
        borderRadius: '12px', 
        color: 'white', 
        fontSize: '13px', 
        zIndex: 10,
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: '#60a5fa' }}>
          🎮 3D Controls
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'rgba(255, 255, 255, 0.9)' }}>
          <div>• <strong>Scroll:</strong> Zoom in/out</div>
          <div>• <strong>Auto-rotate:</strong> Smooth animation</div>
          <div>• <strong>Buttons:</strong> Control camera</div>
        </div>
      </div>
    </div>
  );
}