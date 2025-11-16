'use client';

import React, { useEffect, useRef } from 'react';

export function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const vertexShaderSource = `#version 300 es
      in vec4 position;
      void main() {
        gl_Position = position;
      }
    `;

    const fragmentShaderSource = `#version 300 es
      precision highp float;
      
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;
      
      out vec4 outColor;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 center = vec2(0.5) + mouse * 0.1;
        
        float dist = distance(uv, center);
        
        float wave1 = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
        float wave2 = sin(dist * 20.0 + time * 1.5) * 0.5 + 0.5;
        
        vec3 color1 = vec3(0.1, 0.4, 0.9);
        vec3 color2 = vec3(0.6, 0.2, 0.8);
        vec3 color3 = vec3(0.1, 0.8, 0.7);
        
        vec3 finalColor = mix(color1, color2, wave1);
        finalColor = mix(finalColor, color3, wave2);
        
        float glow = 1.0 / (dist * 3.0 + 0.5);
        finalColor += glow * vec3(0.3, 0.5, 1.0);
        
        float noise = sin(uv.x * 50.0 + time) * sin(uv.y * 50.0 - time) * 0.1;
        finalColor += noise;
        
        outColor = vec4(finalColor, 1.0);
      }
    `;

    function compileShader(source: string, type: number): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return shader;
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const mouseLocation = gl.getUniformLocation(program, 'mouse');

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform2f(resolutionLocation, canvas!.width, canvas!.height);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl.viewport(0, 0, canvas!.width, canvas!.height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
    />
  );
}
