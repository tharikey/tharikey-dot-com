---
title: ThariKey documentation
description: Technical docs for the engine, the macOS IME, and the font manifest.
---

For people building on, contributing to, or integrating ThariKey. Split by component:

- **[Engine](/docs/engine/)** — the lexicon-free Rust core: scheme format, architecture, the C / wasm / Python bindings, and the engine changelog.
- **[macOS](/docs/macos/)** — the InputMethodKit app and IME: the C ABI bridge, the two input models, IMK registration, and the install lifecycle.
- **[Fonts](/docs/fonts/)** — the font manifest contract and how foundries author entries.

If you just want to *use* ThariKey, you want the [Guides](/guides/) and the [Download](/download/) page instead.

:::note
These sections are pulled from each component repo's `docs/` at build time, so they track the
source of truth rather than drifting in a separate copy.
:::
