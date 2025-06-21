function CitizenForm({ user }) {
    try {
        const [formData, setFormData] = React.useState({
            nombre: '',
            apellido: '',
            dni: '',
            distrito: '',
            telefono: '',
            codigoObra: '',
            observaciones: ''
        });
        const [loading, setLoading] = React.useState(false);
        const [charCount, setCharCount] = React.useState(0);
        const [savedObservations, setSavedObservations] = React.useState([]);
        const [editingObservation, setEditingObservation] = React.useState(null);

        const districts = [
            'Ate', 'Barranco', 'Breña', 'Comas', 'Chorrillos', 'El Agustino',
            'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos',
            'Magdalena del Mar', 'Miraflores', 'Pueblo Libre', 'Puente Piedra',
            'Rímac', 'San Borja', 'San Isidro', 'San Juan de Lurigancho',
            'San Juan de Miraflores', 'San Luis', 'San Martín de Porres',
            'San Miguel', 'Santa Anita', 'Santiago de Surco', 'Surquillo',
            'Villa El Salvador', 'Villa María del Triunfo'
        ];

        const loadObservations = async () => {
            try {
                const response = await trickleListObjects('citizen_participation', 50, true);
                const userObservations = response.items.filter(
                    item => item.objectData.email === user.email
                );
                setSavedObservations(userObservations);
            } catch (error) {
                console.error('Error loading observations:', error);
            }
        };

        React.useEffect(() => {
            loadObservations();
        }, []);

        React.useEffect(() => {
            if (editingObservation) {
                setFormData(editingObservation.objectData);
                setCharCount(editingObservation.objectData.observaciones.length);
            }
        }, [editingObservation]);

        const handleObservacionesChange = (e) => {
            const text = e.target.value;
            if (text.length <= 450) {
                setFormData({...formData, observaciones: text});
                setCharCount(text.length);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                const participationData = {
                    ...formData,
                    email: user.email,
                    provider: user.provider,
                    fechaParticipacion: editingObservation ? 
                        editingObservation.objectData.fechaParticipacion : 
                        new Date().toISOString()
                };
                
                if (editingObservation) {
                    await trickleUpdateObject('citizen_participation', editingObservation.objectId, participationData);
                    alert('Observación actualizada exitosamente');
                    setEditingObservation(null);
                } else {
                    await trickleCreateObject('citizen_participation', participationData);
                    alert('Observación registrada exitosamente');
                }
                
                setFormData({
                    nombre: '',
                    apellido: '',
                    dni: '',
                    distrito: '',
                    telefono: '',
                    codigoObra: '',
                    observaciones: ''
                });
                setCharCount(0);
                loadObservations();
            } catch (error) {
                console.error('Error saving participation:', error);
                alert('Error al guardar la observación');
            } finally {
                setLoading(false);
            }
        };

        const handleEdit = (observation) => {
            setEditingObservation(observation);
        };

        const handleCancelEdit = () => {
            setEditingObservation(null);
            setFormData({
                nombre: '',
                apellido: '',
                dni: '',
                distrito: '',
                telefono: '',
                codigoObra: '',
                observaciones: ''
            });
            setCharCount(0);
        };

        return (
            <div data-name="citizen-form" data-file="components/CitizenForm.js" className="space-y-6">
                <div className="glass-effect rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <i data-lucide="message-square" className="w-16 h-16 text-red-500 mx-auto mb-4"></i>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {editingObservation ? 'Editar Observación' : 'Nueva Observación'}
                        </h2>
                        <p className="text-gray-600">Conectado como: {user.email}</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Apellido</label>
                                <input
                                    type="text"
                                    value={formData.apellido}
                                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                                    className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">DNI</label>
                                <input
                                    type="text"
                                    value={formData.dni}
                                    onChange={(e) => setFormData({...formData, dni: e.target.value})}
                                    className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                    pattern="[0-9]{8}"
                                    maxLength="8"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Teléfono</label>
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                    className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Distrito</label>
                                <select
                                    value={formData.distrito}
                                    onChange={(e) => setFormData({...formData, distrito: e.target.value})}
                                    className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                    required
                                >
                                    <option value="">Seleccione distrito</option>
                                    {districts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Código de Obra</label>
                                <input
                                    type="text"
                                    value={formData.codigoObra}
                                    onChange={(e) => setFormData({...formData, codigoObra: e.target.value})}
                                    className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                    placeholder="Ej: LIMA-2024-001"
                                    required
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Observaciones ({charCount}/450)
                                </label>
                                <textarea
                                    value={formData.observaciones}
                                    onChange={handleObservacionesChange}
                                    className="form-input w-full px-4 py-3 rounded-lg focus:outline-none h-32 resize-none"
                                    placeholder="Escriba sus observaciones..."
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 py-3 font-semibold rounded-lg disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : 'Guardar Registro'}
                            </button>
                            {editingObservation && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="btn-secondary px-6 py-3 font-semibold rounded-lg"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {savedObservations.length > 0 && (
                    <div className="glass-effect rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Mis Observaciones Guardadas</h3>
                        <div className="space-y-4">
                            {savedObservations.map((obs) => (
                                <div key={obs.objectId} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-semibold text-gray-800">
                                            Obra: {obs.objectData.codigoObra}
                                        </div>
                                        <button
                                            onClick={() => handleEdit(obs)}
                                            className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                        >
                                            <i data-lucide="edit" className="w-3 h-3"></i>
                                            <span>Editar</span>
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{obs.objectData.observaciones}</p>
                                    <div className="text-gray-500 text-xs">
                                        {new Date(obs.objectData.fechaParticipacion).toLocaleDateString('es-PE')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('CitizenForm component error:', error);
        reportError(error);
    }
}
