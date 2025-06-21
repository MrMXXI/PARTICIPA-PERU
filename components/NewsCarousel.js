function NewsCarousel() {
    try {
        const [currentSlide, setCurrentSlide] = React.useState(0);
        
        const news = [
            {
                title: "Obras Públicas en Lima Metropolitana",
                image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=400&fit=crop",
                description: "Avances en infraestructura urbana"
            },
            {
                title: "Modernización del Transporte Público",
                image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop",
                description: "Mejoras en el sistema de transporte"
            },
            {
                title: "Desarrollo de Espacios Verdes",
                image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
                description: "Parques y áreas recreativas"
            },
            {
                title: "Infraestructura Educativa",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
                description: "Construcción de nuevos colegios"
            },
            {
                title: "Proyectos de Vivienda Social",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
                description: "Desarrollo habitacional sustentable"
            }
        ];

        React.useEffect(() => {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % news.length);
            }, 4000);
            return () => clearInterval(interval);
        }, []);

        React.useEffect(() => {
            lucide.createIcons();
        }, []);

        return (
            <div data-name="news-carousel" data-file="components/NewsCarousel.js" className="glass-effect rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <i data-lucide="newspaper" className="w-6 h-6 mr-2 text-red-500"></i>
                    Noticias Relevantes del Perú
                </h2>
                
                <div className="carousel-container relative h-64 rounded-lg overflow-hidden">
                    {news.map((item, index) => (
                        <div
                            key={index}
                            className={`carousel-slide absolute inset-0 ${index === currentSlide ? 'active' : ''}`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-white/90">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                        {news.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('NewsCarousel component error:', error);
        reportError(error);
    }
}
