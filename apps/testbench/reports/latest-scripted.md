# Test bench: scripted customers

Content 0.1.0+3c426235baa7, 14 scenario(s), 1 drill(s). Difficulties 2, 4, seeds 101, 138, 175, 212, 249, 286. 684 calls in 2.6s. Generated 2026-10-22T08:58:36.992Z.

**Result: FAIL.** 136 hard violation(s).

## Headline

| Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| expert | 168 | 61% | 17% | 21% | 84.1 | 98.5 | silence-after-price ×140, minimal-responses ×70, thinks-out-loud ×61, mishears-the-price ×56, watched-a-video ×46, neighbor-said ×42, too-expensive ×36, phone-call-hold-on ×34, i-know-what-it-is ×34, can-you-do-better ×34, background-chaos ×31, tests-your-honesty ×29, what-am-i-paying-for ×26, do-i-need-the-code-stuff ×26, found-it-cheaper ×24, need-three-bids ×24, handyman-can-do-it ×24, just-the-cheap-fix ×24, mixes-up-terms ×21, home-warranty-covers-it ×15, interrupts-how-much ×14, half-listening ×13, paid-less-last-time ×12, brother-in-law-plumber ×12, repeats-answered-objection ×11, how-do-i-know-its-broken ×4, last-company-ripped-me-off ×4, didnt-budget-for-this ×2, you-always-upsell ×2, bigger-than-needed ×2 | 460 |
| solid | 168 | 46% | 45% | 9% | 69.6 | 89.8 | silence-after-price ×142, mishears-the-price ×42, too-expensive ×36, neighbor-said ×33, can-you-do-better ×33, minimal-responses ×25, tests-your-honesty ×25, phone-call-hold-on ×24, watched-a-video ×24, do-i-need-the-code-stuff ×24, just-the-cheap-fix ×24, found-it-cheaper ×23, need-three-bids ×23, what-am-i-paying-for ×22, handyman-can-do-it ×22, background-chaos ×20, need-to-think-about-it ×15, home-warranty-covers-it ×14, brother-in-law-plumber ×12, last-company-ripped-me-off ×12, how-do-i-know-its-broken ×12, paid-less-last-time ×11, mixes-up-terms ×10, i-know-what-it-is ×10, monthly-still-too-much ×9, show-me-in-writing ×9, you-always-upsell ×8, can-it-wait ×6, half-listening ×6, thinks-out-loud ×6, didnt-budget-for-this ×6, spouse-walks-in ×4, interrupts-how-much ×4, repeats-answered-objection ×2 | 149 |
| novice | 168 | 0% | 0% | 100% | 30.7 | 5.9 | silence-after-price ×95, i-know-what-it-is ×94, too-expensive ×62, show-me-in-writing ×50, can-you-do-better ×50, goes-cold ×32, what-am-i-paying-for ×29, home-warranty-covers-it ×29, you-always-upsell ×24, found-it-cheaper ×23, just-the-cheap-fix ×22, last-company-ripped-me-off ×21, didnt-budget-for-this ×20, handyman-can-do-it ×19, angry-about-last-company ×15, need-three-bids ×12, how-do-i-know-its-broken ×10, do-i-need-the-code-stuff ×9, are-you-on-commission ×9, paid-less-last-time ×7, mishears-the-price ×7, thinks-out-loud ×4 | 78 |

## Scenarios

