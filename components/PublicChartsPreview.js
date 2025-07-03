function PublicChartsPreview() {
    try {
        const [works, setWorks] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [totalStats, setTotalStats] = React.useState({
            total: 0,
            completed: 0,
            inProgress: 0,
            interrupted: 0,
            notStarted: 0
        });

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
                            // Calculate progress based on dates
                            if (data.fechaInicio && data.fechaFinalizacion) {
                                const start = new Date(data.fechaInicio);
                                const end = new Date(data.fechaFinalizacion);
                                const now = new Date();
                                const total = end - start;
                                const elapsed = now - start;
                                progress = Math.min(Math.max((elapsed / total) * 100, 10), 85);
                            } else {
                                progress = Math.floor(Math.random() * 40) + 30; // Random between 30-70%
                            }
                            statusColor = '#3B82F6';
                            break;
                        case 'interrumpido':
                            progress = Math.floor(Math.random() * 30) + 15; // Random between 15-45%
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
                
                // Calculate total statistics
                const stats = {
                    total: projects.length,
                    completed: projects.filter(p => p.estado === 'terminado').length,
                    inProgress: projects.filter(p => p.estado === 'si').length,
                    interrupted: projects.filter(p => p.estado === 'interrumpido').length,
                    notStarted: projects.filter(p => p.estado === 'no').length
                };
                
                setWorks(projects);
                setTotalStats(stats);
            } catch (error) {
                console.error('Error loading works progress:', error);
            } finally {
                setLoading(false);
            }
        };

        React.useEffect(() => {
            loadWorksProgress();
            const interval = setInterval(loadWorksProgress, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }, []);

        React.useEffect(() => {
            lucide.createIcons();
        }, [works]);

        if (loading) {
            return (
                <div data-name="public-charts-loading" data-file="components/PublicChartsPreview.js" className="glass-effect rounded-2xl p-6">
                    <div className="animate-spin w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600 text-center">Cargando dashboard de obras...</p>
                </div>
            );
        }

        return (
            <div data-name="public-charts-preview" data-file="components/PublicChartsPreview.js" className="space-y-6">
                {/* Summary Statistics */}
                <div className="glass-effect rounded-2xl p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <i data-lucide="activity" className="w-5 h-5 mr-2 text-red-500"></i>
                        Dashboard de Obras Públicas
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{totalStats.total}</div>
                            <div className="text-sm text-gray-600">Total Obras</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{totalStats.completed}</div>
                            <div className="text-sm text-gray-600">Terminadas</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{totalStats.inProgress}</div>
                            <div className="text-sm text-gray-600">En Progreso</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{totalStats.interrupted}</div>
                            <div className="text-sm text-gray-600">Interrumpidas</div>
                        </div>
                    </div>
                </div>

                {/* Individual Work Progress Charts */}
                <div className="glass-effect rounded-2xl p-4">
                    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center">
                        <i data-lucide="target" className="w-4 h-4 mr-2 text-blue-500"></i>
                        Progreso Individual por Obra
                    </h3>
                    
                    {works.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                            {works.slice(0, 6).map((work) => (
                                <WorkProgressChart key={work.id} work={work} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <i data-lucide="inbox" className="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
                            <p className="text-gray-600 text-sm">No hay obras registradas</p>
                        </div>
                    )}
                </div>

                {/* Status Legend */}
                <div className="glass-effect rounded-2xl p-4">
                    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center">
                        <i data-lucide="info" className="w-4 h-4 mr-2 text-blue-500"></i>
                        Leyenda de Estados
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                            <i data-lucide="check-circle" className="w-4 h-4 text-green-500"></i>
                            <span className="text-sm text-gray-700">Terminado (100%)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <i data-lucide="play-circle" className="w-4 h-4 text-blue-500"></i>
                            <span className="text-sm text-gray-700">En ejecución</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <i data-lucide="pause-circle" className="w-4 h-4 text-red-500"></i>
                            <span className="text-sm text-gray-700">Interrumpido</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <i data-lucide="circle" className="w-4 h-4 text-gray-500"></i>
                            <span className="text-sm text-gray-700">No iniciado (0%)</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('PublicChartsPreview component error:', error);
        reportError(error);
    }
}
