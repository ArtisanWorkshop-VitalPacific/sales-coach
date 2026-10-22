# Content registry

Every content id in the library. Cross-references must use these ids exactly.
Add a new id here before creating its file.

## Personas (12) — `library/personas/<id>.yaml`

| id | Who | Real concern (hidden) | Decision maker |
| --- | --- | --- | --- |
| margaret-retiree | Margaret Ellis, 71, retired school secretary, widowed, fixed income, cat named Biscuit | Afraid of draining savings she needs to live on | self |
| devin-researcher | Devin Brooks, 34, product manager, researched everything online, confident and often wrong | Afraid of being taken advantage of because he is not in the trade | self |
| ruiz-couple | Carlos Ruiz, 44, and Elena Ruiz, 42, (secondary: Elena). Carlos wants cheapest, Elena wants it done right once. Carlos's brother-in-law is a plumber | Carlos: money is tight after a car repair; Elena: tired of things breaking | joint |
| rick-landlord | Rick Hammond, 58, owns six rentals, tenant has no hot water, price shopper, has a handyman | Margins and a tenant who threatens to withhold rent | landlord |
| tasha-burned | Tasha Greene, 45, ER nurse on night shifts, overcharged by a previous company | Being lied to again | self |
| brian-today | Brian Walsh, 39, sales director, impatient, guests arriving this weekend, interrupts with "how much" | Losing time and looking bad in front of guests | self |
| rosa-spanish | Rosa Delgado, 56, speaks Spanish at home, some English, her daughter usually helps with these things | Agreeing to something she cannot fully verify | self |
| morgan-first-home | Kayla Morgan, 29, and Josh Morgan, 30, (secondary: Josh). First home, bought last year, savings drained by the down payment | Making an expensive first-homeowner mistake | joint |
| paul-engineer | Paul Lindqvist, 63, retired aerospace engineer, wants specs and data, catches false claims | Being talked down to; wants to be treated as competent | self |
| jen-busy-parent | Jen Kowalski, 37, two kids under six, works from home, phone keeps ringing | No bandwidth; wants one recommendation she can trust, fast | joint |
| greg-selling | Greg Thompson, 52, selling the house in about two years | Putting money into a house he will not enjoy | self |
| linda-warranty | Linda Hartley, 66, has a home warranty and expects it to cover everything | Paying twice for something she thinks she already paid for | self |

## Objection moves (40) — `library/moves/objections/<id>.yaml`

**price (8):** too-expensive, can-you-do-better, just-the-cheap-fix, what-am-i-paying-for, didnt-budget-for-this, quoted-less-on-the-phone, charge-me-hourly, paid-less-last-time

**timing (6):** need-to-think-about-it, talk-to-my-spouse, can-it-wait, next-paycheck, let-me-call-you-back, ask-my-son

**trust (6):** you-always-upsell, how-do-i-know-its-broken, last-company-ripped-me-off, are-you-on-commission, show-me-in-writing, bad-review-online

**competition (5):** need-three-bids, brother-in-law-plumber, found-it-cheaper, big-box-install, handyman-can-do-it

**scope (6):** just-repair-it, do-i-need-the-code-stuff, selling-soon, ill-do-part-myself, bigger-than-needed, only-fix-what-i-called-for

**financing (4):** dont-do-financing, whats-the-catch, monthly-still-too-much, credit-is-bad

**membership (5):** memberships-are-a-scam, dont-need-maintenance, home-warranty-covers-it, what-do-i-actually-get, ill-just-call-when-it-breaks

## Behavior moves (20) — `library/moves/behaviors/<id>.yaml`

**silence:** silence-after-price, thinks-out-loud, minimal-responses

**disruption:** interrupts-how-much, phone-call-hold-on, half-listening, spouse-walks-in, background-chaos

**confusion:** mishears-the-price, mixes-up-terms, repeats-answered-objection

**misplaced-confidence:** neighbor-said, watched-a-video, i-know-what-it-is

**probe:** tests-your-honesty, would-you-do-this, catches-false-claim

**intensity:** goes-cold, angry-about-last-company, quiet-money-worry

## Scenarios (30) — `library/scenarios/<id>.yaml`

