/**
 * Accessibility Utilities
 * 
 * This file provides utility functions and hooks for implementing
 * accessibility features in the AI Learning Tool application.
 */

import { useEffect, useRef, useCallback, useState } from 'react';

// === TYPES ===

export interface AccessibilityOptions {
  announceChanges?: boolean;
  focusManagement?: boolean;
  keyboardNavigation?: boolean;
  screenReaderSupport?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
}

export interface FocusTrapOptions {
  initialFocus?: boolean;
  returnFocus?: boolean;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
}

export interface AnnouncementOptions {
  priority?: 'polite' | 'assertive';
  delay?: number;
}

// === ACCESSIBILITY DETECTION ===

/**
 * Detects if the user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Detects if the user prefers high contrast
 */
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Detects if the user prefers dark color scheme
 */
export const prefersDarkColorScheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Detects if the user has a coarse pointer (touch device)
 */
export const hasCoarsePointer = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
};

/**
 * Detects if the user has a fine pointer (mouse device)
 */
export const hasFinePointer = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
};

/**
 * Detects if the user has no pointing device
 */
export const hasNoPointer = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: none)').matches;
};

// === FOCUS MANAGEMENT ===

/**
 * Focuses the first focusable element in a container
 */
export const focusFirstElement = (container: HTMLElement): boolean => {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return true;
  }
  return false;
};

/**
 * Focuses the last focusable element in a container
 */
export const focusLastElement = (container: HTMLElement): boolean => {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus();
    return true;
  }
  return false;
};

/**
 * Gets all focusable elements in a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
};

/**
 * Focuses the next focusable element
 */
export const focusNextElement = (currentElement: HTMLElement): boolean => {
  const container = currentElement.closest('[role="dialog"], [role="menu"], main, body') as HTMLElement;
  if (!container) return false;

  const focusableElements = getFocusableElements(container);
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
    return focusFirstElement(container);
  }
  
  focusableElements[currentIndex + 1].focus();
  return true;
};

/**
 * Focuses the previous focusable element
 */
export const focusPreviousElement = (currentElement: HTMLElement): boolean => {
  const container = currentElement.closest('[role="dialog"], [role="menu"], main, body') as HTMLElement;
  if (!container) return false;

  const focusableElements = getFocusableElements(container);
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex === -1 || currentIndex === 0) {
    return focusLastElement(container);
  }
  
  focusableElements[currentIndex - 1].focus();
  return true;
};

// === FOCUS TRAP ===

/**
 * Creates a focus trap for modals and dialogs
 */
export const createFocusTrap = (
  container: HTMLElement,
  options: FocusTrapOptions = {}
): (() => void) => {
  const {
    initialFocus = true,
    returnFocus = true,
    escapeDeactivates = true,
    clickOutsideDeactivates = false,
  } = options;

  let previousActiveElement: HTMLElement | null = null;
  let isActive = false;

  const activate = () => {
    if (isActive) return;
    
    isActive = true;
    previousActiveElement = document.activeElement as HTMLElement;
    
    if (initialFocus) {
      focusFirstElement(container);
    }
    
    // Add event listeners
    container.addEventListener('keydown', handleKeyDown);
    if (clickOutsideDeactivates) {
      document.addEventListener('click', handleClickOutside);
    }
  };

  const deactivate = () => {
    if (!isActive) return;
    
    isActive = false;
    
    // Remove event listeners
    container.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('click', handleClickOutside);
    
    if (returnFocus && previousActiveElement) {
      previousActiveElement.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      
      const focusableElements = getFocusableElements(container);
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      
      if (event.shiftKey) {
        // Shift + Tab: focus previous element
        if (currentIndex <= 0) {
          focusableElements[focusableElements.length - 1].focus();
        } else {
          focusableElements[currentIndex - 1].focus();
        }
      } else {
        // Tab: focus next element
        if (currentIndex >= focusableElements.length - 1) {
          focusableElements[0].focus();
        } else {
          focusableElements[currentIndex + 1].focus();
        }
      }
    } else if (event.key === 'Escape' && escapeDeactivates) {
      deactivate();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!container.contains(event.target as Node)) {
      deactivate();
    }
  };

  // Activate immediately
  activate();

  // Return deactivate function
  return deactivate;
};

// === ARIA ANNOUNCEMENTS ===

/**
 * Announces text to screen readers
 */
