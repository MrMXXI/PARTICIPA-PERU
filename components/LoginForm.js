function LoginForm({ onLogin }) {
    try {
        const [formData, setFormData] = React.useState({
            usuario: '',
            password: '',
            userType: ''
        });
        const [loading, setLoading] = React.useState(false);

        const municipalities = [
            'Lima Metropolitana', 'Ate', 'Barranco', 'Breña', 'Comas', 'Chorrillos',
            'El Agustino', 'Jesús María', 'La Molina', 'La Victoria', 'Lince',
            'Los Olivos', 'Magdalena del Mar', 'Miraflores', 'Pueblo Libre',
            'Puente Piedra', 'Rímac', 'San Borja', 'San Isidro', 'San Juan de Lurigancho',
            'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel',
            'Santa Anita', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador',
            'Villa María del Triunfo'
        ];

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                if (formData.usuario === 'Admin' && formData.password === '997436034' && formData.userType) {
                    if (formData.userType === 'municipal') {
                        onLogin({
                            municipality: formData.municipality || 'Lima Metropolitana',
                            userType: 'municipal'
                        });
                    } else {
                        onLogin({
                            email: 'admin@sistema.com',
                            userType: 'citizen'
                        });
                    }
                } else {
                    alert('Credenciales incorrectas');
                }
            } catch (error) {
                console.error('Login error:', error);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div data-name="login-form" data-file="components/LoginForm.js" className="min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Sistema Presupuestos Lima
                        </h1>
                        <p className="text-gray-600">Transparencia y participación ciudadana</p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Charts Preview - Left Side */}
                        <div className="order-2 lg:order-1">
                            <PublicChartsPreview />
                        </div>
                        
                        {/* Login Form - Right Side */}
                        <div className="order-1 lg:order-2 flex justify-center">
                            <div className="glass-effect rounded-2xl p-8 w-full max-w-md animate-fade-in">
                                <div className="text-center mb-8">
                                    <i data-lucide="shield-check" className="w-16 h-16 text-red-500 mx-auto mb-4"></i>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Acceso al Sistema</h2>
                                    <p className="text-gray-600">Seleccione su tipo de acceso</p>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">Tipo de Usuario</label>
                                        <select
                                            value={formData.userType}
                                            onChange={(e) => setFormData({...formData, userType: e.target.value})}
                                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                            required
                                        >
                                            <option value="">Seleccione tipo de acceso</option>
                                            <option value="municipal">Gestor Municipal</option>
                                            <option value="citizen">Ciudadano</option>
                                        </select>
                                    </div>

                                    {formData.userType === 'municipal' && (
                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">Municipalidad</label>
                                            <select
                                                value={formData.municipality}
                                                onChange={(e) => setFormData({...formData, municipality: e.target.value})}
                                                className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                                required
                                            >
                                                <option value="">Seleccione municipalidad</option>
                                                {municipalities.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">Usuario</label>
                                        <input
                                            type="text"
                                            value={formData.usuario}
                                            onChange={(e) => setFormData({...formData, usuario: e.target.value})}
                                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                            placeholder="Ingrese usuario"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">Contraseña</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                                            placeholder="Ingrese su contraseña"
                                            required
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full py-3 font-semibold rounded-lg disabled:opacity-50"
                                    >
                                        {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('LoginForm component error:', error);
        reportError(error);
    }
}
