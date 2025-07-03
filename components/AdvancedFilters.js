function AdvancedFilters({ onFiltersChange, municipalities }) {
    try {
        const [filters, setFilters] = React.useState({
            municipalidad: '',
            estado: '',
            inversionMin: '',
            inversionMax: '',
            fechaDesde: '',
            fechaHasta: ''
        });

        const handleFilterChange = (key, value) => {
            const newFilters = { ...filters, [key]: value };
            setFilters(newFilters);
            onFiltersChange(newFilters);
        };

        const clearFilters = () => {
            const emptyFilters = {
                municipalidad: '',
                estado: '',
                inversionMin: '',
                inversionMax: '',
                fechaDesde: '',
                fechaHasta: ''
            };
            setFilters(emptyFilters);
            onFiltersChange(emptyFilters);
        };

        return (
            <div data-name="advanced-filters" data-file="components/AdvancedFilters.js" className="glass-effect rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <i data-lucide="filter" className="w-5 h-5 mr-2 text-blue-500"></i>
                    Filtros Avanzados
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Municipalidad</label>
                        <select
                            value={filters.municipalidad}
                            onChange={(e) => handleFilterChange('municipalidad', e.target.value)}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                        >
                            <option value="">Todas las municipalidades</option>
                            {municipalities.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Estado</label>
                        <select
                            value={filters.estado}
                            onChange={(e) => handleFilterChange('estado', e.target.value)}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                        >
                            <option value="">Todos los estados</option>
                            <option value="no">No iniciado</option>
                            <option value="si">En ejecución</option>
                            <option value="terminado">Terminado</option>
                            <option value="interrumpido">Interrumpido</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Inversión Mínima (S/)</label>
                        <input
                            type="number"
                            value={filters.inversionMin}
                            onChange={(e) => handleFilterChange('inversionMin', e.target.value)}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                            placeholder="0"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Inversión Máxima (S/)</label>
                        <input
                            type="number"
                            value={filters.inversionMax}
                            onChange={(e) => handleFilterChange('inversionMax', e.target.value)}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                            placeholder="999999999"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Fecha Desde</label>
                        <input
                            type="date"
                            value={filters.fechaDesde}
                            onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Fecha Hasta</label>
                        <input
                            type="date"
                            value={filters.fechaHasta}
                            onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                        />
                    </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-4">
                    <button
                        onClick={clearFilters}
                        className="btn-secondary px-6 py-2 rounded-lg"
                    >
                        Limpiar Filtros
                    </button>
                    <button
                        onClick={() => {}}
                        className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
                    >
                        <i data-lucide="search" className="w-4 h-4"></i>
                        <span>Buscar</span>
                    </button>
                </div>
            </div>
        );
    } catch (error) {
        console.error('AdvancedFilters component error:', error);
        reportError(error);
    }
}