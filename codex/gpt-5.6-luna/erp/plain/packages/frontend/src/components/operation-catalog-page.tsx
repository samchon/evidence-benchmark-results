import { useState } from "react";
import { usePublishedOperations, useRunPublishedOperation } from "@/lib/operations/hooks";

/** Gives authorized users a discoverable typed command catalog. */
export function OperationCatalogPage() {
  const operations = usePublishedOperations();
  const [selectedId, setSelectedId] = useState(operations[0]?.id ?? "");
  const [args, setArgs] = useState("[]");
  const [inputError, setInputError] = useState("");
  const run = useRunPublishedOperation();
  const selected = operations.find((operation) => operation.id === selectedId) ?? operations[0];
  const invoke = () => {
    try {
      setInputError("");
      const parsed = JSON.parse(args) as unknown;
      if (!Array.isArray(parsed)) throw new Error("Arguments must be a JSON array.");
      if (!selected) throw new Error("Select an operation first.");
      run.mutate({ operation: selected, args: parsed });
    } catch (error) {
      run.reset();
      setInputError(error instanceof Error ? error.message : "Arguments could not be parsed.");
    }
  };
  return <div className="page-stack"><div className="page-heading compact"><div><p className="eyebrow">Command catalog</p><h1>Published operations</h1><p className="lede">Every generated SDK operation is available to a typed command hook.</p></div></div><section className="card form-card" aria-label="Run a generated operation"><div className="card-header"><div><h2>Run an operation</h2><p>Provide the accessor arguments as a JSON array. Refusals remain visible for correction.</p></div></div><label htmlFor="operation-select">Operation</label><select id="operation-select" aria-label="Operation" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{operations.map((operation) => <option key={operation.id} value={operation.id}>{operation.id}</option>)}</select><label htmlFor="operation-args">Arguments</label><textarea id="operation-args" aria-label="Arguments" value={args} onChange={(event) => setArgs(event.target.value)} rows={3} spellCheck={false} /><button type="button" className="button primary" aria-label="Run operation" onClick={invoke} disabled={run.isPending}>{run.isPending ? "Running" : "Run operation"}</button>{inputError && <p className="field-error" role="alert">{inputError}</p>}{run.error && <p className="field-error" role="alert">{run.error instanceof Error ? run.error.message : "The operation was refused."}</p>}{run.data !== undefined && <pre className="result-panel" aria-live="polite">{JSON.stringify(run.data, null, 2)}</pre>}</section><section className="card list-card" aria-label="Published API operations"><div className="list-meta"><span>{operations.length} operations</span><span>Generated SDK</span></div><div className="table-wrap"><table><thead><tr><th>Operation</th><th>Availability</th></tr></thead><tbody>{operations.map((operation) => <tr key={operation.id}><td><code>{operation.id}</code></td><td><span className="status status-active">Available</span></td></tr>)}</tbody></table></div></section></div>;
}
