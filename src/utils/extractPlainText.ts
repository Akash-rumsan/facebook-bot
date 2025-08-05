export function extractPlainText(markdown: string): string {
  if (!markdown) return "";

  let cleanText = markdown
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold and italic markdown
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    // Normalize bullet points (but keep hyphens in words)
    .replace(/^[-•·▪▫‣⁃]\s*/gm, "")
    // Add line break after known section titles
    .replace(
      /(Introduction to MEF|Membership Categories|FAQs)(?=\s)/gi,
      "$1\n\n"
    )
    // Add newlines before "Sources:"
    .replace(/(\.)(\s*)(Sources:)/gi, "$1\n\n$3")
    // Optional: Add breaks before key guidance
    .replace(/(If you need more information.*?)(?=\s[A-Z])/gi, "\n\n$1")
    // Remove line breaks elsewhere (except the ones we inserted)
    .replace(/\r?\n|\r/g, " ")
    // Replace multiple spaces with a single space
    .replace(/\s{2,}/g, " ")
    // Remove unwanted characters but KEEP commas, hyphens, and punctuation
    .replace(/[^\w\s.,!?():-]/g, "")
    // Replace non-breaking spaces
    .replace(/\u00A0/g, " ")
    .trim();

  // Truncate if needed (WhatsApp limit)
  if (cleanText.length > 1000) {
    cleanText = cleanText.slice(0, 1000) + "...";
  }

  return cleanText;
}
