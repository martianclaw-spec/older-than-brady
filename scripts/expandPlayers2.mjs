// Bigger expansion: add ~100 well-known NFL athletes and a few more cross-sport
// names so search queries like "is X older than tom brady" hit the site for
// far more X. Idempotent on names.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "..", "data", "players.json");

const existing = JSON.parse(readFileSync(file, "utf8"));

const ADDITIONS = [
  // --- Modern NFL QBs --------------------------------------------------
  { name: "Russell Wilson", birthDate: "1988-11-29", category: "nfl" },
  { name: "Andrew Luck", birthDate: "1989-09-12", category: "nfl" },
  { name: "Cam Newton", birthDate: "1989-05-11", category: "nfl" },
  { name: "Matthew Stafford", birthDate: "1988-02-07", category: "nfl" },
  { name: "Dak Prescott", birthDate: "1993-07-29", category: "nfl" },
  { name: "Jared Goff", birthDate: "1994-10-14", category: "nfl" },
  { name: "Kirk Cousins", birthDate: "1988-08-19", category: "nfl" },
  { name: "Derek Carr", birthDate: "1991-03-28", category: "nfl" },
  { name: "Ryan Tannehill", birthDate: "1988-07-27", category: "nfl" },
  { name: "Andy Dalton", birthDate: "1987-10-29", category: "nfl" },
  { name: "Tua Tagovailoa", birthDate: "1998-03-02", category: "nfl" },
  { name: "Jalen Hurts", birthDate: "1998-08-07", category: "nfl" },
  { name: "Kyler Murray", birthDate: "1997-08-07", category: "nfl" },
  { name: "Baker Mayfield", birthDate: "1995-04-14", category: "nfl" },
  { name: "Trevor Lawrence", birthDate: "1999-10-06", category: "nfl" },
  { name: "Justin Fields", birthDate: "1999-03-05", category: "nfl" },
  { name: "Mac Jones", birthDate: "1998-09-05", category: "nfl" },
  { name: "Sam Darnold", birthDate: "1997-06-05", category: "nfl" },
  { name: "C.J. Stroud", birthDate: "2001-10-03", category: "nfl" },
  { name: "Bryce Young", birthDate: "2001-07-25", category: "nfl" },
  { name: "Anthony Richardson", birthDate: "2002-05-22", category: "nfl" },
  { name: "Geno Smith", birthDate: "1990-10-10", category: "nfl" },

  // --- NFL RBs ---------------------------------------------------------
  { name: "Derrick Henry", birthDate: "1994-01-04", category: "nfl" },
  { name: "Alvin Kamara", birthDate: "1995-07-25", category: "nfl" },
  { name: "Le'Veon Bell", birthDate: "1992-02-18", category: "nfl" },
  { name: "Todd Gurley", birthDate: "1994-08-03", category: "nfl" },
  { name: "Ezekiel Elliott", birthDate: "1995-07-22", category: "nfl" },
  { name: "Christian McCaffrey", birthDate: "1996-06-07", category: "nfl" },
  { name: "Nick Chubb", birthDate: "1995-12-27", category: "nfl" },
  { name: "Aaron Jones", birthDate: "1994-12-02", category: "nfl" },
  { name: "Joe Mixon", birthDate: "1996-07-24", category: "nfl" },
  { name: "Jonathan Taylor", birthDate: "1999-01-19", category: "nfl" },
  { name: "Bijan Robinson", birthDate: "2002-01-30", category: "nfl" },
  { name: "Jamaal Charles", birthDate: "1986-12-27", category: "nfl" },
  { name: "DeMarco Murray", birthDate: "1988-02-12", category: "nfl" },
  { name: "Maurice Jones-Drew", birthDate: "1985-03-23", category: "nfl" },

  // --- NFL WRs ---------------------------------------------------------
  { name: "Tyreek Hill", birthDate: "1994-03-01", category: "nfl" },
  { name: "Davante Adams", birthDate: "1992-12-24", category: "nfl" },
  { name: "Stefon Diggs", birthDate: "1993-11-29", category: "nfl" },
  { name: "DeAndre Hopkins", birthDate: "1992-06-06", category: "nfl" },
  { name: "Mike Evans", birthDate: "1993-08-21", category: "nfl" },
  { name: "Julio Jones", birthDate: "1989-02-08", category: "nfl" },
  { name: "A.J. Green", birthDate: "1988-07-31", category: "nfl" },
  { name: "Antonio Brown", birthDate: "1988-07-10", category: "nfl" },
  { name: "Brandon Marshall", birthDate: "1984-03-23", category: "nfl" },
  { name: "Jordy Nelson", birthDate: "1985-05-31", category: "nfl" },
  { name: "Greg Jennings", birthDate: "1983-09-21", category: "nfl" },
  { name: "Wes Welker", birthDate: "1981-05-01", category: "nfl" },
  { name: "Victor Cruz", birthDate: "1986-11-11", category: "nfl" },
  { name: "DeSean Jackson", birthDate: "1986-12-01", category: "nfl" },
  { name: "Justin Jefferson", birthDate: "1999-06-16", category: "nfl" },
  { name: "Ja'Marr Chase", birthDate: "2000-03-01", category: "nfl" },
  { name: "CeeDee Lamb", birthDate: "1999-04-08", category: "nfl" },
  { name: "A.J. Brown", birthDate: "1997-06-30", category: "nfl" },
  { name: "DK Metcalf", birthDate: "1997-12-14", category: "nfl" },

  // --- NFL TEs ---------------------------------------------------------
  { name: "Rob Gronkowski", birthDate: "1989-05-14", category: "nfl" },
  { name: "Travis Kelce", birthDate: "1989-10-05", category: "nfl" },
  { name: "Jimmy Graham", birthDate: "1986-11-24", category: "nfl" },
  { name: "Greg Olsen", birthDate: "1985-03-11", category: "nfl" },
  { name: "Heath Miller", birthDate: "1982-10-22", category: "nfl" },

  // --- NFL Defense (modern) -------------------------------------------
  { name: "J.J. Watt", birthDate: "1989-03-22", category: "nfl" },
  { name: "Aaron Donald", birthDate: "1991-05-23", category: "nfl" },
  { name: "Khalil Mack", birthDate: "1991-02-22", category: "nfl" },
  { name: "Von Miller", birthDate: "1989-03-26", category: "nfl" },
  { name: "Myles Garrett", birthDate: "1995-12-29", category: "nfl" },
  { name: "Nick Bosa", birthDate: "1997-10-23", category: "nfl" },
  { name: "Joey Bosa", birthDate: "1995-07-11", category: "nfl" },
  { name: "T.J. Watt", birthDate: "1994-10-11", category: "nfl" },
  { name: "Jalen Ramsey", birthDate: "1994-10-24", category: "nfl" },
  { name: "Stephon Gilmore", birthDate: "1990-09-19", category: "nfl" },
  { name: "Tyrann Mathieu", birthDate: "1992-05-13", category: "nfl" },
  { name: "Patrick Peterson", birthDate: "1990-07-11", category: "nfl" },
  { name: "Bobby Wagner", birthDate: "1990-06-27", category: "nfl" },
  { name: "Earl Thomas", birthDate: "1989-05-07", category: "nfl" },
  { name: "Richard Sherman", birthDate: "1988-03-30", category: "nfl" },
  { name: "Eric Berry", birthDate: "1988-12-29", category: "nfl" },
  { name: "Jadeveon Clowney", birthDate: "1993-02-14", category: "nfl" },

  // --- NFL Legends -----------------------------------------------------
  { name: "Walter Payton", birthDate: "1954-07-25", category: "nfl" },
  { name: "Lawrence Taylor", birthDate: "1959-02-04", category: "nfl" },
  { name: "Steve Largent", birthDate: "1954-09-28", category: "nfl" },
  { name: "Howie Long", birthDate: "1960-01-06", category: "nfl" },
  { name: "Ronnie Lott", birthDate: "1959-05-08", category: "nfl" },
  { name: "Marcus Allen", birthDate: "1960-03-26", category: "nfl" },
  { name: "Eric Dickerson", birthDate: "1960-09-02", category: "nfl" },
  { name: "Thurman Thomas", birthDate: "1966-05-16", category: "nfl" },
  { name: "Cris Carter", birthDate: "1965-11-25", category: "nfl" },
  { name: "Tim Brown", birthDate: "1966-07-22", category: "nfl" },
  { name: "Andre Reed", birthDate: "1964-01-29", category: "nfl" },
  { name: "Rod Woodson", birthDate: "1965-03-10", category: "nfl" },
  { name: "Mike Singletary", birthDate: "1958-10-09", category: "nfl" },
  { name: "Bo Jackson", birthDate: "1962-11-30", category: "nfl" },
  { name: "Earl Campbell", birthDate: "1955-03-29", category: "nfl" },
  { name: "Deion Sanders", birthDate: "1967-08-09", category: "nfl" },

  // --- More OL/Special teams ------------------------------------------
  { name: "Joe Thomas", birthDate: "1984-12-04", category: "nfl" },
  { name: "Patrick Willis", birthDate: "1985-01-25", category: "nfl" }
];

const merged = existing.map((p) => ({
  name: p.name,
  birthDate: p.birthDate,
  category: p.category ?? "nfl"
}));

const seen = new Set(merged.map((p) => p.name));
let added = 0;
for (const a of ADDITIONS) {
  if (seen.has(a.name)) continue;
  merged.push(a);
  seen.add(a.name);
  added++;
}

const lines = merged.map(
  (p) =>
    `  { "name": ${JSON.stringify(p.name)}, "birthDate": ${JSON.stringify(
      p.birthDate
    )}, "category": ${JSON.stringify(p.category)} }`
);
writeFileSync(file, "[\n" + lines.join(",\n") + "\n]\n");

const counts = merged.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});
console.log(`added: ${added}`);
console.log(`new total: ${merged.length}`);
console.log("by category:", counts);