| Scenario | Difficulty | Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gas-smell-flex-line | 2 | expert | 6 | 100% | 0% | 0% | 74.3 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×4, repeats-answered-objection ×2, minimal-responses ×2, thinks-out-loud ×2, mixes-up-terms ×2, watched-a-video ×2, phone-call-hold-on ×1, neighbor-said ×1 | 36 |
| gas-smell-flex-line | 2 | solid | 6 | 100% | 0% | 0% | 65.3 | 85.2 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 6 |
| gas-smell-flex-line | 2 | novice | 6 | 0% | 0% | 100% | 29.8 | 10.8 | too-expensive ×16, silence-after-price ×6, i-know-what-it-is ×4 | 5 |
| gas-smell-flex-line | 4 | expert | 6 | 100% | 0% | 0% | 74.3 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×4, repeats-answered-objection ×2, minimal-responses ×2, thinks-out-loud ×2, mixes-up-terms ×2, watched-a-video ×2, phone-call-hold-on ×1, neighbor-said ×1 | 36 |
| gas-smell-flex-line | 4 | solid | 6 | 0% | 100% | 0% | 74.0 | 97.5 | silence-after-price ×6, too-expensive ×6, can-it-wait ×6, need-to-think-about-it ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| gas-smell-flex-line | 4 | novice | 6 | 0% | 0% | 100% | 33.5 | 10.3 | too-expensive ×13, silence-after-price ×6, i-know-what-it-is ×4 | 3 |
| maintenance-visit-anode | 2 | expert | 6 | 100% | 0% | 0% | 87.2 | 100.0 | silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, paid-less-last-time ×5, minimal-responses ×4, mishears-the-price ×3, half-listening ×2, neighbor-said ×2, thinks-out-loud ×2, interrupts-how-much ×1, phone-call-hold-on ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 6 |
| maintenance-visit-anode | 2 | solid | 6 | 100% | 0% | 0% | 66.7 | 91.5 | silence-after-price ×6, home-warranty-covers-it ×6, paid-less-last-time ×5, what-am-i-paying-for ×4, mishears-the-price ×2, neighbor-said ×2, minimal-responses ×1, half-listening ×1, mixes-up-terms ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 1 |
| maintenance-visit-anode | 2 | novice | 6 | 0% | 0% | 100% | 24.5 | 2.5 | home-warranty-covers-it ×13, what-am-i-paying-for ×8, silence-after-price ×6, paid-less-last-time ×5, goes-cold ×4, i-know-what-it-is ×4 | 6 |
| maintenance-visit-anode | 4 | expert | 6 | 100% | 0% | 0% | 87.2 | 100.0 | silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, paid-less-last-time ×5, minimal-responses ×4, mishears-the-price ×3, half-listening ×2, neighbor-said ×2, thinks-out-loud ×2, interrupts-how-much ×1, phone-call-hold-on ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 6 |
| maintenance-visit-anode | 4 | solid | 6 | 17% | 83% | 0% | 71.0 | 98.7 | silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, paid-less-last-time ×6, mishears-the-price ×2, neighbor-said ×2, minimal-responses ×1, half-listening ×1, mixes-up-terms ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 6 |
| maintenance-visit-anode | 4 | novice | 6 | 0% | 0% | 100% | 28.7 | 5.2 | home-warranty-covers-it ×12, what-am-i-paying-for ×7, silence-after-price ×6, i-know-what-it-is ×4, goes-cold ×2, angry-about-last-company ×2, paid-less-last-time ×2 | 6 |
| second-opinion-quote | 2 | expert | 6 | 100% | 0% | 0% | 90.3 | 100.0 | silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×6, i-know-what-it-is ×3, minimal-responses ×3, thinks-out-loud ×2, background-chaos ×2, neighbor-said ×2, phone-call-hold-on ×2, watched-a-video ×2 | 0 |
| second-opinion-quote | 2 | solid | 6 | 100% | 0% | 0% | 71.2 | 99.7 | silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×6, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, thinks-out-loud ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| second-opinion-quote | 2 | novice | 6 | 0% | 0% | 100% | 33.2 | 10.5 | i-know-what-it-is ×4, found-it-cheaper ×2 | 4 |
| second-opinion-quote | 4 | expert | 6 | 100% | 0% | 0% | 90.3 | 100.0 | silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×6, i-know-what-it-is ×3, minimal-responses ×3, thinks-out-loud ×2, background-chaos ×2, neighbor-said ×2, phone-call-hold-on ×2, watched-a-video ×2 | 0 |
| second-opinion-quote | 4 | solid | 6 | 100% | 0% | 0% | 71.7 | 98.7 | silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×6, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| second-opinion-quote | 4 | novice | 6 | 0% | 0% | 100% | 35.8 | 5.3 | i-know-what-it-is ×4, angry-about-last-company ×2 | 6 |
| tank-vs-tankless-family | 2 | expert | 6 | 100% | 0% | 0% | 90.8 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, neighbor-said ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×2, mixes-up-terms ×1, watched-a-video ×1, background-chaos ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 12 |
| tank-vs-tankless-family | 2 | solid | 6 | 83% | 17% | 0% | 74.0 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 1 |
| tank-vs-tankless-family | 2 | novice | 6 | 0% | 0% | 100% | 30.5 | 3.2 | too-expensive ×4, i-know-what-it-is ×4 | 6 |
| tank-vs-tankless-family | 4 | expert | 6 | 100% | 0% | 0% | 90.8 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, neighbor-said ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×2, mixes-up-terms ×1, watched-a-video ×1, background-chaos ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 12 |
| tank-vs-tankless-family | 4 | solid | 6 | 83% | 17% | 0% | 74.0 | 99.8 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 1 |
| tank-vs-tankless-family | 4 | novice | 6 | 0% | 0% | 100% | 36.2 | 6.3 | i-know-what-it-is ×4 | 6 |
| wh-code-upgrades-rental | 2 | expert | 6 | 67% | 33% | 0% | 92.8 | 100.0 | handyman-can-do-it ×6, do-i-need-the-code-stuff ×6, just-the-cheap-fix ×6, can-you-do-better ×6, silence-after-price ×5, thinks-out-loud ×5, minimal-responses ×4, background-chaos ×3, phone-call-hold-on ×3, i-know-what-it-is ×2, watched-a-video ×1, mishears-the-price ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 2 | solid | 6 | 100% | 0% | 0% | 78.0 | 100.0 | silence-after-price ×6, do-i-need-the-code-stuff ×6, just-the-cheap-fix ×6, handyman-can-do-it ×5, can-you-do-better ×5, minimal-responses ×2, mishears-the-price ×2, phone-call-hold-on ×2, background-chaos ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 2 | novice | 6 | 0% | 0% | 100% | 36.0 | 0.0 | i-know-what-it-is ×4 | 6 |
| wh-code-upgrades-rental | 4 | expert | 6 | 67% | 33% | 0% | 93.2 | 100.0 | handyman-can-do-it ×6, do-i-need-the-code-stuff ×6, just-the-cheap-fix ×6, can-you-do-better ×6, silence-after-price ×5, thinks-out-loud ×5, minimal-responses ×4, background-chaos ×3, phone-call-hold-on ×3, i-know-what-it-is ×2, watched-a-video ×1, mishears-the-price ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 4 | solid | 6 | 83% | 17% | 0% | 78.3 | 100.0 | silence-after-price ×6, do-i-need-the-code-stuff ×6, just-the-cheap-fix ×6, can-you-do-better ×6, handyman-can-do-it ×5, mishears-the-price ×2, phone-call-hold-on ×2, i-know-what-it-is ×1, background-chaos ×1, neighbor-said ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 4 | novice | 6 | 0% | 0% | 100% | 35.7 | 0.0 | i-know-what-it-is ×4, angry-about-last-company ×2 | 6 |
| wh-first-home-rumbling | 2 | expert | 6 | 100% | 0% | 0% | 85.5 | 100.0 | silence-after-price ×6, thinks-out-loud ×3, mixes-up-terms ×3, mishears-the-price ×3, minimal-responses ×2, phone-call-hold-on ×2, watched-a-video ×2, background-chaos ×1, neighbor-said ×1, i-know-what-it-is ×1, didnt-budget-for-this ×1 | 7 |
| wh-first-home-rumbling | 2 | solid | 6 | 83% | 17% | 0% | 69.0 | 97.8 | silence-after-price ×6, need-to-think-about-it ×4, monthly-still-too-much ×3, didnt-budget-for-this ×3, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, watched-a-video ×1 | 0 |
| wh-first-home-rumbling | 2 | novice | 6 | 0% | 0% | 100% | 26.5 | 6.7 | didnt-budget-for-this ×12, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-first-home-rumbling | 4 | expert | 6 | 100% | 0% | 0% | 85.5 | 100.0 | silence-after-price ×6, thinks-out-loud ×3, mixes-up-terms ×3, mishears-the-price ×3, minimal-responses ×2, phone-call-hold-on ×2, watched-a-video ×2, background-chaos ×1, neighbor-said ×1, i-know-what-it-is ×1, didnt-budget-for-this ×1 | 7 |
| wh-first-home-rumbling | 4 | solid | 6 | 17% | 83% | 0% | 72.3 | 97.0 | silence-after-price ×6, monthly-still-too-much ×6, need-to-think-about-it ×5, didnt-budget-for-this ×3, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, watched-a-video ×1 | 0 |
| wh-first-home-rumbling | 4 | novice | 6 | 0% | 0% | 100% | 30.5 | 9.7 | didnt-budget-for-this ×8, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-heat-pump-rebate | 2 | expert | 6 | 100% | 0% | 0% | 85.2 | 100.0 | silence-after-price ×6, what-am-i-paying-for ×6, do-i-need-the-code-stuff ×5, repeats-answered-objection ×3, thinks-out-loud ×2, minimal-responses ×2, you-always-upsell ×1, watched-a-video ×1, half-listening ×1, tests-your-honesty ×1, neighbor-said ×1 | 14 |
| wh-heat-pump-rebate | 2 | solid | 6 | 100% | 0% | 0% | 70.2 | 91.7 | silence-after-price ×6, do-i-need-the-code-stuff ×6, what-am-i-paying-for ×5, you-always-upsell ×2, phone-call-hold-on ×2, minimal-responses ×1, half-listening ×1, neighbor-said ×1, i-know-what-it-is ×1, watched-a-video ×1 | 0 |
| wh-heat-pump-rebate | 2 | novice | 6 | 0% | 0% | 100% | 24.0 | 3.2 | you-always-upsell ×13, what-am-i-paying-for ×7, silence-after-price ×6, do-i-need-the-code-stuff ×6, i-know-what-it-is ×4, goes-cold ×3 | 0 |
| wh-heat-pump-rebate | 4 | expert | 6 | 100% | 0% | 0% | 85.7 | 100.0 | silence-after-price ×6, what-am-i-paying-for ×6, do-i-need-the-code-stuff ×6, thinks-out-loud ×3, tests-your-honesty ×2, watched-a-video ×2, i-know-what-it-is ×2, repeats-answered-objection ×2, neighbor-said ×2, you-always-upsell ×1, half-listening ×1 | 13 |
| wh-heat-pump-rebate | 4 | solid | 6 | 33% | 67% | 0% | 73.5 | 95.5 | you-always-upsell ×6, silence-after-price ×6, do-i-need-the-code-stuff ×6, what-am-i-paying-for ×5, phone-call-hold-on ×2, tests-your-honesty ×1, i-know-what-it-is ×1, half-listening ×1, neighbor-said ×1 | 0 |
| wh-heat-pump-rebate | 4 | novice | 6 | 0% | 0% | 100% | 27.8 | 5.2 | you-always-upsell ×11, what-am-i-paying-for ×7, silence-after-price ×6, i-know-what-it-is ×4, do-i-need-the-code-stuff ×3, goes-cold ×2, angry-about-last-company ×2 | 0 |
| wh-repair-or-replace-9yr | 2 | expert | 6 | 100% | 0% | 0% | 73.5 | 95.7 | tests-your-honesty ×6, silence-after-price ×6, thinks-out-loud ×4, neighbor-said ×3, how-do-i-know-its-broken ×2, minimal-responses ×2, watched-a-video ×2, background-chaos ×1, mixes-up-terms ×1 | 18 |
| wh-repair-or-replace-9yr | 2 | solid | 6 | 67% | 33% | 0% | 68.2 | 96.7 | last-company-ripped-me-off ×6, tests-your-honesty ×6, silence-after-price ×6, how-do-i-know-its-broken ×6, neighbor-said ×2, thinks-out-loud ×1, watched-a-video ×1, background-chaos ×1 | 5 |
| wh-repair-or-replace-9yr | 2 | novice | 6 | 0% | 0% | 100% | 31.0 | 4.0 | last-company-ripped-me-off ×10, show-me-in-writing ×10, how-do-i-know-its-broken ×5, goes-cold ×3, silence-after-price ×3, i-know-what-it-is ×1, thinks-out-loud ×1 | 6 |
| wh-repair-or-replace-9yr | 4 | expert | 6 | 83% | 17% | 0% | 75.3 | 80.2 | tests-your-honesty ×6, silence-after-price ×6, last-company-ripped-me-off ×4, thinks-out-loud ×4, neighbor-said ×2, how-do-i-know-its-broken ×2, half-listening ×2, background-chaos ×1, watched-a-video ×1 | 18 |
| wh-repair-or-replace-9yr | 4 | solid | 6 | 0% | 100% | 0% | 70.5 | 99.3 | last-company-ripped-me-off ×6, tests-your-honesty ×6, silence-after-price ×6, how-do-i-know-its-broken ×6, show-me-in-writing ×6, minimal-responses ×1, background-chaos ×1, thinks-out-loud ×1 | 4 |
| wh-repair-or-replace-9yr | 4 | novice | 6 | 0% | 0% | 100% | 32.5 | 0.7 | last-company-ripped-me-off ×11, show-me-in-writing ×10, how-do-i-know-its-broken ×5, silence-after-price ×3, goes-cold ×2, angry-about-last-company ×1, thinks-out-loud ×1 | 6 |
| wh-replacement-spanish | 2 | expert | 6 | 0% | 100% | 0% | 88.2 | 100.0 | silence-after-price ×6, minimal-responses ×4, thinks-out-loud ×3, mishears-the-price ×3, background-chaos ×3, mixes-up-terms ×2, neighbor-said ×2, watched-a-video ×2, repeats-answered-objection ×1, phone-call-hold-on ×1 | 18 |
| wh-replacement-spanish | 2 | solid | 6 | 0% | 100% | 0% | 72.7 | 100.0 | silence-after-price ×6, mishears-the-price ×5, minimal-responses ×2, neighbor-said ×2, repeats-answered-objection ×1, background-chaos ×1, watched-a-video ×1 | 6 |
| wh-replacement-spanish | 2 | novice | 6 | 0% | 0% | 100% | 34.0 | 14.0 | show-me-in-writing ×15, silence-after-price ×6 | 0 |
| wh-replacement-spanish | 4 | expert | 6 | 0% | 100% | 0% | 88.2 | 100.0 | silence-after-price ×6, minimal-responses ×4, thinks-out-loud ×3, mishears-the-price ×3, mixes-up-terms ×2, background-chaos ×2, neighbor-said ×2, watched-a-video ×2, repeats-answered-objection ×1, phone-call-hold-on ×1, half-listening ×1 | 18 |
| wh-replacement-spanish | 4 | solid | 6 | 0% | 100% | 0% | 73.0 | 100.0 | silence-after-price ×6, show-me-in-writing ×3, mishears-the-price ×3, minimal-responses ×2, neighbor-said ×2, repeats-answered-objection ×1, background-chaos ×1, watched-a-video ×1 | 7 |
| wh-replacement-spanish | 4 | novice | 6 | 0% | 0% | 100% | 34.0 | 4.0 | show-me-in-writing ×15, silence-after-price ×6 | 0 |
| wh-tank-landlord-tenant | 2 | expert | 6 | 0% | 0% | 100% | 86.5 | 100.0 | handyman-can-do-it ×6, can-you-do-better ×6, just-the-cheap-fix ×6, silence-after-price ×5, minimal-responses ×4, mishears-the-price ×4, thinks-out-loud ×3, background-chaos ×3, phone-call-hold-on ×2, i-know-what-it-is ×1, watched-a-video ×1, tests-your-honesty ×1 | 24 |
| wh-tank-landlord-tenant | 2 | solid | 6 | 0% | 100% | 0% | 79.8 | 100.0 | silence-after-price ×6, handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×5, minimal-responses ×2, mishears-the-price ×2, phone-call-hold-on ×2, background-chaos ×1, tests-your-honesty ×1 | 11 |
| wh-tank-landlord-tenant | 2 | novice | 6 | 0% | 0% | 100% | 27.3 | 0.0 | just-the-cheap-fix ×11, can-you-do-better ×10, handyman-can-do-it ×10, goes-cold ×5, silence-after-price ×4, i-know-what-it-is ×4, mishears-the-price ×2 | 0 |
| wh-tank-landlord-tenant | 4 | expert | 6 | 0% | 0% | 100% | 86.5 | 100.0 | handyman-can-do-it ×6, can-you-do-better ×6, just-the-cheap-fix ×6, silence-after-price ×5, minimal-responses ×4, mishears-the-price ×4, thinks-out-loud ×3, background-chaos ×3, phone-call-hold-on ×2, i-know-what-it-is ×1, watched-a-video ×1, tests-your-honesty ×1 | 24 |
| wh-tank-landlord-tenant | 4 | solid | 6 | 0% | 100% | 0% | 79.2 | 100.0 | silence-after-price ×6, handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×5, mishears-the-price ×2, phone-call-hold-on ×2, i-know-what-it-is ×1, background-chaos ×1, neighbor-said ×1, tests-your-honesty ×1 | 11 |
| wh-tank-landlord-tenant | 4 | novice | 6 | 0% | 0% | 100% | 25.8 | 0.0 | just-the-cheap-fix ×11, can-you-do-better ×10, handyman-can-do-it ×9, silence-after-price ×5, goes-cold ×5, i-know-what-it-is ×4, angry-about-last-company ×2, mishears-the-price ×1 | 0 |
| wh-tank-no-hot-water | 2 | expert | 6 | 0% | 100% | 0% | 91.7 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×4, i-know-what-it-is ×2, minimal-responses ×2, mixes-up-terms ×2, watched-a-video ×2, thinks-out-loud ×1, phone-call-hold-on ×1, background-chaos ×1, neighbor-said ×1 | 23 |
| wh-tank-no-hot-water | 2 | solid | 6 | 0% | 100% | 0% | 74.0 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 10 |
| wh-tank-no-hot-water | 2 | novice | 6 | 0% | 0% | 100% | 29.8 | 10.8 | too-expensive ×16, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-tank-no-hot-water | 4 | expert | 6 | 0% | 100% | 0% | 91.7 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×4, i-know-what-it-is ×2, minimal-responses ×2, mixes-up-terms ×2, watched-a-video ×2, thinks-out-loud ×1, phone-call-hold-on ×1, background-chaos ×1, neighbor-said ×1 | 23 |
| wh-tank-no-hot-water | 4 | solid | 6 | 0% | 100% | 0% | 74.0 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 10 |
| wh-tank-no-hot-water | 4 | novice | 6 | 0% | 0% | 100% | 33.5 | 10.3 | too-expensive ×13, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-tankless-descale | 2 | expert | 6 | 100% | 0% | 0% | 88.3 | 100.0 | can-you-do-better ×5, mishears-the-price ×4, i-know-what-it-is ×2, phone-call-hold-on ×2, neighbor-said ×1, interrupts-how-much ×1, watched-a-video ×1, background-chaos ×1, minimal-responses ×1, tests-your-honesty ×1 | 11 |
| wh-tankless-descale | 2 | solid | 6 | 100% | 0% | 0% | 66.5 | 90.5 | can-you-do-better ×6, mishears-the-price ×3, interrupts-how-much ×2, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 4 |
| wh-tankless-descale | 2 | novice | 6 | 0% | 0% | 100% | 26.7 | 9.5 | can-you-do-better ×16, are-you-on-commission ×6, i-know-what-it-is ×4, goes-cold ×3, mishears-the-price ×2 | 0 |
| wh-tankless-descale | 4 | expert | 6 | 100% | 0% | 0% | 88.3 | 100.0 | can-you-do-better ×5, mishears-the-price ×4, i-know-what-it-is ×2, phone-call-hold-on ×2, neighbor-said ×1, interrupts-how-much ×1, watched-a-video ×1, background-chaos ×1, minimal-responses ×1, tests-your-honesty ×1 | 11 |
| wh-tankless-descale | 4 | solid | 6 | 100% | 0% | 0% | 66.5 | 81.8 | can-you-do-better ×6, mishears-the-price ×3, interrupts-how-much ×2, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 4 |
| wh-tankless-descale | 4 | novice | 6 | 0% | 0% | 100% | 29.7 | 7.8 | can-you-do-better ×14, i-know-what-it-is ×4, are-you-on-commission ×3, goes-cold ×3, mishears-the-price ×2, angry-about-last-company ×2 | 0 |
| wh-tankless-upgrade-question | 2 | expert | 6 | 0% | 0% | 100% | 73.8 | 100.0 | watched-a-video ×6, found-it-cheaper ×6, need-three-bids ×6, silence-after-price ×5, thinks-out-loud ×3, i-know-what-it-is ×2, interrupts-how-much ×2, bigger-than-needed ×1, neighbor-said ×1, phone-call-hold-on ×1, minimal-responses ×1, tests-your-honesty ×1 | 15 |
| wh-tankless-upgrade-question | 2 | solid | 6 | 33% | 50% | 17% | 57.0 | 64.3 | watched-a-video ×6, found-it-cheaper ×6, need-three-bids ×6, silence-after-price ×4, i-know-what-it-is ×1, minimal-responses ×1, thinks-out-loud ×1 | 13 |
| wh-tankless-upgrade-question | 2 | novice | 6 | 0% | 0% | 100% | 27.5 | 3.8 | found-it-cheaper ×11, need-three-bids ×6, silence-after-price ×4, i-know-what-it-is ×3, thinks-out-loud ×1 | 0 |
| wh-tankless-upgrade-question | 4 | expert | 6 | 0% | 0% | 100% | 73.8 | 100.0 | watched-a-video ×6, found-it-cheaper ×6, need-three-bids ×6, silence-after-price ×5, thinks-out-loud ×3, i-know-what-it-is ×2, interrupts-how-much ×2, bigger-than-needed ×1, neighbor-said ×1, phone-call-hold-on ×1, minimal-responses ×1, tests-your-honesty ×1 | 15 |
| wh-tankless-upgrade-question | 4 | solid | 6 | 0% | 67% | 33% | 55.8 | 52.3 | watched-a-video ×6, found-it-cheaper ×5, need-three-bids ×5, silence-after-price ×4, i-know-what-it-is ×1, minimal-responses ×1, thinks-out-loud ×1 | 13 |
| wh-tankless-upgrade-question | 4 | novice | 6 | 0% | 0% | 100% | 28.5 | 1.5 | found-it-cheaper ×10, need-three-bids ×6, silence-after-price ×4, i-know-what-it-is ×2, thinks-out-loud ×1 | 0 |
| wh-warranty-claim-denied | 2 | expert | 6 | 0% | 0% | 100% | 66.7 | 88.5 | minimal-responses ×4, neighbor-said ×3, half-listening ×2, interrupts-how-much ×1, silence-after-price ×1, phone-call-hold-on ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 48 |
| wh-warranty-claim-denied | 2 | solid | 6 | 0% | 0% | 100% | 51.0 | 43.3 | neighbor-said ×2, minimal-responses ×1, half-listening ×1, mixes-up-terms ×1, silence-after-price ×1, home-warranty-covers-it ×1, what-am-i-paying-for ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 18 |
| wh-warranty-claim-denied | 2 | novice | 6 | 0% | 0% | 100% | 30.8 | 10.8 | home-warranty-covers-it ×4, i-know-what-it-is ×4 | 6 |
| wh-warranty-claim-denied | 4 | expert | 6 | 0% | 0% | 100% | 69.5 | 92.7 | minimal-responses ×4, do-i-need-the-code-stuff ×3, home-warranty-covers-it ×3, neighbor-said ×3, what-am-i-paying-for ×2, paid-less-last-time ×2, half-listening ×2, interrupts-how-much ×1, silence-after-price ×1, phone-call-hold-on ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 45 |
| wh-warranty-claim-denied | 4 | solid | 6 | 0% | 0% | 100% | 51.0 | 33.8 | neighbor-said ×2, minimal-responses ×1, half-listening ×1, mixes-up-terms ×1, silence-after-price ×1, home-warranty-covers-it ×1, what-am-i-paying-for ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 18 |
| wh-warranty-claim-denied | 4 | novice | 6 | 0% | 0% | 100% | 35.8 | 9.2 | i-know-what-it-is ×4, angry-about-last-company ×2 | 6 |

