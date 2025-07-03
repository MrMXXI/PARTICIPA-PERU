function CitizenForm({ user }) {
    try {
        const [formData, setFormData] = React.useState({
            nombre: '',
            apellido: '',
            dni: '',
            distrito: '',
            telefono: '',
            codigoObra: '',
            observaciones: '',
            fotos: []
        });
        const [loading, setLoading] = React.useState(false);
        const [charCount, setCharCount] = React.useState(0);
        const [savedObservations, setSavedObservations] = React.useState([]);
        const [currentPage, setCurrentPage] = React.useState(1);
        const [enlargedPhoto, setEnlargedPhoto] = React.useState(null);
        const observationsPerPage = 5;

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
                setCurrentPage(1);
            } catch (error) {
                console.error('Error loading observations:', error);
            }
        };

        React.useEffect(() => {
            loadObservations();
        }, []);

        const handleObservacionesChange = (e) => {
            const text = e.target.value;
            if (text.length <= 450) {
                setFormData({...formData, observaciones: text});
                setCharCount(text.length);
            }
        };

        const handlePhotoUpload = (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 2) {
                alert('Máximo 2 fotos permitidas');
                return;
            }
            
            const photoPromises = files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            });
            
            Promise.all(photoPromises).then(photos => {
                setFormData({...formData, fotos: photos});
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                const participationData = {
                    ...formData,
                    email: user.email,
                    provider: user.provider,
                    fechaParticipacion: new Date().toISOString()
                };
                
                await trickleCreateObject('citizen_participation', participationData);
                alert('Observación registrada exitosamente');
                
                setFormData({
                    nombre: '',
                    apellido: '',
                    dni: '',
                    distrito: '',
                    telefono: '',
                    codigoObra: '',
                    observaciones: '',
                    fotos: []
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

        const handlePhotoClick = (photo) => {
            setEnlargedPhoto(enlargedPhoto === photo ? null : photo);
        };

        // Pagination calculations
        const totalPages = Math.ceil(savedObservations.length / observationsPerPage);
        const startIndex = (currentPage - 1) * observationsPerPage;
        const endIndex = startIndex + observationsPerPage;
        const currentObservations = savedObservations.slice(startIndex, endIndex);

        const goToPage = (page) => {
            setCurrentPage(page);
            setEnlargedPhoto(null);
        };

        return (
            <div data-name="citizen-form" data-file="components/CitizenForm.js" className="space-y-6">
                <div className="glass-effect rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <i data-lucide="message-square" className="w-16 h-16 text-red-500 mx-auto mb-4"></i>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Nueva Observación</h2>
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

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Fotos (Máximo 2)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoUpload}
                                    className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                />
                                {formData.fotos.length > 0 && (
                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                        {formData.fotos.map((foto, index) => (
                                            <img
                                                key={index}
                                                src={foto}
                                                alt={`Foto ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 font-semibold rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar Registro'}
                        </button>
                    </form>
                </div>

                {savedObservations.length > 0 && (
                    <div className="glass-effect rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Mis Observaciones Guardadas ({savedObservations.length})
                        </h3>
                        
                        <div className="space-y-4">
                            {currentObservations.map((obs) => (
                                <div key={obs.objectId} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800 mb-2">
                                                Obra: {obs.objectData.codigoObra}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{obs.objectData.observaciones}</p>
                                            <div className="text-gray-500 text-xs">
                                                {new Date(obs.objectData.fechaParticipacion).toLocaleDateString('es-PE')}
                                            </div>
                                        </div>
                                        {obs.objectData.fotos && obs.objectData.fotos.length > 0 && (
                                            <div className="ml-4 flex space-x-2">
                                                {obs.objectData.fotos.map((foto, index) => (
                                                    <img
                                                        key={index}
                                                        src={foto}
                                                        alt={`Foto ${index + 1}`}
                                                        className={`cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                                                            enlargedPhoto === foto 
                                                                ? 'w-64 h-64 border-red-500 shadow-2xl z-50 relative' 
                                                                : 'w-16 h-16 border-gray-200 hover:border-red-500'
                                                        } object-cover`}
                                                        onClick={() => handlePhotoClick(foto)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-6">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                                >
                                    ‹
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`px-3 py-2 rounded-lg font-medium ${
                                            currentPage === page
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('CitizenForm component error:', error);
        reportError(error);
    }
}
