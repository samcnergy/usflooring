// South Orange County market pages (Our Work > Markets).
// Population: 2020 U.S. Census (April 1, 2020 count).
// Median household income: 2020-2024 American Community Survey 5-year estimate,
// in 2024 dollars, as shown by Census QuickFacts.
// Airport distances: approximate straight-line miles from the community's
// 2020 Census Gazetteer internal point to the airport reference point.
// Planning, coastal, historic, and HOA items are property-specific: describe
// them as things to verify, never as guaranteed requirements or approvals.
// Facts and project statuses checked against the linked sources on 2026-09-16.

export type Source = { label: string; href: string };

export type Market = {
  slug: string;
  name: string;
  kind: "City" | "Unincorporated community";
  metaTitle: string;
  metaDescription: string;
  headline: string;
  lede: string;
  image?: { src: string; alt: string; position: string };
  population: number;
  medianIncome: number | null;
  milesToSNA: number;
  milesToLAX: number;
  character: { heading: string; paragraphs: string[] };
  planning: { heading: string; intro: string; checks: { title: string; detail: string }[] };
  schools: string;
  transit: string;
  sources: Source[];
};

export const OC_BUS: Source = { label: "OC Bus routes and maps", href: "https://www.octa.net/getting-around/bus/oc-bus/bus-overview" };
export const METROLINK: Source = { label: "Metrolink stations in Orange County", href: "https://octa.net/getting-around/rail/metrolink/stations-and-schedules/" };

export const METHOD_SOURCES: Source[] = [
  { label: "Census Gazetteer files (2020)", href: "https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2020.html" },
  { label: "John Wayne Airport reference information", href: "https://files.ocair.com/media/2023-06/AppendixB-Aviation-Forecasts-Technical-Report.pdf" },
  { label: "FAA airport information (LAX)", href: "https://www.faa.gov/air_traffic/publications/atpubs/aip_html/part3_ad_2.0_california.html" },
];

