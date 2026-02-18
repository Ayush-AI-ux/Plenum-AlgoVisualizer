// import { useEffect, useState, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getToken } from "../services/authService";
// import * as THREE from "three";
// import Scene3DRenderer from "../components/Scene3DRenderer";

// interface Frame {
//   frameNumber: number;
//   title: string;
//   explanation: string;
//   code?: string;
//   duration: number;
//   scene3D?: any; // 3D scene data
// }

// interface Problem {
//   problemId: string;
//   title: string;
//   algorithmTutorial: {
//     algorithmName: string;
//     frames: Frame[];
//   };
//   problemSolution: {
//     frames: Frame[];
//   };
// }

// type Phase = "tutorial" | "solution";

// export default function VisualizationPlayer() {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
  
//   const [problem, setProblem] = useState<Problem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   const [currentPhase, setCurrentPhase] = useState<Phase>("tutorial");
//   const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [showTransition, setShowTransition] = useState(false);

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//   }, [navigate]);

//   // Fetch problem data
//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`http://localhost:5000/api/problems/${id}`);
//         const data = await response.json();

//         if (data.success) {
//           setProblem(data.data);
//           console.log("Problem data loaded:", data.data); // Debug log
//         } else {
//           setError("Problem not found");
//         }
//       } catch (err) {
//         setError("Error loading problem");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) {
//       fetchProblem();
//     }
//   }, [id]);

//   // Three.js background animation
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

//     // Simple particle background
//     const particleCount = 800;
//     const particlesGeometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(particleCount * 3);
//     const colors = new Float32Array(particleCount * 3);

//     const color1 = new THREE.Color(0x3b82f6);
//     const color2 = new THREE.Color(0xa855f7);

//     for (let i = 0; i < particleCount; i++) {
//       const i3 = i * 3;
//       positions[i3] = (Math.random() - 0.5) * 80;
//       positions[i3 + 1] = (Math.random() - 0.5) * 80;
//       positions[i3 + 2] = (Math.random() - 0.5) * 40;

//       const color = Math.random() > 0.5 ? color1 : color2;
//       colors[i3] = color.r;
//       colors[i3 + 1] = color.g;
//       colors[i3 + 2] = color.b;
//     }

//     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

//     const particlesMaterial = new THREE.PointsMaterial({
//       size: 0.15,
//       vertexColors: true,
//       transparent: true,
//       opacity: 0.6,
//       blending: THREE.AdditiveBlending,
//     });

//     const particles = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particles);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     let animationId: number;

//     const animate = () => {
//       animationId = requestAnimationFrame(animate);
//       particles.rotation.y += 0.0002;
//       particles.rotation.x += 0.0001;
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
//     };
//   }, []);

//   // Auto-play functionality
//   useEffect(() => {
//     if (!isPlaying || !problem) return;

//     const frames = currentPhase === "tutorial" 
//       ? problem.algorithmTutorial.frames 
//       : problem.problemSolution.frames;

//     const currentFrame = frames[currentFrameIndex];
//     if (!currentFrame) return;

//     const timer = setTimeout(() => {
//       handleNext();
//     }, currentFrame.duration * 1000);

//     return () => clearTimeout(timer);
//   }, [isPlaying, currentFrameIndex, currentPhase, problem]);

//   const getCurrentFrames = () => {
//     if (!problem) return [];
//     return currentPhase === "tutorial"
//       ? problem.algorithmTutorial.frames
//       : problem.problemSolution.frames;
//   };

//   const getCurrentFrame = () => {
//     const frames = getCurrentFrames();
//     return frames[currentFrameIndex] || null;
//   };

//   const handlePlay = () => {
//     setIsPlaying(true);
//     setShowTransition(false);
//   };

//   const handlePause = () => {
//     setIsPlaying(false);
//   };

//   const handleNext = () => {
//     const frames = getCurrentFrames();
//     if (currentFrameIndex < frames.length - 1) {
//       setCurrentFrameIndex(currentFrameIndex + 1);
//       setShowTransition(false);
//     } else if (currentPhase === "tutorial") {
//       setCurrentPhase("solution");
//       setCurrentFrameIndex(0);
//       setIsPlaying(false);
//       setShowTransition(true);
      
//       setTimeout(() => {
//         setShowTransition(false);
//       }, 2000);
//     } else {
//       setIsPlaying(false);
//     }
//   };

//   const handlePrevious = () => {
//     setShowTransition(false);
//     if (currentFrameIndex > 0) {
//       setCurrentFrameIndex(currentFrameIndex - 1);
//       setIsPlaying(false);
//     } else if (currentPhase === "solution") {
//       setCurrentPhase("tutorial");
//       const tutorialFrames = problem?.algorithmTutorial.frames || [];
//       setCurrentFrameIndex(tutorialFrames.length - 1);
//       setIsPlaying(false);
//     }
//   };

//   const handleReset = () => {
//     setCurrentPhase("tutorial");
//     setCurrentFrameIndex(0);
//     setIsPlaying(false);
//   };

//   if (isLoading) {
//     return (
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#000000',
//         color: 'white'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
//           <p>Loading visualization...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !problem) {
//     return (
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#000000'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
//           <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
//           <button
//             onClick={() => navigate("/problems")}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#3b82f6',
//               border: 'none',
//               borderRadius: '8px',
//               color: 'white',
//               cursor: 'pointer'
//             }}
//           >
//             ← Back to Problems
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentFrame = getCurrentFrame();
//   const frames = getCurrentFrames();
  
//   const totalFrames = (problem?.algorithmTutorial.frames.length || 0) + 
//                       (problem?.problemSolution.frames.length || 0);
//   const completedFrames = currentPhase === "tutorial" 
//     ? currentFrameIndex + 1
//     : (problem?.algorithmTutorial.frames.length || 0) + currentFrameIndex + 1;
//   const overallProgress = (completedFrames / totalFrames) * 100;

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
//       {/* Background Canvas */}
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

//       {/* Main Content */}
//       <div style={{
//         position: 'relative',
//         zIndex: 1,
//         width: '100%',
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         overflow: 'hidden'
//       }}>
//         {/* Header */}
//         <div style={{
//           flexShrink: 0,
//           padding: '16px 24px',
//           backdropFilter: 'blur(16px) saturate(180%)',
//           backgroundColor: 'rgba(10, 10, 10, 0.6)',
//           borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <button
//               onClick={() => navigate(`/problems/${id}`)}
//               style={{
//                 padding: '8px 16px',
//                 backgroundColor: 'rgba(59, 130, 246, 0.2)',
//                 border: '1px solid rgba(59, 130, 246, 0.3)',
//                 borderRadius: '6px',
//                 color: '#60a5fa',
//                 fontSize: '13px',
//                 cursor: 'pointer',
//                 fontWeight: '500'
//               }}
//             >
//               ← Exit
//             </button>
//             <div>
//               <h1 style={{
//                 fontSize: '20px',
//                 fontWeight: '600',
//                 color: 'white',
//                 margin: 0
//               }}>
//                 {problem.title}
//               </h1>
//               <p style={{
//                 fontSize: '13px',
//                 color: 'rgba(96, 165, 250, 0.8)',
//                 margin: '4px 0 0 0'
//               }}>
//                 {currentPhase === "tutorial" 
//                   ? `Tutorial: ${problem.algorithmTutorial.algorithmName}`
//                   : "Solution Walkthrough"
//                 }
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={handleReset}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: 'rgba(168, 85, 247, 0.2)',
//               border: '1px solid rgba(168, 85, 247, 0.3)',
//               borderRadius: '6px',
//               color: '#a855f7',
//               fontSize: '13px',
//               cursor: 'pointer',
//               fontWeight: '500'
//             }}
//           >
//             🔄 Restart
//           </button>
//         </div>

