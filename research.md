# Common Ground — implementation & research notes

## Status
A functional small-scale 3D, persistent, multi-user prototype, not a validated social experiment or proof of any political system. Authentication uses Websim accounts; the project never collects passwords. A citizen's soul.md is a private database text record, exportable as an actual Markdown file. Only the interpreted traits and public simulation state are shared.

## Research actually consulted
Glenn Fiedler, “Fix Your Timestep!” (2004): https://gafferongames.com/post/fix_your_timestep/
Read during development. The article explains bounded integration, the spiral of death, deterministic fixed steps, and interpolation. Those distinctions inform separation of the authoritative server tick from client rendering, bounded live dt, and explicit limitations of coarse offline replay. This prototype does not claim exact deterministic replay: live steps vary, and offline steps are deliberately coarse.

Attempts to retrieve NIST AI RMF and Three.js manual pages were blocked or unavailable during development. They are not represented as sources that were read. Future research should consult NIST AI RMF, Ostrom's commons-governance work, restorative-justice evidence, and literature on due process and algorithmic discrimination.

## Rendering and physics choices
Three.js 0.180, physically based rough materials, ACES tone mapping, hemisphere daylight and a shadow-casting sun. Geometry includes rooftop food beds, solar panels, glazing, rainwater storage landscape, pavilions and open pedestrian paths. Trees are instanced. No heavy postprocessing or raster textures. These are stylized assets, not photorealistic scanned geometry.

Movement is a kinematic pedestrian model at 1.25 world metres / second, with body separation at 0.7m, ground-constrained paths through a central hub, and interpolated client positions. There is no rigid-body engine, full collision mesh, weather, true water simulation, or biomechanical gait. Destination coordinates avoid building interiors. Dense crowds can cause small separation offsets; formal navmesh routing and obstacle collision are required before calling this physically realistic.

Low-GPU mode (?gpu=false or websim.lowGpu) disables shadows/antialiasing and renders about once per second while the independent simulation continues. Normal hardware renders continuously.

## Agent model and AI
A server-side LLM reads soul.md on save and maps it into five bounded numeric traits: personal space, noise tolerance, social drive, creativity and cooperation. The inference result is persisted; no LLM call is made per tick, per visitor or per polling request. If inference fails, the UI reports default traits. Updates are limited to once a minute per account.

Routine action selection is a transparent utility-like state machine based on hunger, energy, stress and preferences. It does not reproduce human psychology. Hunger and energy consumption, finite production rates and conflict probabilities are uncalibrated assumptions. Offline actions do not imply ongoing LLM deliberation.

## Governance rules
Preference mismatch within a personal boundary triggers path separation, unless low cooperation and elevated modeled stress generate a breach. A breach restricts creation-space access for 65 seconds. Food, housing, gardens and sanctuary remain accessible. A timed review restores access; an appeal lifts it immediately through human override; no independent human review panel is implemented. This intentionally does not claim to diagnose a person, measure real empathy, prove safety, or authorize neurological treatment.

There is no elected council or independent adjudicator implemented. Public code is inspectable, but neutrality does not follow from transparency. Human governance, independent audits, accessible explanations, plural oversight, exit rights and meaningful appeals would be prerequisites outside a sandbox. A sanctuary is not modeled as a forced destination with locked exits. Routing someone into a closed space can constitute confinement regardless of its name.

## Persistence and realtime architecture
server.js is the authority. Websim trusted identity headers bind private profiles to their owners; attributed rows include user_id for moderation. The room simulates at 5 Hz, checkpoints about every 15 seconds and on disconnect, and accepts only valid owner goals and appeals. Profiles refresh into the room every 15 seconds. Simulated visitors are labeled model residents.

When no connection remains, the runtime stops ticking. On load, elapsed time is replayed approximately, at most 6 hours and 360 coarse steps. Longer absences are truncated. The HTTP observer endpoint reads checkpoints and computes approximate current state; when the checkpoint is over 30 seconds old it conditionally saves replay, without overwriting a newer room checkpoint. Signed-out checks cannot join a private draft room; the UI falls back to HTTP observer mode with local interpolation and 15-second resynchronization. A real deployment needing 24/7 offline simulation requires an external scheduled worker or durable scheduling not provided here.

The first district loads at most 80 account profiles ordered by user ID, plus 16 model residents. This is not an unlimited population service. Soul text is not included in shared world payloads. Interpreted traits, usernames, actions, basic need levels and restriction state are public. No private medical or sensitive personal data should be entered.

## What must happen before drawing political conclusions
1. Specify falsifiable hypotheses and counterfactual governance models.
2. Calibrate behaviors and resource demand against independently gathered data, with consent.
3. Run shortages, infrastructure failures, adversarial agents, false positives, bias and collusion trials.
4. Measure distributional effects, time under restriction, appeal reversals, unmet needs and autonomy—not just agreement counts.
5. Validate externally, including people who disagree with the system; publish uncertainty and failures.
6. Preserve human legal protections. No statistical score can certify someone's sanity or guarantee that they pose no threat.
