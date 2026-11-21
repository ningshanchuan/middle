# English spoken-script rules (the `say` field for the TTS voice)

`send` is the text shown on a lesson page; `say` is exactly what an English text-to-speech voice (MOSS-TTS, female voice
"Serena") will read aloud to US and Chinese middle-school students. Goal: it should sound like a good teacher reading the
text aloud. Same words, same order, same meaning; only things a voice cannot read reliably are written out as spoken.

## General
1. Do not add, drop, summarize or reword. Keep every word, in order (except where a rule below says otherwise).
2. Write numbers, symbols, units and notation as words, so the voice cannot misread them. `say` should contain no
   Arabic digits and no symbols such as / + = × ÷ % ° ² ³ ⁺ ⁻ ½ | ∠ _ ~ ^ * (letters in names and abbreviations are fine).
3. Normal punctuation only (, . ; : ? ! " ' — …). Parentheses: drop the brackets, keep the words, set off with commas.
4. When unsure, choose what a US middle-school teacher would say.

## Numbers
- Quantities: 270 → two hundred seventy; 12,700 → twelve thousand seven hundred; 0.9 → zero point nine; 3.50 → three point five zero (or "three fifty" for money: $3.50 → three dollars and fifty cents)
- Years: 1665 → sixteen sixty-five; 1906 → nineteen oh six; 2026 → twenty twenty-six; 1800s → eighteen hundreds; 1960s → nineteen sixties; 500 BCE → five hundred B C E
- Dates and times: 2026-11-18 → November eighteenth, twenty twenty-six; 20:15 → eight fifteen p.m. (or twenty fifteen when a 24-hour reading is clearly meant); 9:00 → nine o'clock
- Ordinals: 3rd → third; 19th century → nineteenth century
- Negative numbers: -34° (angle, altitude) → negative thirty-four degrees; -5 °C → minus five degrees Celsius; latitude -22.5° → twenty-two point five degrees south
- Ranges: 3–5 days → three to five days; 1856–1863 → eighteen fifty-six to eighteen sixty-three; pages 10-12 → ten to twelve
- Fractions: 1/2 → one half; 3/4 → three quarters (or three fourths); 2/3 → two thirds; 5/8 → five eighths; 4½ → four and a half
- Ratios: 3:4 → three to four
- Percent: 60% → sixty percent; +18.2% → plus eighteen point two percent
- Powers: 10⁶ → ten to the sixth; 3.0 × 10⁸ → three point zero times ten to the eighth; x² → x squared; x³ → x cubed
- Large and approximate: ~5,000 → about five thousand; ≈ → approximately equal to
- Phone numbers, codes, IDs: digit by digit

## Units (keep the written order)
- km/h → kilometers per hour; m/s → meters per second; m/s² → meters per second squared; g/cm³ → grams per cubic centimeter; kg/m³ → kilograms per cubic meter
- km kilometers, m meters, cm centimeters, mm millimeters, kg kilograms, g grams, mg milligrams, L liters, mL milliliters, s seconds, min minutes, h hours, N newtons, J joules, kJ kilojoules, W watts, kW kilowatts, kWh kilowatt-hours, Pa pascals, V volts, A amps, Ω ohms, Hz hertz, K kelvins, °C degrees Celsius, °F degrees Fahrenheit, ° degrees, mph miles per hour, ft feet, in inches, lb pounds, oz ounces, mi miles, yd yards
- Singular for exactly one: 1 kg → one kilogram

## Symbols
- Math: + plus, − minus, × times, ÷ divided by, = equals, ≠ does not equal, > is greater than, < is less than, ≥ is greater than or equal to, ≤ is less than or equal to, √ the square root of, |a| the absolute value of a, ∠B angle B, △ABC triangle A B C, ≅ is congruent to, ∼ is similar to, π pi, A′ A prime
- `+` between words (not arithmetic) → "and" or a comma: heart + blood vessels + blood → heart, blood vessels and blood
- `/` by meaning: either/or → "or"; between units → "per"; and/or → "and or"
- `·` as a separator → comma; `—` keep as a pause; `…` keep
- Arrows in reactions: → "yields" (or "produces"); ⇌ "is in equilibrium with"
- Greek letters: α alpha, β beta, γ gamma, Δ delta, θ theta, μ mu, ε epsilon, ρ rho, λ lambda, ω omega; Δv → delta v
- Blanks ____ → "blank"
- Star in a name: Sagittarius A* → Sagittarius A star

## Chemistry and biology
- Chemical formulas letter by letter, digits as words: H2O / H₂O → H two O; CO₂ → C O two; Fe₂O₃ → F e two O three (or "iron three oxide" only if the text names it); O=O → O double-bond O
- Ions: Na⁺ → sodium ion (or N a plus); Cl⁻ → chloride ion; H⁺ → hydrogen ion; OH⁻ → hydroxide ion; Ca²⁺ → calcium ion. If the name is right before it ("sodium ion (Na⁺)"), say the name once.
- Abbreviations read as letters stay as they are: DNA, RNA, ATP, mRNA, tRNA, pH, LDL, UTC, CO2-free → C O two free
- Base pairs A–T → A with T; G–C → G with C (by context)

## Chinese and pinyin inside English
- Keep Chinese characters as they are (the voice can say them). Tone-marked pinyin right after the characters it spells: keep it only if the text is teaching the pronunciation; otherwise drop the duplicate.

## Photo credits
- Photo credits ("Photo: Des_Callaghan · CC BY-SA 4.0 · Source", licence names, URLs) have nothing to do with the lesson: **drop them completely, say nothing of them** (the user, 2026-11-21).

## Do not change
- Plain sentences: copy them exactly.
- Heading + short gloss ("Electron shell. Energy levels where electrons are found.") stays as written.

## Examples
- The Moon's umbra is small: at most a dark spot about 270 km wide. → The Moon's umbra is small: at most a dark spot about two hundred seventy kilometers wide.
- Latitude 34.0°, 2026-11-18 20:15: full night (Sun altitude -34°). → Latitude thirty-four point zero degrees, November eighteenth, twenty twenty-six, eight fifteen p.m.: full night, Sun altitude negative thirty-four degrees.
- Robert Hooke saw exactly this in 1665. → Robert Hooke saw exactly this in sixteen sixty-five.
- Water's density is 1.00 g/cm³ (about 0.998 at room temperature). → Water's density is one point zero zero grams per cubic centimeter, about zero point nine nine eight at room temperature.
- You need 2 O2, not 1: the products have 4 oxygen atoms (2 in CO2, 1 in each H2O). → You need two O two, not one: the products have four oxygen atoms, two in C O two, one in each H two O.
- A car moving at 20 km/h → A car moving at twenty kilometers per hour
- a = F/m = 10 N ÷ 2 kg = 5 m/s² → a equals F over m equals ten newtons divided by two kilograms equals five meters per second squared
- The circulatory system = heart + blood vessels + blood → The circulatory system equals heart, blood vessels and blood
- Lysosome = recycling center / cleanup crew → Lysosome equals recycling center or cleanup crew
- Mendel's pea experiments (1856–1863) → Mendel's pea experiments, eighteen fifty-six to eighteen sixty-three
- |a| is the distance from 0 → The absolute value of a is the distance from zero
- About 365¼ days → About three hundred sixty-five and a quarter days
- UTC−4. This time zone is 4 hours behind UTC → U T C minus four. This time zone is four hours behind U T C
- Population density: about 389 people/km² → Population density: about three hundred eighty-nine people per square kilometer
