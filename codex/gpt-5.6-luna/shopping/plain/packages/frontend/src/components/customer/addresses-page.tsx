/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import * as api from "@benchmark/shopping-api";
import { useState } from "react";

import { Button, Card, Field, LoadingState, PageHeader, StatusPill, ErrorState } from "@/components/ui";
import { useAddresses, useShoppingOperations } from "@/lib/shopping/hooks";
import { toErrorMessage } from "@/lib/utils";

const blank: api.IShoppingShippingAddress.ICreate = { recipientName: "", recipientPhone: "", streetAddress: "", city: "", stateOrProvince: "", postalCode: "", country: "" };

export function AddressesPage() {
  const query = useAddresses();
  const operations = useShoppingOperations();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const reset = () => { setForm(blank); setEditing(null); };
  const run = async (action: () => Promise<unknown>, success: string) => {
    if (busy) return;
    setBusy(true); setError(null); setMessage(null);
    try { await action(); setMessage(success); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); }
  };
  if (query.isPending) return <section className="page"><LoadingState /></section>;
  if (query.error !== null && query.error !== undefined) return <section className="page"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></section>;
  return <section className="page">
    <PageHeader eyebrow="Customer / delivery" title="Saved addresses" detail="Keep complete destinations here; checkout copies the selected values into order history." />
    <div className="split-layout">
      <div className="stack">{query.data?.data.map((address) => <Card key={address.id}><div className="split"><h2>{address.recipientName}</h2>{address.isDefault ? <StatusPill value="Default" tone="good" /> : null}</div><p>{address.recipientPhone}</p><p>{address.streetAddress}, {address.city}, {address.stateOrProvince} {address.postalCode}, {address.country}</p><div className="button-row">{address.isDefault ? null : <Button disabled={busy} tone="quiet" onClick={() => void run(() => operations.customer.addressDefault(address.id), "Default address updated.")}>Make default</Button>}<Button disabled={busy} tone="quiet" onClick={() => { setEditing(address.id); setForm({ recipientName: address.recipientName, recipientPhone: address.recipientPhone, streetAddress: address.streetAddress, city: address.city, stateOrProvince: address.stateOrProvince, postalCode: address.postalCode, country: address.country }); }}>Edit</Button><Button disabled={busy} tone="danger" onClick={() => void run(() => operations.customer.addressDelete(address.id), "Address deleted.")}>Delete</Button></div></Card>)}</div>
      <Card className="form-card"><h2>{editing === null ? "Add address" : "Edit address"}</h2>{(Object.keys(form) as (keyof typeof form)[]).map((key) => <Field label={key.replace(/([A-Z])/g, " $1")} value={form[key]} onChange={(event) => update(key, event.target.value)} key={key} required />)}<div className="button-row"><Button disabled={busy} onClick={() => void run(async () => { if (editing === null) await operations.customer.addressCreate(form); else await operations.customer.addressUpdate(editing, form); reset(); }, editing === null ? "Address saved." : "Address updated.")}>{busy ? "Saving..." : editing === null ? "Save address" : "Update address"}</Button>{editing === null ? null : <Button disabled={busy} tone="quiet" onClick={reset}>Cancel edit</Button>}</div></Card>
    </div>
    {error === null ? null : <p className="form-message error" role="alert">{error}</p>}{message === null ? null : <p className="form-message success" role="status">{message}</p>}
  </section>;
}

export default AddressesPage;
