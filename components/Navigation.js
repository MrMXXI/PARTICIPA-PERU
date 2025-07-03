function Navigation({ activeTab, onTabChange, userType }) {
    try {
        let tabs = [];
        
        if (userType === 'municipal') {
            tabs = [
                { id: 'budget', label: 'Gestión de Obras', icon: 'building' },
                { id: 'analysis', label: 'Análisis IA', icon: 'bar-chart' },
                { id: 'ranking', label: 'Ranking IA', icon: 'award' }
            ];
        } else if (userType === 'citizen') {
            tabs = [
                { id: 'public-works', label: 'Ver Obras', icon: 'eye' },
                { id: 'citizen-form', label: 'Mis Observaciones', icon: 'message-square' },
                { id: 'charts', label: 'Rankings en Vivo', icon: 'trending-up' },
                { id: 'ranking', label: 'Ranking IA', icon: 'award' }
            ];
        } else {
            tabs = [
                { id: 'public-works', label: 'Ver Obras Públicas', icon: 'building' },
                { id: 'citizen-access', label: 'Acceso Ciudadano', icon: 'users' },
                { id: 'municipal-access', label: 'Acceso Municipal', icon: 'shield' }
            ];
        }

        return (
            <nav data-name="navigation" data-file="components/Navigation.js" className="bg-red-500 shadow-lg p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex space-x-1 flex-wrap">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-white text-red-500'
                                        : 'text-white hover:bg-red-400'
                                }`}
                            >
                                <i data-lucide={tab.icon} className="w-5 h-5"></i>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
        );
    } catch (error) {
        console.error('Navigation component error:', error);
        reportError(error);
    }
}
