# Atlanta Opera Family Tree

Who's who at The Atlanta Opera (leadership, board, orchestra, chorus and studio artists), shown as a family tree.
Live at https://atlantaoperainfo.web.app

Names, photos and bios come from the People pages on atlantaopera.org.

## Files

- `public/index.html`: the page and the About text
- `public/js/people.js`: everyone's info (`PEOPLE`) and how the tree is laid out (`TREE`). The notes at the top of the file explain the fields.
- `public/js/app.js`: draws the tree, the Everyone list and the profiles
- `public/css/styles.css`: styles
- `public/images/people/`: headshots

To add a photo, put it in `public/images/people/` and set `photo: "images/people/their-name.jpg"`. Anyone without a photo gets their initials.

`/#their-key` opens someone's profile (e.g. `/#tomer-zvulun`), and `/#everyone` opens the full list.

## Running it

Open `public/index.html` in a browser, or run `firebase emulators:start --only hosting`.

Deploy with `firebase deploy --only hosting`.
