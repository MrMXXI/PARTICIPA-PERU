const StorageUtils = {
    USER_KEY: 'lima_budget_user',
    
    setUser: (user) => {
        try {
            localStorage.setItem(StorageUtils.USER_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    },
    
    getUser: () => {
        try {
            const userData = localStorage.getItem(StorageUtils.USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user from storage:', error);
            return null;
        }
    },
    
    clearUser: () => {
        try {
            localStorage.removeItem(StorageUtils.USER_KEY);
        } catch (error) {
            console.error('Error clearing user from storage:', error);
        }
    },
    
    isStorageAvailable: () => {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
};
