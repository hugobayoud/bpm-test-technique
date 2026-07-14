# bpm feed

### Context

> bpm is a dating app for athletes.
> 

Users create a profile with:

- **photos** (multiple, reorderable)
- **prompts** (multiple, also reorderable)
- **sports**
- **stats** (height, city, sports practiced, frequency)

The feed is made up of cards.

Each card belongs to a user and displays a single piece of content (photo, prompt, sport, or stat).

A profile therefore has multiple cards.

You can **like** a card.

If two users like each other, it's a **match**.

!image.png

---

## Case

Using the JSON data provided below, you must **recreate the bpm feed**.

feed-response-example.json

#### **What I expect**

- Code the exact bpm feed (the same UI) on a blank Expo application
- Add the **pass** and **like** animations

<aside>
💡

Feel free to take a few liberties if you think it's relevant, just point them out when you send the code 🙂

</aside>

---

### Useful resources

*→ Colors*

- surface: #0D0D0D
- fill: #FFFFFF
- fill opposite: #0D0D0D
- stroke default: #FFFFFF (5%)
- stroke strong: #FFFFFF (10%)
- primary: #E1FF00
- boost: #48C1F3
- superlike: #FF5252

*→ Font*

- titles: Cal Sans
- rest: System (SF Pro / Roboto)

*→ Icons*

You can use lucide.dev