## Probes

`upsell`: an expert who also recommends one unjustified item. Must lower trust and never end in yes.
`pushy`: an expert who asks for the decision again and again with nothing new. Must never flip to yes.

| Scenario | Difficulty | Probe | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gas-smell-flex-line | 2 | upsell | 3 | 33% | 0% | 67% | 70.7 | 94.3 | silence-after-price ×3, too-expensive ×3, repeats-answered-objection ×2, mishears-the-price ×1, minimal-responses ×1, thinks-out-loud ×1, mixes-up-terms ×1 | 17 |
| gas-smell-flex-line | 2 | pushy | 3 | 67% | 0% | 33% | 63.3 | 78.7 | silence-after-price ×3, can-it-wait ×3, too-expensive ×2, mishears-the-price ×1, minimal-responses ×1, thinks-out-loud ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 16 |
| gas-smell-flex-line | 4 | upsell | 3 | 33% | 0% | 67% | 70.0 | 94.3 | silence-after-price ×3, too-expensive ×3, repeats-answered-objection ×2, mishears-the-price ×1, minimal-responses ×1, thinks-out-loud ×1, mixes-up-terms ×1 | 17 |
| gas-smell-flex-line | 4 | pushy | 3 | 67% | 0% | 33% | 63.3 | 75.3 | silence-after-price ×3, can-it-wait ×3, too-expensive ×2, mishears-the-price ×1, minimal-responses ×1, thinks-out-loud ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 16 |
| maintenance-visit-anode | 2 | upsell | 3 | 100% | 0% | 0% | 79.0 | 78.7 | silence-after-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, minimal-responses ×2, mishears-the-price ×2, interrupts-how-much ×1, half-listening ×1 | 6 |
| maintenance-visit-anode | 2 | pushy | 3 | 100% | 0% | 0% | 86.7 | 100.0 | silence-after-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, minimal-responses ×2, mishears-the-price ×2, interrupts-how-much ×1, half-listening ×1 | 3 |
| maintenance-visit-anode | 4 | upsell | 3 | 100% | 0% | 0% | 79.0 | 78.7 | silence-after-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, minimal-responses ×2, mishears-the-price ×2, interrupts-how-much ×1, half-listening ×1 | 6 |
| maintenance-visit-anode | 4 | pushy | 3 | 100% | 0% | 0% | 86.7 | 100.0 | silence-after-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, minimal-responses ×2, mishears-the-price ×2, interrupts-how-much ×1, half-listening ×1 | 3 |
| second-opinion-quote | 2 | upsell | 3 | 100% | 0% | 0% | 82.0 | 86.7 | silence-after-price ×3, found-it-cheaper ×3, need-three-bids ×3, i-know-what-it-is ×2, minimal-responses ×2, thinks-out-loud ×1, background-chaos ×1, neighbor-said ×1 | 3 |
| second-opinion-quote | 2 | pushy | 3 | 100% | 0% | 0% | 86.0 | 100.0 | silence-after-price ×3, i-know-what-it-is ×2, found-it-cheaper ×2, need-three-bids ×2, minimal-responses ×2, thinks-out-loud ×1, background-chaos ×1, neighbor-said ×1 | 1 |
| second-opinion-quote | 4 | upsell | 3 | 100% | 0% | 0% | 82.0 | 86.7 | silence-after-price ×3, found-it-cheaper ×3, need-three-bids ×3, i-know-what-it-is ×2, minimal-responses ×2, thinks-out-loud ×1, background-chaos ×1, neighbor-said ×1 | 3 |
| second-opinion-quote | 4 | pushy | 3 | 67% | 0% | 33% | 78.7 | 91.7 | found-it-cheaper ×5, silence-after-price ×3, i-know-what-it-is ×2, need-three-bids ×2, minimal-responses ×2, thinks-out-loud ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| tank-vs-tankless-family | 2 | upsell | 3 | 67% | 0% | 33% | 83.7 | 81.7 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 8 |
| tank-vs-tankless-family | 2 | pushy | 3 | 100% | 0% | 0% | 91.0 | 100.0 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 6 |
| tank-vs-tankless-family | 4 | upsell | 3 | 67% | 0% | 33% | 83.7 | 81.7 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 8 |
| tank-vs-tankless-family | 4 | pushy | 3 | 100% | 0% | 0% | 91.0 | 100.0 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 6 |
| wh-code-upgrades-rental | 2 | upsell | 3 | 100% | 0% | 0% | 84.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, handyman-can-do-it ×3, do-i-need-the-code-stuff ×3, just-the-cheap-fix ×3, can-you-do-better ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 3 |
| wh-code-upgrades-rental | 2 | pushy | 3 | 100% | 0% | 0% | 79.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 3 |
| wh-code-upgrades-rental | 4 | upsell | 3 | 100% | 0% | 0% | 85.7 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, handyman-can-do-it ×3, do-i-need-the-code-stuff ×3, just-the-cheap-fix ×3, can-you-do-better ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 3 |
| wh-code-upgrades-rental | 4 | pushy | 3 | 0% | 0% | 100% | 54.7 | 68.0 | handyman-can-do-it ×9, silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 3 |
| wh-first-home-rumbling | 2 | upsell | 3 | 100% | 0% | 0% | 81.3 | 87.0 | silence-after-price ×3, thinks-out-loud ×3, minimal-responses ×2, need-to-think-about-it ×2, mixes-up-terms ×2, mishears-the-price ×2 | 6 |
| wh-first-home-rumbling | 2 | pushy | 3 | 100% | 0% | 0% | 78.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, minimal-responses ×2, mixes-up-terms ×2, mishears-the-price ×2 | 3 |
| wh-first-home-rumbling | 4 | upsell | 3 | 100% | 0% | 0% | 84.7 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, need-to-think-about-it ×3, minimal-responses ×2, mixes-up-terms ×2, mishears-the-price ×2 | 6 |
| wh-first-home-rumbling | 4 | pushy | 3 | 100% | 0% | 0% | 78.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, minimal-responses ×2, mixes-up-terms ×2, mishears-the-price ×2 | 3 |
| wh-heat-pump-rebate | 2 | upsell | 3 | 67% | 0% | 33% | 78.7 | 78.0 | silence-after-price ×3, what-am-i-paying-for ×3, do-i-need-the-code-stuff ×3, thinks-out-loud ×2, minimal-responses ×2, you-always-upsell ×1, watched-a-video ×1, half-listening ×1, tests-your-honesty ×1 | 10 |
| wh-heat-pump-rebate | 2 | pushy | 3 | 67% | 0% | 33% | 73.0 | 90.0 | you-always-upsell ×4, silence-after-price ×3, thinks-out-loud ×2, minimal-responses ×2, watched-a-video ×1, half-listening ×1, tests-your-honesty ×1, what-am-i-paying-for ×1, do-i-need-the-code-stuff ×1 | 7 |
| wh-heat-pump-rebate | 4 | upsell | 3 | 67% | 0% | 33% | 80.7 | 92.0 | silence-after-price ×3, thinks-out-loud ×3, what-am-i-paying-for ×3, do-i-need-the-code-stuff ×3, you-always-upsell ×2, tests-your-honesty ×2, watched-a-video ×2, i-know-what-it-is ×2, half-listening ×1 | 9 |
| wh-heat-pump-rebate | 4 | pushy | 3 | 33% | 0% | 67% | 62.3 | 75.7 | you-always-upsell ×7, silence-after-price ×3, thinks-out-loud ×3, tests-your-honesty ×2, watched-a-video ×2, i-know-what-it-is ×2, half-listening ×1 | 5 |
| wh-repair-or-replace-9yr | 2 | upsell | 3 | 33% | 0% | 67% | 70.0 | 62.7 | silence-after-price ×3, how-do-i-know-its-broken ×2, tests-your-honesty ×2, thinks-out-loud ×2, neighbor-said ×1, minimal-responses ×1, show-me-in-writing ×1, watched-a-video ×1 | 11 |
| wh-repair-or-replace-9yr | 2 | pushy | 3 | 33% | 0% | 67% | 55.3 | 32.3 | last-company-ripped-me-off ×4, silence-after-price ×3, how-do-i-know-its-broken ×2, tests-your-honesty ×2, thinks-out-loud ×2, neighbor-said ×1, minimal-responses ×1, watched-a-video ×1 | 10 |
| wh-repair-or-replace-9yr | 4 | upsell | 3 | 0% | 33% | 67% | 70.7 | 50.0 | tests-your-honesty ×3, silence-after-price ×3, show-me-in-writing ×3, last-company-ripped-me-off ×2, neighbor-said ×2, how-do-i-know-its-broken ×1, half-listening ×1, thinks-out-loud ×1 | 9 |
| wh-repair-or-replace-9yr | 4 | pushy | 3 | 33% | 0% | 67% | 57.3 | 28.0 | how-do-i-know-its-broken ×5, tests-your-honesty ×3, silence-after-price ×3, last-company-ripped-me-off ×2, neighbor-said ×2, half-listening ×1, thinks-out-loud ×1 | 9 |
| wh-replacement-spanish | 2 | upsell | 3 | 0% | 67% | 33% | 78.7 | 100.0 | minimal-responses ×3, silence-after-price ×3, thinks-out-loud ×3, mixes-up-terms ×1, mishears-the-price ×1, background-chaos ×1, neighbor-said ×1 | 9 |
| wh-replacement-spanish | 2 | pushy | 3 | 0% | 0% | 100% | 54.7 | 41.0 | minimal-responses ×3, silence-after-price ×3, thinks-out-loud ×3, mixes-up-terms ×1, mishears-the-price ×1, background-chaos ×1, neighbor-said ×1 | 9 |
| wh-replacement-spanish | 4 | upsell | 3 | 0% | 67% | 33% | 78.7 | 100.0 | minimal-responses ×3, silence-after-price ×3, thinks-out-loud ×3, mixes-up-terms ×1, mishears-the-price ×1, background-chaos ×1, neighbor-said ×1 | 9 |
| wh-replacement-spanish | 4 | pushy | 3 | 0% | 0% | 100% | 54.7 | 41.0 | minimal-responses ×3, silence-after-price ×3, thinks-out-loud ×3, mixes-up-terms ×1, mishears-the-price ×1, background-chaos ×1, neighbor-said ×1 | 9 |
| wh-tank-landlord-tenant | 2 | upsell | 3 | 0% | 0% | 100% | 78.0 | 73.7 | silence-after-price ×3, handyman-can-do-it ×3, can-you-do-better ×3, just-the-cheap-fix ×3, minimal-responses ×2, mishears-the-price ×2, i-know-what-it-is ×1, thinks-out-loud ×1, background-chaos ×1 | 12 |
| wh-tank-landlord-tenant | 2 | pushy | 3 | 0% | 0% | 100% | 81.7 | 100.0 | silence-after-price ×3, minimal-responses ×2, mishears-the-price ×2, handyman-can-do-it ×2, can-you-do-better ×2, just-the-cheap-fix ×2, i-know-what-it-is ×1, thinks-out-loud ×1, background-chaos ×1 | 12 |
| wh-tank-landlord-tenant | 4 | upsell | 3 | 0% | 0% | 100% | 78.0 | 73.7 | silence-after-price ×3, handyman-can-do-it ×3, can-you-do-better ×3, just-the-cheap-fix ×3, minimal-responses ×2, mishears-the-price ×2, i-know-what-it-is ×1, thinks-out-loud ×1, background-chaos ×1 | 12 |
| wh-tank-landlord-tenant | 4 | pushy | 3 | 0% | 0% | 100% | 81.7 | 98.7 | silence-after-price ×3, minimal-responses ×2, mishears-the-price ×2, handyman-can-do-it ×2, can-you-do-better ×2, just-the-cheap-fix ×2, i-know-what-it-is ×1, thinks-out-loud ×1, background-chaos ×1 | 12 |
| wh-tank-no-hot-water | 2 | upsell | 3 | 0% | 100% | 0% | 83.3 | 97.7 | silence-after-price ×3, too-expensive ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 11 |
| wh-tank-no-hot-water | 2 | pushy | 3 | 0% | 0% | 100% | 61.0 | 48.0 | too-expensive ×4, silence-after-price ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 8 |
| wh-tank-no-hot-water | 4 | upsell | 3 | 0% | 100% | 0% | 83.3 | 97.7 | silence-after-price ×3, too-expensive ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 11 |
| wh-tank-no-hot-water | 4 | pushy | 3 | 0% | 0% | 100% | 61.0 | 48.0 | too-expensive ×5, silence-after-price ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 8 |
| wh-tankless-descale | 2 | upsell | 3 | 100% | 0% | 0% | 81.0 | 84.0 | can-you-do-better ×3, i-know-what-it-is ×2, mishears-the-price ×2, neighbor-said ×1, interrupts-how-much ×1 | 8 |
| wh-tankless-descale | 2 | pushy | 3 | 100% | 0% | 0% | 87.0 | 100.0 | can-you-do-better ×3, i-know-what-it-is ×2, mishears-the-price ×2, neighbor-said ×1, interrupts-how-much ×1 | 5 |
| wh-tankless-descale | 4 | upsell | 3 | 100% | 0% | 0% | 81.0 | 84.0 | can-you-do-better ×3, i-know-what-it-is ×2, mishears-the-price ×2, neighbor-said ×1, interrupts-how-much ×1 | 8 |
| wh-tankless-descale | 4 | pushy | 3 | 100% | 0% | 0% | 87.0 | 100.0 | can-you-do-better ×3, i-know-what-it-is ×2, mishears-the-price ×2, neighbor-said ×1, interrupts-how-much ×1 | 5 |
| wh-tankless-upgrade-question | 2 | upsell | 3 | 0% | 0% | 100% | 71.0 | 88.3 | watched-a-video ×3, silence-after-price ×3, found-it-cheaper ×3, need-three-bids ×3, i-know-what-it-is ×2, thinks-out-loud ×1, bigger-than-needed ×1, interrupts-how-much ×1 | 8 |
| wh-tankless-upgrade-question | 2 | pushy | 3 | 0% | 0% | 100% | 70.0 | 95.3 | watched-a-video ×3, silence-after-price ×3, i-know-what-it-is ×2, found-it-cheaper ×2, need-three-bids ×2, thinks-out-loud ×1, interrupts-how-much ×1 | 8 |
| wh-tankless-upgrade-question | 4 | upsell | 3 | 0% | 0% | 100% | 70.7 | 88.3 | watched-a-video ×3, silence-after-price ×3, found-it-cheaper ×3, need-three-bids ×3, i-know-what-it-is ×2, thinks-out-loud ×1, bigger-than-needed ×1, interrupts-how-much ×1 | 8 |
| wh-tankless-upgrade-question | 4 | pushy | 3 | 0% | 0% | 100% | 70.0 | 92.0 | watched-a-video ×3, silence-after-price ×3, i-know-what-it-is ×2, found-it-cheaper ×2, need-three-bids ×2, thinks-out-loud ×1, interrupts-how-much ×1 | 8 |
| wh-warranty-claim-denied | 2 | upsell | 3 | 0% | 0% | 100% | 71.0 | 100.0 | home-warranty-covers-it ×3, do-i-need-the-code-stuff ×3, paid-less-last-time ×3, what-am-i-paying-for ×2, minimal-responses ×2, interrupts-how-much ×1, silence-after-price ×1, half-listening ×1, neighbor-said ×1 | 19 |
| wh-warranty-claim-denied | 2 | pushy | 3 | 0% | 0% | 100% | 61.7 | 77.7 | minimal-responses ×2, interrupts-how-much ×1, silence-after-price ×1, half-listening ×1, neighbor-said ×1 | 18 |
| wh-warranty-claim-denied | 4 | upsell | 3 | 0% | 0% | 100% | 71.0 | 100.0 | home-warranty-covers-it ×3, do-i-need-the-code-stuff ×3, paid-less-last-time ×3, what-am-i-paying-for ×2, minimal-responses ×2, interrupts-how-much ×1, silence-after-price ×1, half-listening ×1, neighbor-said ×1 | 19 |
| wh-warranty-claim-denied | 4 | pushy | 3 | 0% | 0% | 100% | 61.7 | 71.7 | minimal-responses ×2, interrupts-how-much ×1, silence-after-price ×1, half-listening ×1, neighbor-said ×1 | 18 |

