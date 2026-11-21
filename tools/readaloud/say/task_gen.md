You write Mandarin spoken scripts for a text-to-speech voice. Work in F:\Shanchuan\Biology_study\.labtmp\tn.

1. Read RULES_zh.md fully (the rules and examples, in Chinese). Follow it exactly.
2. Input: test_in.jsonl, one clip per line: {"key", "lesson", "send"}. `send` is the display text of a lesson page.
3. For EVERY line, write the spoken script `say` YOURSELF, by reading the clip and applying the rules with judgement
   (context decides: a year vs a quantity, "/" as "or" vs "per", a negative angle vs a temperature, a chemical formula vs
   an English word). Do NOT write or run a program, regex or library that transforms the text: the point of this task is
   your reading of each sentence. You may use a small script only to read the input and to write the output file.
4. Output: test_out_gen.jsonl, same order, one line per input line: {"key": "...", "say": "..."} (UTF-8, valid JSON per
   line, every input key exactly once). Keep everything in `send` that is spoken; change only what the rules say.
5. Then print a short summary: how many lines, and any lines where you were unsure (key + why).
Do not edit any other file.