export const announceToScreenReader = (
  message: string,
  options: AnnouncementOptions = {}
): void => {
  const { priority = 'polite', delay = 0 } = options;
  
  // Create or get existing live region
  let liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  
  // Set the message with optional delay
  const announce = () => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
    
    // Clear the message after a short delay to allow re-announcement
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, 1000);
  };
  
  if (delay > 0) {
    setTimeout(announce, delay);
  } else {
    announce();
  }
};

// === KEYBOARD NAVIGATION ===

/**
 * Handles keyboard navigation for arrow keys
 */
export const handleArrowKeyNavigation = (
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: 'horizontal' | 'vertical' = 'vertical'
): number => {
  const { key } = event;
  let newIndex = currentIndex;
  
  if (orientation === 'vertical') {
    if (key === 'ArrowDown') {
      event.preventDefault();
      newIndex = (currentIndex + 1) % items.length;
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    }
  } else {
    if (key === 'ArrowRight') {
      event.preventDefault();
      newIndex = (currentIndex + 1) % items.length;
    } else if (key === 'ArrowLeft') {
      event.preventDefault();
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    }
  }
  
  if (newIndex !== currentIndex) {
    items[newIndex].focus();
  }
  
  return newIndex;
};

/**
 * Handles keyboard navigation for Home and End keys
 */
export const handleHomeEndNavigation = (
  event: KeyboardEvent,
  items: HTMLElement[]
): void => {
  const { key } = event;
  
  if (key === 'Home') {
    event.preventDefault();
    items[0].focus();
  } else if (key === 'End') {
    event.preventDefault();
    items[items.length - 1].focus();
  }
};

// === REACT HOOKS ===

/**
 * Hook for managing focus trap
 */
export const useFocusTrap = (
  isActive: boolean,
  options: FocusTrapOptions = {}
) => {
  const containerRef = useRef<HTMLElement>(null);
  const deactivateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      deactivateRef.current = createFocusTrap(containerRef.current, options);
    } else if (deactivateRef.current) {
      deactivateRef.current();
      deactivateRef.current = null;
    }

    return () => {
      if (deactivateRef.current) {
        deactivateRef.current();
      }
    };
  }, [isActive, options]);

  return containerRef;
};

/**
 * Hook for managing ARIA announcements
 */
export const useAriaAnnouncements = () => {
  const announce = useCallback((message: string, options?: AnnouncementOptions) => {
    announceToScreenReader(message, options);
  }, []);

  return { announce };
};

/**
 * Hook for managing keyboard navigation
 */
export const useKeyboardNavigation = (
  items: HTMLElement[],
  orientation: 'horizontal' | 'vertical' = 'vertical'
) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const newIndex = handleArrowKeyNavigation(event, items, currentIndex, orientation);
    setCurrentIndex(newIndex);
    
    handleHomeEndNavigation(event, items);
  }, [items, currentIndex, orientation]);

  return { currentIndex, handleKeyDown };
};

/**
 * Hook for managing accessibility preferences
 */
export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = useState({
    reducedMotion: prefersReducedMotion(),
    highContrast: prefersHighContrast(),
    darkColorScheme: prefersDarkColorScheme(),
    coarsePointer: hasCoarsePointer(),
    finePointer: hasFinePointer(),
    noPointer: hasNoPointer(),
  });

  useEffect(() => {
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(pointer: none)'),
    ];

    const updatePreferences = () => {
      setPreferences({
        reducedMotion: mediaQueries[0].matches,
        highContrast: mediaQueries[1].matches,
        darkColorScheme: mediaQueries[2].matches,
        coarsePointer: mediaQueries[3].matches,
        finePointer: mediaQueries[4].matches,
        noPointer: mediaQueries[5].matches,
      });
    };

    mediaQueries.forEach(mq => mq.addEventListener('change', updatePreferences));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', updatePreferences));
    };
  }, []);

  return preferences;
};

// === ACCESSIBILITY VALIDATION ===

/**
 * Validates ARIA attributes
 */
export const validateAriaAttributes = (element: HTMLElement): string[] => {
  const errors: string[] = [];
  
  // Check for required ARIA attributes
  if (element.getAttribute('role') === 'button' && !element.getAttribute('aria-label') && !element.textContent?.trim()) {
    errors.push('Button with role="button" must have aria-label or visible text');
  }
  
  if (element.getAttribute('role') === 'link' && !element.getAttribute('aria-label') && !element.textContent?.trim()) {
    errors.push('Link with role="link" must have aria-label or visible text');
  }
  
  if (element.getAttribute('role') === 'img' && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    errors.push('Image with role="img" must have aria-label or aria-labelledby');
  }
  
  // Check for invalid ARIA attributes
  const invalidAriaAttributes = [
    'aria-checked', 'aria-selected', 'aria-expanded', 'aria-pressed',
    'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-valuetext',
  ];
  
  invalidAriaAttributes.forEach(attr => {
    if (element.hasAttribute(attr) && !element.getAttribute('role')) {
      errors.push(`Element with ${attr} must have a role attribute`);
    }
  });
  
  return errors;
};

