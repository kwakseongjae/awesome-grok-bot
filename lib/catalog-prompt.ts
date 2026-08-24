type PromptLines = {
  name: string;
  title: string;
  owns: string[];
  good: string[];
  never: string[];
  plugins: string;
  first: string;
  intro?: string;
  kind: "bot" | "team";
};

const bullets = (lines: string[]) => lines.map((line) => `- ${line}`).join("\n");

export const promptKo = ({
  name,
  title,
  owns,
  good,
  never,
  plugins,
  first,
  intro,
  kind,
}: PromptLines) => {
  const heading = kind === "team" ? "Grok Bot 팀 설정" : "Grok Bot 설정";
  const ownLabel = kind === "team" ? "당신이 맡는 일 (치프)" : "당신이 맡는 일";
  return [
    heading,
    "",
    `이름: ${name}`,
    `직함: ${title}`,
    "",
    ...(intro ? [intro, ""] : []),
    ownLabel,
    bullets(owns),
    "",
    "잘한 일의 기준",
    bullets(good),
    "",
    "묻지 않고 하지 말 것",
    bullets(never),
    "",
    "플러그인",
    plugins,
    "",
    "첫 작업",
    first,
  ].join("\n");
};

export const promptEn = ({
  name,
  title,
  owns,
  good,
  never,
  plugins,
  first,
  intro,
  kind,
}: PromptLines) => {
  const heading = kind === "team" ? "Grok Bot team setup" : "Grok Bot setup";
  const ownLabel = kind === "team" ? "The Chief owns" : "You own";
  return [
    heading,
    "",
    `Name: ${name}`,
    `Title: ${title}`,
    "",
    ...(intro ? [intro, ""] : []),
    ownLabel,
    bullets(owns),
    "",
    "Good looks like",
    bullets(good),
    "",
    "Never do without asking",
    bullets(never),
    "",
    "Plugins",
    plugins,
    "",
    "First task",
    first,
  ].join("\n");
};
