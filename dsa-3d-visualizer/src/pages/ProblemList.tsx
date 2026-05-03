// import { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { getToken } from "../services/authService";
// import * as THREE from "three";

// interface Problem {
//   _id: string;
//   problemId: string;
//   title: string;
//   difficulty: "Easy" | "Medium" | "Hard";
//   tags: string[];
//   description: string;
// }


// // ⭐ AI Modal types
// type AiModalStep = "form" | "generating" | "success" | "error";

// interface AiGenerateForm {
//   platform: string;
//   problemNumber: string;
//   problemName: string;
// }

// interface AiResult {
//   title: string;
//   difficulty: string;
//   tags: string[];
//   tutorialFrames: number;
//   solutionFrames: number;
//   languages: string[];
//   problemId: string;
// }

// export default function ProblemList() {
//   const navigate = useNavigate();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [problems, setProblems] = useState<Problem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   // ⭐ AI Modal state
//   const [showAiModal, setShowAiModal] = useState(false);
//   const [aiStep, setAiStep] = useState<AiModalStep>("form");
//   const [aiForm, setAiForm] = useState<AiGenerateForm>({ platform: "leetcode", problemNumber: "", problemName: "" });
//   const [aiResult, setAiResult] = useState<AiResult | null>(null);
//   const [aiError, setAiError] = useState("");

//   useEffect(() => {
//     // Check authentication
//     const token = getToken();
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//   }, [navigate]);

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

//     // Orange particles (similar to home page)
//     const particleCount = 1500;
//     const particlesGeometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(particleCount * 3);
//     const velocities: number[] = [];
//     const colors = new Float32Array(particleCount * 3);

//     const orangeColors = [
//       new THREE.Color(0xff6b35),
//       new THREE.Color(0xff8c42),
//       new THREE.Color(0xffa64d),
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
//       size: 0.25,
//       vertexColors: true,
//       transparent: true,
//       opacity: 0.7,
//       blending: THREE.AdditiveBlending,
//     });

//     const particles = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particles);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//     scene.add(ambientLight);

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
//       }
      
//       particlesGeometry.attributes.position.needsUpdate = true;
//       particles.rotation.y += 0.0003;

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

//   // ⭐ Fetch problems — defined as useCallback so AI modal can refresh the list
//   const fetchProblems = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const query = selectedDifficulty !== "all" ? `?difficulty=${selectedDifficulty}` : "";
//       const response = await fetch(`http://localhost:5000/api/problems${query}`);
//       const data = await response.json();
//       if (data.success) {
//         setProblems(data.data);
//       } else {
//         setError("Failed to load problems");
//       }
//     } catch (err) {
//       setError("Error connecting to server");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedDifficulty]);

//   useEffect(() => {
//     fetchProblems();
//   }, [fetchProblems]);

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "Easy":
//         return "#22c55e";
//       case "Medium":
//         return "#f59e0b";
//       case "Hard":
//         return "#ef4444";
//       default:
//         return "#6b7280";
//     }
//   };

//   const handleProblemClick = (problemId: string) => {
//     navigate(`/problems/${problemId}`);
//   };

//   // ⭐ AI Problem Generator handlers
//   const openAiModal = () => {
//     setAiStep("form");
//     setAiForm({ platform: "leetcode", problemNumber: "", problemName: "" });
//     setAiResult(null);
//     setAiError("");
//     setShowAiModal(true);
//   };

//   const closeAiModal = () => {
//     if (aiStep === "generating") return; // prevent close while generating
//     setShowAiModal(false);
//   };

//   const handleAiGenerate = async () => {
//     if (!aiForm.problemName.trim() && !aiForm.problemNumber.trim()) return;
//     setAiStep("generating");
//     setAiError("");
//     try {
//       const response = await fetch("http://localhost:5000/api/ai/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(aiForm),
//       });
//       const data = await response.json();
//       if (data.success) {
//         setAiResult(data.data);
//         setAiStep("success");
//         fetchProblems(); // refresh problem list
//       } else {
//         setAiError(data.message || "Something went wrong. Please try again.");
//         setAiStep("error");
//       }
//     } catch {
//       setAiError("Could not connect to server. Make sure the backend is running.");
//       setAiStep("error");
//     }
//   };

//   // Filter problems based on search query
//   const filteredProblems = problems.filter(problem => 
//     problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

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
//       {/* Three.js Canvas */}
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

//       {/* Content */}
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         overflowY: 'auto',
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
//             marginBottom: '32px',
//             padding: '16px 32px',
//             backdropFilter: 'blur(16px) saturate(180%)',
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
//                 margin: '0 0 4px 0'
//               }}>
//                 DSA 3D Visualizer
//               </h1>
//               <p style={{
//                 color: 'rgba(255, 166, 77, 0.7)',
//                 margin: 0,
//                 fontSize: '13px'
//               }}>
//                 Explore Algorithm Problems
//               </p>
//             </div>
//             <button
//               onClick={() => navigate('/')}
//               style={{
//                 padding: '12px 28px',
//                 background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
//                 border: 'none',
//                 borderRadius: '12px',
//                 color: 'white',
//                 fontSize: '15px',
//                 cursor: 'pointer',
//                 fontWeight: '600',
//                 boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
//                 transition: 'all 0.3s',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'translateY(-2px)';
//                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.5)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
//               }}
//             >
//               <svg 
//                 style={{ width: '18px', height: '18px' }}
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24"
//               >
//                 <path 
//                   strokeLinecap="round" 
//                   strokeLinejoin="round" 
//                   strokeWidth={2.5} 
//                   d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
//                 />
//               </svg>
//               <span>Back to Home</span>
//             </button>

//             {/* ⭐ AI Add Problem Button */}
//             <button
//               onClick={openAiModal}
//               style={{
//                 padding: '12px 24px',
//                 background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
//                 border: 'none',
//                 borderRadius: '12px',
//                 color: 'white',
//                 fontSize: '15px',
//                 cursor: 'pointer',
//                 fontWeight: '600',
//                 boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
//                 transition: 'all 0.3s',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'translateY(-2px)';
//                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.6)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)';
//               }}
//             >
//               <span style={{ fontSize: '18px' }}>✨</span>
//               <span>Add with AI</span>
//             </button>
//           </header>

//           {/* Title & Filters */}
//           <div style={{
//             backdropFilter: 'blur(16px) saturate(180%)',
//             backgroundColor: 'rgba(10, 10, 10, 0.35)',
//             border: '1px solid rgba(255, 107, 53, 0.2)',
//             borderRadius: '16px',
//             padding: '28px 32px',
//             marginBottom: '24px'
//           }}>
//             {/* Title */}
//             <h2 style={{
//               fontSize: '26px',
//               fontWeight: '700',
//               background: 'linear-gradient(135deg, #ff8c42, #ffa64d)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               marginBottom: '20px'
//             }}>
//               Algorithm Problems
//             </h2>

