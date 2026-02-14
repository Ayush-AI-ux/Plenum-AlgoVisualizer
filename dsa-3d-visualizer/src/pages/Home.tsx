// import { useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout, getToken } from "../services/authService";
// import * as THREE from "three";

// export default function Home() {
//   const navigate = useNavigate();
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     // Check if user is authenticated
//     const token = getToken();
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       alpha: true,
//       antialias: true,
//     });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0x000000, 1);
//     camera.position.z = 30;

//     // Create Orange Particle System
//     const particleCount = 2000;
//     const particlesGeometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(particleCount * 3);
//     const velocities: number[] = [];
//     const colors = new Float32Array(particleCount * 3);

//     // Orange color variations
//     const orangeColors = [
//       new THREE.Color(0xff6b35),
//       new THREE.Color(0xff8c42),
//       new THREE.Color(0xffa64d),
//       new THREE.Color(0xff5722),
//       new THREE.Color(0xffb347),
//     ];

//     for (let i = 0; i < particleCount; i++) {
//       const i3 = i * 3;
      
//       positions[i3] = (Math.random() - 0.5) * 100;
//       positions[i3 + 1] = (Math.random() - 0.5) * 100;
//       positions[i3 + 2] = (Math.random() - 0.5) * 60;

//       velocities.push(
//         (Math.random() - 0.5) * 0.02,
//         (Math.random() - 0.5) * 0.02,
//         (Math.random() - 0.5) * 0.02
//       );

//       const color = orangeColors[Math.floor(Math.random() * orangeColors.length)];
//       colors[i3] = color.r;
//       colors[i3 + 1] = color.g;
//       colors[i3 + 2] = color.b;
//     }

//     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

//     const particlesMaterial = new THREE.PointsMaterial({
//       size: 0.3,
//       vertexColors: true,
//       transparent: true,
//       opacity: 0.8,
//       blending: THREE.AdditiveBlending,
//     });

//     const particles = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particles);

//     // Create Glowing Orange Rings
//     const ringGeometry1 = new THREE.TorusGeometry(8, 0.1, 16, 100);
//     const ringGeometry2 = new THREE.TorusGeometry(12, 0.08, 16, 100);
//     const ringGeometry3 = new THREE.TorusGeometry(16, 0.06, 16, 100);

//     const ringMaterial = new THREE.MeshBasicMaterial({
//       color: 0xff6b35,
//       transparent: true,
//       opacity: 0.4,
//     });

//     const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial);
//     const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial.clone());
//     const ring3 = new THREE.Mesh(ringGeometry3, ringMaterial.clone());

//     ring1.rotation.x = Math.PI / 4;
//     ring2.rotation.y = Math.PI / 3;
//     ring3.rotation.z = Math.PI / 6;

//     scene.add(ring1, ring2, ring3);

//     // Create Floating Orange Spheres
//     const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
//     const spheres: THREE.Mesh[] = [];

//     for (let i = 0; i < 20; i++) {
//       const material = new THREE.MeshBasicMaterial({
//         color: orangeColors[Math.floor(Math.random() * orangeColors.length)],
//         transparent: true,
//         opacity: 0.6,
//       });
      
//       const sphere = new THREE.Mesh(sphereGeometry, material);
//       sphere.position.set(
//         (Math.random() - 0.5) * 40,
//         (Math.random() - 0.5) * 40,
//         (Math.random() - 0.5) * 20
//       );
      
//       spheres.push(sphere);
//       scene.add(sphere);
//     }

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//     scene.add(ambientLight);

//     const pointLight1 = new THREE.PointLight(0xff6b35, 1, 100);
//     pointLight1.position.set(10, 10, 10);
//     scene.add(pointLight1);

//     const pointLight2 = new THREE.PointLight(0xffa64d, 1, 100);
//     pointLight2.position.set(-10, -10, -10);
//     scene.add(pointLight2);

//     // Animation
//     let animationId: number;
//     let time = 0;

//     const animate = () => {
//       animationId = requestAnimationFrame(animate);
//       time += 0.01;

//       const positions = particlesGeometry.attributes.position.array as Float32Array;
      
//       for (let i = 0; i < particleCount; i++) {
//         const i3 = i * 3;
        
//         positions[i3] += velocities[i3];
//         positions[i3 + 1] += velocities[i3 + 1];
//         positions[i3 + 2] += velocities[i3 + 2];

