import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import * as THREE from "three";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

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
        if (particle.position.y < -10) {
          particle.position.y = 10;
          particle.position.x = (Math.random() - 0.5) * 20;
        }
        particle.position.x += Math.sin(Date.now() * 0.001 + i) * 0.002;
      });

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
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPassword(token, form.password);
      
      if (res.success) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(res.message || "Failed to reset password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
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
      {/* Three.js Canvas Background */}
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

      {/* Gradient Overlays */}
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
                  New Password
                </h1>
                <p style={{
                  color: 'rgba(103, 232, 249, 0.6)',
                  fontSize: '14px',
                  letterSpacing: '0.025em'
                }}>
                  Enter your new password below
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

              {/* Success Message */}
              {success && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '12px',
                  color: 'rgb(167, 243, 208)',
                  fontSize: '14px',
                  textAlign: 'center',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <svg style={{ width: '16px', height: '16px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
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
                    placeholder="New Password"
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

                {/* Confirm Password Input */}
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '16px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>
                    <svg style={{ width: '20px', height: '20px', color: 'rgba(6, 182, 212, 0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm New Password"
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

                <button
                  type="submit"
                  disabled={isLoading || !token}
                  style={{
                    position: 'relative',
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(to right, rgb(6, 182, 212), rgb(34, 211, 238))',
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: (isLoading || !token) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '16px',
                    opacity: (isLoading || !token) ? 0.5 : 1,
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && token) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(34, 211, 238, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              {/* Back to Login */}
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <a
                  href="/login"
                  style={{
                    color: 'rgb(6, 182, 212)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'rgb(103, 232, 249)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgb(6, 182, 212)';
                  }}
                >
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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