//         {/* Main Visualization Area */}
//         <div style={{
//           flex: 1,
//           display: 'flex',
//           padding: '20px',
//           gap: '20px',
//           minHeight: 0,
//           overflow: 'hidden'
//         }}>
//           {/* Transition Message */}
//           {showTransition && (
//             <div 
//               onClick={() => setShowTransition(false)}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 zIndex: 10,
//                 backdropFilter: 'blur(20px) saturate(180%)',
//                 backgroundColor: 'rgba(34, 197, 94, 0.2)',
//                 border: '2px solid rgba(34, 197, 94, 0.5)',
//                 borderRadius: '16px',
//                 padding: '24px 48px',
//                 textAlign: 'center',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
//                 e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
//                 e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
//               }}
//             >
//               <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
//               <h3 style={{
//                 fontSize: '20px',
//                 fontWeight: '600',
//                 color: '#22c55e',
//                 marginBottom: '8px'
//               }}>
//                 Tutorial Complete!
//               </h3>
//               <p style={{
//                 fontSize: '14px',
//                 color: 'rgba(255, 255, 255, 0.7)',
//                 marginBottom: '8px'
//               }}>
//                 Ready to see the solution?
//               </p>
//               <p style={{
//                 fontSize: '12px',
//                 color: 'rgba(255, 255, 255, 0.5)',
//                 margin: 0
//               }}>
//                 Click here or press Play to continue
//               </p>
//             </div>
//           )}

//           {/* 3D Visualization Area */}
//           <div style={{
//             flex: 2,
//             minWidth: 0,
//             position: 'relative'
//           }}>
//             {currentFrame && currentFrame.scene3D ? (
//               <div style={{
//                 width: '100%',
//                 height: '100%',
//                 backgroundColor: 'rgba(0, 0, 0, 0.3)',
//                 borderRadius: '16px',
//                 border: '2px solid rgba(59, 130, 246, 0.3)',
//                 overflow: 'hidden',
//                 backdropFilter: 'blur(10px)'
//               }}>
//                 <Scene3DRenderer sceneData={currentFrame.scene3D} />
//               </div>
//             ) : (
//               <div style={{
//                 width: '100%',
//                 height: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 backdropFilter: 'blur(20px) saturate(180%)',
//                 backgroundColor: 'rgba(10, 10, 10, 0.5)',
//                 border: '2px solid rgba(59, 130, 246, 0.3)',
//                 borderRadius: '16px',
//               }}>
//                 <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
//                   No 3D scene data available for this frame
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Explanation Panel */}
//           <div style={{
//             flex: 1,
//             minWidth: '300px',
//             maxWidth: '400px',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '16px',
//             overflowY: 'auto'
//           }}>
//             {/* Frame Info */}
//             <div style={{
//               backdropFilter: 'blur(20px) saturate(180%)',
//               backgroundColor: 'rgba(10, 10, 10, 0.6)',
//               border: '2px solid rgba(59, 130, 246, 0.3)',
//               borderRadius: '12px',
//               padding: '20px',
//             }}>
//               <h2 style={{
//                 fontSize: '22px',
//                 fontWeight: '700',
//                 color: '#60a5fa',
//                 marginBottom: '12px'
//               }}>
//                 {currentFrame?.title}
//               </h2>
//               <p style={{
//                 fontSize: '15px',
//                 color: 'rgba(255, 255, 255, 0.8)',
//                 lineHeight: '1.7',
//                 marginBottom: '16px'
//               }}>
//                 {currentFrame?.explanation}
//               </p>
              
//               <div style={{
//                 fontSize: '13px',
//                 color: 'rgba(96, 165, 250, 0.6)'
//               }}>
//                 Frame {currentFrameIndex + 1} of {frames.length}
//                 {currentPhase === "tutorial" && " (Tutorial)"}
//                 {currentPhase === "solution" && " (Solution)"}
//               </div>
//             </div>

//             {/* Code Panel */}
//             {currentFrame?.code && (
//               <div style={{
//                 backdropFilter: 'blur(20px) saturate(180%)',
//                 backgroundColor: 'rgba(10, 10, 10, 0.6)',
//                 border: '2px solid rgba(34, 197, 94, 0.3)',
//                 borderRadius: '12px',
//                 padding: '16px',
//               }}>
//                 <div style={{
//                   fontSize: '12px',
//                   color: '#22c55e',
//                   marginBottom: '8px',
//                   fontWeight: '600'
//                 }}>
//                   CODE:
//                 </div>
//                 <pre style={{
//                   fontFamily: 'monospace',
//                   fontSize: '13px',
//                   color: '#22c55e',
//                   margin: 0,
//                   whiteSpace: 'pre-wrap',
//                   lineHeight: '1.5'
//                 }}>
//                   {currentFrame.code}
//                 </pre>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Bottom Controls */}
//         <div style={{
//           flexShrink: 0,
//           backdropFilter: 'blur(16px) saturate(180%)',
//           backgroundColor: 'rgba(10, 10, 10, 0.6)',
//           borderTop: '1px solid rgba(59, 130, 246, 0.2)',
//           padding: '20px 40px'
//         }}>
//           {/* Progress Bar */}
//           <div style={{
//             width: '100%',
//             height: '6px',
//             backgroundColor: 'rgba(59, 130, 246, 0.2)',
//             borderRadius: '3px',
//             marginBottom: '20px',
//             overflow: 'hidden'
//           }}>
//             <div style={{
//               width: `${overallProgress}%`,
//               height: '100%',
//               background: 'linear-gradient(90deg, #3b82f6, #a855f7)',
//               borderRadius: '3px',
//               transition: 'width 0.3s ease'
//             }} />
//           </div>

//           {/* Control Buttons */}
//           <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '12px'
//           }}>
//             <button
//               onClick={handlePrevious}
//               disabled={currentFrameIndex === 0 && currentPhase === "tutorial"}
//               style={{
//                 padding: '12px 24px',
//                 backgroundColor: 'rgba(59, 130, 246, 0.2)',
//                 border: '1px solid rgba(59, 130, 246, 0.4)',
//                 borderRadius: '8px',
//                 color: '#60a5fa',
//                 fontSize: '16px',
//                 cursor: currentFrameIndex === 0 && currentPhase === "tutorial" ? 'not-allowed' : 'pointer',
//                 fontWeight: '600',
//                 opacity: currentFrameIndex === 0 && currentPhase === "tutorial" ? 0.5 : 1
//               }}
//             >
//               ◀ Previous
//             </button>