/**
 * Validates color contrast
 */
export const validateColorContrast = (
  foregroundColor: string,
  backgroundColor: string,
  fontSize: number = 16,
  fontWeight: number = 400
): { ratio: number; passes: boolean; level: 'AA' | 'AAA' | 'FAIL' } => {
  // This is a simplified implementation
  // In a real application, you'd want to use a proper color contrast library
  
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Apply gamma correction
    const [rGamma, gGamma, bGamma] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    
    return 0.2126 * rGamma + 0.7152 * gGamma + 0.0722 * bGamma;
  };
  
  const foregroundLuminance = getLuminance(foregroundColor);
  const backgroundLuminance = getLuminance(backgroundColor);
  
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
  
  let level: 'AA' | 'AAA' | 'FAIL';
  if (isLargeText) {
    level = ratio >= 4.5 ? 'AAA' : ratio >= 3 ? 'AA' : 'FAIL';
  } else {
    level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL';
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    passes: level !== 'FAIL',
    level,
  };
};

// === ACCESSIBILITY TESTING ===

/**
 * Runs accessibility tests on an element
 */
export const runAccessibilityTests = (element: HTMLElement): {
  errors: string[];
  warnings: string[];
  suggestions: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check for missing alt text on images
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      errors.push('Image missing alt text or aria-label');
    }
  });
  
  // Check for missing labels on form inputs
  const inputs = element.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.id;
    const label = id ? element.querySelector(`label[for="${id}"]`) : null;
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!label && !ariaLabel && !ariaLabelledBy) {
      errors.push('Form input missing label, aria-label, or aria-labelledby');
    }
  });
  
  // Check for proper heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      warnings.push(`Heading level ${level} follows heading level ${previousLevel} - consider using h${previousLevel + 1}`);
    }
    previousLevel = level;
  });
  
  // Check for proper ARIA attributes
  const elementsWithRole = element.querySelectorAll('[role]');
  elementsWithRole.forEach(el => {
    const roleErrors = validateAriaAttributes(el as HTMLElement);
    errors.push(...roleErrors);
  });
  
  // Check for keyboard accessibility
  const interactiveElements = element.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  interactiveElements.forEach(el => {
    if (el.getAttribute('tabindex') === '-1' && !el.getAttribute('aria-hidden')) {
      warnings.push('Interactive element with tabindex="-1" should be hidden from screen readers');
    }
  });
  
  return { errors, warnings, suggestions };
};

// === ACCESSIBILITY DOCUMENTATION ===

/**
 * Generates accessibility documentation for a component
 */
export const generateAccessibilityDocs = (componentName: string): string => {
  return `
# Accessibility Documentation for ${componentName}

## Keyboard Navigation
- Use Tab to navigate between interactive elements
- Use Shift+Tab to navigate backwards
- Use Enter or Space to activate buttons and links
- Use Arrow keys to navigate within groups of related elements

## Screen Reader Support
- All interactive elements have proper labels
- ARIA attributes provide additional context
- Live regions announce dynamic content changes
- Focus management ensures logical tab order

## Visual Design
- High contrast mode support
- Reduced motion preferences respected
- Touch targets meet minimum size requirements
- Color is not the only means of conveying information

## Testing
- Test with keyboard-only navigation
- Test with screen reader software
- Test with high contrast mode enabled
- Test with reduced motion preferences
- Validate color contrast ratios
  `;
};

export default {
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkColorScheme,
  hasCoarsePointer,
  hasFinePointer,
  hasNoPointer,
  focusFirstElement,
  focusLastElement,
  getFocusableElements,
  focusNextElement,
  focusPreviousElement,
  createFocusTrap,
  announceToScreenReader,
  handleArrowKeyNavigation,
  handleHomeEndNavigation,
  useFocusTrap,
  useAriaAnnouncements,
  useKeyboardNavigation,
  useAccessibilityPreferences,
  validateAriaAttributes,
  validateColorContrast,
  runAccessibilityTests,
  generateAccessibilityDocs,
};
