// src/components/BlenderBottle.jsx

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useTransform } from 'framer-motion';
import * as THREE from 'three';

const BlenderBottle = ({ scrollProgress, modelPath }) => {
  const { scene, error } = useGLTF(modelPath);
  const meshRef = useRef();
  
  // Клонируем сцену и центрируем модель
  const clonedScene = useMemo(() => {
    if (scene) {
      const cloned = scene.clone();
      
      // Вычисляем центр модели для точного центрирования
      const box = new THREE.Box3().setFromObject(cloned);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      console.log('Model center:', center);
console.log('Model size:', size);
      // Центрируем модель относительно ее геометрического центра
      cloned.position.set(-center.x, -center.y, -center.z);
      
      // Нормализуем размер модели
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = 16 / maxDimension; 
      cloned.scale.setScalar(scale);
      
      return cloned;
    }
    return null;
  }, [scene]);

  // Анимация только по вертикали + небольшой поворот в начале
  const positionY = useTransform(scrollProgress, [0, 1], [-26, -29]);
  const rotationZ = useTransform(scrollProgress, [0, 0.1], [Math.PI / -20, 0]);
  
  useFrame(() => {
    if (meshRef.current && scrollProgress) {
      const currentPositionY = positionY.get();
      const currentRotationZ = rotationZ.get();
      
      // Строгое позиционирование в горизонтальном центре
      meshRef.current.position.set(0, currentPositionY, 0);
      meshRef.current.rotation.set(0, 0, currentRotationZ);
      meshRef.current.scale.setScalar(1);
    }
  });

  // Обработка ошибок загрузки
  useEffect(() => {
    if (error) {
      console.error('Error loading 3D model:', error);
    }
  }, [error]);

  // Заглушка при ошибке или отсутствии модели
  if (error || !clonedScene) {
    return (
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.3, 2, 8]} />
        <meshStandardMaterial 
          color="#888888" 
          transparent 
          opacity={0.2}
        />
      </mesh>
    );
  }

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      <primitive 
        object={clonedScene}
        position={[11, 0, 0]} 
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

// Предзагрузка модели для лучшей производительности
useGLTF.preload('/bottle-outi.glb');

export default BlenderBottle;