## Drills

| Drill | Difficulty | Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hold-the-silence | 2 | expert | 2 | 0% | 100% | 0% | 78.0 | 100.0 | silence-after-price ×2, too-expensive ×2 | 5 |
| hold-the-silence | 2 | solid | 2 | 0% | 100% | 0% | 60.0 | 99.5 | silence-after-price ×2, too-expensive ×2 | 2 |
| hold-the-silence | 2 | novice | 2 | 0% | 0% | 100% | 27.5 | 8.5 | too-expensive ×7, silence-after-price ×2 | 0 |
| hold-the-silence | 4 | expert | 2 | 0% | 100% | 0% | 78.0 | 100.0 | silence-after-price ×2, too-expensive ×2 | 5 |
| hold-the-silence | 4 | solid | 2 | 0% | 100% | 0% | 60.0 | 94.5 | silence-after-price ×2, too-expensive ×2 | 2 |
| hold-the-silence | 4 | novice | 2 | 0% | 0% | 100% | 31.0 | 8.0 | too-expensive ×6, silence-after-price ×2 | 0 |

## Violations

### hard: forced-move-fires (95)

- `gas-smell-flex-line d2 solid seed 101` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 solid seed 138` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 solid seed 175` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 solid seed 212` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 solid seed 249` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 solid seed 286` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 expert seed 101` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 expert seed 138` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 expert seed 175` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 expert seed 212` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 expert seed 249` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- `gas-smell-flex-line d2 expert seed 286` can-it-wait never fired, though its trigger was met in 1 state point(s) (close)
- ...and 83 more

