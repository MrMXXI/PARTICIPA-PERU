const AuthUtils = {
    isValidCredentials: (usuario, password, userType) => {
        return usuario === 'Admin' && password === '997436034' && userType;
    },
    
    createUserSession: (credentials) => {
        const user = {
            userType: credentials.userType,
            municipality: credentials.municipality,
            email: credentials.email,
            loginTime: new Date().toISOString(),
            sessionId: Math.random().toString(36).substring(2, 15)
        };
        StorageUtils.setUser(user);
        return user;
    },
    
    getCurrentUser: () => {
        return StorageUtils.getUser();
    },
    
    logout: () => {
        StorageUtils.clearUser();
    },
    
    isAuthenticated: () => {
        const user = StorageUtils.getUser();
        if (!user) return false;
        
        const loginTime = new Date(user.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            StorageUtils.clearUser();
            return false;
        }
        
        return true;
    }
};
