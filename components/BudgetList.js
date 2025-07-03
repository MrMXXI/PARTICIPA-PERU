function BudgetList({ user, refreshTrigger, onEditProject }) {
    try {
        const [projects, setProjects] = React.useState([]);
        const [loading, setLoading] = React.useState(true);

        const loadProjects = async () => {
            try {
                const response = await trickleListObjects('budget_project', 50, true);
                const userProjects = response.items.filter(
                    item => item.objectData.municipalidad === user.municipality
                );
                setProjects(userProjects);
            } catch (error) {
                console.error('Error loading projects:', error);
            } finally {
                setLoading(false);
            }
        };

        React.useEffect(() => {
            loadProjects();
        }, [refreshTrigger]);

        React.useEffect(() => {
            lucide.createIcons();
        }, [projects]);

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
                <div data-name="budget-list-loading" data-file="components/BudgetList.js" className="glass-effect rounded-2xl p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando obras...</p>
                </div>
            );
        }

        return (
            <div data-name="budget-list" data-file="components/BudgetList.js" className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <i data-lucide="list" className="w-6 h-6 mr-2 text-red-500"></i>
                    Obras Registradas ({projects.length})
                </h3>
                
                {projects.length === 0 ? (
                    <div className="text-center py-8">
                        <i data-lucide="inbox" className="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                        <p className="text-gray-600">No hay obras registradas aún</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left text-gray-700 py-3 px-2 font-semibold">Código</th>
                                    <th className="text-left text-gray-700 py-3 px-2 font-semibold">Obra</th>
                                    <th className="text-left text-gray-700 py-3 px-2 font-semibold">Inversión</th>
                                    <th className="text-left text-gray-700 py-3 px-2 font-semibold">Estado</th>
                                    <th className="text-left text-gray-700 py-3 px-2 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.objectId} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-2 text-gray-800 font-mono text-sm">
                                            {project.objectData.codigo}
                                        </td>
                                        <td className="py-3 px-2 text-gray-800">
                                            {project.objectData.obra}
                                        </td>
                                        <td className="py-3 px-2 text-green-600 font-semibold">
                                            S/ {Number(project.objectData.inversion).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.objectData.estado)}`}>
                                                {getStatusText(project.objectData.estado)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2">
                                            <button
                                                onClick={() => onEditProject(project)}
                                                className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                            >
                                                <i data-lucide="edit" className="w-3 h-3"></i>
                                                <span>Editar</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('BudgetList component error:', error);
        reportError(error);
    }
}