### hard: unneeded-work-no-yes (41)

- `gas-smell-flex-line d2 expert/upsell seed 138` customer said yes after "Saying the water heater must be replaced for safety"
- `gas-smell-flex-line d4 expert/upsell seed 138` customer said yes after "Saying the water heater must be replaced for safety"
- `maintenance-visit-anode d2 expert/upsell seed 101` customer said yes after "Recommending a new water heater"
- `maintenance-visit-anode d2 expert/upsell seed 138` customer said yes after "Replacing the expansion tank"
- `maintenance-visit-anode d2 expert/upsell seed 175` customer said yes after "Whole-home water filtration"
- `maintenance-visit-anode d4 expert/upsell seed 101` customer said yes after "Recommending a new water heater"
- `maintenance-visit-anode d4 expert/upsell seed 138` customer said yes after "Replacing the expansion tank"
- `maintenance-visit-anode d4 expert/upsell seed 175` customer said yes after "Whole-home water filtration"
- `second-opinion-quote d2 expert/upsell seed 101` customer said yes after "Replace the pressure regulator"
- `second-opinion-quote d2 expert/upsell seed 138` customer said yes after "Upsizing to a 75-gallon tank"
- `second-opinion-quote d2 expert/upsell seed 175` customer said yes after "Water softener"
- `second-opinion-quote d4 expert/upsell seed 101` customer said yes after "Replace the pressure regulator"
- ...and 29 more

