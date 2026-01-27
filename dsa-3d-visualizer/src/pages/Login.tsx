import { useState, useEffect, useRef } from "react";
import { login } from "../services/authService";
import * as THREE from "three";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 5;

    // Create Matrix Rain Effect with Algorithm Symbols
    const matrixChars = "01アルゴリズムDSA{}[]<>/\\+-*=";
    const particles: THREE.Sprite[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 64;
      canvas.height = 64;

      if (context) {
        context.fillStyle = "#00ffff";
        context.font = "48px monospace";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(
          matrixChars[Math.floor(Math.random() * matrixChars.length)],
          32,
          32
        );
      }

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.3,
      });

      const sprite = new THREE.Sprite(material);
      sprite.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      );
      sprite.scale.set(0.5, 0.5, 0.5);

      particles.push(sprite);
      scene.add(sprite);
    }

    // Create Glowing Pyramid/Algorithm Structure
    const pyramidGeometry = new THREE.ConeGeometry(1.5, 3, 4);
    const pyramidEdges = new THREE.EdgesGeometry(pyramidGeometry);
    const pyramidLine = new THREE.LineSegments(
      pyramidEdges,
      new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 })
    );
    pyramidLine.position.set(0, 0, -2);
    scene.add(pyramidLine);

    // Create Orbiting Rings
    const ringGeometry = new THREE.TorusGeometry(2, 0.05, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.position.z = -2;
    ring2.position.z = -2;
    ring2.rotation.y = Math.PI / 2;
    scene.add(ring1, ring2);

    // Particle system for floating dots
    const dotGeometry = new THREE.BufferGeometry();
    const dotCount = 200;
    const positions = new Float32Array(dotCount * 3);

    for (let i = 0; i < dotCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 30;
    }

    dotGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dotMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const dots = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dots);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      pyramidLine.rotation.y += 0.005;
      pyramidLine.rotation.x += 0.002;

      ring1.rotation.x += 0.01;
      ring2.rotation.z += 0.01;

      particles.forEach((particle, i) => {
        particle.position.y -= 0.02;
        particle.rotation.z += 0.01;

        if (particle.position.y < -10) {
          particle.position.y = 10;
          particle.position.x = (Math.random() - 0.5) * 20;
        }

        particle.position.x += Math.sin(Date.now() * 0.001 + i) * 0.002;
      });

      dots.rotation.y += 0.0005;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await login(form);
      
      if (res.token) {
        localStorage.setItem("token", res.token);
        alert("Login successful 🚀");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      backgroundColor: '#0a0a0a',
      display: 'flex'
    }}>
      {/* Three.js Canvas Background - Left Side */}
      <canvas
        ref={canvasRef}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          zIndex: 0
        }}
      />

      {/* Gradient Overlays */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, transparent 50%, rgba(168, 85, 247, 0.05) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Vignette effect on the right to fade animation */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, transparent 0%, transparent 40%, #0a0a0a 70%)',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Login Form Container - Right Side */}
      <div style={{
        position: 'relative',
        marginLeft: 'auto',
        width: '100%',
        maxWidth: '500px',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        zIndex: 10
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Card with glassmorphism effect */}
          <div style={{
            position: 'relative',
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(26, 26, 26, 0.7)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.25)',
            padding: '48px',
            overflow: 'hidden'
          }}>
            
            {/* Glow Border Effect */}
            <div style={{
              position: 'absolute',
              inset: '-1px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), transparent, rgba(168, 85, 247, 0.2))',
              borderRadius: '24px',
              zIndex: -1,
              filter: 'blur(4px)'
            }} />
            
            <div style={{ position: 'relative' }}>
              {/* Header Section */}
              <div style={{ marginBottom: '40px' }}>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  letterSpacing: '-0.025em',
                  marginBottom: '12px',
                  background: 'linear-gradient(to right, white, rgb(165, 243, 252), white)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Welcome Back
                </h1>
                <p style={{
                  color: 'rgba(103, 232, 249, 0.6)',
                  fontSize: '14px',
                  letterSpacing: '0.025em'
                }}>
                  Enter your credentials to continue
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '12px',
                  color: 'rgb(252, 165, 165)',
                  fontSize: '14px',
                  textAlign: 'center',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <svg style={{ width: '16px', height: '16px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '16px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>
                    <svg style={{ width: '20px', height: '20px', color: 'rgba(6, 182, 212, 0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      paddingRight: '20px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      backgroundColor: 'rgba(42, 42, 42, 0.6)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(6, 182, 212, 0.6)';
                      e.target.style.backgroundColor = 'rgba(42, 42, 42, 0.8)';
                      e.target.style.boxShadow = '0 0 20px rgba(34, 211, 238, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                      e.target.style.backgroundColor = 'rgba(42, 42, 42, 0.6)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Password Input */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '16px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>
                    <svg style={{ width: '20px', height: '20px', color: 'rgba(6, 182, 212, 0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      paddingRight: '20px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      backgroundColor: 'rgba(42, 42, 42, 0.6)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(6, 182, 212, 0.6)';
                      e.target.style.backgroundColor = 'rgba(42, 42, 42, 0.8)';
                      e.target.style.boxShadow = '0 0 20px rgba(34, 211, 238, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                      e.target.style.backgroundColor = 'rgba(42, 42, 42, 0.6)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Forgot Password Link */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  paddingTop: '4px',
                  marginBottom: '24px'
                }}>
                  <a
                    href="#"
                    style={{
                      fontSize: '14px',
                      color: 'rgba(6, 182, 212, 0.8)',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'rgb(103, 232, 249)';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(6, 182, 212, 0.8)';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    position: 'relative',
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(to right, rgb(6, 182, 212), rgb(34, 211, 238))',
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '16px',
                    opacity: isLoading ? 0.5 : 1,
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(34, 211, 238, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg style={{ animation: 'spin 1s linear infinite', height: '20px', width: '20px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div style={{ 
                position: 'relative', 
                margin: '32px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '100%',
                    borderTop: '1px solid rgba(6, 182, 212, 0.2)'
                  }} />
                </div>
                <span style={{
                  position: 'relative',
                  padding: '0 16px',
                  backgroundColor: 'rgba(26, 26, 26, 0.9)',
                  color: 'rgb(107, 114, 128)',
                  fontSize: '14px'
                }}>
                  New here?
                </span>
              </div>

              {/* Sign Up Link */}
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  color: 'rgb(156, 163, 175)',
                  fontSize: '14px',
                  margin: 0
                }}>
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    style={{
                      color: 'rgb(6, 182, 212)',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'rgb(103, 232, 249)';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgb(6, 182, 212)';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Create Account
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Tagline */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            color: 'rgb(75, 85, 99)',
            fontSize: '12px',
            letterSpacing: '0.05em'
          }}>
            Secured by advanced encryption
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '160px',
        height: '160px',
        borderTop: '2px solid rgba(6, 182, 212, 0.2)',
        borderLeft: '2px solid rgba(6, 182, 212, 0.2)',
        borderTopLeftRadius: '24px',
        pointerEvents: 'none',
        zIndex: 3
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '160px',
        height: '160px',
        borderBottom: '2px solid rgba(6, 182, 212, 0.2)',
        borderRight: '2px solid rgba(6, 182, 212, 0.2)',
        borderBottomRightRadius: '24px',
        pointerEvents: 'none',
        zIndex: 3
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        borderTop: '1px solid rgba(6, 182, 212, 0.1)',
        borderRight: '1px solid rgba(6, 182, 212, 0.1)',
        borderTopRightRadius: '16px',
        pointerEvents: 'none',
        zIndex: 3
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '80px',
        height: '80px',
        borderBottom: '1px solid rgba(6, 182, 212, 0.1)',
        borderLeft: '1px solid rgba(6, 182, 212, 0.1)',
        borderBottomLeftRadius: '16px',
        pointerEvents: 'none',
        zIndex: 3
      }} />

      {/* Animation Keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgb(107, 114, 128);
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}