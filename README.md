# Atlanta Opera Info Site

A static site listing everyone in the company, hosted on Firebase Hosting. Everything served is in `public/`.

## Editing people

All people live in `public/js/people.js`, one entry each. The comment at the top of that file explains the fields.

- **Photos:** put images in `public/images/people/` and set `photo: "images/people/their-name.jpg"`. Portrait-shaped (4:5) images look best. If `photo` is empty or the file is missing, a placeholder silhouette is shown.
- **Sections:** the `GROUPS` list at the top of `people.js` sets the section names and order.
- **Linking to a person:** `https://your-site.web.app/#their-id` opens their bio directly.

Page text (intro, About, footer) is in `public/index.html`; search for "Placeholder".

## Preview locally

Open `public/index.html` in a browser, or run:

```
firebase emulators:start --only hosting
```

## Deploy

First time only:

```
firebase login
firebase use --add      # pick your Firebase project
```

Then whenever you want to publish:

```
firebase deploy --only hosting
```