//             {!isPlaying ? (
//               <button
//                 onClick={handlePlay}
//                 style={{
//                   padding: '12px 32px',
//                   background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
//                   border: 'none',
//                   borderRadius: '8px',
//                   color: 'white',
//                   fontSize: '16px',
//                   cursor: 'pointer',
//                   fontWeight: '700',
//                   boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
//                 }}
//               >
//                 ▶ Play
//               </button>
//             ) : (
//               <button
//                 onClick={handlePause}
//                 style={{
//                   padding: '12px 32px',
//                   background: 'linear-gradient(135deg, #f59e0b, #d97706)',
//                   border: 'none',
//                   borderRadius: '8px',
//                   color: 'white',
//                   fontSize: '16px',
//                   cursor: 'pointer',
//                   fontWeight: '700',
//                   boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
//                 }}
//               >
//                 ⏸ Pause
//               </button>
//             )}

//             <button
//               onClick={handleNext}
//               disabled={currentFrameIndex === frames.length - 1 && currentPhase === "solution"}
//               style={{
//                 padding: '12px 24px',
//                 backgroundColor: 'rgba(59, 130, 246, 0.2)',
//                 border: '1px solid rgba(59, 130, 246, 0.4)',
//                 borderRadius: '8px',
//                 color: '#60a5fa',
//                 fontSize: '16px',
//                 cursor: currentFrameIndex === frames.length - 1 && currentPhase === "solution" ? 'not-allowed' : 'pointer',
//                 fontWeight: '600',
//                 opacity: currentFrameIndex === frames.length - 1 && currentPhase === "solution" ? 0.5 : 1
//               }}
//             >
//               Next ▶
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getToken } from "../services/authService";
// import * as THREE from "three";
// import Scene3DRenderer from "../components/Scene3DRenderer";

// interface Frame {
//   frameNumber: number;
//   title: string;
//   explanation: string;
//   code?: string;
//   duration: number;
//   scene3D?: any;
// }

// interface Problem {
//   problemId: string;
//   title: string;
//   algorithmTutorial: {
//     algorithmName: string;
//     frames: Frame[];
//   };
//   problemSolution: {
//     frames: Frame[];
//   };
// }

// type Phase = "tutorial" | "solution";

// export default function VisualizationPlayer() {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
  
//   const [problem, setProblem] = useState<Problem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   const [currentPhase, setCurrentPhase] = useState<Phase>("tutorial");
//   const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [showTransition, setShowTransition] = useState(false);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`http://localhost:5000/api/problems/${id}`);
//         const data = await response.json();

//         if (data.success) {
//           setProblem(data.data);
//         } else {
//           setError("Problem not found");
//         }
//       } catch (err) {
//         setError("Error loading problem");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) {
//       fetchProblem();
//     }
//   }, [id]);

//   // Enhanced background with animated gradient
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

//     // Enhanced particle system
//     const particleCount = 1200;
//     const particlesGeometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(particleCount * 3);
//     const colors = new Float32Array(particleCount * 3);
//     const sizes = new Float32Array(particleCount);

//     const color1 = new THREE.Color(0x3b82f6);
//     const color2 = new THREE.Color(0xa855f7);
//     const color3 = new THREE.Color(0xff6b35);

//     for (let i = 0; i < particleCount; i++) {
//       const i3 = i * 3;
//       positions[i3] = (Math.random() - 0.5) * 100;
//       positions[i3 + 1] = (Math.random() - 0.5) * 100;
//       positions[i3 + 2] = (Math.random() - 0.5) * 50;

//       const colorChoice = Math.random();
//       const color = colorChoice < 0.4 ? color1 : colorChoice < 0.7 ? color2 : color3;
//       colors[i3] = color.r;
//       colors[i3 + 1] = color.g;
//       colors[i3 + 2] = color.b;
      
//       sizes[i] = Math.random() * 0.3 + 0.1;
//     }

//     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//     particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

//     const particlesMaterial = new THREE.PointsMaterial({
//       size: 0.2,
//       vertexColors: true,
//       transparent: true,
//       opacity: 0.7,
//       blending: THREE.AdditiveBlending,
//       sizeAttenuation: true,
//     });

//     const particles = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particles);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     let animationId: number;
//     let time = 0;

//     const animate = () => {
//       animationId = requestAnimationFrame(animate);
//       time += 0.005;
      
//       particles.rotation.y += 0.0003;
//       particles.rotation.x = Math.sin(time * 0.3) * 0.1;
      
//       const positionsArray = particlesGeometry.attributes.position.array as Float32Array;
//       for (let i = 0; i < particleCount; i++) {
//         const i3 = i * 3;
//         positionsArray[i3 + 1] += Math.sin(time + i * 0.1) * 0.02;
//       }
//       particlesGeometry.attributes.position.needsUpdate = true;
      
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
//     };
//   }, []);

//   useEffect(() => {
//     if (!isPlaying || !problem) return;

//     const frames = currentPhase === "tutorial" 
//       ? problem.algorithmTutorial.frames 
//       : problem.problemSolution.frames;

//     const currentFrame = frames[currentFrameIndex];
//     if (!currentFrame) return;

//     const timer = setTimeout(() => {
//       handleNext();
//     }, (currentFrame.duration * 1000) / playbackSpeed);

//     return () => clearTimeout(timer);
//   }, [isPlaying, currentFrameIndex, currentPhase, problem, playbackSpeed]);

//   const getCurrentFrames = () => {
//     if (!problem) return [];
//     return currentPhase === "tutorial"
//       ? problem.algorithmTutorial.frames
//       : problem.problemSolution.frames;
//   };

//   const getCurrentFrame = () => {
//     const frames = getCurrentFrames();
//     return frames[currentFrameIndex] || null;
//   };

//   const handlePlay = () => {
//     setIsPlaying(true);
//     setShowTransition(false);
//   };

//   const handlePause = () => {
//     setIsPlaying(false);
//   };

//   const handleNext = () => {
//     const frames = getCurrentFrames();
//     if (currentFrameIndex < frames.length - 1) {
//       setCurrentFrameIndex(currentFrameIndex + 1);
//       setShowTransition(false);
//     } else if (currentPhase === "tutorial") {
//       setCurrentPhase("solution");
//       setCurrentFrameIndex(0);
//       setIsPlaying(false);
//       setShowTransition(true);
      
//       setTimeout(() => {
//         setShowTransition(false);
//       }, 2500);
//     } else {
//       setIsPlaying(false);
//     }
//   };

