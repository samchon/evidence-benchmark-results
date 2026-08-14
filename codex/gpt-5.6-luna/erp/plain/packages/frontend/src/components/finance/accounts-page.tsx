import { useState, type FormEvent } from "react";

import { Button, EmptyState, ErrorState, Field, LoadingState, PageHeader, Panel } from "@/components/ui/primitives";
import { useAccountActions, useAccounts } from "@/lib/erp/hooks";
import { errorMessage } from "@/lib/utils";

const types = ["asset", "liability", "equity", "revenue", "expense"] as const;

export function AccountsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ code: "", name: "", type: "expense" as (typeof types)[number], currency: "USD" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const accounts = useAccounts(search, page);
  const actions = useAccountActions();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (editingId === null) actions.create.mutate({ ...form, parentId: null }, { onSuccess: () => setForm({ code: "", name: "", type: "expense", currency: "USD" }) });
    else actions.update.mutate({ id: editingId, body: { name: form.name } }, { onSuccess: () => { setEditingId(null); setForm({ code: "", name: "", type: "expense", currency: "USD" }); } });
  };
  return <div className="page">
    <PageHeader eyebrow="Finance / chart of accounts" title="Accounts" description="Keep account identity and hierarchy ready for every source-linked posting." />
    <div className="content-grid finance-grid">
      <Panel title={editingId === null ? "Create an account" : "Edit an account"} eyebrow="Finance manager"><form onSubmit={(event) => { submit(event); }}><Field label="Account code"><input aria-label="Account code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} required disabled={editingId !== null} /></Field><Field label="Account name"><input aria-label="Account name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></Field><Field label="Type"><select aria-label="Account type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as (typeof types)[number] })}>{types.map((type) => <option key={type}>{type}</option>)}</select></Field><Field label="Currency"><input aria-label="Account currency" maxLength={3} value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value.toUpperCase() })} required /></Field>{actions.create.error || actions.update.error ? <p className="form-error" role="alert">{errorMessage(actions.create.error ?? actions.update.error)}</p> : null}<div className="button-row"><Button type="submit" disabled={actions.create.isPending || actions.update.isPending}>{actions.create.isPending || actions.update.isPending ? "Saving..." : editingId === null ? "Create account" : "Save account"}</Button>{editingId === null ? null : <Button tone="quiet" onPress={() => { setEditingId(null); setForm({ code: "", name: "", type: "expense", currency: "USD" }); }}>Cancel</Button>}</div></form></Panel>
      <Panel title="Active chart" eyebrow="Search and inspect"><div className="toolbar"><Field label="Search by code or name"><input aria-label="Search accounts" value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="e.g. 4100 or revenue" /></Field><span className="result-count">{accounts.data?.pagination.records ?? 0} records</span></div>{accounts.isPending ? <LoadingState /> : accounts.error ? <ErrorState message={accounts.error.message} retry={() => { void accounts.refetch(); }} /> : accounts.data?.data.length === 0 ? <EmptyState title="No matching accounts" message={search ? "Try a different code or name." : "Create the first account for this organization."} /> : <div className="table-wrap"><table><thead><tr><th>Code</th><th>Name</th><th>Type</th><th>Currency</th><th>Status</th><th>Actions</th></tr></thead><tbody>{accounts.data?.data.map((account) => <tr key={account.id}><td className="mono">{account.code}</td><td><strong>{account.name}</strong></td><td>{account.type}</td><td>{account.currency}</td><td><span className={account.active ? "status status-active" : "status"}>{account.active ? "Active" : "Inactive"}</span></td><td><div className="button-row"><Button tone="quiet" onPress={() => { setEditingId(account.id); setForm({ code: account.code, name: account.name, type: account.type, currency: account.currency }); }}>Edit</Button><Button tone="danger" disabled={!account.active || actions.erase.isPending} onPress={() => { void actions.erase.mutateAsync(account.id); }}>Deactivate</Button></div></td></tr>)}</tbody></table></div>}<div className="pagination"><Button tone="quiet" disabled={page <= 1} onPress={() => setPage(page - 1)}>Previous</Button><span>Page {page}</span><Button tone="quiet" disabled={(accounts.data?.data.length ?? 0) < 12} onPress={() => setPage(page + 1)}>Next</Button></div></Panel>
    </div>
  </div>;
}
