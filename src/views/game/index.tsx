import { Icon } from '@iconify/react'
import { Link } from 'react-router';
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import CountUp from '@/components/ui/count-up';

// Define tile color mappings based on values
const getTileStyles = (value: number) => {
    const styles: Record<number, { bg: string; text: string }> = {
        2: { bg: "bg-[#ddd6fe]", text: "text-[#5b21b6]" },
        4: { bg: "bg-[#c4b5fd]", text: "text-[#5b21b6]" },
        8: { bg: "bg-[#a78bfa]", text: "text-white" },
        16: { bg: "bg-[#8b5cf6]", text: "text-white" },
        32: { bg: "bg-[#7c3aed]", text: "text-white" },
        64: { bg: "bg-[#6d28d9]", text: "text-white" },
        128: { bg: "bg-[#5b21b6]", text: "text-white" },
        256: { bg: "bg-[#4c1d95]", text: "text-white" },
        512: { bg: "bg-[#7e22ce]", text: "text-white" },
        1024: { bg: "bg-[#6b21a8]", text: "text-white" },
        2048: { bg: "bg-[#581c87]", text: "text-white" },
    };
    return styles[value] || styles[2048];
};

interface TileType {
    id: string;
    value: number;
    row: number;
    col: number;
    isNew?: boolean;
    isMerging?: boolean;
    toRemove?: boolean;
}

