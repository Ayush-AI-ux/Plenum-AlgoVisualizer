import { useState, useEffect, useRef } from "react";
import { requestPasswordReset } from "../services/authService";
import * as THREE from "three";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetUrl, setResetUrl] = useState(""); // Store reset URL for development
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResetUrl("");
    setIsLoading(true);

    try {
      // Send both email and current password for verification
      const res = await requestPasswordReset(email, currentPassword);
      
      if (res.success) {
        setSuccess("Password reset link has been sent to your email!");
        // Store reset URL if provided (for development)
        if (res.resetUrl) {
          setResetUrl(res.resetUrl);
        }
        setEmail("");
        setCurrentPassword("");
      } else {
        setError(res.message || "Failed to send reset email. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please verify your email and current password.");
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
                  Reset Password
                </h1>
                <p style={{
                  color: 'rgba(103, 232, 249, 0.6)',
                  fontSize: '14px',
                  letterSpacing: '0.025em'
                }}>
                  Verify your identity to receive a reset link
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

              {/* Development: Show Reset URL */}
              {resetUrl && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <p style={{
                    color: 'rgb(103, 232, 249)',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Development Mode - Reset Link:
                  </p>
                  <a
                    href={resetUrl}
                    style={{
                      color: 'rgb(165, 243, 252)',
                      fontSize: '13px',
                      wordBreak: 'break-all',
                      textDecoration: 'underline',
                      display: 'block'
                    }}
                  >
                    {resetUrl}
                  </a>
                  <p style={{
                    color: 'rgba(103, 232, 249, 0.6)',
                    fontSize: '11px',
                    marginTop: '8px'
                  }}>
                    Click the link above or check your backend console
                  </p>
                </div>
              )}

              {/* Form */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                {/* Current Password Input */}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    required
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      paddingRight: '48px',
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '16px',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(6, 182, 212, 0.5)',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'rgba(6, 182, 212, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(6, 182, 212, 0.5)';
                    }}
                  >
                    {showPassword ? (
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Security Notice */}
                <div style={{
                  marginBottom: '24px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(6, 182, 212, 0.05)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <svg style={{ width: '18px', height: '18px', color: 'rgb(6, 182, 212)', flexShrink: 0, marginTop: '2px' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p style={{
                    color: 'rgba(103, 232, 249, 0.8)',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    For your security, we need to verify your current password before sending a reset link.
                  </p>
                </div>

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
                  {isLoading ? "Verifying..." : "Send Reset Link"}
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