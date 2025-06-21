function RankingDashboard() {
    try {
        const [rankingData, setRankingData] = React.useState([]);
        const [loading, setLoading] = React.useState(false);
        const [lastUpdate, setLastUpdate] = React.useState(new Date());

        const loadRankingAnalysis = async () => {
            setLoading(true);
            try {
                const participationsResponse = await trickleListObjects('citizen_participation', 100, true);
                const budgetResponse = await trickleListObjects('budget_project', 100, true);
                
                const participations = participationsResponse.items;
                const projects = budgetResponse.items;

                const workAnalysis = {};
                
                for (const participation of participations) {
                    const { codigoObra, observaciones } = participation.objectData;
                    
                    const project = projects.find(p => p.objectData.codigo === codigoObra);
                    if (!project) continue;
                    
                    if (!workAnalysis[codigoObra]) {
                        workAnalysis[codigoObra] = {
                            codigo: codigoObra,
                            obra: project.objectData.obra,
                            distrito: project.objectData.municipalidad,
                            estado: project.objectData.estado,
                            criticisms: [],
                            adjectives: {}
                        };
                    }
                    
                    const analysis = await AIAnalysisUtils.analyzeObservations(observaciones);
                    
                    workAnalysis[codigoObra].criticisms.push(analysis);
                    
                    // Count adjectives
                    const adj = analysis.mainAdjective;
                    workAnalysis[codigoObra].adjectives[adj] = 
                        (workAnalysis[codigoObra].adjectives[adj] || 0) + 1;
                }

                // Process ranking
                const ranking = Object.values(workAnalysis)
                    .filter(work => work.criticisms.length > 0)
                    .sort((a, b) => b.criticisms.length - a.criticisms.length)
                    .slice(0, 10)
                    .map(work => {
                        const totalCritics = work.criticisms.length;
                        const disapprovals = work.criticisms.filter(c => c.sentiment === 'DESAPROBACION').length;
                        
                        // Find most common adjective
                        const mainAdjective = Object.entries(work.adjectives)
                            .sort((a, b) => b[1] - a[1])[0];
                        
                        return {
                            ...work,
                            totalCritics,
                            criticismRate: Math.round((disapprovals / totalCritics) * 100),
                            mainAdjective: mainAdjective ? mainAdjective[0] : 'regular',
                            adjectivePercentage: mainAdjective ? 
                                Math.round((mainAdjective[1] / totalCritics) * 100) : 0
                        };
                    });

                setRankingData(ranking);
                setLastUpdate(new Date());
            } catch (error) {
                console.error('Error loading ranking analysis:', error);
            } finally {
                setLoading(false);
            }
        };

        React.useEffect(() => {
            loadRankingAnalysis();
        }, []);

        React.useEffect(() => {
            lucide.createIcons();
        }, [rankingData]);

        if (loading) {
            return (
                <div data-name="ranking-loading" data-file="components/RankingDashboard.js" className="glass-effect rounded-2xl p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Analizando con IA...</p>
                </div>
            );
        }

        return (
            <div data-name="ranking-dashboard" data-file="components/RankingDashboard.js" className="space-y-6">
                <div className="glass-effect rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <i data-lucide="award" className="w-8 h-8 mr-3 text-red-500"></i>
                            Ranking IA - Obras Más Criticadas
                        </h2>
                        <div className="text-gray-600 text-sm">
                            Última actualización: {lastUpdate.toLocaleTimeString('es-PE')}
                        </div>
                    </div>
                    
                    <button
                        onClick={loadRankingAnalysis}
                        className="btn-primary px-6 py-2 rounded-lg mb-6"
                    >
                        Actualizar Ranking
                    </button>
                </div>

                {rankingData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rankingData.map((work, index) => (
                            <div key={work.codigo} className="glass-effect rounded-2xl p-6">
                                <div className="text-center mb-4">
                                    <div className="text-2xl font-bold text-red-500 mb-2">#{index + 1}</div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{work.obra}</h3>
                                    <div className="text-gray-600 text-sm mb-4">{work.distrito}</div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Total críticas:</span>
                                        <span className="font-semibold">{work.totalCritics}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">% Desaprobación:</span>
                                        <span className="text-red-500 font-semibold">{work.criticismRate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Adjetivo principal:</span>
                                        <span className="text-blue-600 font-semibold capitalize">
                                            {work.mainAdjective.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">% Adjetivo:</span>
                                        <span className="font-semibold">{work.adjectivePercentage}%</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="text-gray-700 text-sm">Estado actual:</div>
                                        <div className="text-green-600 font-medium capitalize">
                                            {work.estado === 'si' ? 'En ejecución' : 
                                             work.estado === 'terminado' ? 'Terminado' :
                                             work.estado === 'interrumpido' ? 'Interrumpido' : 'No iniciado'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-effect rounded-2xl p-8 text-center">
                        <i data-lucide="inbox" className="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                        <p className="text-gray-600">No hay suficientes observaciones para generar ranking</p>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('RankingDashboard component error:', error);
        reportError(error);
    }
}
