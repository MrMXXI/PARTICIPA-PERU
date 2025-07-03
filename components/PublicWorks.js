function PublicWorks() {
    try {
        const [works, setWorks] = React.useState([]);
        const [participations, setParticipations] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [filter, setFilter] = React.useState('');
        const [filters, setFilters] = React.useState({});

        const municipalities = [
            'Lima Metropolitana', 'Ate', 'Barranco', 'Breña', 'Comas', 'Chorrillos',
            'El Agustino', 'Jesús María', 'La Molina', 'La Victoria', 'Lince',
            'Los Olivos', 'Magdalena del Mar', 'Miraflores', 'Pueblo Libre',
            'Puente Piedra', 'Rímac', 'San Borja', 'San Isidro', 'San Juan de Lurigancho',
            'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel',
            'Santa Anita', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador',
            'Villa María del Triunfo'
        ];

        const loadWorks = async () => {
            try {
                const worksResponse = await trickleListObjects('budget_project', 100, true);
                const participationsResponse = await trickleListObjects('citizen_participation', 100, true);
                setWorks(worksResponse.items);
                setParticipations(participationsResponse.items);
            } catch (error) {
                console.error('Error loading works:', error);
            } finally {
                setLoading(false);
            }
        };

        React.useEffect(() => {
            loadWorks();
        }, []);

        const applyFilters = (works) => {
            return works.filter(work => {
                const data = work.objectData;
                
                // Text search
                const matchesText = !filter || 
                    data.municipalidad.toLowerCase().includes(filter.toLowerCase()) ||
                    data.obra.toLowerCase().includes(filter.toLowerCase()) ||
                    data.codigo.toLowerCase().includes(filter.toLowerCase());
                
                // Advanced filters
                const matchesMunicipality = !filters.municipalidad || data.municipalidad === filters.municipalidad;
                const matchesState = !filters.estado || data.estado === filters.estado;
                const matchesMinInversion = !filters.inversionMin || Number(data.inversion) >= Number(filters.inversionMin);
                const matchesMaxInversion = !filters.inversionMax || Number(data.inversion) <= Number(filters.inversionMax);
                
                let matchesDateRange = true;
                if (filters.fechaDesde && filters.fechaHasta) {
                    const workDate = new Date(data.fechaInicio);
                    const fromDate = new Date(filters.fechaDesde);
                    const toDate = new Date(filters.fechaHasta);
                    matchesDateRange = workDate >= fromDate && workDate <= toDate;
                }
                
                return matchesText && matchesMunicipality && matchesState && 
                       matchesMinInversion && matchesMaxInversion && matchesDateRange;
            });
        };

        const filteredWorks = applyFilters(works);

        const getStatusColor = (estado) => {
            switch (estado) {
                case 'si': return 'bg-blue-100 text-blue-800';
                case 'terminado': return 'bg-green-100 text-green-800';
                case 'interrumpido': return 'bg-red-100 text-red-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        const getStatusText = (estado) => {
            switch (estado) {
                case 'si': return 'En ejecución';
                case 'no': return 'No iniciado';
                case 'terminado': return 'Terminado';
                case 'interrumpido': return 'Interrumpido';
                default: return estado;
            }
        };

        if (loading) {
            return (
                <div data-name="public-works-loading" data-file="components/PublicWorks.js" className="glass-effect rounded-2xl p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando obras públicas...</p>
                </div>
            );
        }

        return (
            <div data-name="public-works" data-file="components/PublicWorks.js" className="space-y-6">
                <div className="glass-effect rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i data-lucide="building-2" className="w-8 h-8 mr-3 text-red-500"></i>
                        Obras Públicas del Perú ({filteredWorks.length})
                    </h2>
                    
                    <div className="mb-6 flex gap-4">
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="form-input flex-1 px-4 py-3 rounded-lg focus:outline-none"
                            placeholder="Buscar por municipalidad, obra o código..."
                        />
                        <button
                            onClick={() => {}}
                            className="btn-primary px-6 py-3 rounded-lg flex items-center space-x-2"
                        >
                            <i data-lucide="search" className="w-5 h-5"></i>
                            <span>Buscar</span>
                        </button>
                    </div>
                </div>

                <AdvancedFilters 
                    onFiltersChange={setFilters} 
                    municipalities={municipalities}
                />

                <ExportData 
                    works={filteredWorks} 
                    participations={participations}
                />

                <div className="glass-effect rounded-2xl p-6">
                    {filteredWorks.length === 0 ? (
                        <div className="text-center py-8">
                            <i data-lucide="search" className="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                            <p className="text-gray-600">No se encontraron obras</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left text-gray-700 py-3 px-2 font-semibold">Código</th>
                                        <th className="text-left text-gray-700 py-3 px-2 font-semibold">Municipalidad</th>
                                        <th className="text-left text-gray-700 py-3 px-2 font-semibold">Obra</th>
                                        <th className="text-left text-gray-700 py-3 px-2 font-semibold">Inversión</th>
                                        <th className="text-left text-gray-700 py-3 px-2 font-semibold">Estado</th>
                                        <th className="text-left text-gray-700 py-3 px-2 font-semibold">Fecha Fin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredWorks.map((work) => (
                                        <tr key={work.objectId} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-2 text-gray-800 font-mono text-sm">
                                                {work.objectData.codigo}
                                            </td>
                                            <td className="py-3 px-2 text-red-600 font-medium">
                                                {work.objectData.municipalidad}
                                            </td>
                                            <td className="py-3 px-2 text-gray-800">
                                                {work.objectData.obra}
                                            </td>
                                            <td className="py-3 px-2 text-green-600 font-semibold">
                                                S/ {Number(work.objectData.inversion).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.objectData.estado)}`}>
                                                    {getStatusText(work.objectData.estado)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-gray-600 text-sm">
                                                {new Date(work.objectData.fechaFinalizacion).toLocaleDateString('es-PE')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('PublicWorks component error:', error);
        reportError(error);
    }
}