| id | Job | Persona | Difficulty |
| --- | --- | --- | --- |
| wh-tank-no-hot-water | 12-year gas tank leaking, no hot water | margaret-retiree | 2 |
| wh-tank-landlord-tenant | Rental unit tank failed, tenant waiting | rick-landlord | 3 |
| wh-tankless-upgrade-question | Tank replacement, customer asks about tankless | devin-researcher | 3 |
| wh-repair-or-replace-9yr | 9-year tank, failed thermocouple; repair is honest | tasha-burned | 3 |
| wh-heat-pump-rebate | Electric tank failing, heat pump with rebates | paul-engineer | 4 |
| wh-warranty-claim-denied | Warranty will not cover code upgrades | linda-warranty | 3 |
| wh-first-home-rumbling | Sediment rumbling, 8-year tank, flush or replace | morgan-first-home | 2 |
| wh-tankless-descale | Tankless error code, descale and membership | brian-today | 2 |
| drain-kitchen-recurring | Recurring kitchen clog, hydro jet and camera | jen-busy-parent | 2 |
| drain-main-line-roots | Main line backup, roots on camera, line repair | ruiz-couple | 4 |
| drain-simple-snake | Bathroom sink clog, membership offer | margaret-retiree | 1 |
| sewer-camera-before-sale | Pre-sale camera finds a belly in the line | greg-selling | 3 |
| slab-leak-detection | High water bill, slab leak, reroute or spot repair | tasha-burned | 4 |
| repipe-galvanized | 1960s galvanized, low pressure, repipe | paul-engineer | 5 |
| prv-high-pressure | 110 psi, failing pressure regulator | devin-researcher | 2 |
| toilet-running-old | Running 25-year-old toilet, repair or replace | linda-warranty | 1 |
| faucet-install-bad-valves | Customer-supplied faucet, failing shutoffs found | brian-today | 1 |
| hard-water-softener | Scale buildup; softener question with upsell risk | morgan-first-home | 3 |
| drinking-water-filtration | Customer asks about drinking water filtration | rosa-spanish | 2 |
| gas-smell-flex-line | Gas smell near the water heater, corroded flex line | margaret-retiree | 3 |
| disposal-jammed-old | Old jammed garbage disposal | jen-busy-parent | 1 |
| main-shutoff-seized | Main shutoff seized, found during visit | greg-selling | 2 |
| wh-code-upgrades-rental | Replacement needs expansion tank and straps | rick-landlord | 3 |
| maintenance-visit-anode | Membership tune-up finds depleted anode | linda-warranty | 2 |
| second-opinion-quote | Customer holds a competitor's lower quote | devin-researcher | 4 |
| burst-pipe-after-hours | Burst pipe at night, stressed customer | brian-today | 3 |
| remodel-rough-in | Bathroom remodel plumbing relocation | ruiz-couple | 4 |
| wh-replacement-spanish | Water heater replacement, entirely in Spanish | rosa-spanish | 3 |
| tank-vs-tankless-family | Family of five choosing tank or tankless | ruiz-couple | 3 |
| hydro-jet-rental | Rental drain, hydro jet versus snake | rick-landlord | 2 |

## Drills (20) — `library/drills/<id>.yaml`

| order | id | Moment | Stage |
| --- | --- | --- | --- |
| 1 | first-thirty-seconds | The first 30 seconds at the door | door |
| 2 | five-discovery-questions | Five discovery questions | discovery |
| 3 | explain-the-finding | Explaining a finding in plain language | findings |
| 4 | show-what-you-found | Showing what you found | findings |
| 5 | three-options | Three options tied to what they told you | options |
| 6 | say-the-price | Saying the price without flinching | price |
| 7 | hold-the-silence | The silence after price | price |
| 8 | three-bids | "I need three bids" | objections |
| 9 | the-spouse-stall | "Let me talk to my wife" | objections |
| 10 | the-cheap-fix | "Just do the cheap fix" | objections |
| 11 | the-relative-plumber | "My brother-in-law is a plumber" | objections |
| 12 | monthly-number | Financing as a monthly number | close |
| 13 | membership-ask | The membership ask | close |
| 14 | ask-for-the-decision | Asking for the decision | close |
| 15 | leave-well-on-a-no | Leaving well on a no | close |
| 16 | correct-without-condescending | Correcting misplaced confidence | objections |
| 17 | come-back-from-a-distraction | Re-engaging after a distraction | recovery |
| 18 | bring-in-the-second-decision-maker | Bringing in the second decision-maker | recovery |
| 19 | your-own-house | "Would you do this in your own house?" | objections |
| 20 | catch-the-detail | Catching and using a dropped detail | discovery |

## Rubric — `library/rubric/base.yaml`

Ten skills: frame, discovery, findings, options, price, objections, listening, close, membership-financing, integrity.

## Companies — `library/companies/<id>.yaml`

| id | Company |
| --- | --- |
| gardner-plumbing | Gardner Plumbing Co., Murrieta |
| sos-plumbing-air | SOS Plumbing and Air (Water Heater SOS), Lake Elsinore |
| demo-company | Summit Plumbing & Air, a fictional company used in demo mode |
