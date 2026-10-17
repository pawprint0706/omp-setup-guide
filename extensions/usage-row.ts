import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const providers = [
  ["openai-codex", "omp-codex-usage", "codex-usage.ts"],
  ["opencode-go", "omp-opencode-go-usage", "opencode-go-usage.ts"],
  ["openrouter", "omp-openrouter-credits", "openrouter-credits.ts"],
] as const;
const statusKey = "usage-row";

interface Context {
  agent?: { kind?: string };
  ui: {
    setStatus(key: string, text: string | undefined): void;
    readonly theme: {
      icon: { omp: string };
      fg(color: "dim" | "statusLineSep", text: string): string;
    };
  };
  sessionManager: { getSessionId(): string };
}
interface API {
  on(event: string, handler: (event: unknown, ctx: Context) => unknown): void;
}

// Run the installed providers once through this adapter, not also as standalone
// extensions. Their auth, refresh timers and failure markers remain unchanged.
export default async function usageRow(pi: API): Promise<void> {
  const sessions = new Map<string, Map<string, string>>();
  const contexts = new WeakMap<Context, Context>();
  function adapt(ctx: Context): Context {
    const cached = contexts.get(ctx);
    if (cached) return cached;
    const id = ctx.sessionManager.getSessionId();
    const setStatus = (key: string, text: string | undefined) => {
      if (!providers.some(([provider]) => provider === key)) {
        ctx.ui.setStatus(key, text);
        return;
      }
      const values = sessions.get(id);
      if (!values) return; // Ignore a refresh that finishes after shutdown.
      if (text) values.set(key, text);
      else values.delete(key);
      const row = providers.map(([provider]) => values.get(provider)).filter(Boolean).join(" · ");
      const theme = ctx.ui.theme;
      const badge = theme.icon.omp
        ? theme.fg("dim", theme.icon.omp) + theme.fg("statusLineSep", " · ")
        : "";
      // Hook sanitization trims ordinary leading spaces. U+2800 is a blank,
      // one-cell glyph that preserves the Claude status bar's left inset.
      ctx.ui.setStatus(statusKey, row ? "\u2800" + badge + theme.fg("statusLineSep", row) : undefined);
    };
    // omp freezes its context: define own properties without writing inherited ones.
    const ui = Object.create(ctx.ui, { setStatus: { value: setStatus } });
    const adapted: Context = Object.create(ctx, { ui: { value: ui } });
    contexts.set(ctx, adapted);
    return adapted;
  }

  pi.on("session_start", (_event, ctx) => {
    if (ctx.agent?.kind && ctx.agent.kind !== "main") return;
    sessions.set(ctx.sessionManager.getSessionId(), new Map());
    ctx.ui.setStatus(statusKey, undefined);
  });
  pi.on("session_shutdown", (_event, ctx) => {
    sessions.delete(ctx.sessionManager.getSessionId());
  });
  const api = Object.create(pi);
  api.on = (event: string, handler: (event: unknown, ctx: Context) => unknown) => {
    pi.on(event, (payload, ctx) => handler(payload, adapt(ctx)));
  };
  // The guide installs these packages in the default user plugin directory.
  // Dynamic import is required because the installation root is the user's home.
  // Load all factories first: a missing dependency must not start a partial row.
  const factories = await Promise.all(providers.map(async ([, name, file]) => {
    const entry = join(homedir(), ".omp", "plugins", "node_modules", name, "extensions", file);
    return (await import(pathToFileURL(entry).href)).default;
  }));
  for (const factory of factories) await factory(api);
}
