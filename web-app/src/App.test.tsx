import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('PeopleSync Portal App', () => {
  it('renders side bar with app title', () => {
    render(<App />);
    expect(screen.getByText('PeopleSync')).toBeInTheDocument();
  });

  it('renders main dashboard tabs', () => {
    render(<App />);
    expect(screen.getByText('Recruiter Hub')).toBeInTheDocument();
    expect(screen.getByText('Onboarding Buddy')).toBeInTheDocument();
    expect(screen.getByText('Calibration Coach')).toBeInTheDocument();
  });

  it('renders floating chatbot icon by default', () => {
    render(<App />);
    // Since isMinimized defaults to true, the floating action button should exist
    const chatbotBtn = screen.getByTitle('Open AI Assistant');
    expect(chatbotBtn).toBeInTheDocument();
  });
});
