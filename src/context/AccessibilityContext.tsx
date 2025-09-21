import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  useAccessibilityPreferences, 
  announceToScreenReader,
  AccessibilityOptions 
} from '../utils/accessibilityUtils';

// === TYPES ===

export interface AccessibilitySettings {
  // Visual preferences
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  darkMode: boolean;
  
  // Navigation preferences
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  skipLinks: boolean;
  
  // Screen reader preferences
  screenReaderAnnouncements: boolean;
  liveRegions: boolean;
  ariaLabels: boolean;
  
  // Interaction preferences
  touchTargets: 'small' | 'medium' | 'large';
  hoverEffects: boolean;
  animations: boolean;
  
  // Testing and debugging
  debugMode: boolean;
  showFocusRings: boolean;
  announceFocus: boolean;
}

export interface AccessibilityContextType {
  settings: AccessibilitySettings;
  preferences: ReturnType<typeof useAccessibilityPreferences>;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  isAccessible: (feature: keyof AccessibilitySettings) => boolean;
  getAccessibilityClass: (feature: keyof AccessibilitySettings) => string;
}

// === DEFAULT SETTINGS ===

const defaultSettings: AccessibilitySettings = {
  // Visual preferences
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  darkMode: false,
  
  // Navigation preferences
  keyboardNavigation: true,
  focusIndicators: true,
  skipLinks: true,
  
  // Screen reader preferences
  screenReaderAnnouncements: true,
  liveRegions: true,
  ariaLabels: true,
  
  // Interaction preferences
  touchTargets: 'medium',
  hoverEffects: true,
  animations: true,
  
  // Testing and debugging
  debugMode: false,
  showFocusRings: false,
  announceFocus: false,
};

// === STORAGE KEYS ===

const STORAGE_KEY = 'aiLearningToolAccessibilitySettings';

// === CONTEXT CREATION ===

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// === PROVIDER COMPONENT ===

