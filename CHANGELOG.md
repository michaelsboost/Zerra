# Changelog

## 1.2.0

### Added
- Expanded Zerra to 822 searchable situations and 3,207 practical recommendations across household, reuse, food, repair, home/garden, self-reliance, transportation, work, school, travel, and lifestyle topics.
- Added project-wide integrity, safety-language, recommendation-quality, functional regression, UI/accessibility, PWA/offline, and package-cleanliness audits.
- Added a native filled-leaf ripple startup loader with dark-mode and reduced-motion support.
- Added a milestone-based startup percentage that reaches 100% only after application initialization completes.

### Improved
- Search now handles multiword queries and recommendation metadata more consistently.
- Default recommendation order now respects authored per-item priority, with stronger No Purchase / Use Existing behavior.
- Category and recommendation relationships are normalized and validated at initialization.
- Saved-state restoration and localStorage persistence are more resilient to stale, malformed, duplicated, or oversized state.
- Service-worker behavior favors fresh application code while retaining offline navigation and static-media caching.
- Mobile touch targets, keyboard focus behavior, safe-area handling, and loader accessibility were hardened.

### Fixed
- Fixed initialization scope errors discovered during the v1.2 release audit.
- Fixed legacy category references that made 49 situations unreachable through their intended navigation taxonomy.
- Fixed valid zero-valued ranking metadata being treated as missing.
- Fixed a recommendation hierarchy inversion in dish-brush guidance.
- Fixed stale loader implementations and malformed historical production CSS.
- Fixed a startup condition that could leave the preload shell visible after initialization errors.

### Removed
- Removed obsolete production artifacts including the old promo image, development test page, stale generated single-file page, and superseded loader CSS.
- Dropped the planned Lottie loader integration in favor of Zerra's dependency-free native animation.