export default function Game() {
    const [tiles, setTiles] = useState<TileType[]>([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const boardRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const touchEndRef = useRef({ x: 0, y: 0 });
    const dragStartRef = useRef({ x: 0, y: 0 });
    const dragEndRef = useRef({ x: 0, y: 0 });
    const mergeAudioRef = useRef<HTMLAudioElement | null>(null);
    const slideAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        initGame();
        const savedBestScore = localStorage.getItem('bestScore');
        if (savedBestScore) {
            setBestScore(parseInt(savedBestScore));
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        mergeAudioRef.current = new Audio('/synthesis.mp3');
        mergeAudioRef.current.volume = 0.5;
        slideAudioRef.current = new Audio('/slide.mp3');
        slideAudioRef.current.volume = 0.5;
    }, []);

    useEffect(() => {
        if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem('bestScore', score.toString());
        }
    }, [score, bestScore]);

    const createTile = (row: number, col: number, value: number, isNew = true): TileType => ({
        id: `${row}-${col}-${Date.now()}-${Math.random()}`,
        value,
        row,
        col,
        isNew,
    });

    const initGame = () => {
        const newTiles: TileType[] = [];
        for (let i = 0; i < 2; i++) {
            const position = getRandomEmptyPosition(newTiles);
            if (position) {
                newTiles.push(createTile(position.row, position.col, Math.random() < 0.9 ? 2 : 4));
            }
        }
        setTiles(newTiles);
        setScore(0);
        setGameOver(false);
        setGameWon(false);
    };

    const getRandomEmptyPosition = (currentTiles: TileType[]) => {
        const occupied = new Set(currentTiles.map(tile => `${tile.row}-${tile.col}`));
        const empty: { row: number; col: number }[] = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (!occupied.has(`${row}-${col}`)) {
                    empty.push({ row, col });
                }
            }
        }
        if (empty.length === 0) return null;
        return empty[Math.floor(Math.random() * empty.length)];
    };

    const moveTiles = (direction: 'up' | 'down' | 'left' | 'right') => {
        const newTiles = [...tiles];
        let moved = false;
        let newScore = score;
        const sortedTiles = [...newTiles].sort((a, b) => {
            if (direction === 'left') return a.col - b.col;
            if (direction === 'right') return b.col - a.col;
            if (direction === 'up') return a.row - b.row;
            return b.row - a.row;
        });

        sortedTiles.forEach(tile => {
            tile.isMerging = false;
            tile.toRemove = false;
        });

        sortedTiles.forEach(tile => {
            if (tile.toRemove) return;
            let { row, col } = tile;
            let newRow = row;
            let newCol = col;

            while (true) {
                let nextRow = direction === 'up' ? newRow - 1 : direction === 'down' ? newRow + 1 : newRow;
                let nextCol = direction === 'left' ? newCol - 1 : direction === 'right' ? newCol + 1 : newCol;

                if (nextRow < 0 || nextRow >= 4 || nextCol < 0 || nextCol >= 4) break;

                const nextTile = sortedTiles.find(t => t.row === nextRow && t.col === nextCol && !t.toRemove);
                slideAudioRef.current?.play();

                if (!nextTile) {
                    newRow = nextRow;
                    newCol = nextCol;
                    moved = true;
                } else if (nextTile.value === tile.value && !nextTile.isMerging) {
                    nextTile.value *= 2;
                    nextTile.isMerging = true;
                    tile.toRemove = true;
                    newScore += nextTile.value;
                    moved = true;
                    mergeAudioRef.current?.play();
                    if (nextTile.value === 2048 && !gameWon) {
                        setGameWon(true);
                    }
                    break;
                } else {
                    break;
                }
            }

            if (!tile.toRemove) {
                tile.row = newRow;
                tile.col = newCol;
            }
        });

        if (moved) {
            const remainingTiles = sortedTiles.filter(tile => !tile.toRemove);
            const newPosition = getRandomEmptyPosition(remainingTiles);
            if (newPosition) {
                remainingTiles.push(createTile(newPosition.row, newPosition.col, Math.random() < 0.9 ? 2 : 4));
            }

            setTiles(remainingTiles);
            setScore(newScore);
            checkGameStatus(remainingTiles);
        }

        return moved;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver) return;
        switch (e.key) {
            case 'ArrowUp': moveTiles('up'); break;
            case 'ArrowDown': moveTiles('down'); break;
            case 'ArrowLeft': moveTiles('left'); break;
            case 'ArrowRight': moveTiles('right'); break;
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        if (gameOver) return;
        touchEndRef.current = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
        const dx = touchEndRef.current.x - touchStartRef.current.x;
        const dy = touchEndRef.current.y - touchStartRef.current.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) > 30) {
            if (Math.abs(dx) > Math.abs(dy)) {
                moveTiles(dx > 0 ? 'right' : 'left');
            } else {
                moveTiles(dy > 0 ? 'down' : 'up');
            }
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
    };

    const handleDragStart = (e: React.MouseEvent) => {
        dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleDragEnd = (e: React.MouseEvent) => {
        if (gameOver) return;
        dragEndRef.current = { x: e.clientX, y: e.clientY };
        const dx = dragEndRef.current.x - dragStartRef.current.x;
        const dy = dragEndRef.current.y - dragStartRef.current.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) > 30) {
            if (Math.abs(dx) > Math.abs(dy)) {
                moveTiles(dx > 0 ? 'right' : 'left');
            } else {
                moveTiles(dy > 0 ? 'down' : 'up');
            }
        }
    };

    const checkGameStatus = (tiles: TileType[]) => {
        const occupied = new Set(tiles.map(tile => `${tile.row}-${tile.col}`));
        if (occupied.size < 16) return;

        for (const tile of tiles) {
            const directions = [
                { row: tile.row - 1, col: tile.col },
                { row: tile.row + 1, col: tile.col },
                { row: tile.row, col: tile.col - 1 },
                { row: tile.row, col: tile.col + 1 }
            ];
            for (const d of directions) {
                if (d.row >= 0 && d.row < 4 && d.col >= 0 && d.col < 4) {
                    const neighbor = tiles.find(t => t.row === d.row && t.col === d.col);
                    if (neighbor && neighbor.value === tile.value) return;
                }
            }
        }

        setGameOver(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <div className="absolute -inset-1 rounded-lg blur bg-gradient-to-r from-indigo-500 opacity-20"></div>
                    <h1 className="relative text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-secondary">2048</h1>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white shadow p-2 rounded-lg flex flex-col items-center w-20 border border-gray-100">
                        <span className="text-xs text-gray-500">分数</span>
                        <span className="font-bold text-indigo-600">
                            <CountUp
                                from={0}
                                to={score}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text"
                            />
                        </span>

                    </div>
                    <div className="bg-white shadow p-2 rounded-lg flex flex-col items-center w-20 border border-gray-100">
                        <span className="text-xs text-gray-500">最佳</span>
                        <span className="font-bold text-indigo-600">{bestScore}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mb-6">
                <div
                    className="rounded-xl bg-[#5b21b6] shadow-md flex items-center py-2 px-4 text-white cursor-pointer hover:bg-[#4c1d95] transition-colors duration-200"
                    onClick={initGame}
                >
                    <Icon icon='mingcute:refresh-4-ai-fill' className='mr-2' />
                    新游戏
                </div>
                <div>
                    <Link to='/setting' className='shadow-md block rounded-lg px-2 py-3 bg-white'>
                        <Icon icon='material-symbols:settings'></Icon>
                    </Link>
                </div>
            </div>

            <div
                className='bg-gray-50 rounded-lg p-3 border border-gray-100 shadow-inner relative touch-none'
                ref={boardRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleDragStart}
                onMouseUp={handleDragEnd}
            >
                {/* Empty grid cells */}
                <div className='grid grid-cols-4 gap-3 select-none cursor-grab relative'>
                    {Array(16).fill(null).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-gray-200/90 border border-gray-200/50 h-16 rounded-md flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        </div>
                    ))}
                </div>

                {/* Animated tiles */}
                <div className="absolute inset-3 grid grid-cols-4 select-none cursor-grab gap-3">
                    <AnimatePresence>
                        {tiles.map((tile) => (
                            <motion.div
                                key={tile.id}
                                initial={tile.isNew ? { scale: 0 } : { scale: 1 }}
                                animate={{
                                    scale: tile.isMerging ? [1, 1.2, 1] : 1,
                                    x: `calc(${tile.col * 100}% + ${tile.col * 12}px)`,
                                    y: `calc(${tile.row * 100}% + ${tile.row * 12}px)`,
                                }}
                                exit={{ scale: 0 }}
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    y: { type: "spring", stiffness: 300, damping: 30 },
                                    scale: { duration: 0.2 }
                                }}
                                className={`absolute overflow-hidden ${getTileStyles(tile.value).text} ${getTileStyles(tile.value).bg} w-[calc(25%-9px)] h-16 rounded-md flex items-center justify-center font-bold text-xl shadow-lg before:absolute before:-rotate-45 before:bg-linear-to-br before:from-white/25 before:to-white/5 before:pointer-events-none before:-top-1/2 before:-left-1/2 before:w-[200%] before:h-[200%]`}
                            >
                                {tile.value}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            <div className='mt-6 flex justify-center'>
                <div className=' flex items-center justify-center bg-[#eef2ff] border border-[#e8edff] shadow-lg px-4 py-3 rounded-full'>
                    <Icon icon='icon-park:move' className='mr-2' />
                    <span>
                        上下左右滑动进行方块的合成!
                    </span>
                </div>
            </div>
            <div className="mt-6 bg-white shadow rounded-lg p-3 border border-gray-100">
                <div className="flex items-center mb-1">
                    <Icon icon='fluent-color:lightbulb-20' className='mr-1 text-lg' />
                    <span className="text-gray-700 font-medium">游戏提示</span>
                </div>
                <p className="text-gray-600 text-xs">将大数字保持在角落位置，按照从大到小的顺序排列方块可以获得更高的分数。</p>
            </div>
            {(gameOver || gameWon) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-indigo-600">
                            {gameWon ? "恭喜你赢了！" : "游戏结束！"}
                        </h2>
                        <p className="mb-6">你的分数: {score}</p>
                        <button
                            onClick={initGame}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            再玩一次
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}