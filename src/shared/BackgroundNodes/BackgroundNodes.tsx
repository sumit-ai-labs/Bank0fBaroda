import React, { useEffect, useRef } from "react";
import "./BackgroundNodes.css";

interface BackgroundNodesProps {
    density?: number;
    position?: "corners" | "fullscreen";
    opacity?: number;
}

interface Node {
    x: number; y: number;
    vx: number; vy: number;
    radius: number; opacity: number;
}

export const BackgroundNodes: React.FC<BackgroundNodesProps> = ({
    density = 0.12,
    position = "corners",
    opacity = 0.12,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const nodesRef = useRef<Node[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const NODE_COUNT = Math.round(150 * density);
        const CONN_DIST = 160;

        nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.8 + 0.8,
            opacity: (Math.random() * 0.5 + 0.3) * opacity,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const nodes = nodesRef.current;
            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
            });

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONN_DIST) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 0, 0, ${(1 - dist / CONN_DIST) * 0.12 * opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach(n => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 0, ${n.opacity})`;
                ctx.fill();
            });

            animRef.current = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animRef.current);
        };
    }, [density, opacity]);

    return (
        <canvas 
            ref={canvasRef} 
            className={`background-nodes-canvas background-nodes-canvas--${position}`} 
        />
    );
};
