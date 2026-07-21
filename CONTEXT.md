# bpm Feed

bpm is a dating app for athletes. This context covers the feed — browsing other users' profiles one at a time and reacting to them — and the coach: completing your own matching Filtres.

## Language

**Profile**:
One user as shown in the feed — a firstname plus an ordered list of Cards. The feed presents exactly one Profile at a time.
_Avoid_: user, account, match candidate

**Card**:
A single piece of a Profile's content, displayed as one block in the vertical scroll. Five kinds exist: picture, prompt answer, sport card, info card, locked picture.
_Avoid_: post, item, tile

**Likable Card**:
A Card the viewer can react to: an unlocked picture, a prompt answer, or a sport card. Info cards are never likable (pure information), and nobody can like what they cannot see — locked pictures are not likable.

**Photo Allowance**:
A viewer sees at most as many pictures per Profile as they have uploaded themselves; pictures beyond that allowance appear locked. Applies to pictures only, never to other Card kinds.

**Locked Picture**:
A picture the viewer is not allowed to see — rendered as a blurred teaser. Either sent locked by the server or demoted client-side by the Photo Allowance. Not likable.

**Feed**:
The ordered sequence of Profiles the user browses. Not an endless scroll — the next Profile appears only after a Like or a Pass on the current one.
_Avoid_: deck, stack, timeline

**Like**:
A reaction targeting one specific Likable Card. Sending a Like ends the current Profile and advances the Feed to the next one.
_Avoid_: swipe right, favorite

**Pass**:
Skipping the current Profile as a whole, via the sticky cross button. Advances the Feed to the next Profile. A Pass targets a Profile, never a single Card.
_Avoid_: skip, reject, swipe left

**Match**:
Two users having Liked each other. Out of the feed's rendering concern beyond vocabulary — no backend exists in this exercise.

**Filtre**:
One of the four matching preferences the user sets about who they want to meet: age range, max distance, sought training frequency, sought relationship type. A Filtre still at its default value counts as unanswered — deliberately indistinguishable from having chosen the default. Training frequency and relationship type exist in both directions: as profile attributes (what I am) and as Filtres (what I seek) — same vocabulary, opposite direction, always say which.
_Avoid_: preference, setting, critère

**Coach**:
The guided in-app assistant that gets the user to answer their unanswered Filtres, one Coach Question at a time. Never free chat: the user answers through the app's own controls, never by typing.
_Avoid_: chatbot, assistant

**Coach Question**:
One step of the Coach — an unanswered Filtre picked by the LLM, plus the personalized question text it wrote. The possible values and the control always come from the app's catalogue, never from the LLM.
_Avoid_: prompt (already means the feed's prompt cards)
