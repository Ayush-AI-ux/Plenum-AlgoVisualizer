// import { useEffect, useState, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getToken } from "../services/authService";
// import * as THREE from "three";

// interface Frame {
//   frameNumber: number;
//   title: string;
//   explanation: string;
//   code?: string;
//   duration: number;
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
//     setShowTransition(false); // Hide transition when playing
//   };

//   const handlePause = () => {
//     setIsPlaying(false);
//   };

//   const handleNext = () => {
//     const frames = getCurrentFrames();
//     if (currentFrameIndex < frames.length - 1) {
//       setCurrentFrameIndex(currentFrameIndex + 1);
//       setShowTransition(false); // Hide transition when navigating
//     } else if (currentPhase === "tutorial") {
//       // Transition from tutorial to solution
//       setCurrentPhase("solution");
//       setCurrentFrameIndex(0);
//       setIsPlaying(false);
//       setShowTransition(true); // Show transition message
      
//       // Auto-hide transition message after 2 seconds
//       setTimeout(() => {
//         setShowTransition(false);
//       }, 2000);
//     } else {
//       // End of solution
//       setIsPlaying(false);
//     }
//   };

//   const handlePrevious = () => {
//     setShowTransition(false); // Hide transition when navigating
//     if (currentFrameIndex > 0) {
//       // Go to previous frame in current phase
//       setCurrentFrameIndex(currentFrameIndex - 1);
//       setIsPlaying(false);
//     } else if (currentPhase === "solution") {
//       // At beginning of solution, go back to last frame of tutorial
//       setCurrentPhase("tutorial");
//       const tutorialFrames = problem?.algorithmTutorial.frames || [];
//       setCurrentFrameIndex(tutorialFrames.length - 1);
//       setIsPlaying(false);
//     }
//     // If at beginning of tutorial, do nothing
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
  
//   // Calculate overall progress (tutorial + solution)
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
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: '40px',
//           minHeight: 0,
//           overflow: 'auto'
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

//           <div style={{
//             backdropFilter: 'blur(20px) saturate(180%)',
//             backgroundColor: 'rgba(10, 10, 10, 0.5)',
//             border: '2px solid rgba(59, 130, 246, 0.3)',
//             borderRadius: '20px',
//             padding: '60px',
//             maxWidth: '900px',
//             textAlign: 'center',
//             boxShadow: '0 20px 50px rgba(59, 130, 246, 0.2)'
//           }}>
//             <div style={{
//               fontSize: '72px',
//               marginBottom: '24px',
//               filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.6))'
//             }}>
//               🎬
//             </div>
//             <h2 style={{
//               fontSize: '28px',
//               fontWeight: '700',
//               color: '#60a5fa',
//               marginBottom: '16px'
//             }}>
//               {currentFrame?.title}
//             </h2>
//             <p style={{
//               fontSize: '16px',
//               color: 'rgba(255, 255, 255, 0.8)',
//               lineHeight: '1.8',
//               marginBottom: '24px',
//               maxWidth: '700px',
//               margin: '0 auto 24px'
//             }}>
//               {currentFrame?.explanation}
//             </p>
            
//             {currentFrame?.code && (
//               <div style={{
//                 marginTop: '24px',
//                 padding: '20px',
//                 backgroundColor: 'rgba(0, 0, 0, 0.4)',
//                 border: '1px solid rgba(59, 130, 246, 0.3)',
//                 borderRadius: '12px',
//                 textAlign: 'left'
//               }}>
//                 <div style={{
//                   fontSize: '12px',
//                   color: '#60a5fa',
//                   marginBottom: '8px',
//                   fontWeight: '600'
//                 }}>
//                   CODE:
//                 </div>
//                 <pre style={{
//                   fontFamily: 'monospace',
//                   fontSize: '14px',
//                   color: '#22c55e',
//                   margin: 0,
//                   whiteSpace: 'pre-wrap'
//                 }}>
//                   {currentFrame.code}
//                 </pre>
//               </div>
//             )}

