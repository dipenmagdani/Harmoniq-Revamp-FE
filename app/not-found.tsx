export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold text-primary mb-4">
          404
        </h1>
        <p className="text-xl text-zinc-500 mb-8">Page not found</p>
        <a
          href="/"
          className="px-8 py-4 bg-primary hover:bg-primary-glow text-white rounded-full font-bold transition-all hover:scale-105"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
