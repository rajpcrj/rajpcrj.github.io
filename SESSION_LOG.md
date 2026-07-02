# Session Log — Portfolio Website Work (`rajpcrj.github.io`)

**Working directory:** `/home/raj/git website/rajpcrj.github.io/` — a static portfolio site hosted on GitHub Pages.

---

## 1. Context read & understood

- Read all repo markdown (`README.md`, `CHANGELOG.md`) and the git-ignored private plan `Details_Of_project_implementation`.
- Read all 14 files in `claude_findings/` (deep technical write-ups) and all 9 files in `/media/raj/New_Volume_F/claude_finding/` (coursework project location docs).
- Confirmed **`project_index_list.json` already existed and works as intended**: each project has a manual `order` number (lower = shown first); projects sharing a number tie-break **alphabetically by title**; `script.js` reorders and renumbers the cards to match. No change was needed to that mechanism.

## 2. Permissions fix

- The project `.claude/settings.json` had a blanket `Edit(//**)` / `Write(//**)` deny that overrode the project-scoped allow. User removed those two deny lines so writes into `git website` work without prompts. `Read(//**)` and `Bash` were already allowed.

---

## 3. Go2 RL Locomotion — page rewritten from actual source code

The README was starter-code docs (student never filled in the report), so the authoritative source was the real implementation. Read `rob6323_go2_env.py`, `rob6323_go2_env_cfg.py`, and `agents/rsl_rl_ppo_cfg.py` from
`/media/raj/New_Volume_F/SEM3/RL/project2/code/rob6323_go2_project/`.

**Videos copied** from `good_logs/` (7 files were duplicates of 4 unique runs) into `projects/go2/`:
- `run_133345_baseline.mp4` — before torque/friction randomization
- `run_133736_randomized.mp4` — after randomization
- `run_134475_refined.mp4` — later refined run
- `run_134657_unstable.mp4` — *(later deleted at user request)*

**Page rewrite** (`projects/go2/index.html`) grounded in the real code, with corrections vs. the old page:
- Removed the inaccurate domain-randomization claim (masses/friction/pushes) — the env code implements none of that; reframed honestly as the torque/friction experiments the run names actually show.
- Added real values: torque-level PD controller (Kp=20, Kd=0.5, ±100 N·m clip), 200 Hz sim / 4096 envs, full 10-term reward-scale table, gait clock + Raibert heuristic, 52-D obs / 12-D action, 3 termination criteria, real PPO config (MLP [256,128,64], lr 3e-4, 500 iters).
- Removed the fabricated "~59k lines" stat.
- Built a results gallery of the rollout videos.

**Homepage:** Go2 card thumbnail switched from placeholder `demo.mp4` to `run_133736_randomized.mp4`.

**Follow-up:** user asked to remove run 134657 completely — deleted the file, its `<figure>` block, and its mention in the text.

---

## 4. Space Robotics — new project page built + demo video added

**Source:** `/media/raj/New_Volume_F/SEM3/space_robotics/project_2/`
Confirmed there were **no video files** in the source folder initially, but 6 real figures the student generated.

**Figures copied** into `projects/space_robotics/graphs/`:
- `routing_isaac_sim.png` (hero render), `earth_unsegmented.png`, `earth_segmented.png` (land mask → 50 Voronoi rectenna regions), `heatmap_selected_points.png`, `theta_histogram.png`, `raan_histogram.png`.
- Excluded `keplerian_parameters_explained.jpg` — a generic textbook diagram, not the student's own work.

**New page** (`projects/space_robotics/index.html`) modeled on the existing `shm_fanout` article (TOC, stat cards, `figure.fig`, `table.cmp`, callouts). Covers: the design question → end-to-end pipeline → dual-formulation 12-DOF spacecraft dynamics (MuJoCo-validated) → CV rectenna placement (K-Means + Voronoi) → GPU visibility (PyTorch/CUDA, 1183×50×T tensor) → MILP constellation selection (PuLP/CBC) → routing + Isaac Sim frontend → tech stack.

**Wired into homepage** (`index.html`), `project_index_list.json`, and `script.js` fallback at **order 2** (ties with Go2, sorts alphabetically).

### Demo video (added later)

- Located the reference video: `/home/raj/Videos/Screencasts/spae_robotics_video_1.webm` (created 2025-12-08, the same day as the project presentations in `update_1/`).
- Verified content via extracted frames: live Isaac Sim constellation demo — red satellite cuboids in orbital rings, blue rectennas on the Earth sphere, green power beams streaming down.
- **Converted webm → mp4** with ffmpeg (H.264, `+faststart`, 1236×822, 63s) → `projects/space_robotics/demo.mp4` (27 MB) for broad browser/iOS compatibility.
- Embedded as the **hero video** on the project page (poster = routing render) with a caption; the 6 figures remain below.
- Homepage card thumbnail switched to play the video (poster = segmented Earth).

---

## 5. Presentation / screencast date cross-check

- Space robotics presentations in `.../project_2/update_1/` were all authored **2025-12-08** (`Presentation.pptx`, `Routing.pptx`, `RAJ_Priyadarshi_Space_Robotics.pdf`, `Space_Robotics.pdf`).
- In `/home/raj/Videos/Screencasts`, 7 videos were created that same day; the standout was `spae_robotics_video_1.webm` (04:01 AM), explicitly named for the project — used as the demo above.

---

## 6. Backup / consolidation

- Copied the entire `/home/raj/git website` directory to `/media/raj/New_Volume_G/consolidations/git website` with `cp -a` (preserves timestamps/permissions).
- Verified: 176 files in both, recursive `diff -rq` reported **IDENTICAL**.

---

## Reference / discussion (no code changed)

- Explained how a static-site contact form works (Formspree/Web3Forms POST → email; GitHub Pages can't run server code). GitHub has no built-in form-to-email service. Costs: GitHub Pages + free form-service tiers = $0 (custom domain is the only optional paid piece).
- Explained visitor analytics: GitHub gives no site-visitor stats (the Insights → Traffic tab is repo views, not live-site visits); options are GoatCounter/Cloudflare/Plausible/GA. User chose to skip for now.

---

## Files changed / created this session

| Path | Change |
|---|---|
| `.claude/settings.json` | removed blanket Edit/Write deny (by user) |
| `rajpcrj.github.io/index.html` | added space_robotics card; Go2 + space_robotics card thumbnails → video |
| `rajpcrj.github.io/project_index_list.json` | added space_robotics (order 2) |
| `rajpcrj.github.io/script.js` | added space_robotics to PROJECT_ORDER fallback |
| `rajpcrj.github.io/projects/go2/index.html` | full rewrite from source code |
| `rajpcrj.github.io/projects/go2/*.mp4` | 3 rollout videos copied (1 later deleted) |
| `rajpcrj.github.io/projects/space_robotics/index.html` | new page + hero video |
| `rajpcrj.github.io/projects/space_robotics/graphs/*.png` | 6 figures copied |
| `rajpcrj.github.io/projects/space_robotics/demo.mp4` | converted from webm |

## Open / optional items

- `projects/go2/demo.mp4` (old placeholder) is unused but left in place.
- `projects/space_robotics/demo.mp4` is 27 MB — could make a lighter trimmed loop for the homepage card if page-load weight matters.
- Space robotics card has no "Code" link (no public repo); only "📖 Project Explanation".
