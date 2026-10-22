# Test bench: scripted customers

Content 0.1.0+31dbcce44e3f, 4 scenario(s), 1 drill(s). Difficulties 2, 4, seeds 101, 138, 175, 212, 249, 286. 204 calls in 1.0s. Generated 2026-10-22T08:54:48.987Z.

**Result: FAIL.** 3 hard violation(s).

## Headline

| Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| expert | 48 | 21% | 29% | 50% | 78.6 | 79.6 | silence-after-price ×42, minimal-responses ×22, thinks-out-loud ×20, watched-a-video ×20, mishears-the-price ×16, i-know-what-it-is ×14, background-chaos ×14, phone-call-hold-on ×14, just-the-cheap-fix ×12, can-you-do-better ×12, too-expensive ×12, tests-your-honesty ×6, mixes-up-terms ×4, neighbor-said ×4, need-three-bids ×4, interrupts-how-much ×4 | 0 |
| solid | 48 | 29% | 65% | 6% | 71.3 | 88.7 | silence-after-price ×44, just-the-cheap-fix ×24, can-you-do-better ×20, watched-a-video ×14, mishears-the-price ×12, too-expensive ×12, need-three-bids ×12, phone-call-hold-on ×10, minimal-responses ×8, background-chaos ×6, tests-your-honesty ×4, i-know-what-it-is ×4, neighbor-said ×4, mixes-up-terms ×2, thinks-out-loud ×2 | 0 |
| novice | 48 | 0% | 0% | 100% | 33.0 | 5.3 | i-know-what-it-is ×29, silence-after-price ×29, too-expensive ×29, just-the-cheap-fix ×25, can-you-do-better ×16, need-three-bids ×16, goes-cold ×5, angry-about-last-company ×4, mishears-the-price ×3, thinks-out-loud ×2 | 0 |

## Scenarios

