export type InstallTool = {
  id: "claude-code" | "codex" | "openclaw" | "hermes";
  name: string;
  summaryKey: "claudeCode" | "codex" | "openclaw" | "hermes";
  docs?: string;
  starter: string;
};

export const INSTALL_TOOLS: InstallTool[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    summaryKey: "claudeCode",
    docs: "https://docs.anthropic.com/en/docs/claude-code",
    starter: `Install Claude Code on your cloud computer.

1. Run: npm install -g @anthropic-ai/claude-code
2. Verify it with: claude --version
3. HARD RULE: never type credentials, passwords, API keys, tokens, 2FA codes, or CAPTCHA answers. At any login or API-key step, stop and ask me to do it. Logins stay human.
4. After I finish any required login, run one small smoke task: open a repository README and ask Claude Code to summarize it without changing files.
5. Report the installed version, what the smoke task did, and what Claude Code can now do on this computer.`,
  },
  {
    id: "codex",
    name: "Codex CLI",
    summaryKey: "codex",
    docs: "https://developers.openai.com/codex/cli",
    starter: `Install Codex CLI on your cloud computer.

1. Run: npm install -g @openai/codex
2. Verify it with: codex --version
3. HARD RULE: never type credentials, passwords, API keys, tokens, 2FA codes, or CAPTCHA answers. At any login or API-key step, stop and ask me to do it. Logins stay human.
4. After I finish any required login, run one small smoke task: open a repository README and ask Codex to summarize it without changing files.
5. Report the installed version, what the smoke task did, and what Codex can now do on this computer.`,
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    summaryKey: "openclaw",
    docs: "https://docs.openclaw.ai/",
    starter: `Install OpenClaw on your cloud computer.

1. Read the official install docs first: https://docs.openclaw.ai/ (source repo: https://github.com/openclaw/openclaw)
2. Run: npm install -g openclaw@latest
3. Verify it with: openclaw --version
4. HARD RULE: never type credentials, passwords, API keys, tokens, 2FA codes, or CAPTCHA answers. At any login or API-key step, stop and ask me to do it. Logins stay human.
5. After I finish any required login, run one small read-only smoke task, such as summarizing a repository README.
6. Report the installed version, what the smoke task did, and what OpenClaw can now do on this computer.`,
  },
  {
    id: "hermes",
    name: "Hermes",
    summaryKey: "hermes",
    docs: "https://hermes-agent.nousresearch.com/docs/getting-started/installation",
    starter: `Install Hermes Agent (Nous Research) on your cloud computer.

1. Read the official install docs first: https://hermes-agent.nousresearch.com/docs/getting-started/installation (source repo: https://github.com/NousResearch/hermes-agent)
2. Run: pip install hermes-agent
3. Verify it with: hermes --version
4. HARD RULE: never type credentials, passwords, API keys, tokens, 2FA codes, or CAPTCHA answers. At any login or API-key step, stop and ask me to do it. Logins stay human.
5. After I finish any required login, run one small read-only smoke task, such as summarizing a repository README.
6. Report the installed version, what the smoke task did, and what Hermes can now do on this computer.`,
  },
];
