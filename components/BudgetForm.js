function BudgetForm({ user, onProjectAdded, editingProject, onCancelEdit }) {
    try {
        const [formData, setFormData] = React.useState({
            codigo: '',
            obra: '',
            inversion: '',
            contratista: '',
            estado: 'no',
            fechaInicio: '',
            fechaFinalizacion: ''
        });
        const [loading, setLoading] = React.useState(false);

        React.useEffect(() => {
            if (editingProject) {
                setFormData(editingProject.objectData);
            } else {
                setFormData({
                    codigo: '',
                    obra: '',
                    inversion: '',
                    contratista: '',
                    estado: 'no',
                    fechaInicio: '',
                    fechaFinalizacion: ''
                });
            }
        }, [editingProject]);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                const projectData = {
                    ...formData,
                    municipalidad: user.municipality,
                    fechaRegistro: editingProject ? editingProject.objectData.fechaRegistro : new Date().toISOString()
                };
                
                if (editingProject) {
                    await trickleUpdateObject('budget_project', editingProject.objectId, projectData);
                    alert('Proyecto actualizado exitosamente');
                    onCancelEdit();
                } else {
                    await trickleCreateObject('budget_project', projectData);
                    alert('Proyecto registrado exitosamente');
                }
                
                onProjectAdded();
                setFormData({
                    codigo: '',
                    obra: '',
                    inversion: '',
                    contratista: '',
                    estado: 'no',
                    fechaInicio: '',
                    fechaFinalizacion: ''
                });
            } catch (error) {
                console.error('Error saving project:', error);
                alert('Error al guardar el proyecto');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div data-name="budget-form" data-file="components/BudgetForm.js" className="glass-effect rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <i data-lucide={editingProject ? "edit" : "plus-circle"} className="w-6 h-6 mr-2 text-red-500"></i>
                    {editingProject ? 'Editar Obra' : 'Registrar Nueva Obra'}
                </h3>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Código de Obra</label>
                        <input
                            type="text"
                            value={formData.codigo}
                            onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                            placeholder="Ej: LIMA-2024-001"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Inversión (S/)</label>
                        <input
                            type="number"
                            value={formData.inversion}
                            onChange={(e) => setFormData({...formData, inversion: e.target.value})}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                            placeholder="Monto de inversión"
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2 font-medium">Descripción de la Obra</label>
                        <input
                            type="text"
                            value={formData.obra}
                            onChange={(e) => setFormData({...formData, obra: e.target.value})}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                            placeholder="Descripción detallada de la obra"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Contratista</label>
                        <input
                            type="text"
                            value={formData.contratista}
                            onChange={(e) => setFormData({...formData, contratista: e.target.value})}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                            placeholder="Empresa contratista"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Estado de Ejecución</label>
                        <select
                            value={formData.estado}
                            onChange={(e) => setFormData({...formData, estado: e.target.value})}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                        >
                            <option value="no">No iniciado</option>
                            <option value="si">En ejecución</option>
                            <option value="terminado">Terminado</option>
                            <option value="interrumpido">Interrumpido</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Fecha de Inicio</label>
                        <input
                            type="date"
                            value={formData.fechaInicio}
                            onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Fecha Proyectada de Finalización</label>
                        <input
                            type="date"
                            value={formData.fechaFinalizacion}
                            onChange={(e) => setFormData({...formData, fechaFinalizacion: e.target.value})}
                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 py-3 font-semibold rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar Registro'}
                        </button>
                        {editingProject && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="btn-secondary px-6 py-3 font-semibold rounded-lg"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        );
    } catch (error) {
        console.error('BudgetForm component error:', error);
        reportError(error);
    }
}
