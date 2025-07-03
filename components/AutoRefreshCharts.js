function AutoRefreshCharts() {
    try {
        const [works, setWorks] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [lastUpdate, setLastUpdate] = React.useState(new Date());

        const loadWorksProgress = async () => {
            try {
                const response = await trickleListObjects('budget_project', 24, true);
                const projects = response.items.map(project => {
                    const data = project.objectData;
                    let progress = 0;
                    let statusColor = '#6B7280';
                    
                    switch (data.estado) {
                        case 'terminado':
                            progress = 100;
                            statusColor = '#10B981';
                            break;
                        case 'si':
                            if (data.fechaInicio && data.fechaFinalizacion) {
                                const start = new Date(data.fechaInicio);
                                const end = new Date(data.fechaFinalizacion);
                                const now = new Date();
                                const total = end - start;
                                const elapsed = now - start;
                                progress = Math.min(Math.max((elapsed / total) * 100, 10), 85);
                            } else {
                                progress = Math.floor(Math.random() * 40) + 30;
                            }
                            statusColor = '#3B82F6';
                            break;
                        case 'interrumpido':
                            progress = Math.floor(Math.random() * 30) + 15;
                            statusColor = '#EF4444';
                            break;
                        default:
                            progress = 0;
                            statusColor = '#6B7280';
                    }
                    
                    return {
                        ...data,
                        progress: Math.round(progress),
                        statusColor,
                        id: project.objectId
                    };
                });
                
                setWorks(projects);
                setLastUpdate(new Date());
            } catch (error) {
                console.error('Error loading works progress:', error);
            } finally {
                setLoading(false);
            }
        };

        React.useEffect(() => {
            loadWorksProgress();
            const interval = setInterval(loadWorksProgress, 5 * 60 * 1000); // 5 minutes
            return () => clearInterval(interval);
        }, []);

        React.useEffect(() => {
            lucide.createIcons();
        }, [works]);

        if (loading) {
            return (
                <div data-name="auto-refresh-loading" data-file="components/AutoRefreshCharts.js" className="glass-effect rounded-2xl p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando dashboard en vivo...</p>
                </div>
            );
        }

        return (
            <div data-name="auto-refresh-charts" data-file="components/AutoRefreshCharts.js" className="space-y-6">
                <div className="glass-effect rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <i data-lucide="trending-up" className="w-8 h-8 mr-3 text-red-500"></i>
                            Dashboard en Vivo - Progreso de Obras
                        </h2>
                        <div className="text-gray-500 text-sm">
                            Última actualización: {lastUpdate.toLocaleTimeString('es-PE')}
                        </div>
                    </div>
                    
                    <div className="text-green-600 text-sm mb-4 flex items-center">
                        <i data-lucide="refresh-cw" className="w-4 h-4 mr-2"></i>
                        Se actualiza automáticamente cada 5 minutos
                    </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Obras Públicas en Tiempo Real</h3>
                    
                    {works.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-3">
                            {works.map((work) => (
                                <WorkProgressChart key={work.id} work={work} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <i data-lucide="inbox" className="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                            <p className="text-gray-600">No hay obras registradas</p>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('AutoRefreshCharts component error:', error);
        reportError(error);
    }
}
