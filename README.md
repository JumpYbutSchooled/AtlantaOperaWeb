# Atlanta Opera Info Site

A static site showing everyone in The Atlanta Opera as a family tree, hosted on Firebase Hosting. Everything served is in `public/`. The people and text come from atlantaopera.org (the Leadership, Orchestra, Chorus, Studio Artists and Company pages).

## Editing people

Everything lives in `public/js/people.js`. The comment at the top of that file explains the fields.

- **`PEOPLE`** has one entry per person: name, role, photo, website link, extra details, and bio.
- **`TREE`** arranges them. Each branch has a `label`, optional `note` and `photo` (shown under the branch's "About" button), and `children`: more branches, person ids, or `{ id, role }` when a card should show a different role in that spot.
- **Photos:** put images in `public/images/people/` and set `photo: "images/people/their-name.jpg"`. If `photo` is empty or the file is missing, their initials are shown.
- **Linking to a person:** `https://atlantaoperainfo.web.app/#their-id` opens their profile and shows them in the tree.

The page text (intro, About, footer) is in `public/index.html`.

## Preview locally

Open `public/index.html` in a browser, or run:

```
firebase emulators:start --only hosting
```

## Deploy

```
firebase deploy --only hosting
```
