// src/components/BlenderModel.jsx
import React, { useRef, Suspense, useEffect, useMemo, useCallback } from 'react';
import { useGLTF, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AnimatedModel() {
  const { scene } = useGLTF('/abstract-circle.glb');
  
  const meshRef = useRef();
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Мемоизируем материалы для предотвращения пересоздания
  const materials = useMemo(() => {
    const darkMetallicMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.15, 0.15, 0.2),
      metalness: 0.95,
      roughness: 0.2,
      envMapIntensity: 1.8,
      emissive: new THREE.Color(0.02, 0.02, 0.05),
      transparent: true,
      opacity: 0.95
    });

    const blueMetallicMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.3, 0.7, 1.0),
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 2.5,
      emissive: new THREE.Color(0.1, 0.2, 0.3),
      transparent: true,
      opacity: 0.95
    });

    return { darkMetallicMaterial, blueMetallicMaterial };
  }, []);

  // Применяем материалы только один раз
  useEffect(() => {
    let meshIndex = 0;
    
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        if (meshIndex === 0) {
          child.material = materials.darkMetallicMaterial;
        } else {
          child.material = materials.blueMetallicMaterial;
        }
        meshIndex++;
      }
    });
  }, [clonedScene, materials]);

  // Оптимизированная анимация с useCallback
  const animateModel = useCallback((state) => {
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
            const colorPhase = time * 0.3 + rotationFactor;
            
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
              finalG * 0.15,
              finalB * 0.2
            );
          }
          meshIndex++;
        }
      });
    }
  }, []);

  useFrame(animateModel);

  return (
    <primitive 
      ref={meshRef} 
      object={clonedScene} 
      position={[0, 0, 0]}
      scale={[0.8, 0.8, 0.8]}
    />
  );
}

// Оптимизированный Canvas с настройками производительности
const BlenderModel = () => {
  return (
    <div className="w-full h-full"> {/* Убираю лишнее центрирование */}
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, 5], fov: 30 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]} // Responsive pixel ratio
        performance={{ min: 0.5 }} // Performance optimization
      >
        <Suspense fallback={null}>
          <AnimatedModel />
          <Environment preset="studio" />
          {/* Усиленное освещение для лучшего эффекта сверкания */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.6} color="#ffffff" />
          <pointLight position={[5, 5, 5]} intensity={0.4} color="#add8e6" />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Preload the 3D model for better performance
useGLTF.preload('/abstract-circle.glb');

export default BlenderModel;