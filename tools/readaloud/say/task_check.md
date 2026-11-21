You are the reviewer of Mandarin spoken scripts for a text-to-speech voice. Work in F:\Shanchuan\Biology_study\.labtmp\tn.

1. Read RULES_zh.md fully (rules and examples, in Chinese).
2. Inputs: test_in.jsonl ({"key","lesson","send"}: the display text) and test_out_gen.jsonl ({"key","say"}: a spoken
   script another writer made from it).
3. Check EVERY pair yourself, by reading both texts (no program or regex for the judgement; a script only to read and
   write files). Look for:
   - meaning changed, words added, words dropped, order changed (other than what the rules allow);
   - wrong readings: year vs number, 两 vs 二, "/" as 或 vs 每, unit names, negative angle vs temperature (零下), latitude
     sign (南纬/北纬), dates and times, ranges, decimals, percentages, fractions, powers, chemical formulas and ions,
     Greek letters, geometry symbols, abbreviations;
   - anything left that a voice cannot read correctly: Arabic digits, symbols (/ + = × ÷ % ° ℃ ² ³ ⁺ ⁻ ½ | ∠ _ ·-as-separator),
     tone-marked pinyin after a character, licence codes;
   - unnatural or ambiguous Chinese that a good teacher would not say.
4. Output test_out_check.jsonl, same order, one line per input: {"key": "...", "say": "<final script>", "changed": true|false,
   "why": "<short reason in Chinese if changed, else empty>"}. When the script is right, copy it unchanged.
5. Print a short summary: how many lines checked, how many changed, the main kinds of errors you fixed, and any line you
   are still unsure about (key + why).
Do not edit any other file.
