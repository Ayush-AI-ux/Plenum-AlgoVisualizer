import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../services/authService";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import * as THREE from "three";

// Your Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    // Create Matrix Rain Effect
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

    // Create Pyramid
    const pyramidGeometry = new THREE.ConeGeometry(1.5, 3, 4);
    const pyramidEdges = new THREE.EdgesGeometry(pyramidGeometry);
    const pyramidLine = new THREE.LineSegments(
      pyramidEdges,
      new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 })
    );
    pyramidLine.position.set(0, 0, -2);
    scene.add(pyramidLine);

    // Create Rings
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

    // Particle dots
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

    // Animation
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
        // ⭐ Navigate to home instead of alert
        navigate("/home");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setIsLoading(true);

    try {
      const res = await googleLogin(credentialResponse.credential);
      
      if (res.token) {
        localStorage.setItem("token", res.token);
        // ⭐ Navigate to home instead of alert
        navigate("/home");
      } else {
        setError(res.message || "Google login failed");
      }
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
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
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: -300, 
          width: '100%', 
          height: '100%',
          zIndex: 0
        }}
      />

      {/* Overlays */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, transparent 50%, rgba(168, 85, 247, 0.05) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, transparent 0%, transparent 40%, #0a0a0a 70%)',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Form Container */}
      <div style={{
        position: 'relative',
        marginLeft: 'auto',
        width: '100%',
        maxWidth: '800px',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        zIndex: 10
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
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
            
            <div style={{
              position: 'absolute',
              inset: '-1px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), transparent, rgba(168, 85, 247, 0.2))',
              borderRadius: '24px',
              zIndex: -1,
              filter: 'blur(4px)'
            }} />
            
            <div style={{ position: 'relative' }}>
              {/* Header */}
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

              {/* Google Button */}
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>

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
                  OR
                </span>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '12px',
                  color: 'rgb(252, 165, 165)',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                    style={{
                      width: '100%',
                      padding: '16px 20px 16px 48px',
                      backgroundColor: 'rgba(42, 42, 42, 0.6)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <svg style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: 'rgba(6, 182, 212, 0.5)'
                  }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>

                {/* Password */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    style={{
                      width: '100%',
                      padding: '16px 48px 16px 48px',
                      backgroundColor: 'rgba(42, 42, 42, 0.6)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <svg style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: 'rgba(6, 182, 212, 0.5)'
                  }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(6, 182, 212, 0.5)'
                    }}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                {/* Forgot Password */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                  <a
                    href="/forgot-password"
                    style={{
                      fontSize: '14px',
                      color: 'rgba(6, 182, 212, 0.8)',
                      textDecoration: 'none'
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
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(to right, rgb(6, 182, 212), rgb(34, 211, 238))',
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase',
                    fontSize: '16px',
                    opacity: isLoading ? 0.5 : 1
                  }}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </button>
              </form>

              {/* Signup Link */}
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <p style={{ color: 'rgb(156, 163, 175)', fontSize: '14px', margin: 0 }}>
                  Don't have an account?{" "}
                  <a href="/signup" style={{ color: 'rgb(6, 182, 212)', fontWeight: '600', textDecoration: 'none' }}>
                    Create Account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgb(107, 114, 128); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}