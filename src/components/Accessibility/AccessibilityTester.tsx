import React, { useState, useRef, useEffect } from 'react';
import { 
  runAccessibilityTests, 
  validateColorContrast, 
  validateAriaAttributes,
  announceToScreenReader 
} from '../../utils/accessibilityUtils';
import { useAccessibility } from '../../context/AccessibilityContext';

// === TYPES ===

interface AccessibilityTestResult {
  element: string;
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  severity: 'high' | 'medium' | 'low';
  fix?: string;
  code?: string;
}

interface ColorContrastResult {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  passes: boolean;
  level: 'AA' | 'AAA' | 'FAIL';
  fontSize: number;
}

interface AccessibilityReport {
  timestamp: Date;
  url: string;
  totalElements: number;
  errors: AccessibilityTestResult[];
  warnings: AccessibilityTestResult[];
  suggestions: AccessibilityTestResult[];
  colorContrast: ColorContrastResult[];
  summary: {
    totalIssues: number;
    criticalIssues: number;
    highPriorityIssues: number;
    mediumPriorityIssues: number;
    lowPriorityIssues: number;
  };
}

// === COMPONENT ===

export const AccessibilityTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [showElementPicker, setShowElementPicker] = useState(false);
  const [testScope, setTestScope] = useState<'page' | 'element'>('page');
  const [includeColorContrast, setIncludeColorContrast] = useState(true);
  const [includeAriaValidation, setIncludeAriaValidation] = useState(true);
  const [includeKeyboardNavigation, setIncludeKeyboardNavigation] = useState(true);
  const [includeScreenReader, setIncludeScreenReader] = useState(true);
  
  const { announce, settings } = useAccessibility();
  const elementPickerRef = useRef<HTMLDivElement>(null);

  // === TESTING FUNCTIONS ===

  const runAccessibilityTest = async () => {
    setIsRunning(true);
    announce('Starting accessibility test', 'polite');
    
    try {
      const testResults: AccessibilityTestResult[] = [];
      const colorContrastResults: ColorContrastResult[] = [];
      
      // Determine test scope
      const testContainer = testScope === 'page' 
        ? document.body 
        : selectedElement || document.body;
      
      if (!testContainer) {
        throw new Error('No test container found');
      }
      
      // Run basic accessibility tests
      if (includeAriaValidation) {
        const basicTests = runAccessibilityTests(testContainer);
        
        // Convert test results to our format
        basicTests.errors.forEach(error => {
          testResults.push({
            element: 'Multiple elements',
            type: 'error',
            message: error,
            severity: 'high',
            fix: getFixForError(error),
          });
        });
        
        basicTests.warnings.forEach(warning => {
          testResults.push({
            element: 'Multiple elements',
            type: 'warning',
            message: warning,
            severity: 'medium',
            fix: getFixForWarning(warning),
          });
        });
        
        basicTests.suggestions.forEach(suggestion => {
          testResults.push({
            element: 'Multiple elements',
            type: 'suggestion',
            message: suggestion,
            severity: 'low',
            fix: getFixForSuggestion(suggestion),
          });
        });
      }
      
      // Run color contrast tests
      if (includeColorContrast) {
        const colorContrastTests = await runColorContrastTests(testContainer);
        colorContrastResults.push(...colorContrastTests);
      }
      
      // Run keyboard navigation tests
      if (includeKeyboardNavigation) {
        const keyboardTests = runKeyboardNavigationTests(testContainer);
        testResults.push(...keyboardTests);
      }
      
      // Run screen reader tests
      if (includeScreenReader) {
        const screenReaderTests = runScreenReaderTests(testContainer);
        testResults.push(...screenReaderTests);
      }
      
      // Generate report
      const newReport: AccessibilityReport = {
        timestamp: new Date(),
        url: window.location.href,
        totalElements: testContainer.querySelectorAll('*').length,
        errors: testResults.filter(r => r.type === 'error'),
        warnings: testResults.filter(r => r.type === 'warning'),
        suggestions: testResults.filter(r => r.type === 'suggestion'),
        colorContrast: colorContrastResults,
        summary: generateSummary(testResults, colorContrastResults),
      };
      
      setReport(newReport);
      announce(`Accessibility test completed. Found ${newReport.summary.totalIssues} issues.`, 'polite');
      
    } catch (error) {
      console.error('Accessibility test failed:', error);
      announce('Accessibility test failed. Please try again.', 'assertive');
    } finally {
      setIsRunning(false);
    }
  };

  const runColorContrastTests = async (container: HTMLElement): Promise<ColorContrastResult[]> => {
    const results: ColorContrastResult[] = [];
    const elements = container.querySelectorAll('*');
    
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const computedStyle = window.getComputedStyle(htmlElement);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      const fontSize = parseFloat(computedStyle.fontSize);
      
      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = validateColorContrast(color, backgroundColor, fontSize);
        
        if (!contrast.passes) {
          results.push({
            element: htmlElement.tagName.toLowerCase(),
            foreground: color,
            background: backgroundColor,
            ratio: contrast.ratio,
            passes: contrast.passes,
            level: contrast.level,
            fontSize,
          });
        }
      }
    });
    
    return results;
  };

  const runKeyboardNavigationTests = (container: HTMLElement): AccessibilityTestResult[] => {
    const results: AccessibilityTestResult[] = [];
    const interactiveElements = container.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    
    interactiveElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Check for proper tabindex
      const tabIndex = htmlElement.getAttribute('tabindex');
      if (tabIndex === '0' && !htmlElement.getAttribute('role')) {
        results.push({
          element: htmlElement.tagName.toLowerCase(),
          type: 'warning',
          message: 'Element with tabindex="0" should have a role attribute',
          severity: 'medium',
          fix: 'Add appropriate role attribute or remove tabindex',
          code: `<${htmlElement.tagName.toLowerCase()} role="button" tabindex="0">`,
        });
      }
      
      // Check for disabled elements with tabindex
      if (htmlElement.hasAttribute('disabled') && tabIndex !== '-1') {
        results.push({
          element: htmlElement.tagName.toLowerCase(),
          type: 'error',
          message: 'Disabled element should have tabindex="-1"',
          severity: 'high',
          fix: 'Add tabindex="-1" to disabled element',
          code: `<${htmlElement.tagName.toLowerCase()} disabled tabindex="-1">`,
        });
      }
      
      // Check for missing keyboard event handlers
      if (htmlElement.getAttribute('role') === 'button' && !htmlElement.onclick && !htmlElement.onkeydown) {
        results.push({
          element: htmlElement.tagName.toLowerCase(),
          type: 'error',
          message: 'Button role element missing keyboard event handler',
          severity: 'high',
          fix: 'Add onkeydown handler for Enter and Space keys',
          code: `onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleClick(); } }}`,
        });
      }
    });
    
    return results;
  };

  const runScreenReaderTests = (container: HTMLElement): AccessibilityTestResult[] => {
    const results: AccessibilityTestResult[] = [];
    const elements = container.querySelectorAll('*');
    
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Check for images without alt text
      if (htmlElement.tagName === 'IMG' && !(htmlElement as HTMLImageElement).alt && !htmlElement.getAttribute('aria-label')) {
        results.push({
          element: 'img',
          type: 'error',
          message: 'Image missing alt text or aria-label',
          severity: 'high',
          fix: 'Add alt attribute or aria-label',
          code: `<img src="..." alt="Description of image">`,
        });
      }
      
      // Check for form inputs without labels
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(htmlElement.tagName)) {
        const id = htmlElement.id;
        const label = id ? container.querySelector(`label[for="${id}"]`) : null;
        const ariaLabel = htmlElement.getAttribute('aria-label');
        const ariaLabelledBy = htmlElement.getAttribute('aria-labelledby');
        
        if (!label && !ariaLabel && !ariaLabelledBy) {
          results.push({
            element: htmlElement.tagName.toLowerCase(),
            type: 'error',
            message: 'Form input missing label, aria-label, or aria-labelledby',
            severity: 'high',
            fix: 'Add label, aria-label, or aria-labelledby attribute',
            code: `<label for="${id}">Label text</label><input id="${id}" type="text">`,
          });
        }
      }
      
      // Check for proper heading hierarchy
      if (htmlElement.tagName.match(/^H[1-6]$/)) {
        const level = parseInt(htmlElement.tagName.charAt(1));
        const previousHeading = htmlElement.previousElementSibling;
        
        if (previousHeading && previousHeading.tagName.match(/^H[1-6]$/)) {
          const previousLevel = parseInt(previousHeading.tagName.charAt(1));
          
          if (level > previousLevel + 1) {
            results.push({
              element: htmlElement.tagName.toLowerCase(),
              type: 'warning',
              message: `Heading level ${level} follows heading level ${previousLevel}`,
              severity: 'medium',
              fix: `Use h${previousLevel + 1} instead of h${level}`,
              code: `<h${previousLevel + 1}>Heading text</h${previousLevel + 1}>`,
            });
          }
        }
      }
    });
    
    return results;
  };

  // === HELPER FUNCTIONS ===

  const getFixForError = (error: string): string => {
    if (error.includes('alt text')) return 'Add alt attribute to image';
    if (error.includes('label')) return 'Add label, aria-label, or aria-labelledby';
    if (error.includes('role')) return 'Add appropriate role attribute';
    if (error.includes('keyboard')) return 'Add keyboard event handlers';
    return 'Review element for accessibility compliance';
  };

  const getFixForWarning = (warning: string): string => {
    if (warning.includes('heading')) return 'Fix heading hierarchy';
    if (warning.includes('tabindex')) return 'Review tabindex usage';
    if (warning.includes('aria')) return 'Review ARIA attributes';
    return 'Review element for accessibility best practices';
  };

  const getFixForSuggestion = (suggestion: string): string => {
    return 'Consider implementing suggested improvement';
  };

  const generateSummary = (
    testResults: AccessibilityTestResult[], 
    colorContrastResults: ColorContrastResult[]
  ) => {
    const totalIssues = testResults.length + colorContrastResults.length;
    const criticalIssues = testResults.filter(r => r.severity === 'high').length;
    const highPriorityIssues = testResults.filter(r => r.severity === 'medium').length;
    const mediumPriorityIssues = testResults.filter(r => r.severity === 'low').length;
    const lowPriorityIssues = colorContrastResults.length;
    
    return {
      totalIssues,
      criticalIssues,
      highPriorityIssues,
      mediumPriorityIssues,
      lowPriorityIssues,
    };
  };

  // === ELEMENT PICKER ===

  const handleElementPickerClick = (event: MouseEvent) => {
    if (showElementPicker) {
      const target = event.target as HTMLElement;
      if (target !== elementPickerRef.current) {
        setSelectedElement(target);
        setShowElementPicker(false);
        announce(`Selected element: ${target.tagName.toLowerCase()}`, 'polite');
      }
    }
  };

  useEffect(() => {
    if (showElementPicker) {
      document.addEventListener('click', handleElementPickerClick);
      return () => document.removeEventListener('click', handleElementPickerClick);
    }
  }, [showElementPicker]);

  // === RENDER ===

  return (
    <div className="accessibility-tester">
      <div className="tester-header">
        <h2>Accessibility Tester</h2>
        <p>Test your application for accessibility compliance and get detailed reports.</p>
      </div>
      
      <div className="tester-controls">
        <div className="control-group">
          <label>
            <input
              type="radio"
              name="testScope"
              value="page"
              checked={testScope === 'page'}
              onChange={(e) => setTestScope(e.target.value as 'page' | 'element')}
            />
            Test entire page
          </label>
          <label>
            <input
              type="radio"
              name="testScope"
              value="element"
              checked={testScope === 'element'}
              onChange={(e) => setTestScope(e.target.value as 'page' | 'element')}
            />
            Test selected element
          </label>
        </div>
        
        {testScope === 'element' && (
          <div className="element-picker">
            <button
              type="button"
              onClick={() => setShowElementPicker(!showElementPicker)}
              className="button button-secondary"
            >
              {selectedElement ? `Selected: ${selectedElement.tagName.toLowerCase()}` : 'Pick Element'}
            </button>
            {showElementPicker && (
              <div className="picker-overlay" ref={elementPickerRef}>
                Click on any element to select it for testing
              </div>
            )}
          </div>
        )}
        
        <div className="test-options">
          <h3>Test Options</h3>
          <label>
            <input
              type="checkbox"
              checked={includeColorContrast}
              onChange={(e) => setIncludeColorContrast(e.target.checked)}
            />
            Color Contrast
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeAriaValidation}
              onChange={(e) => setIncludeAriaValidation(e.target.checked)}
            />
            ARIA Validation
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeKeyboardNavigation}
              onChange={(e) => setIncludeKeyboardNavigation(e.target.checked)}
            />
            Keyboard Navigation
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeScreenReader}
              onChange={(e) => setIncludeScreenReader(e.target.checked)}
            />
            Screen Reader Support
          </label>
        </div>
        
        <button
          type="button"
          onClick={runAccessibilityTest}
          disabled={isRunning}
          className="button button-primary"
        >
          {isRunning ? 'Running Tests...' : 'Run Accessibility Test'}
        </button>
      </div>
      
      {report && (
        <div className="test-report">
          <div className="report-header">
            <h3>Test Report</h3>
            <div className="report-meta">
              <span>Generated: {report.timestamp.toLocaleString()}</span>
              <span>URL: {report.url}</span>
              <span>Elements tested: {report.totalElements}</span>
            </div>
          </div>
          
          <div className="report-summary">
            <h4>Summary</h4>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-value">{report.summary.totalIssues}</span>
                <span className="stat-label">Total Issues</span>
              </div>
              <div className="stat">
                <span className="stat-value critical">{report.summary.criticalIssues}</span>
                <span className="stat-label">Critical</span>
              </div>
              <div className="stat">
                <span className="stat-value high">{report.summary.highPriorityIssues}</span>
                <span className="stat-label">High Priority</span>
              </div>
              <div className="stat">
                <span className="stat-value medium">{report.summary.mediumPriorityIssues}</span>
                <span className="stat-label">Medium Priority</span>
              </div>
              <div className="stat">
                <span className="stat-value low">{report.summary.lowPriorityIssues}</span>
                <span className="stat-label">Low Priority</span>
              </div>
            </div>
          </div>
          
          <div className="report-details">
            {report.errors.length > 0 && (
              <div className="report-section">
                <h4>Errors ({report.errors.length})</h4>
                <div className="issue-list">
                  {report.errors.map((error, index) => (
                    <div key={index} className="issue-item error">
                      <div className="issue-header">
                        <span className="issue-type">Error</span>
                        <span className="issue-severity">{error.severity}</span>
                      </div>
                      <div className="issue-message">{error.message}</div>
                      <div className="issue-element">Element: {error.element}</div>
                      {error.fix && (
                        <div className="issue-fix">
                          <strong>Fix:</strong> {error.fix}
                        </div>
                      )}
                      {error.code && (
                        <div className="issue-code">
                          <strong>Code:</strong>
                          <pre><code>{error.code}</code></pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {report.warnings.length > 0 && (
              <div className="report-section">
                <h4>Warnings ({report.warnings.length})</h4>
                <div className="issue-list">
                  {report.warnings.map((warning, index) => (
                    <div key={index} className="issue-item warning">
                      <div className="issue-header">
                        <span className="issue-type">Warning</span>
                        <span className="issue-severity">{warning.severity}</span>
                      </div>
                      <div className="issue-message">{warning.message}</div>
                      <div className="issue-element">Element: {warning.element}</div>
                      {warning.fix && (
                        <div className="issue-fix">
                          <strong>Fix:</strong> {warning.fix}
                        </div>
                      )}
                      {warning.code && (
                        <div className="issue-code">
                          <strong>Code:</strong>
                          <pre><code>{warning.code}</code></pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {report.suggestions.length > 0 && (
              <div className="report-section">
                <h4>Suggestions ({report.suggestions.length})</h4>
                <div className="issue-list">
                  {report.suggestions.map((suggestion, index) => (
                    <div key={index} className="issue-item suggestion">
                      <div className="issue-header">
                        <span className="issue-type">Suggestion</span>
                        <span className="issue-severity">{suggestion.severity}</span>
                      </div>
                      <div className="issue-message">{suggestion.message}</div>
                      <div className="issue-element">Element: {suggestion.element}</div>
                      {suggestion.fix && (
                        <div className="issue-fix">
                          <strong>Fix:</strong> {suggestion.fix}
                        </div>
                      )}
                      {suggestion.code && (
                        <div className="issue-code">
                          <strong>Code:</strong>
                          <pre><code>{suggestion.code}</code></pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {report.colorContrast.length > 0 && (
              <div className="report-section">
                <h4>Color Contrast Issues ({report.colorContrast.length})</h4>
                <div className="issue-list">
                  {report.colorContrast.map((contrast, index) => (
                    <div key={index} className="issue-item contrast">
                      <div className="issue-header">
                        <span className="issue-type">Color Contrast</span>
                        <span className="issue-severity">{contrast.level}</span>
                      </div>
                      <div className="issue-message">
                        Contrast ratio: {contrast.ratio}:1 (requires {contrast.level === 'AA' ? '4.5:1' : '7:1'})
                      </div>
                      <div className="issue-element">Element: {contrast.element}</div>
                      <div className="issue-colors">
                        <div className="color-sample" style={{ backgroundColor: contrast.background, color: contrast.foreground }}>
                          Sample text
                        </div>
                        <div className="color-info">
                          <div>Foreground: {contrast.foreground}</div>
                          <div>Background: {contrast.background}</div>
                          <div>Font size: {contrast.fontSize}px</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityTester;