export const MARKETS: Market[] = [
  {
    slug: "rancho-santa-margarita",
    name: "Rancho Santa Margarita",
    kind: "City",
    metaTitle: "Rancho Santa Margarita Remodeling: Local Planning Guide",
    metaDescription: "Planning a remodel in Rancho Santa Margarita? What sets the lake community apart, which city and HOA reviews to check, school districts, and local sources.",
    headline: "Rancho Santa Margarita: a planned lake community with neighborhoods that do not all follow the same rules.",
    lede: "The city grew from a master plan built around Lake Santa Margarita, parks, and trails, then incorporated neighboring communities with their own histories. That mix matters when you plan work on an existing home.",
    image: { src: "/rsm.png", alt: "Lakeside homes in Rancho Santa Margarita with the Santa Ana Mountains behind", position: "center 55%" },
    population: 47949,
    medianIncome: 152560,
    milesToSNA: 16,
    milesToLAX: 51,
    character: {
      heading: "A master plan centered on the lake",
      paragraphs: [
        "Rancho Santa Margarita was laid out as a master-planned community, with Lake Santa Margarita, parks, and a trail network tying distinct residential neighborhoods together. The first planned homes were sold in 1986.",
        "When the city incorporated in 2000, it brought the original planned community together with Dove Canyon, Robinson Ranch, Rancho Cielo, Trabuco Highlands, and the Walden communities. Each still has its own character. Santa Margarita Town Center serves as a local shopping destination.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "For work on an existing home, there are usually two separate conversations: one with the city and, in many neighborhoods, one with a homeowner association.",
      checks: [
        { title: "City zoning and permits", detail: "Confirm the parcel's zoning and whether the planned scope needs a permit through the city's Building & Development process." },
        { title: "Homeowner association review", detail: "Many neighborhoods have their own architectural review. Its approval is separate from the city's and can have its own timeline." },
        { title: "Neighborhood-specific standards", detail: "Standards can differ between established neighborhoods and between residential and commercial areas. Check the rules for your address rather than assuming a citywide answer." },
      ],
    },
    schools: "Parts of the city are in Saddleback Valley Unified and parts are in Capistrano Unified. School assignment depends on the property address, so confirm with the district.",
    transit: "OC Bus serves parts of the city. There is no rail station in Rancho Santa Margarita; regional rail means connecting to a station in another city.",
    sources: [
      { label: "Census QuickFacts: Rancho Santa Margarita", href: "https://www.census.gov/quickfacts/fact/table/ranchosantamargaritacitycalifornia/INC110224" },
      { label: "City of Rancho Santa Margarita: History", href: "https://www.cityofrsm.org/399/History" },
      { label: "City of Rancho Santa Margarita: Building & Development", href: "https://www.cityofrsm.org/427/Building-Development" },
      { label: "City of Rancho Santa Margarita: Commercial Districts", href: "https://www.cityofrsm.org/656/Commercial-Districts" },
    ],
  },
  {
    slug: "coto-de-caza",
    name: "Coto de Caza",
    kind: "Unincorporated community",
    metaTitle: "Coto de Caza Remodeling: County Plans and Estate Lots",
    metaDescription: "Coto de Caza is a gated, unincorporated community with large lots and equestrian roots. Learn which county plan, permits, and association standards to check.",
    headline: "Coto de Caza: large lots, equestrian roots, and county planning instead of a city hall.",
    lede: "Coto de Caza is an unincorporated, gated community in Orange County. Larger residential lots, golf, and equestrian facilities shape both the landscape and the planning questions a property owner should ask.",
    population: 14710,
    medianIncome: 243816,
    milesToSNA: 17,
    milesToLAX: 53,
    character: {
      heading: "An estate setting behind the gates",
      paragraphs: [
        "Coto de Caza is known for large residential lots, golf, and equestrian facilities. Its equestrian character is still visible, both in the landscape and in county planning records, which include recent review of a private equestrian facility.",
        "Day-to-day shopping is mostly outside the gates, including nearby Sendero Marketplace and the retail areas of Rancho Santa Margarita.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "Because Coto de Caza is unincorporated, the starting point is the County of Orange rather than a city.",
      checks: [
        { title: "Coto de Caza Specific Plan", detail: "The county's specific plan organizes the community into planning areas. Identify the parcel's planning area before scoping work." },
        { title: "County permitting", detail: "Permits and planning review run through OC Development Services." },
        { title: "Association standards", detail: "Check which community association standards apply to the property and how their review fits with the county's." },
        { title: "Proposed use", detail: "The intended use matters, particularly for larger or equestrian properties. Confirm what the parcel's planning area allows." },
      ],
    },
    schools: "Coto de Caza is within Capistrano Unified. School assignment depends on the property address.",
    transit: "Reaching regional rail generally requires a car or an arranged ride. Check the current OC Bus map for any connection near a specific address.",
    sources: [
      { label: "Census QuickFacts: Coto de Caza CDP", href: "https://www.census.gov/quickfacts/fact/table/cotodecazacdpcalifornia/INC110224" },
      { label: "OC Development Services: Community Plans", href: "https://pwds.oc.gov/service-areas/oc-development-services/planning-development/community-plans" },
      { label: "County of Orange: Coto de Caza equestrian facility review (PA22-0208)", href: "https://pwds.oc.gov/sites/ocpwocds/files/2023-05/PA22-0208%20CPAC%20cover%20memo.pdf" },
      { label: "Rancho Mission Viejo: Sendero Marketplace", href: "https://www.ranchomissionviejo.com/amenities/retail-restaurants" },
    ],
  },
  {
    slug: "san-juan-capistrano",
    name: "San Juan Capistrano",
    kind: "City",
    metaTitle: "San Juan Capistrano Remodeling: Historic Areas and Design Rules",
    metaDescription: "The Mission, Los Rios, and the rail depot give San Juan Capistrano its character. See which design guidelines and historic inventory to check before a project.",
    headline: "San Juan Capistrano: a historic town center with design guidelines to match.",
    lede: "The Mission, the Los Rios historic district, and the rail depot give San Juan Capistrano a built character unlike newer South County communities. If a property sits near a historic resource, find that out early.",
    image: { src: "/san juan cap.jpg", alt: "Mission Basilica in San Juan Capistrano", position: "center 35%" },
    population: 35196,
    medianIncome: 129457,
    milesToSNA: 17,
    milesToLAX: 53,
    character: {
      heading: "Older than the master plans around it",
      paragraphs: [
        "Mission San Juan Capistrano, the Los Rios historic district, and the train depot anchor a town center that predates the planned communities around it.",
        "River Street Marketplace adds newer shopping and dining in the Los Rios district, a short walk from the station, so old and new sit side by side.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "The city publishes architectural design guidelines and maintains an Inventory of Historic and Cultural Landmarks.",
      checks: [
        { title: "Historic designation", detail: "If the property is on or near a listed resource, verify its designation and the review path before describing the scope of work." },
        { title: "Architectural design guidelines", detail: "Review the city's guidelines for the property's area and building type." },
        { title: "Conditions vary across the city", detail: "Neighborhoods away from the historic core may face different considerations. Start from the specific parcel." },
      ],
    },
    schools: "Capistrano Unified serves San Juan Capistrano. School assignment depends on the property address.",
    transit: "San Juan Capistrano has its own Metrolink station, with OC Bus connections. Schedules and routes change, so check current service.",
    sources: [
      { label: "Census QuickFacts: San Juan Capistrano", href: "https://www.census.gov/quickfacts/fact/table/sanjuancapistranocitycalifornia/INC110224" },
      { label: "City of San Juan Capistrano: Architectural Design Guidelines", href: "https://sanjuancapistrano.org/219/Architectural-Design-Guidelines" },
      { label: "City of San Juan Capistrano: Inventory of Historic and Cultural Landmarks", href: "https://www.sanjuancapistrano.org/263/Understanding-the-Inventory-of-Historic-" },
      { label: "River Street Marketplace", href: "https://www.riverstreetsjc.com/" },
    ],
  },
  {
    slug: "san-clemente",
    name: "San Clemente",
    kind: "City",
    metaTitle: "San Clemente Remodeling: Coastal and Design Planning",
    metaDescription: "San Clemente pairs a Spanish-influenced historic core with planned areas like Talega. See how design guidelines, coastal status, and hillside sites affect plans.",
    headline: "San Clemente: Spanish-influenced architecture, a coastal zone, and hillside neighborhoods.",
    lede: "San Clemente's architectural identity is most visible near its historic core and the Pier Bowl, while planned areas such as Talega and Forster Ranch sit farther inland. The planning questions change with the location.",
    population: 64293,
    medianIncome: 140062,
    milesToSNA: 21,
    milesToLAX: 57,
    character: {
      heading: "From the Pier Bowl to the inland canyons",
      paragraphs: [
        "San Clemente's Spanish-influenced architecture is especially visible in and around the historic downtown and the Pier Bowl. Farther inland, neighborhoods include planned communities such as Talega and Forster Ranch.",
        "Avenida Del Mar is the downtown street for shopping and dining, and the Outlets at San Clemente offer a larger retail destination.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "Determine the parcel's actual planning and coastal status before describing a permit path.",
      checks: [
        { title: "Design guidelines", detail: "City design guidelines, and standards within specific-plan areas such as the Pier Bowl, may apply to the property." },
        { title: "Coastal zone status", detail: "Properties within the coastal zone can face additional planning review, including coastal development permits. Confirm whether the parcel is inside it." },
        { title: "Hillside and canyon sites", detail: "Sloped sites may raise grading and runoff questions that are worth investigating early." },
      ],
    },
    schools: "Capistrano Unified serves San Clemente. School assignment depends on the property address.",
    transit: "Metrolink lists two stations in the city, San Clemente and San Clemente Pier, and OC Bus provides local connections. Check current schedules before relying on either.",
    sources: [
      { label: "Census QuickFacts: San Clemente", href: "https://www.census.gov/quickfacts/fact/table/sanclementecitycalifornia/INC110224" },
      { label: "City of San Clemente: Design Guidelines", href: "https://www.sanclemente.gov/294/Design-Guidelines" },
      { label: "City of San Clemente: Coastal Planning", href: "https://www.sanclemente.gov/295/Coastal-Planning" },
      METROLINK,
    ],
  },
  {
    slug: "lake-forest",
    name: "Lake Forest",
    kind: "City",
    metaTitle: "Lake Forest Remodeling: El Toro, Foothill Ranch and Baker Ranch",
    metaDescription: "Lake Forest combines older El Toro streets with Foothill Ranch, Portola Hills, and Baker Ranch. See why the neighborhood matters when you plan a project.",
    headline: "Lake Forest: older El Toro streets alongside newer planned communities.",
    lede: "Lake Forest is really several places at once. The El Toro area predates the planned communities of Foothill Ranch, Portola Hills, and Baker Ranch, and the city's planning documents reflect those differences.",
    population: 85858,
    medianIncome: 135175,
    milesToSNA: 11,
    milesToLAX: 46,
    character: {
      heading: "Several eras in one city",
      paragraphs: [
        "Older El Toro neighborhoods sit alongside later planned communities such as Foothill Ranch, Portola Hills, and Baker Ranch, so housing ages and street patterns vary noticeably from one part of the city to another.",
        "Heritage Hill Historical Park preserves buildings from the area's rancho, town, and citrus eras, including the Serrano Adobe. For shopping, Foothill Ranch Towne Centre is a local destination.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "The city publishes planning documents for different areas, including El Toro design guidelines and planned-community documents for Baker Ranch and Foothill Ranch.",
      checks: [
        { title: "Identify the neighborhood", detail: "Confirm which area the property is in before applying any design or development guidance." },
        { title: "Area planning documents", detail: "Look up the planning document that covers that area and parcel." },
        { title: "Association rules", detail: "Planned neighborhoods may also have association standards that apply alongside the city's." },
      ],
    },
    schools: "Saddleback Valley Unified serves Lake Forest. School assignment depends on the property address.",
    transit: "OC Bus serves the city. Regional rail generally means traveling to a station in a neighboring city.",
    sources: [
      { label: "Census QuickFacts: Lake Forest", href: "https://www.census.gov/quickfacts/fact/table/lakeforestcitycalifornia/INC110224" },
      { label: "City of Lake Forest: Planning Documents", href: "https://city-lakeforest.com/292/Planning-Documents.html" },
      { label: "OC Parks: Heritage Hill Historical Park", href: "https://parks.oc.gov/historic-sites/heritage-hill-historical-park" },
      { label: "Foothill Ranch Towne Centre", href: "https://foothillranchtownecentre.com/" },
    ],
  },
  {
    slug: "laguna-niguel",
    name: "Laguna Niguel",
    kind: "City",
    metaTitle: "Laguna Niguel Remodeling: Established Hills and City Center Plans",
    metaDescription: "Laguna Niguel was among California's first master-planned communities. Learn about the approved City Center project and what to check for your own property.",
    headline: "Laguna Niguel: an early master plan, now building toward a more walkable center.",
    lede: "Planning for Laguna Niguel began in 1959, and the city describes it as one of the first master-planned communities in California. Its established hillside neighborhoods now sit alongside plans for a City Center.",
    population: 64355,
    medianIncome: 140452,
    milesToSNA: 14,
    milesToLAX: 50,
    character: {
      heading: "Planned from the start",
      paragraphs: [
        "Planning for a roughly 7,100-acre community began in 1959. Decades later, its hills and neighborhoods are well established.",
        "The Marketplace at Laguna Niguel and a number of other neighborhood centers provide shopping around the city.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "The city has approved the Laguna Niguel City Center project, which combines civic, commercial, and residential uses. As of September 2026, the city's project page listed a groundbreaking scheduled that month, with heavy construction expected in spring 2027. It is not completed construction, and it does not set the rules for projects elsewhere in the city.",
      checks: [
        { title: "Zoning", detail: "Confirm the zoning for the specific parcel." },
        { title: "Design standards", detail: "Review the city design standards that apply to the property type." },
        { title: "Association rules", detail: "Many neighborhoods have community association rules and review in addition to the city's." },
      ],
    },
    schools: "Capistrano Unified serves Laguna Niguel. School assignment depends on the property address.",
    transit: "The Laguna Niguel/Mission Viejo Metrolink station provides regional rail access, and OC Bus serves parts of the city.",
    sources: [
      { label: "Census QuickFacts: Laguna Niguel", href: "https://www.census.gov/quickfacts/fact/table/lagunaniguelcitycalifornia/INC110224" },
      { label: "City of Laguna Niguel: History", href: "https://www.cityoflagunaniguel.org/388/History" },
      { label: "City of Laguna Niguel: City Center", href: "https://www.cityoflagunaniguel.org/1213/Laguna-Niguel-City-Center" },
      { label: "City of Laguna Niguel: Sign Regulations (commercial centers)", href: "https://www.cityoflagunaniguel.org/1653/Sign-Regulations" },
    ],
  },
  {
    slug: "laguna-hills",
    name: "Laguna Hills",
    kind: "City",
    metaTitle: "Laguna Hills Remodeling: Nellie Gail Ranch and Village Plans",
    metaDescription: "Laguna Hills pairs estate-scale Nellie Gail Ranch with redevelopment plans for the former mall site. See what to verify before planning a home project.",
    headline: "Laguna Hills: estate lots in Nellie Gail Ranch and a former mall in redevelopment planning.",
    lede: "Laguna Hills covers a lot of ground for its size, from the equestrian setting of Nellie Gail Ranch to the Village at Laguna Hills project on the former Laguna Hills Mall site.",
    population: 31374,
    medianIncome: 128851,
    milesToSNA: 11,
    milesToLAX: 48,
    character: {
      heading: "Estate lots and a changing commercial core",
      paragraphs: [
        "Nellie Gail Ranch gives Laguna Hills an estate-scale, equestrian setting with a mix of tract and custom homes.",
        "The former Laguna Hills Mall site is the subject of the Village at Laguna Hills mixed-use redevelopment project. The city approved its entitlements in 2022, and a modified development program was under city review in 2026. Laguna Hills Plaza serves local shopping, and The Shops at Mission Viejo are nearby.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "Rules for a house in Nellie Gail Ranch are not the same as the entitlements for the former mall site. Start from the property you own.",
      checks: [
        { title: "Lot and neighborhood standards", detail: "Residential lot standards in Nellie Gail Ranch differ from other parts of the city. Confirm what applies to your parcel." },
        { title: "Association review", detail: "Check whether a community association reviews exterior or site work." },
        { title: "Redevelopment status", detail: "If the former mall site matters to your plans, read the city's current project documents for the latest hearing outcome. Proposed or approved phases are not the same as completed construction." },
      ],
    },
    schools: "Saddleback Valley Unified serves Laguna Hills. School assignment depends on the property address.",
    transit: "OC Bus serves parts of the city. Regional rail requires travel to a station outside Laguna Hills.",
    sources: [
      { label: "Census QuickFacts: Laguna Hills", href: "https://www.census.gov/quickfacts/fact/table/lagunahillscitycalifornia/INC110224" },
      { label: "City of Laguna Hills: General Plan", href: "https://lagunahillsca.gov/DocumentCenter/View/133/Laguna-Hills-General-Plan" },
      { label: "City of Laguna Hills: Village at Laguna Hills project documents", href: "https://lagunahillsca.gov/176/Village-at-Laguna-Hills-Project-Document" },
      { label: "City of Laguna Hills: Planning & Development Projects", href: "https://lagunahillsca.gov/566/Planning-Development-Projects" },
    ],
  },
  {
    slug: "laguna-beach",
    name: "Laguna Beach",
    kind: "City",
    metaTitle: "Laguna Beach Remodeling: Design Review and Coastal Planning",
    metaDescription: "Galleries, coves, and hillside streets make Laguna Beach unique. Learn why zoning, design review, and coastal rules deserve attention before drawings begin.",
    headline: "Laguna Beach: a coastal village where site-specific review comes first.",
    lede: "Galleries, coves, a walkable downtown village, and steep hillside neighborhoods make Laguna Beach one of the most varied settings on the coast. Research into the site's rules belongs before construction drawings, not after.",
    population: 23032,
    medianIncome: 143843,
    milesToSNA: 11,
    milesToLAX: 46,
    character: {
      heading: "Coves, galleries, and hillside streets",
      paragraphs: [
        "Laguna Beach combines a downtown village, art galleries, a string of coves, and hillside neighborhoods, so two properties a few blocks apart can have very different settings.",
        "Downtown boutiques and galleries, together with the HIP (Historic and Interesting Places) district, are the town's distinctive shopping areas.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "The city points applicants to zoning, specific plans, the General Plan, and the Local Coastal Program to identify design requirements. Doing that research before construction drawings are prepared can save a redesign.",
      checks: [
        { title: "Zoning and specific plans", detail: "Confirm the parcel's zoning and whether a specific plan covers it." },
        { title: "General Plan and Local Coastal Program", detail: "Review both documents for policies that affect the site." },
        { title: "Design review", detail: "Depending on the parcel and the proposal, design review may apply." },
        { title: "Coastal development permit", detail: "Some projects may need a coastal development permit or other approvals. Topography and coastal location make site-specific review especially important." },
      ],
    },
    schools: "Laguna Beach Unified serves the city. School assignment depends on the property address; the district publishes its boundaries.",
    transit: "A local trolley and OC Bus connect parts of the coast. Regional rail requires travel outside Laguna Beach.",
    sources: [
      { label: "Census QuickFacts: Laguna Beach", href: "https://www.census.gov/quickfacts/fact/table/lagunabeachcitycalifornia/INC110224" },
      { label: "City of Laguna Beach: Design Review Process", href: "https://www.lagunabeachcity.net/government/departments/community-development/planning/design-review-process" },
      { label: "Visit Laguna Beach: Shopping", href: "https://www.visitlagunabeach.com/things-to-do/shopping/" },
      { label: "Laguna Beach Unified: School Boundaries", href: "https://www.lbusd.org/enrollment/school-boundaries" },
    ],
  },
  {
    slug: "aliso-viejo",
    name: "Aliso Viejo",
    kind: "City",
    metaTitle: "Aliso Viejo Remodeling: Planning a Project in a Master-Planned City",
    metaDescription: "Aliso Viejo was planned with neighborhoods, parks, offices, and retail. See how city planning review works and which school districts serve the city.",
    headline: "Aliso Viejo: a city planned as a whole, from neighborhoods to the town center.",
    lede: "Orange County approved Aliso Viejo's master plan in 1979, and the first homes were offered for sale in 1982. Neighborhoods, parks, schools, offices, and retail were all part of the original design.",
    population: 52176,
    medianIncome: 142439,
    milesToSNA: 10,
    milesToLAX: 46,
    character: {
      heading: "A complete community on paper first",
      paragraphs: [
        "Aliso Viejo was planned from the outset to include residential neighborhoods, parks, schools, offices, and retail.",
        "Aliso Viejo Town Center provides shopping, dining, and entertainment. The Commons at Aliso Viejo Town Center shows how an established retail property can be reinvested in.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "For many projects, the city requires Planning Department approval before plans are submitted to the Building Department.",
      checks: [
        { title: "Planning review first", detail: "Ask whether the project needs a zoning compliance or planning approval before the building-plan submittal." },
        { title: "Residential vs. commercial", detail: "Residential and commercial sites raise different considerations. Confirm which standards apply to the property." },
        { title: "Association standards", detail: "Many neighborhoods also have community association rules." },
      ],
    },
    schools: "Parts of Aliso Viejo are in Capistrano Unified and parts are in Saddleback Valley Unified. School assignment depends on the property address.",
    transit: "OC Bus serves the city. Regional rail is reached through neighboring communities.",
    sources: [
      { label: "Census QuickFacts: Aliso Viejo", href: "https://www.census.gov/quickfacts/fact/table/alisoviejocitycalifornia/INC110224" },
      { label: "City of Aliso Viejo: About Aliso Viejo", href: "https://www.avcity.org/303/About-Aliso-Viejo" },
      { label: "City of Aliso Viejo: Planning Services", href: "https://avcity.org/205/Planning-Services" },
      { label: "City of Aliso Viejo: The Commons", href: "https://avcity.org/399/The-Commons" },
    ],
  },
  {
    slug: "mission-viejo",
    name: "Mission Viejo",
    kind: "City",
    metaTitle: "Mission Viejo Remodeling: Mature Homes, ADU Resources",
    metaDescription: "Mission Viejo's mature neighborhoods make home updates and ADUs common topics. See the city's ADU guide and preapproved plans, and what still needs review.",
    headline: "Mission Viejo: mature neighborhoods where adapting a home is a common conversation.",
    lede: "Mission Viejo is an established master-planned city shaped by mature neighborhoods, parks, trails, and Lake Mission Viejo. With so much of the housing stock well settled, reinvesting in an existing home is a natural topic.",
    image: { src: "/mission vijo lake.jpeg", alt: "Lake Mission Viejo with homes along the shoreline", position: "center 60%" },
    population: 93653,
    medianIncome: 136123,
    milesToSNA: 13,
    milesToLAX: 49,
    character: {
      heading: "An established planned city",
      paragraphs: [
        "Mission Viejo's neighborhoods, parks, and trails have had decades to mature, and Lake Mission Viejo remains a signature feature.",
        "The Shops at Mission Viejo are a major South County retail destination.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "The city offers an accessory dwelling unit (ADU) reference guide and a preapproved ADU plans program. These are resources, not automatic permission.",
      checks: [
        { title: "ADU eligibility", detail: "Whether an ADU works depends on the parcel. Review the city's guide against your lot." },
        { title: "Preapproved plans", detail: "Preapproved plans can simplify design, but permits are still required and site conditions still matter." },
        { title: "Association rules", detail: "Check any community association standards for exterior changes." },
      ],
    },
    schools: "Depending on the address, public schools may be in Saddleback Valley Unified or Capistrano Unified. Confirm with the district.",
    transit: "The Laguna Niguel/Mission Viejo Metrolink station serves the area, and OC Bus has connections in the city.",
    sources: [
      { label: "Census QuickFacts: Mission Viejo", href: "https://www.census.gov/quickfacts/fact/table/missionviejocitycalifornia/INC110224" },
      { label: "City of Mission Viejo: Housing and ADU resources", href: "https://www.missionviejo.gov/housing" },
      { label: "The Shops at Mission Viejo", href: "https://www.simon.com/mall/the-shops-at-mission-viejo" },
      METROLINK,
    ],
  },
  {
    slug: "dana-point",
    name: "Dana Point",
    kind: "City",
    metaTitle: "Dana Point Remodeling: Harbor, Lantern District and Coastal Plans",
    metaDescription: "Dana Point's harbor, Lantern District, Headlands, and Capistrano Beach each have their own planning context. See which city plans to check for your property.",
    headline: "Dana Point: four distinct coastal areas, each with its own planning context.",
    lede: "The harbor, the Lantern District, the Headlands, and Capistrano Beach each look and feel different. The city's planning materials are organized much the same way, so a property's location decides which rules to read.",
    population: 33107,
    medianIncome: 141520,
    milesToSNA: 17,
    milesToLAX: 52,
    character: {
      heading: "Harbor, village, headland, beach",
      paragraphs: [
        "Dana Point includes the harbor, the Lantern District, the Headlands, and Capistrano Beach, each with a different physical character.",
        "Harbor shops and restaurants create a waterfront destination, while the Lantern District offers a walkable area for shopping and dining.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "City planning materials include a coastal zone boundary map, design guidance, harbor district regulations, and the Headlands Development & Conservation Plan. The Harbor Revitalization Plan and the Lantern District Town Center Plan cover different places.",
      checks: [
        { title: "Coastal zone", detail: "Check the city's coastal zone boundary map for the property." },
        { title: "Area plans", detail: "Confirm whether the property falls under the harbor, Lantern District, or Headlands planning documents, or none of them." },
        { title: "Design guidance", detail: "Review the city's design guidance for the property type and location." },
      ],
    },
    schools: "Capistrano Unified serves Dana Point. School assignment depends on the property address.",
    transit: "OC Bus connects parts of the city. The nearest regional rail options are in San Juan Capistrano and San Clemente.",
    sources: [
      { label: "Census QuickFacts: Dana Point", href: "https://www.census.gov/quickfacts/fact/table/danapointcitycalifornia/INC110224" },
      { label: "City of Dana Point: Harbor Revitalization", href: "https://www.danapoint.org/City-Government/Community-Development/Planning/Long-Range-Planning/Harbor-Revitalization" },
      { label: "City of Dana Point: Lantern District Town Center", href: "https://www.danapoint.org/City-Government/Community-Development/Planning/Long-Range-Planning/Lantern-District-Town-Center" },
      { label: "City of Dana Point: Planning Documents", href: "https://www.danapoint.org/City-Government/Community-Development/Planning/Planning-Documents" },
    ],
  },
  {
    slug: "ladera-ranch",
    name: "Ladera Ranch",
    kind: "Unincorporated community",
    metaTitle: "Ladera Ranch Remodeling: Villages, County Rules, HOA Standards",
    metaDescription: "Ladera Ranch is an unincorporated planned community of residential villages. See why county documents and association standards are checked parcel by parcel.",
    headline: "Ladera Ranch: a village-based planned community under county jurisdiction.",
    lede: "Ladera Ranch is an unincorporated planned community organized around residential villages and shared amenities. Requirements are not necessarily the same from one village to the next.",
    population: 26170,
    medianIncome: 184458,
    milesToSNA: 16,
    milesToLAX: 52,
    character: {
      heading: "Organized around villages",
      paragraphs: [
        "Ladera Ranch is built as a set of residential villages connected by shared amenities.",
        "Bridgepark Plaza, Mercantile East, Mercantile West, and Terrace Shops provide neighborhood shopping and dining.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "Because Ladera Ranch is unincorporated, the County of Orange maintains its planned-community documents, including the planned community program and alternative development standards.",
      checks: [
        { title: "County requirements for the parcel", detail: "Check the county's Ladera Ranch planned-community documents for the specific parcel." },
        { title: "Community association standards", detail: "Confirm which association standards and review apply." },
        { title: "Do not generalize", detail: "The same requirements do not necessarily apply throughout Ladera Ranch. Verify by address." },
      ],
    },
    schools: "Ladera Ranch is within Capistrano Unified. School assignment depends on the property address.",
    transit: "Check OC Bus for a connection near a specific property. Regional rail requires travel to a nearby city.",
    sources: [
      { label: "Census QuickFacts: Ladera Ranch CDP", href: "https://www.census.gov/quickfacts/fact/table/laderaranchcdpcalifornia/INC110224" },
      { label: "OC Development Services: Ladera Ranch and Ranch Plan documents", href: "https://pwds.oc.gov/service-areas/oc-development-services/land-development/ranch-plan-documents" },
      { label: "Shop & Dine Ladera Ranch", href: "https://www.shopdineladeraranch.com/" },
      { label: "Capistrano Unified School District", href: "https://www.capousd.org/District/Our-District/" },
    ],
  },
  {
    slug: "rancho-mission-viejo",
    name: "Rancho Mission Viejo",
    kind: "Unincorporated community",
    metaTitle: "Rancho Mission Viejo Projects: Ranch Plan Villages and County Rules",
    metaDescription: "Rancho Mission Viejo is a developing ranch community with villages like Sendero, Esencia, and Rienda. Learn how Ranch Plan documents and tract standards apply.",
    headline: "Rancho Mission Viejo: a ranch community still taking shape.",
    lede: "This unincorporated, developing community includes the villages of Sendero, Esencia, and Rienda. The tract, the phase, and the association all shape what applies to a home.",
    population: 10378,
    medianIncome: 192813,
    milesToSNA: 21,
    milesToLAX: 57,
    character: {
      heading: "A ranch plan in progress",
      paragraphs: [
        "Orange County describes the wider Ranch Plan as projected to have a total of 14,000 dwelling units along with approximately 17,000 acres of open space. Those are plan figures, not counts of completed homes.",
        "Villages include Sendero, Esencia, and Rienda. Sendero Marketplace provides local shopping and dining.",
      ],
    },
    planning: {
      heading: "What to check before a project",
      intro: "County planned-community documents, area and subarea plans, and development checklists govern different parts of the Ranch Plan.",
      checks: [
        { title: "Tract and phase", detail: "Identify the property's tract and phase, then find the plan documents that cover it." },
        { title: "Association standards", detail: "Confirm the applicable association standards and review process." },
        { title: "Community-scale systems", detail: "County documents address runoff, infrastructure, and fire protection at the community scale. Ask how those affect your specific lot." },
      ],
    },
    schools: "Rancho Mission Viejo is within Capistrano Unified. School assignment depends on the property address.",
    transit: "Check OC Bus for current service. San Juan Capistrano's station is the nearest regional rail option, reached by road.",
    sources: [
      { label: "Census QuickFacts: Rancho Mission Viejo CDP", href: "https://www.census.gov/quickfacts/fact/table/ranchomissionviejocdpcalifornia/INC110224" },
      { label: "OC Development Services: Ranch Plan overview", href: "https://pwds.oc.gov/service-areas/oc-development-services/planning-development/land-development/ranch-plan-planned" },
      { label: "OC Development Services: Ranch Plan documents", href: "https://pwds.oc.gov/service-areas/oc-development-services/land-development/ranch-plan-documents" },
      { label: "Rancho Mission Viejo: FAQ", href: "https://www.ranchomissionviejo.com/faq" },
    ],
  },
];

export function getMarket(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}
