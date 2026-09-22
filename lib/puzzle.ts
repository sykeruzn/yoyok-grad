// Helpers for building and normalizing the little unlock puzzles.
// puzzle_data only ever stores what's needed to RENDER the puzzle — never the
// answer. The answer lives solely as a bcrypt hash in password_hash.

const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
};

export function toBinary(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

export function toHex(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => ch.charCodeAt(0).toString(16).toUpperCase())
    .join(" ");
}

export function toAscii(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => ch.charCodeAt(0).toString())
    .join(" ");
}

export function toMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => (ch === " " ? "/" : MORSE[ch] ?? ""))
    .filter(Boolean)
    .join(" ");
}

export function caesarEncode(text: string, shift: number): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      if (ch < "A" || ch > "Z") return ch;
      const code = ((ch.charCodeAt(0) - 65 + shift) % 26 + 26) % 26;
      return String.fromCharCode(code + 65);
    })
    .join("");
}

// Vigenère encrypt: each letter is shifted by the corresponding letter of the
// repeating keyword. Non-letters pass through untouched and don't consume a
// keyword position, so short names (even 2-3 letters) still work fine.
export function vigenereEncode(text: string, keyword: string): string {
  const key = keyword.toUpperCase().replace(/[^A-Z]/g, "") || "GRAD";
  let k = 0;
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      if (ch < "A" || ch > "Z") return ch;
      const shift = key.charCodeAt(k % key.length) - 65;
      k += 1;
      const code = ((ch.charCodeAt(0) - 65 + shift) % 26 + 26) % 26;
      return String.fromCharCode(code + 65);
    })
    .join("");
}

// The layered puzzle: name -> Vigenère (keyword) -> binary -> Morse.
// A solver works it backwards: read the Morse, get 0s/1s, get letters, then
// shift each letter back by the keyword to land on the plaintext name.
export function buildLayeredPuzzle(answer: string, keyword = "grad"): string {
  const ciphertext = vigenereEncode(answer, keyword);
  const binary = toBinary(ciphertext);
  return binary
    .split("")
    .map((ch) => (ch === " " ? "/" : MORSE[ch] ?? ""))
    .filter(Boolean)
    .join(" ");
}

export const DEFAULT_LAYERED_CLUE =
  "Some words hide first as dashes and dots, dits and dats, sticks and stones in the hay.\n" +
  "Read what they spell out in zeroes and ones, like the lessons we learned back in the day.\n" +
  "Then shift each letter back, as Giovan Battista Bellaso once did, by the 4-letter word that happens today.";


// Normalize an answer the same way at hash-time and verify-time so
// capitalization/whitespace never cause a false "incorrect".
export function normalizeAnswer(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

export type PuzzleType = "layered" | "binary" | "caesar" | "hex" | "morse" | "ascii" | "riddle";

export type PuzzleData = {
  encoded?: string;
  shift?: number;
  keyword?: string;
};

// Given a plain answer, build the puzzle_data for a given type. Used by the
// seed script (and the admin form) so you never have to hand-encode ciphers
// yourself.
export function buildPuzzleData(
  type: PuzzleType,
  answer: string,
  shift = 3,
  keyword = "grad"
): PuzzleData {
  switch (type) {
    case "layered":
      return { encoded: buildLayeredPuzzle(answer, keyword), keyword };
    case "binary":
      return { encoded: toBinary(answer) };
    case "hex":
      return { encoded: toHex(answer) };
    case "ascii":
      return { encoded: toAscii(answer) };
    case "morse":
      return { encoded: toMorse(answer) };
    case "caesar":
      return { encoded: caesarEncode(answer, shift), shift };
    case "riddle":
      return {};
  }
}
