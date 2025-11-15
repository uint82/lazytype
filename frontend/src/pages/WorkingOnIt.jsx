import { Wrench, Clock, Code } from "lucide-react";

export default function WorkingOnIt() {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center px-6 py-12 max-w-2xl">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-yellow-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-neutral-800 rounded-full p-6 shadow-lg border-2 border-yellow-600">
            <Wrench className="w-16 h-16 text-yellow-500 animate-bounce" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-yellow-500 mb-4">
          Working on It
        </h1>

        <p className="text-xl text-neutral-300 mb-8">
          This component is currently under construction
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-neutral-800 rounded-lg p-4 shadow-md border-2 border-neutral-700">
            <Code className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-200">Coding</p>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4 shadow-md border-2 border-neutral-700">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-200">In Progress</p>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4 shadow-md border-2 border-neutral-700">
            <Wrench className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-200">Building</p>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-full h-3 overflow-hidden mb-6 border-2 border-neutral-700">
          <div
            className="bg-yellow-600 h-full rounded-full animate-pulse"
            style={{ width: "65%" }}
          ></div>
        </div>

        <p className="text-neutral-400 text-sm">
          Check back soon for something awesome! 🚀
        </p>
      </div>
    </div>
  );
}