//         if (Math.abs(positions[i3]) > 50) velocities[i3] *= -1;
//         if (Math.abs(positions[i3 + 1]) > 50) velocities[i3 + 1] *= -1;
//         if (Math.abs(positions[i3 + 2]) > 30) velocities[i3 + 2] *= -1;

//         positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.01;
//       }
      
//       particlesGeometry.attributes.position.needsUpdate = true;

//       particles.rotation.y += 0.0005;
//       particles.rotation.x += 0.0002;

//       ring1.rotation.z += 0.002;
//       ring2.rotation.x += 0.003;
//       ring3.rotation.y += 0.001;

//       spheres.forEach((sphere, i) => {
//         sphere.position.y += Math.sin(time + i) * 0.02;
//         sphere.rotation.x += 0.01;
//         sphere.rotation.y += 0.02;
        
//         const scale = 1 + Math.sin(time * 2 + i) * 0.2;
//         sphere.scale.set(scale, scale, scale);
//       });

//       pointLight1.position.x = Math.sin(time) * 15;
//       pointLight1.position.z = Math.cos(time) * 15;
      
//       pointLight2.position.x = Math.cos(time * 0.7) * 15;
//       pointLight2.position.z = Math.sin(time * 0.7) * 15;

//       camera.position.x = Math.sin(time * 0.2) * 2;
//       camera.position.y = Math.cos(time * 0.3) * 2;
//       camera.lookAt(0, 0, 0);