| Scenario | Difficulty | Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| wh-code-upgrades-rental | 2 | expert | 6 | 83% | 17% | 0% | 80.3 | 63.8 | silence-after-price ×5, thinks-out-loud ×5, minimal-responses ×4, background-chaos ×3, phone-call-hold-on ×3, i-know-what-it-is ×2, just-the-cheap-fix ×2, can-you-do-better ×2, watched-a-video ×1, mishears-the-price ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 2 | solid | 6 | 100% | 0% | 0% | 76.7 | 100.0 | silence-after-price ×6, just-the-cheap-fix ×6, can-you-do-better ×5, minimal-responses ×2, mishears-the-price ×2, phone-call-hold-on ×2, background-chaos ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 2 | novice | 6 | 0% | 0% | 100% | 36.0 | 0.0 | i-know-what-it-is ×4 | 0 |
| wh-code-upgrades-rental | 4 | expert | 6 | 83% | 17% | 0% | 80.3 | 63.8 | silence-after-price ×5, thinks-out-loud ×5, minimal-responses ×4, background-chaos ×3, phone-call-hold-on ×3, i-know-what-it-is ×2, just-the-cheap-fix ×2, can-you-do-better ×2, watched-a-video ×1, mishears-the-price ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 4 | solid | 6 | 100% | 0% | 0% | 76.2 | 100.0 | silence-after-price ×6, just-the-cheap-fix ×6, can-you-do-better ×5, mishears-the-price ×2, phone-call-hold-on ×2, i-know-what-it-is ×1, background-chaos ×1, neighbor-said ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 4 | novice | 6 | 0% | 0% | 100% | 35.7 | 0.0 | i-know-what-it-is ×4, angry-about-last-company ×2 | 0 |
| wh-tank-landlord-tenant | 2 | expert | 6 | 0% | 0% | 100% | 76.2 | 75.8 | silence-after-price ×5, minimal-responses ×4, can-you-do-better ×4, just-the-cheap-fix ×4, mishears-the-price ×3, background-chaos ×3, thinks-out-loud ×2, phone-call-hold-on ×2, i-know-what-it-is ×1, watched-a-video ×1, tests-your-honesty ×1 | 0 |
| wh-tank-landlord-tenant | 2 | solid | 6 | 0% | 100% | 0% | 78.5 | 100.0 | silence-after-price ×6, just-the-cheap-fix ×6, can-you-do-better ×5, minimal-responses ×2, mishears-the-price ×2, phone-call-hold-on ×2, background-chaos ×1, tests-your-honesty ×1 | 0 |
| wh-tank-landlord-tenant | 2 | novice | 6 | 0% | 0% | 100% | 31.7 | 6.8 | just-the-cheap-fix ×13, can-you-do-better ×8, silence-after-price ×4, i-know-what-it-is ×4, goes-cold ×3, mishears-the-price ×2 | 0 |
| wh-tank-landlord-tenant | 4 | expert | 6 | 0% | 0% | 100% | 76.2 | 74.7 | silence-after-price ×5, minimal-responses ×4, can-you-do-better ×4, just-the-cheap-fix ×4, mishears-the-price ×3, background-chaos ×3, thinks-out-loud ×2, phone-call-hold-on ×2, i-know-what-it-is ×1, watched-a-video ×1, tests-your-honesty ×1 | 0 |
| wh-tank-landlord-tenant | 4 | solid | 6 | 0% | 100% | 0% | 78.2 | 100.0 | silence-after-price ×6, just-the-cheap-fix ×6, can-you-do-better ×5, mishears-the-price ×2, phone-call-hold-on ×2, i-know-what-it-is ×1, background-chaos ×1, neighbor-said ×1, tests-your-honesty ×1 | 0 |
| wh-tank-landlord-tenant | 4 | novice | 6 | 0% | 0% | 100% | 32.8 | 2.2 | just-the-cheap-fix ×12, can-you-do-better ×8, silence-after-price ×5, i-know-what-it-is ×4, goes-cold ×2, angry-about-last-company ×2, mishears-the-price ×1 | 0 |
| wh-tank-no-hot-water | 2 | expert | 6 | 0% | 100% | 0% | 90.8 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×4, i-know-what-it-is ×2, minimal-responses ×2, mixes-up-terms ×2, watched-a-video ×2, thinks-out-loud ×1, phone-call-hold-on ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| wh-tank-no-hot-water | 2 | solid | 6 | 0% | 100% | 0% | 74.0 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| wh-tank-no-hot-water | 2 | novice | 6 | 0% | 0% | 100% | 29.8 | 10.8 | too-expensive ×16, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-tank-no-hot-water | 4 | expert | 6 | 0% | 100% | 0% | 90.8 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×4, i-know-what-it-is ×2, minimal-responses ×2, mixes-up-terms ×2, watched-a-video ×2, thinks-out-loud ×1, phone-call-hold-on ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| wh-tank-no-hot-water | 4 | solid | 6 | 0% | 100% | 0% | 74.0 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| wh-tank-no-hot-water | 4 | novice | 6 | 0% | 0% | 100% | 33.5 | 10.3 | too-expensive ×13, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-tankless-upgrade-question | 2 | expert | 6 | 0% | 0% | 100% | 67.2 | 82.0 | watched-a-video ×6, silence-after-price ×5, i-know-what-it-is ×2, need-three-bids ×2, interrupts-how-much ×2, thinks-out-loud ×2, neighbor-said ×1, phone-call-hold-on ×1, minimal-responses ×1, tests-your-honesty ×1 | 0 |
| wh-tankless-upgrade-question | 2 | solid | 6 | 33% | 50% | 17% | 56.3 | 59.5 | watched-a-video ×6, need-three-bids ×6, silence-after-price ×4, i-know-what-it-is ×1, minimal-responses ×1, thinks-out-loud ×1 | 0 |
| wh-tankless-upgrade-question | 2 | novice | 6 | 0% | 0% | 100% | 32.2 | 8.0 | need-three-bids ×8, silence-after-price ×4, i-know-what-it-is ×3, thinks-out-loud ×1 | 0 |
| wh-tankless-upgrade-question | 4 | expert | 6 | 0% | 0% | 100% | 67.2 | 76.5 | watched-a-video ×6, silence-after-price ×5, i-know-what-it-is ×2, need-three-bids ×2, interrupts-how-much ×2, thinks-out-loud ×2, neighbor-said ×1, phone-call-hold-on ×1, minimal-responses ×1, tests-your-honesty ×1 | 0 |
| wh-tankless-upgrade-question | 4 | solid | 6 | 0% | 67% | 33% | 56.5 | 50.0 | watched-a-video ×6, need-three-bids ×6, silence-after-price ×4, i-know-what-it-is ×1, minimal-responses ×1, thinks-out-loud ×1 | 0 |
| wh-tankless-upgrade-question | 4 | novice | 6 | 0% | 0% | 100% | 32.3 | 3.8 | need-three-bids ×8, silence-after-price ×4, i-know-what-it-is ×2, thinks-out-loud ×1 | 0 |

