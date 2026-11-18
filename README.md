# 🔬 Science Lab — Interactive 3D Middle-School Science (EN · 中文)

Open **`index.html`** in a modern browser (Chrome / Edge / Safari / Firefox) with an internet connection.
The 3D engine (three.js), fonts and map data load from public CDNs; everything else is local.

| Subject | Folder | Topics | Georgia standard |
|---|---|---|---|
| 🧬 Biology 生物 | `biology/` | 17 | Grade 7 Life Science S7L1–S7L5 |
| 🌋 Earth Science 地球科学 | `earth/` | 12 | Grade 6 Earth Science S6E3–S6E6 |
| 🪐 Astronomy 天文 | `astronomy/` | 22 (12 deep dives) | Grade 6 Earth Science S6E1–S6E2 |
| ⚡ Physics 物理 | `physics/` | 11 | Grade 8 Physical Science S8P2–S8P5 |
| ⚗️ Chemistry 化学 | `chemistry/` | 9 | Grade 8 Physical Science S8P1 |
| 🗺️ Geography 地理 | `geography/` | 10 | Social Studies SS6G / SS7G |
| 📐 Math 数学 | `math/` | 26 | Georgia K-12 Mathematics Standards 2021 (grades 6–8) — animated, intuition-first lessons |
| 🏯 China: History & Geography 中国历史与地理 | `china/` | 36 (14 deep dives) | Mainland China: 义务教育历史/地理课程标准(2022年版), 统编版初中《中国历史》, 初中地理八年级 |
| 🏛️ Civics 道德与法治 | `politics/` | 8 | Mainland China: 义务教育道德与法治课程标准(2022年版), 统编版初中《道德与法治》 |

Every 3D scene and simulation has a ⤢ full-screen button. Each science app has: a clickable 3D model with guided “story” mode, an info panel with memory hints and common mix-ups,
read-aloud, at least one extra simulation, a quiz, a sorting game, and teacher notes. Language (EN/中文) and
dark mode are remembered across apps; add `?lang=zh` to any URL to open it in Chinese.

- Full topic list and build specs: [`TOPICS.md`](TOPICS.md)
- Framework for adding new topics: [`shared/README.md`](shared/README.md) (reference app: `biology/dna.html`)
- To add a topic: add it to `shared/catalog.js`, create `<subject>/<id>.html` from the skeleton — the hub, nav and prev/next links update automatically.
