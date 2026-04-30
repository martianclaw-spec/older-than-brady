// Curated list of athletes to spin into dedicated /older-than-brady/<slug>
// pages. Names match entries in data/players.json so birthdates resolve
// automatically. Taglines are short, factual, and used in <meta description>
// + page intro.
export type Sport = "NFL" | "NBA" | "MLB" | "Golf" | "Tennis";

export type FeaturedAthlete = {
  name: string;
  slug: string;
  tagline: string;
  sport: Sport;
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const FEATURED_ATHLETES: FeaturedAthlete[] = [
  // NFL
  { name: "Peyton Manning", slug: "peyton-manning", tagline: "Five-time NFL MVP and two-time Super Bowl winner", sport: "NFL" },
  { name: "Aaron Rodgers", slug: "aaron-rodgers", tagline: "Four-time NFL MVP and Super Bowl XLV champion", sport: "NFL" },
  { name: "Drew Brees", slug: "drew-brees", tagline: "Super Bowl XLIV MVP and one of the NFL's all-time passing leaders", sport: "NFL" },
  { name: "Patrick Mahomes", slug: "patrick-mahomes", tagline: "Three-time Super Bowl champion and the new face of the NFL", sport: "NFL" },
  { name: "Eli Manning", slug: "eli-manning", tagline: "Two-time Super Bowl MVP — and the man who beat Brady twice", sport: "NFL" },
  { name: "Ben Roethlisberger", slug: "ben-roethlisberger", tagline: "Two-time Super Bowl-winning Steelers quarterback", sport: "NFL" },
  { name: "Joe Montana", slug: "joe-montana", tagline: "Four-time Super Bowl champion and the original GOAT contender", sport: "NFL" },
  { name: "Brett Favre", slug: "brett-favre", tagline: "Three-time NFL MVP and Hall of Fame Packers quarterback", sport: "NFL" },
  { name: "Tony Romo", slug: "tony-romo", tagline: "Longtime Cowboys quarterback turned star NFL broadcaster", sport: "NFL" },
  { name: "Michael Vick", slug: "michael-vick", tagline: "Four-time Pro Bowler who redefined the dual-threat quarterback", sport: "NFL" },
  { name: "Randy Moss", slug: "randy-moss", tagline: "Hall of Fame receiver and one of the most explosive players ever", sport: "NFL" },
  { name: "Marvin Harrison", slug: "marvin-harrison", tagline: "Hall of Fame Colts receiver and Peyton Manning's go-to target", sport: "NFL" },
  { name: "Jerry Rice", slug: "jerry-rice", tagline: "Three-time Super Bowl champion and the NFL's all-time receiving leader", sport: "NFL" },
  { name: "Dan Marino", slug: "dan-marino", tagline: "Hall of Fame Dolphins quarterback and one of the great pure passers", sport: "NFL" },
  { name: "Ray Lewis", slug: "ray-lewis", tagline: "Two-time Super Bowl champion and Hall of Fame Ravens linebacker", sport: "NFL" },
  { name: "Adrian Peterson", slug: "adrian-peterson", tagline: "2012 NFL MVP and one of the most dominant running backs of his era", sport: "NFL" },
  { name: "Calvin Johnson", slug: "calvin-johnson", tagline: "Hall of Fame Lions receiver known as 'Megatron'", sport: "NFL" },
  { name: "Lamar Jackson", slug: "lamar-jackson", tagline: "Two-time NFL MVP and one of the league's most electric players", sport: "NFL" },
  { name: "Joe Burrow", slug: "joe-burrow", tagline: "Bengals franchise quarterback and 2019 Heisman winner", sport: "NFL" },
  { name: "Plaxico Burress", slug: "plaxico-burress", tagline: "Super Bowl XLII hero and the receiver who beat Brady's 18-0 Patriots", sport: "NFL" },
  { name: "Shaun Alexander", slug: "shaun-alexander", tagline: "2005 NFL MVP and one of the great single-season touchdown machines", sport: "NFL" },
  { name: "Olin Kreutz", slug: "olin-kreutz", tagline: "Six-time Pro Bowl center and longtime anchor of the Bears' offensive line", sport: "NFL" },
  { name: "Ricky Williams", slug: "ricky-williams", tagline: "1998 Heisman Trophy winner and explosive Saints and Dolphins running back", sport: "NFL" },
  { name: "Steve Hutchinson", slug: "steve-hutchinson", tagline: "Hall of Fame guard and seven-time Pro Bowler", sport: "NFL" },
  { name: "Daunte Culpepper", slug: "daunte-culpepper", tagline: "Three-time Pro Bowl quarterback whose 2004 season was one of the greatest ever", sport: "NFL" },
  { name: "Larry Fitzgerald", slug: "larry-fitzgerald", tagline: "11-time Pro Bowl receiver and longtime Cardinals franchise icon", sport: "NFL" },
  { name: "Frank Gore", slug: "frank-gore", tagline: "Five-time Pro Bowl running back and the NFL's third all-time rusher", sport: "NFL" },
  { name: "Troy Polamalu", slug: "troy-polamalu", tagline: "Hall of Fame Steelers safety and two-time Super Bowl champion", sport: "NFL" },
  { name: "Ed Reed", slug: "ed-reed", tagline: "Hall of Fame safety and one of the greatest ball-hawks in NFL history", sport: "NFL" },
  { name: "LaDainian Tomlinson", slug: "ladainian-tomlinson", tagline: "2006 NFL MVP and Hall of Fame Chargers running back", sport: "NFL" },
  { name: "Brian Urlacher", slug: "brian-urlacher", tagline: "Hall of Fame Bears linebacker and 2005 Defensive Player of the Year", sport: "NFL" },
  { name: "Charles Woodson", slug: "charles-woodson", tagline: "Hall of Fame defensive back and 1997 Heisman Trophy winner", sport: "NFL" },
  { name: "Donovan McNabb", slug: "donovan-mcnabb", tagline: "Six-time Pro Bowl quarterback and Eagles franchise leader", sport: "NFL" },
  { name: "Terrell Owens", slug: "terrell-owens", tagline: "Hall of Fame receiver and one of the most explosive playmakers ever", sport: "NFL" },
  { name: "Marshall Faulk", slug: "marshall-faulk", tagline: "Hall of Fame running back and 2000 NFL MVP", sport: "NFL" },
  { name: "Curtis Martin", slug: "curtis-martin", tagline: "Hall of Fame running back and the 2004 NFL rushing champion", sport: "NFL" },
  { name: "Reggie Wayne", slug: "reggie-wayne", tagline: "Six-time Pro Bowl Colts receiver and Super Bowl XLI champion", sport: "NFL" },
  { name: "Hines Ward", slug: "hines-ward", tagline: "Super Bowl XL MVP and longtime Steelers receiver", sport: "NFL" },
  { name: "Chad Johnson", slug: "chad-johnson", tagline: "Six-time Pro Bowl Bengals receiver, also known as Ochocinco", sport: "NFL" },
  { name: "Edgerrin James", slug: "edgerrin-james", tagline: "Hall of Fame Colts running back and four-time Pro Bowler", sport: "NFL" },
  { name: "Antonio Gates", slug: "antonio-gates", tagline: "Eight-time Pro Bowl Chargers tight end and one of the great unconventional pros", sport: "NFL" },
  { name: "Steve Smith Sr.", slug: "steve-smith-sr", tagline: "Five-time Pro Bowl receiver known for fierce play with the Panthers and Ravens", sport: "NFL" },
  { name: "Andre Johnson", slug: "andre-johnson", tagline: "Hall of Fame Texans receiver and seven-time Pro Bowler", sport: "NFL" },
  { name: "Carson Palmer", slug: "carson-palmer", tagline: "Three-time Pro Bowl quarterback and 2002 Heisman winner", sport: "NFL" },
  { name: "Matt Ryan", slug: "matt-ryan", tagline: "2016 NFL MVP and longtime Falcons franchise quarterback", sport: "NFL" },
  { name: "Joe Flacco", slug: "joe-flacco", tagline: "Super Bowl XLVII MVP and longtime Ravens quarterback", sport: "NFL" },
  { name: "Marshawn Lynch", slug: "marshawn-lynch", tagline: "Five-time Pro Bowl running back and Seahawks Beast Mode legend", sport: "NFL" },
  { name: "Dwyane Wade", slug: "dwyane-wade", tagline: "Three-time NBA champion and longtime face of the Miami Heat", sport: "NBA" },

  // NBA
  { name: "LeBron James", slug: "lebron-james", tagline: "Four-time NBA champion and the league's all-time leading scorer", sport: "NBA" },
  { name: "Kobe Bryant", slug: "kobe-bryant", tagline: "Five-time NBA champion and 18-time All-Star with the Lakers", sport: "NBA" },
  { name: "Shaquille O'Neal", slug: "shaquille-oneal", tagline: "Four-time NBA champion and one of the most dominant centers ever", sport: "NBA" },
  { name: "Tim Duncan", slug: "tim-duncan", tagline: "Five-time NBA champion with the San Antonio Spurs", sport: "NBA" },
  { name: "Allen Iverson", slug: "allen-iverson", tagline: "2001 NBA MVP and one of the most explosive guards in league history", sport: "NBA" },

  // MLB
  { name: "Derek Jeter", slug: "derek-jeter", tagline: "Five-time World Series champion and Yankees Hall of Famer", sport: "MLB" },
  { name: "Alex Rodriguez", slug: "alex-rodriguez", tagline: "Three-time MLB MVP and 14-time All-Star", sport: "MLB" },

  // Golf
  { name: "Tiger Woods", slug: "tiger-woods", tagline: "15-time major champion and the most famous golfer of his generation", sport: "Golf" },
  { name: "Phil Mickelson", slug: "phil-mickelson", tagline: "Six-time major champion and one of golf's most beloved figures", sport: "Golf" },

  // Tennis
  { name: "Roger Federer", slug: "roger-federer", tagline: "20-time Grand Slam champion and tennis icon", sport: "Tennis" },
  { name: "Serena Williams", slug: "serena-williams", tagline: "23-time Grand Slam champion and one of the greatest tennis players ever", sport: "Tennis" }
];

export function findFeatured(slug: string): FeaturedAthlete | undefined {
  return FEATURED_ATHLETES.find((a) => a.slug === slug);
}
