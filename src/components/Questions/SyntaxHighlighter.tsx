import React from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = styled.div`
  border-radius: 12px;
  overflow: hidden;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const CodeHeader = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CodeTitle = styled.div`
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CodeActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CodeButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CodeContent = styled.div`
  position: relative;
`;

const LineNumbers = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
`;

const LineNumber = styled.div`
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LanguageBadge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  theme?: 'dark' | 'light';
  maxHeight?: string;
  onCopy?: (code: string) => void;
}

const SyntaxHighlighterComponent: React.FC<SyntaxHighlighterProps> = ({
  code,
  language,
  title,
  showLineNumbers = true,
  showCopyButton = true,
  theme = 'dark',
  maxHeight = '400px',
  onCopy
}) => {
  const [copied, setCopied] = React.useState(false);

  const getLanguageColor = (lang: string): string => {
    const colors: { [key: string]: string } = {
      html: '#ff6b6b',
      css: '#4ecdc4',
      javascript: '#45b7d1',
      js: '#45b7d1',
      jsx: '#45b7d1',
      ts: '#3178c6',
      tsx: '#3178c6',
      python: '#3776ab',
      java: '#ed8b00',
      cpp: '#00599c',
      c: '#00599c',
      csharp: '#239120',
      php: '#777bb4',
      ruby: '#cc342d',
      go: '#00add8',
      rust: '#000000',
      swift: '#fa7343',
      kotlin: '#7f52ff',
      sql: '#336791',
      json: '#000000',
      xml: '#ff6b6b',
      yaml: '#cb171e',
      markdown: '#083fa1',
      bash: '#4eaa25',
      shell: '#4eaa25'
    };
    
    return colors[lang.toLowerCase()] || '#95a5a6';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (onCopy) onCopy(code);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((_, index) => (
      <LineNumber key={index}>{index + 1}</LineNumber>
    ));
  };

  const selectedTheme = theme === 'dark' ? vscDarkPlus : vs;

  return (
    <CodeBlock>
      <CodeHeader>
        <CodeTitle>
          {title || `${language.toUpperCase()} Code`}
          <LanguageBadge color={getLanguageColor(language)}>
            {language.toUpperCase()}
          </LanguageBadge>
        </CodeTitle>
        <CodeActions>
          {showCopyButton && (
            <CodeButton onClick={handleCopy}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </CodeButton>
          )}
        </CodeActions>
      </CodeHeader>
      
      <CodeContent>
        {showLineNumbers && (
          <LineNumbers>
            {getLineNumbers()}
          </LineNumbers>
        )}
        
        <SyntaxHighlighter
          language={language}
          style={selectedTheme}
          showLineNumbers={false}
          customStyle={{
            margin: 0,
            padding: '1rem',
            paddingLeft: showLineNumbers ? '3rem' : '1rem',
            background: 'transparent',
            fontSize: '0.9rem',
            lineHeight: '1.4',
            maxHeight,
            overflow: 'auto'
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
        
        {showCopyButton && (
          <CopyButton onClick={handleCopy}>
            {copied ? '✓' : '📋'}
          </CopyButton>
        )}
      </CodeContent>
    </CodeBlock>
  );
};

export default SyntaxHighlighterComponent;