//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       cancelAnimationFrame(animationId);
//       window.removeEventListener("resize", handleResize);
//       renderer.dispose();
//       particlesGeometry.dispose();
//       particlesMaterial.dispose();
//     };
//   }, []);

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <div style={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       width: '100vw',
//       height: '100vh',
//       overflow: 'hidden',
//       backgroundColor: '#000000'
//     }}>
//       {/* Three.js Canvas Background */}
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           zIndex: 0
//         }}
//       />

//       {/* Scrollable Content Overlay */}
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         overflowY: 'auto',
//         overflowX: 'hidden',
//         zIndex: 1,
//         padding: '20px'
//       }}>
//         <div style={{
//           maxWidth: '1400px',
//           margin: '0 auto',
//           paddingBottom: '80px'
//         }}>
//           {/* Header */}
//           <header style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '40px',
//             padding: '16px 32px',
//             backdropFilter: 'blur(6px) saturate(100%)',
//             backgroundColor: 'rgba(10, 10, 10, 0.4)',
//             border: '1px solid rgba(255, 107, 53, 0.2)',
//             borderRadius: '16px',
//             boxShadow: '0 8px 32px rgba(255, 107, 53, 0.1)'
//           }}>
//             <div>
//               <h1 style={{
//                 fontSize: '28px',
//                 fontWeight: 'bold',
//                 background: 'linear-gradient(135deg, #ff6b35, #ffa64d)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 margin: 0
//               }}>
//                 DSA 3D Visualizer
//               </h1>
//               <p style={{ 
//                 color: 'rgba(255, 166, 77, 0.7)', 
//                 margin: '4px 0 0 0',
//                 fontSize: '13px'
//               }}>
//                 AI-Powered Algorithm Learning Platform
//               </p>
//             </div>
//             <button
//               onClick={handleLogout}
//               style={{
//                 padding: '10px 24px',
//                 background: 'linear-gradient(135deg, #ff6b35, #ff5722)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 fontWeight: '600',
//                 fontSize: '14px',
//                 transition: 'all 0.3s',
//                 boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'scale(1.05)';
//                 e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 107, 53, 0.5)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//                 e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
//               }}
//             >
//               Logout
//             </button>
//           </header>

//           {/* Welcome Section */}
//           <div style={{
//             backdropFilter: 'blur(6px) saturate(100%)',
//             backgroundColor: 'rgba(10, 10, 10, 0.3)',
//             border: '1px solid rgba(255, 107, 53, 0.15)',
//             borderRadius: '16px',
//             padding: '32px',
//             marginBottom: '32px',
//             boxShadow: '0 8px 32px rgba(255, 107, 53, 0.08)'
//           }}>
//             <h2 style={{
//               fontSize: '26px',
//               marginBottom: '12px',
//               background: 'linear-gradient(135deg, #ff8c42, #ffa64d)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               fontWeight: '700'
//             }}>
//               Welcome back! 👋
//             </h2>
//             <p style={{
//               color: 'rgba(255, 255, 255, 0.75)',
//               fontSize: '16px',
//               margin: 0,
//               lineHeight: '1.6'
//             }}>
//               Ready to master Data Structures & Algorithms through immersive 3D visualization?
//             </p>
//           </div>

//           {/* Coming Soon Section */}
//           <div style={{
//             backdropFilter: 'blur(6px) saturate(100%)',
//             backgroundColor: 'rgba(10, 10, 10, 0.35)',
//             border: '1px solid rgba(255, 140, 66, 0.2)',
//             borderRadius: '16px',
//             padding: '48px 32px',
//             textAlign: 'center',
//             boxShadow: '0 8px 32px rgba(255, 107, 53, 0.12)',
//             marginBottom: '32px'
//           }}>
//             <div style={{
//               fontSize: '56px',
//               marginBottom: '20px',
//               filter: 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.4))'
//             }}>
//               🚀
//             </div>
//             <h2 style={{
//               fontSize: '30px',
//               marginBottom: '16px',
//               background: 'linear-gradient(135deg, #ff6b35, #ffa64d, #ff8c42)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               fontWeight: '700'
//             }}>
//               Start Learning with 3D Visualizations!
//             </h2>
//             <p style={{
//               color: 'rgba(255, 255, 255, 0.7)',
//               fontSize: '16px',
//               maxWidth: '650px',
//               margin: '0 auto 24px',
//               lineHeight: '1.6'
//             }}>
//               Explore algorithm problems with stunning 3D visualizations. 
//               Watch algorithms execute step-by-step and truly understand how they work.
//             </p>

//             {/* View Problems Button */}
//             <button
//               onClick={() => navigate("/problems")}
//               style={{
//                 padding: '14px 32px',
//                 background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '12px',
//                 cursor: 'pointer',
//                 fontWeight: '700',
//                 fontSize: '16px',
//                 boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
//                 transition: 'all 0.3s',
//                 marginBottom: '36px'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'scale(1.05)';
//                 e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.6)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//                 e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
//               }}
//             >
//               View Problems →
//             </button>
            
//             {/* Feature Cards */}
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
//               gap: '16px',
//               marginTop: '32px'
//             }}>
//               {[
//                 { icon: '🎬', title: 'Step-by-Step', desc: 'Control playback like a video' },
//                 { icon: '🎮', title: 'Interactive 3D', desc: 'Rotate, zoom, and explore' },
//                 { icon: '🤖', title: 'AI Explanations', desc: 'Get help when you need it' },
//                 { icon: '📊', title: 'Track Progress', desc: 'Master algorithms your way' }
//               ].map((feature, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     padding: '24px 20px',
//                     backgroundColor: 'rgba(20, 20, 20, 0.25)',
//                     borderRadius: '12px',
//                     border: '1px solid rgba(255, 107, 53, 0.15)',
//                     backdropFilter: 'blur(10px) saturate(180%)',
//                     transition: 'all 0.3s ease',
//                     cursor: 'pointer'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'translateY(-8px)';
//                     e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.4)';
//                     e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.4)';
//                     e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 107, 53, 0.25)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.25)';
//                     e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.15)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}
//                 >
//                   <div style={{ 
//                     fontSize: '40px', 
//                     marginBottom: '12px',
//                     filter: 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.4))'
//                   }}>
//                     {feature.icon}
//                   </div>
//                   <h3 style={{ 
//                     color: '#ffa64d', 
//                     fontSize: '17px',
//                     marginBottom: '8px',
//                     fontWeight: '600'
//                   }}>
//                     {feature.title}
//                   </h3>
//                   <p style={{ 
//                     color: 'rgba(255, 255, 255, 0.6)',
//                     fontSize: '13px',
//                     margin: 0,
//                     lineHeight: '1.5'
//                   }}>
//                     {feature.desc}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Footer Info */}
//           <div style={{
//             textAlign: 'center',
//             padding: '24px 20px',
//             color: 'rgba(255, 166, 77, 0.5)',
//             fontSize: '13px',
//             lineHeight: '1.8'
//           }}>
//             <p style={{
//               background: 'linear-gradient(135deg, #ff6b35, #ffa64d)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               fontWeight: '600',
//               margin: '0 0 8px 0'
//             }}>
//               🚧 Phase 2 in Development - Building the Core Visualization Engine 🚧
//             </p>
//             <p style={{ margin: 0 }}>
//               Authentication ✅ | Database Schema ⏳ | 3D Engine ⏳ | Problem Library 🔜
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getToken } from "../services/authService";
import * as THREE from "three";

