import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import './foundations.css';
import './consensus.css';
import './lesson.css';
import './agent-trust.css';
import './use-cases.css';
import './presentation.css';
import './social-use-case.css';
import './core-use-cases.css';
import './speaker-guide.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
