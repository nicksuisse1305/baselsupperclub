# Food photos

Drop image files in this folder, commit and push. They appear in the Gallery
automatically, and a dish on a menu can point at one by filename.

- Accepted: `.jpg` `.jpeg` `.png` `.webp`
- The filename becomes the caption: `smoked-duck-leg.jpg` → "Smoked duck leg"
- Files show in filename order, so prefix with `01-`, `02-` to control it
- Roughly 1500px on the long edge, under 400 KB each

**Upload JPEG or PNG.** iPhone HEIC files — even ones named `.jpg` — cannot
always be decoded by the build. Settings > Camera > Formats > Most Compatible
fixes it at the source.

## Photos the menus are waiting for

Name the file exactly this and it lands on the menu by itself:

| Filename | Where it appears |
| --- | --- |
| `welcome drink.png` | both menus, under "To drink" |
| `wine.png` | both menus, under "To drink" |

Already matched and in place: `paneer pakora`, `mint sauce`,
`chicken tikka masala`, `paneer lababdar`, `jeera rice`, `naan bread`,
`gyoza`, `tantanmen`.
