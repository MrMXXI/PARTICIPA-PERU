function CriticismChart({ workData }) {
    try {
        const [animatedPercentage, setAnimatedPercentage] = React.useState(0);
        
        React.useEffect(() => {
            const timer = setTimeout(() => {
                setAnimatedPercentage(workData.criticismRate);
            }, 300);
            
            return () => clearTimeout(timer);
        }, [workData.criticismRate]);

        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

        const getCriticismColor = (rate) => {
            if (rate >= 70) return '#EF4444'; // Red - High criticism
            if (rate >= 40) return '#F59E0B'; // Orange - Medium criticism
            return '#10B981'; // Green - Low criticism
        };

        const getCriticismLevel = (rate) => {
            if (rate >= 70) return 'Alta';
            if (rate >= 40) return 'Media';
            return 'Baja';
        };

        return (
            <div data-name="criticism-chart" data-file="components/CriticismChart.js" 
                 className="glass-effect rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-300">
                <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="transparent"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke={getCriticismColor(workData.criticismRate)}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800">{workData.criticismRate}%</span>
                    </div>
                    <div className="absolute -top-1 -right-1">
                        <i data-lucide="alert-triangle" className="w-4 h-4" style={{ color: getCriticismColor(workData.criticismRate) }}></i>
                    </div>
                </div>
                
                <h4 className="text-xs font-semibold text-gray-800 mb-1 h-8 overflow-hidden" title={workData.obra}>
                    {workData.obra.length > 25 ? workData.obra.substring(0, 25) + '...' : workData.obra}
                </h4>
                
                <p className="text-xs text-red-600 mb-1 font-medium">{workData.distrito}</p>
                
                <div className="text-xs mb-1" style={{ color: getCriticismColor(workData.criticismRate) }}>
                    Críticas: {getCriticismLevel(workData.criticismRate)}
                </div>
                
                <div className="text-xs text-blue-600 font-semibold mb-1 capitalize">
                    {workData.mainAdjective.replace('_', ' ')}
                </div>
                
                <div className="text-xs text-gray-600">
                    {workData.adjectivePercentage}% coincidencia
                </div>
                
                <div className="text-xs text-gray-500 mt-1">
                    {workData.totalCritics} observaciones
                </div>
            </div>
        );
    } catch (error) {
        console.error('CriticismChart component error:', error);
        reportError(error);
    }
}
