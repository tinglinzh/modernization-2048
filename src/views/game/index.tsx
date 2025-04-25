import { Icon } from '@iconify/react'
export default function Game() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <div
                        className="absolute -inset-1 rounded-lg blur bg-gradient-to-r from-indigo-500 opacity-20">
                    </div>
                    <h1
                        className="relative text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-secondary">
                        2048</h1>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white shadow p-2 rounded-lg flex flex-col items-center w-20 border border-gray-100">
                        <span className="text-xs text-gray-500">分数</span>
                        <span className="font-bold text-indigo-600">1204</span>
                    </div>
                    <div className="bg-white shadow p-2 rounded-lg flex flex-col items-center w-20 border border-gray-100">
                        <span className="text-xs text-gray-500">最佳</span>
                        <span className="font-bold text-indigo-600">24576</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <div className=" rounded-xl bg-[#5b21b6] shadow-md flex items-center py-2 px-4 text-white">
                    <Icon icon='mingcute:refresh-4-ai-fill' className='mr-2' />
                    新游戏
                </div>
                <div className="">
                    <div>

                    </div>
                </div>
            </div>
        </div>
    );
}