## Probes

`upsell`: an expert who also recommends one unjustified item. Must lower trust and never end in yes.
`pushy`: an expert who asks for the decision again and again with nothing new. Must never flip to yes.

| Scenario | Difficulty | Probe | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| wh-code-upgrades-rental | 2 | upsell | 3 | 33% | 0% | 67% | 70.7 | 28.0 | silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 1 |
| wh-code-upgrades-rental | 2 | pushy | 3 | 100% | 0% | 0% | 79.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 0 |
| wh-code-upgrades-rental | 4 | upsell | 3 | 33% | 0% | 67% | 73.3 | 43.0 | silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, just-the-cheap-fix ×1, can-you-do-better ×1, background-chaos ×1, phone-call-hold-on ×1 | 1 |
| wh-code-upgrades-rental | 4 | pushy | 3 | 100% | 0% | 0% | 79.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 0 |
| wh-tank-landlord-tenant | 2 | upsell | 3 | 0% | 0% | 100% | 74.7 | 53.7 | silence-after-price ×3, can-you-do-better ×3, just-the-cheap-fix ×3, minimal-responses ×2, mishears-the-price ×2, i-know-what-it-is ×1, thinks-out-loud ×1, background-chaos ×1 | 0 |
| wh-tank-landlord-tenant | 2 | pushy | 3 | 0% | 0% | 100% | 76.3 | 82.3 | silence-after-price ×3, minimal-responses ×2, mishears-the-price ×2, just-the-cheap-fix ×2, i-know-what-it-is ×1, thinks-out-loud ×1, can-you-do-better ×1, background-chaos ×1 | 0 |
| wh-tank-landlord-tenant | 4 | upsell | 3 | 0% | 0% | 100% | 74.7 | 51.0 | silence-after-price ×3, can-you-do-better ×3, just-the-cheap-fix ×3, minimal-responses ×2, mishears-the-price ×2, i-know-what-it-is ×1, thinks-out-loud ×1, background-chaos ×1 | 0 |
| wh-tank-landlord-tenant | 4 | pushy | 3 | 0% | 0% | 100% | 76.3 | 80.0 | silence-after-price ×3, minimal-responses ×2, mishears-the-price ×2, just-the-cheap-fix ×2, i-know-what-it-is ×1, thinks-out-loud ×1, can-you-do-better ×1, background-chaos ×1 | 0 |
| wh-tank-no-hot-water | 2 | upsell | 3 | 0% | 100% | 0% | 82.0 | 97.7 | silence-after-price ×3, too-expensive ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| wh-tank-no-hot-water | 2 | pushy | 3 | 0% | 0% | 100% | 59.0 | 48.0 | too-expensive ×4, silence-after-price ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| wh-tank-no-hot-water | 4 | upsell | 3 | 0% | 100% | 0% | 82.0 | 97.7 | silence-after-price ×3, too-expensive ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| wh-tank-no-hot-water | 4 | pushy | 3 | 0% | 0% | 100% | 59.0 | 48.0 | too-expensive ×5, silence-after-price ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| wh-tankless-upgrade-question | 2 | upsell | 3 | 0% | 0% | 100% | 66.7 | 61.7 | watched-a-video ×3, silence-after-price ×3, i-know-what-it-is ×2, need-three-bids ×2, interrupts-how-much ×1 | 0 |
| wh-tankless-upgrade-question | 2 | pushy | 3 | 0% | 0% | 100% | 66.7 | 82.3 | watched-a-video ×3, silence-after-price ×3, i-know-what-it-is ×2, need-three-bids ×2, interrupts-how-much ×1 | 0 |
| wh-tankless-upgrade-question | 4 | upsell | 3 | 0% | 0% | 100% | 66.7 | 56.0 | watched-a-video ×3, silence-after-price ×3, i-know-what-it-is ×2, need-three-bids ×2, interrupts-how-much ×1 | 0 |
| wh-tankless-upgrade-question | 4 | pushy | 3 | 0% | 0% | 100% | 66.7 | 76.7 | watched-a-video ×3, silence-after-price ×3, i-know-what-it-is ×2, need-three-bids ×2, interrupts-how-much ×1 | 0 |

