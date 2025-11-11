import { useState } from 'react';
import './test.css';

function Test() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setCount(1);
    setTimeout(() => setIsRunning(false), 500);
  };

  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    setCount(prev => Math.max(0, prev - 1));
  };

  const codeSnippet = 
    `import { useState } from 'react';

    function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div className="counter">
        <h1>Count: {count}</h1>
        <button onClick={() => setCount(count + 1)}>
            Increment
        </button>
        </div>
    );
    }

    export default Counter;`;

  return (
    <div className="test-container">
      <div className="test-background-glow"></div>
      <section className="test-hero">
        <div className="test-badge mb-8">
          UI/UX Style Testing
        </div>
        
        <h1 className="test-hero-title">
          Lorem ipsum
        </h1>
        
        <p className="test-hero-subtitle">
          Rocks are naturally occurring solids made of minerals and are classified into three main types: igneous, sedimentary, and metamorphic, based on how they form. 
        </p>
        
        <div className="test-hero-buttons">
          <button className="test-button-solid">
            Get started for free
          </button>
          <button className="test-button-glass">
            See features & modes
          </button>
        </div>
      </section>

      <section className="test-ide-section">
        <div className="test-ide-wrapper">
          <div className="test-ide-container">
            <div className="test-ide-header">
              <div className="test-ide-dots">
                <div className="test-ide-dot red"></div>
                <div className="test-ide-dot yellow"></div>
                <div className="test-ide-dot green"></div>
              </div>
              <span className="test-ide-filename">Counter.jsx</span>
            </div>
            
            <div className="test-ide-body">
              <div className="test-ide-code">
                <pre>
                  <code className="test-code-content">{codeSnippet}</code>
                </pre>
              </div>
              
              <div className="test-ide-output">
                <div className="test-output-header">Output</div>
                <div className="test-output-content">
                  <div className="test-ide-count">{count}</div>
                  <div className="test-output-status">
                    {isRunning ? '⚡ Running...' : `Bomb meledak`}
                  </div>
                  
                  <div className="test-ide-buttons">
                    <button 
                      className="test-ide-button run"
                      onClick={handleRun}
                    >
                      ▶ Run
                    </button>
                    <button 
                      className="test-ide-button"
                      onClick={handleIncrement}
                    >
                      + Increment
                    </button>
                    <button 
                      className="test-ide-button"
                      onClick={handleDecrement}
                    >
                      − Decrement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="test-editor-section">
        <div className="test-editor-content">
          <div className="test-editor-text">
            <h2 className="test-section-title">
              Make your chimcken<br />most powerful chimcken
            </h2>
            <p className="test-section-description">
              Chickens form complex social hierarchies, known as a "pecking order".
            </p>
            <a href="#" className="test-link">
              Explore Chimcken in the IDE →
            </a>
          </div>
          
          <div className="test-editor-mockup">
            <div className="test-mini-ide">
              <div className="test-mini-ide-header">
                <span className="test-mini-badge">Chimcken</span>
              </div>
              <div className="test-mini-ide-content">
                <div className="test-file-list">
                  <div className="test-file-item">
                    <span className="test-file-icon ts">TS</span>
                    <span>kfc-service.ts</span>
                    <span className="test-file-path">src/lib/data</span>
                  </div>
                  <div className="test-file-item">
                    <span className="test-file-icon ts">TS</span>
                    <span>kfc-service.test.ts</span>
                    <span className="test-file-path">src/lib/data</span>
                  </div>
                  <div className="test-file-item">
                    <span className="test-file-icon ts">TS</span>
                    <span>kfc.page.server.ts</span>
                    <span className="test-file-path">src/routes</span>
                  </div>
                  <div className="test-file-item">
                    <span className="test-file-icon svelte">S</span>
                    <span>kfc.page.svelte</span>
                    <span className="test-file-path">src/routes</span>
                  </div>
                </div>
                <div className="test-agent-mode">
                  <span>Edit files in your workspace in agent mode</span>
                  <div className="test-agent-buttons">
                    <button>Agent ▼</button>
                    <button>Auto ▼</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="test-workflow-section">
        <div className="test-workflow-badge">
          <span className="test-badge">Workflow</span>
        </div>
        
        <h2 className="test-section-title-center">
          Code, command, and collaborate
        </h2>
        <p className="test-section-description-center">
          AI that works for you like a slave, <br />what a time to be a live
        </p>
      </section>

      <section className="test-features-section">
        <div className="test-features-grid">
          <div className="test-feature-card">
            <div className="test-feature-icon-wrapper">
              <svg className="test-feature-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="test-feature-title">
              Go beyond one-size-fits-all
            </h3>
            <p className="test-feature-description">
              that what she said
            </p>
          </div>

          <div className="test-feature-card">
            <div className="test-feature-icon-wrapper">
              <svg className="test-feature-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="test-feature-title">
              Use your agents, your way
            </h3>
            <p className="test-feature-description">
              the feds
            </p>
          </div>

          <div className="test-feature-card">
            <div className="test-feature-icon-wrapper">
              <svg className="test-feature-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="test-feature-title">
              Stay in your flow
            </h3>
            <p className="test-feature-description">
              obama
            </p>
          </div>
        </div>
      </section>

      <section className="test-organization-section">
        <h2 className="test-section-title-center">
          Tailor-made for your organization
        </h2>
        <p className="test-section-description-center">
          Shape the earth using the powers of,<br /> Lorem Ipsum.
        </p>

        <div className="test-org-cards">
          <div className="test-org-card">
            <h3 className="test-org-card-title">
              Turn Chimcken into a project expert
            </h3>
            <p className="test-org-card-description">
              Scale knowledge and keep teams consistent by creating a shared source of truth that includes context from your docs and repositories.
            </p>
            <a href="#" className="test-link-blue">
              Try Chimcken Spaces →
            </a>
          </div>

          <div className="test-org-card">
            <h3 className="test-org-card-title">
              Manage agent usage with enterprise-grade controls
            </h3>
            <p className="test-org-card-description">
              Track activity with detailed audit logs and enforce governance by managing agents from a single control plane.
            </p>
            <a href="#" className="test-link-blue">
              Read the docs →
            </a>
          </div>

          <div className="test-org-card">
            <h3 className="test-org-card-title">
              Secure your MCP integrations
            </h3>
            <p className="test-org-card-description">
              Control which MCP servers developers can access from their IDEs, and use allow lists to prevent unauthorized access.
            </p>
            <a href="#" className="test-link-blue">
              Read the docs →
            </a>
          </div>
        </div>
      </section>

      <footer className="test-footer">
        <div className="test-footer-content">
          <div className="test-footer-brand">
            <div className="test-footer-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>MapDevineur</span>
            </div>
            <p className="test-footer-tagline">
              BY MAPDEVINEUR TEAM
            </p>
            <p className="test-footer-copyright">
              © 2025 MapDevineur Project
            </p>
            <div className="test-footer-social">
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="test-footer-links">
            <div className="test-footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>

            <div className="test-footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className="test-footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Community</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">Learn</a></li>
                <li><a href="#">Status</a></li>
                <li><a href="#">Partners</a></li>
              </ul>
            </div>

            <div className="test-footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Compliance</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Test;