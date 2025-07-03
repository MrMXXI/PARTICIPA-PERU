function WorkProgressChart({ work }) {
    try {
        const [animatedProgress, setAnimatedProgress] = React.useState(0);
        
        React.useEffect(() => {
            const timer = setTimeout(() => {
                setAnimatedProgress(work.progress);
            }, 300);
            
            return () => clearTimeout(timer);
        }, [work.progress]);

        const radius = 35;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

        const getStatusIcon = () => {
            switch (work.estado) {
                case 'terminado':
                    return 'check-circle';
                case 'si':
                    return 'play-circle';
                case 'interrumpido':
                    return 'pause-circle';
                default:
                    return 'circle';
            }
        };

        return (
            <div data-name="work-progress-chart" data-file="components/WorkProgressChart.js" 
                 className="glass-effect rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                        {/* Background circle */}
                        <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                            fill="transparent"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke={work.statusColor}
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 32}
                            strokeDashoffset={2 * Math.PI * 32 - (animatedProgress / 100) * 2 * Math.PI * 32}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            style={{
                                filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))'
                            }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-800">{work.progress}%</span>
                    </div>
                    <div className="absolute -top-1 -right-1">
                        <i data-lucide={getStatusIcon()} className="w-4 h-4" style={{ color: work.statusColor }}></i>
                    </div>
                </div>
                
                <h4 className="text-sm font-semibold text-gray-800 mb-1 h-8 overflow-hidden leading-4" title={work.obra}>
                    {work.obra.length > 30 ? work.obra.substring(0, 30) + '...' : work.obra}
                </h4>
                
                <p className="text-sm text-red-600 mb-1 font-medium truncate">{work.municipalidad}</p>
                
                <div className="text-sm text-gray-600 mb-1">
                    {work.estado === 'terminado' ? 'Terminado' :
                     work.estado === 'si' ? 'En ejecución' :
                     work.estado === 'interrumpido' ? 'Interrumpido' : 'No iniciado'}
                </div>
                
                <div className="text-sm text-green-600 font-semibold">
                    S/ {(Number(work.inversion) / 1000).toFixed(0)}K
                </div>
                
                <div className="text-sm text-gray-500 mt-1 truncate">
                    {work.codigo}
                </div>
            </div>
        );
    } catch (error) {
        console.error('WorkProgressChart component error:', error);
        reportError(error);
    }
}
