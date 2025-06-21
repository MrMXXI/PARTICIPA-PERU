function CitizenLogin({ onCitizenLogin }) {
    try {
        const [showForm, setShowForm] = React.useState(false);
        const [formData, setFormData] = React.useState({
            email: '',
            provider: ''
        });

        const handleSocialLogin = (provider) => {
            const email = prompt(`Ingrese su email de ${provider}:`);
            if (email && email.includes('@')) {
                const citizenUser = {
                    email: email,
                    provider: provider,
                    loginTime: new Date().toISOString(),
                    userType: 'citizen'
                };
                onCitizenLogin(citizenUser);
            } else {
                alert('Email inválido');
            }
        };

        return (
            <div data-name="citizen-login" data-file="components/CitizenLogin.js" className="max-w-md mx-auto">
                <div className="glass-effect rounded-2xl p-8 animate-fade-in">
                    <div className="text-center mb-8">
                        <i data-lucide="user-check" className="w-16 h-16 text-white mx-auto mb-4"></i>
                        <h2 className="text-3xl font-bold text-white mb-2">Acceso Ciudadano</h2>
                        <p className="text-white/70">Inicie sesión para participar</p>
                    </div>
                    
                    <div className="space-y-4">
                        <button
                            onClick={() => handleSocialLogin('Google')}
                            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                            <i data-lucide="mail" className="w-5 h-5"></i>
                            <span>Continuar con Google</span>
                        </button>
                        
                        <button
                            onClick={() => handleSocialLogin('Facebook')}
                            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-blue-500/20 text-white rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                            <i data-lucide="facebook" className="w-5 h-5"></i>
                            <span>Continuar con Facebook</span>
                        </button>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm">
                            Al continuar, acepta participar en la mejora de obras públicas
                        </p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('CitizenLogin component error:', error);
        reportError(error);
    }
}
