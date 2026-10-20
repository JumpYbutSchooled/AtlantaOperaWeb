// Everyone on the site, and the family tree that arranges them.
// Taken from the People pages on atlantaopera.org.
//
// PEOPLE: one entry per person. The key is used in links, e.g. /#tomer-zvulun
//   name, role (main title), photo ("" shows initials), link (their website or ""),
//   details ([label, value] pairs), bio (blank line between paragraphs)
//
// TREE: each group has a label, an optional note and photo, and children.
//   A child is another group, a person's key, or { id, role } to show a
//   different role on that card.

window.PEOPLE = {
  "ivan-lopez-reynoso": { name: "Iván López Reynoso", role: "Carl & Sally Gable Principal Conductor", photo: "images/people/ivan-lopez-reynoso.jpg", link: "https://www.ivanlopezreynoso.com/", details: [["Atlanta Opera debut", "Macbeth, 2025"]],
    bio: `Recognized for his remarkable musicianship and poised leadership, Iván López Reynoso has established himself as one of today’s most accomplished conductors. His artistry has been acclaimed in performances across Mexico, Spain, Austria, Germany, Switzerland, Peru, Oman, Japan, the United States, and Italy, leading many of the world’s foremost orchestras and opera ensembles. The Santa Fe New Mexican called his conducting “… terrific” and proclaimed, “The orchestra sounded as good as I’ve ever heard it, with an especially plush tone from the strings and crisp work by the winds and brass.”

Reynoso has collaborated with celebrated artists including Bryn Terfel, Ildar Abdrazakov, Javier Camarena, Alessandro Corbelli, Brigitte Fassbaender, Ramón Vargas, Rolando Villazón, Olga Peretyatko, Irina Lungu, John Osborn, Franz Hawlata, Paolo Bordogna, Ute Lemper, Augustin Hadelich, Michael Barenboim, Yulianna Avdeeva, Gabriela Montero, Jorge Federico Osorio, and Alex Klein.

López Reynoso has appeared with orchestras such as the Philharmonia Zürich, Milwaukee Symphony Orchestra, Santa Fe Opera Orchestra, National Orchestra and Chorus of Spain, Bilbao Symphony Orchestra, Orquesta Ciudad de Granada, Oviedo Filarmonía, Navarra Symphony Orchestra, Real Orquesta Sinfónica de Sevilla, Madrid Symphony Orchestra, Staatsorchester Braunschweig, and the National Symphony Orchestra of Mexico. His conducting engagements have brought him to prestigious theaters including the Opernhaus Zürich (Il pirata, Don Pasquale), Deutsche Oper Berlin (Francesca da Rimini), Santa Fe Opera (Il barbiere di Siviglia, La bohème), Teatro de la Maestranza (Così fan tutte, Don Giovanni), The Dallas Opera (La traviata), and The Atlanta Opera (Macbeth).

A gifted opera conductor, López Reynoso made his operatic debut at age 20 with The Marriage of Figaro and has since conducted over 50 operas, ranging from Aïda and The Flying Dutchman to The Rake’s Progress, Otello, Anna Bolena, Rigoletto, Tosca, and Don Carlo. He has also led the Mexican premieres of Rossini’s Le comte Ory, Il viaggio a Reims, and Donizetti’s Viva la mamma.

A graduate summa cum laude in orchestral conducting, López Reynoso has studied violin, piano, and choral conducting, and trained under notable mentors including Alberto Zedda, Jean Paul Penin, and Avi Ostrowsky. In 2014, he was chosen for the Rossini Opera Festival Accademia, conducting Il viaggio a Reims under Zedda’s guidance. His previous posts include Erster Kapellmeister at the Staatstheater Braunschweig, Associate Conductor of the Orquesta Filarmónica de la UNAM, Artistic Director of the Orquesta del Teatro de Bellas Artes, and Principal Guest Conductor of the Oviedo Filarmonía.` },
  "peter-ciaschini": { name: "Peter Ciaschini", role: "Violin · The Loraine P. Williams Orchestra Concertmaster Chair", photo: "" },
  "helen-kim": { name: "Helen Kim", role: "Violin · Assistant Concertmaster", photo: "" },
  "fia-durrett": { name: "Fia Durrett", role: "Violin · Principal Second Violin", photo: "" },
  "adelaide-federici": { name: "Adelaide Federici", role: "Violin · Assistant Principal Second Violin", photo: "" },
  "chelsea-cline": { name: "Chelsea Cline", role: "Violin", photo: "" },
  "edward-eanes": { name: "Edward Eanes", role: "Violin", photo: "" },
  "virginia-fairchild": { name: "Virginia Fairchild", role: "Violin", photo: "" },
  "felix-farrar": { name: "Felix Farrar", role: "Violin", photo: "" },
  "sally-gardner-wilson": { name: "Sally Gardner-Wilson", role: "Violin", photo: "" },
  "robert-givens": { name: "Robert Givens", role: "Violin", photo: "" },
  "patti-gouvas": { name: "Patti Gouvas", role: "Violin", photo: "" },
  "lisa-morrison": { name: "Lisa Morrison", role: "Violin", photo: "" },
  "patrick-ryan": { name: "Patrick Ryan", role: "Violin", photo: "" },
  "jessica-stinson": { name: "Jessica Stinson", role: "Violin", photo: "" },
  "rafael-veytsblum": { name: "Rafael Veytsblum", role: "Violin", photo: "" },
  "william-johnston": { name: "William Johnston", role: "Viola · Principal", photo: "" },
  "catherine-allain": { name: "Catherine Allain", role: "Viola · Assistant Principal", photo: "" },
  "ryan-gregory": { name: "Ryan Gregory", role: "Viola", photo: "" },
  "julie-rosseter": { name: "Julie Rosseter", role: "Viola", photo: "" },
  "joli-wu": { name: "Joli Wu", role: "Viola", photo: "" },
  "charae-krueger": { name: "Charae Krueger", role: "Cello · Principal", photo: "" },
  "barney-culver": { name: "Barney Culver", role: "Cello · Assistant Principal", photo: "" },
  "david-hancock": { name: "David Hancock", role: "Cello", photo: "" },
  "cynthia-sulko": { name: "Cynthia Sulko", role: "Cello", photo: "" },
  "daniel-tancredi": { name: "Daniel Tancredi", role: "Bass · Principal", photo: "" },
  "emory-clements": { name: "Emory Clements", role: "Bass", photo: "" },
  "james-zellers": { name: "James Zellers", role: "Flute · Principal · Personnel Manager", photo: "" },
  "kelly-bryant": { name: "Kelly Bryant", role: "Flute", photo: "" },
  "christina-gavin": { name: "Christina Gavin", role: "Oboe · Principal", photo: "" },
  "dominic-bernard": { name: "Dominic Bernard", role: "Oboe", photo: "" },
  "david-odom": { name: "David Odom", role: "Clarinet · Principal", photo: "" },
  "john-warren": { name: "John Warren", role: "Clarinet", photo: "" },
  "marissa-takaki": { name: "Marissa Takaki", role: "Bassoon · Principal", photo: "" },
  "debra-grove": { name: "Debra Grove", role: "Bassoon", photo: "" },
  "david-bradley": { name: "David Bradley", role: "Horn · Principal", photo: "" },
  "jason-eklund": { name: "Jason Eklund", role: "Horn", photo: "" },
  "yvonne-toll-schneider": { name: "Yvonne Toll-Schneider", role: "Trumpet · Principal", photo: "" },
  "alexander-freund": { name: "Alexander Freund", role: "Trumpet", photo: "" },
  "william-p-mann": { name: "William P. Mann", role: "Trombone · Principal", photo: "" },
  "richard-brady": { name: "Richard Brady", role: "Bass Trombone", photo: "",
    bio: `Richard Brady is a native Atlantan who started playing in the fourth grade in the West End Elementary Band in southwest Atlanta. By 2017 he had played bass trombone in The Atlanta Opera Orchestra for 32 years, including two seasons as principal trombone.

His favorite Atlanta Opera production to play is Strauss’s Ariadne auf Naxos. Away from the trombone he enjoys hiking, camping, astronomy and ham radio, and he is a licensed pilot.` },
  "donald-strand": { name: "Donald Strand", role: "Tuba · Principal", photo: "" },
  "john-lawless": { name: "John Lawless", role: "Timpani · Principal", photo: "" },
  "mike-cebulski": { name: "Mike Cebulski", role: "Percussion · Principal", photo: "",
    bio: `Mike Cebulski has played with The Atlanta Opera since the late 1970s. As principal percussionist he organizes the music and the percussion players for each production, and he has built some of the special instruments the operas call for, including a Japanese carillon used in Madama Butterfly.

He began playing drums in the third grade and studied privately with Jack Bell, then principal percussionist of the Atlanta Symphony Orchestra. He was midway through a music education degree at Georgia State University when he won his first professional audition, as an extra with the Atlanta Symphony Orchestra. He has taught percussion to everyone from elementary school students to college graduates.` },
  "susan-brady": { name: "Susan Brady", role: "Harp · Principal", photo: "" },
};

