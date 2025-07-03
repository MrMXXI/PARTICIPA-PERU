function Header({ user, onLogout }) {
    try {
        const getUserDisplayName = () => {
            if (user.userType === 'municipal') {
                return `${user.municipality || 'Gestor Municipal'}`;
            } else {
                return 'Ciudadano';
            }
        };

        return (
            <header data-name="header" data-file="components/Header.js" className="glass-effect border-b border-red-200 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <i data-lucide="building-2" className="w-8 h-8 text-red-500"></i>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Sistema Participa Perú
                        </h1>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-gray-600 text-sm">
                                    {user.userType === 'municipal' ? 'Gestor Municipal' : 'Ciudadano'}
                                </div>
                                <div className="text-gray-800 font-medium">
                                    {getUserDisplayName()}
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <i data-lucide="log-out" className="w-4 h-4"></i>
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>
        );
    } catch (error) {
        console.error('Header component error:', error);
        reportError(error);
    }
}