interface AccessibilityProviderProps {
  children: ReactNode;
  initialSettings?: Partial<AccessibilitySettings>;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ 
  children, 
  initialSettings = {} 
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load from localStorage or use defaults
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSettings, ...parsed, ...initialSettings };
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings from localStorage:', error);
    }
    return { ...defaultSettings, ...initialSettings };
  });

  const preferences = useAccessibilityPreferences();

  // Update settings in localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings to localStorage:', error);
    }
  }, [settings]);

  // Apply system preferences on mount
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      highContrast: preferences.highContrast,
      reducedMotion: preferences.reducedMotion,
      darkMode: preferences.darkColorScheme,
    }));
  }, [preferences.highContrast, preferences.reducedMotion, preferences.darkColorScheme]);

  // Apply accessibility classes to document
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    // Remove existing accessibility classes
    body.classList.remove(
      'accessibility-high-contrast',
      'accessibility-reduced-motion',
      'accessibility-large-text',
      'accessibility-dark-mode',
      'accessibility-keyboard-nav',
      'accessibility-focus-indicators',
      'accessibility-skip-links',
      'accessibility-screen-reader',
      'accessibility-live-regions',
      'accessibility-aria-labels',
      'accessibility-touch-small',
      'accessibility-touch-medium',
      'accessibility-touch-large',
      'accessibility-hover-effects',
      'accessibility-animations',
      'accessibility-debug',
      'accessibility-show-focus',
      'accessibility-announce-focus'
    );
    
    html.classList.remove(
      'accessibility-high-contrast',
      'accessibility-reduced-motion',
      'accessibility-large-text',
      'accessibility-dark-mode'
    );
    
    // Apply current accessibility classes
    if (settings.highContrast) {
      body.classList.add('accessibility-high-contrast');
      html.classList.add('accessibility-high-contrast');
    }
    
    if (settings.reducedMotion) {
      body.classList.add('accessibility-reduced-motion');
      html.classList.add('accessibility-reduced-motion');
    }
    
    if (settings.largeText) {
      body.classList.add('accessibility-large-text');
      html.classList.add('accessibility-large-text');
    }
    
    if (settings.darkMode) {
      body.classList.add('accessibility-dark-mode');
      html.classList.add('accessibility-dark-mode');
    }
    
    if (settings.keyboardNavigation) {
      body.classList.add('accessibility-keyboard-nav');
    }
    
    if (settings.focusIndicators) {
      body.classList.add('accessibility-focus-indicators');
    }
    
    if (settings.skipLinks) {
      body.classList.add('accessibility-skip-links');
    }
    
    if (settings.screenReaderAnnouncements) {
      body.classList.add('accessibility-screen-reader');
    }
    
    if (settings.liveRegions) {
      body.classList.add('accessibility-live-regions');
    }
    
    if (settings.ariaLabels) {
      body.classList.add('accessibility-aria-labels');
    }
    
    if (settings.touchTargets === 'small') {
      body.classList.add('accessibility-touch-small');
    } else if (settings.touchTargets === 'medium') {
      body.classList.add('accessibility-touch-medium');
    } else if (settings.touchTargets === 'large') {
      body.classList.add('accessibility-touch-large');
    }
    
    if (settings.hoverEffects) {
      body.classList.add('accessibility-hover-effects');
    }
    
    if (settings.animations) {
      body.classList.add('accessibility-animations');
    }
    
    if (settings.debugMode) {
      body.classList.add('accessibility-debug');
    }
    
    if (settings.showFocusRings) {
      body.classList.add('accessibility-show-focus');
    }
    
    if (settings.announceFocus) {
      body.classList.add('accessibility-announce-focus');
    }
  }, [settings]);

  // Update setting function
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Reset settings function
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to remove accessibility settings from localStorage:', error);
    }
  }, []);

  // Announce function
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (settings.screenReaderAnnouncements) {
      announceToScreenReader(message, { priority });
    }
  }, [settings.screenReaderAnnouncements]);

  // Check if feature is accessible
  const isAccessible = useCallback((feature: keyof AccessibilitySettings): boolean => {
    return settings[feature] === true;
  }, [settings]);

  // Get accessibility class for feature
  const getAccessibilityClass = useCallback((feature: keyof AccessibilitySettings): string => {
    const classMap: Record<keyof AccessibilitySettings, string> = {
      highContrast: 'accessibility-high-contrast',
      reducedMotion: 'accessibility-reduced-motion',
      largeText: 'accessibility-large-text',
      darkMode: 'accessibility-dark-mode',
      keyboardNavigation: 'accessibility-keyboard-nav',
      focusIndicators: 'accessibility-focus-indicators',
      skipLinks: 'accessibility-skip-links',
      screenReaderAnnouncements: 'accessibility-screen-reader',
      liveRegions: 'accessibility-live-regions',
      ariaLabels: 'accessibility-aria-labels',
      touchTargets: `accessibility-touch-${settings.touchTargets}`,
      hoverEffects: 'accessibility-hover-effects',
      animations: 'accessibility-animations',
      debugMode: 'accessibility-debug',
      showFocusRings: 'accessibility-show-focus',
      announceFocus: 'accessibility-announce-focus',
    };
    
    return classMap[feature] || '';
  }, [settings]);

  const value: AccessibilityContextType = {
    settings,
    preferences,
    updateSetting,
    resetSettings,
    announce,
    isAccessible,
    getAccessibilityClass,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// === HOOK ===

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// === ACCESSIBILITY SETTINGS PANEL COMPONENT ===

export const AccessibilitySettingsPanel: React.FC = () => {
  const { settings, updateSetting, resetSettings, announce } = useAccessibility();

  const handleSettingChange = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    updateSetting(key, value);
    announce(`Accessibility setting ${key} updated to ${value}`, 'polite');
  };

  return (
    <div className="accessibility-settings-panel">
      <h2>Accessibility Settings</h2>
      
      <div className="settings-section">
        <h3>Visual Preferences</h3>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
            aria-describedby="high-contrast-description"
          />
          <span>High Contrast Mode</span>
          <div id="high-contrast-description" className="setting-description">
            Increases color contrast for better visibility
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
            aria-describedby="reduced-motion-description"
          />
          <span>Reduce Motion</span>
          <div id="reduced-motion-description" className="setting-description">
            Reduces animations and transitions
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.largeText}
            onChange={(e) => handleSettingChange('largeText', e.target.checked)}
            aria-describedby="large-text-description"
          />
          <span>Large Text</span>
          <div id="large-text-description" className="setting-description">
            Increases text size for better readability
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
            aria-describedby="dark-mode-description"
          />
          <span>Dark Mode</span>
          <div id="dark-mode-description" className="setting-description">
            Uses dark color scheme
          </div>
        </label>
      </div>
      
      <div className="settings-section">
        <h3>Navigation Preferences</h3>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.keyboardNavigation}
            onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
            aria-describedby="keyboard-nav-description"
          />
          <span>Keyboard Navigation</span>
          <div id="keyboard-nav-description" className="setting-description">
            Enables keyboard-only navigation
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.focusIndicators}
            onChange={(e) => handleSettingChange('focusIndicators', e.target.checked)}
            aria-describedby="focus-indicators-description"
          />
          <span>Focus Indicators</span>
          <div id="focus-indicators-description" className="setting-description">
            Shows visual focus indicators
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.skipLinks}
            onChange={(e) => handleSettingChange('skipLinks', e.target.checked)}
            aria-describedby="skip-links-description"
          />
          <span>Skip Links</span>
          <div id="skip-links-description" className="setting-description">
            Provides skip navigation links
          </div>
        </label>
      </div>
      
      <div className="settings-section">
        <h3>Screen Reader Preferences</h3>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.screenReaderAnnouncements}
            onChange={(e) => handleSettingChange('screenReaderAnnouncements', e.target.checked)}
            aria-describedby="screen-reader-description"
          />
          <span>Screen Reader Announcements</span>
          <div id="screen-reader-description" className="setting-description">
            Announces changes to screen readers
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.liveRegions}
            onChange={(e) => handleSettingChange('liveRegions', e.target.checked)}
            aria-describedby="live-regions-description"
          />
          <span>Live Regions</span>
          <div id="live-regions-description" className="setting-description">
            Updates screen readers with dynamic content
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.ariaLabels}
            onChange={(e) => handleSettingChange('ariaLabels', e.target.checked)}
            aria-describedby="aria-labels-description"
          />
          <span>ARIA Labels</span>
          <div id="aria-labels-description" className="setting-description">
            Provides additional context for screen readers
          </div>
        </label>
      </div>
      
      <div className="settings-section">
        <h3>Interaction Preferences</h3>
        
        <label className="setting-item">
          <span>Touch Target Size</span>
          <select
            value={settings.touchTargets}
            onChange={(e) => handleSettingChange('touchTargets', e.target.value as 'small' | 'medium' | 'large')}
            aria-describedby="touch-targets-description"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <div id="touch-targets-description" className="setting-description">
            Size of touch targets for better accessibility
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.hoverEffects}
            onChange={(e) => handleSettingChange('hoverEffects', e.target.checked)}
            aria-describedby="hover-effects-description"
          />
          <span>Hover Effects</span>
          <div id="hover-effects-description" className="setting-description">
            Enables hover effects and transitions
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.animations}
            onChange={(e) => handleSettingChange('animations', e.target.checked)}
            aria-describedby="animations-description"
          />
          <span>Animations</span>
          <div id="animations-description" className="setting-description">
            Enables animations and transitions
          </div>
        </label>
      </div>
      
      <div className="settings-section">
        <h3>Testing and Debugging</h3>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.debugMode}
            onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
            aria-describedby="debug-mode-description"
          />
          <span>Debug Mode</span>
          <div id="debug-mode-description" className="setting-description">
            Shows accessibility debugging information
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.showFocusRings}
            onChange={(e) => handleSettingChange('showFocusRings', e.target.checked)}
            aria-describedby="show-focus-description"
          />
          <span>Show Focus Rings</span>
          <div id="show-focus-description" className="setting-description">
            Always shows focus rings for debugging
          </div>
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.announceFocus}
            onChange={(e) => handleSettingChange('announceFocus', e.target.checked)}
            aria-describedby="announce-focus-description"
          />
          <span>Announce Focus</span>
          <div id="announce-focus-description" className="setting-description">
            Announces focus changes for debugging
          </div>
        </label>
      </div>
      
      <div className="settings-actions">
        <button
          type="button"
          onClick={resetSettings}
          className="button button-secondary"
          aria-describedby="reset-description"
        >
          Reset to Defaults
        </button>
        <div id="reset-description" className="setting-description">
          Resets all accessibility settings to their default values
        </div>
      </div>
    </div>
  );
};

export default AccessibilityProvider;
