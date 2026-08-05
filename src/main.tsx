import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import './foundations.css';
import './consensus.css';
import './lesson.css';
import './agent-trust.css';
import './use-cases.css';
import './economics.css';
import './presentation.css';
import './social-use-case.css';
import './core-use-cases.css';
import './speaker-guide.css';
import './product-deck.css';
import './product-evidence.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
