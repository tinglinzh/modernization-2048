import { BackgroundLines } from "@/components/ui/background-lines";
import { motion } from 'motion/react';
import { Link } from "react-router";
import { Icon } from "@iconify/react"

export default function Home() {
    // 父容器动画配置
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // 每个子元素间隔 0.2s
                delayChildren: 0.3,   // 整体延迟 0.3s 开始
            },
        },
    };
    // 子元素动画配置
    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                type: "linear",
            }, // 线性动画
        },
    };
    return (
        <BackgroundLines>
            <motion.div
                initial="hidden"
                className="flex z-100 relative justify-center items-center flex-col h-full"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    variants={itemVariants}
                    className="relative">
                    <div
                        className="absolute -inset-1 rounded-lg blur bg-gradient-to-r from-indigo-500 via-secondary to-accent opacity-20">
                    </div>
                    <h1
                        className="relative text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-secondary to-accent mb-1">
                        2048</h1>
                </motion.div>
                <motion.p className="text-gray-600 mb-10 text-center" variants={itemVariants}>
                    滑动方块，合并相同数字，挑战2048！
                </motion.p>
                <motion.button variants={itemVariants}
                    whileHover={{
                        y: -10,
                        backgroundColor: "#4c1d95",
                        transition: { duration: 0.2 }
                    }}
                    className="bg-[#5b21b6] mb-6 cursor-pointer transform shadow-md rounded-4xl px-8 py-3 font-bold text-white text-lg tracking-wider"
                >
                    开始游戏
                </motion.button>
                <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-2 gap-4 mt-2 w-full max-w-xs text-center">
                        <Link to={'/rank'} className="bg-white text-[#4f46e5] flex items-center justify-center shadow-md px-8 py-3 rounded-2xl">
                            <Icon icon={'solar:ranking-bold'} className="mr-2 text-yellow-300" />   排行榜
                        </Link>
                        <Link to={'/setting'} className="bg-white text-[#4f46e5] flex items-center justify-center shadow-md px-8 py-3 rounded-2xl">
                            <Icon icon={'icon-park-twotone:setting'} className="mr-2 text-blue-400" />
                            设置
                        </Link>
                        <Link to={'/rule'} className="bg-white text-[#4f46e5] flex items-center justify-center shadow-md px-8 py-3 rounded-2xl">
                            <Icon icon={'carbon:rule-filled'} className="mr-2 text-pink-400" />
                            游戏规则
                        </Link>
                        <Link to={'/share'} className="bg-white text-[#4f46e5] flex items-center justify-center shadow-md px-8 py-3 rounded-2xl">
                            <Icon icon={'majesticons:share-circle'} className="mr-2 text-green-400" />
                            分享
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </BackgroundLines>
    );
} 