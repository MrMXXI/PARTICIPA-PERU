function App() {
    try {
        const [user, setUser] = React.useState(null);
        const [activeTab, setActiveTab] = React.useState('budget');
        const [refreshTrigger, setRefreshTrigger] = React.useState(0);
        const [editingProject, setEditingProject] = React.useState(null);

        React.useEffect(() => {
            lucide.createIcons();
            
            if (AuthUtils.isAuthenticated()) {
                const currentUser = AuthUtils.getCurrentUser();
                setUser(currentUser);
                
                if (currentUser.userType === 'municipal') {
                    setActiveTab('budget');
                } else {
                    setActiveTab('public-works');
                }
            }
        }, []);

        React.useEffect(() => {
            lucide.createIcons();
        }, [activeTab, user]);

        const handleLogin = (credentials) => {
            const newUser = AuthUtils.createUserSession(credentials);
            setUser(newUser);
            
            if (newUser.userType === 'municipal') {
                setActiveTab('budget');
            } else {
                setActiveTab('public-works');
            }
        };

        const handleLogout = () => {
            AuthUtils.logout();
            setUser(null);
            setActiveTab('budget');
        };

        const handleProjectAdded = () => {
            setRefreshTrigger(prev => prev + 1);
            setEditingProject(null);
        };

        const handleEditProject = (project) => {
            setEditingProject(project);
        };

        const handleCancelEdit = () => {
            setEditingProject(null);
        };

        if (!user) {
            return React.createElement(LoginForm, { onLogin: handleLogin });
        }

        return React.createElement(
            'div',
            { className: 'min-h-screen bg-white' },
            React.createElement(Header, { user, onLogout: handleLogout }),
            React.createElement(Navigation, { 
                activeTab, 
                onTabChange: setActiveTab, 
                userType: user.userType 
            }),
            React.createElement(
                'main',
                { className: 'max-w-7xl mx-auto p-6' },
                React.createElement(NewsCarousel),
                
                // Municipal user tabs
                user.userType === 'municipal' && activeTab === 'budget' && React.createElement(
                    'div',
                    { className: 'space-y-6' },
                    React.createElement(BudgetForm, { 
                        user, 
                        onProjectAdded: handleProjectAdded,
                        editingProject,
                        onCancelEdit: handleCancelEdit
                    }),
                    React.createElement(BudgetList, { 
                        user, 
                        refreshTrigger,
                        onEditProject: handleEditProject
                    })
                ),
                user.userType === 'municipal' && activeTab === 'analysis' && React.createElement(AnalysisDashboard),
                user.userType === 'municipal' && activeTab === 'ranking' && React.createElement(RankingDashboard),
                
                // Citizen user tabs
                user.userType === 'citizen' && activeTab === 'public-works' && React.createElement(PublicWorks),
                user.userType === 'citizen' && activeTab === 'citizen-form' && React.createElement(CitizenForm, { user }),
                user.userType === 'citizen' && activeTab === 'charts' && React.createElement(AutoRefreshCharts),
                user.userType === 'citizen' && activeTab === 'ranking' && React.createElement(RankingDashboard)
            )
        );
    } catch (error) {
        console.error('App component error:', error);
        reportError(error);
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
