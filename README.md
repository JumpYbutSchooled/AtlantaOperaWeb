# Meet the People of The Atlanta Opera

Who's who at The Atlanta Opera (leadership, board, orchestra, chorus and studio artists), shown as a tree or as one list.
Live at https://atlantaoperainfo.web.app

Names, photos and bios come from the People pages on atlantaopera.org.

## Files

- `public/index.html`: the page and the About text
- `public/js/people.js`: everyone's info (`PEOPLE`) and how the tree is laid out (`TREE`). The notes at the top of the file explain the fields.
- `public/js/app.js`: draws the tree, the Everyone list and the profiles
- `public/css/styles.css`: styles
- `public/images/people/`: headshots
- `public/season.html`: every 2026-27 performance with ticket links, from atlantaopera.org. Past dates hide themselves (`public/js/season.js`), and the first show still to come is marked "Next up".
- `public/education.html`, `public/get-involved.html`: placeholder pages, ready to fill in. Replace each "Coming soon" box with the real text.
- `public/images/logo.png`, `logo-white.png`, `icon-*.png`: The Atlanta Opera's logo and icon, from atlantaopera.org. The site uses their font (Montserrat) and red.

To add a photo, put it in `public/images/people/` and set `photo: "images/people/their-name.jpg"`. Anyone without a photo gets their initials.

`/#their-key` opens someone's profile (e.g. `/#tomer-zvulun`), and `/#everyone` opens the full list.

Press `/` (or Ctrl+K) anywhere on the page to search for someone by name, instrument or role.

## Running it

Open `public/index.html` in a browser, or run `firebase emulators:start --only hosting`.

Deploy with `firebase deploy --only hosting`.
