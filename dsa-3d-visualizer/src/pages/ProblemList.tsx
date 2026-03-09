// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout, getToken } from "../services/authService";
// import * as THREE from "three";

// interface Problem {
//   _id: string;
//   problemId: string;
//   title: string;
//   difficulty: "Easy" | "Medium" | "Hard";
//   tags: string[];
//   description: string;
// }

// export default function ProblemList() {
//   const navigate = useNavigate();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [problems, setProblems] = useState<Problem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
//   const [searchQuery, setSearchQuery] = useState("");

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

//   // Fetch problems from API
//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         setIsLoading(true);
//         const query = selectedDifficulty !== "all" ? `?difficulty=${selectedDifficulty}` : "";
//         const response = await fetch(`http://localhost:5000/api/problems${query}`);
//         const data = await response.json();

//         if (data.success) {
//           setProblems(data.data);
//         } else {
//           setError("Failed to load problems");
//         }
//       } catch (err) {
//         setError("Error connecting to server");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProblems();
//   }, [selectedDifficulty]);

//   const handleLogout = () => {
//     logout();
//   };

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
//             <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
//               <button
//                 onClick={() => navigate('/home')}
//                 style={{
//                   padding: '8px 16px',
//                   backgroundColor: 'rgba(255, 107, 53, 0.2)',
//                   border: '1px solid rgba(255, 107, 53, 0.3)',
//                   borderRadius: '8px',
//                   color: '#ffa64d',
//                   fontSize: '14px',
//                   cursor: 'pointer',
//                   transition: 'all 0.2s'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.3)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
//                 }}
//               >
//                 ← Back to Home
//               </button>
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
//                 boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
//               }}
//             >
//               Logout
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
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useRef } from "react";
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

export default function ProblemList() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Fetch problems from API
  useEffect(() => {
    const fetchProblems = async () => {
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
    };

    fetchProblems();
  }, [selectedDifficulty]);

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
      </div>
    </div>
  );
}