function SatisfactionPieChart({ workData }) {
    try {
        const canvasRef = React.useRef(null);
        const chartRef = React.useRef(null);
        const [isVisible, setIsVisible] = React.useState(false);
        const [animatedSatisfaction, setAnimatedSatisfaction] = React.useState(0);

        React.useEffect(() => {
            const timer = setTimeout(() => {
                setIsVisible(true);
                setAnimatedSatisfaction(100 - workData.criticismRate);
            }, 300);
            return () => clearTimeout(timer);
        }, [workData.criticismRate]);

        React.useEffect(() => {
            if (canvasRef.current && workData && isVisible) {
                const ctx = canvasRef.current.getContext('2d');
                
                if (chartRef.current) {
                    chartRef.current.destroy();
                }

                const satisfactionRate = 100 - workData.criticismRate;
                
                chartRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Satisfacción', 'Insatisfacción'],
                        datasets: [{
                            data: [satisfactionRate, workData.criticismRate],
                            backgroundColor: ['#10B981', '#EF4444'],
                            borderColor: '#ffffff',
                            borderWidth: 3,
                            hoverOffset: 15
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                            animateRotate: true,
                            duration: 2500,
                            easing: 'easeOutBounce'
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.label + ': ' + context.parsed + '%';
                                    }
                                }
                            }
                        },
                        cutout: '65%'
                    }
                });
            }
        }, [workData, isVisible]);

        React.useEffect(() => {
            return () => {
                if (chartRef.current) {
                    chartRef.current.destroy();
                }
            };
        }, []);

        const getStatusText = (estado) => {
            switch (estado) {
                case 'si': return 'En ejecución';
                case 'terminado': return 'Terminado';
                case 'interrumpido': return 'Interrumpido';
                default: return 'No iniciado';
            }
        };

        const getStatusColor = (estado) => {
            switch (estado) {
                case 'si': return 'text-blue-600';
                case 'terminado': return 'text-green-600';
                case 'interrumpido': return 'text-red-600';
                default: return 'text-gray-600';
            }
        };

        const satisfactionRate = 100 - workData.criticismRate;

        return (
            <div data-name="satisfaction-pie-chart" data-file="components/SatisfactionPieChart.js" 
                 className={`glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-700 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2 truncate" title={workData.obra}>
                        {workData.obra.length > 30 ? workData.obra.substring(0, 30) + '...' : workData.obra}
                    </h4>
                    <div className="text-sm text-red-600 font-medium mb-1">{workData.codigo}</div>
                    <div className={`text-sm font-medium ${getStatusColor(workData.estado)}`}>
                        {getStatusText(workData.estado)}
                    </div>
                </div>
                
                <div className="relative h-48 mb-4">
                    <canvas ref={canvasRef}></canvas>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bounce-animation">
                            <div className="text-3xl font-bold text-gray-800">
                                {animatedSatisfaction}%
                            </div>
                            <div className="text-xs text-gray-600">Satisfacción</div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">Satisfacción</span>
                        </div>
                        <span className="text-green-600 font-semibold">{satisfactionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">Insatisfacción</span>
                        </div>
                        <span className="text-red-600 font-semibold">{workData.criticismRate}%</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 text-center">
                        <div className="text-xs text-gray-600">Período de Ejecución</div>
                        <div className="text-xs text-gray-800 mb-1">
                            {workData.fechaInicio ? new Date(workData.fechaInicio).toLocaleDateString('es-PE') : 'No definido'} - 
                            {workData.fechaFinalizacion ? new Date(workData.fechaFinalizacion).toLocaleDateString('es-PE') : 'No definido'}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                            {workData.totalCritics} observaciones ciudadanas
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('SatisfactionPieChart component error:', error);
        reportError(error);
    }
}
