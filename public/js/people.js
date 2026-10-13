// ─────────────────────────────────────────────────────────────────────────────
// Everyone shown on the site. To add a person, copy an entry and edit it.
//
//   id     unique, lowercase, dashes instead of spaces (used in links: /#jane-doe)
//   name   full name
//   role   title, voice type, or instrument
//   group  one of the GROUPS below (controls which section they appear in)
//   photo  path to their picture, e.g. "images/people/jane-doe.jpg",
//          or "" to show the placeholder silhouette
//   bio    their bio — leave a blank line between paragraphs
// ─────────────────────────────────────────────────────────────────────────────

// Sections, in the order they appear on the page.
window.GROUPS = [
  "Leadership",
  "Artistic Staff",
  "Principal Artists",
  "Studio Artists",
  "Orchestra",
  "Chorus",
  "Production",
  "Board of Directors",
];

// Optional photo and note shown at the top of a section (hidden while searching).
window.GROUP_INTROS = {
  Orchestra: {
    photo: "images/orchestra.jpg",
    note: "Musicians employed are represented by the American Federation of Musicians of the United States and Canada.",
  },
};

window.PEOPLE = [
  // Leadership
  { id: "leadership-1", name: "Full Name", role: "General & Artistic Director", group: "Leadership", photo: "", bio: `` },
  { id: "leadership-2", name: "Full Name", role: "Music Director", group: "Leadership", photo: "", bio: `` },
  { id: "leadership-3", name: "Full Name", role: "Managing Director", group: "Leadership", photo: "", bio: `` },
  { id: "leadership-4", name: "Full Name", role: "Director of Development", group: "Leadership", photo: "", bio: `` },

  // Artistic Staff
  { id: "artistic-1", name: "Full Name", role: "Chorus Master", group: "Artistic Staff", photo: "", bio: `` },
  { id: "artistic-2", name: "Full Name", role: "Head of Music", group: "Artistic Staff", photo: "", bio: `` },
  { id: "artistic-3", name: "Full Name", role: "Resident Stage Director", group: "Artistic Staff", photo: "", bio: `` },
  { id: "artistic-4", name: "Full Name", role: "Artistic Administrator", group: "Artistic Staff", photo: "", bio: `` },

  // Principal Artists
  { id: "principal-1", name: "Full Name", role: "Soprano", group: "Principal Artists", photo: "", bio: `` },
  { id: "principal-2", name: "Full Name", role: "Mezzo-soprano", group: "Principal Artists", photo: "", bio: `` },
  { id: "principal-3", name: "Full Name", role: "Tenor", group: "Principal Artists", photo: "", bio: `` },
  { id: "principal-4", name: "Full Name", role: "Baritone", group: "Principal Artists", photo: "", bio: `` },
  { id: "principal-5", name: "Full Name", role: "Bass", group: "Principal Artists", photo: "", bio: `` },

  // Studio Artists
  { id: "studio-1", name: "Full Name", role: "Soprano", group: "Studio Artists", photo: "", bio: `` },
  { id: "studio-2", name: "Full Name", role: "Mezzo-soprano", group: "Studio Artists", photo: "", bio: `` },
  { id: "studio-3", name: "Full Name", role: "Tenor", group: "Studio Artists", photo: "", bio: `` },
  { id: "studio-4", name: "Full Name", role: "Baritone", group: "Studio Artists", photo: "", bio: `` },

  // Orchestra — from atlantaopera.org/about/orchestra
  { id: "ivan-lopez-reynoso", name: "Iván López Reynoso", role: "Carl & Sally Gable Principal Conductor", group: "Orchestra", photo: "images/people/ivan-lopez-reynoso.jpg", bio: `Recognized for his remarkable musicianship and poised leadership, Iván López Reynoso has established himself as one of today’s most accomplished conductors. His artistry has been acclaimed in performances across Mexico, Spain, Austria, Germany, Switzerland, Peru, Oman, Japan, the United States, and Italy, leading many of the world’s foremost orchestras and opera ensembles. The Santa Fe New Mexican called his conducting “… terrific” and proclaimed, “The orchestra sounded as good as I’ve ever heard it, with an especially plush tone from the strings and crisp work by the winds and brass.”

Reynoso has collaborated with celebrated artists including Bryn Terfel, Ildar Abdrazakov, Javier Camarena, Alessandro Corbelli, Brigitte Fassbaender, Ramón Vargas, Rolando Villazón, Olga Peretyatko, Irina Lungu, John Osborn, Franz Hawlata, Paolo Bordogna, Ute Lemper, Augustin Hadelich, Michael Barenboim, Yulianna Avdeeva, Gabriela Montero, Jorge Federico Osorio, and Alex Klein.

López Reynoso has appeared with orchestras such as the Philharmonia Zürich, Milwaukee Symphony Orchestra, Santa Fe Opera Orchestra, National Orchestra and Chorus of Spain, Bilbao Symphony Orchestra, Orquesta Ciudad de Granada, Oviedo Filarmonía, Navarra Symphony Orchestra, Real Orquesta Sinfónica de Sevilla, Madrid Symphony Orchestra, Staatsorchester Braunschweig, and the National Symphony Orchestra of Mexico. His conducting engagements have brought him to prestigious theaters including the Opernhaus Zürich (Il pirata, Don Pasquale), Deutsche Oper Berlin (Francesca da Rimini), Santa Fe Opera (Il barbiere di Siviglia, La bohème), Teatro de la Maestranza (Così fan tutte, Don Giovanni), The Dallas Opera (La traviata), and The Atlanta Opera (Macbeth).

A gifted opera conductor, López Reynoso made his operatic debut at age 20 with The Marriage of Figaro and has since conducted over 50 operas, ranging from Aïda and The Flying Dutchman to The Rake’s Progress, Otello, Anna Bolena, Rigoletto, Tosca, and Don Carlo. He has also led the Mexican premieres of Rossini’s Le comte Ory, Il viaggio a Reims, and Donizetti’s Viva la mamma.

A graduate summa cum laude in orchestral conducting, López Reynoso has studied violin, piano, and choral conducting, and trained under notable mentors including Alberto Zedda, Jean Paul Penin, and Avi Ostrowsky. In 2014, he was chosen for the Rossini Opera Festival Accademia, conducting Il viaggio a Reims under Zedda’s guidance. His previous posts include Erster Kapellmeister at the Staatstheater Braunschweig, Associate Conductor of the Orquesta Filarmónica de la UNAM, Artistic Director of the Orquesta del Teatro de Bellas Artes, and Principal Guest Conductor of the Oviedo Filarmonía.` },

  // Violin
  { id: "peter-ciaschini", name: "Peter Ciaschini", role: "Violin · The Loraine P. Williams Orchestra Concertmaster Chair", group: "Orchestra", photo: "", bio: `` },
  { id: "helen-kim", name: "Helen Kim", role: "Violin · Assistant Concertmaster", group: "Orchestra", photo: "", bio: `` },
  { id: "fia-durrett", name: "Fia Durrett", role: "Violin · Principal Second Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "adelaide-federici", name: "Adelaide Federici", role: "Violin · Assistant Principal Second Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "chelsea-cline", name: "Chelsea Cline", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "edward-eanes", name: "Edward Eanes", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "virginia-fairchild", name: "Virginia Fairchild", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "felix-farrar", name: "Felix Farrar", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "sally-gardner-wilson", name: "Sally Gardner-Wilson", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "robert-givens", name: "Robert Givens", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "patti-gouvas", name: "Patti Gouvas", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "lisa-morrison", name: "Lisa Morrison", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "patrick-ryan", name: "Patrick Ryan", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "jessica-stinson", name: "Jessica Stinson", role: "Violin", group: "Orchestra", photo: "", bio: `` },
  { id: "rafael-veytsblum", name: "Rafael Veytsblum", role: "Violin", group: "Orchestra", photo: "", bio: `` },

  // Viola
  { id: "william-johnston", name: "William Johnston", role: "Viola · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "catherine-allain", name: "Catherine Allain", role: "Viola · Assistant Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "ryan-gregory", name: "Ryan Gregory", role: "Viola", group: "Orchestra", photo: "", bio: `` },
  { id: "julie-rosseter", name: "Julie Rosseter", role: "Viola", group: "Orchestra", photo: "", bio: `` },
  { id: "joli-wu", name: "Joli Wu", role: "Viola", group: "Orchestra", photo: "", bio: `` },

  // Cello
  { id: "charae-krueger", name: "Charae Krueger", role: "Cello · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "barney-culver", name: "Barney Culver", role: "Cello · Assistant Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "david-hancock", name: "David Hancock", role: "Cello", group: "Orchestra", photo: "", bio: `` },
  { id: "cynthia-sulko", name: "Cynthia Sulko", role: "Cello", group: "Orchestra", photo: "", bio: `` },

  // Bass
  { id: "daniel-tancredi", name: "Daniel Tancredi", role: "Bass · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "emory-clements", name: "Emory Clements", role: "Bass", group: "Orchestra", photo: "", bio: `` },

  // Winds
  { id: "james-zellers", name: "James Zellers", role: "Flute · Principal · Personnel Manager", group: "Orchestra", photo: "", bio: `` },
  { id: "kelly-bryant", name: "Kelly Bryant", role: "Flute", group: "Orchestra", photo: "", bio: `` },
  { id: "christina-gavin", name: "Christina Gavin", role: "Oboe · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "dominic-bernard", name: "Dominic Bernard", role: "Oboe", group: "Orchestra", photo: "", bio: `` },
  { id: "david-odom", name: "David Odom", role: "Clarinet · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "john-warren", name: "John Warren", role: "Clarinet", group: "Orchestra", photo: "", bio: `` },
  { id: "marissa-takaki", name: "Marissa Takaki", role: "Bassoon · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "debra-grove", name: "Debra Grove", role: "Bassoon", group: "Orchestra", photo: "", bio: `` },

  // Brass
  { id: "david-bradley", name: "David Bradley", role: "Horn · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "jason-eklund", name: "Jason Eklund", role: "Horn", group: "Orchestra", photo: "", bio: `` },
  { id: "yvonne-toll-schneider", name: "Yvonne Toll-Schneider", role: "Trumpet · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "alexander-freund", name: "Alexander Freund", role: "Trumpet", group: "Orchestra", photo: "", bio: `` },
  { id: "william-p-mann", name: "William P. Mann", role: "Trombone · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "richard-brady", name: "Richard Brady", role: "Bass Trombone", group: "Orchestra", photo: "", bio: `` },
  { id: "donald-strand", name: "Donald Strand", role: "Tuba · Principal", group: "Orchestra", photo: "", bio: `` },

  // Percussion & Harp
  { id: "john-lawless", name: "John Lawless", role: "Timpani · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "mike-cebulski", name: "Mike Cebulski", role: "Percussion · Principal", group: "Orchestra", photo: "", bio: `` },
  { id: "susan-brady", name: "Susan Brady", role: "Harp · Principal", group: "Orchestra", photo: "", bio: `` },

  // Chorus
  { id: "chorus-1", name: "Full Name", role: "Soprano", group: "Chorus", photo: "", bio: `` },
  { id: "chorus-2", name: "Full Name", role: "Alto", group: "Chorus", photo: "", bio: `` },
  { id: "chorus-3", name: "Full Name", role: "Tenor", group: "Chorus", photo: "", bio: `` },
  { id: "chorus-4", name: "Full Name", role: "Bass", group: "Chorus", photo: "", bio: `` },

  // Production
  { id: "production-1", name: "Full Name", role: "Technical Director", group: "Production", photo: "", bio: `` },
  { id: "production-2", name: "Full Name", role: "Costume Director", group: "Production", photo: "", bio: `` },
  { id: "production-3", name: "Full Name", role: "Lighting Designer", group: "Production", photo: "", bio: `` },
  { id: "production-4", name: "Full Name", role: "Production Stage Manager", group: "Production", photo: "", bio: `` },

  // Board of Directors
  { id: "board-1", name: "Full Name", role: "Chair", group: "Board of Directors", photo: "", bio: `` },
  { id: "board-2", name: "Full Name", role: "Vice Chair", group: "Board of Directors", photo: "", bio: `` },
  { id: "board-3", name: "Full Name", role: "Treasurer", group: "Board of Directors", photo: "", bio: `` },
  { id: "board-4", name: "Full Name", role: "Secretary", group: "Board of Directors", photo: "", bio: `` },
];
