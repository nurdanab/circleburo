// src/components/BlenderModel.jsx
import React, { useRef, Suspense, useEffect } from 'react';
import { useGLTF, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AnimatedModel() {
  const { scene } = useGLTF('/abstract-circle.glb');
  
  const meshRef = useRef();
  const clonedScene = scene.clone();

  // Создаем разные материалы для разных элементов
  useEffect(() => {
    let meshIndex = 0;
    
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        if (meshIndex === 0) {
          // Первый элемент (внешний) - темный металлический
          const darkMetallicMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.15, 0.15, 0.2), // Темно-серый с синеватым оттенком
            metalness: 0.95,  // Очень высокая металличность
            roughness: 0.2,   // Низкая шероховатость для блеска
            envMapIntensity: 1.8, // Хорошее отражение окружения
            emissive: new THREE.Color(0.02, 0.02, 0.05), // Очень слабое темное свечение
            transparent: true,
            opacity: 0.95
          });
          child.material = darkMetallicMaterial;
        } else {
          // Второй элемент (внутренний) - голубой металлический
          const blueMetallicMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.3, 0.7, 1.0), // Яркий голубой
            metalness: 0.9,  // Высокая металличность
            roughness: 0.1,  // Низкая шероховатость для блеска
            envMapIntensity: 2.5, // Усиленное отражение
            emissive: new THREE.Color(0.1, 0.2, 0.3), // Голубоватое свечение
            transparent: true,
            opacity: 0.95
          });
          child.material = blueMetallicMaterial;
        }
        meshIndex++;
      }
    });
  }, [clonedScene]);

  useFrame((state) => {
    if (meshRef.current) {
      // Основная анимация вращения
      meshRef.current.rotation.y += 0.005;
      
      // Дополнительное легкое покачивание для эффекта "живости"
      meshRef.current.position.y = -1.0 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Динамическое изменение цвета внутреннего элемента при вращении
      let meshIndex = 0;
      meshRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (meshIndex === 1) {
            // Изменение цвета внутреннего элемента на светлые неакцентные оттенки
            const time = state.clock.elapsedTime;
            const rotationFactor = meshRef.current.rotation.y * 0.3;
            
            // Замедляем переходы между цветами
            const colorPhase = time * 0.3 + rotationFactor; // Уменьшили скорость с 0.8 до 0.3
            
            // Светлые, мягкие металлические цвета
            const colors = [
              { r: 0.8, g: 0.8, b: 0.75 }, // светлое серебро
              { r: 0.75, g: 0.8, b: 0.85 }, // мягкий голубоватый
              { r: 0.85, g: 0.8, b: 0.75 }, // теплый бежевый
              { r: 0.8, g: 0.85, b: 0.8 },  // светлый зеленоватый
              { r: 0.85, g: 0.75, b: 0.8 }, // мягкий розоватый
              { r: 0.75, g: 0.85, b: 0.8 }  // светлый мятный
            ];
            
            // Плавная интерполяция между цветами
            const colorIndex = (Math.sin(colorPhase) + 1) * 0.5 * (colors.length - 1);
            const currentIndex = Math.floor(colorIndex);
            const nextIndex = (currentIndex + 1) % colors.length;
            const blend = colorIndex - currentIndex;
            
            const currentColor = colors[currentIndex];
            const nextColor = colors[nextIndex];
            
            // Смешиваем цвета
            const finalR = currentColor.r + (nextColor.r - currentColor.r) * blend;
            const finalG = currentColor.g + (nextColor.g - currentColor.g) * blend;
            const finalB = currentColor.b + (nextColor.b - currentColor.b) * blend;
            
            child.material.color.setRGB(finalR, finalG, finalB);
            
            // Более мягкая и медленная пульсация свечения
            const pulse = (Math.sin(time * 0.6) + 1) * 0.5;
            child.material.emissiveIntensity = pulse * 0.15;
            
            // Очень мягкое emissive свечение
            child.material.emissive.setRGB(
              finalR * 0.1, 
              finalG * 0.1, 
              finalB * 0.1
            );
          }
          meshIndex++;
        }
      });
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={clonedScene} 
      scale={[0.7, 0.7, 0.7]}
      position={[0, -1.0, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function ModelError() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#ff6b6b" 
        transparent 
        opacity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function ModelLoader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#4ecdc4" 
        transparent 
        opacity={0.5}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

export default function BlenderModel() {
  return (
    <Canvas 
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 30 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      {/* Усиленное освещение для лучшего эффекта сверкания */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#add8e6" />
      
      <Suspense fallback={<ModelLoader />}>
        <ErrorBoundary fallback={<ModelError />}>
          <AnimatedModel />
        </ErrorBoundary>
      </Suspense>
      
      <Environment preset="studio" />
    </Canvas>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('3D Model Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ModelError />;
    }

    return this.props.children;
  }
}

useGLTF.preload('/abstract-circle.glb');