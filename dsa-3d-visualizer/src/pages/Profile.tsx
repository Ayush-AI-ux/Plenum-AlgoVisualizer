// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getToken, logout } from "../services/authService";

// interface UserData {
//   name: string;
//   email: string;
//   avatar?: string;
//   googleId?: string;
//   createdAt: string;
// }

// export default function Profile() {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedName, setEditedName] = useState("");

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     fetchUserData();
//   }, [navigate]);

//   const fetchUserData = async () => {
//     try {
//       setIsLoading(true);
//       const token = getToken();
//       const response = await fetch("http://localhost:5000/api/auth/me", {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           logout();
//           return;
//         }
//         throw new Error("Failed to fetch user data");
//       }

//       const data = await response.json();
//       console.log("Profile data:", data);
      
//       if (data.success && data.data) {
//         setUserData(data.data);
//         setEditedName(data.data.name);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       const token = getToken();
//       const response = await fetch("http://localhost:5000/api/auth/update-profile", {
//         method: "PUT",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: editedName }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUserData(data.data);
//         setIsEditing(false);
//         alert("Profile updated successfully!");
//       } else {
//         alert("Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Error updating profile");
//     }
//   };

//   const getUserInitials = (name?: string) => {
//     if (!name) return "U";
//     const parts = name.split(" ");
//     if (parts.length >= 2) {
//       return (parts[0][0] + parts[1][0]).toUpperCase();
//     }
//     return name[0].toUpperCase();
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   if (isLoading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           backgroundColor: "#000000",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               fontSize: "48px",
//               marginBottom: "16px",
//               animation: "spin 1s linear infinite",
//             }}
//           >
//             ⏳
//           </div>
//           <p style={{ color: "#ffa64d", fontSize: "18px" }}>Loading profile...</p>
//         </div>
//         <style>
//           {`
//             @keyframes spin {
//               from { transform: rotate(0deg); }
//               to { transform: rotate(360deg); }
//             }
//           `}
//         </style>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         backgroundColor: "#000000",
//         backgroundImage:
//           "radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 140, 66, 0.05) 0%, transparent 50%)",
//         padding: "20px",
//       }}
//     >
//       <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "40px",
//           }}
//         >
//           <button
//             onClick={() => navigate("/")}
//             style={{
//               padding: "12px 24px",
//               background: "rgba(255, 107, 53, 0.1)",
//               border: "1px solid rgba(255, 107, 53, 0.3)",
//               borderRadius: "8px",
//               color: "#ffa64d",
//               fontSize: "14px",
//               cursor: "pointer",
//               fontWeight: "600",
//               transition: "all 0.3s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "rgba(255, 107, 53, 0.2)";
//               e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.5)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
//               e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.3)";
//             }}
//           >
//             ← Back to Home
//           </button>

//           <h1
//             style={{
//               fontSize: "32px",
//               fontWeight: "bold",
//               background: "linear-gradient(135deg, #ff6b35, #ffa64d)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               margin: 0,
//             }}
//           >
//             My Profile
//           </h1>

//           <div style={{ width: "140px" }} /> {/* Spacer for centering */}
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 2fr",
//             gap: "32px",
//           }}
//         >
//           {/* Left Column - Profile Card */}
//           <div
//             style={{
//               backdropFilter: "blur(20px) saturate(180%)",
//               backgroundColor: "rgba(10, 10, 10, 0.6)",
//               border: "1px solid rgba(255, 107, 53, 0.3)",
//               borderRadius: "16px",
//               padding: "40px",
//               textAlign: "center",
//               boxShadow: "0 8px 32px rgba(255, 107, 53, 0.1)",
//             }}
//           >
//             {/* Avatar */}
//             <div
//               style={{
//                 width: "150px",
//                 height: "150px",
//                 borderRadius: "50%",
//                 background: userData?.avatar
//                   ? `url(${userData.avatar}) center/cover`
//                   : "linear-gradient(135deg, #ff6b35, #ff8c42)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "48px",
//                 fontWeight: "700",
//                 color: "white",
//                 margin: "0 auto 24px",
//                 border: "4px solid rgba(255, 107, 53, 0.5)",
//                 boxShadow: "0 8px 32px rgba(255, 107, 53, 0.3)",
//               }}
//             >
//               {!userData?.avatar && getUserInitials(userData?.name)}
//             </div>

//             {/* Name */}
//             {!isEditing ? (
//               <div>
//                 <h2
//                   style={{
//                     fontSize: "28px",
//                     fontWeight: "700",
//                     color: "#ffffff",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   {userData?.name || "User"}
//                 </h2>
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   style={{
//                     padding: "8px 16px",
//                     background: "transparent",
//                     border: "1px solid rgba(255, 107, 53, 0.3)",
//                     borderRadius: "6px",
//                     color: "#ffa64d",
//                     fontSize: "12px",
//                     cursor: "pointer",
//                     marginTop: "8px",
//                   }}
//                 >
//                   ✏️ Edit Name
//                 </button>
//               </div>
//             ) : (
//               <div>
//                 <input
//                   type="text"
//                   value={editedName}
//                   onChange={(e) => setEditedName(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "12px",
//                     background: "rgba(255, 255, 255, 0.05)",
//                     border: "1px solid rgba(255, 107, 53, 0.3)",
//                     borderRadius: "8px",
//                     color: "#ffffff",
//                     fontSize: "16px",
//                     marginBottom: "12px",
//                     textAlign: "center",
//                   }}
//                 />
//                 <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
//                   <button
//                     onClick={handleUpdateProfile}
//                     style={{
//                       padding: "8px 16px",
//                       background: "linear-gradient(135deg, #ff6b35, #ff8c42)",
//                       border: "none",
//                       borderRadius: "6px",
//                       color: "white",
//                       fontSize: "12px",
//                       cursor: "pointer",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ✓ Save
//                   </button>
//                   <button
//                     onClick={() => {
//                       setIsEditing(false);
//                       setEditedName(userData?.name || "");
//                     }}
//                     style={{
//                       padding: "8px 16px",
//                       background: "transparent",
//                       border: "1px solid rgba(255, 107, 53, 0.3)",
//                       borderRadius: "6px",
//                       color: "#ffa64d",
//                       fontSize: "12px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     ✗ Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Email */}
//             <p
//               style={{
//                 color: "rgba(255, 166, 77, 0.7)",
//                 fontSize: "14px",
//                 marginTop: "16px",
//               }}
//             >
//               {userData?.email}
//             </p>

//             {/* Account Type Badge */}
//             <div
//               style={{
//                 marginTop: "24px",
//                 padding: "8px 16px",
//                 background: userData?.googleId
//                   ? "rgba(234, 67, 53, 0.15)"
//                   : "rgba(255, 107, 53, 0.15)",
//                 border: `1px solid ${userData?.googleId ? "rgba(234, 67, 53, 0.3)" : "rgba(255, 107, 53, 0.3)"}`,
//                 borderRadius: "8px",
//                 display: "inline-block",
//               }}
//             >
//               <span style={{ fontSize: "16px", marginRight: "8px" }}>
//                 {userData?.googleId ? "🔗" : "📧"}
//               </span>
//               <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600" }}>
//                 {userData?.googleId ? "Google Account" : "Email Account"}
//               </span>
//             </div>

//             {/* Member Since */}
//             <div
//               style={{
//                 marginTop: "32px",
//                 paddingTop: "24px",
//                 borderTop: "1px solid rgba(255, 107, 53, 0.2)",
//               }}
//             >
//               <p
//                 style={{
//                   color: "rgba(255, 255, 255, 0.5)",
//                   fontSize: "12px",
//                   marginBottom: "4px",
//                 }}
//               >
//                 Member Since
//               </p>
//               <p
//                 style={{
//                   color: "#ffa64d",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   margin: 0,
//                 }}
//               >
//                 {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}
//               </p>
//             </div>
//           </div>

//           {/* Right Column - Details & Stats */}
//           <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
//             {/* Account Information */}
//             <div
//               style={{
//                 backdropFilter: "blur(20px) saturate(180%)",
//                 backgroundColor: "rgba(10, 10, 10, 0.6)",
//                 border: "1px solid rgba(255, 107, 53, 0.3)",
//                 borderRadius: "16px",
//                 padding: "32px",
//                 boxShadow: "0 8px 32px rgba(255, 107, 53, 0.1)",
//               }}
//             >
//               <h3
//                 style={{
//                   fontSize: "20px",
//                   fontWeight: "700",
//                   background: "linear-gradient(135deg, #ff8c42, #ffa64d)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   marginBottom: "24px",
//                 }}
//               >
//                 Account Information
//               </h3>

//               <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//                 <div>
//                   <p
//                     style={{
//                       color: "rgba(255, 255, 255, 0.5)",
//                       fontSize: "12px",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Full Name
//                   </p>
//                   <p
//                     style={{
//                       color: "#ffffff",
//                       fontSize: "16px",
//                       fontWeight: "600",
//                       margin: 0,
//                     }}
//                   >
//                     {userData?.name || "N/A"}
//                   </p>
//                 </div>

//                 <div>
//                   <p
//                     style={{
//                       color: "rgba(255, 255, 255, 0.5)",
//                       fontSize: "12px",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Email Address
//                   </p>
//                   <p
//                     style={{
//                       color: "#ffffff",
//                       fontSize: "16px",
//                       fontWeight: "600",
//                       margin: 0,
//                     }}
//                   >
//                     {userData?.email || "N/A"}
//                   </p>
//                 </div>

//                 <div>
//                   <p
//                     style={{
//                       color: "rgba(255, 255, 255, 0.5)",
//                       fontSize: "12px",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Account Type
//                   </p>
//                   <p
//                     style={{
//                       color: "#ffffff",
//                       fontSize: "16px",
//                       fontWeight: "600",
//                       margin: 0,
//                     }}
//                   >
//                     {userData?.googleId ? "Google OAuth" : "Email & Password"}
//                   </p>
//                 </div>

//                 {userData?.googleId && (
//                   <div>
//                     <p
//                       style={{
//                         color: "rgba(255, 255, 255, 0.5)",
//                         fontSize: "12px",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       Google ID
//                     </p>
//                     <p
//                       style={{
//                         color: "#ffffff",
//                         fontSize: "14px",
//                         fontFamily: "monospace",
//                         margin: 0,
//                       }}
//                     >
//                       {userData.googleId}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Learning Stats */}
//             <div
//               style={{
//                 backdropFilter: "blur(20px) saturate(180%)",
//                 backgroundColor: "rgba(10, 10, 10, 0.6)",
//                 border: "1px solid rgba(255, 107, 53, 0.3)",
//                 borderRadius: "16px",
//                 padding: "32px",
//                 boxShadow: "0 8px 32px rgba(255, 107, 53, 0.1)",
//               }}
//             >
//               <h3
//                 style={{
//                   fontSize: "20px",
//                   fontWeight: "700",
//                   background: "linear-gradient(135deg, #ff8c42, #ffa64d)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   marginBottom: "24px",
//                 }}
//               >
//                 Learning Progress
//               </h3>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, 1fr)",
//                   gap: "16px",
//                 }}
//               >
//                 {[
//                   { label: "Problems Solved", value: "0", icon: "✅" },
//                   { label: "Hours Learned", value: "0", icon: "⏱️" },
//                   { label: "Streak Days", value: "0", icon: "🔥" },
//                 ].map((stat, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       padding: "20px",
//                       background: "rgba(20, 20, 20, 0.4)",
//                       borderRadius: "12px",
//                       border: "1px solid rgba(255, 107, 53, 0.2)",
//                       textAlign: "center",
//                     }}
//                   >
//                     <div style={{ fontSize: "32px", marginBottom: "8px" }}>
//                       {stat.icon}
//                     </div>
//                     <p
//                       style={{
//                         color: "#ffa64d",
//                         fontSize: "24px",
//                         fontWeight: "700",
//                         margin: "0 0 4px 0",
//                       }}
//                     >
//                       {stat.value}
//                     </p>
//                     <p
//                       style={{
//                         color: "rgba(255, 255, 255, 0.6)",
//                         fontSize: "12px",
//                         margin: 0,
//                       }}
//                     >
//                       {stat.label}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div
//               style={{
//                 backdropFilter: "blur(20px) saturate(180%)",
//                 backgroundColor: "rgba(10, 10, 10, 0.6)",
//                 border: "1px solid rgba(255, 107, 53, 0.3)",
//                 borderRadius: "16px",
//                 padding: "32px",
//                 boxShadow: "0 8px 32px rgba(255, 107, 53, 0.1)",
//               }}
//             >
//               <h3
//                 style={{
//                   fontSize: "20px",
//                   fontWeight: "700",
//                   background: "linear-gradient(135deg, #ff8c42, #ffa64d)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   marginBottom: "24px",
//                 }}
//               >
//                 Quick Actions
//               </h3>

//               <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//                 <button
//                   onClick={() => navigate("/problems")}
//                   style={{
//                     padding: "16px 20px",
//                     background: "rgba(255, 107, 53, 0.1)",
//                     border: "1px solid rgba(255, 107, 53, 0.3)",
//                     borderRadius: "8px",
//                     color: "#ffffff",
//                     fontSize: "14px",
//                     cursor: "pointer",
//                     textAlign: "left",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                     transition: "all 0.3s",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = "rgba(255, 107, 53, 0.2)";
//                     e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.5)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
//                     e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.3)";
//                   }}
//                 >
//                   <span style={{ fontSize: "20px" }}>📚</span>
//                   <span>Browse Problems</span>
//                 </button>

//                 <button
//                   onClick={() => navigate("/settings")}
//                   style={{
//                     padding: "16px 20px",
//                     background: "rgba(255, 107, 53, 0.1)",
//                     border: "1px solid rgba(255, 107, 53, 0.3)",
//                     borderRadius: "8px",
//                     color: "#ffffff",
//                     fontSize: "14px",
//                     cursor: "pointer",
//                     textAlign: "left",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                     transition: "all 0.3s",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = "rgba(255, 107, 53, 0.2)";
//                     e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.5)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
//                     e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.3)";
//                   }}
//                 >
//                   <span style={{ fontSize: "20px" }}>⚙️</span>
//                   <span>Account Settings</span>
//                 </button>

//                 <button
//                   onClick={logout}
//                   style={{
//                     padding: "16px 20px",
//                     background: "rgba(239, 68, 68, 0.1)",
//                     border: "1px solid rgba(239, 68, 68, 0.3)",
//                     borderRadius: "8px",
//                     color: "#ff5733",
//                     fontSize: "14px",
//                     cursor: "pointer",
//                     textAlign: "left",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                     fontWeight: "600",
//                     transition: "all 0.3s",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
//                     e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
//                     e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
//                   }}
//                 >
//                   <span style={{ fontSize: "20px" }}>🚪</span>
//                   <span>Logout</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, logout } from "../services/authService";
import * as THREE from "three";

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  createdAt: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  // Three.js Background Animation
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

    // Create floating cubes
    const cubes: THREE.Mesh[] = [];
    for (let i = 0; i < 15; i++) {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xff6b35 : 0xff8c42,
        emissive: i % 2 === 0 ? 0xff6b35 : 0xff8c42,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.3,
      });
      const cube = new THREE.Mesh(geometry, material);
      
      cube.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30
      );
      
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      cubes.push(cube);
      scene.add(cube);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6b35, 1.5, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffa64d, 1, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      cubes.forEach((cube, i) => {
        cube.rotation.x += 0.003 + i * 0.0001;
        cube.rotation.y += 0.003 + i * 0.0001;
        
        // Floating motion
        cube.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
      });

      pointLight1.position.x = Math.sin(Date.now() * 0.001) * 15;
      pointLight1.position.z = Math.cos(Date.now() * 0.001) * 15;

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
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setUserData(data.data);
        setEditedName(data.data.name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editedName.trim()) {
      alert("Name cannot be empty");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedName }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              animation: "spin 1s linear infinite",
            }}
          >
            ⏳
          </div>
          <p style={{ color: "#ffa64d", fontSize: "18px" }}>Loading profile...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

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
      {/* 3D Background Canvas */}
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

      {/* Content Overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100vh",
          overflowY: "auto",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              background: "rgba(255, 107, 53, 0.15)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 107, 53, 0.3)",
              borderRadius: "12px",
              color: "#ffa64d",
              fontSize: "15px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "40px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 107, 53, 0.25)";
              e.currentTarget.style.transform = "translateX(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 107, 53, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 107, 53, 0.15)";
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>

          {/* Main Content Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "32px",
            }}
          >
            {/* Left Column - Profile Card */}
            <div
              style={{
                backdropFilter: "blur(20px) saturate(180%)",
                backgroundColor: "rgba(10, 10, 10, 0.8)",
                border: "2px solid rgba(255, 107, 53, 0.3)",
                borderRadius: "24px",
                padding: "40px",
                boxShadow: "0 20px 60px rgba(255, 107, 53, 0.2)",
                height: "fit-content",
                position: "sticky",
                top: "20px",
              }}
            >
              {/* Avatar with 3D effect */}
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  background: userData?.avatar
                    ? `url(${userData.avatar}) center/cover`
                    : "linear-gradient(135deg, #ff6b35, #ff8c42)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "64px",
                  fontWeight: "700",
                  color: "white",
                  margin: "0 auto 32px",
                  border: "4px solid rgba(255, 107, 53, 0.5)",
                  boxShadow: "0 20px 60px rgba(255, 107, 53, 0.4), inset 0 -20px 40px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                {!userData?.avatar && getUserInitials(userData?.name)}
                
                {/* Glow ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: "-20px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255, 107, 53, 0.2), transparent 70%)",
                    filter: "blur(20px)",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Name Section */}
              <div style={{ textAlign: "center" }}>
                {!isEditing ? (
                  <>
                    <h1
                      style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: "12px",
                        textShadow: "0 4px 20px rgba(255, 107, 53, 0.5)",
                      }}
                    >
                      {userData?.name || "User"}
                    </h1>
                    <p
                      style={{
                        color: "rgba(255, 166, 77, 0.8)",
                        fontSize: "15px",
                        marginBottom: "24px",
                      }}
                    >
                      {userData?.email}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        padding: "12px 24px",
                        background: "rgba(255, 107, 53, 0.2)",
                        border: "2px solid rgba(255, 107, 53, 0.4)",
                        borderRadius: "10px",
                        color: "#ffa64d",
                        fontSize: "14px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 0.3s",
                        backdropFilter: "blur(10px)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 107, 53, 0.3)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 107, 53, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 107, 53, 0.2)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      ✏️ Edit Name
                    </button>
                  </>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter your name"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        background: "rgba(0, 0, 0, 0.5)",
                        border: "2px solid rgba(255, 107, 53, 0.5)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        fontSize: "16px",
                        marginBottom: "16px",
                        outline: "none",
                        textAlign: "center",
                      }}
                    />
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <button
                        onClick={handleUpdateProfile}
                        style={{
                          padding: "10px 20px",
                          background: "linear-gradient(135deg, #ff6b35, #ff8c42)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                          fontSize: "13px",
                          cursor: "pointer",
                          fontWeight: "600",
                          boxShadow: "0 4px 15px rgba(255, 107, 53, 0.4)",
                        }}
                      >
                        ✓ Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedName(userData?.name || "");
                        }}
                        style={{
                          padding: "10px 20px",
                          background: "rgba(255, 107, 53, 0.1)",
                          border: "1px solid rgba(255, 107, 53, 0.3)",
                          borderRadius: "8px",
                          color: "#ffa64d",
                          fontSize: "13px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        ✗ Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Badge */}
              <div
                style={{
                  marginTop: "32px",
                  padding: "12px 20px",
                  background: userData?.googleId
                    ? "rgba(234, 67, 53, 0.2)"
                    : "rgba(255, 107, 53, 0.2)",
                  border: `2px solid ${userData?.googleId ? "rgba(234, 67, 53, 0.4)" : "rgba(255, 107, 53, 0.4)"}`,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span style={{ fontSize: "20px" }}>
                  {userData?.googleId ? "🔗" : "📧"}
                </span>
                <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600" }}>
                  {userData?.googleId ? "Google Account" : "Email & Password"}
                </span>
              </div>

              {/* Member Since */}
              <div
                style={{
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(255, 107, 53, 0.2)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "12px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Member Since
                </p>
                <p
                  style={{
                    color: "#ffa64d",
                    fontSize: "16px",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}
                </p>
              </div>
            </div>

            {/* Right Column - Info & Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Account Information Card */}
              <div
                style={{
                  backdropFilter: "blur(20px) saturate(180%)",
                  backgroundColor: "rgba(10, 10, 10, 0.8)",
                  border: "2px solid rgba(255, 107, 53, 0.3)",
                  borderRadius: "24px",
                  padding: "40px",
                  boxShadow: "0 20px 60px rgba(255, 107, 53, 0.2)",
                }}
              >
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #ff8c42, #ffa64d)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "32px",
                  }}
                >
                  Account Information
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "24px",
                  }}
                >
                  {/* Info Cards */}
                  {[
                    { icon: "👤", label: "Full Name", value: userData?.name || "N/A" },
                    { icon: "📧", label: "Email Address", value: userData?.email || "N/A" },
                    { icon: "🔐", label: "Account Type", value: userData?.googleId ? "Google OAuth" : "Email & Password" },
                    { icon: "📅", label: "Joined", value: userData?.createdAt ? formatDate(userData.createdAt) : "N/A" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "24px",
                        background: "rgba(20, 20, 20, 0.6)",
                        borderRadius: "16px",
                        border: "1px solid rgba(255, 107, 53, 0.2)",
                        transition: "all 0.3s",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.5)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 107, 53, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.2)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
                      <p
                        style={{
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: "11px",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          color: "#ffffff",
                          fontSize: "15px",
                          fontWeight: "600",
                          margin: 0,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Card */}
              <div
                style={{
                  backdropFilter: "blur(20px) saturate(180%)",
                  backgroundColor: "rgba(10, 10, 10, 0.8)",
                  border: "2px solid rgba(255, 107, 53, 0.3)",
                  borderRadius: "24px",
                  padding: "40px",
                  boxShadow: "0 20px 60px rgba(255, 107, 53, 0.2)",
                }}
              >
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #ff8c42, #ffa64d)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "24px",
                  }}
                >
                  Quick Actions
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  <button
                    onClick={() => navigate("/problems")}
                    style={{
                      padding: "24px",
                      background: "rgba(255, 107, 53, 0.1)",
                      border: "2px solid rgba(255, 107, 53, 0.3)",
                      borderRadius: "16px",
                      color: "#ffffff",
                      fontSize: "14px",
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: "600",
                      transition: "all 0.3s",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 107, 53, 0.2)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 107, 53, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>📚</div>
                    <div>Browse Problems</div>
                  </button>

                  <button
                    onClick={() => navigate("/settings")}
                    style={{
                      padding: "24px",
                      background: "rgba(255, 107, 53, 0.1)",
                      border: "2px solid rgba(255, 107, 53, 0.3)",
                      borderRadius: "16px",
                      color: "#ffffff",
                      fontSize: "14px",
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: "600",
                      transition: "all 0.3s",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 107, 53, 0.2)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 107, 53, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 107, 53, 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚙️</div>
                    <div>Settings</div>
                  </button>

                  <button
                    onClick={logout}
                    style={{
                      padding: "24px",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "2px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: "16px",
                      color: "#ff5733",
                      fontSize: "14px",
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: "600",
                      transition: "all 0.3s",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 30px rgba(239, 68, 68, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>🚪</div>
                    <div>Logout</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
          }
        `}
      </style>
    </div>
  );
}