//   const handlePrevious = () => {
//     setShowTransition(false);
//     if (currentFrameIndex > 0) {
//       setCurrentFrameIndex(currentFrameIndex - 1);
//       setIsPlaying(false);
//     } else if (currentPhase === "solution") {
//       setCurrentPhase("tutorial");
//       const tutorialFrames = problem?.algorithmTutorial.frames || [];
//       setCurrentFrameIndex(tutorialFrames.length - 1);
//       setIsPlaying(false);
//     }
//   };

//   const handleReset = () => {
//     setCurrentPhase("tutorial");
//     setCurrentFrameIndex(0);
//     setIsPlaying(false);
//     setShowTransition(false);
//   };

//   const handleJumpToFrame = (index: number) => {
//     setCurrentFrameIndex(index);
//     setIsPlaying(false);
//     setShowTransition(false);
//   };

//   const handlePhaseSwitch = (phase: Phase) => {
//     setCurrentPhase(phase);
//     setCurrentFrameIndex(0);
//     setIsPlaying(false);
//     setShowTransition(false);
//   };

//   if (isLoading) {
//     return (
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
//         color: 'white'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ 
//             fontSize: '64px', 
//             marginBottom: '24px',
//             animation: 'pulse 2s ease-in-out infinite'
//           }}>⏳</div>
//           <p style={{ fontSize: '18px', color: '#60a5fa' }}>Loading visualization...</p>
//           <style>{`
//             @keyframes pulse {
//               0%, 100% { opacity: 1; transform: scale(1); }
//               50% { opacity: 0.7; transform: scale(1.1); }
//             }
//           `}</style>
//         </div>
//       </div>
//     );
//   }

//   if (error || !problem) {
//     return (
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
//           <p style={{ color: '#ef4444', marginBottom: '24px', fontSize: '18px' }}>{error}</p>
//           <button
//             onClick={() => navigate("/problems")}
//             style={{
//               padding: '14px 32px',
//               background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
//               border: 'none',
//               borderRadius: '12px',
//               color: 'white',
//               cursor: 'pointer',
//               fontSize: '16px',
//               fontWeight: '600',
//               boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
//             }}
//           >
//             ← Back to Problems
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentFrame = getCurrentFrame();
//   const frames = getCurrentFrames();
  
//   const totalFrames = (problem?.algorithmTutorial.frames.length || 0) + 
//                       (problem?.problemSolution.frames.length || 0);
//   const completedFrames = currentPhase === "tutorial" 
//     ? currentFrameIndex + 1
//     : (problem?.algorithmTutorial.frames.length || 0) + currentFrameIndex + 1;
//   const overallProgress = (completedFrames / totalFrames) * 100;

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
//       {/* Animated Background */}
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

//       {/* Main Content */}
//       <div style={{
//         position: 'relative',
//         zIndex: 1,
//         width: '100%',
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         overflow: 'hidden'
//       }}>
//         {/* Enhanced Header */}
//         <div style={{
//           flexShrink: 0,
//           padding: '20px 32px',
//           backdropFilter: 'blur(20px) saturate(180%)',
//           backgroundColor: 'rgba(15, 23, 42, 0.85)',
//           borderBottom: '2px solid rgba(59, 130, 246, 0.3)',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//             <button
//               onClick={() => navigate(`/problems/${id}`)}
//               style={{
//                 padding: '10px 20px',
//                 background: 'linear-gradient(135deg, #ef4444, #dc2626)',
//                 border: 'none',
//                 borderRadius: '10px',
//                 color: 'white',
//                 fontSize: '14px',
//                 cursor: 'pointer',
//                 fontWeight: '600',
//                 boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
//                 transition: 'transform 0.2s'
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//             >
//               ✕ Exit
//             </button>
//             <div>
//               <h1 style={{
//                 fontSize: '24px',
//                 fontWeight: '700',
//                 background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 margin: 0
//               }}>
//                 {problem.title}
//               </h1>
//               <p style={{
//                 fontSize: '14px',
//                 color: 'rgba(148, 163, 184, 0.9)',
//                 margin: '6px 0 0 0',
//                 fontWeight: '500'
//               }}>
//                 {currentPhase === "tutorial" 
//                   ? `📚 Algorithm: ${problem.algorithmTutorial.algorithmName}`
//                   : "💡 Solution Walkthrough"
//                 }
//               </p>
//             </div>
//           </div>
          
//           <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//             {/* Phase Selector */}
//             <div style={{
//               display: 'flex',
//               gap: '8px',
//               background: 'rgba(30, 41, 59, 0.8)',
//               padding: '6px',
//               borderRadius: '12px',
//               border: '1px solid rgba(59, 130, 246, 0.3)'
//             }}>
//               <button
//                 onClick={() => handlePhaseSwitch("tutorial")}
//                 style={{
//                   padding: '8px 16px',
//                   background: currentPhase === "tutorial" 
//                     ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
//                     : 'transparent',
//                   border: 'none',
//                   borderRadius: '8px',
//                   color: 'white',
//                   fontSize: '13px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   transition: 'all 0.3s'
//                 }}
//               >
//                 📚 Tutorial
//               </button>
//               <button
//                 onClick={() => handlePhaseSwitch("solution")}
//                 style={{
//                   padding: '8px 16px',
//                   background: currentPhase === "solution" 
//                     ? 'linear-gradient(135deg, #a855f7, #9333ea)' 
//                     : 'transparent',
//                   border: 'none',
//                   borderRadius: '8px',
//                   color: 'white',
//                   fontSize: '13px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   transition: 'all 0.3s'
//                 }}
//               >
//                 💡 Solution
//               </button>
//             </div>
            
//             <button
//               onClick={handleReset}
//               style={{
//                 padding: '10px 20px',
//                 background: 'linear-gradient(135deg, #a855f7, #9333ea)',
//                 border: 'none',
//                 borderRadius: '10px',
//                 color: 'white',
//                 fontSize: '14px',
//                 cursor: 'pointer',
//                 fontWeight: '600',
//                 boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
//                 transition: 'transform 0.2s'
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//             >
//               🔄 Restart
//             </button>
//           </div>
//         </div>

