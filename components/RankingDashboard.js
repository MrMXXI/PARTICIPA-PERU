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
                            fechaInicio: project.objectData.fechaInicio,
                            fechaFinalizacion: project.objectData.fechaFinalizacion,
                            criticisms: [],
                            adjectives: {}
                        };
                    }
                    
                    const analysis = await AIAnalysisUtils.analyzeObservations(observaciones);
                    
                    workAnalysis[codigoObra].criticisms.push(analysis);
                    
                    const adj = analysis.mainAdjective;
                    workAnalysis[codigoObra].adjectives[adj] = 
                        (workAnalysis[codigoObra].adjectives[adj] || 0) + 1;
                }

                // Get top 5 most criticized works
                const ranking = Object.values(workAnalysis)
                    .filter(work => work.criticisms.length > 0)
                    .sort((a, b) => b.criticisms.length - a.criticisms.length)
                    .slice(0, 5)
                    .map(work => {
                        const totalCritics = work.criticisms.length;
                        const disapprovals = work.criticisms.filter(c => c.sentiment === 'DESAPROBACION').length;
                        
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
                    <p className="text-gray-600">Analizando críticas con IA...</p>
                </div>
            );
        }

        return (
            <div data-name="ranking-dashboard" data-file="components/RankingDashboard.js" className="space-y-6">
                <div className="glass-effect rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <i data-lucide="award" className="w-8 h-8 mr-3 text-red-500"></i>
                            Ranking IA - Top 5 Obras Más Criticadas
                        </h2>
                        <div className="text-gray-600 text-sm">
                            Última actualización: {lastUpdate.toLocaleTimeString('es-PE')}
                        </div>
                    </div>
                    
                    <button
                        onClick={loadRankingAnalysis}
                        className="btn-primary px-6 py-2 rounded-lg mb-6"
                    >
                        Actualizar Ranking IA
                    </button>

                    <div className="text-center mb-6">
                        <p className="text-gray-600 text-lg">
                            📊 Gráficos de Satisfacción/Insatisfacción Ciudadana
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Basados en análisis de IA de observaciones ciudadanas
                        </p>
                    </div>
                </div>

                {rankingData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {rankingData.map((work, index) => (
                            <div key={work.codigo} className="relative">
                                <div className="absolute -top-3 -left-3 z-10 pulse-animation">
                                    <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                                        #{index + 1}
                                    </div>
                                </div>
                                <SatisfactionPieChart workData={work} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-effect rounded-2xl p-8 text-center">
                        <i data-lucide="inbox" className="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                        <p className="text-gray-600">No hay suficientes observaciones para generar ranking</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Se necesitan al menos 5 obras con observaciones ciudadanas
                        </p>
                    </div>
                )}

                {rankingData.length > 0 && (
                    <div className="glass-effect rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Resumen de Análisis IA</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3">🔴 Obras con Mayor Insatisfacción</h4>
                                <div className="space-y-2">
                                    {rankingData.slice(0, 3).map((work, index) => (
                                        <div key={work.codigo} className="flex justify-between items-center bg-red-50 p-2 rounded">
                                            <span className="text-sm text-gray-600">#{index + 1} {work.obra.substring(0, 25)}...</span>
                                            <span className="text-red-600 font-semibold">{work.criticismRate}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3">⚡ Estados de Ejecución</h4>
                                <div className="space-y-2">
                                    {['si', 'terminado', 'interrumpido'].map(estado => {
                                        const count = rankingData.filter(w => w.estado === estado).length;
                                        const statusText = estado === 'si' ? 'En ejecución' : 
                                                         estado === 'terminado' ? 'Terminado' : 'Interrumpido';
                                        const bgColor = estado === 'si' ? 'bg-blue-50' : 
                                                       estado === 'terminado' ? 'bg-green-50' : 'bg-red-50';
                                        return (
                                            <div key={estado} className={`flex justify-between items-center ${bgColor} p-2 rounded`}>
                                                <span className="text-sm text-gray-600">{statusText}</span>
                                                <span className="text-blue-600 font-semibold">{count} obras</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('RankingDashboard component error:', error);
        reportError(error);
    }
}