## Drills

| Drill | Difficulty | Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hold-the-silence | 2 | expert | 2 | 0% | 100% | 0% | 77.0 | 100.0 | silence-after-price ×2, too-expensive ×2 | 0 |
| hold-the-silence | 2 | solid | 2 | 0% | 100% | 0% | 60.0 | 99.5 | silence-after-price ×2, too-expensive ×2 | 0 |
| hold-the-silence | 2 | novice | 2 | 0% | 0% | 100% | 27.5 | 8.5 | too-expensive ×7, silence-after-price ×2 | 0 |
| hold-the-silence | 4 | expert | 2 | 0% | 100% | 0% | 77.0 | 100.0 | silence-after-price ×2, too-expensive ×2 | 0 |
| hold-the-silence | 4 | solid | 2 | 0% | 100% | 0% | 60.0 | 94.5 | silence-after-price ×2, too-expensive ×2 | 0 |
| hold-the-silence | 4 | novice | 2 | 0% | 0% | 100% | 31.0 | 8.0 | too-expensive ×6, silence-after-price ×2 | 0 |

## Violations

### hard: expert-closes-more (1)

- expert yes 21% vs novice yes 0% overall (needs a gap of 30 points or more)

### hard: unneeded-work-no-yes (2)

- `wh-code-upgrades-rental d2 expert/upsell seed 138` customer said yes after "Upsizing to a 75-gallon tank"
- `wh-code-upgrades-rental d4 expert/upsell seed 138` customer said yes after "Upsizing to a 75-gallon tank"

### soft: expert-closes-more-per-scenario (6)

- `wh-tank-landlord-tenant d2` expert yes 0% vs novice yes 0%
- `wh-tank-landlord-tenant d4` expert yes 0% vs novice yes 0%
- `wh-tank-no-hot-water d2` expert yes 0% vs novice yes 0%
- `wh-tank-no-hot-water d4` expert yes 0% vs novice yes 0%
- `wh-tankless-upgrade-question d2` expert yes 0% vs novice yes 0%
- `wh-tankless-upgrade-question d4` expert yes 0% vs novice yes 0%

### soft: solid-in-between (1)

- `wh-tank-landlord-tenant d2` solid 78.5 not between novice 31.7 and expert 76.2

Hard: 3. Soft: 7.

## Sample calls

### wh-code-upgrades-rental d2 expert seed 101: yes, score 78, trust 53