//         {/* Main Visualization Area */}
//         <div style={{
//           flex: 1,
//           display: 'flex',
//           padding: '24px',
//           gap: '24px',
//           minHeight: 0,
//           overflow: 'hidden'
//         }}>
//           {/* Transition Overlay */}
//           {showTransition && (
//             <div 
//               onClick={() => setShowTransition(false)}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 zIndex: 100,
//                 backdropFilter: 'blur(24px) saturate(180%)',
//                 background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95))',
//                 border: '3px solid rgba(34, 197, 94, 0.6)',
//                 borderRadius: '24px',
//                 padding: '48px 64px',
//                 textAlign: 'center',
//                 cursor: 'pointer',
//                 transition: 'all 0.4s ease',
//                 boxShadow: '0 20px 60px rgba(34, 197, 94, 0.5)',
//                 animation: 'slideIn 0.5s ease-out'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
//                 e.currentTarget.style.boxShadow = '0 24px 80px rgba(34, 197, 94, 0.6)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
//                 e.currentTarget.style.boxShadow = '0 20px 60px rgba(34, 197, 94, 0.5)';
//               }}
//             >
//               <div style={{ fontSize: '72px', marginBottom: '20px', animation: 'bounce 1s ease-in-out infinite' }}>✨</div>
//               <h3 style={{
//                 fontSize: '28px',
//                 fontWeight: '800',
//                 color: 'white',
//                 marginBottom: '12px',
//                 textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
//               }}>
//                 Tutorial Complete!
//               </h3>
//               <p style={{
//                 fontSize: '16px',
//                 color: 'rgba(255, 255, 255, 0.95)',
//                 marginBottom: '12px',
//                 fontWeight: '500'
//               }}>
//                 🎉 Great job! Ready for the solution?
//               </p>
//               <p style={{
//                 fontSize: '13px',
//                 color: 'rgba(255, 255, 255, 0.8)',
//                 margin: 0,
//                 fontWeight: '500'
//               }}>
//                 Click here or press Play to continue →
//               </p>
              
//               <style>{`
//                 @keyframes slideIn {
//                   from {
//                     opacity: 0;
//                     transform: translate(-50%, -60%);
//                   }
//                   to {
//                     opacity: 1;
//                     transform: translate(-50%, -50%);
//                   }
//                 }
//                 @keyframes bounce {
//                   0%, 100% { transform: translateY(0); }
//                   50% { transform: translateY(-10px); }
//                 }
//               `}</style>
//             </div>
//           )}

//           {/* 3D Visualization Container */}
//           <div style={{
//             flex: 2,
//             minWidth: 0,
//             position: 'relative'
//           }}>
//             {currentFrame && currentFrame.scene3D ? (
//               <div style={{
//                 width: '100%',
//                 height: '100%',
//                 background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))',
//                 borderRadius: '20px',
//                 border: '3px solid rgba(59, 130, 246, 0.4)',
//                 overflow: 'hidden',
//                 backdropFilter: 'blur(16px)',
//                 boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 0 60px rgba(59, 130, 246, 0.1)'
//               }}>
//                 <Scene3DRenderer sceneData={currentFrame.scene3D} />
//               </div>
//             ) : (
//               <div style={{
//                 width: '100%',
//                 height: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 backdropFilter: 'blur(24px) saturate(180%)',
//                 background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
//                 border: '3px solid rgba(239, 68, 68, 0.4)',
//                 borderRadius: '20px',
//                 boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)'
//               }}>
//                 <div style={{ textAlign: 'center' }}>
//                   <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
//                   <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>
//                     No 3D scene data for this frame
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Enhanced Explanation Panel */}
//           <div style={{
//             flex: 1,
//             minWidth: '360px',
//             maxWidth: '460px',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '20px',
//             overflowY: 'auto',
//             paddingRight: '8px'
//           }}>
//             {/* Frame Information Card */}
//             <div style={{
//               backdropFilter: 'blur(24px) saturate(180%)',
//               background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
//               border: '2px solid rgba(59, 130, 246, 0.4)',
//               borderRadius: '16px',
//               padding: '28px',
//               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
//             }}>
//               <div style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: '16px'
//               }}>
//                 <div style={{
//                   fontSize: '12px',
//                   fontWeight: '700',
//                   color: '#60a5fa',
//                   textTransform: 'uppercase',
//                   letterSpacing: '1px'
//                 }}>
//                   Frame {currentFrameIndex + 1} / {frames.length}
//                 </div>
//                 <div style={{
//                   padding: '6px 14px',
//                   background: currentPhase === "tutorial" 
//                     ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
//                     : 'linear-gradient(135deg, #a855f7, #9333ea)',
//                   borderRadius: '8px',
//                   fontSize: '11px',
//                   fontWeight: '700',
//                   color: 'white',
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.5px'
//                 }}>
//                   {currentPhase === "tutorial" ? "📚 Tutorial" : "💡 Solution"}
//                 </div>
//               </div>
              
//               <h2 style={{
//                 fontSize: '26px',
//                 fontWeight: '800',
//                 background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 marginBottom: '16px',
//                 lineHeight: '1.3'
//               }}>
//                 {currentFrame?.title}
//               </h2>
              
//               <p style={{
//                 fontSize: '16px',
//                 color: 'rgba(226, 232, 240, 0.95)',
//                 lineHeight: '1.8',
//                 marginBottom: 0,
//                 fontWeight: '400'
//               }}>
//                 {currentFrame?.explanation}
//               </p>
//             </div>

//             {/* Code Panel */}
//             {currentFrame?.code && (
//               <div style={{
//                 backdropFilter: 'blur(24px) saturate(180%)',
//                 background: 'linear-gradient(135deg, rgba(20, 30, 48, 0.95), rgba(15, 23, 42, 0.95))',
//                 border: '2px solid rgba(34, 197, 94, 0.4)',
//                 borderRadius: '16px',
//                 padding: '20px',
//                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
//               }}>
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   marginBottom: '12px'
//                 }}>
//                   <div style={{
//                     fontSize: '13px',
//                     fontWeight: '800',
//                     color: '#22c55e',
//                     textTransform: 'uppercase',
//                     letterSpacing: '1px'
//                   }}>
//                     💻 Code
//                   </div>
//                   <div style={{
//                     flex: 1,
//                     height: '2px',
//                     background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.5), transparent)'
//                   }}></div>
//                 </div>
//                 <pre style={{
//                   fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
//                   fontSize: '14px',
//                   color: '#4ade80',
//                   margin: 0,
//                   whiteSpace: 'pre-wrap',
//                   lineHeight: '1.7',
//                   background: 'rgba(0, 0, 0, 0.3)',
//                   padding: '16px',
//                   borderRadius: '10px',
//                   border: '1px solid rgba(34, 197, 94, 0.2)'
//                 }}>
//                   {currentFrame.code}
//                 </pre>
//               </div>
//             )}