### soft: expert-closes-more-per-scenario (10)

- `wh-replacement-spanish d2` expert yes 0% vs novice yes 0%
- `wh-replacement-spanish d4` expert yes 0% vs novice yes 0%
- `wh-tank-landlord-tenant d2` expert yes 0% vs novice yes 0%
- `wh-tank-landlord-tenant d4` expert yes 0% vs novice yes 0%
- `wh-tank-no-hot-water d2` expert yes 0% vs novice yes 0%
- `wh-tank-no-hot-water d4` expert yes 0% vs novice yes 0%
- `wh-tankless-upgrade-question d2` expert yes 0% vs novice yes 0%
- `wh-tankless-upgrade-question d4` expert yes 0% vs novice yes 0%
- `wh-warranty-claim-denied d2` expert yes 0% vs novice yes 0%
- `wh-warranty-claim-denied d4` expert yes 0% vs novice yes 0%

### soft: forced-move-fires-collapsed-call (78)

- `gas-smell-flex-line d2 novice seed 101` can-it-wait never fired, though its trigger was met in 4 state point(s) (close)
- `gas-smell-flex-line d2 novice seed 138` can-it-wait never fired, though its trigger was met in 3 state point(s) (close)
- `gas-smell-flex-line d2 novice seed 175` can-it-wait never fired, though its trigger was met in 3 state point(s) (close)
- `gas-smell-flex-line d2 novice seed 212` can-it-wait never fired, though its trigger was met in 3 state point(s) (close)
- `gas-smell-flex-line d2 novice seed 249` can-it-wait never fired, though its trigger was met in 3 state point(s) (close)
- `gas-smell-flex-line d4 novice seed 101` can-it-wait never fired, though its trigger was met in 3 state point(s) (close)
- `gas-smell-flex-line d4 novice seed 138` can-it-wait never fired, though its trigger was met in 3 state point(s) (close)
- `gas-smell-flex-line d4 novice seed 249` can-it-wait never fired, though its trigger was met in 3 state point(s) (close)
- `maintenance-visit-anode d2 novice seed 101` how-do-i-know-its-broken never fired, though its trigger was met in 2 state point(s) (price)
- `maintenance-visit-anode d2 novice seed 138` how-do-i-know-its-broken never fired, though its trigger was met in 2 state point(s) (price)
- `maintenance-visit-anode d2 novice seed 175` how-do-i-know-its-broken never fired, though its trigger was met in 2 state point(s) (price)
- `maintenance-visit-anode d2 novice seed 212` how-do-i-know-its-broken never fired, though its trigger was met in 2 state point(s) (price)
- ...and 66 more

