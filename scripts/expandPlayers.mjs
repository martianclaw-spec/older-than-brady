// One-shot migration: add category to existing NFL entries and append
// recognizable athletes/celebrities. Re-runnable (idempotent on names).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "..", "data", "players.json");

const existing = JSON.parse(readFileSync(file, "utf8"));

const ADDITIONS = [
  // --- NBA --------------------------------------------------------------
  { name: "Kobe Bryant", birthDate: "1978-08-23", category: "nba" },
  { name: "Shaquille O'Neal", birthDate: "1972-03-06", category: "nba" },
  { name: "Allen Iverson", birthDate: "1975-06-07", category: "nba" },
  { name: "Tim Duncan", birthDate: "1976-04-25", category: "nba" },
  { name: "Kevin Garnett", birthDate: "1976-05-19", category: "nba" },
  { name: "Dirk Nowitzki", birthDate: "1978-06-19", category: "nba" },
  { name: "Tracy McGrady", birthDate: "1979-05-24", category: "nba" },
  { name: "Vince Carter", birthDate: "1977-01-26", category: "nba" },
  { name: "Paul Pierce", birthDate: "1977-10-13", category: "nba" },
  { name: "Jason Kidd", birthDate: "1973-03-23", category: "nba" },
  { name: "Steve Nash", birthDate: "1974-02-07", category: "nba" },
  { name: "Dwyane Wade", birthDate: "1982-01-17", category: "nba" },
  { name: "LeBron James", birthDate: "1984-12-30", category: "nba" },

  // --- MLB --------------------------------------------------------------
  { name: "Derek Jeter", birthDate: "1974-06-26", category: "mlb" },
  { name: "Alex Rodriguez", birthDate: "1975-07-27", category: "mlb" },
  { name: "Albert Pujols", birthDate: "1980-01-16", category: "mlb" },
  { name: "David Ortiz", birthDate: "1975-11-18", category: "mlb" },
  { name: "Ichiro Suzuki", birthDate: "1973-10-22", category: "mlb" },
  { name: "Chipper Jones", birthDate: "1972-04-24", category: "mlb" },
  { name: "Mariano Rivera", birthDate: "1969-11-29", category: "mlb" },
  { name: "Ken Griffey Jr.", birthDate: "1969-11-21", category: "mlb" },

  // --- Golf -------------------------------------------------------------
  { name: "Tiger Woods", birthDate: "1975-12-30", category: "golf" },
  { name: "Phil Mickelson", birthDate: "1970-06-16", category: "golf" },
  { name: "Sergio Garcia", birthDate: "1980-01-09", category: "golf" },
  { name: "Rory McIlroy", birthDate: "1989-05-04", category: "golf" },

  // --- Tennis -----------------------------------------------------------
  { name: "Roger Federer", birthDate: "1981-08-08", category: "tennis" },
  { name: "Serena Williams", birthDate: "1981-09-26", category: "tennis" },
  { name: "Venus Williams", birthDate: "1980-06-17", category: "tennis" },
  { name: "Andre Agassi", birthDate: "1970-04-29", category: "tennis" },

  // --- Celebrities ------------------------------------------------------
  { name: "Dwayne Johnson", birthDate: "1972-05-02", category: "celebrity" },
  { name: "Leonardo DiCaprio", birthDate: "1974-11-11", category: "celebrity" },
  { name: "Ryan Reynolds", birthDate: "1976-10-23", category: "celebrity" },
  { name: "Eminem", birthDate: "1972-10-17", category: "celebrity" },
  { name: "Kanye West", birthDate: "1977-06-08", category: "celebrity" },
  { name: "Beyonce", birthDate: "1981-09-04", category: "celebrity" },
  { name: "Justin Timberlake", birthDate: "1981-01-31", category: "celebrity" },
  { name: "Britney Spears", birthDate: "1981-12-02", category: "celebrity" },
  { name: "Ben Affleck", birthDate: "1972-08-15", category: "celebrity" },
  { name: "Matt Damon", birthDate: "1970-10-08", category: "celebrity" },
  { name: "Will Smith", birthDate: "1968-09-25", category: "celebrity" },
  { name: "Mark Wahlberg", birthDate: "1971-06-05", category: "celebrity" },
  { name: "Brad Pitt", birthDate: "1963-12-18", category: "celebrity" },
  { name: "Taylor Swift", birthDate: "1989-12-13", category: "celebrity" }
];

// 1) tag every existing entry as nfl (idempotent)
const merged = existing.map((p) => ({
  name: p.name,
  birthDate: p.birthDate,
  category: p.category ?? "nfl"
}));

// 2) append additions, skipping any name already present
const seen = new Set(merged.map((p) => p.name));
for (const add of ADDITIONS) {
  if (seen.has(add.name)) continue;
  merged.push(add);
  seen.add(add.name);
}

// 3) write a stable, one-line-per-entry format that matches the existing style
const lines = merged.map(
  (p) =>
    `  { "name": ${JSON.stringify(p.name)}, "birthDate": ${JSON.stringify(
      p.birthDate
    )}, "category": ${JSON.stringify(p.category)} }`
);
const out = "[\n" + lines.join(",\n") + "\n]\n";
writeFileSync(file, out);

// 4) summary
const counts = merged.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});
console.log("total:", merged.length);
console.log("by category:", counts);
