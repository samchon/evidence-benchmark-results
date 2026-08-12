import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useSession } from "@/lib/session";
import { Button, Card, Field } from "@/components/ui";
import { errorMessage, useAuthActions } from "@/lib/hooks";

type Mode = "login" | "register" | "recover";

export function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [proof, setProof] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const auth = useAuthActions();
  const { session } = useSession();
  const navigate = useNavigate();
  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (mode === "login") {
      auth.login.mutate(
        { email, password },
        {
          onSuccess: () => {
            void navigate("/");
          },
        },
      );
    } else if (mode === "register") {
      auth.join.mutate(
        { email, username, password },
        {
          onSuccess: () => {
            void navigate("/");
          },
        },
      );
    } else {
      auth.recoveryRequest.mutate(
        { email },
        {
          onSuccess: () =>
            toast.success(
              "If the account exists, recovery instructions were sent.",
            ),
        },
      );
    }
  };
  const failure = auth.login.error ?? auth.join.error ?? auth.recoveryRequest.error ?? auth.recoveryComplete.error;
  return (
    <div className="auth-layout">
      <section className="hero-copy">
        <p className="eyebrow">A clear public square</p>
        <h1>Read widely. Participate with context.</h1>
        <p>Explore public communities, follow conversations, and use scoped tools when you have authority in a community.</p>
        <div className="principles"><span>Public by default</span><span>Private moderation</span><span>Keyboard ready</span></div>
      </section>
      <Card className="auth-card">
        <div className="tab-list" role="tablist" aria-label="Account actions">
          <button className={mode === "login" ? "tab active" : "tab"} role="tab" aria-selected={mode === "login"} type="button" onClick={() => setMode("login")}>Sign in</button>
          <button className={mode === "register" ? "tab active" : "tab"} role="tab" aria-selected={mode === "register"} type="button" onClick={() => setMode("register")}>Create account</button>
          <button className={mode === "recover" ? "tab active" : "tab"} role="tab" aria-selected={mode === "recover"} type="button" onClick={() => setMode("recover")}>Recover</button>
        </div>
        <h2>{mode === "login" ? "Welcome back" : mode === "register" ? "Join the conversation" : "Recover access"}</h2>
        <p className="muted">{mode === "recover" ? "We use a neutral response so account membership stays private." : "Your email remains private. Your username is public."}</p>
        <form onSubmit={submit} className="form-stack">
          <Field label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
          {mode === "register" ? <Field label="Username" value={username} onChange={setUsername} required autoComplete="username" /> : null}
          {mode !== "recover" ? <Field label="Password" type="password" value={password} onChange={setPassword} required autoComplete={mode === "login" ? "current-password" : "new-password"} /> : null}
          {failure !== null && failure !== undefined ? <p className="form-error" role="alert">{errorMessage(failure)}</p> : null}
          <Button type="submit" disabled={auth.login.isPending || auth.join.isPending || auth.recoveryRequest.isPending}>
            {mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send recovery request"}
          </Button>
        </form>
        {mode === "recover" ? <form className="form-stack compact" onSubmit={(event) => { event.preventDefault(); auth.recoveryComplete.mutate({ proof, newPassword }, { onSuccess: () => { toast.success("Password replaced. Please sign in again."); setMode("login"); } }); }}>
          <Field label="Recovery proof" value={proof} onChange={setProof} placeholder="Provided by your email channel" required />
          <Field label="New password" type="password" value={newPassword} onChange={setNewPassword} autoComplete="new-password" required />
          <Button type="submit" variant="quiet" disabled={auth.recoveryComplete.isPending}>Complete recovery</Button>
        </form> : null}
        {session !== null ? <Button variant="quiet" action={() => { auth.refresh.mutate({ refreshToken: session.refreshToken }); }}>Continue current session</Button> : null}
      </Card>
    </div>
  );
}
