
export default function VideoSection() {
  return (
    <section className="py-16 bg-gov-blue-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gov-blue mb-4">Video Explicativo</h2>
          <p className="text-lg text-gov-gray">
            Aprende cómo realizar tus trámites en línea desde esta página web de manera fácil y segura
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="p-0">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/jIuMQ5Mgslo"
                  title="Video del Tribunal Electoral"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
