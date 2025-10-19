import WorkflowEditor from './components/WorkflowEditor.jsx';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Workflow Editor &amp; Monitor</h1>
        <p>Design workflows and watch tasks update in real-time.</p>
      </header>
      <main>
        <WorkflowEditor />
      </main>
      <footer className="app-footer">
        Backend endpoints are mocked at <code>http://localhost:8000</code>.
      </footer>
    </div>
  );
}

export default App;
