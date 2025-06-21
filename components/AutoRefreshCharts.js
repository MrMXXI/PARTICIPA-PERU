function AutoRefreshCharts() {
    try {
        const [topMunicipalities, setTopMunicipalities] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [lastUpdate, setLastUpdate] = React.useState(new Date());

        const loadMunicipalityRanking = async () => {
            try {
                const participationsResponse = await trickleListObjects('citizen_participation', 200, true);
                const budgetResponse = await trickleListObjects('budget_project', 200, true);
                
                const participations = participationsResponse.items;
                const projects = budgetResponse.items;

                const municipalityAnalysis = {};
                
                for (const participation of participations) {
                    const { codigoObra, observaciones } = participation.objectData;
                    
                    const project = projects.find(p => p.objectData.codigo === codigoObra);
                    if (!project) continue;
                    
                    const municipality = project.objectData.municipalidad;
                    
                    if (!municipalityAnalysis[municipality]) {
                        municipalityAnalysis[municipality] = {
                            name: municipality,
                            totalObservations: 0,
                            approvals: 0,
                            disapprovals: 0,
                            reasons: []
                        };
                    }
                    
                    const analysis = await AIAnalysisUtils.analyzeObservations(observaciones);
                    
                    municipalityAnalysis[municipality].totalObservations++;
                    municipalityAnalysis[municipality].reasons.push(analysis.mainAdjective);
                    
                    if (analysis.sentiment === 'APROBACION') {
                        municipalityAnalysis[municipality].approvals++;
                    } else if (analysis.sentiment === 'DESAPROBACION') {
                        municipalityAnalysis[municipality].disapprovals++;
                    }
                }

                const sortedMunicipalities = Object.values(municipalityAnalysis)
                    .sort((a, b) => b.totalObservations - a.totalObservations)
                    .slice(0, 10)
                    .map(municipality => ({
                        ...municipality,
                        approvalRate: municipality.totalObservations > 0 ? 
                            Math.round((municipality.approvals / municipality.totalObservations) * 100) : 0,
                        disapprovalRate: municipality.totalObservations > 0 ? 
                            Math.round((municipality.disapprovals / municipality.totalObservations) * 100) : 0,
                        mainReason: municipality.reasons.length > 0 ? 
                            municipality.reasons.sort((a,b) => 
                                municipality.reasons.filter(v => v === b).length - 
                                municipality.reasons.filter(v => v === a).length
                            )[0] : 'Sin datos'
                    }));

                setTopMunicipalities(sortedMunicipalities);
                setLastUpdate(new Date());
            } catch (error) {
                console.error('Error loading municipality ranking:', error);
            } finally {
                setLoading(false);
            }
        };

        React.useEffect(() => {
            loadMunicipalityRanking();
            const interval = setInterval(loadMunicipalityRanking, 5 * 60 * 1000); // 5 minutes
            return () => clearInterval(interval);
        }, []);

        React.useEffect(() => {
            lucide.createIcons();
        }, [topMunicipalities]);

        if (loading) {
            return (
                <div data-name="auto-refresh-loading" data-file="components/AutoRefreshCharts.js" className="glass-effect rounded-2xl p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando rankings en tiempo real...</p>
                </div>
            );
        }

        return (
            <div data-name="auto-refresh-charts" data-file="components/AutoRefreshCharts.js" className="space-y-6">
                <div className="glass-effect rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <i data-lucide="trending-up" className="w-8 h-8 mr-3 text-red-500"></i>
                            Top 10 Municipalidades - Rankings en Vivo
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

                {topMunicipalities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topMunicipalities.map((municipality, index) => (
                            <div key={municipality.name} className="glass-effect rounded-2xl p-6">
                                <div className="text-center mb-4">
                                    <div className="text-2xl font-bold text-red-500 mb-2">#{index + 1}</div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{municipality.name}</h3>
                                    <div className="text-gray-600 text-sm mb-4">
                                        {municipality.totalObservations} observaciones
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-green-600">Aprobación:</span>
                                        <span className="text-gray-800">{municipality.approvalRate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-red-600">Desaprobación:</span>
                                        <span className="text-gray-800">{municipality.disapprovalRate}%</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="text-gray-600 text-sm">Principal razón:</div>
                                        <div className="text-blue-600 font-medium capitalize">{municipality.mainReason.replace('_', ' ')}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-effect rounded-2xl p-8 text-center">
                        <i data-lucide="inbox" className="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                        <p className="text-gray-600">No hay suficientes observaciones para generar rankings</p>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('AutoRefreshCharts component error:', error);
        reportError(error);
    }
}
