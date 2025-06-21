function AnalysisDashboard() {
    try {
        const [analysisData, setAnalysisData] = React.useState(null);
        const [loading, setLoading] = React.useState(false);
        const [topWorks, setTopWorks] = React.useState([]);

        const loadAnalysis = async () => {
            setLoading(true);
            try {
                const participationsResponse = await trickleListObjects('citizen_participation', 100, true);
                const budgetResponse = await trickleListObjects('budget_project', 100, true);
                
                const participations = participationsResponse.items;
                const projects = budgetResponse.items;

                const workAnalysis = {};
                
                for (const participation of participations) {
                    const { codigoObra, observaciones, distrito } = participation.objectData;
                    
                    if (!workAnalysis[codigoObra]) {
                        const project = projects.find(p => p.objectData.codigo === codigoObra);
                        workAnalysis[codigoObra] = {
                            codigo: codigoObra,
                            obra: project?.objectData.obra || 'Obra no encontrada',
                            distrito: project?.objectData.municipalidad || distrito,
                            observations: [],
                            totalObservations: 0,
                            approvals: 0,
                            disapprovals: 0
                        };
                    }
                    
                    const analysis = await AIAnalysisUtils.analyzeObservations(observaciones);
                    
                    workAnalysis[codigoObra].observations.push({
                        ...analysis,
                        citizen: participation.objectData.nombre,
                        distrito: distrito
                    });
                    
                    workAnalysis[codigoObra].totalObservations++;
                    
                    if (analysis.sentiment === 'APROBACION') {
                        workAnalysis[codigoObra].approvals++;
                    } else if (analysis.sentiment === 'DESAPROBACION') {
                        workAnalysis[codigoObra].disapprovals++;
                    }
                }

                const sortedWorks = Object.values(workAnalysis)
                    .sort((a, b) => b.totalObservations - a.totalObservations)
                    .slice(0, 10)
                    .map(work => ({
                        ...work,
                        approvalRate: work.totalObservations > 0 ? 
                            Math.round((work.approvals / work.totalObservations) * 100) : 0,
                        disapprovalRate: work.totalObservations > 0 ? 
                            Math.round((work.disapprovals / work.totalObservations) * 100) : 0
                    }));

                setTopWorks(sortedWorks);
                setAnalysisData(workAnalysis);
            } catch (error) {
                console.error('Error loading analysis:', error);
            } finally {
                setLoading(false);
            }
        };

        React.useEffect(() => {
            loadAnalysis();
        }, []);

        React.useEffect(() => {
            lucide.createIcons();
        }, [topWorks]);

        if (loading) {
            return (
                <div data-name="analysis-loading" data-file="components/AnalysisDashboard.js" className="glass-effect rounded-2xl p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Analizando observaciones con IA...</p>
                </div>
            );
        }

        return (
            <div data-name="analysis-dashboard" data-file="components/AnalysisDashboard.js" className="space-y-6">
                <div className="glass-effect rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i data-lucide="brain" className="w-8 h-8 mr-3 text-red-500"></i>
                        Análisis IA - Top 10 Obras Más Observadas
                    </h2>
                    
                    <button
                        onClick={loadAnalysis}
                        className="btn-primary px-6 py-2 rounded-lg mb-6"
                    >
                        Actualizar Análisis
                    </button>
                </div>

                {topWorks.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PieChart 
                            data={topWorks} 
                            title="Ranking de Aprobación por Distrito"
                        />
                        
                        <div className="glass-effect rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Ranking Detallado</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {topWorks.map((work, index) => (
                                    <div key={work.codigo} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-red-500 font-bold">#{index + 1}</span>
                                            <span className="text-gray-500 text-sm">{work.codigo}</span>
                                        </div>
                                        <h4 className="text-gray-800 font-semibold mb-1">{work.obra}</h4>
                                        <p className="text-gray-600 text-sm mb-2">{work.distrito}</p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">
                                                Aprobación: {work.approvalRate}%
                                            </span>
                                            <span className="text-red-600">
                                                Desaprobación: {work.disapprovalRate}%
                                            </span>
                                        </div>
                                        <div className="text-gray-500 text-sm mt-1">
                                            Total observaciones: {work.totalObservations}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {topWorks.length === 0 && !loading && (
                    <div className="glass-effect rounded-2xl p-8 text-center">
                        <i data-lucide="inbox" className="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                        <p className="text-gray-600">No hay suficientes observaciones para generar análisis</p>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('AnalysisDashboard component error:', error);
        reportError(error);
    }
}
