import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal, dependency-free markdown renderer scoped to what the AI
 * Compliance Assistant actually needs: paragraphs, bold/italic, inline
 * code, links, bullet/numbered lists, simple tables, and fenced code
 * blocks. Avoids pulling in a new package (e.g. react-markdown) purely to
 * render Gemini's structured answers.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Order matters: code spans first (so ** inside `code` isn't touched), then links, then bold, then italic.
  const tokenRe = /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="rounded bg-surface-muted px-1.5 py-0.5 text-[12px] font-mono text-foreground">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        nodes.push(
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary-hover"
          >
            {linkMatch[1]}
          </a>
        );
      }
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }

    lastIndex = tokenRe.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

interface Block {
  type: "p" | "ul" | "ol" | "table" | "code" | "h";
  lines: string[];
  level?: number;
}

function parseBlocks(source: string): Block[] {
  const rawLines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trim().startsWith("```")) {
        code.push(rawLines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: "code", lines: code });
      continue;
    }

    const headingMatch = /^(#{1,4})\s+(.*)/.exec(line);
    if (headingMatch) {
      blocks.push({ type: "h", lines: [headingMatch[2]], level: headingMatch[1].length });
      i++;
      continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line) && rawLines[i + 1] && /^\s*\|[\s:|-]+\|\s*$/.test(rawLines[i + 1])) {
      const tableLines: string[] = [line];
      i++;
      i++; // skip separator row
      while (i < rawLines.length && /^\s*\|.*\|\s*$/.test(rawLines[i])) {
        tableLines.push(rawLines[i]);
        i++;
      }
      blocks.push({ type: "table", lines: tableLines });
      continue;
    }

    if (/^\s*[-*•]\s+/.test(line)) {
      const items: string[] = [];
      while (i < rawLines.length && /^\s*[-*•]\s+/.test(rawLines[i])) {
        items.push(rawLines[i].replace(/^\s*[-*•]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", lines: items });
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < rawLines.length && /^\s*\d+[.)]\s+/.test(rawLines[i])) {
        items.push(rawLines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", lines: items });
      continue;
    }

    const paragraph: string[] = [line];
    i++;
    while (i < rawLines.length && rawLines[i].trim() !== "" && !/^\s*[-*•]\s+/.test(rawLines[i]) && !/^\s*\d+[.)]\s+/.test(rawLines[i]) && !rawLines[i].trim().startsWith("```") && !/^#{1,4}\s/.test(rawLines[i])) {
      paragraph.push(rawLines[i]);
      i++;
    }
    blocks.push({ type: "p", lines: paragraph });
  }

  return blocks;
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const blocks = React.useMemo(() => parseBlocks(content), [content]);

  return (
    <div className={cn("space-y-2.5 text-[13.5px] leading-relaxed text-foreground", className)}>
      {blocks.map((block, idx) => {
        const key = `b-${idx}`;

        if (block.type === "h") {
          const Tag = (["h4", "h4", "h5", "h5"][Math.min((block.level ?? 1) - 1, 3)] ?? "h4") as "h4" | "h5";
          return (
            <Tag key={key} className="font-display font-semibold text-foreground">
              {renderInline(block.lines[0], key)}
            </Tag>
          );
        }

        if (block.type === "code") {
          return (
            <pre key={key} className="overflow-x-auto rounded-xl bg-secondary px-3.5 py-3 text-[12px] text-slate-100">
              <code className="font-mono">{block.lines.join("\n")}</code>
            </pre>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={key} className="ml-4 list-disc space-y-1 marker:text-foreground-subtle">
              {block.lines.map((item, i2) => (
                <li key={`${key}-${i2}`}>{renderInline(item, `${key}-${i2}`)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={key} className="ml-4 list-decimal space-y-1 marker:text-foreground-subtle">
              {block.lines.map((item, i2) => (
                <li key={`${key}-${i2}`}>{renderInline(item, `${key}-${i2}`)}</li>
              ))}
            </ol>
          );
        }

        if (block.type === "table") {
          const rows = block.lines.map((l) =>
            l
              .trim()
              .replace(/^\|/, "")
              .replace(/\|$/, "")
              .split("|")
              .map((c) => c.trim())
          );
          const [header, ...body] = rows;
          return (
            <div key={key} className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-left text-[12.5px]">
                <thead className="bg-surface-muted">
                  <tr>
                    {header.map((h, hi) => (
                      <th key={hi} className="border-b border-border px-3 py-2 font-semibold text-foreground">
                        {renderInline(h, `${key}-h${hi}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri} className="border-b border-border-soft last:border-0">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 text-foreground-muted">
                          {renderInline(cell, `${key}-${ri}-${ci}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return <p key={key}>{renderInline(block.lines.join(" "), key)}</p>;
      })}
    </div>
  );
}