- **CUSTOMER:** Yeah, you the plumber? Come on in. Tenants are at work, so it's just me. _(open)_
- **TECH:** Hi, I'm Sam from the plumbing company, thanks for having me. What I'll do is take a look, explain what I find in plain English, and show you some options before we do anything. Okay? _(set_frame, asked_open_question, explained_plainly)_
- **CUSTOMER:** I first noticed it a couple days ago. _(answer)_
- **TECH:** Tell me about what's been happening. When did it start? _(asked_open_question)_
- **CUSTOMER:** My guy Dale does most of my stuff. He's not licensed, but he's cheap and he shows up. _(answer)_
- **TECH:** Who lives here with you, and how do you use the water heater day to day? _(asked_open_question)_
- **CUSTOMER:** I ran a body shop for twenty-four years. I know what parts cost and I know what labor costs. _(answer)_
- **TECH:** So it sounds like you ran a body shop for twenty-four years. That must be frustrating. What matters most to you in how we fix this? _(asked_open_question, asked_follow_up, reflected_back, used_customer_detail)_
- **CUSTOMER:** Tenant's already texting me. Says he'll hold the rent if it's not fixed by tomorrow. _(answer)_
- **TECH:** How long are you planning to stay in the home? _(asked_open_question)_
- **CUSTOMER:** Insurance on my places went up almost forty percent this year. Everything's going up. _(answer)_
- **TECH:** Has another company been out for this before? How did that go? _(asked_open_question)_
- **CUSTOMER:** It's only a clog. Run your snake down there, that's all it needs. _(react: i-know-what-it-is)_
- **TECH:** That's a fair thought, and a lot of people hear that. Here's the thing: in this case, the tank is leaking at the base. It cannot be repaired and has to be replaced. _(corrected_respectfully)_
- **CUSTOMER:** Okay, I see it. What do we do? _(react)_
- **TECH:** Here's what I found, in plain English. The tank is leaking at the base. It cannot be repaired and has to be replaced. What that means is it won't get better on its own. I also noticed this: There is no expansion tank, and the house has a pressure regulator. The crust and drip stain on the relief valve show the pressure has been spiking every time the water heats. Code requires an expansion tank on the new install. I took a photo so you can see it. Does that make sense? _(asked_open_question, explained_plainly, checked_understanding, showed_evidence, used_customer_detail, addressed_concern)_
- **CUSTOMER:** Pretty normal, I’d say. Showers, laundry, dishes. _(answer)_
- **TECH:** You have two options. The first is 50-gallon standard gas, 6-year warranty, full code install, at $2,150, or about $55 a month. The second is 50-gallon gas, 10-year warranty, full code install, at $2,790, or about $72 a month. _(framed_monthly, stated_price, presented_options, justified_value, addressed_concern)_
- **CUSTOMER:** (silence) _(silence: silence-after-price, holds 6000ms)_
- **CUSTOMER:** Okay. Let me think about that for a second. _(react: silence-after-price)_
- **TECH:** Of those two options, since you mentioned okay, the first one I'd point you to is 50-gallon standard gas. It's $2,150 total, or about $55 a month. _(reflected_back, framed_monthly, stated_price, presented_options, tied_options_to_needs)_
- **CUSTOMER:** Hm. The longer warranty's nice, but then again, if we... _(react: thinks-out-loud, holds 3500ms)_
- **CUSTOMER:** So the basic one would get us by, and then later we could maybe... _(react: thinks-out-loud)_
- **TECH:** Before you decide anything, what is on your mind about all this? What would you want to know? _(asked_open_question, asked_about_concern, used_customer_detail)_
- **CUSTOMER:** Look, I clear maybe three hundred a month on this place after everything. One bad repair and I'm working for free all year. _(reveal)_
- **TECH:** Thank you for telling me that. That makes sense, and I'm glad you said it. To be honest with you, 50-gallon standard gas is a safe choice, and with financing it works out to about $55 a month, so you don't have to pull it from your savings all at once. _(reflected_back, acknowledged_feeling, framed_monthly, offered_financing, honest_answer, recommended_unneeded_work)_
- **CUSTOMER:** Wait, why would I need that? Nobody’s ever told me that before. _(react)_
- **TECH:** Would you like me to go ahead and get that scheduled? _(asked_follow_up, asked_for_decision)_
- **CUSTOMER:** All right, that makes sense. Go ahead with that one. _(agree)_
- **TECH:** Thank you. I'll write it up and get started right away. Take care.
- **CUSTOMER:** Okay. Take care. _(end)_

### wh-code-upgrades-rental d2 solid seed 101: yes, score 77, trust 100