//             <div style={{
//               marginTop: '32px',
//               fontSize: '14px',
//               color: 'rgba(96, 165, 250, 0.6)'
//             }}>
//               Frame {currentFrameIndex + 1} of {frames.length}
//               {currentPhase === "tutorial" && " (Tutorial)"}
//               {currentPhase === "solution" && " (Solution)"}
//             </div>
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
  scene3D?: any; // 3D scene data
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

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/problems/${id}`);
        const data = await response.json();

        if (data.success) {
          setProblem(data.data);
          console.log("Problem data loaded:", data.data); // Debug log
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

  // Three.js background animation
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

    // Simple particle background
    const particleCount = 800;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x3b82f6);
    const color2 = new THREE.Color(0xa855f7);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      const color = Math.random() > 0.5 ? color1 : color2;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      particles.rotation.y += 0.0002;
      particles.rotation.x += 0.0001;
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

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !problem) return;

    const frames = currentPhase === "tutorial" 
      ? problem.algorithmTutorial.frames 
      : problem.problemSolution.frames;

    const currentFrame = frames[currentFrameIndex];
    if (!currentFrame) return;

    const timer = setTimeout(() => {
      handleNext();
    }, currentFrame.duration * 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIndex, currentPhase, problem]);

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
      }, 2000);
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
        backgroundColor: '#000000',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading visualization...</p>
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
        backgroundColor: '#000000'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={() => navigate("/problems")}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer'
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
      {/* Background Canvas */}
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
        {/* Header */}
        <div style={{
          flexShrink: 0,
          padding: '16px 24px',
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(10, 10, 10, 0.6)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate(`/problems/${id}`)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '6px',
                color: '#60a5fa',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              ← Exit
            </button>
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
                margin: 0
              }}>
                {problem.title}
              </h1>
              <p style={{
                fontSize: '13px',
                color: 'rgba(96, 165, 250, 0.8)',
                margin: '4px 0 0 0'
              }}>
                {currentPhase === "tutorial" 
                  ? `Tutorial: ${problem.algorithmTutorial.algorithmName}`
                  : "Solution Walkthrough"
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '6px',
              color: '#a855f7',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            🔄 Restart
          </button>
        </div>

        {/* Main Visualization Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          padding: '20px',
          gap: '20px',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* Transition Message */}
          {showTransition && (
            <div 
              onClick={() => setShowTransition(false)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                backdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid rgba(34, 197, 94, 0.5)',
                borderRadius: '16px',
                padding: '24px 48px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#22c55e',
                marginBottom: '8px'
              }}>
                Tutorial Complete!
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '8px'
              }}>
                Ready to see the solution?
              </p>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0
              }}>
                Click here or press Play to continue
              </p>
            </div>
          )}

          {/* 3D Visualization Area */}
          <div style={{
            flex: 2,
            minWidth: 0,
            position: 'relative'
          }}>
            {currentFrame && currentFrame.scene3D ? (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '16px',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
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
                backdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(10, 10, 10, 0.5)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '16px',
              }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  No 3D scene data available for this frame
                </p>
              </div>
            )}
          </div>

          {/* Explanation Panel */}
          <div style={{
            flex: 1,
            minWidth: '300px',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto'
          }}>
            {/* Frame Info */}
            <div style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              backgroundColor: 'rgba(10, 10, 10, 0.6)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#60a5fa',
                marginBottom: '12px'
              }}>
                {currentFrame?.title}
              </h2>
              <p style={{
                fontSize: '15px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.7',
                marginBottom: '16px'
              }}>
                {currentFrame?.explanation}
              </p>
              
              <div style={{
                fontSize: '13px',
                color: 'rgba(96, 165, 250, 0.6)'
              }}>
                Frame {currentFrameIndex + 1} of {frames.length}
                {currentPhase === "tutorial" && " (Tutorial)"}
                {currentPhase === "solution" && " (Solution)"}
              </div>
            </div>

            {/* Code Panel */}
            {currentFrame?.code && (
              <div style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(10, 10, 10, 0.6)',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#22c55e',
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  CODE:
                </div>
                <pre style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: '#22c55e',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5'
                }}>
                  {currentFrame.code}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div style={{
          flexShrink: 0,
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(10, 10, 10, 0.6)',
          borderTop: '1px solid rgba(59, 130, 246, 0.2)',
          padding: '20px 40px'
        }}>
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '3px',
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${overallProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #a855f7)',
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Control Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={handlePrevious}
              disabled={currentFrameIndex === 0 && currentPhase === "tutorial"}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '8px',
                color: '#60a5fa',
                fontSize: '16px',
                cursor: currentFrameIndex === 0 && currentPhase === "tutorial" ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: currentFrameIndex === 0 && currentPhase === "tutorial" ? 0.5 : 1
              }}
            >
              ◀ Previous
            </button>

            {!isPlaying ? (
              <button
                onClick={handlePlay}
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                }}
              >
                ▶ Play
              </button>
            ) : (
              <button
                onClick={handlePause}
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
                }}
              >
                ⏸ Pause
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={currentFrameIndex === frames.length - 1 && currentPhase === "solution"}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '8px',
                color: '#60a5fa',
                fontSize: '16px',
                cursor: currentFrameIndex === frames.length - 1 && currentPhase === "solution" ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: currentFrameIndex === frames.length - 1 && currentPhase === "solution" ? 0.5 : 1
              }}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}