### soft: perceiver-false-unneeded-work (305)

- `gas-smell-flex-line d2 expert seed 101` "So it sounds like a man sold you a roof coating a few years back. That must be frustrating. What matters most " read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 101` "Here's what I found, in plain English. The gas connector to the water heater is corroded and kinked, and leak " read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 138` "So it sounds like a man sold you a roof coating a few years back. That must be frustrating. What matters most " read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 138` "Here's what I found, in plain English. The gas connector to the water heater is corroded and kinked, and leak " read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 175` "So it sounds like the sewer line, that's the pipe under the kitchen sink. That must be frustrating. What matte" read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 175` "Here's what I found, in plain English. The gas connector to the water heater is corroded and kinked, and leak " read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 212` "So it sounds like your husband Harold always handled the house. That must be frustrating. What matters most to" read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 212` "Here's what I found, in plain English. The gas connector to the water heater is corroded and kinked, and leak " read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 249` "So it sounds like your son Kevin lives up in Bakersfield. That must be frustrating. What matters most to you i" read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 249` "Here's what I found, in plain English. The gas connector to the water heater is corroded and kinked, and leak " read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 286` "So it sounds like your husband Harold always handled the house. That must be frustrating. What matters most to" read as unneeded work: Saying the water heater must be replaced for safety
- `gas-smell-flex-line d2 expert seed 286` "Here's what I found, in plain English. The gas connector to the water heater is corroded and kinked, and leak " read as unneeded work: Saying the water heater must be replaced for safety
- ...and 293 more

### soft: perceiver-missed-monthly (655)

- `gas-smell-flex-line d2 expert seed 101` "The second is Replace the water heater, 40-gallon standard gas, 6-year warranty, at $1,890, or about $49 a month" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 101` "It's $445 total, or about $11 a month" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 101` "To be honest with you, Replace gas connector and shutoff valve is a safe choice, and with financing it works out to about $11 a month, so it does not all land at once" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 138` "The second is Replace the water heater, 40-gallon standard gas, 6-year warranty, at $1,890, or about $49 a month" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 138` "It's $445 total, or about $11 a month" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 138` "To be honest with you, Replace gas connector and shutoff valve is a safe choice, and with financing it works out to about $11 a month, so it does not all land at once" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 175` "To be honest with you, Replace gas connector and shutoff valve is a safe choice, and with financing it works out to about $11 a month, so it does not all land at once" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 175` "The second is Replace the water heater, 40-gallon standard gas, 6-year warranty, at $1,890, or about $49 a month" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 175` "It's $445 total, or about $11 a month" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 212` "The second is Replace the water heater, 40-gallon standard gas, 6-year warranty, at $1,890, or about $49 a month" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 212` "It's $445 total, or about $11 a month" not read as framed_monthly
- `gas-smell-flex-line d2 expert seed 212` "To be honest with you, Replace gas connector and shutoff valve is a safe choice, and with financing it works out to about $11 a month, so it does not all land at once" not read as framed_monthly
- ...and 643 more

Hard: 136. Soft: 1048.

## Sample calls

### gas-smell-flex-line d2 expert seed 101: yes, score 75, trust 100

