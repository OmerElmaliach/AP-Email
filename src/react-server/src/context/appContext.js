import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [labels, setLabels] = useState([]);
    const [currentLabel, setCurrentLabel] = useState('Inbox');
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [showLabelDropdown, setShowLabelDropdown] = useState({});
    const [showLabelSuggestions, setShowLabelSuggestions] = useState({});
    const [emails, setEmails] = useState([]);
    const [allEmails, setAllEmails] = useState([]);
    const [newLabelInput, setNewLabelInput] = useState({});

    // Dark Mode Functionality 
    // Define once when used.
    useEffect(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved) setDarkMode(saved === 'true');
    }, []);

    // Toggles mode effect.
    useEffect(() => {
        document.body.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    return (
        <AppContext.Provider value={{
            darkMode, setDarkMode,
            searchQuery, setSearchQuery,
            labels, setLabels,
            currentLabel, setCurrentLabel,
            error, setError,
            loading, setLoading,
            selectedEmails, setSelectedEmails,
            showLabelDropdown, setShowLabelDropdown,
            showLabelSuggestions, setShowLabelSuggestions,
            emails, setEmails,
            allEmails, setAllEmails,
            newLabelInput, setNewLabelInput
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
