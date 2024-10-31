export default function Loading() {
  return (
    <div className="my-10 max-w-3xl mx-auto">
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
        <div className="mt-10 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