//             {/* Frame Timeline */}
//             <div style={{
//               backdropFilter: 'blur(24px) saturate(180%)',
//               background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
//               border: '2px solid rgba(168, 85, 247, 0.4)',
//               borderRadius: '16px',
//               padding: '20px',
//               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
//             }}>
//               <div style={{
//                 fontSize: '13px',
//                 fontWeight: '800',
//                 color: '#a855f7',
//                 textTransform: 'uppercase',
//                 letterSpacing: '1px',
//                 marginBottom: '16px'
//               }}>
//                 ⏱️ Timeline
//               </div>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                 {frames.map((frame, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleJumpToFrame(index)}
//                     style={{
//                       padding: '12px 16px',
//                       background: index === currentFrameIndex 
//                         ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(147, 51, 234, 0.3))' 
//                         : 'rgba(30, 41, 59, 0.5)',
//                       border: index === currentFrameIndex 
//                         ? '2px solid rgba(168, 85, 247, 0.6)' 
//                         : '1px solid rgba(100, 116, 139, 0.3)',
//                       borderRadius: '10px',
//                       cursor: 'pointer',
//                       transition: 'all 0.2s',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '12px'
//                     }}
//                     onMouseEnter={(e) => {
//                       if (index !== currentFrameIndex) {
//                         e.currentTarget.style.background = 'rgba(51, 65, 85, 0.6)';
//                         e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (index !== currentFrameIndex) {
//                         e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
//                         e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.3)';
//                       }
//                     }}
//                   >
//                     <div style={{
//                       fontSize: '11px',
//                       fontWeight: '700',
//                       color: index === currentFrameIndex ? '#a855f7' : '#64748b',
//                       minWidth: '28px'
//                     }}>
//                       #{index + 1}
//                     </div>
//                     <div style={{
//                       fontSize: '13px',
//                       color: index === currentFrameIndex ? '#e2e8f0' : '#94a3b8',
//                       fontWeight: index === currentFrameIndex ? '600' : '500',
//                       flex: 1,
//                       overflow: 'hidden',
//                       textOverflow: 'ellipsis',
//                       whiteSpace: 'nowrap'
//                     }}>
//                       {frame.title}
//                     </div>
//                     {index === currentFrameIndex && (
//                       <div style={{
//                         width: '8px',
//                         height: '8px',
//                         borderRadius: '50%',
//                         background: '#a855f7',
//                         animation: 'pulse 2s ease-in-out infinite',
//                         boxShadow: '0 0 12px rgba(168, 85, 247, 0.8)'
//                       }}></div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Bottom Controls */}
//         <div style={{
//           flexShrink: 0,
//           backdropFilter: 'blur(24px) saturate(180%)',
//           background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.98))',
//           borderTop: '2px solid rgba(59, 130, 246, 0.3)',
//           padding: '24px 40px',
//           boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.3)'
//         }}>
//           {/* Progress Bar */}
//           <div style={{
//             width: '100%',
//             height: '8px',
//             background: 'rgba(30, 41, 59, 0.8)',
//             borderRadius: '8px',
//             marginBottom: '24px',
//             overflow: 'hidden',
//             border: '1px solid rgba(59, 130, 246, 0.3)',
//             position: 'relative'
//           }}>
//             <div style={{
//               width: `${overallProgress}%`,
//               height: '100%',
//               background: 'linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)',
//               borderRadius: '8px',
//               transition: 'width 0.3s ease',
//               boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)'
//             }} />
//             <div style={{
//               position: 'absolute',
//               right: '12px',
//               top: '50%',
//               transform: 'translateY(-50%)',
//               fontSize: '11px',
//               fontWeight: '700',
//               color: '#60a5fa'
//             }}>
//               {Math.round(overallProgress)}%
//             </div>
//           </div>

