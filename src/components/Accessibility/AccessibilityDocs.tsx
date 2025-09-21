import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

// === TYPES ===

interface AccessibilityGuideline {
  id: string;
  title: string;
  description: string;
  category: 'keyboard' | 'screen-reader' | 'visual' | 'cognitive' | 'motor';
  level: 'A' | 'AA' | 'AAA';
  examples: {
    good: string;
    bad: string;
  };
  resources: {
    title: string;
    url: string;
  }[];
}

// === DATA ===

const accessibilityGuidelines: AccessibilityGuideline[] = [
  {
    id: 'keyboard-navigation',
    title: 'Keyboard Navigation',
    description: 'All interactive elements must be accessible via keyboard navigation.',
    category: 'keyboard',
    level: 'A',
    examples: {
      good: `
<button onClick={handleClick} onKeyDown={handleKeyDown}>
  Click me
</button>

const handleKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
};
      `,
      bad: `
<div onClick={handleClick}>
  Click me
</div>
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Keyboard Accessible', url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html' },
      { title: 'MDN Keyboard Navigation', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable' },
    ],
  },
  {
    id: 'focus-management',
    title: 'Focus Management',
    description: 'Focus must be visible and managed appropriately.',
    category: 'keyboard',
    level: 'AA',
    examples: {
      good: `
.button:focus {
  outline: 2px solid #58cc02;
  outline-offset: 2px;
}

// Focus trap for modals
const focusTrap = createFocusTrap(modalRef.current);
      `,
      bad: `
.button:focus {
  outline: none;
}
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Focus Visible', url: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html' },
      { title: 'Focus Management Best Practices', url: 'https://web.dev/focus-management/' },
    ],
  },
  {
    id: 'alt-text',
    title: 'Alternative Text for Images',
    description: 'Images must have alternative text for screen readers.',
    category: 'screen-reader',
    level: 'A',
    examples: {
      good: `
<img src="chart.png" alt="Sales increased by 25% in Q3 2023" />

// Decorative images
<img src="decoration.png" alt="" role="presentation" />
      `,
      bad: `
<img src="chart.png" />
<img src="chart.png" alt="chart" />
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Non-text Content', url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html' },
      { title: 'Alt Text Best Practices', url: 'https://webaim.org/articles/images/' },
    ],
  },
  {
    id: 'form-labels',
    title: 'Form Labels',
    description: 'Form inputs must have associated labels.',
    category: 'screen-reader',
    level: 'A',
    examples: {
      good: `
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />

// Or using aria-label
<input type="email" aria-label="Email Address" />

// Or using aria-labelledby
<div id="email-label">Email Address</div>
<input type="email" aria-labelledby="email-label" />
      `,
      bad: `
<input type="email" placeholder="Email" />
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Labels or Instructions', url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html' },
      { title: 'Form Accessibility', url: 'https://webaim.org/articles/forms/' },
    ],
  },
  {
    id: 'color-contrast',
    title: 'Color Contrast',
    description: 'Text must have sufficient color contrast against its background.',
    category: 'visual',
    level: 'AA',
    examples: {
      good: `
// Good contrast (4.5:1 ratio)
.text {
  color: #000000;
  background: #ffffff;
}

// Large text (3:1 ratio)
.large-text {
  color: #333333;
  background: #ffffff;
  font-size: 18px;
}
      `,
      bad: `
// Poor contrast (1.5:1 ratio)
.text {
  color: #999999;
  background: #ffffff;
}
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html' },
      { title: 'Color Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/' },
    ],
  },
  {
    id: 'heading-structure',
    title: 'Heading Structure',
    description: 'Headings must be properly structured and hierarchical.',
    category: 'screen-reader',
    level: 'A',
    examples: {
      good: `
<h1>Main Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>
    <h3>Another Subsection</h3>
  <h2>Another Section</h2>
    <h3>Subsection Title</h3>
      `,
      bad: `
<h1>Main Title</h1>
  <h3>Section Title</h3>
    <h2>Subsection Title</h2>
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Info and Relationships', url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html' },
      { title: 'Heading Structure', url: 'https://webaim.org/articles/semantic/' },
    ],
  },
  {
    id: 'aria-labels',
    title: 'ARIA Labels',
    description: 'Use ARIA labels to provide additional context for screen readers.',
    category: 'screen-reader',
    level: 'AA',
    examples: {
      good: `
<button aria-label="Close dialog">
  <span aria-hidden="true">×</span>
</button>

<div role="button" tabIndex="0" aria-label="Add to favorites">
  <span aria-hidden="true">❤️</span>
</div>
      `,
      bad: `
<button>
  <span>×</span>
</button>

<div role="button" tabIndex="0">
  <span>❤️</span>
</div>
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Name, Role, Value', url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html' },
      { title: 'ARIA Labels', url: 'https://webaim.org/articles/aria/' },
    ],
  },
  {
    id: 'live-regions',
    title: 'Live Regions',
    description: 'Use live regions to announce dynamic content changes.',
    category: 'screen-reader',
    level: 'AA',
    examples: {
      good: `
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// For assertive announcements
<div aria-live="assertive" aria-atomic="true">
  {errorMessage}
</div>
      `,
      bad: `
<div>
  {statusMessage}
</div>
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Status Messages', url: 'https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html' },
      { title: 'Live Regions', url: 'https://webaim.org/articles/aria/' },
    ],
  },
  {
    id: 'touch-targets',
    title: 'Touch Target Size',
    description: 'Touch targets must be at least 44x44 pixels.',
    category: 'motor',
    level: 'AA',
    examples: {
      good: `
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

// Large touch targets
.button-large {
  min-height: 48px;
  min-width: 48px;
  padding: 16px 20px;
}
      `,
      bad: `
.button {
  height: 24px;
  width: 24px;
  padding: 4px;
}
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Target Size', url: 'https://www.w3.org/WAI/WCAG21/Understanding/target-size.html' },
      { title: 'Touch Target Guidelines', url: 'https://web.dev/tap-targets/' },
    ],
  },
  {
    id: 'reduced-motion',
    title: 'Reduced Motion',
    description: 'Respect user preferences for reduced motion.',
    category: 'cognitive',
    level: 'AA',
    examples: {
      good: `
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Or use CSS custom properties
.animation {
  animation-duration: var(--animation-duration, 0.3s);
}

:root {
  --animation-duration: 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --animation-duration: 0.01ms;
  }
}
      `,
      bad: `
.animation {
  animation: slideIn 0.5s ease-in-out;
}
      `,
    },
    resources: [
      { title: 'WCAG 2.1 Animation from Interactions', url: 'https://www.w3.org/WAI/WAI21/Understanding/animation-from-interactions.html' },
      { title: 'Reduced Motion', url: 'https://web.dev/prefers-reduced-motion/' },
    ],
  },
];

// === COMPONENT ===

export const AccessibilityDocs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGuideline, setExpandedGuideline] = useState<string | null>(null);
  
  const { announce } = useAccessibility();

  // === FILTERING ===

  const filteredGuidelines = accessibilityGuidelines.filter(guideline => {
    const matchesCategory = selectedCategory === 'all' || guideline.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || guideline.level === selectedLevel;
    const matchesSearch = searchTerm === '' || 
      guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guideline.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  // === HANDLERS ===

  const handleGuidelineToggle = (guidelineId: string) => {
    const newExpanded = expandedGuideline === guidelineId ? null : guidelineId;
    setExpandedGuideline(newExpanded);
    
    if (newExpanded) {
      const guideline = accessibilityGuidelines.find(g => g.id === guidelineId);
      if (guideline) {
        announce(`Expanded guideline: ${guideline.title}`, 'polite');
      }
    }
  };

  const handleResourceClick = (url: string, title: string) => {
    announce(`Opening resource: ${title}`, 'polite');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // === RENDER ===

  return (
    <div className="accessibility-docs">
      <div className="docs-header">
        <h1>Accessibility Documentation</h1>
        <p>
          Comprehensive guide to implementing accessibility features in the AI Learning Tool.
          Follow these guidelines to ensure your application is accessible to all users.
        </p>
      </div>
      
      <div className="docs-filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="keyboard">Keyboard Navigation</option>
            <option value="screen-reader">Screen Reader</option>
            <option value="visual">Visual Design</option>
            <option value="cognitive">Cognitive</option>
            <option value="motor">Motor</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="level-filter">WCAG Level:</label>
          <select
            id="level-filter"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            aria-label="Filter by WCAG level"
          >
            <option value="all">All Levels</option>
            <option value="A">Level A</option>
            <option value="AA">Level AA</option>
            <option value="AAA">Level AAA</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="search-input">Search:</label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guidelines..."
            aria-label="Search accessibility guidelines"
          />
        </div>
      </div>
      
      <div className="docs-content">
        <div className="guidelines-list">
          {filteredGuidelines.map(guideline => (
            <div key={guideline.id} className="guideline-item">
              <div 
                className="guideline-header"
                onClick={() => handleGuidelineToggle(guideline.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGuidelineToggle(guideline.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={expandedGuideline === guideline.id}
                aria-controls={`guideline-${guideline.id}`}
              >
                <div className="guideline-title">
                  <h3>{guideline.title}</h3>
                  <div className="guideline-meta">
                    <span className={`level level-${guideline.level.toLowerCase()}`}>
                      WCAG {guideline.level}
                    </span>
                    <span className={`category category-${guideline.category}`}>
                      {guideline.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="guideline-toggle">
                  {expandedGuideline === guideline.id ? '−' : '+'}
                </div>
              </div>
              
              {expandedGuideline === guideline.id && (
                <div 
                  id={`guideline-${guideline.id}`}
                  className="guideline-content"
                  aria-labelledby={`guideline-${guideline.id}-title`}
                >
                  <div className="guideline-description">
                    <p>{guideline.description}</p>
                  </div>
                  
                  <div className="guideline-examples">
                    <h4>Examples</h4>
                    <div className="example-tabs">
                      <div className="example-tab">
                        <h5>✅ Good</h5>
                        <pre><code>{guideline.examples.good.trim()}</code></pre>
                      </div>
                      <div className="example-tab">
                        <h5>❌ Bad</h5>
                        <pre><code>{guideline.examples.bad.trim()}</code></pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="guideline-resources">
                    <h4>Resources</h4>
                    <ul>
                      {guideline.resources.map((resource, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            onClick={() => handleResourceClick(resource.url, resource.title)}
                            className="resource-link"
                            aria-label={`Open resource: ${resource.title}`}
                          >
                            {resource.title}
                            <span className="external-link-icon" aria-hidden="true">↗</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredGuidelines.length === 0 && (
          <div className="no-results">
            <p>No guidelines found matching your criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLevel('all');
                setSearchTerm('');
              }}
              className="button button-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      <div className="docs-footer">
        <div className="footer-section">
          <h3>WCAG 2.1 Compliance</h3>
          <p>
            This application follows Web Content Accessibility Guidelines (WCAG) 2.1 
            to ensure accessibility for users with disabilities.
          </p>
        </div>
        
        <div className="footer-section">
          <h3>Testing Tools</h3>
          <ul>
            <li>
              <a href="https://wave.webaim.org/" target="_blank" rel="noopener noreferrer">
                WAVE Web Accessibility Evaluator
              </a>
            </li>
            <li>
              <a href="https://www.deque.com/axe/" target="_blank" rel="noopener noreferrer">
                axe DevTools
              </a>
            </li>
            <li>
              <a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener noreferrer">
                Color Contrast Checker
              </a>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Screen Readers</h3>
          <ul>
            <li>
              <a href="https://www.nvaccess.org/" target="_blank" rel="noopener noreferrer">
                NVDA (Windows)
              </a>
            </li>
            <li>
              <a href="https://www.freedomscientific.com/products/software/jaws/" target="_blank" rel="noopener noreferrer">
                JAWS (Windows)
              </a>
            </li>
            <li>
              <a href="https://www.apple.com/accessibility/vision/" target="_blank" rel="noopener noreferrer">
                VoiceOver (macOS/iOS)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityDocs;