- **CUSTOMER:** Yeah, you the plumber? Come on in. Tenants are at work, so it's just me. _(open)_
- **TECH:** Hi, this is Sam from the plumbing company. Where is the water heater? _(set_frame)_
- **CUSTOMER:** Not for this, no. _(answer)_
- **TECH:** Tell me about what's been happening. When did it start? _(asked_open_question)_
- **CUSTOMER:** My guy Dale does most of my stuff. He's not licensed, but he's cheap and he shows up. _(answer)_
- **TECH:** Is it leaking?
- **CUSTOMER:** I ran a body shop for twenty-four years. I know what parts cost and I know what labor costs. _(answer)_
- **TECH:** Here's what I found. The tank is leaking at the base. It cannot be repaired and has to be replaced. In other words, it needs to be taken care of. _(explained_plainly, used_customer_detail)_
- **CUSTOMER:** Can you say that in plain English? Tenant's already texting me. Says he'll hold the rent if it's not fixed by tomorrow. _(react)_
- **TECH:** You have two options. The first is 50-gallon standard gas, 6-year warranty, full code install, at $2,150. The second is 50-gallon gas, 10-year warranty, full code install, at $2,790. _(stated_price, presented_options, justified_value)_
- **CUSTOMER:** (silence) _(silence: silence-after-price, holds 6000ms)_
- **CUSTOMER:** Okay. Let me think about that for a second. _(react: silence-after-price)_
- **TECH:** The one most people go with is 50-gallon standard gas. It's $2,150. _(stated_price)_
- **CUSTOMER:** What's the bare minimum to get this working again? _(object: just-the-cheap-fix)_
- **TECH:** To be honest with you, that is a fair way to look at it. _(honest_answer, addressed_concern)_
- **CUSTOMER:** Come on, there's gotta be a little wiggle room in there. _(object: can-you-do-better)_
- **TECH:** That price includes parts and labor, the permit, haul away, and the warranty, 6 years of it. _(justified_value, new_angle, used_customer_detail, addressed_concern)_
- **CUSTOMER:** All right, that makes sense. _(react)_
- **TECH:** Would you like me to get started on that today? _(asked_for_decision)_
- **CUSTOMER:** Let me think about it. _(defer)_
- **TECH:** That makes sense. Can I ask what is on your mind? What would you want to know before deciding? _(asked_open_question, acknowledged_feeling, asked_about_concern, used_customer_detail, addressed_concern)_
- **CUSTOMER:** Look, I clear maybe three hundred a month on this place after everything. One bad repair and I'm working for free all year. _(reveal)_
- **TECH:** I understand. It works out to about $55 a month if that helps. _(acknowledged_feeling, framed_monthly, addressed_concern)_
- **CUSTOMER:** Hm. _(react)_
- **TECH:** Would you like me to go ahead and get that scheduled? _(asked_for_decision)_
- **CUSTOMER:** All right, that makes sense. Go ahead with that one. _(agree)_
- **TECH:** Thank you. I'll write it up and get started right away. Take care.
- **CUSTOMER:** Okay. Take care. _(end)_

### wh-code-upgrades-rental d2 novice seed 101: no, score 38, trust 0

- **CUSTOMER:** Yeah, you the plumber? Come on in. Tenants are at work, so it's just me. _(open)_
- **TECH:** Hey there. Show me the water heater.
- **CUSTOMER:** Okay. It’s this way. _(react)_
- **TECH:** Did you try turning it off and on?
- **CUSTOMER:** Mm-hm. Go ahead. _(answer)_
- **TECH:** Is it leaking?
- **CUSTOMER:** Tenant's already texting me. Says he'll hold the rent if it's not fixed by tomorrow. _(answer)_
- **TECH:** Yeah, so the tank is leaking at the base. It cannot be repaired and has to be replaced. Your anode rod is shot, there's sediment in the combustion chamber, and the T&P is weeping. _(used_jargon)_
- **CUSTOMER:** Sure, come on in. It’s right through here. _(react)_
- **TECH:** You have to replace it, it's the only option. I know it's a lot, unfortunately it's $2,550. But I can knock $200 off if you do it today. _(stated_price, presented_options, single_option_only, hedged_price, recommended_unneeded_work)_
- **CUSTOMER:** Hm. I just want what I actually need, okay? _(react)_
- **TECH:** Want me to get started? _(asked_for_decision)_
- **CUSTOMER:** No, I think I’m done for today. _(decline)_
- **TECH:** Okay, fine. Have a good day.
- **CUSTOMER:** All right. Thanks for coming by. _(end)_

### wh-code-upgrades-rental d2 expert/upsell seed 138: yes, score 70, trust 25

