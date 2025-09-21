import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'ai-learning-tool-theme'
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Get actual theme based on current theme setting
  const getActualTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(newTheme);
    
    // Set data attribute for CSS
    root.setAttribute('data-theme', newTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#0f172a' : '#ffffff');
    }
  };

  // Set theme and persist to storage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
    
    // Apply the actual theme
    const actual = getActualTheme(newTheme);
    setActualTheme(actual);
    applyTheme(actual);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = actualTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get saved theme from localStorage
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      const initialTheme = savedTheme || defaultTheme;
      
      setThemeState(initialTheme);
      
      // Apply the actual theme
      const actual = getActualTheme(initialTheme);
      setActualTheme(actual);
      applyTheme(actual);
    }
  }, [defaultTheme, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        if (theme === 'system') {
          const actual = getActualTheme(theme);
          setActualTheme(actual);
          applyTheme(actual);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  // Update actual theme when theme changes
  useEffect(() => {
    const actual = getActualTheme(theme);
    setActualTheme(actual);
    applyTheme(actual);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme,
    toggleTheme,
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme toggle component
export const ThemeToggle: React.FC<{
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', showLabel = false, size = 'md' }) => {
  const { theme, setTheme, actualTheme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-12 h-6',
    lg: 'w-16 h-8'
  };

  const sliderSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const iconSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-theme-primary">
          {actualTheme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
      <button
        onClick={toggleTheme}
        className={`theme-toggle ${sizeClasses[size]} ${isDark ? 'active' : ''}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        <div className={`theme-toggle-slider ${sliderSizeClasses[size]}`} />
        <span className={`theme-toggle-icon sun ${iconSizeClasses[size]}`}>☀️</span>
        <span className={`theme-toggle-icon moon ${iconSizeClasses[size]}`}>🌙</span>
      </button>
    </div>
  );
};

// Theme selector component
export const ThemeSelector: React.FC<{
  className?: string;
  showLabel?: boolean;
}> = ({ className = '', showLabel = false }) => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' }
  ] as const;

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <div className={`theme-selector ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-theme-primary mb-2">
          Theme
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`theme-selector-button ${isOpen ? 'active' : ''}`}
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="theme-selector-button-icon">{currentTheme.icon}</span>
        <span className="theme-selector-button-text">{currentTheme.label}</span>
        <span className="theme-selector-button-icon">▼</span>
      </button>
      
      {isOpen && (
        <div className="theme-selector-dropdown active" role="listbox">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value);
                setIsOpen(false);
              }}
              className={`theme-selector-option ${theme === themeOption.value ? 'active' : ''}`}
              role="option"
              aria-selected={theme === themeOption.value}
            >
              <span className="theme-selector-option-icon">{themeOption.icon}</span>
              <span className="theme-selector-option-text">{themeOption.label}</span>
              <span className="theme-selector-option-check">✓</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Theme preference button component
export const ThemePreferenceButton: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', size = 'md' }) => {
  const { actualTheme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`theme-preference-button ${sizeClasses[size]} ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

// Theme debug component (for development)
export const ThemeDebug: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { theme, actualTheme, isDark, isLight } = useTheme();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`theme-debug ${className}`}>
      <div className="theme-debug-title">Theme Debug</div>
      <div className="theme-debug-item">
        <span className="theme-debug-label">Theme:</span>
        <span className="theme-debug-value">{theme}</span>
      </div>
      <div className="theme-debug-item">
        <span className="theme-debug-label">Actual:</span>
        <span className="theme-debug-value">{actualTheme}</span>
      </div>
      <div className="theme-debug-item">
        <span className="theme-debug-label">Is Dark:</span>
        <span className="theme-debug-value">{isDark ? 'Yes' : 'No'}</span>
      </div>
      <div className="theme-debug-item">
        <span className="theme-debug-label">Is Light:</span>
        <span className="theme-debug-value">{isLight ? 'Yes' : 'No'}</span>
      </div>
    </div>
  );
};

export default ThemeProvider;