//             {/* Search Bar */}
//             <div style={{
//               marginBottom: '20px',
//               position: 'relative'
//             }}>
//               <input
//                 type="text"
//                 placeholder="Search problems by name or tag..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{
//                   width: '100%',
//                   padding: '14px 20px 14px 48px',
//                   backgroundColor: 'rgba(20, 20, 20, 0.5)',
//                   border: '1px solid rgba(255, 107, 53, 0.3)',
//                   borderRadius: '10px',
//                   color: 'white',
//                   fontSize: '15px',
//                   outline: 'none',
//                   transition: 'all 0.2s',
//                   boxSizing: 'border-box'
//                 }}
//                 onFocus={(e) => {
//                   e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.6)';
//                   e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.7)';
//                 }}
//                 onBlur={(e) => {
//                   e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.3)';
//                   e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.5)';
//                 }}
//               />
//               <svg 
//                 style={{
//                   position: 'absolute',
//                   left: '16px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   width: '20px',
//                   height: '20px',
//                   color: 'rgba(255, 166, 77, 0.6)',
//                   pointerEvents: 'none'
//                 }}
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24"
//               >
//                 <path 
//                   strokeLinecap="round" 
//                   strokeLinejoin="round" 
//                   strokeWidth={2} 
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
//                 />
//               </svg>
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   style={{
//                     position: 'absolute',
//                     right: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'rgba(255, 107, 53, 0.3)',
//                     border: 'none',
//                     borderRadius: '6px',
//                     padding: '6px 10px',
//                     color: '#ffa64d',
//                     fontSize: '12px',
//                     cursor: 'pointer',
//                     fontWeight: '600'
//                   }}
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
            
//             {/* Difficulty Filter */}
//             <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
//               <span style={{ 
//                 color: 'rgba(255, 255, 255, 0.7)', 
//                 fontSize: '14px',
//                 fontWeight: '500'
//               }}>
//                 Filter by difficulty:
//               </span>
//               {["all", "Easy", "Medium", "Hard"].map((diff) => (
//                 <button
//                   key={diff}
//                   onClick={() => setSelectedDifficulty(diff)}
//                   style={{
//                     padding: '8px 16px',
//                     backgroundColor: selectedDifficulty === diff 
//                       ? 'rgba(255, 107, 53, 0.3)' 
//                       : 'rgba(20, 20, 20, 0.3)',
//                     border: selectedDifficulty === diff
//                       ? '1px solid rgba(255, 107, 53, 0.5)'
//                       : '1px solid rgba(255, 107, 53, 0.2)',
//                     borderRadius: '8px',
//                     color: selectedDifficulty === diff ? '#ffa64d' : 'rgba(255, 255, 255, 0.6)',
//                     fontSize: '13px',
//                     cursor: 'pointer',
//                     fontWeight: selectedDifficulty === diff ? '600' : '400',
//                     transition: 'all 0.2s'
//                   }}
//                 >
//                   {diff === "all" ? "All" : diff}
//                 </button>
//               ))}
//             </div>

//             {/* Results count */}
//             {searchQuery && (
//               <div style={{
//                 marginTop: '16px',
//                 fontSize: '13px',
//                 color: 'rgba(255, 166, 77, 0.7)'
//               }}>
//                 Found {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
//               </div>
//             )}
//           </div>

//           {/* Problem List */}
//           {isLoading ? (
//             <div style={{
//               textAlign: 'center',
//               padding: '60px',
//               color: 'rgba(255, 255, 255, 0.6)'
//             }}>
//               <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
//               <p>Loading problems...</p>
//             </div>
//           ) : error ? (
//             <div style={{
//               textAlign: 'center',
//               padding: '60px',
//               color: '#ef4444'
//             }}>
//               <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
//               <p>{error}</p>
//             </div>
//           ) : filteredProblems.length === 0 ? (
//             <div style={{
//               textAlign: 'center',
//               padding: '60px',
//               backdropFilter: 'blur(16px) saturate(180%)',
//               backgroundColor: 'rgba(10, 10, 10, 0.3)',
//               border: '1px solid rgba(255, 107, 53, 0.15)',
//               borderRadius: '16px'
//             }}>
//               <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
//               <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>
//                 No problems found matching "{searchQuery}"
//               </p>
//               <button
//                 onClick={() => setSearchQuery("")}
//                 style={{
//                   marginTop: '16px',
//                   padding: '10px 20px',
//                   backgroundColor: 'rgba(255, 107, 53, 0.2)',
//                   border: '1px solid rgba(255, 107, 53, 0.3)',
//                   borderRadius: '8px',
//                   color: '#ffa64d',
//                   fontSize: '14px',
//                   cursor: 'pointer',
//                   fontWeight: '600'
//                 }}
//               >
//                 Clear Search
//               </button>
//             </div>
//           ) : (
//             <div style={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '16px'
//             }}>
//               {filteredProblems.map((problem, index) => (
//                 <div
//                   key={problem._id}
//                   onClick={() => handleProblemClick(problem.problemId)}
//                   style={{
//                     display: 'flex',
//                     gap: '20px',
//                     padding: '24px',
//                     backdropFilter: 'blur(16px) saturate(180%)',
//                     backgroundColor: 'rgba(10, 10, 10, 0.3)',
//                     border: '1px solid rgba(255, 107, 53, 0.15)',
//                     borderRadius: '12px',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'translateX(8px)';
//                     e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.4)';
//                     e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.4)';
//                     e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.2)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'translateX(0)';
//                     e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.3)';
//                     e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.15)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}
//                 >
//                   {/* Number Badge */}
//                   <div style={{
//                     flexShrink: 0,
//                     width: '48px',
//                     height: '48px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     backgroundColor: 'rgba(255, 107, 53, 0.15)',
//                     border: '2px solid rgba(255, 107, 53, 0.3)',
//                     borderRadius: '10px',
//                     fontSize: '20px',
//                     fontWeight: '700',
//                     color: '#ffa64d'
//                   }}>
//                     {index + 1}
//                   </div>

//                   {/* Content */}
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'flex-start',
//                       marginBottom: '12px',
//                       gap: '12px'
//                     }}>
//                       <h3 style={{
//                         fontSize: '20px',
//                         fontWeight: '600',
//                         color: '#ffa64d',
//                         margin: 0,
//                         flex: 1
//                       }}>
//                         {problem.title}
//                       </h3>
//                       <span style={{
//                         flexShrink: 0,
//                         padding: '6px 14px',
//                         backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
//                         border: `1px solid ${getDifficultyColor(problem.difficulty)}50`,
//                         borderRadius: '6px',
//                         color: getDifficultyColor(problem.difficulty),
//                         fontSize: '13px',
//                         fontWeight: '600'
//                       }}>
//                         {problem.difficulty}
//                       </span>
//                     </div>

//                     <p style={{
//                       color: 'rgba(255, 255, 255, 0.65)',
//                       fontSize: '14px',
//                       lineHeight: '1.6',
//                       marginBottom: '14px'
//                     }}>
//                       {problem.description.length > 180
//                         ? problem.description.slice(0, 180) + '...'
//                         : problem.description}
//                     </p>

//                     <div style={{
//                       display: 'flex',
//                       flexWrap: 'wrap',
//                       gap: '8px',
//                       marginBottom: '12px'
//                     }}>
//                       {problem.tags.map((tag, tagIndex) => (
//                         <span
//                           key={tagIndex}
//                           style={{
//                             padding: '5px 12px',
//                             backgroundColor: 'rgba(255, 107, 53, 0.1)',
//                             border: '1px solid rgba(255, 107, 53, 0.25)',
//                             borderRadius: '6px',
//                             color: 'rgba(255, 166, 77, 0.9)',
//                             fontSize: '12px',
//                             fontWeight: '500'
//                           }}
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>

//                     <div style={{
//                       paddingTop: '12px',
//                       borderTop: '1px solid rgba(255, 107, 53, 0.1)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px',
//                       color: '#ffa64d',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>
//                       <span>Start Visualization</span>
//                       <svg 
//                         style={{ width: '16px', height: '16px' }}
//                         fill="none" 
//                         stroke="currentColor" 
//                         viewBox="0 0 24 24"
//                       >
//                         <path 
//                           strokeLinecap="round" 
//                           strokeLinejoin="round" 
//                           strokeWidth={2} 
//                           d="M13 7l5 5m0 0l-5 5m5-5H6" 
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//           {/* ⭐ AI Generate Problem Modal */}
//           {showAiModal && (
//             <div
//               onClick={closeAiModal}
//               style={{
//                 position: 'fixed',
//                 inset: 0,
//                 zIndex: 1000,
//                 backgroundColor: 'rgba(0,0,0,0.75)',
//                 backdropFilter: 'blur(8px)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 padding: '20px',
//               }}
//             >
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   width: '100%',
//                   maxWidth: '520px',
//                   background: 'linear-gradient(135deg, rgba(20,10,40,0.98), rgba(15,10,35,0.98))',
//                   border: '2px solid rgba(168, 85, 247, 0.4)',
//                   borderRadius: '24px',
//                   padding: '36px',
//                   boxShadow: '0 24px 80px rgba(168, 85, 247, 0.3)',
//                   position: 'relative',
//                 }}
//               >
//                 {/* Modal Header */}
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
//                   <div>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
//                       <span style={{ fontSize: '28px' }}>✨</span>
//                       <h2 style={{
//                         fontSize: '22px',
//                         fontWeight: '800',
//                         background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
//                         WebkitBackgroundClip: 'text',
//                         WebkitTextFillColor: 'transparent',
//                         margin: 0,
//                       }}>
//                         Add Problem with AI
//                       </h2>
//                     </div>
//                     <p style={{ color: 'rgba(200,180,255,0.6)', fontSize: '13px', margin: 0 }}>
//                       GPT-4o will generate the full problem data automatically
//                     </p>
//                   </div>
//                   {aiStep !== 'generating' && (
//                     <button
//                       onClick={closeAiModal}
//                       style={{
//                         background: 'rgba(168,85,247,0.15)',
//                         border: '1px solid rgba(168,85,247,0.3)',
//                         borderRadius: '8px',
//                         color: '#a855f7',
//                         width: '32px',
//                         height: '32px',
//                         cursor: 'pointer',
//                         fontSize: '16px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         flexShrink: 0,
//                       }}
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>

//                 {/* ── FORM STEP ── */}
//                 {aiStep === 'form' && (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

//                     {/* Platform Dropdown */}
//                     <div>
//                       <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(200,180,255,0.8)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
//                         Platform
//                       </label>
//                       <select
//                         value={aiForm.platform}
//                         onChange={(e) => setAiForm({ ...aiForm, platform: e.target.value })}
//                         style={{
//                           width: '100%',
//                           padding: '12px 16px',
//                           background: 'rgba(30,15,60,0.8)',
//                           border: '1px solid rgba(168,85,247,0.35)',
//                           borderRadius: '10px',
//                           color: 'white',
//                           fontSize: '14px',
//                           outline: 'none',
//                           cursor: 'pointer',
//                           boxSizing: 'border-box',
//                         }}
//                       >
//                         <option value="leetcode">🟡 LeetCode</option>
//                         <option value="codeforces">🔵 Codeforces</option>
//                         <option value="ai">🤖 AI Generate</option>
//                       </select>
//                     </div>

//                     {/* Problem Number */}
//                     <div>
//                       <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(200,180,255,0.8)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
//                         {aiForm.platform === 'codeforces' ? 'Contest ID + Index' : 'Problem Number'}
//                         {' '}<span style={{ color: 'rgba(168,85,247,0.5)', fontWeight: '400', textTransform: 'none' }}>
//                           {aiForm.platform === 'codeforces' ? '(e.g. 2211A or 2211)' : aiForm.platform === 'leetcode' ? '(e.g. 1, 115, 200)' : '(optional)'}
//                         </span>
//                       </label>
//                       <input
//                         type="text"
//                         placeholder={aiForm.platform === 'codeforces' ? 'e.g. 2211A or 2211' : aiForm.platform === 'leetcode' ? 'e.g. 1, 115' : 'optional'}
//                         value={aiForm.problemNumber}
//                         onChange={(e) => setAiForm({ ...aiForm, problemNumber: e.target.value })}
//                         style={{
//                           width: '100%',
//                           padding: '12px 16px',
//                           background: 'rgba(30,15,60,0.8)',
//                           border: '1px solid rgba(168,85,247,0.35)',
//                           borderRadius: '10px',
//                           color: 'white',
//                           fontSize: '14px',
//                           outline: 'none',
//                           boxSizing: 'border-box',
//                         }}
//                         onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.7)'}
//                         onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)'}
//                       />
//                     </div>

//                     {/* Problem Name */}
//                     <div>
//                       <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(200,180,255,0.8)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
//                         Problem Name
//                         {' '}<span style={{ color: aiForm.platform === 'ai' ? '#ef4444' : 'rgba(168,85,247,0.5)', fontWeight: '400', textTransform: 'none', fontSize: '11px' }}>
//                           {aiForm.platform === 'codeforces' ? '(optional, or index e.g. A)' : aiForm.platform === 'leetcode' ? '(e.g. two-sum or Two Sum)' : '*required'}
//                         </span>
//                       </label>
//                       <input
//                         type="text"
//                         placeholder={aiForm.platform === 'codeforces' ? 'e.g. A (index) or leave empty' : aiForm.platform === 'leetcode' ? 'e.g. two-sum or Two Sum' : 'e.g. Binary Search, Merge Sort'}
//                         value={aiForm.problemName}
//                         onChange={(e) => setAiForm({ ...aiForm, problemName: e.target.value })}
//                         onKeyDown={(e) => e.key === 'Enter' && aiForm.problemName.trim() && handleAiGenerate()}
//                         style={{
//                           width: '100%',
//                           padding: '12px 16px',
//                           background: 'rgba(30,15,60,0.8)',
//                           border: '1px solid rgba(168,85,247,0.35)',
//                           borderRadius: '10px',
//                           color: 'white',
//                           fontSize: '14px',
//                           outline: 'none',
//                           boxSizing: 'border-box',
//                         }}
//                         onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.7)'}
//                         onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)'}
//                       />
//                     </div>

//                     {/* Info box */}
//                     <div style={{
//                       padding: '12px 16px',
//                       background: 'rgba(168,85,247,0.08)',
//                       border: '1px solid rgba(168,85,247,0.2)',
//                       borderRadius: '10px',
//                       fontSize: '12px',
//                       color: 'rgba(200,180,255,0.6)',
//                       lineHeight: '1.6',
//                     }}>
//                       {aiForm.platform === 'leetcode'
//                         ? '🔍 Real data fetched from LeetCode API — enter problem number (e.g. 1) or name (e.g. two-sum)'
//                         : aiForm.platform === 'codeforces'
//                         ? '🔍 Real data fetched from Codeforces — enter contest+index like "2211A" in Problem Number'
//                         : '🤖 AI generates everything from scratch — enter a clear problem name'
//                       }
//                     </div>

//                     {/* Generate Button */}
//                     <button
//                       onClick={handleAiGenerate}
//                       disabled={!aiForm.problemName.trim() && !aiForm.problemNumber.trim()}
//                       style={{
//                         padding: '14px',
//                         background: (aiForm.problemName.trim() || aiForm.problemNumber.trim())
//                           ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
//                           : 'rgba(80,60,100,0.4)',
//                         border: 'none',
//                         borderRadius: '12px',
//                         color: 'white',
//                         fontSize: '16px',
//                         fontWeight: '700',
//                         cursor: (aiForm.problemName.trim() || aiForm.problemNumber.trim()) ? 'pointer' : 'not-allowed',
//                         boxShadow: aiForm.problemName.trim() ? '0 6px 20px rgba(168,85,247,0.4)' : 'none',
//                         transition: 'all 0.2s',
//                         opacity: (aiForm.problemName.trim() || aiForm.problemNumber.trim()) ? 1 : 0.5,
//                       }}
//                       onMouseEnter={(e) => {
//                         if (aiForm.problemName.trim() || aiForm.problemNumber.trim()) {
//                           e.currentTarget.style.transform = 'translateY(-2px)';
//                           e.currentTarget.style.boxShadow = '0 10px 30px rgba(168,85,247,0.5)';
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.transform = 'translateY(0)';
//                         e.currentTarget.style.boxShadow = aiForm.problemName.trim() ? '0 6px 20px rgba(168,85,247,0.4)' : 'none';
//                       }}
//                     >
//                       ✨ Generate Problem
//                     </button>
//                   </div>
//                 )}

//                 {/* ── GENERATING STEP ── */}
//                 {aiStep === 'generating' && (
//                   <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
//                     {/* Spinner */}
//                     <div style={{
//                       width: '64px',
//                       height: '64px',
//                       border: '4px solid rgba(168,85,247,0.2)',
//                       borderTop: '4px solid #a855f7',
//                       borderRadius: '50%',
//                       margin: '0 auto 24px',
//                       animation: 'spin 1s linear infinite',
//                     }} />
//                     <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

//                     <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '10px' }}>
//                       Generating "{aiForm.problemName}"...
//                     </h3>
//                     <p style={{ color: 'rgba(200,180,255,0.6)', fontSize: '13px', marginBottom: '24px', lineHeight: '1.6' }}>
//                       GPT-4o is writing the problem description, solutions in 4 languages, and 3D visualization frames. This takes 15–30 seconds.
//                     </p>

//                     {/* Progress steps */}
//                     {[
//                       '📝 Writing problem description & examples',
//                       '💻 Generating solutions (Python, JS, C++, Java)',
//                       '🎓 Building tutorial frames',
//                       '🎨 Creating 3D visualization data',
//                       '💾 Saving to database',
//                     ].map((step, i) => (
//                       <div key={i} style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         padding: '8px 0',
//                         color: 'rgba(200,180,255,0.5)',
//                         fontSize: '13px',
//                         textAlign: 'left',
//                       }}>
//                         <div style={{
//                           width: '6px',
//                           height: '6px',
//                           borderRadius: '50%',
//                           background: 'rgba(168,85,247,0.5)',
//                           flexShrink: 0,
//                           animation: `pulse ${1 + i * 0.3}s ease-in-out infinite`,
//                         }} />
//                         {step}
//                       </div>
//                     ))}
//                     <style>{`@keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }`}</style>
//                   </div>
//                 )}

//                 {/* ── SUCCESS STEP ── */}
//                 {aiStep === 'success' && aiResult && (
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
//                     <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#22c55e', marginBottom: '8px' }}>
//                       Problem Added!
//                     </h3>
//                     <p style={{ color: 'rgba(200,255,200,0.6)', fontSize: '13px', marginBottom: '24px' }}>
//                       Successfully generated and saved to your database
//                     </p>

//                     {/* Result card */}
//                     <div style={{
//                       background: 'rgba(34,197,94,0.08)',
//                       border: '1px solid rgba(34,197,94,0.25)',
//                       borderRadius: '14px',
//                       padding: '20px',
//                       marginBottom: '24px',
//                       textAlign: 'left',
//                     }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
//                         <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: 0 }}>
//                           {aiResult.title}
//                         </h4>
//                         <span style={{
//                           padding: '4px 10px',
//                           borderRadius: '6px',
//                           fontSize: '11px',
//                           fontWeight: '700',
//                           color: aiResult.difficulty === 'Easy' ? '#22c55e' : aiResult.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
//                           background: aiResult.difficulty === 'Easy' ? 'rgba(34,197,94,0.15)' : aiResult.difficulty === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
//                         }}>
//                           {aiResult.difficulty}
//                         </span>
//                       </div>

//                       {/* Tags */}
//                       <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
//                         {aiResult.tags?.map((tag: string) => (
//                           <span key={tag} style={{
//                             padding: '3px 8px',
//                             background: 'rgba(168,85,247,0.15)',
//                             border: '1px solid rgba(168,85,247,0.3)',
//                             borderRadius: '6px',
//                             fontSize: '11px',
//                             color: '#c084fc',
//                           }}>
//                             {tag}
//                           </span>
//                         ))}
//                       </div>

//                       {/* Stats */}
//                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
//                         {[
//                           { label: 'Tutorial Frames', value: aiResult.tutorialFrames },
//                           { label: 'Solution Frames', value: aiResult.solutionFrames },
//                           { label: 'Languages', value: aiResult.languages?.length },
//                         ].map(({ label, value }) => (
//                           <div key={label} style={{
//                             background: 'rgba(0,0,0,0.3)',
//                             borderRadius: '8px',
//                             padding: '10px',
//                             textAlign: 'center',
//                           }}>
//                             <div style={{ fontSize: '20px', fontWeight: '800', color: '#a855f7' }}>{value}</div>
//                             <div style={{ fontSize: '10px', color: 'rgba(200,180,255,0.5)', marginTop: '2px' }}>{label}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Action buttons */}
//                     <div style={{ display: 'flex', gap: '12px' }}>
//                       <button
//                         onClick={() => navigate(`/problems/${aiResult.problemId}`)}
//                         style={{
//                           flex: 1,
//                           padding: '12px',
//                           background: 'linear-gradient(135deg, #22c55e, #16a34a)',
//                           border: 'none',
//                           borderRadius: '10px',
//                           color: 'white',
//                           fontSize: '14px',
//                           fontWeight: '700',
//                           cursor: 'pointer',
//                           boxShadow: '0 4px 15px rgba(34,197,94,0.3)',
//                         }}
//                       >
//                         ▶ View Problem
//                       </button>
//                       <button
//                         onClick={() => { setAiStep('form'); setAiForm({ platform: 'leetcode', problemNumber: '', problemName: '' }); setAiResult(null); }}
//                         style={{
//                           flex: 1,
//                           padding: '12px',
//                           background: 'rgba(168,85,247,0.15)',
//                           border: '1px solid rgba(168,85,247,0.35)',
//                           borderRadius: '10px',
//                           color: '#a855f7',
//                           fontSize: '14px',
//                           fontWeight: '600',
//                           cursor: 'pointer',
//                         }}
//                       >
//                         ✨ Add Another
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* ── ERROR STEP ── */}
//                 {aiStep === 'error' && (
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚠️</div>
//                     <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444', marginBottom: '10px' }}>
//                       Generation Failed
//                     </h3>
//                     <div style={{
//                       padding: '14px 16px',
//                       background: 'rgba(239,68,68,0.08)',
//                       border: '1px solid rgba(239,68,68,0.25)',
//                       borderRadius: '10px',
//                       fontSize: '13px',
//                       color: 'rgba(255,180,180,0.8)',
//                       marginBottom: '24px',
//                       lineHeight: '1.6',
//                       textAlign: 'left',
//                     }}>
//                       {aiError}
//                     </div>
//                     <div style={{ display: 'flex', gap: '12px' }}>
//                       <button
//                         onClick={() => setAiStep('form')}
//                         style={{
//                           flex: 1,
//                           padding: '12px',
//                           background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
//                           border: 'none',
//                           borderRadius: '10px',
//                           color: 'white',
//                           fontSize: '14px',
//                           fontWeight: '700',
//                           cursor: 'pointer',
//                         }}
//                       >
//                         ← Try Again
//                       </button>
//                       <button
//                         onClick={closeAiModal}
//                         style={{
//                           flex: 1,
//                           padding: '12px',
//                           background: 'rgba(100,80,120,0.2)',
//                           border: '1px solid rgba(168,85,247,0.2)',
//                           borderRadius: '10px',
//                           color: 'rgba(200,180,255,0.6)',
//                           fontSize: '14px',
//                           fontWeight: '600',
//                           cursor: 'pointer',
//                         }}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 )}

//               </div>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getToken } from "../services/authService";
// import * as THREE from "three";

// interface Problem {
//   problemId: string;
//   title: string;
//   difficulty: "Easy" | "Medium" | "Hard";
//   tags: string[];
//   description: string;
//   examples: Array<{
//     input: string;
//     output: string;
//     explanation: string;
//   }>;
//   complexity: {
//     time: string;
//     space: string;
//     explanation: string;
//   };
//   algorithmTutorial: {
//     algorithmName: string;
//     description: string;
//   };
//   solutions?: {
//     [language: string]: string;
//   };
// }

// const LANGUAGE_COLORS: Record<string, string> = {
//   "C++": "#00599C",
//   "Java": "#f89820",
//   "Python": "#3776AB",
//   "JavaScript": "#F7DF1E",
//   "Go": "#00ADD8",
// };

// const LANGUAGE_ICONS: Record<string, string> = {
//   "C++": "⚡",
//   "Java": "☕",
//   "Python": "🐍",
//   "JavaScript": "📜",
//   "Go": "🔷",
// };

// export default function ProblemDetail() {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [problem, setProblem] = useState<Problem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState("Python");
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//   }, [navigate]);

//   // Three.js background
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

//     const particleCount = 1200;
//     const particlesGeometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(particleCount * 3);
//     const velocities: number[] = [];
//     const colors = new Float32Array(particleCount * 3);

//     const orangeColors = [
//       new THREE.Color(0xff6b35),
//       new THREE.Color(0xff8c42),
//       new THREE.Color(0xffa64d),
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
//       size: 0.2,
//       vertexColors: true,
//       transparent: true,
//       opacity: 0.6,
//       blending: THREE.AdditiveBlending,
//     });

//     const particles = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particles);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//     scene.add(ambientLight);

//     let animationId: number;

//     const animate = () => {
//       animationId = requestAnimationFrame(animate);

//       const positions = particlesGeometry.attributes.position.array as Float32Array;
      
//       for (let i = 0; i < particleCount; i++) {
//         const i3 = i * 3;
//         positions[i3] += velocities[i3];
//         positions[i3 + 1] += velocities[i3 + 1];
//         positions[i3 + 2] += velocities[i3 + 2];

//         if (Math.abs(positions[i3]) > 50) velocities[i3] *= -1;
//         if (Math.abs(positions[i3 + 1]) > 50) velocities[i3 + 1] *= -1;
//         if (Math.abs(positions[i3 + 2]) > 30) velocities[i3 + 2] *= -1;
//       }
      
//       particlesGeometry.attributes.position.needsUpdate = true;
//       particles.rotation.y += 0.0002;

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

//   // Fetch problem details
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

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "Easy":
//         return "#22c55e";
//       case "Medium":
//         return "#f59e0b";
//       case "Hard":
//         return "#ef4444";
//       default:
//         return "#6b7280";
//     }
//   };

//   const handleStartVisualization = () => {
//     navigate(`/visualize/${id}`);
//   };

//   const copyToClipboard = (code: string) => {
//     navigator.clipboard.writeText(code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
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
//           <p>Loading problem...</p>
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
//         backgroundColor: '#000000',
//         color: 'white'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
//           <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
//           <button
//             onClick={() => navigate("/problems")}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#ff6b35',
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

//   const languages = problem.solutions ? Object.keys(problem.solutions) : [];

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
//       {/* Canvas */}
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

//       {/* Content */}
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         overflowY: 'auto',
//         zIndex: 1,
//         padding: '20px'
//       }}>
//         <div style={{
//           maxWidth: '1200px',
//           margin: '0 auto',
//           paddingBottom: '80px'
//         }}>
//           {/* Header */}
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '16px',
//             marginBottom: '24px'
//           }}>
//             <button
//               onClick={() => navigate("/problems")}
//               style={{
//                 padding: '10px 20px',
//                 backdropFilter: 'blur(16px) saturate(180%)',
//                 backgroundColor: 'rgba(10, 10, 10, 0.4)',
//                 border: '1px solid rgba(255, 107, 53, 0.3)',
//                 borderRadius: '8px',
//                 color: '#ffa64d',
//                 fontSize: '14px',
//                 cursor: 'pointer',
//                 fontWeight: '500',
//                 transition: 'all 0.2s'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.4)';
//               }}
//             >
//               ← Back to Problems
//             </button>
//           </div>

//           {/* Problem Card */}
//           <div style={{
//             backdropFilter: 'blur(20px) saturate(180%)',
//             backgroundColor: 'rgba(10, 10, 10, 0.5)',
//             border: '1px solid rgba(255, 107, 53, 0.2)',
//             borderRadius: '16px',
//             padding: '32px',
//             marginBottom: '24px'
//           }}>
//             {/* Title & Difficulty */}
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'flex-start',
//               marginBottom: '20px',
//               flexWrap: 'wrap',
//               gap: '16px'
//             }}>
//               <h1 style={{
//                 fontSize: '32px',
//                 fontWeight: '700',
//                 background: 'linear-gradient(135deg, #ff8c42, #ffa64d)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 margin: 0
//               }}>
//                 {problem.title}
//               </h1>
//               <span style={{
//                 padding: '8px 16px',
//                 backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
//                 border: `1px solid ${getDifficultyColor(problem.difficulty)}50`,
//                 borderRadius: '8px',
//                 color: getDifficultyColor(problem.difficulty),
//                 fontSize: '14px',
//                 fontWeight: '600'
//               }}>
//                 {problem.difficulty}
//               </span>
//             </div>

//             {/* Tags */}
//             <div style={{
//               display: 'flex',
//               flexWrap: 'wrap',
//               gap: '8px',
//               marginBottom: '24px'
//             }}>
//               {problem.tags.map((tag, index) => (
//                 <span
//                   key={index}
//                   style={{
//                     padding: '6px 12px',
//                     backgroundColor: 'rgba(255, 107, 53, 0.15)',
//                     border: '1px solid rgba(255, 107, 53, 0.3)',
//                     borderRadius: '6px',
//                     color: 'rgba(255, 166, 77, 0.9)',
//                     fontSize: '13px',
//                     fontWeight: '500'
//                   }}
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>

//             {/* Description */}
//             <div style={{ marginBottom: '28px' }}>
//               <h3 style={{
//                 color: '#ffa64d',
//                 fontSize: '16px',
//                 fontWeight: '600',
//                 marginBottom: '12px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px'
//               }}>
//                 📋 Problem Description
//               </h3>
//               <div style={{
//                 color: 'rgba(255, 255, 255, 0.85)',
//                 fontSize: '15px',
//                 lineHeight: '1.8',
//                 padding: '16px 20px',
//                 backgroundColor: 'rgba(255, 107, 53, 0.05)',
//                 border: '1px solid rgba(255, 107, 53, 0.15)',
//                 borderRadius: '10px',
//                 whiteSpace: 'pre-wrap',
//                 wordBreak: 'break-word',
//               }}>
//                 {problem.description
//                   .replace(/\$\$\$[^$]+\$\$\$/g, (m: string) => m.replace(/\$\$\$/g, '').replace(/\mathbf\{([^}]+)\}/g, '$1').replace(/\[a-z]+\{([^}]+)\}/g, '$1'))
//                   .replace(/\$[^$]+\$/g, (m: string) => m.replace(/\$/g, ''))
//                   .replace(/time limit.*?megabytes\s*/i, '')
//                   .replace(/input standard input.*?output\s*/i, '')
//                   .trim()
//                 }
//               </div>
//             </div>

//             {/* Constraints */}
//             {problem.description.includes('Constraints:') && (
//               <div style={{ marginBottom: '24px' }}>
//                 <h3 style={{
//                   color: '#ffa64d',
//                   fontSize: '16px',
//                   fontWeight: '600',
//                   marginBottom: '12px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px'
//                 }}>
//                   📐 Constraints
//                 </h3>
//                 <div style={{
//                   padding: '14px 18px',
//                   backgroundColor: 'rgba(168, 85, 247, 0.05)',
//                   border: '1px solid rgba(168, 85, 247, 0.2)',
//                   borderRadius: '10px',
//                   fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//                   fontSize: '13px',
//                   color: 'rgba(200, 180, 255, 0.9)',
//                   lineHeight: '1.8',
//                   whiteSpace: 'pre-wrap',
//                 }}>
//                   {problem.description.split('Constraints:')[1] || ''}
//                 </div>
//               </div>
//             )}

//             {/* Examples */}
//             <div style={{ marginBottom: '28px' }}>
//               <h3 style={{
//                 color: '#ffa64d',
//                 fontSize: '16px',
//                 fontWeight: '600',
//                 marginBottom: '16px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px'
//               }}>
//                 💡 Examples
//               </h3>
//               {problem.examples.map((example, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     marginBottom: '16px',
//                     borderRadius: '12px',
//                     overflow: 'hidden',
//                     border: '1px solid rgba(255, 107, 53, 0.2)',
//                   }}
//                 >
//                   {/* Example header */}
//                   <div style={{
//                     padding: '10px 16px',
//                     backgroundColor: 'rgba(255, 107, 53, 0.1)',
//                     borderBottom: '1px solid rgba(255, 107, 53, 0.15)',
//                     fontSize: '13px',
//                     fontWeight: '700',
//                     color: '#ffa64d',
//                   }}>
//                     Example {index + 1}
//                   </div>

//                   {/* Input */}
//                   <div style={{ padding: '12px 16px', backgroundColor: 'rgba(10,10,10,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
//                     <div style={{ fontSize: '11px', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
//                       Input
//                     </div>
//                     <pre style={{
//                       fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//                       fontSize: '13px',
//                       color: 'rgba(255,255,255,0.9)',
//                       margin: 0,
//                       whiteSpace: 'pre-wrap',
//                       wordBreak: 'break-word',
//                       backgroundColor: 'rgba(34, 197, 94, 0.05)',
//                       padding: '10px 12px',
//                       borderRadius: '6px',
//                       border: '1px solid rgba(34,197,94,0.15)',
//                     }}>
//                       {example.input}
//                     </pre>
//                   </div>

//                   {/* Output */}
//                   <div style={{ padding: '12px 16px', backgroundColor: 'rgba(10,10,10,0.5)', borderBottom: example.explanation ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
//                     <div style={{ fontSize: '11px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
//                       Output
//                     </div>
//                     <pre style={{
//                       fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//                       fontSize: '13px',
//                       color: 'rgba(255,255,255,0.9)',
//                       margin: 0,
//                       whiteSpace: 'pre-wrap',
//                       wordBreak: 'break-word',
//                       backgroundColor: 'rgba(59,130,246,0.05)',
//                       padding: '10px 12px',
//                       borderRadius: '6px',
//                       border: '1px solid rgba(59,130,246,0.15)',
//                     }}>
//                       {example.output}
//                     </pre>
//                   </div>

//                   {/* Explanation */}
//                   {example.explanation && example.explanation !== 'See problem description for details.' && example.explanation !== 'See problem statement for full details.' && (
//                     <div style={{ padding: '12px 16px', backgroundColor: 'rgba(10,10,10,0.3)' }}>
//                       <div style={{ fontSize: '11px', fontWeight: '700', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
//                         Explanation
//                       </div>
//                       <p style={{
//                         fontSize: '13px',
//                         color: 'rgba(255,255,255,0.7)',
//                         lineHeight: '1.6',
//                         margin: 0,
//                       }}>
//                         {example.explanation}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Algorithm Info */}
//             <div style={{
//               padding: '20px',
//               backgroundColor: 'rgba(59, 130, 246, 0.1)',
//               border: '1px solid rgba(59, 130, 246, 0.3)',
//               borderRadius: '12px',
//               marginBottom: '24px'
//             }}>
//               <h3 style={{
//                 color: '#60a5fa',
//                 fontSize: '16px',
//                 fontWeight: '600',
//                 marginBottom: '12px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px'
//               }}>
//                 💡 Algorithm Required: {problem.algorithmTutorial.algorithmName}
//               </h3>
//               <p style={{
//                 color: 'rgba(255, 255, 255, 0.7)',
//                 fontSize: '14px',
//                 lineHeight: '1.6',
//                 margin: 0
//               }}>
//                 {problem.algorithmTutorial.description}
//               </p>
//             </div>

//             {/* Complexity */}
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//               gap: '12px',
//               marginBottom: '24px'
//             }}>
//               <div style={{
//                 padding: '12px',
//                 backgroundColor: 'rgba(34, 197, 94, 0.1)',
//                 border: '1px solid rgba(34, 197, 94, 0.3)',
//                 borderRadius: '8px'
//               }}>
//                 <div style={{
//                   color: '#22c55e',
//                   fontSize: '12px',
//                   fontWeight: '600',
//                   marginBottom: '4px'
//                 }}>
//                   Time Complexity
//                 </div>
//                 <div style={{
//                   color: 'white',
//                   fontSize: '18px',
//                   fontWeight: '700',
//                   fontFamily: 'monospace'
//                 }}>
//                   {problem.complexity.time}
//                 </div>
//               </div>
//               <div style={{
//                 padding: '12px',
//                 backgroundColor: 'rgba(168, 85, 247, 0.1)',
//                 border: '1px solid rgba(168, 85, 247, 0.3)',
//                 borderRadius: '8px'
//               }}>
//                 <div style={{
//                   color: '#a855f7',
//                   fontSize: '12px',
//                   fontWeight: '600',
//                   marginBottom: '4px'
//                 }}>
//                   Space Complexity
//                 </div>
//                 <div style={{
//                   color: 'white',
//                   fontSize: '18px',
//                   fontWeight: '700',
//                   fontFamily: 'monospace'
//                 }}>
//                   {problem.complexity.space}
//                 </div>
//               </div>
//             </div>

//             {/* Solution Section */}
//             {languages.length > 0 && (
//               <div style={{ marginBottom: '24px' }}>
//                 <button
//                   onClick={() => setShowSolutions(!showSolutions)}
//                   style={{
//                     width: '100%',
//                     padding: '16px',
//                     backgroundColor: 'rgba(168, 85, 247, 0.1)',
//                     border: '2px solid rgba(168, 85, 247, 0.3)',
//                     borderRadius: '12px',
//                     color: '#c084fc',
//                     cursor: 'pointer',
//                     fontWeight: '600',
//                     fontSize: '16px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                     transition: 'all 0.3s',
//                     marginBottom: showSolutions ? '16px' : '0'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
//                     e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
//                     e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
//                   }}
//                 >
//                   <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                     <span style={{ fontSize: '20px' }}>💻</span>
//                     View Solutions in {languages.length} Languages
//                   </span>
//                   <span style={{
//                     fontSize: '20px',
//                     transform: showSolutions ? 'rotate(180deg)' : 'rotate(0deg)',
//                     transition: 'transform 0.3s'
//                   }}>
//                     ▼
//                   </span>
//                 </button>

//                 {showSolutions && (
//                   <div style={{
//                     backgroundColor: 'rgba(20, 20, 20, 0.6)',
//                     border: '1px solid rgba(168, 85, 247, 0.2)',
//                     borderRadius: '12px',
//                     padding: '20px',
//                     animation: 'slideDown 0.3s ease-out'
//                   }}>
//                     {/* Language Tabs */}
//                     <div style={{
//                       display: 'flex',
//                       gap: '8px',
//                       marginBottom: '20px',
//                       flexWrap: 'wrap',
//                       borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
//                       paddingBottom: '12px'
//                     }}>
//                       {languages.map((lang) => (
//                         <button
//                           key={lang}
//                           onClick={() => {
//                             setSelectedLanguage(lang);
//                             setCopied(false); // Reset copied state when switching languages
//                           }}
//                           style={{
//                             padding: '10px 16px',
//                             backgroundColor: selectedLanguage === lang 
//                               ? `${LANGUAGE_COLORS[lang]}30` 
//                               : 'rgba(255, 255, 255, 0.05)',
//                             border: selectedLanguage === lang 
//                               ? `2px solid ${LANGUAGE_COLORS[lang]}` 
//                               : '2px solid rgba(255, 255, 255, 0.1)',
//                             borderRadius: '8px',
//                             color: selectedLanguage === lang 
//                               ? LANGUAGE_COLORS[lang] 
//                               : 'rgba(255, 255, 255, 0.6)',
//                             cursor: 'pointer',
//                             fontWeight: selectedLanguage === lang ? '600' : '500',
//                             fontSize: '14px',
//                             transition: 'all 0.2s',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '6px'
//                           }}
//                           onMouseEnter={(e) => {
//                             if (selectedLanguage !== lang) {
//                               e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
//                               e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
//                             }
//                           }}
//                           onMouseLeave={(e) => {
//                             if (selectedLanguage !== lang) {
//                               e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
//                               e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
//                             }
//                           }}
//                         >
//                           <span>{LANGUAGE_ICONS[lang]}</span>
//                           {lang}
//                         </button>
//                       ))}
//                     </div>

//                     {/* Code Display */}
//                     {problem.solutions && problem.solutions[selectedLanguage] && (
//                       <div style={{ position: 'relative' }}>
//                         <div style={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                           marginBottom: '12px'
//                         }}>
//                           <span style={{
//                             color: LANGUAGE_COLORS[selectedLanguage],
//                             fontWeight: '600',
//                             fontSize: '14px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '8px'
//                           }}>
//                             <span style={{ fontSize: '18px' }}>
//                               {LANGUAGE_ICONS[selectedLanguage]}
//                             </span>
//                             {selectedLanguage} Solution
//                           </span>
//                           <button
//                             onClick={() => copyToClipboard(problem.solutions![selectedLanguage])}
//                             style={{
//                               padding: '8px 12px',
//                               backgroundColor: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
//                               border: copied ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
//                               borderRadius: '6px',
//                               color: copied ? '#22c55e' : 'rgba(255, 255, 255, 0.7)',
//                               cursor: 'pointer',
//                               fontSize: '12px',
//                               fontWeight: '500',
//                               transition: 'all 0.2s',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '6px'
//                             }}
//                             onMouseEnter={(e) => {
//                               if (!copied) {
//                                 e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
//                                 e.currentTarget.style.color = 'white';
//                               }
//                             }}
//                             onMouseLeave={(e) => {
//                               if (!copied) {
//                                 e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
//                                 e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
//                               }
//                             }}
//                           >
//                             {copied ? '✓ Copied!' : '📋 Copy Code'}
//                           </button>
//                         </div>
//                         <pre style={{
//                           backgroundColor: '#1a1a1a',
//                           border: `1px solid ${LANGUAGE_COLORS[selectedLanguage]}30`,
//                           borderRadius: '8px',
//                           padding: '20px',
//                           overflowX: 'auto',
//                           fontSize: '14px',
//                           lineHeight: '1.6',
//                           fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
//                           margin: 0,
//                           color: '#e0e0e0'
//                         }}>
//                           <code>{problem.solutions[selectedLanguage]}</code>
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Start Button */}
//             <button
//               onClick={handleStartVisualization}
//               style={{
//                 width: '100%',
//                 padding: '16px',
//                 background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '12px',
//                 cursor: 'pointer',
//                 fontWeight: '700',
//                 fontSize: '18px',
//                 boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
//                 transition: 'all 0.3s',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '12px'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'scale(1.02)';
//                 e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 107, 53, 0.6)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//                 e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.4)';
//               }}
//             >
//               <span style={{ fontSize: '24px' }}>🎬</span>
//               Start 3D Visualization
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add animation keyframes */}
//       <style>{`
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/authService";
import * as THREE from "three";