window.TREE = { label: "The Atlanta Opera", children: [
  { label: "Orchestra", photo: "images/orchestra.jpg", note: ["The skilled members of the orchestra share their tremendous talent with us in every production, it’s like music to our ears.", "Musicians employed are represented by the American Federation of Musicians of the United States and Canada."], children: [
    { label: "Conductor", children: [
      "ivan-lopez-reynoso",
    ] },
    { label: "Strings", children: [
      { label: "Violin", children: [
        { id: "peter-ciaschini", role: "The Loraine P. Williams Orchestra Concertmaster Chair" },
        { id: "helen-kim", role: "Assistant Concertmaster" },
        { id: "fia-durrett", role: "Principal Second Violin" },
        { id: "adelaide-federici", role: "Assistant Principal Second Violin" },
        "chelsea-cline",
        "edward-eanes",
        "virginia-fairchild",
        "felix-farrar",
        "sally-gardner-wilson",
        "robert-givens",
        "patti-gouvas",
        "lisa-morrison",
        "patrick-ryan",
        "jessica-stinson",
        "rafael-veytsblum",
      ] },
      { label: "Viola", children: [
        { id: "william-johnston", role: "Principal" },
        { id: "catherine-allain", role: "Assistant Principal" },
        "ryan-gregory",
        "julie-rosseter",
        "joli-wu",
      ] },
      { label: "Cello", children: [
        { id: "charae-krueger", role: "Principal" },
        { id: "barney-culver", role: "Assistant Principal" },
        "david-hancock",
        "cynthia-sulko",
      ] },
      { label: "Bass", children: [
        { id: "daniel-tancredi", role: "Principal" },
        "emory-clements",
      ] },
    ] },
    { label: "Woodwinds", children: [
      { label: "Flute", children: [
        { id: "james-zellers", role: "Principal" },
        "kelly-bryant",
      ] },
      { label: "Oboe", children: [
        { id: "christina-gavin", role: "Principal" },
        "dominic-bernard",
      ] },
      { label: "Clarinet", children: [
        { id: "david-odom", role: "Principal" },
        "john-warren",
      ] },
      { label: "Bassoon", children: [
        { id: "marissa-takaki", role: "Principal" },
        "debra-grove",
      ] },
    ] },
    { label: "Brass", children: [
      { label: "Horn", children: [
        { id: "david-bradley", role: "Principal" },
        "jason-eklund",
      ] },
      { label: "Trumpet", children: [
        { id: "yvonne-toll-schneider", role: "Principal" },
        "alexander-freund",
      ] },
      { label: "Trombone", children: [
        { id: "william-p-mann", role: "Principal" },
        "richard-brady",
      ] },
      { label: "Tuba", children: [
        { id: "donald-strand", role: "Principal" },
      ] },
    ] },
    { label: "Percussion & Harp", children: [
      { label: "Timpani", children: [
        { id: "john-lawless", role: "Principal" },
      ] },
      { label: "Percussion", children: [
        { id: "mike-cebulski", role: "Principal" },
      ] },
      { label: "Harp", children: [
        { id: "susan-brady", role: "Principal" },
      ] },
    ] },
    { label: "Personnel Manager", children: [
      { id: "james-zellers", role: "Personnel Manager" },
    ] },
  ] },
] };