//           {/* Control Buttons */}
//           <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             gap: '16px'
//           }}>
//             {/* Left Controls */}
//             <div style={{ display: 'flex', gap: '12px' }}>
//               <button
//                 onClick={handlePrevious}
//                 disabled={currentFrameIndex === 0 && currentPhase === "tutorial"}
//                 style={{
//                   padding: '14px 28px',
//                   background: currentFrameIndex === 0 && currentPhase === "tutorial"
//                     ? 'rgba(51, 65, 85, 0.5)'
//                     : 'linear-gradient(135deg, #3b82f6, #2563eb)',
//                   border: 'none',
//                   borderRadius: '12px',
//                   color: 'white',
//                   fontSize: '16px',
//                   cursor: currentFrameIndex === 0 && currentPhase === "tutorial" ? 'not-allowed' : 'pointer',
//                   fontWeight: '700',
//                   boxShadow: currentFrameIndex === 0 && currentPhase === "tutorial"
//                     ? 'none'
//                     : '0 4px 16px rgba(59, 130, 246, 0.4)',
//                   transition: 'all 0.2s',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px'
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!(currentFrameIndex === 0 && currentPhase === "tutorial")) {
//                     e.currentTarget.style.transform = 'translateY(-2px)';
//                     e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!(currentFrameIndex === 0 && currentPhase === "tutorial")) {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
//                   }
//                 }}
//               >
//                 ◀ Previous
//               </button>
//             </div>

//             {/* Center Play Controls */}
//             <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//               {!isPlaying ? (
//                 <button
//                   onClick={handlePlay}
//                   style={{
//                     padding: '16px 48px',
//                     background: 'linear-gradient(135deg, #22c55e, #16a34a)',
//                     border: 'none',
//                     borderRadius: '14px',
//                     color: 'white',
//                     fontSize: '18px',
//                     cursor: 'pointer',
//                     fontWeight: '800',
//                     boxShadow: '0 6px 24px rgba(34, 197, 94, 0.5)',
//                     transition: 'all 0.2s',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '10px'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'scale(1.05)';
//                     e.currentTarget.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.6)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'scale(1)';
//                     e.currentTarget.style.boxShadow = '0 6px 24px rgba(34, 197, 94, 0.5)';
//                   }}
//                 >
//                   ▶ Play
//                 </button>
//               ) : (
//                 <button
//                   onClick={handlePause}
//                   style={{
//                     padding: '16px 48px',
//                     background: 'linear-gradient(135deg, #f59e0b, #d97706)',
//                     border: 'none',
//                     borderRadius: '14px',
//                     color: 'white',
//                     fontSize: '18px',
//                     cursor: 'pointer',
//                     fontWeight: '800',
//                     boxShadow: '0 6px 24px rgba(245, 158, 11, 0.5)',
//                     transition: 'all 0.2s',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '10px'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'scale(1.05)';
//                     e.currentTarget.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.6)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'scale(1)';
//                     e.currentTarget.style.boxShadow = '0 6px 24px rgba(245, 158, 11, 0.5)';
//                   }}
//                 >
//                   ⏸ Pause
//                 </button>
//               )}
              
//               {/* Speed Control */}
//               <select
//                 value={playbackSpeed}
//                 onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
//                 style={{
//                   padding: '10px 16px',
//                   background: 'rgba(30, 41, 59, 0.9)',
//                   border: '2px solid rgba(168, 85, 247, 0.4)',
//                   borderRadius: '10px',
//                   color: '#a855f7',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   cursor: 'pointer',
//                   outline: 'none'
//                 }}
//               >
//                 <option value={0.5}>0.5x</option>
//                 <option value={1}>1x</option>
//                 <option value={1.5}>1.5x</option>
//                 <option value={2}>2x</option>
//               </select>
//             </div>

//             {/* Right Controls */}
//             <div style={{ display: 'flex', gap: '12px' }}>
//               <button
//                 onClick={handleNext}
//                 disabled={currentFrameIndex === frames.length - 1 && currentPhase === "solution"}
//                 style={{
//                   padding: '14px 28px',
//                   background: currentFrameIndex === frames.length - 1 && currentPhase === "solution"
//                     ? 'rgba(51, 65, 85, 0.5)'
//                     : 'linear-gradient(135deg, #3b82f6, #2563eb)',
//                   border: 'none',
//                   borderRadius: '12px',
//                   color: 'white',
//                   fontSize: '16px',
//                   cursor: currentFrameIndex === frames.length - 1 && currentPhase === "solution" ? 'not-allowed' : 'pointer',
//                   fontWeight: '700',
//                   boxShadow: currentFrameIndex === frames.length - 1 && currentPhase === "solution"
//                     ? 'none'
//                     : '0 4px 16px rgba(59, 130, 246, 0.4)',
//                   transition: 'all 0.2s',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px'
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!(currentFrameIndex === frames.length - 1 && currentPhase === "solution")) {
//                     e.currentTarget.style.transform = 'translateY(-2px)';
//                     e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!(currentFrameIndex === frames.length - 1 && currentPhase === "solution")) {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
//                   }
//                 }}
//               >
//                 Next ▶
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../services/authService";
import * as THREE from "three";
import Scene3DRenderer from "../components/Scene3DRenderer";

interface Frame {
  frameNumber: number;
  title: string;
  explanation: string;
  code?: string;
  duration: number;
  scene3D?: any;
}

interface Problem {
  problemId: string;
  title: string;
  algorithmTutorial: {
    algorithmName: string;
    frames: Frame[];
  };
  problemSolution: {
    frames: Frame[];
  };
}

type Phase = "tutorial" | "solution";

export default function VisualizationPlayer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [currentPhase, setCurrentPhase] = useState<Phase>("tutorial");
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [playbackSpeed] = useState(1);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/problems/${id}`);
        const data = await response.json();

        if (data.success) {
          setProblem(data.data);
        } else {
          setError("Problem not found");
        }
      } catch (err) {
        setError("Error loading problem");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  // Enhanced background with animated gradient
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

    // Enhanced particle system
    const particleCount = 1200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color1 = new THREE.Color(0x3b82f6);
    const color2 = new THREE.Color(0xa855f7);
    const color3 = new THREE.Color(0xff6b35);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      const colorChoice = Math.random();
      const color = colorChoice < 0.4 ? color1 : colorChoice < 0.7 ? color2 : color3;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.3 + 0.1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let animationId: number;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.005;
      
      particles.rotation.y += 0.0003;
      particles.rotation.x = Math.sin(time * 0.3) * 0.1;
      
      const positionsArray = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positionsArray[i3 + 1] += Math.sin(time + i * 0.1) * 0.02;
      }
      particlesGeometry.attributes.position.needsUpdate = true;
      
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
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !problem) return;

    const frames = currentPhase === "tutorial" 
      ? problem.algorithmTutorial.frames 
      : problem.problemSolution.frames;

    const currentFrame = frames[currentFrameIndex];
    if (!currentFrame) return;

    const timer = setTimeout(() => {
      handleNext();
    }, (currentFrame.duration * 1000) / playbackSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIndex, currentPhase, problem, playbackSpeed]);

  const getCurrentFrames = () => {
    if (!problem) return [];
    return currentPhase === "tutorial"
      ? problem.algorithmTutorial.frames
      : problem.problemSolution.frames;
  };

  const getCurrentFrame = () => {
    const frames = getCurrentFrames();
    return frames[currentFrameIndex] || null;
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setShowTransition(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    const frames = getCurrentFrames();
    if (currentFrameIndex < frames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
      setShowTransition(false);
    } else if (currentPhase === "tutorial") {
      setCurrentPhase("solution");
      setCurrentFrameIndex(0);
      setIsPlaying(false);
      setShowTransition(true);
      
      setTimeout(() => {
        setShowTransition(false);
      }, 2500);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    setShowTransition(false);
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1);
      setIsPlaying(false);
    } else if (currentPhase === "solution") {
      setCurrentPhase("tutorial");
      const tutorialFrames = problem?.algorithmTutorial.frames || [];
      setCurrentFrameIndex(tutorialFrames.length - 1);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setCurrentPhase("tutorial");
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    setShowTransition(false);
  };

  const handleJumpToFrame = (index: number) => {
    setCurrentFrameIndex(index);
    setIsPlaying(false);
    setShowTransition(false);
  };

  const handlePhaseSwitch = (phase: Phase) => {
    setCurrentPhase(phase);
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    setShowTransition(false);
  };

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '24px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>⏳</div>
          <p style={{ fontSize: '18px', color: '#60a5fa' }}>Loading visualization...</p>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.7; transform: scale(1.1); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: '#ef4444', marginBottom: '24px', fontSize: '18px' }}>{error}</p>
          <button
            onClick={() => navigate("/problems")}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
            }}
          >
            ← Back to Problems
          </button>
        </div>
      </div>
    );
  }

  const currentFrame = getCurrentFrame();
  const frames = getCurrentFrames();
  
  const totalFrames = (problem?.algorithmTutorial.frames.length || 0) + 
                      (problem?.problemSolution.frames.length || 0);
  const completedFrames = currentPhase === "tutorial" 
    ? currentFrameIndex + 1
    : (problem?.algorithmTutorial.frames.length || 0) + currentFrameIndex + 1;
  const overallProgress = (completedFrames / totalFrames) * 100;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#000000'
    }}>
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Enhanced Header */}
        <div style={{
          flexShrink: 0,
          padding: '20px 32px',
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          borderBottom: '2px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => navigate(`/problems/${id}`)}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ✕ Exit
            </button>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                {problem.title}
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'rgba(148, 163, 184, 0.9)',
                margin: '6px 0 0 0',
                fontWeight: '500'
              }}>
                {currentPhase === "tutorial" 
                  ? `📚 Algorithm: ${problem.algorithmTutorial.algorithmName}`
                  : "💡 Solution Walkthrough"
                }
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Phase Selector */}
            <div style={{
              display: 'flex',
              gap: '8px',
              background: 'rgba(30, 41, 59, 0.8)',
              padding: '6px',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <button
                onClick={() => handlePhaseSwitch("tutorial")}
                style={{
                  padding: '8px 16px',
                  background: currentPhase === "tutorial" 
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                    : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                📚 Tutorial
              </button>
              <button
                onClick={() => handlePhaseSwitch("solution")}
                style={{
                  padding: '8px 16px',
                  background: currentPhase === "solution" 
                    ? 'linear-gradient(135deg, #a855f7, #9333ea)' 
                    : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                💡 Solution
              </button>
            </div>
            
            <button
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🔄 Restart
            </button>
          </div>
        </div>

        {/* Main Visualization Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          padding: '24px',
          gap: '24px',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* Transition Overlay */}
          {showTransition && (
            <div 
              onClick={() => setShowTransition(false)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 100,
                backdropFilter: 'blur(24px) saturate(180%)',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95))',
                border: '3px solid rgba(34, 197, 94, 0.6)',
                borderRadius: '24px',
                padding: '48px 64px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                boxShadow: '0 20px 60px rgba(34, 197, 94, 0.5)',
                animation: 'slideIn 0.5s ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 24px 80px rgba(34, 197, 94, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(34, 197, 94, 0.5)';
              }}
            >
              <div style={{ fontSize: '72px', marginBottom: '20px', animation: 'bounce 1s ease-in-out infinite' }}>✨</div>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: 'white',
                marginBottom: '12px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                Tutorial Complete!
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.95)',
                marginBottom: '12px',
                fontWeight: '500'
              }}>
                🎉 Great job! Ready for the solution?
              </p>
              <p style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                fontWeight: '500'
              }}>
                Click here or press Play to continue →
              </p>
              
              <style>{`
                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                  }
                  to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                  }
                }
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-10px); }
                }
              `}</style>
            </div>
          )}

          {/* 3D Visualization Container */}
          <div style={{
            flex: 2,
            minWidth: 0,
            position: 'relative'
          }}>
            {currentFrame && currentFrame.scene3D ? (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6))',
                borderRadius: '20px',
                border: '3px solid rgba(59, 130, 246, 0.4)',
                overflow: 'hidden',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 0 60px rgba(59, 130, 246, 0.1)'
              }}>
                <Scene3DRenderer sceneData={currentFrame.scene3D} />
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(24px) saturate(180%)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                border: '3px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>
                    No 3D scene data for this frame
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Explanation Panel */}
          <div style={{
            flex: 1,
            minWidth: '360px',
            maxWidth: '460px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}>
            {/* Frame Information Card */}
            <div style={{
              backdropFilter: 'blur(24px) saturate(180%)',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
              border: '2px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#60a5fa',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Frame {currentFrameIndex + 1} / {frames.length}
                </div>
                <div style={{
                  padding: '6px 14px',
                  background: currentPhase === "tutorial" 
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                    : 'linear-gradient(135deg, #a855f7, #9333ea)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {currentPhase === "tutorial" ? "📚 Tutorial" : "💡 Solution"}
                </div>
              </div>
              
              <h2 style={{
                fontSize: '26px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '16px',
                lineHeight: '1.3'
              }}>
                {currentFrame?.title}
              </h2>
              
              <p style={{
                fontSize: '16px',
                color: 'rgba(226, 232, 240, 0.95)',
                lineHeight: '1.8',
                marginBottom: 0,
                fontWeight: '400'
              }}>
                {currentFrame?.explanation}
              </p>
            </div>

            {/* Code Panel */}
            {currentFrame?.code && (
              <div style={{
                backdropFilter: 'blur(24px) saturate(180%)',
                background: 'linear-gradient(135deg, rgba(20, 30, 48, 0.95), rgba(15, 23, 42, 0.95))',
                border: '2px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#22c55e',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    💻 Code
                  </div>
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.5), transparent)'
                  }}></div>
                </div>
                <pre style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                  fontSize: '14px',
                  color: '#4ade80',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.7',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  {currentFrame.code}
                </pre>
              </div>
            )}

            {/* Frame Timeline */}
            <div style={{
              backdropFilter: 'blur(24px) saturate(180%)',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
              border: '2px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '800',
                color: '#a855f7',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px'
              }}>
                ⏱️ Timeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {frames.map((frame, index) => (
                  <div
                    key={index}
                    onClick={() => handleJumpToFrame(index)}
                    style={{
                      padding: '12px 16px',
                      background: index === currentFrameIndex 
                        ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(147, 51, 234, 0.3))' 
                        : 'rgba(30, 41, 59, 0.5)',
                      border: index === currentFrameIndex 
                        ? '2px solid rgba(168, 85, 247, 0.6)' 
                        : '1px solid rgba(100, 116, 139, 0.3)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => {
                      if (index !== currentFrameIndex) {
                        e.currentTarget.style.background = 'rgba(51, 65, 85, 0.6)';
                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== currentFrameIndex) {
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                        e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.3)';
                      }
                    }}
                  >
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: index === currentFrameIndex ? '#a855f7' : '#64748b',
                      minWidth: '28px'
                    }}>
                      #{index + 1}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: index === currentFrameIndex ? '#e2e8f0' : '#94a3b8',
                      fontWeight: index === currentFrameIndex ? '600' : '500',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {frame.title}
                    </div>
                    {index === currentFrameIndex && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#a855f7',
                        animation: 'pulse 2s ease-in-out infinite',
                        boxShadow: '0 0 12px rgba(168, 85, 247, 0.8)'
                      }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Controls */}
        <div style={{
          flexShrink: 0,
          backdropFilter: 'blur(24px) saturate(180%)',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.98))',
          borderTop: '2px solid rgba(59, 130, 246, 0.3)',
          padding: '24px 40px',
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '8px',
            marginBottom: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            position: 'relative'
          }}>
            <div style={{
              width: `${overallProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)',
              borderRadius: '8px',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)'
            }} />
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '11px',
              fontWeight: '700',
              color: '#60a5fa'
            }}>
              {Math.round(overallProgress)}%
            </div>
          </div>

          {/* Control Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Left Controls */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePrevious}
                disabled={currentFrameIndex === 0 && currentPhase === "tutorial"}
                style={{
                  padding: '14px 28px',
                  background: currentFrameIndex === 0 && currentPhase === "tutorial"
                    ? 'rgba(51, 65, 85, 0.5)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  cursor: currentFrameIndex === 0 && currentPhase === "tutorial" ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  boxShadow: currentFrameIndex === 0 && currentPhase === "tutorial"
                    ? 'none'
                    : '0 4px 16px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!(currentFrameIndex === 0 && currentPhase === "tutorial")) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(currentFrameIndex === 0 && currentPhase === "tutorial")) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
                  }
                }}
              >
                ◀ Previous
              </button>
            </div>

            {/* Center Play Controls */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  style={{
                    padding: '16px 48px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    border: 'none',
                    borderRadius: '14px',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: '800',
                    boxShadow: '0 6px 24px rgba(34, 197, 94, 0.5)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(34, 197, 94, 0.5)';
                  }}
                >
                  ▶ Play
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  style={{
                    padding: '16px 48px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    borderRadius: '14px',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: '800',
                    boxShadow: '0 6px 24px rgba(245, 158, 11, 0.5)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(245, 158, 11, 0.5)';
                  }}
                >
                  ⏸ Pause
                </button>
              )}
            </div>

            {/* Right Controls */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleNext}
                disabled={currentFrameIndex === frames.length - 1 && currentPhase === "solution"}
                style={{
                  padding: '14px 28px',
                  background: currentFrameIndex === frames.length - 1 && currentPhase === "solution"
                    ? 'rgba(51, 65, 85, 0.5)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  cursor: currentFrameIndex === frames.length - 1 && currentPhase === "solution" ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  boxShadow: currentFrameIndex === frames.length - 1 && currentPhase === "solution"
                    ? 'none'
                    : '0 4px 16px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!(currentFrameIndex === frames.length - 1 && currentPhase === "solution")) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(currentFrameIndex === frames.length - 1 && currentPhase === "solution")) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
                  }
                }}
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}