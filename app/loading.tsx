export default function Loading() {
  return (
    <section className="main_container bg-paper">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Loading...
        </h2>
        <p className="text-gray-600">
          Please wait while we fetch the content.
        </p>
      </div>
    </section>
  );
} 