export default function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    camera.position.z = 30;

    // Create Orange Particle System
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];
    const colors = new Float32Array(particleCount * 3);

    // Orange color variations
    const orangeColors = [
      new THREE.Color(0xff6b35),
      new THREE.Color(0xff8c42),
      new THREE.Color(0xffa64d),
      new THREE.Color(0xff5722),
      new THREE.Color(0xffb347),
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      velocities.push(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );

      const color =
        orangeColors[Math.floor(Math.random() * orangeColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create Glowing Orange Rings
    const ringGeometry1 = new THREE.TorusGeometry(8, 0.1, 16, 100);
    const ringGeometry2 = new THREE.TorusGeometry(12, 0.08, 16, 100);
    const ringGeometry3 = new THREE.TorusGeometry(16, 0.06, 16, 100);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.4,
    });

    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial);
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial.clone());
    const ring3 = new THREE.Mesh(ringGeometry3, ringMaterial.clone());

    ring1.rotation.x = Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    ring3.rotation.z = Math.PI / 6;

    scene.add(ring1, ring2, ring3);

    // Create Floating Orange Spheres
    const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const spheres: THREE.Mesh[] = [];

    for (let i = 0; i < 20; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: orangeColors[Math.floor(Math.random() * orangeColors.length)],
        transparent: true,
        opacity: 0.6,
      });

      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20
      );

      spheres.push(sphere);
      scene.add(sphere);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6b35, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffa64d, 1, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Animation
    let animationId: number;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      const positions = particlesGeometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        if (Math.abs(positions[i3]) > 50) velocities[i3] *= -1;
        if (Math.abs(positions[i3 + 1]) > 50) velocities[i3 + 1] *= -1;
        if (Math.abs(positions[i3 + 2]) > 30) velocities[i3 + 2] *= -1;

        positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.01;
      }

      particlesGeometry.attributes.position.needsUpdate = true;

      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;

      ring1.rotation.z += 0.002;
      ring2.rotation.x += 0.003;
      ring3.rotation.y += 0.001;

      spheres.forEach((sphere, i) => {
        sphere.position.y += Math.sin(time + i) * 0.02;
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.02;

        const scale = 1 + Math.sin(time * 2 + i) * 0.2;
        sphere.scale.set(scale, scale, scale);
      });

      pointLight1.position.x = Math.sin(time) * 15;
      pointLight1.position.z = Math.cos(time) * 15;

      pointLight2.position.x = Math.cos(time * 0.7) * 15;
      pointLight2.position.z = Math.sin(time * 0.7) * 15;

      camera.position.x = Math.sin(time * 0.2) * 2;
      camera.position.y = Math.cos(time * 0.3) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000000",
      }}
    >
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Scrollable Content Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 1,
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            paddingBottom: "80px",
          }}
        >
          {/* Header */}
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
              padding: "16px 32px",
              backdropFilter: "blur(6px) saturate(100%)",
              backgroundColor: "rgba(10, 10, 10, 0.4)",
              border: "1px solid rgba(255, 107, 53, 0.2)",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(255, 107, 53, 0.1)",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #ff6b35, #ffa64d)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: 0,
                }}
              >
                DSA 3D Visualizer
              </h1>
              <p
                style={{
                  color: "rgba(255, 166, 77, 0.7)",
                  margin: "4px 0 0 0",
                  fontSize: "13px",
                }}
              >
                AI-Powered Algorithm Learning Platform
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 24px",
                background: "linear-gradient(135deg, #ff6b35, #ff5722)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s",
                boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 6px 25px rgba(255, 107, 53, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(255, 107, 53, 0.3)";
              }}
            >
              Logout
            </button>
          </header>

          {/* Welcome Section */}
          <div
            style={{
              backdropFilter: "blur(6px) saturate(100%)",
              backgroundColor: "rgba(10, 10, 10, 0.3)",
              border: "1px solid rgba(255, 107, 53, 0.15)",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "32px",
              boxShadow: "0 8px 32px rgba(255, 107, 53, 0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                marginBottom: "12px",
                background: "linear-gradient(135deg, #ff8c42, #ffa64d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700",
              }}
            >
              Welcome back! 👋
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.75)",
                fontSize: "16px",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Ready to master Data Structures & Algorithms through immersive 3D
              visualization?
            </p>
          </div>

          {/* Coming Soon Section */}
          <div
            style={{
              backdropFilter: "blur(6px) saturate(100%)",
              backgroundColor: "rgba(10, 10, 10, 0.35)",
              border: "1px solid rgba(255, 140, 66, 0.2)",
              borderRadius: "16px",
              padding: "48px 32px",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(255, 107, 53, 0.12)",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                fontSize: "56px",
                marginBottom: "20px",
                filter: "drop-shadow(0 0 20px rgba(255, 107, 53, 0.4))",
              }}
            >
              🚀
            </div>
            <h2
              style={{
                fontSize: "30px",
                marginBottom: "16px",
                background:
                  "linear-gradient(135deg, #ff6b35, #ffa64d, #ff8c42)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700",
              }}
            >
              Start Learning with 3D Visualizations!
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "16px",
                maxWidth: "650px",
                margin: "0 auto 24px",
                lineHeight: "1.6",
              }}
            >
              Explore algorithm problems with stunning 3D visualizations. Watch
              algorithms execute step-by-step and truly understand how they
              work.
            </p>

            {/* View Problems Button */}
            <button
              onClick={() => navigate("/problems")}
              style={{
                padding: "14px 32px",
                background: "linear-gradient(135deg, #ff6b35, #ff8c42)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "16px",
                boxShadow: "0 6px 20px rgba(255, 107, 53, 0.4)",
                transition: "all 0.3s",
                marginBottom: "36px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(255, 107, 53, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(255, 107, 53, 0.4)";
              }}
            >
              View Problems →
            </button>

            {/* Feature Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "16px",
                marginTop: "32px",
              }}
            >
              {[
                {
                  icon: "🎬",
                  title: "Step-by-Step",
                  desc: "Control playback like a video",
                },
                {
                  icon: "🎮",
                  title: "Interactive 3D",
                  desc: "Rotate, zoom, and explore",
                },
                {
                  icon: "🤖",
                  title: "AI Explanations",
                  desc: "Get help when you need it",
                },
                {
                  icon: "📊",
                  title: "Track Progress",
                  desc: "Master algorithms your way",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    padding: "24px 20px",
                    backgroundColor: "rgba(20, 20, 20, 0.25)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 107, 53, 0.15)",
                    backdropFilter: "blur(10px) saturate(180%)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(20, 20, 20, 0.4)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 140, 66, 0.4)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 30px rgba(255, 107, 53, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(20, 20, 20, 0.25)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 107, 53, 0.15)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      fontSize: "40px",
                      marginBottom: "12px",
                      filter: "drop-shadow(0 0 10px rgba(255, 107, 53, 0.4))",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      color: "#ffa64d",
                      fontSize: "17px",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "13px",
                      margin: 0,
                      lineHeight: "1.5",
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Path Section */}
          <div
            style={{
              backdropFilter: "blur(6px) saturate(100%)",
              backgroundColor: "rgba(10, 10, 10, 0.3)",
              border: "1px solid rgba(255, 107, 53, 0.15)",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "32px",
              boxShadow: "0 8px 32px rgba(255, 107, 53, 0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "16px",
                background: "linear-gradient(135deg, #ff8c42, #ffa64d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              🎯 Recommended Learning Path
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              Follow our structured path from beginner to advanced
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
              }}
            >
              {[
                { level: "Beginner", topics: "Arrays, Strings, Basic Loops" },
                {
                  level: "Intermediate",
                  topics: "Sorting, Searching, Recursion",
                },
                { level: "Advanced", topics: "Trees, Graphs, DP" },
                { level: "Expert", topics: "Advanced DP, Graph Theory" },
              ].map((path, i) => (
                <div
                  key={i}
                  style={{
                    padding: "20px",
                    backgroundColor: "rgba(20, 20, 20, 0.25)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 107, 53, 0.15)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(20, 20, 20, 0.4)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 140, 66, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(20, 20, 20, 0.25)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 107, 53, 0.15)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      marginBottom: "8px",
                      filter: "drop-shadow(0 0 8px rgba(255, 107, 53, 0.4))",
                    }}
                  >
                    {i === 0
                      ? "🌱"
                      : i === 1
                        ? "🌿"
                        : i === 2
                          ? "🌳"
                          : "🏆"}
                  </div>
                  <h3
                    style={{
                      color: "#ffa64d",
                      fontSize: "16px",
                      margin: "0 0 8px 0",
                      fontWeight: "600",
                    }}
                  >
                    {path.level}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "12px",
                      margin: 0,
                      lineHeight: "1.5",
                    }}
                  >
                    {path.topics}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div
            style={{
              backdropFilter: "blur(6px) saturate(100%)",
              backgroundColor: "rgba(10, 10, 10, 0.3)",
              border: "1px solid rgba(255, 107, 53, 0.15)",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "32px",
              boxShadow: "0 8px 32px rgba(255, 107, 53, 0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "20px",
                background: "linear-gradient(135deg, #ff8c42, #ffa64d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              ✨ Why Learn Here?
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {[
                {
                  title: "Visual Understanding",
                  desc: "See algorithms in action with real-time 3D animations",
                  icon: "👁️",
                },
                {
                  title: "Interactive Learning",
                  desc: "Control execution speed, pause, rewind, and explore freely",
                  icon: "🎛️",
                },
                {
                  title: "AI-Powered Help",
                  desc: "Get instant explanations and hints when you're stuck",
                  icon: "🤖",
                },
                {
                  title: "Structured Curriculum",
                  desc: "Follow proven paths from basics to advanced concepts",
                  icon: "📖",
                },
                {
                  title: "Practice Problems",
                  desc: "Apply knowledge with curated coding challenges",
                  icon: "💪",
                },
                {
                  title: "Track Your Progress",
                  desc: "Monitor your learning journey and celebrate milestones",
                  icon: "📈",
                },
              ].map((benefit, i) => (
                <div
                  key={i}
                  style={{
                    padding: "24px 20px",
                    backgroundColor: "rgba(20, 20, 20, 0.25)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 107, 53, 0.15)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(20, 20, 20, 0.4)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 140, 66, 0.4)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(255, 107, 53, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(20, 20, 20, 0.25)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 107, 53, 0.15)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      marginBottom: "12px",
                      filter: "drop-shadow(0 0 8px rgba(255, 107, 53, 0.4))",
                    }}
                  >
                    {benefit.icon}
                  </div>
                  <h3
                    style={{
                      color: "#ffa64d",
                      fontSize: "16px",
                      margin: "0 0 8px 0",
                      fontWeight: "600",
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "13px",
                      margin: 0,
                      lineHeight: "1.5",
                    }}
                  >
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer
            style={{
              backdropFilter: "blur(6px) saturate(100%)",
              backgroundColor: "rgba(10, 10, 10, 0.3)",
              border: "1px solid rgba(255, 107, 53, 0.15)",
              borderRadius: "16px",
              padding: "40px 32px",
              marginTop: "40px",
              boxShadow: "0 8px 32px rgba(255, 107, 53, 0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "32px",
                marginBottom: "32px",
              }}
            >
              {/* About Section */}
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #ff6b35, #ffa64d)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "12px",
                  }}
                >
                  DSA 3D Visualizer
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  Master algorithms through immersive 3D visualizations and
                  AI-powered learning. Transform complex concepts into visual
                  understanding.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#ffa64d",
                    marginBottom: "12px",
                  }}
                >
                  Quick Links
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {["Problems", "Learning Path", "Documentation", "Community"].map(
                    (link) => (
                      <a
                        key={link}
                        href="#"
                        style={{
                          color: "rgba(255, 255, 255, 0.6)",
                          fontSize: "14px",
                          textDecoration: "none",
                          transition: "color 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffa64d";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            "rgba(255, 255, 255, 0.6)";
                        }}
                      >
                        {link}
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#ffa64d",
                    marginBottom: "12px",
                  }}
                >
                  Resources
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {["Tutorials", "API Reference", "Blog", "FAQ"].map((link) => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "14px",
                        textDecoration: "none",
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ffa64d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                      }}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div
              style={{
                paddingTop: "24px",
                borderTop: "1px solid rgba(255, 107, 53, 0.15)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "13px",
                  margin: 0,
                }}
              >
                © 2025 DSA 3D Visualizer. All rights reserved.
              </p>
              <div style={{ display: "flex", gap: "20px" }}>
                {["Privacy", "Terms", "Contact"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "13px",
                      textDecoration: "none",
                      transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ffa64d";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                    }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}