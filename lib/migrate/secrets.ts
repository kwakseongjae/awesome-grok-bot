const SKIP_NAME_RE =
  /(^|\/)(\.env(\..*)?|auth\.json|auth-profiles\.json|credentials\.json|secret\.json|secrets\.json|\.npmrc|\.netrc|id_rsa|id_ed25519|.*\.(pem|p12|pfx|key|crt|cer))$/i;

const SKIP_DIR_RE =
  /(^|\/)(sessions|transcripts|logs|backups|state-snapshots|checkpoints|\.git|node_modules)(\/|$)/i;

const SKIP_DB_RE = /(^|\/)(state\.db.*|.*\.(db|sqlite|sqlite3|bin))$/i;

const SECRET_KEY_LINE =
  /^\s*(?:export\s+)?([A-Z0-9_]*((API|ACCESS|SECRET|TOKEN|PASSWORD|PRIVATE|AUTH)[_-]?KEY|BOT_TOKEN|APP_TOKEN|ACCESS_TOKEN|REFRESH_TOKEN|CLIENT_SECRET|GATEWAY_TOKEN)|apiKey|botToken|appToken|accessToken|refreshToken|clientSecret)\s*([:=])\s*.+$/gim;

const KEY_SHAPE_RE =
  /\b(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|xapp-[A-Za-z0-9-]{10,}|AIza[A-Za-z0-9_-]{20,}|AKIA[A-Z0-9]{16}|ya29\.[A-Za-z0-9._-]+|npm_[A-Za-z0-9]{20,})\b/g;

const BEGIN_SECRET_RE =
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g;

export function normalizeArchivePath(raw: string) {
  return raw.replace(/\\/g, "/").replace(/^\.\/+/, "").replace(/^\/+/, "");
}

export function shouldSkipPath(raw: string) {
  const path = normalizeArchivePath(raw);
  if (!path || path.includes("..")) return true;
  if (SKIP_NAME_RE.test(path) || SKIP_DIR_RE.test(path) || SKIP_DB_RE.test(path)) {
    return true;
  }
  return false;
}

/** Secret-looking paths. Inventory lists the path as `skipped: secret` and never reads the file. */
export function isSecretPath(raw: string) {
  const path = normalizeArchivePath(raw);
  if (!path) return true;
  if (SKIP_NAME_RE.test(path) || SKIP_DB_RE.test(path)) return true;
  if (/(^|\/)(sessions|transcripts)(\/|$)/i.test(path)) return true;
  return false;
}

export function isTextPath(raw: string) {
  const path = normalizeArchivePath(raw).toLowerCase();
  return /\.(md|markdown|txt|json|ya?ml|toml)$/.test(path) || /(^|\/)(soul|agents|identity|user|memory|heartbeat|dreams|tools|bootstrap)$/i.test(path);
}

export function redactSecrets(text: string) {
  let count = 0;
  const mark = () => {
    count += 1;
    return "[redacted]";
  };

  let next = text.replace(BEGIN_SECRET_RE, () => mark());
  next = next.replace(SECRET_KEY_LINE, (full) => {
    count += 1;
    const withoutExport = full.replace(/^\s*(?:export\s+)?/, "");
    const sep = withoutExport.includes(":") ? ":" : "=";
    const key = withoutExport.split(/[:=]/)[0]?.trim() || "secret";
    return `${key}${sep} [redacted]`;
  });
  next = next.replace(KEY_SHAPE_RE, () => mark());
  next = next.replace(
    /("?(?:apiKey|botToken|appToken|accessToken|refreshToken|clientSecret|token|password|secret)"?\s*:\s*)("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\{[^}]*"source"\s*:\s*"env"[^}]*\})/gi,
    (_full, prefix: string) => {
      count += 1;
      return `${prefix}"[redacted]"`;
    },
  );
  return { text: next, count };
}
