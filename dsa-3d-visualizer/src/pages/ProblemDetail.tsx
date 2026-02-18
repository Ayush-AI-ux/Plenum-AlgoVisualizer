import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../services/authService";
import * as THREE from "three";

interface Problem {
  problemId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  complexity: {
    time: string;
    space: string;
    explanation: string;
  };
  algorithmTutorial: {
    algorithmName: string;
    description: string;
  };
  solutions?: {
    [language: string]: string;
  };
}

const LANGUAGE_COLORS: Record<string, string> = {
  "C++": "#00599C",
  "Java": "#f89820",
  "Python": "#3776AB",
  "JavaScript": "#F7DF1E",
  "Go": "#00ADD8",
};

const LANGUAGE_ICONS: Record<string, string> = {
  "C++": "⚡",
  "Java": "☕",
  "Python": "🐍",
  "JavaScript": "📜",
  "Go": "🔷",
};

export default function ProblemDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSolutions, setShowSolutions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Three.js background
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

    const particleCount = 1200;
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
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

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
      particles.rotation.y += 0.0002;

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

  // Fetch problem details
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

  const handleStartVisualization = () => {
    navigate(`/visualize/${id}`);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
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
          <p>Loading problem...</p>
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
        backgroundColor: '#000000',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={() => navigate("/problems")}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff6b35',
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

  const languages = problem.solutions ? Object.keys(problem.solutions) : [];

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
      {/* Canvas */}
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
          maxWidth: '1200px',
          margin: '0 auto',
          paddingBottom: '80px'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => navigate("/problems")}
              style={{
                padding: '10px 20px',
                backdropFilter: 'blur(16px) saturate(180%)',
                backgroundColor: 'rgba(10, 10, 10, 0.4)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                borderRadius: '8px',
                color: '#ffa64d',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.4)';
              }}
            >
              ← Back to Problems
            </button>
          </div>

          {/* Problem Card */}
          <div style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            backgroundColor: 'rgba(10, 10, 10, 0.5)',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px'
          }}>
            {/* Title & Difficulty */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ff8c42, #ffa64d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                {problem.title}
              </h1>
              <span style={{
                padding: '8px 16px',
                backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
                border: `1px solid ${getDifficultyColor(problem.difficulty)}50`,
                borderRadius: '8px',
                color: getDifficultyColor(problem.difficulty),
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {problem.difficulty}
              </span>
            </div>

            {/* Tags */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '24px'
            }}>
              {problem.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'rgba(255, 107, 53, 0.15)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '6px',
                    color: 'rgba(255, 166, 77, 0.9)',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                color: '#ffa64d',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Problem Description
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '15px',
                lineHeight: '1.7',
                whiteSpace: 'pre-line'
              }}>
                {problem.description}
              </p>
            </div>

            {/* Examples */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                color: '#ffa64d',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                Examples
              </h3>
              {problem.examples.map((example, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '16px',
                    padding: '16px',
                    backgroundColor: 'rgba(20, 20, 20, 0.4)',
                    border: '1px solid rgba(255, 107, 53, 0.15)',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      Example {index + 1}:
                    </span>
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <strong style={{ color: '#22c55e' }}>Input:</strong> {example.input}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <strong style={{ color: '#3b82f6' }}>Output:</strong> {example.output}
                    </div>
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}>
                    <strong>Explanation:</strong> {example.explanation}
                  </div>
                </div>
              ))}
            </div>

            {/* Algorithm Info */}
            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                color: '#60a5fa',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                💡 Algorithm Required: {problem.algorithmTutorial.algorithmName}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                {problem.algorithmTutorial.description}
              </p>
            </div>

            {/* Complexity */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px'
              }}>
                <div style={{
                  color: '#22c55e',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Time Complexity
                </div>
                <div style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: 'monospace'
                }}>
                  {problem.complexity.time}
                </div>
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '8px'
              }}>
                <div style={{
                  color: '#a855f7',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Space Complexity
                </div>
                <div style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: 'monospace'
                }}>
                  {problem.complexity.space}
                </div>
              </div>
            </div>

            {/* Solution Section */}
            {languages.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => setShowSolutions(!showSolutions)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    border: '2px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '12px',
                    color: '#c084fc',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s',
                    marginBottom: showSolutions ? '16px' : '0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>💻</span>
                    View Solutions in {languages.length} Languages
                  </span>
                  <span style={{
                    fontSize: '20px',
                    transform: showSolutions ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }}>
                    ▼
                  </span>
                </button>

                {showSolutions && (
                  <div style={{
                    backgroundColor: 'rgba(20, 20, 20, 0.6)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    animation: 'slideDown 0.3s ease-out'
                  }}>
                    {/* Language Tabs */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingBottom: '12px'
                    }}>
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setSelectedLanguage(lang);
                            setCopied(false); // Reset copied state when switching languages
                          }}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: selectedLanguage === lang 
                              ? `${LANGUAGE_COLORS[lang]}30` 
                              : 'rgba(255, 255, 255, 0.05)',
                            border: selectedLanguage === lang 
                              ? `2px solid ${LANGUAGE_COLORS[lang]}` 
                              : '2px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: selectedLanguage === lang 
                              ? LANGUAGE_COLORS[lang] 
                              : 'rgba(255, 255, 255, 0.6)',
                            cursor: 'pointer',
                            fontWeight: selectedLanguage === lang ? '600' : '500',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedLanguage !== lang) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedLanguage !== lang) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                            }
                          }}
                        >
                          <span>{LANGUAGE_ICONS[lang]}</span>
                          {lang}
                        </button>
                      ))}
                    </div>

                    {/* Code Display */}
                    {problem.solutions && problem.solutions[selectedLanguage] && (
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <span style={{
                            color: LANGUAGE_COLORS[selectedLanguage],
                            fontWeight: '600',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{ fontSize: '18px' }}>
                              {LANGUAGE_ICONS[selectedLanguage]}
                            </span>
                            {selectedLanguage} Solution
                          </span>
                          <button
                            onClick={() => copyToClipboard(problem.solutions![selectedLanguage])}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              border: copied ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '6px',
                              color: copied ? '#22c55e' : 'rgba(255, 255, 255, 0.7)',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                              if (!copied) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.color = 'white';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!copied) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                              }
                            }}
                          >
                            {copied ? '✓ Copied!' : '📋 Copy Code'}
                          </button>
                        </div>
                        <pre style={{
                          backgroundColor: '#1a1a1a',
                          border: `1px solid ${LANGUAGE_COLORS[selectedLanguage]}30`,
                          borderRadius: '8px',
                          padding: '20px',
                          overflowX: 'auto',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          margin: 0,
                          color: '#e0e0e0'
                        }}>
                          <code>{problem.solutions[selectedLanguage]}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStartVisualization}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '18px',
                boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 107, 53, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.4)';
              }}
            >
              <span style={{ fontSize: '24px' }}>🎬</span>
              Start 3D Visualization
            </button>
          </div>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}