- **CUSTOMER:** Oh, hello. You must be from the plumbing company. Come in, please. _(open)_
- **TECH:** Hi, I'm Sam from the plumbing company, thanks for having me. What I'll do is take a look, explain what I find in plain English, and show you some options before we do anything. Okay? _(set_frame, asked_open_question, explained_plainly)_
- **CUSTOMER:** That's Biscuit. She hides when people come in, don't mind her. _(answer)_
- **TECH:** Tell me about what's been happening. When did it start? _(asked_open_question)_
- **CUSTOMER:** My husband Harold always handled the house. He passed four years ago. _(answer)_
- **TECH:** Who lives here with you, and how do you use the water heater day to day? _(asked_open_question)_
- **CUSTOMER:** A man sold me a roof coating a few years back. Four thousand dollars. I found out later I didn't need it at all. _(answer)_
- **TECH:** So it sounds like a man sold you a roof coating a few years back. That must be frustrating. What matters most to you in how we fix this? _(asked_open_question, asked_follow_up, reflected_back, used_customer_detail, recommended_unneeded_work)_
- **CUSTOMER:** That sounds like extra. Is that really necessary? _(react)_
- **TECH:** How long are you planning to stay in the home? _(asked_open_question)_
- **CUSTOMER:** My son Kevin lives up in Bakersfield. I hate to bother him with these things. _(answer)_
- **TECH:** Has another company been out for this before? How did that go? _(asked_open_question)_
- **CUSTOMER:** I first noticed it a couple days ago. _(answer)_
- **TECH:** Here's what I found, in plain English. The gas connector to the water heater is corroded and kinked, and leak solution bubbles at the lower fitting. It is leaking gas and has to be replaced. What that means is it won't get better on its own. I also noticed this: The gas shutoff valve is an old plug valve. It is stiff and bubbles at the stem when it is turned. It should be replaced along with the connector. I took a photo so you can see it. Does that make sense? _(asked_open_question, explained_plainly, checked_understanding, showed_evidence, recommended_unneeded_work)_
- **CUSTOMER:** Hm. I just want what I actually need, okay? _(react)_
- **TECH:** You have two options. The first is Replace gas connector and shutoff valve, at $445. The second is Replace the water heater, 40-gallon standard gas, 6-year warranty, at $1,890, or about $49 a month. _(stated_price, presented_options, justified_value)_
- **CUSTOMER:** (silence) _(silence: silence-after-price, holds 6000ms)_
- **CUSTOMER:** That's... a lot. _(react: silence-after-price)_
- **TECH:** Of those two options, since you mentioned your son Kevin lives up in Bakersfield, the first one I'd point you to is Replace gas connector and shutoff valve. It's $445 total, or about $11 a month. _(reflected_back, stated_price, presented_options, tied_options_to_needs, used_customer_detail)_
- **CUSTOMER:** Hold on. Say that number again? I don't think I heard it right. _(react: mishears-the-price)_
- **TECH:** Let me say that more clearly. In other words, it's $445 total, and that includes parts and labor. _(explained_plainly, stated_price, justified_value)_
- **CUSTOMER:** Hm. That's too expensive. I can't do that. _(object: too-expensive)_
- **TECH:** That is a fair question. Can I ask what is on your mind with that? What would you want to see? _(asked_open_question, acknowledged_feeling, asked_about_concern, new_angle, addressed_concern)_
- **CUSTOMER:** Well, to be honest with you, I'm on a fixed income. I have some savings, but I'm scared to dip into it. I don't know how long it has to last me. _(reveal)_
- **TECH:** Thank you for telling me that. That makes sense, and I'm glad you said it. To be honest with you, Replace gas connector and shutoff valve is a safe choice, and with financing it works out to about $11 a month, so it does not all land at once. _(reflected_back, acknowledged_feeling, offered_financing, honest_answer, addressed_concern)_
- **CUSTOMER:** Okay. That helps. _(react)_
- **TECH:** I hear you. That price includes parts and labor, the permit, haul away, and the warranty. Of the two options, since you mentioned your son Kevin lives up in Bakersfield, the first one fits you. _(reflected_back, acknowledged_feeling, presented_options, tied_options_to_needs, justified_value, used_customer_detail)_
- **CUSTOMER:** All right, that makes sense. _(react)_
- **TECH:** Before you decide anything, what is on your mind about all this? What would you want to know? _(asked_open_question, asked_about_concern)_
- **CUSTOMER:** I get that, but it's still a lot of money. _(object: repeats-answered-objection)_
- **TECH:** That is a fair question. Can I ask what is on your mind with that? What would you want to see? _(asked_open_question, acknowledged_feeling, asked_about_concern)_
- **CUSTOMER:** All right. _(answer)_
- **TECH:** Everything is included: parts and labor, the permit, and our workmanship guarantee. To be honest with you, that is a fair way to look at it. That is totally fair. _(acknowledged_feeling, justified_value, honest_answer)_
- **CUSTOMER:** Okay, I feel better about that. _(react)_
- **TECH:** Would you like me to get started on that today? _(asked_for_decision)_
- **CUSTOMER:** Yeah, let’s go with that. _(agree)_
- **TECH:** Thank you. I'll write it up and get started right away. Take care.
- **CUSTOMER:** All right. Thanks for coming by. _(end)_

### gas-smell-flex-line d2 solid seed 101: yes, score 64, trust 83

- **CUSTOMER:** Oh, hello. You must be from the plumbing company. Come in, please. _(open)_
- **TECH:** Hi, this is Sam from the plumbing company. Where is the water heater? _(set_frame, asked_follow_up)_
- **CUSTOMER:** That's Biscuit. She hides when people come in, don't mind her. _(answer)_
- **TECH:** Tell me about what's been happening. When did it start? _(asked_open_question)_
- **CUSTOMER:** My husband Harold always handled the house. He passed four years ago. _(answer)_
- **TECH:** Is it leaking?
- **CUSTOMER:** A man sold me a roof coating a few years back. Four thousand dollars. I found out later I didn't need it at all. _(answer)_
- **TECH:** Here's what I found. The gas connector to the water heater is corroded and kinked, and leak solution bubbles at the lower fitting. It is leaking gas and has to be replaced. In other words, it needs to be taken care of. _(explained_plainly)_
- **CUSTOMER:** I don’t really follow. _(react)_
- **TECH:** You have two options. The first is Replace gas connector and shutoff valve, at $445. The second is Replace the water heater, 40-gallon standard gas, 6-year warranty, at $1,890. _(stated_price, presented_options, justified_value)_
- **CUSTOMER:** (silence) _(silence: silence-after-price, holds 6000ms)_
- **CUSTOMER:** Okay. Let me think about that for a second. _(react: silence-after-price)_
- **TECH:** The one most people go with is Replace gas connector and shutoff valve. It's $445. _(stated_price)_
- **CUSTOMER:** Hm. That's too expensive. I can't do that. _(object: too-expensive)_
- **TECH:** I hear you. _(acknowledged_feeling, new_angle, addressed_concern)_
- **CUSTOMER:** All right, that makes sense. _(react)_
- **TECH:** Would you like me to get started on that today? _(asked_for_decision)_
- **CUSTOMER:** Okay, you’ve made it easy. When can you start? _(agree)_
- **TECH:** Thank you. I'll write it up and get started right away. Take care.
- **CUSTOMER:** All right. Thanks for coming by. _(end)_

### gas-smell-flex-line d2 novice seed 101: no, score 26, trust 7

- **CUSTOMER:** Oh, hello. You must be from the plumbing company. Come in, please. _(open)_
- **TECH:** Hey there. Show me the water heater.
- **CUSTOMER:** Okay. It’s this way. That's Biscuit. She hides when people come in, don't mind her. _(react)_
- **TECH:** Did you try turning it off and on?
- **CUSTOMER:** Mm-hm. Go ahead. _(answer)_
- **TECH:** Is it leaking?
- **CUSTOMER:** Mm-hm. _(answer)_
- **TECH:** Yeah, so the gas connector to the water heater is corroded and kinked, and leak solution bubbles at the lower fitting. It is leaking gas and has to be replaced. Your anode rod is shot, there's sediment in the combustion chamber, and the T&P is weeping. _(used_jargon)_
- **CUSTOMER:** Sure, come on in. It’s right through here. _(react)_
- **TECH:** You have to replace it, it's the only option. I know it's a lot, unfortunately it's $845. But I can knock $200 off if you do it today. _(stated_price, presented_options, single_option_only, hedged_price)_
- **CUSTOMER:** (silence) _(silence: silence-after-price, holds 6000ms)_
- **TECH:** So, yeah. It is a really good unit, you will not regret it. _(filled_silence)_
- **CUSTOMER:** All right. What does that include? _(react)_
- **TECH:** So do you want to do it? _(asked_for_decision)_
- **CUSTOMER:** Hm. That's too expensive. I can't do that. _(object: too-expensive)_
- **TECH:** Look, this price is today only. So do you want to do it? _(asked_for_decision, pressured)_
- **CUSTOMER:** Okay, but that doesn't really change the number for me. _(object: too-expensive)_
- **TECH:** I need an answer today, the price goes up next week. Want me to get started? _(asked_for_decision, pressured)_
- **CUSTOMER:** I don’t think so. Not today, thank you. _(decline)_
- **TECH:** Okay, fine. Have a good day.
- **CUSTOMER:** Okay, thank you. _(end)_