- **CUSTOMER:** Yeah, you the plumber? Come on in. Tenants are at work, so it's just me. _(open)_
- **TECH:** Hi, I'm Sam with the plumbing company. Before I touch anything, here's how I like to work: I'll take a look, show you what I find, and give you a few options. Sound good? _(set_frame, asked_open_question)_
- **CUSTOMER:** I first noticed it a couple days ago. _(answer)_
- **TECH:** Tell me about what's been happening. When did it start? _(asked_open_question)_
- **CUSTOMER:** My guy Dale does most of my stuff. He's not licensed, but he's cheap and he shows up. _(answer)_
- **TECH:** How many people are in the home, and what does a normal day of usage look like? _(asked_open_question)_
- **CUSTOMER:** I ran a body shop for twenty-four years. I know what parts cost and I know what labor costs. _(answer)_
- **TECH:** So it sounds like you ran a body shop for twenty-four years. That must be frustrating. What matters most to you in how we fix this? _(asked_open_question, asked_follow_up, reflected_back, used_customer_detail)_
- **CUSTOMER:** Tenant's already texting me. Says he'll hold the rent if it's not fixed by tomorrow. _(answer)_
- **TECH:** What are your plans for the house over the next few years? _(asked_open_question, used_customer_detail)_
- **CUSTOMER:** Okay. Got it. I've got six of these. I know every one of them down to the dollar. _(react: minimal-responses)_
- **TECH:** What questions do you have so far? Does that make sense? _(asked_open_question, checked_understanding, used_customer_detail)_
- **CUSTOMER:** Insurance on my places went up almost forty percent this year. Everything's going up. _(answer)_
- **TECH:** Has another company been out for this before? How did that go? _(asked_open_question)_
- **CUSTOMER:** It’s been acting up a little for a while, but it really went out yesterday. _(answer)_
- **TECH:** Here's what I found, in plain English. The tank is leaking at the base. It cannot be repaired and has to be replaced. What that means is it won't get better on its own. I also noticed this: There is no expansion tank, and the house has a pressure regulator. The crust and drip stain on the relief valve show the pressure has been spiking every time the water heats. Code requires an expansion tank on the new install. I took a photo so you can see it. Does that make sense? _(asked_open_question, explained_plainly, checked_understanding, showed_evidence, used_customer_detail, addressed_concern)_
- **CUSTOMER:** Honestly, it's the hard water. Everything in this house gets crusted up. _(react: i-know-what-it-is)_
- **TECH:** That's a fair thought, and a lot of people hear that. Here's the thing: in this case, the tank is leaking at the base. It cannot be repaired and has to be replaced. _(corrected_respectfully)_
- **CUSTOMER:** Okay, I see it. What do we do? _(react)_
- **TECH:** You have two options. The first is 50-gallon standard gas, 6-year warranty, full code install, at $2,150, or about $55 a month. The second is 50-gallon gas, 10-year warranty, full code install, at $2,790, or about $72 a month. _(framed_monthly, stated_price, presented_options, justified_value, addressed_concern)_
- **CUSTOMER:** Okay. So if we went with the second one, that would mean... _(react: thinks-out-loud, holds 3500ms)_
- **CUSTOMER:** So the cheaper one fixes it for now, but if it happens again, then... _(react: thinks-out-loud)_
- **TECH:** Of those two options, since you mentioned you see it, the first one I'd point you to is 50-gallon standard gas. It's $2,150 total, or about $55 a month. _(reflected_back, framed_monthly, stated_price, presented_options, tied_options_to_needs)_
- **CUSTOMER:** (silence) _(silence: silence-after-price, holds 6000ms)_
- **CUSTOMER:** Wow. _(react: silence-after-price)_
- **TECH:** While I'm here, I'd also recommend this: upsizing to a 75-gallon tank. _(recommended_unneeded_work)_
- **CUSTOMER:** That sounds like extra. Is that really necessary? _(react)_
- **TECH:** Before you decide anything, what is on your mind about all this? What would you want to know? _(asked_open_question, asked_about_concern, used_customer_detail)_
- **CUSTOMER:** Look, I clear maybe three hundred a month on this place after everything. One bad repair and I'm working for free all year. _(reveal)_
- **TECH:** Thank you for telling me that. That makes sense, and I'm glad you said it. To be honest with you, 50-gallon standard gas is a safe choice, and with financing it works out to about $55 a month, so you don't have to pull it from your savings all at once. _(reflected_back, acknowledged_feeling, framed_monthly, offered_financing, honest_answer, recommended_unneeded_work)_
- **CUSTOMER:** Wait, why would I need that? Nobody’s ever told me that before. _(react)_
- **TECH:** Would you like me to get started on that today? _(asked_follow_up, asked_for_decision)_
- **CUSTOMER:** Yeah, let’s go with that. _(agree)_
- **TECH:** Thank you. I'll write it up and get started right away. Take care.
- **CUSTOMER:** All right. Thanks for coming by. _(end)_
