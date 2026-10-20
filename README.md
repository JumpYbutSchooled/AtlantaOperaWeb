# Meet the People of The Atlanta Opera

Who's who in The Atlanta Opera's orchestra, shown as a tree or as one list.
Live at https://atlantaoperainfo.web.app

Names, photos and bios come from the People pages on atlantaopera.org.

## Files

- `public/index.html`: the page, the About text, and the PayPal donate band. To switch the donate button on, give the `paypal-button` link an `href` with the PayPal donate link; the "Link coming soon" note then hides itself.
- `public/js/people.js`: everyone's info (`PEOPLE`) and how the tree is laid out (`TREE`). The notes at the top of the file explain the fields.
- `public/js/app.js`: draws the tree, the Everyone list and the profiles
- `public/css/styles.css`: styles
- `public/images/people/`: headshots
- `public/season.html`: every 2026-27 performance with ticket links, from atlantaopera.org. Past dates hide themselves (`public/js/season.js`), and the first show still to come is marked "Next up". Times in `data-at` carry Atlanta's UTC offset (`-05:00` in winter, `-04:00` in summer) so they mean the same moment wherever the visitor is.
- `public/data/season.json`: every upcoming performance on tickets.atlantaopera.org. A GitHub Action (`.github/workflows/season.yml`, running `scripts/update-season.mjs`) refreshes it every morning and puts the site live when it changes. The Season page adds any show or date it doesn't list yet (a new show gets a plain card with its dates and a ticket link; write it up properly when you can), and show pages add new dates. Nothing written by hand is ever removed by it, only by its date passing.
- `public/shows/`: one page per show (story, dates, cast, creative team, content advisory). Cast and crew who are in the tree link to their profiles.
- `public/guides/`: copies of the teacher guides and other PDFs, so nothing links out to atlantaopera.org. The only links back to the company are its ticket store (tickets.atlantaopera.org) and streaming site; everything else is an email address.
- `public/education.html`: school performances, workshops, field trips and free online performances, with booking links and teacher guides.
- `public/get-involved.html`: giving, the gala, volunteering, auditions and jobs. A listing with `data-until="YYYY-MM-DD"` hides itself after that date (`public/js/page.js`).
- `public/images/logo.png`, `logo-white.png`, `icon-*.png`: The Atlanta Opera's logo and icon, from atlantaopera.org. The site uses their font (Montserrat) and red.

To add a photo, put it in `public/images/people/` and set `photo: "images/people/their-name.jpg"`. Anyone without a photo gets their initials.

`/#their-key` opens someone's profile (e.g. `/#peter-ciaschini`), and `/#everyone` opens the full list.

Press `/` (or Ctrl+K) anywhere on the page to search for someone by name, instrument or role.

## Running it

Open `public/index.html` in a browser, or run `firebase emulators:start --only hosting`.

Deploy with `firebase deploy --only hosting`.

The daily season update deploys using a GitHub secret, `FIREBASE_SERVICE_ACCOUNT_ATLANTAOPERAINFO`. `firebase init hosting:github` creates it. To run the update straight away, open the repo's Actions tab, pick "Update season" and press "Run workflow".
