import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack } from '../../types';
import { getTrackTheme, getTrackColors } from '../../utils/trackColors';

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SwitcherContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const SwitcherHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SwitcherTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TrackTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const TrackTab = styled.button<{ isActive: boolean; trackColor: string; disabled?: boolean }>`
  background: ${props => props.isActive ? props.trackColor : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid ${props => props.isActive ? props.trackColor : 'rgba(255, 255, 255, 0.2)'};
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    ${props => !props.disabled && `
      background: ${props.isActive ? props.trackColor : 'rgba(255, 255, 255, 0.2)'};
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `}
  }
  
  &:active {
    ${props => !props.disabled && 'transform: translateY(0);'}
  }
`;

const TabIcon = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
`;

const TabContent = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

const TrackInfo = styled.div<{ trackColor: string }>`
  background: linear-gradient(135deg, ${props => props.trackColor}20, ${props => props.trackColor}40);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.trackColor}40;
  margin-bottom: 1rem;
`;

const TrackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TrackIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  background: ${props => props.color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const TrackDetails = styled.div`
  flex: 1;
`;

const TrackName = styled.h4`
  color: white;
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const TrackDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const TrackMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const MetaBadge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ trackColor: string; variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : props.trackColor};
  color: white;
  border: 1px solid ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : props.trackColor};
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : props.trackColor};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LockedMessage = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 1rem;
  color: #ffc107;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.color};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

interface TrackSwitcherProps {
  currentTrack: LearningTrack;
  onTrackChange: (track: LearningTrack) => void;
  onStartLearning: (track: LearningTrack) => void;
  onViewProgress: (track: LearningTrack) => void;
  completedTracks: { [key in LearningTrack]: number };
}

const TrackSwitcher: React.FC<TrackSwitcherProps> = ({
  currentTrack,
  onTrackChange,
  onStartLearning,
  onViewProgress,
  completedTracks
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tracks: LearningTrack[] = ['html', 'css', 'javascript'];

  const isTrackUnlocked = (track: LearningTrack): boolean => {
    if (track === 'html') return true; // HTML is always unlocked
    if (track === 'css') return completedTracks.html >= 10;
    if (track === 'javascript') return completedTracks.css >= 15;
    return false;
  };

  const getTrackPrerequisites = (track: LearningTrack): string => {
    if (track === 'html') return '';
    if (track === 'css') return `Complete ${10 - completedTracks.html} more HTML questions`;
    if (track === 'javascript') return `Complete ${15 - completedTracks.css} more CSS questions`;
    return '';
  };

  const getTrackProgress = (track: LearningTrack): number => {
    const total = track === 'html' ? 50 : track === 'css' ? 60 : 80;
    return Math.round((completedTracks[track] / total) * 100);
  };

  return (
    <SwitcherContainer>
      <SwitcherHeader>
        <SwitcherTitle>
          🔄 Switch Learning Track
        </SwitcherTitle>
      </SwitcherHeader>

      <TrackTabs>
        {tracks.map((track) => {
          const theme = getTrackTheme(track);
          const colors = getTrackColors(track);
          const isActive = currentTrack === track;
          const isUnlocked = isTrackUnlocked(track);
          const progress = getTrackProgress(track);

          return (
            <TrackTab
              key={track}
              isActive={isActive}
              trackColor={colors.primary}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onTrackChange(track)}
            >
              <TabIcon color={colors.primary}>
                {theme.icon}
              </TabIcon>
              {theme.name}
              {!isUnlocked && ' 🔒'}
            </TrackTab>
          );
        })}
      </TrackTabs>

      <TabContent>
        {tracks.map((track) => {
          if (track !== currentTrack) return null;

          const theme = getTrackTheme(track);
          const colors = getTrackColors(track);
          const isUnlocked = isTrackUnlocked(track);
          const progress = getTrackProgress(track);
          const prerequisites = getTrackPrerequisites(track);

          return (
            <div key={track}>
              <TrackInfo trackColor={colors.primary}>
                <TrackHeader>
                  <TrackIcon color={colors.primary}>
                    {theme.icon}
                  </TrackIcon>
                  <TrackDetails>
                    <TrackName>{theme.name}</TrackName>
                    <TrackDescription>{theme.description}</TrackDescription>
                  </TrackDetails>
                </TrackHeader>

                <TrackMeta>
                  <MetaBadge color={colors.secondary}>
                    {theme.difficulty.charAt(0).toUpperCase() + theme.difficulty.slice(1)}
                  </MetaBadge>
                  <MetaBadge color={colors.accent}>
                    {theme.totalQuestions} Questions
                  </MetaBadge>
                  <MetaBadge color={colors.primary}>
                    {progress}% Complete
                  </MetaBadge>
                </TrackMeta>

                {!isUnlocked && (
                  <LockedMessage>
                    🔒 {prerequisites}
                  </LockedMessage>
                )}

                <ProgressIndicator>
                  <span>Progress:</span>
                  <ProgressBar>
                    <ProgressFill 
                      percentage={progress} 
                      color={colors.primary} 
                    />
                  </ProgressBar>
                  <span>{progress}%</span>
                </ProgressIndicator>
              </TrackInfo>

              <QuickActions>
                <ActionButton
                  trackColor={colors.primary}
                  onClick={() => onStartLearning(track)}
                  disabled={!isUnlocked}
                >
                  🚀 Start Learning
                </ActionButton>
                <ActionButton
                  trackColor={colors.primary}
                  variant="secondary"
                  onClick={() => onViewProgress(track)}
                >
                  📊 View Progress
                </ActionButton>
              </QuickActions>
            </div>
          );
        })}
      </TabContent>
    </SwitcherContainer>
  );
};

export default TrackSwitcher;