interface Problem {
  _id: string;
  problemId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
}


// ⭐ AI Modal types
type AiModalStep = "form" | "generating" | "success" | "error";

interface AiGenerateForm {
  platform: string;
  problemNumber: string;
  problemName: string;
}

interface AiResult {
  title: string;
  difficulty: string;
  tags: string[];
  tutorialFrames: number;
  solutionFrames: number;
  languages: string[];
  problemId: string;
}

export default function ProblemList() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ⭐ AI Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiStep, setAiStep] = useState<AiModalStep>("form");
  const [aiForm, setAiForm] = useState<AiGenerateForm>({ platform: "leetcode", problemNumber: "", problemName: "" });
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    // Check authentication
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

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

    // Orange particles (similar to home page)
    const particleCount = 1500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];
    const colors = new Float32Array(particleCount * 3);

    const orangeColors = [
      new THREE.Color(0xff6b35),
      new THREE.Color(0xff8c42),
      new THREE.Color(0xffa64d),
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

      const color = orangeColors[Math.floor(Math.random() * orangeColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    let animationId: number;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        if (Math.abs(positions[i3]) > 50) velocities[i3] *= -1;
        if (Math.abs(positions[i3 + 1]) > 50) velocities[i3 + 1] *= -1;
        if (Math.abs(positions[i3 + 2]) > 30) velocities[i3 + 2] *= -1;
      }
      
      particlesGeometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0003;

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

  // ⭐ Fetch problems — defined as useCallback so AI modal can refresh the list
  const fetchProblems = useCallback(async () => {
    try {
      setIsLoading(true);
      const query = selectedDifficulty !== "all" ? `?difficulty=${selectedDifficulty}` : "";
      const response = await fetch(`http://localhost:5000/api/problems${query}`);
      const data = await response.json();
      if (data.success) {
        setProblems(data.data);
      } else {
        setError("Failed to load problems");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDifficulty]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#22c55e";
      case "Medium":
        return "#f59e0b";
      case "Hard":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const handleProblemClick = (problemId: string) => {
    navigate(`/problems/${problemId}`);
  };

  // ⭐ AI Problem Generator handlers
  const openAiModal = () => {
    setAiStep("form");
    setAiForm({ platform: "leetcode", problemNumber: "", problemName: "" });
    setAiResult(null);
    setAiError("");
    setShowAiModal(true);
  };

  const closeAiModal = () => {
    if (aiStep === "generating") return; // prevent close while generating
    setShowAiModal(false);
  };

  const handleAiGenerate = async () => {
    if (!aiForm.problemName.trim() && !aiForm.problemNumber.trim()) return;
    setAiStep("generating");
    setAiError("");
    try {
      const response = await fetch("http://localhost:5000/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiForm),
      });
      const data = await response.json();
      if (data.success) {
        setAiResult(data.data);
        setAiStep("success");
        fetchProblems(); // refresh problem list
      } else {
        setAiError(data.message || "Something went wrong. Please try again.");
        setAiStep("error");
      }
    } catch {
      setAiError("Could not connect to server. Make sure the backend is running.");
      setAiStep("error");
    }
  };

  // Filter problems based on search query
  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      {/* Three.js Canvas */}
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

      {/* Content */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        zIndex: 1,
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          paddingBottom: '80px'
        }}>
          {/* Header */}
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            padding: '16px 32px',
            backdropFilter: 'blur(16px) saturate(180%)',
            backgroundColor: 'rgba(10, 10, 10, 0.4)',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(255, 107, 53, 0.1)'
          }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ff6b35, #ffa64d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 4px 0'
              }}>
                DSA 3D Visualizer
              </h1>
              <p style={{
                color: 'rgba(255, 166, 77, 0.7)',
                margin: 0,
                fontSize: '13px'
              }}>
                Explore Algorithm Problems
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
              }}
            >
              <svg 
                style={{ width: '18px', height: '18px' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              <span>Back to Home</span>
            </button>

            {/* ⭐ AI Add Problem Button */}
            <button
              onClick={openAiModal}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)';
              }}
            >
              <span style={{ fontSize: '18px' }}>✨</span>
              <span>Add with AI</span>
            </button>
          </header>

          {/* Title & Filters */}
          <div style={{
            backdropFilter: 'blur(16px) saturate(180%)',
            backgroundColor: 'rgba(10, 10, 10, 0.35)',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            borderRadius: '16px',
            padding: '28px 32px',
            marginBottom: '24px'
          }}>
            {/* Title */}
            <h2 style={{
              fontSize: '26px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ff8c42, #ffa64d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px'
            }}>
              Algorithm Problems
            </h2>

            {/* Search Bar */}
            <div style={{
              marginBottom: '20px',
              position: 'relative'
            }}>
              <input
                type="text"
                placeholder="Search problems by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 48px',
                  backgroundColor: 'rgba(20, 20, 20, 0.5)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.6)';
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.7)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.5)';
                }}
              />
              <svg 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: 'rgba(255, 166, 77, 0.6)',
                  pointerEvents: 'none'
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 107, 53, 0.3)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    color: '#ffa64d',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Difficulty Filter */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Filter by difficulty:
              </span>
              {["all", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: selectedDifficulty === diff 
                      ? 'rgba(255, 107, 53, 0.3)' 
                      : 'rgba(20, 20, 20, 0.3)',
                    border: selectedDifficulty === diff
                      ? '1px solid rgba(255, 107, 53, 0.5)'
                      : '1px solid rgba(255, 107, 53, 0.2)',
                    borderRadius: '8px',
                    color: selectedDifficulty === diff ? '#ffa64d' : 'rgba(255, 255, 255, 0.6)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: selectedDifficulty === diff ? '600' : '400',
                    transition: 'all 0.2s'
                  }}
                >
                  {diff === "all" ? "All" : diff}
                </button>
              ))}
            </div>

            {/* Results count */}
            {searchQuery && (
              <div style={{
                marginTop: '16px',
                fontSize: '13px',
                color: 'rgba(255, 166, 77, 0.7)'
              }}>
                Found {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Problem List */}
          {isLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
              <p>Loading problems...</p>
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#ef4444'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
              <p>{error}</p>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              backdropFilter: 'blur(16px) saturate(180%)',
              backgroundColor: 'rgba(10, 10, 10, 0.3)',
              border: '1px solid rgba(255, 107, 53, 0.15)',
              borderRadius: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>
                No problems found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255, 107, 53, 0.2)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '8px',
                  color: '#ffa64d',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {filteredProblems.map((problem, index) => (
                <div
                  key={problem._id}
                  onClick={() => handleProblemClick(problem.problemId)}
                  style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '24px',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    backgroundColor: 'rgba(10, 10, 10, 0.3)',
                    border: '1px solid rgba(255, 107, 53, 0.15)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.4)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Number Badge */}
                  <div style={{
                    flexShrink: 0,
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 107, 53, 0.15)',
                    border: '2px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '10px',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffa64d'
                  }}>
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                      gap: '12px'
                    }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#ffa64d',
                        margin: 0,
                        flex: 1
                      }}>
                        {problem.title}
                      </h3>
                      <span style={{
                        flexShrink: 0,
                        padding: '6px 14px',
                        backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
                        border: `1px solid ${getDifficultyColor(problem.difficulty)}50`,
                        borderRadius: '6px',
                        color: getDifficultyColor(problem.difficulty),
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <p style={{
                      color: 'rgba(255, 255, 255, 0.65)',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      marginBottom: '14px'
                    }}>
                      {problem.description.length > 180
                        ? problem.description.slice(0, 180) + '...'
                        : problem.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      {problem.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          style={{
                            padding: '5px 12px',
                            backgroundColor: 'rgba(255, 107, 53, 0.1)',
                            border: '1px solid rgba(255, 107, 53, 0.25)',
                            borderRadius: '6px',
                            color: 'rgba(255, 166, 77, 0.9)',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 107, 53, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#ffa64d',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      <span>Start Visualization</span>
                      <svg 
                        style={{ width: '16px', height: '16px' }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

          {/* ⭐ AI Generate Problem Modal */}
          {showAiModal && (
            <div
              onClick={closeAiModal}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                backgroundColor: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  background: 'linear-gradient(135deg, rgba(20,10,40,0.98), rgba(15,10,35,0.98))',
                  border: '2px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '24px',
                  padding: '36px',
                  boxShadow: '0 24px 80px rgba(168, 85, 247, 0.3)',
                  position: 'relative',
                }}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '28px' }}>✨</span>
                      <h2 style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                      }}>
                        Add Problem with AI
                      </h2>
                    </div>
                    <p style={{ color: 'rgba(200,180,255,0.6)', fontSize: '13px', margin: 0 }}>
                      GPT-4o will generate the full problem data automatically
                    </p>
                  </div>
                  {aiStep !== 'generating' && (
                    <button
                      onClick={closeAiModal}
                      style={{
                        background: 'rgba(168,85,247,0.15)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        borderRadius: '8px',
                        color: '#a855f7',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* ── FORM STEP ── */}
                {aiStep === 'form' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Platform Dropdown */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(200,180,255,0.8)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Platform
                      </label>
                      <select
                        value={aiForm.platform}
                        onChange={(e) => setAiForm({ ...aiForm, platform: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(30,15,60,0.8)',
                          border: '1px solid rgba(168,85,247,0.35)',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '14px',
                          outline: 'none',
                          cursor: 'pointer',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="leetcode">🟡 LeetCode</option>
                        <option value="codeforces">🔵 Codeforces</option>
                        <option value="ai">🤖 AI Generate</option>
                      </select>
                    </div>

                    {/* Problem Number */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(200,180,255,0.8)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        {aiForm.platform === 'codeforces' ? 'Contest ID + Index' : 'Problem Number'}
                        {' '}<span style={{ color: 'rgba(168,85,247,0.5)', fontWeight: '400', textTransform: 'none' }}>
                          {aiForm.platform === 'codeforces' ? '(e.g. 2211A or 2211)' : aiForm.platform === 'leetcode' ? '(e.g. 1, 115, 200)' : '(optional)'}
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder={aiForm.platform === 'codeforces' ? 'e.g. 2211A or 2211' : aiForm.platform === 'leetcode' ? 'e.g. 1, 115' : 'optional'}
                        value={aiForm.problemNumber}
                        onChange={(e) => setAiForm({ ...aiForm, problemNumber: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(30,15,60,0.8)',
                          border: '1px solid rgba(168,85,247,0.35)',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.7)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)'}
                      />
                    </div>

                    {/* Problem Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(200,180,255,0.8)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Problem Name
                        {' '}<span style={{ color: aiForm.platform === 'ai' ? '#ef4444' : 'rgba(168,85,247,0.5)', fontWeight: '400', textTransform: 'none', fontSize: '11px' }}>
                          {aiForm.platform === 'codeforces' ? '(optional, or index e.g. A)' : aiForm.platform === 'leetcode' ? '(e.g. two-sum or Two Sum)' : '*required'}
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder={aiForm.platform === 'codeforces' ? 'e.g. A (index) or leave empty' : aiForm.platform === 'leetcode' ? 'e.g. two-sum or Two Sum' : 'e.g. Binary Search, Merge Sort'}
                        value={aiForm.problemName}
                        onChange={(e) => setAiForm({ ...aiForm, problemName: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && aiForm.problemName.trim() && handleAiGenerate()}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(30,15,60,0.8)',
                          border: '1px solid rgba(168,85,247,0.35)',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.7)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)'}
                      />
                    </div>

                    {/* Info box */}
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(168,85,247,0.08)',
                      border: '1px solid rgba(168,85,247,0.2)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: 'rgba(200,180,255,0.6)',
                      lineHeight: '1.6',
                    }}>
                      {aiForm.platform === 'leetcode'
                        ? '🔍 Real data fetched from LeetCode API — enter problem number (e.g. 1) or name (e.g. two-sum)'
                        : aiForm.platform === 'codeforces'
                        ? '🔍 Real data fetched from Codeforces — enter contest+index like "2211A" in Problem Number'
                        : '🤖 AI generates everything from scratch — enter a clear problem name'
                      }
                    </div>

                    {/* Generate Button */}
                    <button
                      onClick={handleAiGenerate}
                      disabled={!aiForm.problemName.trim() && !aiForm.problemNumber.trim()}
                      style={{
                        padding: '14px',
                        background: (aiForm.problemName.trim() || aiForm.problemNumber.trim())
                          ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                          : 'rgba(80,60,100,0.4)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: (aiForm.problemName.trim() || aiForm.problemNumber.trim()) ? 'pointer' : 'not-allowed',
                        boxShadow: aiForm.problemName.trim() ? '0 6px 20px rgba(168,85,247,0.4)' : 'none',
                        transition: 'all 0.2s',
                        opacity: (aiForm.problemName.trim() || aiForm.problemNumber.trim()) ? 1 : 0.5,
                      }}
                      onMouseEnter={(e) => {
                        if (aiForm.problemName.trim() || aiForm.problemNumber.trim()) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(168,85,247,0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = aiForm.problemName.trim() ? '0 6px 20px rgba(168,85,247,0.4)' : 'none';
                      }}
                    >
                      ✨ Generate Problem
                    </button>
                  </div>
                )}

                {/* ── GENERATING STEP ── */}
                {aiStep === 'generating' && (
                  <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
                    {/* Spinner */}
                    <div style={{
                      width: '64px',
                      height: '64px',
                      border: '4px solid rgba(168,85,247,0.2)',
                      borderTop: '4px solid #a855f7',
                      borderRadius: '50%',
                      margin: '0 auto 24px',
                      animation: 'spin 1s linear infinite',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '10px' }}>
                      Generating "{aiForm.problemName}"...
                    </h3>
                    <p style={{ color: 'rgba(200,180,255,0.6)', fontSize: '13px', marginBottom: '24px', lineHeight: '1.6' }}>
                      GPT-4o is writing the problem description, solutions in 4 languages, and 3D visualization frames. This takes 15–30 seconds.
                    </p>

                    {/* Progress steps */}
                    {[
                      '📝 Writing problem description & examples',
                      '💻 Generating solutions (Python, JS, C++, Java)',
                      '🎓 Building tutorial frames',
                      '🎨 Creating 3D visualization data',
                      '💾 Saving to database',
                    ].map((step, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 0',
                        color: 'rgba(200,180,255,0.5)',
                        fontSize: '13px',
                        textAlign: 'left',
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'rgba(168,85,247,0.5)',
                          flexShrink: 0,
                          animation: `pulse ${1 + i * 0.3}s ease-in-out infinite`,
                        }} />
                        {step}
                      </div>
                    ))}
                    <style>{`@keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }`}</style>
                  </div>
                )}

                {/* ── SUCCESS STEP ── */}
                {aiStep === 'success' && aiResult && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#22c55e', marginBottom: '8px' }}>
                      Problem Added!
                    </h3>
                    <p style={{ color: 'rgba(200,255,200,0.6)', fontSize: '13px', marginBottom: '24px' }}>
                      Successfully generated and saved to your database
                    </p>

                    {/* Result card */}
                    <div style={{
                      background: 'rgba(34,197,94,0.08)',
                      border: '1px solid rgba(34,197,94,0.25)',
                      borderRadius: '14px',
                      padding: '20px',
                      marginBottom: '24px',
                      textAlign: 'left',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: 0 }}>
                          {aiResult.title}
                        </h4>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: aiResult.difficulty === 'Easy' ? '#22c55e' : aiResult.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                          background: aiResult.difficulty === 'Easy' ? 'rgba(34,197,94,0.15)' : aiResult.difficulty === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        }}>
                          {aiResult.difficulty}
                        </span>
                      </div>

                      {/* Tags */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                        {aiResult.tags?.map((tag: string) => (
                          <span key={tag} style={{
                            padding: '3px 8px',
                            background: 'rgba(168,85,247,0.15)',
                            border: '1px solid rgba(168,85,247,0.3)',
                            borderRadius: '6px',
                            fontSize: '11px',
                            color: '#c084fc',
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        {[
                          { label: 'Tutorial Frames', value: aiResult.tutorialFrames },
                          { label: 'Solution Frames', value: aiResult.solutionFrames },
                          { label: 'Languages', value: aiResult.languages?.length },
                        ].map(({ label, value }) => (
                          <div key={label} style={{
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '8px',
                            padding: '10px',
                            textAlign: 'center',
                          }}>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#a855f7' }}>{value}</div>
                            <div style={{ fontSize: '10px', color: 'rgba(200,180,255,0.5)', marginTop: '2px' }}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => navigate(`/problems/${aiResult.problemId}`)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          border: 'none',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(34,197,94,0.3)',
                        }}
                      >
                        ▶ View Problem
                      </button>
                      <button
                        onClick={() => { setAiStep('form'); setAiForm({ platform: 'leetcode', problemNumber: '', problemName: '' }); setAiResult(null); }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'rgba(168,85,247,0.15)',
                          border: '1px solid rgba(168,85,247,0.35)',
                          borderRadius: '10px',
                          color: '#a855f7',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✨ Add Another
                      </button>
                    </div>
                  </div>
                )}

                {/* ── ERROR STEP ── */}
                {aiStep === 'error' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚠️</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444', marginBottom: '10px' }}>
                      Generation Failed
                    </h3>
                    <div style={{
                      padding: '14px 16px',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: '10px',
                      fontSize: '13px',
                      color: 'rgba(255,180,180,0.8)',
                      marginBottom: '24px',
                      lineHeight: '1.6',
                      textAlign: 'left',
                    }}>
                      {aiError}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => setAiStep('form')}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                          border: 'none',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        ← Try Again
                      </button>
                      <button
                        onClick={closeAiModal}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'rgba(100,80,120,0.2)',
                          border: '1px solid rgba(168,85,247,0.2)',
                          borderRadius: '10px',
                          color: 'rgba(200,180,255,0.6)',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
      </div>
    </div>
  );
}