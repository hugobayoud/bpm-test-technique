# UI conventions

Cross-cutting design rules agreed during interface grilling sessions. Issues cite
these instead of re-deciding them; area-specific choices stay in the issues.

## Buttons

- Primary CTA: full-width pill, `COLORS.fill` background, `COLORS.fillOpposite` bold
  label, height ~56, fully rounded.
- Pressed state for pills and chips: opacity 0.7. No other pressed chrome.
- Out-of-scope CTAs are rendered exactly as designed but inert: `disabled` +
  `accessibilityState={{ disabled: true }}`, no pressed feedback, noted as a README
  liberty (precedents: locked-picture "Ajouter mes photos", "Obtenir Superlike").

## Overlays & modals

- Screens that must cover the tab bar are top-level expo-router routes (outside
  `(tabs)`) with `presentation: 'fullScreenModal'`, slide-from-bottom.
- Dismiss affordance on full-screen modals: a lowercase text chip (`COLORS.panel`
  pill, white label) top-right, overlaying the hero. Android hardware back performs
  the same dismissal; no iOS swipe-to-dismiss.

## Theme

- Dark only. All colors from `src/utils/colors.ts`; Cal Sans for titles only.
