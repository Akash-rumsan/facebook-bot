export function extractPlainText(html: string): string {
  const stripTags = (str: string) => str.replace(/<[^>]+>/g, "").trim();
  const lines: string[] = [];

  // Extract <h2>
  const h2Match = html.match(/<h2[^>]*>(.*?)<\/h2>/);
  if (h2Match) {
    lines.push(stripTags(h2Match[1]));
  }

  // Extract <p>
  const pMatch = html.match(/<p[^>]*>(.*?)<\/p>/);
  if (pMatch) {
    lines.push(stripTags(pMatch[1]));
  }

  // Extract <li> inside .sources
  const liMatches = [...html.matchAll(/<li[^>]*>(.*?)<\/li>/g)];
  if (liMatches.length > 0) {
    lines.push("Sources:");
    liMatches.forEach((match) => {
      lines.push(`- ${stripTags(match[1])}`);
    });
  }

  // Fallback: if no lines were added and input has no HTML tags, return as-is
  if (lines.length === 0 && !/<[^>]+>/.test(html)) {
    return html.trim();
  }

  return lines.join("\n");
}
