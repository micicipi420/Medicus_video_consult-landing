export function MeshBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Blob 1: blue, top-left */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-mu-blue/30 mix-blend-multiply blur-[120px]" />
      {/* Blob 2: green, top-right */}
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-mu-green-300/20 mix-blend-multiply blur-[120px]" />
      {/* Blob 3: accent-blue, bottom-left */}
      <div className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-mu-accent-blue/15 mix-blend-multiply blur-[120px]" />
      {/* Frosted overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] backdrop-saturate-[180%]" />
    </div>
  );
}
