import { motion } from "motion/react"; // 注意是 from "framer-motion"，不是 "motion/react"！
import { useEffect, useState } from "react";
import { Icon } from '@iconify/react';

export default function Future() {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; delay: number }[]>([]);

    useEffect(() => {
        const colors = ["#ff4d4f", "#40a9ff", "#73d13d", "#ffc53d", "#9254de", "#ff85c0"];
        const newParticles = Array.from({ length: 80 }).map((_, i) => ({
            id: i,
            x: Math.random() * 600 - 300,
            y: Math.random() * 600 - 300,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 0.5,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
            {/* 渐变文字，增加渐入效果 */}
            <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-4xl font-extrabold flex item-center mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent z-10 mb-6"
            >
                <Icon icon='fluent-emoji:face-with-monocle' className="mr-1" />
                <span>
                    敬请期待
                </span>
            </motion.h1>

            {/* 礼花筒图片 */}
            <img
                src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png"
                alt="Confetti"
                className="w-20 h-20 z-10"
            />

            {/* 粒子动画 */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                    transition={{ duration: 2.5, delay: p.delay, ease: "easeOut" }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                />
            ))}
        </div>
    );
}
