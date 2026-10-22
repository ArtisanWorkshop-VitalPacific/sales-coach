# Test bench: scripted customers

Content 0.1.0+f8c7dc1f2365, 30 scenario(s), 20 drill(s). Difficulties 2, 4, seeds 101, 138, 175, 212, 249, 286. 1680 calls in 4.9s. Generated 2026-10-22T09:37:53.733Z.

**Result: PASS.** No hard invariant failed.

## Headline

| Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| expert | 360 | 91% | 9% | 0% | 89.4 | 100.0 | silence-after-price ×282, mishears-the-price ×148, thinks-out-loud ×134, minimal-responses ×130, neighbor-said ×111, watched-a-video ×90, i-know-what-it-is ×87, phone-call-hold-on ×84, can-you-do-better ×72, too-expensive ×70, tests-your-honesty ×63, background-chaos ×60, what-am-i-paying-for ×56, interrupts-how-much ×46, just-the-cheap-fix ×46, do-i-need-the-code-stuff ×46, mixes-up-terms ×44, brother-in-law-plumber ×36, handyman-can-do-it ×36, home-warranty-covers-it ×36, need-three-bids ×36, found-it-cheaper ×34, only-fix-what-i-called-for ×32, paid-less-last-time ×32, half-listening ×30, how-do-i-know-its-broken ×27, show-me-in-writing ×24, repeats-answered-objection ×15, didnt-budget-for-this ×14, can-it-wait ×12, monthly-still-too-much ×12, ill-do-part-myself ×12, selling-soon ×12, last-company-ripped-me-off ×7, bigger-than-needed ×6, spouse-walks-in ×4, would-you-do-this ×2, you-always-upsell ×2 | 26 |
| solid | 360 | 74% | 26% | 0% | 71.7 | 97.4 | silence-after-price ×300, mishears-the-price ×106, neighbor-said ×84, too-expensive ×70, can-you-do-better ×67, phone-call-hold-on ×62, tests-your-honesty ×54, what-am-i-paying-for ×53, just-the-cheap-fix ×48, need-to-think-about-it ×47, minimal-responses ×47, do-i-need-the-code-stuff ×47, background-chaos ×38, brother-in-law-plumber ×36, watched-a-video ×36, how-do-i-know-its-broken ×36, home-warranty-covers-it ×36, found-it-cheaper ×36, only-fix-what-i-called-for ×35, handyman-can-do-it ×34, i-know-what-it-is ×33, need-three-bids ×32, show-me-in-writing ×30, paid-less-last-time ×27, selling-soon ×24, last-company-ripped-me-off ×22, thinks-out-loud ×21, talk-to-my-spouse ×19, can-it-wait ×18, didnt-budget-for-this ×18, monthly-still-too-much ×18, just-repair-it ×18, mixes-up-terms ×16, spouse-walks-in ×12, half-listening ×12, ill-do-part-myself ×12, interrupts-how-much ×10, bigger-than-needed ×9, you-always-upsell ×9, repeats-answered-objection ×2 | 12 |
| novice | 360 | 0% | 0% | 100% | 28.6 | 4.7 | silence-after-price ×265, i-know-what-it-is ×214, goes-cold ×158, too-expensive ×128, can-you-do-better ×124, just-the-cheap-fix ×98, what-am-i-paying-for ×87, show-me-in-writing ×86, brother-in-law-plumber ×70, found-it-cheaper ×70, home-warranty-covers-it ×63, do-i-need-the-code-stuff ×61, handyman-can-do-it ×59, only-fix-what-i-called-for ×56, how-do-i-know-its-broken ×54, you-always-upsell ×48, need-three-bids ×47, selling-soon ×43, last-company-ripped-me-off ×42, angry-about-last-company ×36, paid-less-last-time ×36, mishears-the-price ×35, didnt-budget-for-this ×35, are-you-on-commission ×27, tests-your-honesty ×24, thinks-out-loud ×23, ill-do-part-myself ×20, can-it-wait ×13, phone-call-hold-on ×12, neighbor-said ×12, watched-a-video ×12, bigger-than-needed ×9, talk-to-my-spouse ×6 | 0 |

## Scenarios

| Scenario | Difficulty | Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| burst-pipe-after-hours | 2 | expert | 6 | 100% | 0% | 0% | 91.5 | 100.0 | can-you-do-better ×6, mishears-the-price ×5, repeats-answered-objection ×3, interrupts-how-much ×2, phone-call-hold-on ×2, neighbor-said ×1, i-know-what-it-is ×1, watched-a-video ×1, background-chaos ×1, minimal-responses ×1, half-listening ×1, tests-your-honesty ×1 | 4 |
| burst-pipe-after-hours | 2 | solid | 6 | 100% | 0% | 0% | 66.5 | 90.5 | can-you-do-better ×6, mishears-the-price ×3, interrupts-how-much ×2, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 3 |
| burst-pipe-after-hours | 2 | novice | 6 | 0% | 0% | 100% | 26.7 | 9.5 | can-you-do-better ×16, are-you-on-commission ×6, i-know-what-it-is ×4, goes-cold ×3, mishears-the-price ×2 | 0 |
| burst-pipe-after-hours | 4 | expert | 6 | 100% | 0% | 0% | 91.5 | 100.0 | can-you-do-better ×6, mishears-the-price ×5, repeats-answered-objection ×3, interrupts-how-much ×2, phone-call-hold-on ×2, neighbor-said ×1, i-know-what-it-is ×1, watched-a-video ×1, background-chaos ×1, minimal-responses ×1, half-listening ×1, tests-your-honesty ×1 | 4 |
| burst-pipe-after-hours | 4 | solid | 6 | 100% | 0% | 0% | 66.5 | 81.8 | can-you-do-better ×6, mishears-the-price ×3, interrupts-how-much ×2, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 3 |
| burst-pipe-after-hours | 4 | novice | 6 | 0% | 0% | 100% | 29.7 | 7.8 | can-you-do-better ×14, i-know-what-it-is ×4, are-you-on-commission ×3, goes-cold ×3, mishears-the-price ×2, angry-about-last-company ×2 | 0 |
| disposal-jammed-old | 2 | expert | 6 | 100% | 0% | 0% | 87.3 | 100.0 | phone-call-hold-on ×6, thinks-out-loud ×4, only-fix-what-i-called-for ×4, mishears-the-price ×3, i-know-what-it-is ×2, half-listening ×1, background-chaos ×1, minimal-responses ×1, tests-your-honesty ×1 | 0 |
| disposal-jammed-old | 2 | solid | 6 | 100% | 0% | 0% | 67.5 | 92.2 | phone-call-hold-on ×6, only-fix-what-i-called-for ×5, mishears-the-price ×3, thinks-out-loud ×2, background-chaos ×1, mixes-up-terms ×1, i-know-what-it-is ×1, tests-your-honesty ×1, talk-to-my-spouse ×1 | 0 |
| disposal-jammed-old | 2 | novice | 6 | 0% | 0% | 100% | 32.3 | 10.2 | only-fix-what-i-called-for ×7, goes-cold ×6, phone-call-hold-on ×6, talk-to-my-spouse ×4, i-know-what-it-is ×4, thinks-out-loud ×3, mishears-the-price ×2 | 0 |
| disposal-jammed-old | 4 | expert | 6 | 100% | 0% | 0% | 87.3 | 100.0 | phone-call-hold-on ×6, thinks-out-loud ×4, only-fix-what-i-called-for ×4, mishears-the-price ×3, i-know-what-it-is ×2, half-listening ×1, background-chaos ×1, minimal-responses ×1, tests-your-honesty ×1 | 0 |
| disposal-jammed-old | 4 | solid | 6 | 17% | 83% | 0% | 75.3 | 99.0 | phone-call-hold-on ×6, talk-to-my-spouse ×6, only-fix-what-i-called-for ×5, need-to-think-about-it ×5, mishears-the-price ×3, thinks-out-loud ×2, background-chaos ×1, mixes-up-terms ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 0 |
| disposal-jammed-old | 4 | novice | 6 | 0% | 0% | 100% | 34.3 | 5.3 | only-fix-what-i-called-for ×8, goes-cold ×6, phone-call-hold-on ×6, i-know-what-it-is ×4, thinks-out-loud ×3, mishears-the-price ×2, talk-to-my-spouse ×2 | 0 |
| drain-kitchen-recurring | 2 | expert | 6 | 100% | 0% | 0% | 89.2 | 100.0 | just-the-cheap-fix ×6, mishears-the-price ×5, half-listening ×3, spouse-walks-in ×2, phone-call-hold-on ×2, neighbor-said ×2, i-know-what-it-is ×1, thinks-out-loud ×1, interrupts-how-much ×1, background-chaos ×1, minimal-responses ×1 | 0 |
| drain-kitchen-recurring | 2 | solid | 6 | 67% | 33% | 0% | 69.0 | 97.2 | just-the-cheap-fix ×6, talk-to-my-spouse ×5, mishears-the-price ×3, thinks-out-loud ×3, need-to-think-about-it ×2, minimal-responses ×2, repeats-answered-objection ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, spouse-walks-in ×1 | 0 |
| drain-kitchen-recurring | 2 | novice | 6 | 0% | 0% | 100% | 26.8 | 8.3 | just-the-cheap-fix ×20, i-know-what-it-is ×4, goes-cold ×3, thinks-out-loud ×3, mishears-the-price ×2 | 0 |
| drain-kitchen-recurring | 4 | expert | 6 | 100% | 0% | 0% | 89.2 | 100.0 | just-the-cheap-fix ×6, mishears-the-price ×5, half-listening ×3, spouse-walks-in ×2, phone-call-hold-on ×2, neighbor-said ×2, i-know-what-it-is ×1, thinks-out-loud ×1, interrupts-how-much ×1, background-chaos ×1, minimal-responses ×1 | 0 |
| drain-kitchen-recurring | 4 | solid | 6 | 0% | 100% | 0% | 73.3 | 98.5 | just-the-cheap-fix ×6, talk-to-my-spouse ×5, need-to-think-about-it ×5, mishears-the-price ×3, thinks-out-loud ×3, minimal-responses ×2, repeats-answered-objection ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, spouse-walks-in ×1, only-fix-what-i-called-for ×1 | 0 |
| drain-kitchen-recurring | 4 | novice | 6 | 0% | 0% | 100% | 32.2 | 9.8 | just-the-cheap-fix ×15, i-know-what-it-is ×4, goes-cold ×3, thinks-out-loud ×3, mishears-the-price ×2 | 0 |
| drain-main-line-roots | 2 | expert | 6 | 67% | 33% | 0% | 89.7 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, neighbor-said ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×2, background-chaos ×2, mixes-up-terms ×1, would-you-do-this ×1, watched-a-video ×1, tests-your-honesty ×1 | 0 |
| drain-main-line-roots | 2 | solid | 6 | 33% | 67% | 0% | 74.2 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 0 |
| drain-main-line-roots | 2 | novice | 6 | 0% | 0% | 100% | 30.7 | 2.3 | brother-in-law-plumber ×12, too-expensive ×8, silence-after-price ×6, i-know-what-it-is ×4, goes-cold ×3 | 0 |
| drain-main-line-roots | 4 | expert | 6 | 67% | 33% | 0% | 89.7 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, neighbor-said ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×2, background-chaos ×2, mixes-up-terms ×1, would-you-do-this ×1, watched-a-video ×1, tests-your-honesty ×1 | 0 |
| drain-main-line-roots | 4 | solid | 6 | 17% | 83% | 0% | 74.3 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, mishears-the-price ×2, talk-to-my-spouse ×1, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 0 |
| drain-main-line-roots | 4 | novice | 6 | 0% | 0% | 100% | 31.7 | 1.7 | brother-in-law-plumber ×12, too-expensive ×7, silence-after-price ×6, i-know-what-it-is ×4, goes-cold ×3 | 0 |
| drain-simple-snake | 2 | expert | 6 | 100% | 0% | 0% | 90.8 | 100.0 | tests-your-honesty ×6, silence-after-price ×6, mishears-the-price ×6, too-expensive ×5, minimal-responses ×3, watched-a-video ×2, i-know-what-it-is ×1, phone-call-hold-on ×1, neighbor-said ×1 | 0 |
| drain-simple-snake | 2 | solid | 6 | 100% | 0% | 0% | 67.5 | 98.5 | tests-your-honesty ×6, silence-after-price ×6, too-expensive ×6, mishears-the-price ×3, minimal-responses ×1, need-to-think-about-it ×1, neighbor-said ×1 | 0 |
| drain-simple-snake | 2 | novice | 6 | 0% | 0% | 100% | 30.0 | 10.2 | too-expensive ×17, silence-after-price ×6, tests-your-honesty ×6, i-know-what-it-is ×4 | 0 |
| drain-simple-snake | 4 | expert | 6 | 100% | 0% | 0% | 90.8 | 100.0 | tests-your-honesty ×6, silence-after-price ×6, mishears-the-price ×6, too-expensive ×5, minimal-responses ×3, watched-a-video ×2, i-know-what-it-is ×1, phone-call-hold-on ×1, neighbor-said ×1 | 0 |
| drain-simple-snake | 4 | solid | 6 | 67% | 33% | 0% | 72.7 | 100.0 | tests-your-honesty ×6, silence-after-price ×6, too-expensive ×6, need-to-think-about-it ×6, mishears-the-price ×3, minimal-responses ×1, neighbor-said ×1 | 0 |
| drain-simple-snake | 4 | novice | 6 | 0% | 0% | 100% | 33.3 | 9.7 | too-expensive ×14, silence-after-price ×6, tests-your-honesty ×6, i-know-what-it-is ×4 | 0 |
| drinking-water-filtration | 2 | expert | 6 | 100% | 0% | 0% | 90.2 | 100.0 | silence-after-price ×6, show-me-in-writing ×6, minimal-responses ×4, mishears-the-price ×3, mixes-up-terms ×2, background-chaos ×2, watched-a-video ×2, thinks-out-loud ×1, neighbor-said ×1, phone-call-hold-on ×1, half-listening ×1 | 0 |
| drinking-water-filtration | 2 | solid | 6 | 83% | 17% | 0% | 67.5 | 95.7 | silence-after-price ×6, show-me-in-writing ×6, need-to-think-about-it ×6, minimal-responses ×2, mishears-the-price ×2, neighbor-said ×2, background-chaos ×1, watched-a-video ×1 | 0 |
| drinking-water-filtration | 2 | novice | 6 | 0% | 0% | 100% | 34.0 | 14.0 | show-me-in-writing ×15, silence-after-price ×6 | 0 |
| drinking-water-filtration | 4 | expert | 6 | 100% | 0% | 0% | 90.2 | 100.0 | silence-after-price ×6, show-me-in-writing ×6, minimal-responses ×4, mishears-the-price ×3, mixes-up-terms ×2, background-chaos ×2, watched-a-video ×2, thinks-out-loud ×1, neighbor-said ×1, phone-call-hold-on ×1, half-listening ×1 | 0 |
| drinking-water-filtration | 4 | solid | 6 | 17% | 83% | 0% | 70.5 | 95.5 | silence-after-price ×6, show-me-in-writing ×6, need-to-think-about-it ×6, minimal-responses ×2, mishears-the-price ×2, neighbor-said ×2, background-chaos ×1, watched-a-video ×1 | 0 |
| drinking-water-filtration | 4 | novice | 6 | 0% | 0% | 100% | 34.0 | 4.0 | show-me-in-writing ×15, silence-after-price ×6 | 0 |
| faucet-install-bad-valves | 2 | expert | 6 | 100% | 0% | 0% | 91.0 | 100.0 | can-you-do-better ×6, only-fix-what-i-called-for ×6, mishears-the-price ×3, phone-call-hold-on ×3, interrupts-how-much ×2, neighbor-said ×1, i-know-what-it-is ×1, watched-a-video ×1, minimal-responses ×1, tests-your-honesty ×1 | 0 |
| faucet-install-bad-valves | 2 | solid | 6 | 100% | 0% | 0% | 70.0 | 94.3 | only-fix-what-i-called-for ×6, can-you-do-better ×6, mishears-the-price ×2, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, interrupts-how-much ×1, tests-your-honesty ×1 | 0 |
| faucet-install-bad-valves | 2 | novice | 6 | 0% | 0% | 100% | 27.5 | 5.8 | can-you-do-better ×12, only-fix-what-i-called-for ×8, are-you-on-commission ×6, goes-cold ×5, i-know-what-it-is ×4, mishears-the-price ×2 | 0 |
| faucet-install-bad-valves | 4 | expert | 6 | 100% | 0% | 0% | 91.0 | 100.0 | can-you-do-better ×6, only-fix-what-i-called-for ×6, mishears-the-price ×3, phone-call-hold-on ×3, interrupts-how-much ×2, neighbor-said ×1, i-know-what-it-is ×1, watched-a-video ×1, minimal-responses ×1, tests-your-honesty ×1 | 0 |
| faucet-install-bad-valves | 4 | solid | 6 | 100% | 0% | 0% | 70.0 | 86.7 | only-fix-what-i-called-for ×6, can-you-do-better ×6, mishears-the-price ×2, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, interrupts-how-much ×1, tests-your-honesty ×1 | 0 |
| faucet-install-bad-valves | 4 | novice | 6 | 0% | 0% | 100% | 29.8 | 3.3 | only-fix-what-i-called-for ×11, can-you-do-better ×11, goes-cold ×4, i-know-what-it-is ×4, are-you-on-commission ×3, mishears-the-price ×2, angry-about-last-company ×2 | 0 |
| gas-smell-flex-line | 2 | expert | 6 | 100% | 0% | 0% | 90.2 | 100.0 | silence-after-price ×6, too-expensive ×6, can-it-wait ×6, mishears-the-price ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2, mixes-up-terms ×2, watched-a-video ×2, repeats-answered-objection ×1, phone-call-hold-on ×1, background-chaos ×1, neighbor-said ×1, half-listening ×1 | 0 |
| gas-smell-flex-line | 2 | solid | 6 | 100% | 0% | 0% | 68.7 | 95.5 | silence-after-price ×6, too-expensive ×6, can-it-wait ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| gas-smell-flex-line | 2 | novice | 6 | 0% | 0% | 100% | 27.8 | 8.7 | too-expensive ×10, can-it-wait ×7, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| gas-smell-flex-line | 4 | expert | 6 | 100% | 0% | 0% | 90.2 | 100.0 | silence-after-price ×6, too-expensive ×6, can-it-wait ×6, mishears-the-price ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2, mixes-up-terms ×2, watched-a-video ×2, repeats-answered-objection ×1, phone-call-hold-on ×1, background-chaos ×1, neighbor-said ×1, half-listening ×1 | 0 |
| gas-smell-flex-line | 4 | solid | 6 | 0% | 100% | 0% | 74.0 | 97.5 | silence-after-price ×6, too-expensive ×6, can-it-wait ×6, need-to-think-about-it ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| gas-smell-flex-line | 4 | novice | 6 | 0% | 0% | 100% | 29.3 | 4.0 | too-expensive ×10, silence-after-price ×6, can-it-wait ×6, i-know-what-it-is ×4 | 0 |
| hard-water-softener | 2 | expert | 6 | 17% | 83% | 0% | 91.8 | 100.0 | neighbor-said ×6, silence-after-price ×6, didnt-budget-for-this ×6, monthly-still-too-much ×6, minimal-responses ×3, mishears-the-price ×3, mixes-up-terms ×2, phone-call-hold-on ×2, watched-a-video ×2, thinks-out-loud ×1 | 0 |
| hard-water-softener | 2 | solid | 6 | 17% | 83% | 0% | 72.5 | 100.0 | neighbor-said ×6, silence-after-price ×6, didnt-budget-for-this ×6, monthly-still-too-much ×3, mishears-the-price ×2, need-to-think-about-it ×1, minimal-responses ×1, spouse-walks-in ×1, phone-call-hold-on ×1, watched-a-video ×1 | 0 |
| hard-water-softener | 2 | novice | 6 | 0% | 0% | 100% | 28.5 | 9.5 | didnt-budget-for-this ×9, silence-after-price ×6, neighbor-said ×6, i-know-what-it-is ×4 | 0 |
| hard-water-softener | 4 | expert | 6 | 17% | 83% | 0% | 91.8 | 100.0 | neighbor-said ×6, silence-after-price ×6, didnt-budget-for-this ×6, monthly-still-too-much ×6, minimal-responses ×3, mishears-the-price ×3, mixes-up-terms ×2, phone-call-hold-on ×2, watched-a-video ×2, thinks-out-loud ×1 | 0 |
| hard-water-softener | 4 | solid | 6 | 0% | 100% | 0% | 73.2 | 100.0 | neighbor-said ×6, silence-after-price ×6, didnt-budget-for-this ×6, monthly-still-too-much ×6, mishears-the-price ×2, minimal-responses ×1, spouse-walks-in ×1, phone-call-hold-on ×1, watched-a-video ×1 | 0 |
| hard-water-softener | 4 | novice | 6 | 0% | 0% | 100% | 31.7 | 8.8 | silence-after-price ×6, neighbor-said ×6, didnt-budget-for-this ×6, i-know-what-it-is ×4 | 0 |
| hydro-jet-rental | 2 | expert | 6 | 100% | 0% | 0% | 90.7 | 100.0 | handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×6, silence-after-price ×5, thinks-out-loud ×4, minimal-responses ×4, i-know-what-it-is ×2, background-chaos ×2, mishears-the-price ×2, phone-call-hold-on ×2, watched-a-video ×1, half-listening ×1, tests-your-honesty ×1 | 0 |
| hydro-jet-rental | 2 | solid | 6 | 100% | 0% | 0% | 71.0 | 97.5 | silence-after-price ×6, handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×5, minimal-responses ×2, mishears-the-price ×2, phone-call-hold-on ×2, background-chaos ×1, tests-your-honesty ×1 | 0 |
| hydro-jet-rental | 2 | novice | 6 | 0% | 0% | 100% | 27.5 | 0.0 | handyman-can-do-it ×12, just-the-cheap-fix ×11, can-you-do-better ×6, goes-cold ×5, silence-after-price ×4, i-know-what-it-is ×4, mishears-the-price ×2 | 0 |
| hydro-jet-rental | 4 | expert | 6 | 100% | 0% | 0% | 90.7 | 100.0 | handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×6, silence-after-price ×5, thinks-out-loud ×4, minimal-responses ×4, i-know-what-it-is ×2, background-chaos ×2, mishears-the-price ×2, phone-call-hold-on ×2, watched-a-video ×1, half-listening ×1, tests-your-honesty ×1 | 0 |
| hydro-jet-rental | 4 | solid | 6 | 83% | 17% | 0% | 71.7 | 94.7 | silence-after-price ×6, handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×5, mishears-the-price ×2, phone-call-hold-on ×2, i-know-what-it-is ×1, background-chaos ×1, neighbor-said ×1, tests-your-honesty ×1 | 0 |
| hydro-jet-rental | 4 | novice | 6 | 0% | 0% | 100% | 26.0 | 0.0 | handyman-can-do-it ×12, just-the-cheap-fix ×10, can-you-do-better ×6, silence-after-price ×5, goes-cold ×5, i-know-what-it-is ×4, angry-about-last-company ×2, mishears-the-price ×1 | 0 |
| main-shutoff-seized | 2 | expert | 6 | 100% | 0% | 0% | 88.7 | 100.0 | only-fix-what-i-called-for ×6, silence-after-price ×5, mishears-the-price ×4, thinks-out-loud ×3, neighbor-said ×3, interrupts-how-much ×2, mixes-up-terms ×2, watched-a-video ×2, half-listening ×1, phone-call-hold-on ×1, i-know-what-it-is ×1 | 0 |
| main-shutoff-seized | 2 | solid | 6 | 100% | 0% | 0% | 70.5 | 100.0 | silence-after-price ×6, only-fix-what-i-called-for ×6, selling-soon ×6, mishears-the-price ×3, neighbor-said ×2, half-listening ×1, phone-call-hold-on ×1, mixes-up-terms ×1, i-know-what-it-is ×1, watched-a-video ×1 | 0 |
| main-shutoff-seized | 2 | novice | 6 | 0% | 0% | 100% | 28.7 | 5.0 | only-fix-what-i-called-for ×10, selling-soon ×7, silence-after-price ×4, i-know-what-it-is ×4, mishears-the-price ×2, goes-cold ×2 | 0 |
| main-shutoff-seized | 4 | expert | 6 | 100% | 0% | 0% | 88.7 | 100.0 | only-fix-what-i-called-for ×6, silence-after-price ×5, mishears-the-price ×4, thinks-out-loud ×3, neighbor-said ×3, interrupts-how-much ×2, mixes-up-terms ×2, watched-a-video ×2, half-listening ×1, phone-call-hold-on ×1, i-know-what-it-is ×1 | 0 |
| main-shutoff-seized | 4 | solid | 6 | 0% | 100% | 0% | 74.3 | 100.0 | silence-after-price ×6, only-fix-what-i-called-for ×6, selling-soon ×6, just-repair-it ×6, mishears-the-price ×3, neighbor-said ×2, half-listening ×1, phone-call-hold-on ×1, mixes-up-terms ×1, i-know-what-it-is ×1, watched-a-video ×1 | 0 |
| main-shutoff-seized | 4 | novice | 6 | 0% | 0% | 100% | 33.3 | 7.7 | only-fix-what-i-called-for ×12, silence-after-price ×5, i-know-what-it-is ×4, selling-soon ×3, angry-about-last-company ×2, mishears-the-price ×1, goes-cold ×1 | 0 |
| maintenance-visit-anode | 2 | expert | 6 | 100% | 0% | 0% | 88.3 | 100.0 | how-do-i-know-its-broken ×6, silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, mishears-the-price ×5, paid-less-last-time ×5, minimal-responses ×4, tests-your-honesty ×2, neighbor-said ×2, i-know-what-it-is ×1, interrupts-how-much ×1, half-listening ×1, phone-call-hold-on ×1, thinks-out-loud ×1 | 0 |
| maintenance-visit-anode | 2 | solid | 6 | 100% | 0% | 0% | 69.0 | 98.5 | how-do-i-know-its-broken ×6, silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, paid-less-last-time ×5, mishears-the-price ×2, minimal-responses ×1, neighbor-said ×1, i-know-what-it-is ×1 | 0 |
| maintenance-visit-anode | 2 | novice | 6 | 0% | 0% | 100% | 23.0 | 0.0 | what-am-i-paying-for ×11, how-do-i-know-its-broken ×10, home-warranty-covers-it ×9, paid-less-last-time ×7, silence-after-price ×6, goes-cold ×5, i-know-what-it-is ×4 | 0 |
| maintenance-visit-anode | 4 | expert | 6 | 100% | 0% | 0% | 88.3 | 100.0 | how-do-i-know-its-broken ×6, silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, mishears-the-price ×5, paid-less-last-time ×5, minimal-responses ×4, tests-your-honesty ×2, neighbor-said ×2, i-know-what-it-is ×1, interrupts-how-much ×1, half-listening ×1, phone-call-hold-on ×1, thinks-out-loud ×1 | 0 |
| maintenance-visit-anode | 4 | solid | 6 | 67% | 33% | 0% | 70.7 | 97.8 | how-do-i-know-its-broken ×6, silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, paid-less-last-time ×5, mishears-the-price ×2, minimal-responses ×1, neighbor-said ×1, i-know-what-it-is ×1 | 0 |
| maintenance-visit-anode | 4 | novice | 6 | 0% | 0% | 100% | 19.0 | 0.0 | how-do-i-know-its-broken ×12, home-warranty-covers-it ×10, what-am-i-paying-for ×9, silence-after-price ×6, paid-less-last-time ×5, goes-cold ×4, i-know-what-it-is ×4, angry-about-last-company ×2 | 0 |
| prv-high-pressure | 2 | expert | 6 | 100% | 0% | 0% | 89.2 | 100.0 | i-know-what-it-is ×6, need-three-bids ×6, found-it-cheaper ×5, silence-after-price ×4, thinks-out-loud ×4, neighbor-said ×3, watched-a-video ×2, interrupts-how-much ×1, bigger-than-needed ×1, background-chaos ×1, tests-your-honesty ×1, phone-call-hold-on ×1 | 0 |
| prv-high-pressure | 2 | solid | 6 | 100% | 0% | 0% | 67.7 | 91.2 | i-know-what-it-is ×6, silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×5, bigger-than-needed ×1, neighbor-said ×1, tests-your-honesty ×1, thinks-out-loud ×1, phone-call-hold-on ×1, watched-a-video ×1 | 0 |
| prv-high-pressure | 2 | novice | 6 | 0% | 0% | 100% | 27.3 | 1.8 | found-it-cheaper ×12, need-three-bids ×11, i-know-what-it-is ×6, silence-after-price ×5, bigger-than-needed ×3, goes-cold ×2 | 0 |
| prv-high-pressure | 4 | expert | 6 | 100% | 0% | 0% | 89.2 | 100.0 | i-know-what-it-is ×6, need-three-bids ×6, found-it-cheaper ×5, silence-after-price ×4, thinks-out-loud ×4, neighbor-said ×3, watched-a-video ×2, interrupts-how-much ×1, bigger-than-needed ×1, background-chaos ×1, tests-your-honesty ×1, phone-call-hold-on ×1 | 0 |
| prv-high-pressure | 4 | solid | 6 | 83% | 17% | 0% | 73.2 | 98.8 | i-know-what-it-is ×6, silence-after-price ×6, bigger-than-needed ×6, found-it-cheaper ×6, need-three-bids ×5, neighbor-said ×1, tests-your-honesty ×1, thinks-out-loud ×1, phone-call-hold-on ×1, watched-a-video ×1 | 0 |
| prv-high-pressure | 4 | novice | 6 | 0% | 0% | 100% | 30.8 | 2.8 | found-it-cheaper ×11, i-know-what-it-is ×6, silence-after-price ×5, need-three-bids ×5, angry-about-last-company ×4, goes-cold ×3, bigger-than-needed ×2, thinks-out-loud ×1 | 0 |
| remodel-rough-in | 2 | expert | 6 | 100% | 0% | 0% | 91.2 | 100.0 | silence-after-price ×6, ill-do-part-myself ×6, brother-in-law-plumber ×6, too-expensive ×6, neighbor-said ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×2, background-chaos ×2, mixes-up-terms ×1, watched-a-video ×1, tests-your-honesty ×1 | 0 |
| remodel-rough-in | 2 | solid | 6 | 100% | 0% | 0% | 74.2 | 100.0 | silence-after-price ×6, ill-do-part-myself ×6, brother-in-law-plumber ×6, too-expensive ×5, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 0 |
| remodel-rough-in | 2 | novice | 6 | 0% | 0% | 100% | 25.5 | 0.0 | brother-in-law-plumber ×11, ill-do-part-myself ×10, too-expensive ×9, silence-after-price ×6, goes-cold ×4, i-know-what-it-is ×4 | 0 |
| remodel-rough-in | 4 | expert | 6 | 100% | 0% | 0% | 91.2 | 100.0 | silence-after-price ×6, ill-do-part-myself ×6, brother-in-law-plumber ×6, too-expensive ×6, neighbor-said ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×2, background-chaos ×2, mixes-up-terms ×1, watched-a-video ×1, tests-your-honesty ×1 | 0 |
| remodel-rough-in | 4 | solid | 6 | 100% | 0% | 0% | 73.7 | 100.0 | silence-after-price ×6, ill-do-part-myself ×6, brother-in-law-plumber ×6, too-expensive ×5, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 0 |
| remodel-rough-in | 4 | novice | 6 | 0% | 0% | 100% | 25.5 | 0.0 | brother-in-law-plumber ×11, ill-do-part-myself ×10, too-expensive ×9, silence-after-price ×6, goes-cold ×4, i-know-what-it-is ×4 | 0 |
| repipe-galvanized | 2 | expert | 6 | 67% | 33% | 0% | 88.5 | 100.0 | silence-after-price ×6, do-i-need-the-code-stuff ×5, what-am-i-paying-for ×5, thinks-out-loud ×4, i-know-what-it-is ×3, minimal-responses ×3, repeats-answered-objection ×2, neighbor-said ×2, watched-a-video ×2 | 0 |
| repipe-galvanized | 2 | solid | 6 | 17% | 83% | 0% | 75.0 | 100.0 | silence-after-price ×6, do-i-need-the-code-stuff ×6, what-am-i-paying-for ×5, phone-call-hold-on ×2, minimal-responses ×1, half-listening ×1, neighbor-said ×1, i-know-what-it-is ×1, watched-a-video ×1 | 0 |
| repipe-galvanized | 2 | novice | 6 | 0% | 0% | 100% | 24.0 | 3.2 | you-always-upsell ×13, what-am-i-paying-for ×7, silence-after-price ×6, do-i-need-the-code-stuff ×6, i-know-what-it-is ×4, goes-cold ×3 | 0 |
| repipe-galvanized | 4 | expert | 6 | 67% | 33% | 0% | 88.7 | 100.0 | silence-after-price ×6, what-am-i-paying-for ×6, do-i-need-the-code-stuff ×6, thinks-out-loud ×4, watched-a-video ×3, i-know-what-it-is ×3, neighbor-said ×3, you-always-upsell ×1, tests-your-honesty ×1, half-listening ×1, minimal-responses ×1, repeats-answered-objection ×1 | 0 |
| repipe-galvanized | 4 | solid | 6 | 17% | 83% | 0% | 74.8 | 99.5 | silence-after-price ×6, what-am-i-paying-for ×6, do-i-need-the-code-stuff ×5, phone-call-hold-on ×2, you-always-upsell ×1, tests-your-honesty ×1, i-know-what-it-is ×1, half-listening ×1, neighbor-said ×1 | 0 |
| repipe-galvanized | 4 | novice | 6 | 0% | 0% | 100% | 27.8 | 5.2 | you-always-upsell ×11, what-am-i-paying-for ×7, silence-after-price ×6, i-know-what-it-is ×4, do-i-need-the-code-stuff ×3, goes-cold ×2, angry-about-last-company ×2 | 0 |
| second-opinion-quote | 2 | expert | 6 | 100% | 0% | 0% | 90.3 | 100.0 | silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×6, i-know-what-it-is ×3, minimal-responses ×3, thinks-out-loud ×2, background-chaos ×2, neighbor-said ×2, phone-call-hold-on ×2, watched-a-video ×2 | 0 |
| second-opinion-quote | 2 | solid | 6 | 100% | 0% | 0% | 71.2 | 99.7 | silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×6, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, thinks-out-loud ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| second-opinion-quote | 2 | novice | 6 | 0% | 0% | 100% | 30.7 | 5.2 | found-it-cheaper ×13, need-three-bids ×6, silence-after-price ×4, i-know-what-it-is ×4, goes-cold ×3, thinks-out-loud ×2 | 0 |
| second-opinion-quote | 4 | expert | 6 | 100% | 0% | 0% | 90.3 | 100.0 | silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×6, i-know-what-it-is ×3, minimal-responses ×3, thinks-out-loud ×2, background-chaos ×2, neighbor-said ×2, phone-call-hold-on ×2, watched-a-video ×2 | 0 |
| second-opinion-quote | 4 | solid | 6 | 100% | 0% | 0% | 71.7 | 99.0 | silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×6, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| second-opinion-quote | 4 | novice | 6 | 0% | 0% | 100% | 30.5 | 2.3 | found-it-cheaper ×12, need-three-bids ×7, silence-after-price ×5, i-know-what-it-is ×4, goes-cold ×2, angry-about-last-company ×2, thinks-out-loud ×1 | 0 |
| sewer-camera-before-sale | 2 | expert | 6 | 100% | 0% | 0% | 89.3 | 100.0 | silence-after-price ×6, selling-soon ×6, mishears-the-price ×4, thinks-out-loud ×3, neighbor-said ×3, interrupts-how-much ×2, mixes-up-terms ×2, watched-a-video ×2, i-know-what-it-is ×2, tests-your-honesty ×1, repeats-answered-objection ×1, phone-call-hold-on ×1 | 0 |
| sewer-camera-before-sale | 2 | solid | 6 | 100% | 0% | 0% | 67.2 | 99.3 | silence-after-price ×6, selling-soon ×6, just-repair-it ×6, mishears-the-price ×3, neighbor-said ×2, half-listening ×1, phone-call-hold-on ×1, mixes-up-terms ×1, i-know-what-it-is ×1, watched-a-video ×1 | 0 |
| sewer-camera-before-sale | 2 | novice | 6 | 0% | 0% | 100% | 30.3 | 9.3 | selling-soon ×18, silence-after-price ×4, i-know-what-it-is ×4, mishears-the-price ×2, goes-cold ×2 | 0 |
| sewer-camera-before-sale | 4 | expert | 6 | 100% | 0% | 0% | 89.3 | 100.0 | silence-after-price ×6, selling-soon ×6, mishears-the-price ×4, thinks-out-loud ×3, neighbor-said ×3, interrupts-how-much ×2, mixes-up-terms ×2, watched-a-video ×2, i-know-what-it-is ×2, tests-your-honesty ×1, repeats-answered-objection ×1, phone-call-hold-on ×1 | 0 |
| sewer-camera-before-sale | 4 | solid | 6 | 0% | 100% | 0% | 70.7 | 100.0 | silence-after-price ×6, selling-soon ×6, just-repair-it ×6, can-it-wait ×6, mishears-the-price ×3, neighbor-said ×2, half-listening ×1, phone-call-hold-on ×1, mixes-up-terms ×1, i-know-what-it-is ×1, watched-a-video ×1 | 0 |
| sewer-camera-before-sale | 4 | novice | 6 | 0% | 0% | 100% | 33.3 | 7.7 | selling-soon ×15, silence-after-price ×5, i-know-what-it-is ×4, angry-about-last-company ×2, mishears-the-price ×1, goes-cold ×1 | 0 |
| slab-leak-detection | 2 | expert | 6 | 100% | 0% | 0% | 84.5 | 100.0 | how-do-i-know-its-broken ×6, silence-after-price ×5, thinks-out-loud ×4, neighbor-said ×3, i-know-what-it-is ×2, minimal-responses ×2, watched-a-video ×2, background-chaos ×2, phone-call-hold-on ×1, mixes-up-terms ×1, tests-your-honesty ×1 | 0 |
| slab-leak-detection | 2 | solid | 6 | 100% | 0% | 0% | 68.0 | 98.5 | how-do-i-know-its-broken ×6, silence-after-price ×6, last-company-ripped-me-off ×4, neighbor-said ×2, thinks-out-loud ×1, watched-a-video ×1, background-chaos ×1 | 0 |
| slab-leak-detection | 2 | novice | 6 | 0% | 0% | 100% | 31.5 | 1.7 | how-do-i-know-its-broken ×11, last-company-ripped-me-off ×10, goes-cold ×4, show-me-in-writing ×3, silence-after-price ×3, i-know-what-it-is ×1, thinks-out-loud ×1 | 0 |
| slab-leak-detection | 4 | expert | 6 | 100% | 0% | 0% | 86.2 | 100.0 | how-do-i-know-its-broken ×6, silence-after-price ×5, thinks-out-loud ×5, last-company-ripped-me-off ×3, tests-your-honesty ×2, mixes-up-terms ×2, i-know-what-it-is ×1, phone-call-hold-on ×1, half-listening ×1, background-chaos ×1, watched-a-video ×1, neighbor-said ×1 | 0 |
| slab-leak-detection | 4 | solid | 6 | 83% | 17% | 0% | 70.5 | 98.5 | last-company-ripped-me-off ×6, how-do-i-know-its-broken ×6, silence-after-price ×6, thinks-out-loud ×2, minimal-responses ×1, background-chaos ×1 | 0 |
| slab-leak-detection | 4 | novice | 6 | 0% | 0% | 100% | 33.0 | 0.0 | last-company-ripped-me-off ×11, how-do-i-know-its-broken ×11, show-me-in-writing ×3, goes-cold ×3, silence-after-price ×3, angry-about-last-company ×1, thinks-out-loud ×1 | 0 |
| tank-vs-tankless-family | 2 | expert | 6 | 100% | 0% | 0% | 90.8 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, neighbor-said ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×2, mixes-up-terms ×1, watched-a-video ×1, background-chaos ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 0 |
| tank-vs-tankless-family | 2 | solid | 6 | 100% | 0% | 0% | 73.7 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 0 |
| tank-vs-tankless-family | 2 | novice | 6 | 0% | 0% | 100% | 30.7 | 2.3 | brother-in-law-plumber ×12, too-expensive ×8, silence-after-price ×6, i-know-what-it-is ×4, goes-cold ×3 | 0 |
| tank-vs-tankless-family | 4 | expert | 6 | 100% | 0% | 0% | 90.8 | 100.0 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, neighbor-said ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×2, mixes-up-terms ×1, watched-a-video ×1, background-chaos ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 0 |
| tank-vs-tankless-family | 4 | solid | 6 | 83% | 17% | 0% | 73.8 | 99.8 | silence-after-price ×6, brother-in-law-plumber ×6, too-expensive ×6, mishears-the-price ×2, talk-to-my-spouse ×1, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 0 |
| tank-vs-tankless-family | 4 | novice | 6 | 0% | 0% | 100% | 31.7 | 1.7 | brother-in-law-plumber ×12, too-expensive ×7, silence-after-price ×6, i-know-what-it-is ×4, goes-cold ×3 | 0 |
| toilet-running-old | 2 | expert | 6 | 100% | 0% | 0% | 91.5 | 100.0 | silence-after-price ×6, home-warranty-covers-it ×6, paid-less-last-time ×6, what-am-i-paying-for ×5, minimal-responses ×4, mishears-the-price ×4, neighbor-said ×2, interrupts-how-much ×1, half-listening ×1, phone-call-hold-on ×1, tests-your-honesty ×1, thinks-out-loud ×1 | 0 |
| toilet-running-old | 2 | solid | 6 | 100% | 0% | 0% | 68.7 | 94.5 | silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, paid-less-last-time ×3, mishears-the-price ×2, neighbor-said ×2, minimal-responses ×1, half-listening ×1, mixes-up-terms ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 0 |
| toilet-running-old | 2 | novice | 6 | 0% | 0% | 100% | 24.8 | 4.2 | home-warranty-covers-it ×13, what-am-i-paying-for ×9, paid-less-last-time ×7, silence-after-price ×6, goes-cold ×4, i-know-what-it-is ×4 | 0 |
| toilet-running-old | 4 | expert | 6 | 100% | 0% | 0% | 91.5 | 100.0 | silence-after-price ×6, home-warranty-covers-it ×6, paid-less-last-time ×6, what-am-i-paying-for ×5, minimal-responses ×4, mishears-the-price ×4, neighbor-said ×2, interrupts-how-much ×1, half-listening ×1, phone-call-hold-on ×1, tests-your-honesty ×1, thinks-out-loud ×1 | 0 |
| toilet-running-old | 4 | solid | 6 | 67% | 33% | 0% | 71.8 | 95.3 | silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, paid-less-last-time ×4, mishears-the-price ×2, neighbor-said ×2, minimal-responses ×1, half-listening ×1, mixes-up-terms ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 0 |
| toilet-running-old | 4 | novice | 6 | 0% | 0% | 100% | 22.3 | 0.5 | home-warranty-covers-it ×12, what-am-i-paying-for ×10, silence-after-price ×6, paid-less-last-time ×5, i-know-what-it-is ×4, goes-cold ×3, angry-about-last-company ×2 | 0 |
| wh-code-upgrades-rental | 2 | expert | 6 | 83% | 17% | 0% | 92.3 | 100.0 | do-i-need-the-code-stuff ×6, handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×6, silence-after-price ×5, thinks-out-loud ×5, minimal-responses ×4, background-chaos ×3, phone-call-hold-on ×3, i-know-what-it-is ×2, watched-a-video ×1, mishears-the-price ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 2 | solid | 6 | 100% | 0% | 0% | 79.0 | 100.0 | silence-after-price ×6, do-i-need-the-code-stuff ×6, just-the-cheap-fix ×6, handyman-can-do-it ×5, can-you-do-better ×5, minimal-responses ×2, mishears-the-price ×2, phone-call-hold-on ×2, background-chaos ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 2 | novice | 6 | 0% | 0% | 100% | 24.0 | 2.5 | just-the-cheap-fix ×11, do-i-need-the-code-stuff ×9, can-you-do-better ×9, handyman-can-do-it ×7, goes-cold ×5, silence-after-price ×4, i-know-what-it-is ×4, mishears-the-price ×2 | 0 |
| wh-code-upgrades-rental | 4 | expert | 6 | 83% | 17% | 0% | 93.2 | 100.0 | do-i-need-the-code-stuff ×6, handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×6, silence-after-price ×5, thinks-out-loud ×5, minimal-responses ×4, background-chaos ×3, phone-call-hold-on ×3, i-know-what-it-is ×2, watched-a-video ×1, mishears-the-price ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 4 | solid | 6 | 83% | 17% | 0% | 79.3 | 100.0 | silence-after-price ×6, do-i-need-the-code-stuff ×6, just-the-cheap-fix ×6, can-you-do-better ×6, handyman-can-do-it ×5, mishears-the-price ×2, phone-call-hold-on ×2, i-know-what-it-is ×1, background-chaos ×1, neighbor-said ×1, tests-your-honesty ×1 | 0 |
| wh-code-upgrades-rental | 4 | novice | 6 | 0% | 0% | 100% | 21.7 | 0.0 | do-i-need-the-code-stuff ×12, just-the-cheap-fix ×10, can-you-do-better ×8, silence-after-price ×5, goes-cold ×5, handyman-can-do-it ×4, i-know-what-it-is ×4, angry-about-last-company ×2, mishears-the-price ×1 | 0 |
| wh-first-home-rumbling | 2 | expert | 6 | 100% | 0% | 0% | 85.3 | 100.0 | silence-after-price ×6, thinks-out-loud ×3, mixes-up-terms ×3, mishears-the-price ×3, minimal-responses ×2, phone-call-hold-on ×2, watched-a-video ×2, background-chaos ×1, neighbor-said ×1, i-know-what-it-is ×1, didnt-budget-for-this ×1 | 0 |
| wh-first-home-rumbling | 2 | solid | 6 | 83% | 17% | 0% | 69.8 | 99.2 | silence-after-price ×6, need-to-think-about-it ×4, monthly-still-too-much ×3, didnt-budget-for-this ×3, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, watched-a-video ×1 | 0 |
| wh-first-home-rumbling | 2 | novice | 6 | 0% | 0% | 100% | 26.5 | 6.7 | didnt-budget-for-this ×12, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-first-home-rumbling | 4 | expert | 6 | 100% | 0% | 0% | 85.3 | 100.0 | silence-after-price ×6, thinks-out-loud ×3, mixes-up-terms ×3, mishears-the-price ×3, minimal-responses ×2, phone-call-hold-on ×2, watched-a-video ×2, background-chaos ×1, neighbor-said ×1, i-know-what-it-is ×1, didnt-budget-for-this ×1 | 0 |
| wh-first-home-rumbling | 4 | solid | 6 | 17% | 83% | 0% | 73.3 | 99.7 | silence-after-price ×6, monthly-still-too-much ×6, need-to-think-about-it ×5, didnt-budget-for-this ×3, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, spouse-walks-in ×1, neighbor-said ×1, phone-call-hold-on ×1, watched-a-video ×1 | 0 |
| wh-first-home-rumbling | 4 | novice | 6 | 0% | 0% | 100% | 30.5 | 9.7 | didnt-budget-for-this ×8, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-heat-pump-rebate | 2 | expert | 6 | 100% | 0% | 0% | 88.0 | 100.0 | silence-after-price ×6, do-i-need-the-code-stuff ×5, what-am-i-paying-for ×5, thinks-out-loud ×4, i-know-what-it-is ×3, minimal-responses ×3, neighbor-said ×2, watched-a-video ×2, repeats-answered-objection ×1 | 0 |
| wh-heat-pump-rebate | 2 | solid | 6 | 100% | 0% | 0% | 70.7 | 94.3 | silence-after-price ×6, do-i-need-the-code-stuff ×6, what-am-i-paying-for ×5, you-always-upsell ×2, phone-call-hold-on ×2, minimal-responses ×1, half-listening ×1, neighbor-said ×1, i-know-what-it-is ×1, watched-a-video ×1 | 0 |
| wh-heat-pump-rebate | 2 | novice | 6 | 0% | 0% | 100% | 24.0 | 3.2 | you-always-upsell ×13, what-am-i-paying-for ×7, silence-after-price ×6, do-i-need-the-code-stuff ×6, i-know-what-it-is ×4, goes-cold ×3 | 0 |
| wh-heat-pump-rebate | 4 | expert | 6 | 100% | 0% | 0% | 88.5 | 100.0 | silence-after-price ×6, what-am-i-paying-for ×6, do-i-need-the-code-stuff ×6, thinks-out-loud ×4, watched-a-video ×3, i-know-what-it-is ×3, neighbor-said ×3, you-always-upsell ×1, tests-your-honesty ×1, half-listening ×1, minimal-responses ×1, repeats-answered-objection ×1 | 0 |
| wh-heat-pump-rebate | 4 | solid | 6 | 50% | 50% | 0% | 73.5 | 96.7 | you-always-upsell ×6, silence-after-price ×6, do-i-need-the-code-stuff ×6, what-am-i-paying-for ×5, phone-call-hold-on ×2, tests-your-honesty ×1, i-know-what-it-is ×1, half-listening ×1, neighbor-said ×1 | 0 |
| wh-heat-pump-rebate | 4 | novice | 6 | 0% | 0% | 100% | 27.8 | 5.2 | you-always-upsell ×11, what-am-i-paying-for ×7, silence-after-price ×6, i-know-what-it-is ×4, do-i-need-the-code-stuff ×3, goes-cold ×2, angry-about-last-company ×2 | 0 |
| wh-repair-or-replace-9yr | 2 | expert | 6 | 100% | 0% | 0% | 79.7 | 100.0 | tests-your-honesty ×6, silence-after-price ×6, thinks-out-loud ×5, neighbor-said ×3, minimal-responses ×2, watched-a-video ×2, how-do-i-know-its-broken ×1, background-chaos ×1, mixes-up-terms ×1 | 0 |
| wh-repair-or-replace-9yr | 2 | solid | 6 | 83% | 17% | 0% | 69.2 | 99.5 | last-company-ripped-me-off ×6, tests-your-honesty ×6, silence-after-price ×6, how-do-i-know-its-broken ×6, neighbor-said ×2, thinks-out-loud ×1, watched-a-video ×1, background-chaos ×1 | 0 |
| wh-repair-or-replace-9yr | 2 | novice | 6 | 0% | 0% | 100% | 29.8 | 4.0 | last-company-ripped-me-off ×10, show-me-in-writing ×10, tests-your-honesty ×6, how-do-i-know-its-broken ×5, goes-cold ×3, silence-after-price ×3, i-know-what-it-is ×1, thinks-out-loud ×1 | 0 |
| wh-repair-or-replace-9yr | 4 | expert | 6 | 100% | 0% | 0% | 82.8 | 100.0 | tests-your-honesty ×6, silence-after-price ×6, last-company-ripped-me-off ×4, thinks-out-loud ×4, neighbor-said ×2, how-do-i-know-its-broken ×2, half-listening ×2, background-chaos ×1, watched-a-video ×1 | 0 |
| wh-repair-or-replace-9yr | 4 | solid | 6 | 0% | 100% | 0% | 71.7 | 99.7 | last-company-ripped-me-off ×6, tests-your-honesty ×6, silence-after-price ×6, how-do-i-know-its-broken ×6, show-me-in-writing ×6, minimal-responses ×1, background-chaos ×1, thinks-out-loud ×1 | 0 |
| wh-repair-or-replace-9yr | 4 | novice | 6 | 0% | 0% | 100% | 31.5 | 0.7 | last-company-ripped-me-off ×11, show-me-in-writing ×10, tests-your-honesty ×6, how-do-i-know-its-broken ×5, silence-after-price ×3, goes-cold ×2, angry-about-last-company ×1, thinks-out-loud ×1 | 0 |
| wh-replacement-spanish | 2 | expert | 6 | 100% | 0% | 0% | 90.5 | 100.0 | silence-after-price ×6, show-me-in-writing ×6, minimal-responses ×4, background-chaos ×3, thinks-out-loud ×2, mixes-up-terms ×2, mishears-the-price ×2, neighbor-said ×2, watched-a-video ×2, phone-call-hold-on ×1 | 0 |
| wh-replacement-spanish | 2 | solid | 6 | 100% | 0% | 0% | 71.7 | 100.0 | silence-after-price ×6, show-me-in-writing ×6, minimal-responses ×2, mishears-the-price ×2, neighbor-said ×2, background-chaos ×1, watched-a-video ×1 | 0 |
| wh-replacement-spanish | 2 | novice | 6 | 0% | 0% | 100% | 34.0 | 14.0 | show-me-in-writing ×15, silence-after-price ×6 | 0 |
| wh-replacement-spanish | 4 | expert | 6 | 100% | 0% | 0% | 90.5 | 100.0 | silence-after-price ×6, show-me-in-writing ×6, minimal-responses ×4, thinks-out-loud ×2, mixes-up-terms ×2, mishears-the-price ×2, background-chaos ×2, neighbor-said ×2, watched-a-video ×2, phone-call-hold-on ×1, half-listening ×1 | 0 |
| wh-replacement-spanish | 4 | solid | 6 | 100% | 0% | 0% | 71.7 | 99.8 | silence-after-price ×6, show-me-in-writing ×6, minimal-responses ×2, mishears-the-price ×2, neighbor-said ×2, background-chaos ×1, watched-a-video ×1 | 0 |
| wh-replacement-spanish | 4 | novice | 6 | 0% | 0% | 100% | 34.0 | 4.0 | show-me-in-writing ×15, silence-after-price ×6 | 0 |
| wh-tank-landlord-tenant | 2 | expert | 6 | 83% | 17% | 0% | 93.0 | 100.0 | handyman-can-do-it ×6, can-you-do-better ×6, silence-after-price ×5, thinks-out-loud ×5, just-the-cheap-fix ×5, minimal-responses ×4, background-chaos ×3, phone-call-hold-on ×3, i-know-what-it-is ×2, watched-a-video ×1, mishears-the-price ×1, tests-your-honesty ×1 | 0 |
| wh-tank-landlord-tenant | 2 | solid | 6 | 100% | 0% | 0% | 79.0 | 100.0 | silence-after-price ×6, handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×5, minimal-responses ×2, mishears-the-price ×2, phone-call-hold-on ×2, background-chaos ×1, tests-your-honesty ×1 | 0 |
| wh-tank-landlord-tenant | 2 | novice | 6 | 0% | 0% | 100% | 27.5 | 0.0 | handyman-can-do-it ×12, just-the-cheap-fix ×11, can-you-do-better ×6, goes-cold ×5, silence-after-price ×4, i-know-what-it-is ×4, mishears-the-price ×2 | 0 |
| wh-tank-landlord-tenant | 4 | expert | 6 | 83% | 17% | 0% | 93.0 | 100.0 | handyman-can-do-it ×6, can-you-do-better ×6, silence-after-price ×5, thinks-out-loud ×5, just-the-cheap-fix ×5, minimal-responses ×4, background-chaos ×3, phone-call-hold-on ×3, i-know-what-it-is ×2, watched-a-video ×1, mishears-the-price ×1, tests-your-honesty ×1 | 0 |
| wh-tank-landlord-tenant | 4 | solid | 6 | 100% | 0% | 0% | 78.5 | 100.0 | silence-after-price ×6, handyman-can-do-it ×6, just-the-cheap-fix ×6, can-you-do-better ×5, mishears-the-price ×2, phone-call-hold-on ×2, i-know-what-it-is ×1, background-chaos ×1, neighbor-said ×1, tests-your-honesty ×1 | 0 |
| wh-tank-landlord-tenant | 4 | novice | 6 | 0% | 0% | 100% | 26.0 | 0.0 | handyman-can-do-it ×12, just-the-cheap-fix ×10, can-you-do-better ×6, silence-after-price ×5, goes-cold ×5, i-know-what-it-is ×4, angry-about-last-company ×2, mishears-the-price ×1 | 0 |
| wh-tank-no-hot-water | 2 | expert | 6 | 100% | 0% | 0% | 90.0 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×4, i-know-what-it-is ×2, minimal-responses ×2, mixes-up-terms ×2, watched-a-video ×2, thinks-out-loud ×1, phone-call-hold-on ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| wh-tank-no-hot-water | 2 | solid | 6 | 100% | 0% | 0% | 71.8 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| wh-tank-no-hot-water | 2 | novice | 6 | 0% | 0% | 100% | 29.8 | 10.8 | too-expensive ×16, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-tank-no-hot-water | 4 | expert | 6 | 100% | 0% | 0% | 90.0 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×4, i-know-what-it-is ×2, minimal-responses ×2, mixes-up-terms ×2, watched-a-video ×2, thinks-out-loud ×1, phone-call-hold-on ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| wh-tank-no-hot-water | 4 | solid | 6 | 100% | 0% | 0% | 71.8 | 100.0 | silence-after-price ×6, too-expensive ×6, mishears-the-price ×2, minimal-responses ×1, background-chaos ×1, phone-call-hold-on ×1, neighbor-said ×1, mixes-up-terms ×1, watched-a-video ×1 | 0 |
| wh-tank-no-hot-water | 4 | novice | 6 | 0% | 0% | 100% | 33.5 | 10.3 | too-expensive ×13, silence-after-price ×6, i-know-what-it-is ×4 | 0 |
| wh-tankless-descale | 2 | expert | 6 | 100% | 0% | 0% | 90.8 | 100.0 | can-you-do-better ×6, mishears-the-price ×5, interrupts-how-much ×2, phone-call-hold-on ×2, neighbor-said ×1, i-know-what-it-is ×1, watched-a-video ×1, background-chaos ×1, minimal-responses ×1, tests-your-honesty ×1 | 3 |
| wh-tankless-descale | 2 | solid | 6 | 100% | 0% | 0% | 66.5 | 90.5 | can-you-do-better ×6, mishears-the-price ×3, interrupts-how-much ×2, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 3 |
| wh-tankless-descale | 2 | novice | 6 | 0% | 0% | 100% | 26.7 | 9.5 | can-you-do-better ×16, are-you-on-commission ×6, i-know-what-it-is ×4, goes-cold ×3, mishears-the-price ×2 | 0 |
| wh-tankless-descale | 4 | expert | 6 | 100% | 0% | 0% | 90.8 | 100.0 | can-you-do-better ×6, mishears-the-price ×5, interrupts-how-much ×2, phone-call-hold-on ×2, neighbor-said ×1, i-know-what-it-is ×1, watched-a-video ×1, background-chaos ×1, minimal-responses ×1, tests-your-honesty ×1 | 3 |
| wh-tankless-descale | 4 | solid | 6 | 100% | 0% | 0% | 66.5 | 81.8 | can-you-do-better ×6, mishears-the-price ×3, interrupts-how-much ×2, neighbor-said ×2, background-chaos ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 3 |
| wh-tankless-descale | 4 | novice | 6 | 0% | 0% | 100% | 29.7 | 7.8 | can-you-do-better ×14, i-know-what-it-is ×4, are-you-on-commission ×3, goes-cold ×3, mishears-the-price ×2, angry-about-last-company ×2 | 0 |
| wh-tankless-upgrade-question | 2 | expert | 6 | 0% | 100% | 0% | 84.0 | 100.0 | watched-a-video ×6, found-it-cheaper ×6, need-three-bids ×6, silence-after-price ×4, thinks-out-loud ×4, i-know-what-it-is ×2, bigger-than-needed ×2, neighbor-said ×1, phone-call-hold-on ×1, minimal-responses ×1, tests-your-honesty ×1, interrupts-how-much ×1 | 6 |
| wh-tankless-upgrade-question | 2 | solid | 6 | 100% | 0% | 0% | 71.8 | 100.0 | watched-a-video ×6, silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×5, bigger-than-needed ×1, i-know-what-it-is ×1, neighbor-said ×1, thinks-out-loud ×1, minimal-responses ×1, tests-your-honesty ×1 | 0 |
| wh-tankless-upgrade-question | 2 | novice | 6 | 0% | 0% | 100% | 26.3 | 2.3 | found-it-cheaper ×11, need-three-bids ×10, watched-a-video ×6, silence-after-price ×4, i-know-what-it-is ×4, goes-cold ×3, bigger-than-needed ×2, thinks-out-loud ×2 | 0 |
| wh-tankless-upgrade-question | 4 | expert | 6 | 0% | 100% | 0% | 84.0 | 100.0 | watched-a-video ×6, found-it-cheaper ×6, need-three-bids ×6, silence-after-price ×4, thinks-out-loud ×4, i-know-what-it-is ×2, bigger-than-needed ×2, neighbor-said ×1, phone-call-hold-on ×1, minimal-responses ×1, tests-your-honesty ×1, interrupts-how-much ×1 | 6 |
| wh-tankless-upgrade-question | 4 | solid | 6 | 100% | 0% | 0% | 71.8 | 100.0 | watched-a-video ×6, silence-after-price ×6, found-it-cheaper ×6, need-three-bids ×5, bigger-than-needed ×1, i-know-what-it-is ×1, neighbor-said ×1, thinks-out-loud ×1, minimal-responses ×1, tests-your-honesty ×1 | 0 |
| wh-tankless-upgrade-question | 4 | novice | 6 | 0% | 0% | 100% | 29.2 | 0.7 | found-it-cheaper ×11, need-three-bids ×8, watched-a-video ×6, silence-after-price ×5, i-know-what-it-is ×4, goes-cold ×3, bigger-than-needed ×2, angry-about-last-company ×2, thinks-out-loud ×1 | 0 |
| wh-warranty-claim-denied | 2 | expert | 6 | 100% | 0% | 0% | 90.7 | 100.0 | silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, do-i-need-the-code-stuff ×6, paid-less-last-time ×5, minimal-responses ×4, neighbor-said ×3, thinks-out-loud ×3, interrupts-how-much ×2, mishears-the-price ×2, i-know-what-it-is ×2, half-listening ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 0 |
| wh-warranty-claim-denied | 2 | solid | 6 | 100% | 0% | 0% | 73.0 | 99.8 | silence-after-price ×6, do-i-need-the-code-stuff ×6, home-warranty-covers-it ×6, paid-less-last-time ×5, what-am-i-paying-for ×4, mishears-the-price ×2, neighbor-said ×2, minimal-responses ×1, half-listening ×1, mixes-up-terms ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 0 |
| wh-warranty-claim-denied | 2 | novice | 6 | 0% | 0% | 100% | 21.3 | 0.0 | what-am-i-paying-for ×11, do-i-need-the-code-stuff ×10, home-warranty-covers-it ×9, paid-less-last-time ×7, silence-after-price ×6, goes-cold ×5, i-know-what-it-is ×4 | 0 |
| wh-warranty-claim-denied | 4 | expert | 6 | 100% | 0% | 0% | 91.3 | 100.0 | silence-after-price ×6, home-warranty-covers-it ×6, what-am-i-paying-for ×6, do-i-need-the-code-stuff ×6, paid-less-last-time ×5, minimal-responses ×4, neighbor-said ×3, thinks-out-loud ×3, interrupts-how-much ×2, mishears-the-price ×2, i-know-what-it-is ×2, half-listening ×1, phone-call-hold-on ×1, tests-your-honesty ×1 | 0 |
| wh-warranty-claim-denied | 4 | solid | 6 | 100% | 0% | 0% | 73.0 | 96.8 | silence-after-price ×6, do-i-need-the-code-stuff ×6, home-warranty-covers-it ×6, paid-less-last-time ×5, what-am-i-paying-for ×4, mishears-the-price ×2, neighbor-said ×2, minimal-responses ×1, half-listening ×1, mixes-up-terms ×1, i-know-what-it-is ×1, tests-your-honesty ×1 | 0 |
| wh-warranty-claim-denied | 4 | novice | 6 | 0% | 0% | 100% | 17.2 | 0.0 | do-i-need-the-code-stuff ×12, home-warranty-covers-it ×10, what-am-i-paying-for ×9, silence-after-price ×6, paid-less-last-time ×5, goes-cold ×4, i-know-what-it-is ×4, angry-about-last-company ×2 | 0 |

## Probes

`upsell`: an expert who also recommends one unjustified item. Must lower trust and never end in yes.
`pushy`: an expert who asks for the decision again and again with nothing new. Must never flip to yes.

| Scenario | Difficulty | Probe | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| burst-pipe-after-hours | 2 | upsell | 3 | 0% | 100% | 0% | 84.3 | 100.0 | can-you-do-better ×3, repeats-answered-objection ×3, interrupts-how-much ×2, mishears-the-price ×2, neighbor-said ×1, i-know-what-it-is ×1 | 1 |
| burst-pipe-after-hours | 2 | pushy | 3 | 100% | 0% | 0% | 88.7 | 100.0 | can-you-do-better ×3, interrupts-how-much ×2, mishears-the-price ×2, neighbor-said ×1, i-know-what-it-is ×1, repeats-answered-objection ×1 | 1 |
| burst-pipe-after-hours | 4 | upsell | 3 | 0% | 100% | 0% | 84.3 | 100.0 | can-you-do-better ×3, repeats-answered-objection ×3, interrupts-how-much ×2, mishears-the-price ×2, neighbor-said ×1, i-know-what-it-is ×1 | 1 |
| burst-pipe-after-hours | 4 | pushy | 3 | 100% | 0% | 0% | 88.7 | 100.0 | can-you-do-better ×3, interrupts-how-much ×2, mishears-the-price ×2, neighbor-said ×1, i-know-what-it-is ×1, repeats-answered-objection ×1 | 1 |
| disposal-jammed-old | 2 | upsell | 3 | 0% | 100% | 0% | 82.7 | 100.0 | phone-call-hold-on ×3, mishears-the-price ×2, only-fix-what-i-called-for ×2, half-listening ×1, thinks-out-loud ×1, background-chaos ×1, i-know-what-it-is ×1 | 0 |
| disposal-jammed-old | 2 | pushy | 3 | 100% | 0% | 0% | 85.0 | 100.0 | phone-call-hold-on ×3, mishears-the-price ×2, only-fix-what-i-called-for ×2, half-listening ×1, thinks-out-loud ×1, background-chaos ×1, i-know-what-it-is ×1 | 0 |
| disposal-jammed-old | 4 | upsell | 3 | 0% | 100% | 0% | 82.7 | 100.0 | phone-call-hold-on ×3, mishears-the-price ×2, only-fix-what-i-called-for ×2, half-listening ×1, thinks-out-loud ×1, background-chaos ×1, i-know-what-it-is ×1 | 0 |
| disposal-jammed-old | 4 | pushy | 3 | 100% | 0% | 0% | 85.0 | 100.0 | phone-call-hold-on ×3, mishears-the-price ×2, only-fix-what-i-called-for ×2, half-listening ×1, thinks-out-loud ×1, background-chaos ×1, i-know-what-it-is ×1 | 0 |
| drain-kitchen-recurring | 2 | upsell | 3 | 0% | 100% | 0% | 83.0 | 100.0 | mishears-the-price ×3, just-the-cheap-fix ×3, half-listening ×2, i-know-what-it-is ×1, thinks-out-loud ×1, interrupts-how-much ×1, spouse-walks-in ×1 | 0 |
| drain-kitchen-recurring | 2 | pushy | 3 | 100% | 0% | 0% | 86.7 | 100.0 | mishears-the-price ×3, just-the-cheap-fix ×3, half-listening ×2, i-know-what-it-is ×1, thinks-out-loud ×1, interrupts-how-much ×1, spouse-walks-in ×1 | 0 |
| drain-kitchen-recurring | 4 | upsell | 3 | 0% | 100% | 0% | 83.0 | 100.0 | mishears-the-price ×3, just-the-cheap-fix ×3, half-listening ×2, i-know-what-it-is ×1, thinks-out-loud ×1, interrupts-how-much ×1, spouse-walks-in ×1 | 0 |
| drain-kitchen-recurring | 4 | pushy | 3 | 100% | 0% | 0% | 86.7 | 100.0 | mishears-the-price ×3, just-the-cheap-fix ×3, half-listening ×2, i-know-what-it-is ×1, thinks-out-loud ×1, interrupts-how-much ×1, spouse-walks-in ×1 | 0 |
| drain-main-line-roots | 2 | upsell | 3 | 0% | 100% | 0% | 83.3 | 97.7 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, repeats-answered-objection ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1, would-you-do-this ×1 | 0 |
| drain-main-line-roots | 2 | pushy | 3 | 0% | 0% | 100% | 68.7 | 53.0 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| drain-main-line-roots | 4 | upsell | 3 | 0% | 100% | 0% | 83.3 | 97.7 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, repeats-answered-objection ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1, would-you-do-this ×1 | 0 |
| drain-main-line-roots | 4 | pushy | 3 | 0% | 0% | 100% | 68.7 | 53.0 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| drain-simple-snake | 2 | upsell | 3 | 0% | 100% | 0% | 86.3 | 97.0 | tests-your-honesty ×3, silence-after-price ×3, mishears-the-price ×3, too-expensive ×3, minimal-responses ×2, i-know-what-it-is ×1 | 0 |
| drain-simple-snake | 2 | pushy | 3 | 67% | 0% | 33% | 78.7 | 83.7 | tests-your-honesty ×3, silence-after-price ×3, mishears-the-price ×3, need-to-think-about-it ×3, too-expensive ×2, minimal-responses ×2, i-know-what-it-is ×1 | 0 |
| drain-simple-snake | 4 | upsell | 3 | 0% | 100% | 0% | 86.3 | 97.0 | tests-your-honesty ×3, silence-after-price ×3, mishears-the-price ×3, too-expensive ×3, minimal-responses ×2, i-know-what-it-is ×1 | 0 |
| drain-simple-snake | 4 | pushy | 3 | 67% | 0% | 33% | 78.7 | 83.7 | tests-your-honesty ×3, silence-after-price ×3, mishears-the-price ×3, need-to-think-about-it ×3, too-expensive ×2, minimal-responses ×2, i-know-what-it-is ×1 | 0 |
| drinking-water-filtration | 2 | upsell | 3 | 0% | 100% | 0% | 84.0 | 96.7 | minimal-responses ×3, silence-after-price ×3, show-me-in-writing ×3, mishears-the-price ×2, thinks-out-loud ×1, mixes-up-terms ×1, background-chaos ×1 | 0 |
| drinking-water-filtration | 2 | pushy | 3 | 67% | 0% | 33% | 77.0 | 80.3 | show-me-in-writing ×5, minimal-responses ×3, silence-after-price ×3, mishears-the-price ×2, thinks-out-loud ×1, mixes-up-terms ×1, background-chaos ×1 | 0 |
| drinking-water-filtration | 4 | upsell | 3 | 0% | 100% | 0% | 84.0 | 96.7 | minimal-responses ×3, silence-after-price ×3, show-me-in-writing ×3, mishears-the-price ×2, thinks-out-loud ×1, mixes-up-terms ×1, background-chaos ×1 | 0 |
| drinking-water-filtration | 4 | pushy | 3 | 67% | 0% | 33% | 77.0 | 80.3 | show-me-in-writing ×5, minimal-responses ×3, silence-after-price ×3, mishears-the-price ×2, thinks-out-loud ×1, mixes-up-terms ×1, background-chaos ×1 | 0 |
| faucet-install-bad-valves | 2 | upsell | 3 | 0% | 100% | 0% | 84.3 | 100.0 | can-you-do-better ×3, only-fix-what-i-called-for ×3, interrupts-how-much ×2, neighbor-said ×1, i-know-what-it-is ×1, mishears-the-price ×1 | 0 |
| faucet-install-bad-valves | 2 | pushy | 3 | 100% | 0% | 0% | 88.7 | 100.0 | can-you-do-better ×3, only-fix-what-i-called-for ×3, interrupts-how-much ×2, neighbor-said ×1, i-know-what-it-is ×1, mishears-the-price ×1 | 0 |
| faucet-install-bad-valves | 4 | upsell | 3 | 0% | 100% | 0% | 84.3 | 100.0 | can-you-do-better ×3, only-fix-what-i-called-for ×3, interrupts-how-much ×2, neighbor-said ×1, i-know-what-it-is ×1, mishears-the-price ×1 | 0 |
| faucet-install-bad-valves | 4 | pushy | 3 | 100% | 0% | 0% | 88.7 | 100.0 | can-you-do-better ×3, only-fix-what-i-called-for ×3, interrupts-how-much ×2, neighbor-said ×1, i-know-what-it-is ×1, mishears-the-price ×1 | 0 |
| gas-smell-flex-line | 2 | upsell | 3 | 33% | 67% | 0% | 86.0 | 100.0 | silence-after-price ×3, too-expensive ×3, can-it-wait ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 1 |
| gas-smell-flex-line | 2 | pushy | 3 | 0% | 0% | 100% | 62.7 | 50.0 | can-it-wait ×9, silence-after-price ×3, i-know-what-it-is ×2, too-expensive ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 0 |
| gas-smell-flex-line | 4 | upsell | 3 | 33% | 67% | 0% | 86.0 | 100.0 | silence-after-price ×3, too-expensive ×3, can-it-wait ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 1 |
| gas-smell-flex-line | 4 | pushy | 3 | 0% | 0% | 100% | 62.7 | 50.0 | can-it-wait ×9, silence-after-price ×3, i-know-what-it-is ×2, too-expensive ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 0 |
| hard-water-softener | 2 | upsell | 3 | 0% | 100% | 0% | 84.3 | 84.0 | neighbor-said ×3, silence-after-price ×3, didnt-budget-for-this ×3, monthly-still-too-much ×3, minimal-responses ×2, thinks-out-loud ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| hard-water-softener | 2 | pushy | 3 | 0% | 0% | 100% | 65.7 | 50.3 | neighbor-said ×3, silence-after-price ×3, didnt-budget-for-this ×3, minimal-responses ×2, monthly-still-too-much ×2, thinks-out-loud ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| hard-water-softener | 4 | upsell | 3 | 0% | 100% | 0% | 84.3 | 84.0 | neighbor-said ×3, silence-after-price ×3, didnt-budget-for-this ×3, monthly-still-too-much ×3, minimal-responses ×2, thinks-out-loud ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| hard-water-softener | 4 | pushy | 3 | 0% | 0% | 100% | 65.7 | 50.3 | neighbor-said ×3, silence-after-price ×3, didnt-budget-for-this ×3, minimal-responses ×2, monthly-still-too-much ×2, thinks-out-loud ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| hydro-jet-rental | 2 | upsell | 3 | 33% | 67% | 0% | 86.7 | 89.7 | silence-after-price ×3, handyman-can-do-it ×3, just-the-cheap-fix ×3, can-you-do-better ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2, background-chaos ×1, mishears-the-price ×1 | 1 |
| hydro-jet-rental | 2 | pushy | 3 | 33% | 0% | 67% | 64.7 | 80.0 | handyman-can-do-it ×7, silence-after-price ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2, background-chaos ×1, mishears-the-price ×1, just-the-cheap-fix ×1, can-you-do-better ×1 | 0 |
| hydro-jet-rental | 4 | upsell | 3 | 33% | 67% | 0% | 86.7 | 89.7 | silence-after-price ×3, handyman-can-do-it ×3, just-the-cheap-fix ×3, can-you-do-better ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2, background-chaos ×1, mishears-the-price ×1 | 1 |
| hydro-jet-rental | 4 | pushy | 3 | 33% | 0% | 67% | 64.7 | 80.0 | handyman-can-do-it ×7, silence-after-price ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2, background-chaos ×1, mishears-the-price ×1, just-the-cheap-fix ×1, can-you-do-better ×1 | 0 |
| main-shutoff-seized | 2 | upsell | 3 | 33% | 67% | 0% | 85.7 | 90.0 | mishears-the-price ×3, silence-after-price ×3, only-fix-what-i-called-for ×3, interrupts-how-much ×2, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1 | 1 |
| main-shutoff-seized | 2 | pushy | 3 | 67% | 0% | 33% | 78.7 | 82.3 | only-fix-what-i-called-for ×5, mishears-the-price ×3, silence-after-price ×3, interrupts-how-much ×2, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1 | 0 |
| main-shutoff-seized | 4 | upsell | 3 | 33% | 67% | 0% | 85.7 | 90.0 | mishears-the-price ×3, silence-after-price ×3, only-fix-what-i-called-for ×3, interrupts-how-much ×2, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1 | 1 |
| main-shutoff-seized | 4 | pushy | 3 | 67% | 0% | 33% | 78.7 | 82.3 | only-fix-what-i-called-for ×5, mishears-the-price ×3, silence-after-price ×3, interrupts-how-much ×2, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1 | 0 |
| maintenance-visit-anode | 2 | upsell | 3 | 33% | 67% | 0% | 84.3 | 93.7 | how-do-i-know-its-broken ×3, silence-after-price ×3, mishears-the-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, minimal-responses ×2, tests-your-honesty ×1, i-know-what-it-is ×1, interrupts-how-much ×1, half-listening ×1 | 1 |
| maintenance-visit-anode | 2 | pushy | 3 | 100% | 0% | 0% | 88.7 | 100.0 | how-do-i-know-its-broken ×3, silence-after-price ×3, mishears-the-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, minimal-responses ×2, tests-your-honesty ×1, i-know-what-it-is ×1, interrupts-how-much ×1, half-listening ×1 | 0 |
| maintenance-visit-anode | 4 | upsell | 3 | 33% | 67% | 0% | 84.3 | 93.7 | how-do-i-know-its-broken ×3, silence-after-price ×3, mishears-the-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, minimal-responses ×2, tests-your-honesty ×1, i-know-what-it-is ×1, interrupts-how-much ×1, half-listening ×1 | 1 |
| maintenance-visit-anode | 4 | pushy | 3 | 100% | 0% | 0% | 88.7 | 100.0 | how-do-i-know-its-broken ×3, silence-after-price ×3, mishears-the-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, minimal-responses ×2, tests-your-honesty ×1, i-know-what-it-is ×1, interrupts-how-much ×1, half-listening ×1 | 0 |
| prv-high-pressure | 2 | upsell | 3 | 67% | 33% | 0% | 88.0 | 100.0 | i-know-what-it-is ×3, found-it-cheaper ×3, need-three-bids ×3, neighbor-said ×2, silence-after-price ×2, thinks-out-loud ×2, interrupts-how-much ×1, bigger-than-needed ×1, background-chaos ×1 | 2 |
| prv-high-pressure | 2 | pushy | 3 | 100% | 0% | 0% | 82.7 | 100.0 | i-know-what-it-is ×3, neighbor-said ×2, silence-after-price ×2, thinks-out-loud ×2, interrupts-how-much ×1, found-it-cheaper ×1, need-three-bids ×1, background-chaos ×1 | 0 |
| prv-high-pressure | 4 | upsell | 3 | 67% | 33% | 0% | 88.0 | 100.0 | i-know-what-it-is ×3, found-it-cheaper ×3, need-three-bids ×3, neighbor-said ×2, silence-after-price ×2, thinks-out-loud ×2, interrupts-how-much ×1, bigger-than-needed ×1, background-chaos ×1 | 2 |
| prv-high-pressure | 4 | pushy | 3 | 33% | 0% | 67% | 67.0 | 81.3 | found-it-cheaper ×7, i-know-what-it-is ×3, neighbor-said ×2, silence-after-price ×2, thinks-out-loud ×2, interrupts-how-much ×1, need-three-bids ×1, background-chaos ×1 | 0 |
| remodel-rough-in | 2 | upsell | 3 | 0% | 100% | 0% | 85.3 | 93.3 | silence-after-price ×3, ill-do-part-myself ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| remodel-rough-in | 2 | pushy | 3 | 100% | 0% | 0% | 91.0 | 100.0 | silence-after-price ×3, ill-do-part-myself ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| remodel-rough-in | 4 | upsell | 3 | 0% | 100% | 0% | 85.3 | 93.3 | silence-after-price ×3, ill-do-part-myself ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| remodel-rough-in | 4 | pushy | 3 | 100% | 0% | 0% | 91.0 | 100.0 | silence-after-price ×3, ill-do-part-myself ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| repipe-galvanized | 2 | upsell | 3 | 0% | 100% | 0% | 83.3 | 89.3 | silence-after-price ×3, do-i-need-the-code-stuff ×3, what-am-i-paying-for ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2, repeats-answered-objection ×1 | 0 |
| repipe-galvanized | 2 | pushy | 3 | 0% | 0% | 100% | 60.0 | 70.7 | silence-after-price ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2, what-am-i-paying-for ×1, repeats-answered-objection ×1, do-i-need-the-code-stuff ×1 | 0 |
| repipe-galvanized | 4 | upsell | 3 | 0% | 100% | 0% | 84.3 | 97.3 | silence-after-price ×3, thinks-out-loud ×3, what-am-i-paying-for ×3, do-i-need-the-code-stuff ×3, watched-a-video ×2, i-know-what-it-is ×2, you-always-upsell ×1, tests-your-honesty ×1, half-listening ×1, minimal-responses ×1 | 0 |
| repipe-galvanized | 4 | pushy | 3 | 0% | 0% | 100% | 59.0 | 70.0 | silence-after-price ×3, thinks-out-loud ×3, watched-a-video ×2, i-know-what-it-is ×2, you-always-upsell ×1, tests-your-honesty ×1, half-listening ×1, minimal-responses ×1 | 0 |
| second-opinion-quote | 2 | upsell | 3 | 33% | 67% | 0% | 85.7 | 98.3 | silence-after-price ×3, found-it-cheaper ×3, need-three-bids ×3, i-know-what-it-is ×2, minimal-responses ×2, thinks-out-loud ×1, background-chaos ×1, neighbor-said ×1 | 1 |
| second-opinion-quote | 2 | pushy | 3 | 67% | 0% | 33% | 78.7 | 91.7 | found-it-cheaper ×5, silence-after-price ×3, i-know-what-it-is ×2, need-three-bids ×2, minimal-responses ×2, thinks-out-loud ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| second-opinion-quote | 4 | upsell | 3 | 33% | 67% | 0% | 85.7 | 98.3 | silence-after-price ×3, found-it-cheaper ×3, need-three-bids ×3, i-know-what-it-is ×2, minimal-responses ×2, thinks-out-loud ×1, background-chaos ×1, neighbor-said ×1 | 1 |
| second-opinion-quote | 4 | pushy | 3 | 67% | 0% | 33% | 78.7 | 91.7 | found-it-cheaper ×5, silence-after-price ×3, i-know-what-it-is ×2, need-three-bids ×2, minimal-responses ×2, thinks-out-loud ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| sewer-camera-before-sale | 2 | upsell | 3 | 0% | 100% | 0% | 83.7 | 85.0 | mishears-the-price ×3, silence-after-price ×3, selling-soon ×3, interrupts-how-much ×2, tests-your-honesty ×1, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 0 |
| sewer-camera-before-sale | 2 | pushy | 3 | 67% | 0% | 33% | 78.7 | 81.7 | selling-soon ×5, mishears-the-price ×3, silence-after-price ×3, interrupts-how-much ×2, tests-your-honesty ×1, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 0 |
| sewer-camera-before-sale | 4 | upsell | 3 | 0% | 100% | 0% | 83.7 | 85.0 | mishears-the-price ×3, silence-after-price ×3, selling-soon ×3, interrupts-how-much ×2, tests-your-honesty ×1, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 0 |
| sewer-camera-before-sale | 4 | pushy | 3 | 67% | 0% | 33% | 78.7 | 81.7 | selling-soon ×5, mishears-the-price ×3, silence-after-price ×3, interrupts-how-much ×2, tests-your-honesty ×1, thinks-out-loud ×1, neighbor-said ×1, mixes-up-terms ×1, repeats-answered-objection ×1 | 0 |
| slab-leak-detection | 2 | upsell | 3 | 33% | 67% | 0% | 83.3 | 95.3 | how-do-i-know-its-broken ×3, silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, show-me-in-writing ×2, phone-call-hold-on ×1, minimal-responses ×1, mixes-up-terms ×1 | 1 |
| slab-leak-detection | 2 | pushy | 3 | 100% | 0% | 0% | 83.3 | 100.0 | how-do-i-know-its-broken ×3, silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, phone-call-hold-on ×1, minimal-responses ×1, mixes-up-terms ×1 | 0 |
| slab-leak-detection | 4 | upsell | 3 | 33% | 67% | 0% | 84.0 | 91.3 | how-do-i-know-its-broken ×3, silence-after-price ×3, thinks-out-loud ×3, show-me-in-writing ×2, i-know-what-it-is ×1, phone-call-hold-on ×1, last-company-ripped-me-off ×1, tests-your-honesty ×1, mixes-up-terms ×1 | 1 |
| slab-leak-detection | 4 | pushy | 3 | 100% | 0% | 0% | 85.0 | 100.0 | how-do-i-know-its-broken ×3, silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×1, phone-call-hold-on ×1, last-company-ripped-me-off ×1, tests-your-honesty ×1, mixes-up-terms ×1 | 0 |
| tank-vs-tankless-family | 2 | upsell | 3 | 0% | 100% | 0% | 85.0 | 95.3 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| tank-vs-tankless-family | 2 | pushy | 3 | 100% | 0% | 0% | 91.0 | 100.0 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| tank-vs-tankless-family | 4 | upsell | 3 | 0% | 100% | 0% | 85.0 | 95.3 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| tank-vs-tankless-family | 4 | pushy | 3 | 100% | 0% | 0% | 91.0 | 100.0 | silence-after-price ×3, brother-in-law-plumber ×3, too-expensive ×3, interrupts-how-much ×2, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| toilet-running-old | 2 | upsell | 3 | 33% | 67% | 0% | 88.0 | 96.0 | silence-after-price ×3, home-warranty-covers-it ×3, what-am-i-paying-for ×3, paid-less-last-time ×3, minimal-responses ×2, mishears-the-price ×2, interrupts-how-much ×1, half-listening ×1 | 1 |
| toilet-running-old | 2 | pushy | 3 | 100% | 0% | 0% | 92.0 | 100.0 | silence-after-price ×3, home-warranty-covers-it ×3, what-am-i-paying-for ×3, paid-less-last-time ×3, minimal-responses ×2, mishears-the-price ×2, interrupts-how-much ×1, half-listening ×1 | 0 |
| toilet-running-old | 4 | upsell | 3 | 33% | 67% | 0% | 88.0 | 96.0 | silence-after-price ×3, home-warranty-covers-it ×3, what-am-i-paying-for ×3, paid-less-last-time ×3, minimal-responses ×2, mishears-the-price ×2, interrupts-how-much ×1, half-listening ×1 | 1 |
| toilet-running-old | 4 | pushy | 3 | 100% | 0% | 0% | 92.0 | 100.0 | silence-after-price ×3, home-warranty-covers-it ×3, what-am-i-paying-for ×3, paid-less-last-time ×3, minimal-responses ×2, mishears-the-price ×2, interrupts-how-much ×1, half-listening ×1 | 0 |
| wh-code-upgrades-rental | 2 | upsell | 3 | 33% | 67% | 0% | 87.7 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, do-i-need-the-code-stuff ×3, handyman-can-do-it ×3, just-the-cheap-fix ×3, can-you-do-better ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 1 |
| wh-code-upgrades-rental | 2 | pushy | 3 | 0% | 0% | 100% | 54.0 | 69.3 | do-i-need-the-code-stuff ×9, silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 0 |
| wh-code-upgrades-rental | 4 | upsell | 3 | 33% | 67% | 0% | 89.0 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, do-i-need-the-code-stuff ×3, handyman-can-do-it ×3, just-the-cheap-fix ×3, can-you-do-better ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 1 |
| wh-code-upgrades-rental | 4 | pushy | 3 | 0% | 0% | 100% | 54.0 | 69.3 | do-i-need-the-code-stuff ×9, silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 0 |
| wh-first-home-rumbling | 2 | upsell | 3 | 0% | 100% | 0% | 80.7 | 97.3 | silence-after-price ×3, thinks-out-loud ×3, minimal-responses ×2, mixes-up-terms ×2, mishears-the-price ×2 | 0 |
| wh-first-home-rumbling | 2 | pushy | 3 | 100% | 0% | 0% | 78.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, minimal-responses ×2, mixes-up-terms ×2, mishears-the-price ×2 | 0 |
| wh-first-home-rumbling | 4 | upsell | 3 | 0% | 100% | 0% | 80.7 | 97.3 | silence-after-price ×3, thinks-out-loud ×3, minimal-responses ×2, mixes-up-terms ×2, mishears-the-price ×2 | 0 |
| wh-first-home-rumbling | 4 | pushy | 3 | 100% | 0% | 0% | 78.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, minimal-responses ×2, mixes-up-terms ×2, mishears-the-price ×2 | 0 |
| wh-heat-pump-rebate | 2 | upsell | 3 | 0% | 100% | 0% | 83.3 | 88.7 | silence-after-price ×3, do-i-need-the-code-stuff ×3, what-am-i-paying-for ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2 | 0 |
| wh-heat-pump-rebate | 2 | pushy | 3 | 33% | 0% | 67% | 65.0 | 80.0 | you-always-upsell ×6, silence-after-price ×3, i-know-what-it-is ×2, thinks-out-loud ×2, minimal-responses ×2, what-am-i-paying-for ×1, do-i-need-the-code-stuff ×1 | 0 |
| wh-heat-pump-rebate | 4 | upsell | 3 | 0% | 100% | 0% | 85.3 | 98.7 | silence-after-price ×3, thinks-out-loud ×3, what-am-i-paying-for ×3, do-i-need-the-code-stuff ×3, watched-a-video ×2, i-know-what-it-is ×2, you-always-upsell ×1, tests-your-honesty ×1, half-listening ×1, minimal-responses ×1 | 0 |
| wh-heat-pump-rebate | 4 | pushy | 3 | 33% | 0% | 67% | 64.0 | 78.0 | you-always-upsell ×7, silence-after-price ×3, thinks-out-loud ×3, watched-a-video ×2, i-know-what-it-is ×2, tests-your-honesty ×1, half-listening ×1, minimal-responses ×1 | 0 |
| wh-repair-or-replace-9yr | 2 | upsell | 3 | 33% | 67% | 0% | 78.0 | 92.3 | tests-your-honesty ×3, silence-after-price ×3, thinks-out-loud ×2, how-do-i-know-its-broken ×1, neighbor-said ×1, show-me-in-writing ×1, minimal-responses ×1, watched-a-video ×1, background-chaos ×1 | 1 |
| wh-repair-or-replace-9yr | 2 | pushy | 3 | 100% | 0% | 0% | 77.7 | 100.0 | tests-your-honesty ×3, silence-after-price ×3, thinks-out-loud ×2, how-do-i-know-its-broken ×1, neighbor-said ×1, minimal-responses ×1, watched-a-video ×1, background-chaos ×1 | 0 |
| wh-repair-or-replace-9yr | 4 | upsell | 3 | 33% | 67% | 0% | 79.7 | 91.0 | tests-your-honesty ×3, silence-after-price ×3, last-company-ripped-me-off ×2, neighbor-said ×2, show-me-in-writing ×2, how-do-i-know-its-broken ×1, half-listening ×1, thinks-out-loud ×1 | 1 |
| wh-repair-or-replace-9yr | 4 | pushy | 3 | 100% | 0% | 0% | 81.3 | 100.0 | tests-your-honesty ×3, silence-after-price ×3, last-company-ripped-me-off ×2, neighbor-said ×2, how-do-i-know-its-broken ×1, half-listening ×1, thinks-out-loud ×1 | 0 |
| wh-replacement-spanish | 2 | upsell | 3 | 0% | 100% | 0% | 84.3 | 98.3 | minimal-responses ×3, silence-after-price ×3, show-me-in-writing ×3, thinks-out-loud ×2, mixes-up-terms ×1, mishears-the-price ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| wh-replacement-spanish | 2 | pushy | 3 | 33% | 0% | 67% | 65.3 | 58.7 | show-me-in-writing ×7, minimal-responses ×3, silence-after-price ×3, thinks-out-loud ×2, mixes-up-terms ×1, mishears-the-price ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| wh-replacement-spanish | 4 | upsell | 3 | 0% | 100% | 0% | 84.3 | 98.3 | minimal-responses ×3, silence-after-price ×3, show-me-in-writing ×3, thinks-out-loud ×2, mixes-up-terms ×1, mishears-the-price ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| wh-replacement-spanish | 4 | pushy | 3 | 33% | 0% | 67% | 65.3 | 58.7 | show-me-in-writing ×7, minimal-responses ×3, silence-after-price ×3, thinks-out-loud ×2, mixes-up-terms ×1, mishears-the-price ×1, background-chaos ×1, neighbor-said ×1 | 0 |
| wh-tank-landlord-tenant | 2 | upsell | 3 | 0% | 100% | 0% | 86.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, handyman-can-do-it ×3, just-the-cheap-fix ×3, can-you-do-better ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 0 |
| wh-tank-landlord-tenant | 2 | pushy | 3 | 0% | 0% | 100% | 54.7 | 68.0 | handyman-can-do-it ×9, silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 0 |
| wh-tank-landlord-tenant | 4 | upsell | 3 | 0% | 100% | 0% | 86.3 | 100.0 | silence-after-price ×3, thinks-out-loud ×3, handyman-can-do-it ×3, just-the-cheap-fix ×3, can-you-do-better ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 0 |
| wh-tank-landlord-tenant | 4 | pushy | 3 | 0% | 0% | 100% | 54.7 | 68.0 | handyman-can-do-it ×9, silence-after-price ×3, thinks-out-loud ×3, i-know-what-it-is ×2, minimal-responses ×2, background-chaos ×1, phone-call-hold-on ×1 | 0 |
| wh-tank-no-hot-water | 2 | upsell | 3 | 33% | 67% | 0% | 86.0 | 98.3 | silence-after-price ×3, too-expensive ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 1 |
| wh-tank-no-hot-water | 2 | pushy | 3 | 67% | 0% | 33% | 77.0 | 83.7 | silence-after-price ×3, need-to-think-about-it ×3, i-know-what-it-is ×2, too-expensive ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| wh-tank-no-hot-water | 4 | upsell | 3 | 33% | 67% | 0% | 86.0 | 98.3 | silence-after-price ×3, too-expensive ×3, i-know-what-it-is ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 1 |
| wh-tank-no-hot-water | 4 | pushy | 3 | 67% | 0% | 33% | 77.0 | 83.7 | silence-after-price ×3, need-to-think-about-it ×3, i-know-what-it-is ×2, too-expensive ×2, thinks-out-loud ×1, minimal-responses ×1, mishears-the-price ×1, mixes-up-terms ×1 | 0 |
| wh-tankless-descale | 2 | upsell | 3 | 33% | 67% | 0% | 85.7 | 100.0 | can-you-do-better ×3, interrupts-how-much ×2, mishears-the-price ×2, neighbor-said ×1, i-know-what-it-is ×1, would-you-do-this ×1 | 2 |
| wh-tankless-descale | 2 | pushy | 3 | 100% | 0% | 0% | 88.0 | 100.0 | can-you-do-better ×3, interrupts-how-much ×2, mishears-the-price ×2, neighbor-said ×1, i-know-what-it-is ×1 | 1 |
| wh-tankless-descale | 4 | upsell | 3 | 33% | 67% | 0% | 85.7 | 100.0 | can-you-do-better ×3, interrupts-how-much ×2, mishears-the-price ×2, neighbor-said ×1, i-know-what-it-is ×1, would-you-do-this ×1 | 2 |
| wh-tankless-descale | 4 | pushy | 3 | 100% | 0% | 0% | 88.0 | 100.0 | can-you-do-better ×3, interrupts-how-much ×2, mishears-the-price ×2, neighbor-said ×1, i-know-what-it-is ×1 | 1 |
| wh-tankless-upgrade-question | 2 | upsell | 3 | 0% | 33% | 67% | 77.3 | 92.7 | watched-a-video ×3, found-it-cheaper ×3, need-three-bids ×3, i-know-what-it-is ×2, silence-after-price ×2, thinks-out-loud ×2, bigger-than-needed ×2 | 3 |
| wh-tankless-upgrade-question | 2 | pushy | 3 | 0% | 0% | 100% | 61.3 | 71.7 | watched-a-video ×3, i-know-what-it-is ×2, silence-after-price ×2, found-it-cheaper ×2, need-three-bids ×2, thinks-out-loud ×2, bigger-than-needed ×1 | 3 |
| wh-tankless-upgrade-question | 4 | upsell | 3 | 0% | 33% | 67% | 77.3 | 92.7 | watched-a-video ×3, found-it-cheaper ×3, need-three-bids ×3, i-know-what-it-is ×2, silence-after-price ×2, thinks-out-loud ×2, bigger-than-needed ×2 | 3 |
| wh-tankless-upgrade-question | 4 | pushy | 3 | 0% | 0% | 100% | 61.3 | 71.7 | watched-a-video ×3, i-know-what-it-is ×2, silence-after-price ×2, found-it-cheaper ×2, need-three-bids ×2, thinks-out-loud ×2, bigger-than-needed ×1 | 3 |
| wh-warranty-claim-denied | 2 | upsell | 3 | 33% | 67% | 0% | 87.0 | 99.0 | silence-after-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, do-i-need-the-code-stuff ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×1, half-listening ×1, neighbor-said ×1, thinks-out-loud ×1 | 1 |
| wh-warranty-claim-denied | 2 | pushy | 3 | 67% | 0% | 33% | 79.0 | 88.7 | home-warranty-covers-it ×4, silence-after-price ×3, do-i-need-the-code-stuff ×3, interrupts-how-much ×2, paid-less-last-time ×2, what-am-i-paying-for ×2, minimal-responses ×2, mishears-the-price ×1, half-listening ×1, neighbor-said ×1, thinks-out-loud ×1 | 0 |
| wh-warranty-claim-denied | 4 | upsell | 3 | 33% | 67% | 0% | 88.0 | 99.0 | silence-after-price ×3, home-warranty-covers-it ×3, paid-less-last-time ×3, what-am-i-paying-for ×3, do-i-need-the-code-stuff ×3, interrupts-how-much ×2, minimal-responses ×2, mishears-the-price ×1, half-listening ×1, neighbor-said ×1, thinks-out-loud ×1 | 1 |
| wh-warranty-claim-denied | 4 | pushy | 3 | 67% | 0% | 33% | 79.3 | 88.7 | home-warranty-covers-it ×4, silence-after-price ×3, do-i-need-the-code-stuff ×3, interrupts-how-much ×2, paid-less-last-time ×2, what-am-i-paying-for ×2, minimal-responses ×2, mishears-the-price ×1, half-listening ×1, neighbor-said ×1, thinks-out-loud ×1 | 0 |

## Drills

| Drill | Difficulty | Level | Calls | Yes | Later | No | Mean score | Mean trust | Moves fired | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| first-thirty-seconds | 2 | expert | 2 | 0% | 0% | 0% | 75.0 | 84.5 | none | 0 |
| first-thirty-seconds | 2 | solid | 2 | 0% | 0% | 0% | 60.0 | 64.0 | none | 0 |
| first-thirty-seconds | 2 | novice | 2 | 0% | 0% | 0% | 50.0 | 50.0 | none | 0 |
| first-thirty-seconds | 4 | expert | 2 | 0% | 0% | 0% | 75.0 | 74.5 | none | 0 |
| first-thirty-seconds | 4 | solid | 2 | 0% | 0% | 0% | 60.0 | 54.0 | none | 0 |
| first-thirty-seconds | 4 | novice | 2 | 0% | 0% | 0% | 50.0 | 40.0 | none | 0 |
| five-discovery-questions | 2 | expert | 2 | 0% | 0% | 0% | 72.5 | 94.0 | i-know-what-it-is ×1, minimal-responses ×1 | 0 |
| five-discovery-questions | 2 | solid | 2 | 0% | 0% | 0% | 53.5 | 69.0 | silence-after-price ×2, too-expensive ×2, mishears-the-price ×1 | 0 |
| five-discovery-questions | 2 | novice | 2 | 0% | 0% | 0% | 40.5 | 45.0 | silence-after-price ×2, too-expensive ×1 | 0 |
| five-discovery-questions | 4 | expert | 2 | 0% | 0% | 0% | 72.5 | 84.0 | i-know-what-it-is ×1, minimal-responses ×1 | 0 |
| five-discovery-questions | 4 | solid | 2 | 0% | 0% | 0% | 53.5 | 59.0 | silence-after-price ×2, too-expensive ×2, mishears-the-price ×1 | 0 |
| five-discovery-questions | 4 | novice | 2 | 0% | 0% | 0% | 40.5 | 35.0 | silence-after-price ×2, too-expensive ×1 | 0 |
| explain-the-finding | 2 | expert | 2 | 0% | 0% | 0% | 69.5 | 100.0 | silence-after-price ×2, mishears-the-price ×2, too-expensive ×1 | 0 |
| explain-the-finding | 2 | solid | 2 | 0% | 50% | 0% | 54.0 | 74.0 | silence-after-price ×2, too-expensive ×1, mishears-the-price ×1 | 0 |
| explain-the-finding | 2 | novice | 2 | 0% | 0% | 0% | 28.5 | 15.0 | too-expensive ×4, silence-after-price ×2, goes-cold ×1 | 0 |
| explain-the-finding | 4 | expert | 2 | 0% | 0% | 0% | 69.5 | 100.0 | silence-after-price ×2, mishears-the-price ×2, too-expensive ×1 | 0 |
| explain-the-finding | 4 | solid | 2 | 0% | 50% | 0% | 54.0 | 64.0 | silence-after-price ×2, too-expensive ×1, mishears-the-price ×1 | 0 |
| explain-the-finding | 4 | novice | 2 | 0% | 0% | 0% | 28.5 | 10.0 | too-expensive ×4, silence-after-price ×2, goes-cold ×1 | 0 |
| show-what-you-found | 2 | expert | 2 | 0% | 0% | 0% | 69.5 | 100.0 | silence-after-price ×2, mishears-the-price ×2, too-expensive ×1 | 0 |
| show-what-you-found | 2 | solid | 2 | 0% | 50% | 0% | 54.0 | 74.0 | silence-after-price ×2, too-expensive ×1, mishears-the-price ×1 | 0 |
| show-what-you-found | 2 | novice | 2 | 0% | 0% | 0% | 28.5 | 15.0 | too-expensive ×4, silence-after-price ×2, goes-cold ×1 | 0 |
| show-what-you-found | 4 | expert | 2 | 0% | 0% | 0% | 69.5 | 100.0 | silence-after-price ×2, mishears-the-price ×2, too-expensive ×1 | 0 |
| show-what-you-found | 4 | solid | 2 | 0% | 50% | 0% | 54.0 | 64.0 | silence-after-price ×2, too-expensive ×1, mishears-the-price ×1 | 0 |
| show-what-you-found | 4 | novice | 2 | 0% | 0% | 0% | 28.5 | 10.0 | too-expensive ×4, silence-after-price ×2, goes-cold ×1 | 0 |
| three-options | 2 | expert | 2 | 0% | 0% | 0% | 72.0 | 100.0 | silence-after-price ×2, mishears-the-price ×2, too-expensive ×2 | 0 |
| three-options | 2 | solid | 2 | 0% | 100% | 0% | 61.5 | 95.5 | silence-after-price ×2, too-expensive ×2, mishears-the-price ×1 | 0 |
| three-options | 2 | novice | 2 | 0% | 0% | 100% | 29.0 | 7.0 | too-expensive ×5, silence-after-price ×2, goes-cold ×1 | 0 |
| three-options | 4 | expert | 2 | 0% | 0% | 0% | 72.0 | 100.0 | silence-after-price ×2, mishears-the-price ×2, too-expensive ×2 | 0 |
| three-options | 4 | solid | 2 | 0% | 100% | 0% | 61.5 | 88.0 | silence-after-price ×2, too-expensive ×2, mishears-the-price ×1 | 0 |
| three-options | 4 | novice | 2 | 0% | 0% | 100% | 29.0 | 2.0 | too-expensive ×5, silence-after-price ×2, goes-cold ×1 | 0 |
| say-the-price | 2 | expert | 2 | 0% | 0% | 0% | 68.5 | 100.0 | silence-after-price ×2, too-expensive ×2 | 0 |
| say-the-price | 2 | solid | 2 | 0% | 100% | 0% | 51.5 | 72.0 | silence-after-price ×2, too-expensive ×2 | 0 |
| say-the-price | 2 | novice | 2 | 0% | 0% | 0% | 42.0 | 58.0 | none | 0 |
| say-the-price | 4 | expert | 2 | 0% | 0% | 0% | 68.5 | 100.0 | silence-after-price ×2, too-expensive ×2 | 0 |
| say-the-price | 4 | solid | 2 | 0% | 100% | 0% | 51.5 | 62.0 | silence-after-price ×2, too-expensive ×2 | 0 |
| say-the-price | 4 | novice | 2 | 0% | 0% | 0% | 42.0 | 48.0 | none | 0 |
| hold-the-silence | 2 | expert | 2 | 0% | 0% | 0% | 54.0 | 84.0 | silence-after-price ×2 | 0 |
| hold-the-silence | 2 | solid | 2 | 0% | 0% | 0% | 44.0 | 62.0 | silence-after-price ×2, too-expensive ×1 | 0 |
| hold-the-silence | 2 | novice | 2 | 0% | 0% | 0% | 40.0 | 53.0 | silence-after-price ×2, too-expensive ×2 | 0 |
| hold-the-silence | 4 | expert | 2 | 0% | 0% | 0% | 54.0 | 74.0 | silence-after-price ×2 | 0 |
| hold-the-silence | 4 | solid | 2 | 0% | 0% | 0% | 44.0 | 52.0 | silence-after-price ×2, too-expensive ×1 | 0 |
| hold-the-silence | 4 | novice | 2 | 0% | 0% | 0% | 40.0 | 43.0 | silence-after-price ×2, too-expensive ×2 | 0 |
| three-bids | 2 | expert | 2 | 0% | 0% | 0% | 61.0 | 100.0 | need-three-bids ×2, found-it-cheaper ×2 | 0 |
| three-bids | 2 | solid | 2 | 0% | 0% | 0% | 51.0 | 72.0 | need-three-bids ×2, found-it-cheaper ×2 | 0 |
| three-bids | 2 | novice | 2 | 0% | 0% | 0% | 31.5 | 34.5 | found-it-cheaper ×3, need-three-bids ×2, goes-cold ×1 | 0 |
| three-bids | 4 | expert | 2 | 0% | 0% | 0% | 61.0 | 100.0 | need-three-bids ×2, found-it-cheaper ×2 | 0 |
| three-bids | 4 | solid | 2 | 0% | 0% | 0% | 51.0 | 62.0 | need-three-bids ×2, found-it-cheaper ×2 | 0 |
| three-bids | 4 | novice | 2 | 0% | 0% | 0% | 31.5 | 24.5 | found-it-cheaper ×3, need-three-bids ×2, goes-cold ×1 | 0 |
| the-spouse-stall | 2 | expert | 2 | 0% | 0% | 0% | 76.0 | 100.0 | silence-after-price ×2, brother-in-law-plumber ×2, too-expensive ×2, talk-to-my-spouse ×1 | 0 |
| the-spouse-stall | 2 | solid | 2 | 0% | 0% | 0% | 56.0 | 80.5 | silence-after-price ×2, brother-in-law-plumber ×2, talk-to-my-spouse ×2, too-expensive ×1 | 0 |
| the-spouse-stall | 2 | novice | 2 | 0% | 0% | 0% | 37.0 | 42.5 | silence-after-price ×2, brother-in-law-plumber ×2, too-expensive ×2 | 0 |
| the-spouse-stall | 4 | expert | 2 | 0% | 0% | 0% | 76.0 | 100.0 | silence-after-price ×2, brother-in-law-plumber ×2, too-expensive ×2, talk-to-my-spouse ×1 | 0 |
| the-spouse-stall | 4 | solid | 2 | 0% | 0% | 0% | 56.0 | 68.0 | silence-after-price ×2, brother-in-law-plumber ×2, talk-to-my-spouse ×2, too-expensive ×1 | 0 |
| the-spouse-stall | 4 | novice | 2 | 0% | 0% | 0% | 37.0 | 32.5 | silence-after-price ×2, brother-in-law-plumber ×2, too-expensive ×2 | 0 |
| the-cheap-fix | 2 | expert | 2 | 0% | 0% | 0% | 60.5 | 100.0 | just-the-cheap-fix ×2, handyman-can-do-it ×2 | 0 |
| the-cheap-fix | 2 | solid | 2 | 0% | 0% | 0% | 49.0 | 71.0 | just-the-cheap-fix ×2, handyman-can-do-it ×2 | 0 |
| the-cheap-fix | 2 | novice | 2 | 0% | 0% | 0% | 31.5 | 32.0 | handyman-can-do-it ×3, just-the-cheap-fix ×2, goes-cold ×1 | 0 |
| the-cheap-fix | 4 | expert | 2 | 0% | 0% | 0% | 60.5 | 100.0 | just-the-cheap-fix ×2, handyman-can-do-it ×2 | 0 |
| the-cheap-fix | 4 | solid | 2 | 0% | 0% | 0% | 49.0 | 61.0 | just-the-cheap-fix ×2, handyman-can-do-it ×2 | 0 |
| the-cheap-fix | 4 | novice | 2 | 0% | 0% | 0% | 35.0 | 36.0 | just-the-cheap-fix ×4, handyman-can-do-it ×2 | 0 |
| the-relative-plumber | 2 | expert | 2 | 0% | 0% | 0% | 60.0 | 100.0 | brother-in-law-plumber ×2, too-expensive ×2 | 0 |
| the-relative-plumber | 2 | solid | 2 | 0% | 0% | 0% | 50.5 | 71.5 | brother-in-law-plumber ×2, too-expensive ×2 | 0 |
| the-relative-plumber | 2 | novice | 2 | 0% | 0% | 0% | 30.0 | 32.5 | brother-in-law-plumber ×4, too-expensive ×2, goes-cold ×1 | 0 |
| the-relative-plumber | 4 | expert | 2 | 0% | 0% | 0% | 60.0 | 100.0 | brother-in-law-plumber ×2, too-expensive ×2 | 0 |
| the-relative-plumber | 4 | solid | 2 | 0% | 0% | 0% | 50.5 | 61.5 | brother-in-law-plumber ×2, too-expensive ×2 | 0 |
| the-relative-plumber | 4 | novice | 2 | 0% | 0% | 0% | 30.0 | 22.5 | brother-in-law-plumber ×4, too-expensive ×3, goes-cold ×1 | 0 |
| monthly-number | 2 | expert | 2 | 0% | 0% | 0% | 62.5 | 100.0 | too-expensive ×2, quiet-money-worry ×2 | 0 |
| monthly-number | 2 | solid | 2 | 0% | 0% | 0% | 54.0 | 86.0 | too-expensive ×2, quiet-money-worry ×2 | 0 |
| monthly-number | 2 | novice | 2 | 0% | 100% | 0% | 37.0 | 49.0 | too-expensive ×6, quiet-money-worry ×2 | 0 |
| monthly-number | 4 | expert | 2 | 0% | 0% | 0% | 61.0 | 100.0 | too-expensive ×2, quiet-money-worry ×2 | 0 |
| monthly-number | 4 | solid | 2 | 0% | 0% | 0% | 54.0 | 76.0 | too-expensive ×2, quiet-money-worry ×2 | 0 |
| monthly-number | 4 | novice | 2 | 0% | 100% | 0% | 37.0 | 39.0 | too-expensive ×6, quiet-money-worry ×2 | 0 |
| membership-ask | 2 | expert | 2 | 0% | 0% | 0% | 59.0 | 100.0 | what-do-i-actually-get ×2 | 0 |
| membership-ask | 2 | solid | 2 | 0% | 0% | 0% | 50.0 | 69.0 | what-do-i-actually-get ×2 | 0 |
| membership-ask | 2 | novice | 2 | 0% | 100% | 0% | 37.0 | 42.0 | what-do-i-actually-get ×4 | 0 |
| membership-ask | 4 | expert | 2 | 0% | 0% | 0% | 59.0 | 100.0 | what-do-i-actually-get ×2 | 0 |
| membership-ask | 4 | solid | 2 | 0% | 0% | 0% | 50.0 | 59.0 | what-do-i-actually-get ×2 | 0 |
| membership-ask | 4 | novice | 2 | 0% | 100% | 0% | 37.0 | 32.0 | what-do-i-actually-get ×4 | 0 |
| ask-for-the-decision | 2 | expert | 2 | 100% | 0% | 0% | 68.0 | 100.0 | too-expensive ×2 | 0 |
| ask-for-the-decision | 2 | solid | 2 | 0% | 100% | 0% | 59.0 | 100.0 | too-expensive ×2 | 0 |
| ask-for-the-decision | 2 | novice | 2 | 0% | 0% | 100% | 22.0 | 3.0 | too-expensive ×6 | 0 |
| ask-for-the-decision | 4 | expert | 2 | 100% | 0% | 0% | 68.0 | 100.0 | too-expensive ×2 | 0 |
| ask-for-the-decision | 4 | solid | 2 | 0% | 100% | 0% | 59.0 | 96.0 | too-expensive ×2 | 0 |
| ask-for-the-decision | 4 | novice | 2 | 0% | 0% | 100% | 28.0 | 13.0 | too-expensive ×4 | 0 |
| leave-well-on-a-no | 2 | expert | 2 | 0% | 0% | 0% | 55.0 | 89.0 | need-to-think-about-it ×2 | 0 |
| leave-well-on-a-no | 2 | solid | 2 | 0% | 0% | 0% | 51.0 | 74.0 | need-to-think-about-it ×2, too-expensive ×2 | 0 |
| leave-well-on-a-no | 2 | novice | 2 | 0% | 100% | 0% | 36.0 | 42.0 | need-to-think-about-it ×2, too-expensive ×2 | 0 |
| leave-well-on-a-no | 4 | expert | 2 | 0% | 0% | 0% | 55.0 | 79.0 | need-to-think-about-it ×2 | 0 |
| leave-well-on-a-no | 4 | solid | 2 | 0% | 0% | 0% | 51.0 | 64.0 | need-to-think-about-it ×2, too-expensive ×2 | 0 |
| leave-well-on-a-no | 4 | novice | 2 | 0% | 100% | 0% | 36.0 | 32.0 | need-to-think-about-it ×2, too-expensive ×2 | 0 |
| correct-without-condescending | 2 | expert | 2 | 0% | 0% | 0% | 61.5 | 97.5 | silence-after-price ×2, watched-a-video ×2, found-it-cheaper ×1, need-three-bids ×1, bigger-than-needed ×1 | 2 |
| correct-without-condescending | 2 | solid | 2 | 0% | 0% | 0% | 50.0 | 68.0 | watched-a-video ×2 | 0 |
| correct-without-condescending | 2 | novice | 2 | 0% | 0% | 0% | 44.0 | 45.0 | watched-a-video ×2 | 0 |
| correct-without-condescending | 4 | expert | 2 | 0% | 0% | 0% | 61.5 | 92.5 | silence-after-price ×2, watched-a-video ×2, found-it-cheaper ×1, need-three-bids ×1, bigger-than-needed ×1 | 2 |
| correct-without-condescending | 4 | solid | 2 | 0% | 0% | 0% | 50.0 | 58.0 | watched-a-video ×2 | 0 |
| correct-without-condescending | 4 | novice | 2 | 0% | 0% | 0% | 44.0 | 35.0 | watched-a-video ×2 | 0 |
| come-back-from-a-distraction | 2 | expert | 2 | 0% | 0% | 0% | 63.0 | 93.0 | phone-call-hold-on ×2 | 0 |
| come-back-from-a-distraction | 2 | solid | 2 | 0% | 0% | 0% | 56.0 | 75.0 | phone-call-hold-on ×2 | 0 |
| come-back-from-a-distraction | 2 | novice | 2 | 0% | 0% | 0% | 44.0 | 49.0 | phone-call-hold-on ×2, goes-cold ×2 | 0 |
| come-back-from-a-distraction | 4 | expert | 2 | 0% | 0% | 0% | 63.0 | 83.0 | phone-call-hold-on ×2 | 0 |
| come-back-from-a-distraction | 4 | solid | 2 | 0% | 0% | 0% | 56.0 | 65.0 | phone-call-hold-on ×2 | 0 |
| come-back-from-a-distraction | 4 | novice | 2 | 0% | 0% | 0% | 44.0 | 39.0 | phone-call-hold-on ×2, goes-cold ×2 | 0 |
| bring-in-the-second-decision-maker | 2 | expert | 2 | 0% | 0% | 0% | 72.0 | 100.0 | silence-after-price ×2, brother-in-law-plumber ×2, too-expensive ×2, spouse-walks-in ×2 | 0 |
| bring-in-the-second-decision-maker | 2 | solid | 2 | 0% | 0% | 0% | 60.5 | 94.0 | silence-after-price ×2, brother-in-law-plumber ×2, too-expensive ×2, spouse-walks-in ×2 | 0 |
| bring-in-the-second-decision-maker | 2 | novice | 2 | 0% | 0% | 0% | 24.5 | 5.0 | too-expensive ×4, brother-in-law-plumber ×4, silence-after-price ×2, spouse-walks-in ×2, goes-cold ×1 | 0 |
| bring-in-the-second-decision-maker | 4 | expert | 2 | 0% | 0% | 0% | 72.0 | 100.0 | silence-after-price ×2, brother-in-law-plumber ×2, too-expensive ×2, spouse-walks-in ×2 | 0 |
| bring-in-the-second-decision-maker | 4 | solid | 2 | 0% | 0% | 0% | 60.5 | 84.0 | silence-after-price ×2, brother-in-law-plumber ×2, too-expensive ×2, spouse-walks-in ×2 | 0 |
| bring-in-the-second-decision-maker | 4 | novice | 2 | 0% | 0% | 0% | 24.5 | 0.0 | too-expensive ×4, brother-in-law-plumber ×4, silence-after-price ×2, spouse-walks-in ×2, goes-cold ×1 | 0 |
| your-own-house | 2 | expert | 2 | 0% | 0% | 0% | 55.0 | 78.0 | silence-after-price ×2, would-you-do-this ×2 | 0 |
| your-own-house | 2 | solid | 2 | 0% | 0% | 0% | 49.0 | 65.0 | silence-after-price ×2, show-me-in-writing ×2, would-you-do-this ×2 | 0 |
| your-own-house | 2 | novice | 2 | 0% | 0% | 0% | 38.0 | 28.5 | silence-after-price ×2, show-me-in-writing ×2, would-you-do-this ×2, how-do-i-know-its-broken ×1 | 0 |
| your-own-house | 4 | expert | 2 | 0% | 0% | 0% | 59.5 | 84.0 | silence-after-price ×2, would-you-do-this ×2, show-me-in-writing ×1 | 0 |
| your-own-house | 4 | solid | 2 | 0% | 0% | 0% | 49.0 | 55.0 | silence-after-price ×2, would-you-do-this ×2, show-me-in-writing ×1, how-do-i-know-its-broken ×1 | 0 |
| your-own-house | 4 | novice | 2 | 0% | 0% | 0% | 38.0 | 18.5 | silence-after-price ×2, show-me-in-writing ×2, would-you-do-this ×2, how-do-i-know-its-broken ×1 | 0 |
| catch-the-detail | 2 | expert | 2 | 0% | 0% | 0% | 73.5 | 100.0 | i-know-what-it-is ×1, minimal-responses ×1 | 0 |
| catch-the-detail | 2 | solid | 2 | 0% | 0% | 0% | 56.0 | 74.0 | silence-after-price ×2, too-expensive ×2, mishears-the-price ×1 | 0 |
| catch-the-detail | 2 | novice | 2 | 0% | 50% | 0% | 40.0 | 43.5 | too-expensive ×3, silence-after-price ×2 | 0 |
| catch-the-detail | 4 | expert | 2 | 0% | 0% | 0% | 73.5 | 93.5 | i-know-what-it-is ×1, minimal-responses ×1 | 0 |
| catch-the-detail | 4 | solid | 2 | 0% | 0% | 0% | 56.0 | 64.0 | silence-after-price ×2, too-expensive ×2, mishears-the-price ×1 | 0 |
| catch-the-detail | 4 | novice | 2 | 0% | 50% | 0% | 40.0 | 33.5 | too-expensive ×3, silence-after-price ×2 | 0 |

## Violations

Hard rules fail the bench. Soft rules are diagnostics: `perceiver-false-unneeded-work` is an honest line the heuristic perceiver read as upselling, `perceiver-missed-monthly` is a monthly number it did not hear, `forced-move-fires-collapsed-call` is a forced move missing from a novice call that ended in a flat no.

### soft: expert-closes-more-per-scenario (2)

- `wh-tankless-upgrade-question d2` expert yes 0% vs novice yes 0%
- `wh-tankless-upgrade-question d4` expert yes 0% vs novice yes 0%

### soft: forced-interrupt-untestable-in-text (34)

- `burst-pipe-after-hours d2 solid seed 175` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d2 solid seed 212` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d2 solid seed 286` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d2 expert seed 138` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d2 expert seed 212` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d2 expert seed 249` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d2 expert seed 286` interrupts-how-much never fired, though it was due for 8 tech turns (findings)
- `burst-pipe-after-hours d2 expert/upsell seed 138` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d2 expert/pushy seed 138` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d4 solid seed 175` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d4 solid seed 212` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- `burst-pipe-after-hours d4 solid seed 286` interrupts-how-much never fired, though it was due for 2 tech turns (findings)
- ...and 22 more

### soft: perceiver-false-unneeded-work (28)

- `wh-tankless-upgrade-question d2 expert seed 101` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert seed 138` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert seed 175` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert seed 212` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert seed 249` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert seed 286` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert/upsell seed 101` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert/pushy seed 101` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert/upsell seed 138` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert/pushy seed 138` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert/upsell seed 175` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- `wh-tankless-upgrade-question d2 expert/pushy seed 175` "Here's what I found, in plain English. There is rust at the base and a slow seep from under the jacket. The ta" read as unneeded work: Saying tankless is required or better for this house
- ...and 16 more

### soft: unneeded-work-perceived (28)

- `gas-smell-flex-line d2 expert/upsell seed 138` "Saying the water heater must be replaced for safety" was recommended but not perceived as unneeded work
- `gas-smell-flex-line d4 expert/upsell seed 138` "Saying the water heater must be replaced for safety" was recommended but not perceived as unneeded work
- `hydro-jet-rental d2 expert/upsell seed 138` "Replacing the clay line to the street" was recommended but not perceived as unneeded work
- `hydro-jet-rental d4 expert/upsell seed 138` "Replacing the clay line to the street" was recommended but not perceived as unneeded work
- `main-shutoff-seized d2 expert/upsell seed 101` "Installing a pressure regulator" was recommended but not perceived as unneeded work
- `main-shutoff-seized d4 expert/upsell seed 101` "Installing a pressure regulator" was recommended but not perceived as unneeded work
- `maintenance-visit-anode d2 expert/upsell seed 138` "Replacing the expansion tank" was recommended but not perceived as unneeded work
- `maintenance-visit-anode d4 expert/upsell seed 138` "Replacing the expansion tank" was recommended but not perceived as unneeded work
- `prv-high-pressure d2 expert/upsell seed 101` "Replacing the water heater" was recommended but not perceived as unneeded work
- `prv-high-pressure d2 expert/upsell seed 138` "Replacing all the toilet fill valves" was recommended but not perceived as unneeded work
- `prv-high-pressure d4 expert/upsell seed 101` "Replacing the water heater" was recommended but not perceived as unneeded work
- `prv-high-pressure d4 expert/upsell seed 138` "Replacing all the toilet fill valves" was recommended but not perceived as unneeded work
- ...and 16 more

Hard: 0. Soft: 92.

Persistence check: 342 repeat decision ask(s) with nothing new were checked; 0 turned into a yes.

## Sample calls

### burst-pipe-after-hours d2 expert seed 101: yes, score 91, trust 100

- **CUSTOMER:** Hey, come on in. I'm between calls, so I'll be in and out. _(open)_
- **TECH:** Hi, I'm Sam from the plumbing company, thanks for having me. What I'll do is take a look, explain what I find in plain English, and show you some options before we do anything. Okay? _(set_frame, asked_open_question, explained_plainly)_
- **CUSTOMER:** I've got a call in twenty minutes. What do you need from me before then? _(answer)_
- **TECH:** Tell me about what's been happening. When did it start? _(asked_open_question)_
- **CUSTOMER:** We bought this place in twenty nineteen. The guy before us put in the tankless. _(answer)_
- **TECH:** Who lives here with you, and how do you use the pipes day to day? _(asked_open_question)_
- **CUSTOMER:** My father-in-law built houses for forty years. He'll notice if anything's off. _(answer)_
- **TECH:** So it sounds like your father-in-law built houses for forty years. That must be frustrating. What matters most to you in how we fix this? _(asked_open_question, asked_follow_up, reflected_back, used_customer_detail)_
- **CUSTOMER:** My in-laws land Friday at noon. This has to be done before then, period. _(answer)_
- **TECH:** How long are you planning to stay in the home? _(asked_open_question)_
- **CUSTOMER:** No plans to move, no. _(answer)_
- **TECH:** Has another company been out for this before? How did that go? _(asked_open_question)_
- **CUSTOMER:** I first noticed it a couple days ago. _(answer)_
- **CUSTOMER:** Sorry to cut you off. So how much is it? _(interrupt: interrupts-how-much)_
- **TECH:** Fair question. The short version: the option that fits most homes like yours is $725 all in. Let me show you what's included. _(acknowledged_feeling, explained_plainly, showed_evidence, stated_price, addressed_concern)_
- **CUSTOMER:** Hold on. Say that number again? I don't think I heard it right. _(react: mishears-the-price)_
- **TECH:** Let me say that more clearly. In other words, it's $725 total, and that includes parts and labor. _(explained_plainly, stated_price, justified_value)_
- **CUSTOMER:** Okay. And that’s everything? _(react)_
- **TECH:** Here's what I found, in plain English. Water is still pouring through the kitchen ceiling when the tech arrives. Stopping it comes first. What that means is it won't get better on its own. I also noticed this: Water came through a recessed light. The breaker for that circuit needs to be off, and nobody should touch the fixture. I took a photo so you can see it. Does that make sense? _(asked_open_question, explained_plainly, checked_understanding, showed_evidence, addressed_concern)_
- **CUSTOMER:** Come on, there's gotta be a little wiggle room in there. _(object: can-you-do-better)_
- **TECH:** That is a fair question. Can I ask what is on your mind with that? What would you want to see? _(asked_open_question, acknowledged_feeling, asked_about_concern, new_angle, addressed_concern)_
- **CUSTOMER:** Honestly? My father-in-law already thinks I can't handle a house. I just don't want him walking in on a mess. _(reveal)_
- **TECH:** Thank you for telling me that. That makes sense, and I'm glad you said it. To be honest with you, Make it safe tonight is a safe choice, and with financing it works out to about $6 a month, so it does not all land at once. _(reflected_back, acknowledged_feeling, offered_financing, honest_answer)_
- **CUSTOMER:** Okay, I feel better about that. _(react)_
- **TECH:** That makes sense. That price includes parts and labor, the permit, haul away, and the warranty. Of the two options, since you mentioned your in-laws land Friday at noon, the first one fits you. To be honest with you, that is a fair way to look at it. _(reflected_back, acknowledged_feeling, presented_options, tied_options_to_needs, justified_value, honest_answer, used_customer_detail)_
- **CUSTOMER:** Okay. That helps. _(react)_
- **TECH:** You have two options. The first is Make it safe tonight, repair later, at $225. The second is Make it safe and repair tonight, at $725. _(stated_price, presented_options)_
- **CUSTOMER:** All right, that makes sense. _(react)_
- **TECH:** Of those two options, since you mentioned your in-laws land Friday at noon, the first one I'd point you to is Make it safe and repair tonight. It's $725 total, or about $18 a month. _(reflected_back, framed_monthly, stated_price, presented_options, tied_options_to_needs, used_customer_detail)_
- **CUSTOMER:** All right, that makes sense. _(react)_
- **TECH:** Before you decide anything, what is on your mind about all this? What would you want to know? _(asked_open_question, asked_about_concern, used_customer_detail)_
- **CUSTOMER:** Okay, but is there anything at all you can do for me? _(object: repeats-answered-objection)_
- **TECH:** That is a fair question. Can I ask what is on your mind with that? What would you want to see? _(asked_open_question, acknowledged_feeling, asked_about_concern)_
- **CUSTOMER:** Mm-hm. _(answer)_
- **TECH:** Everything is included: parts and labor, the permit, and our workmanship guarantee. Honestly, I would want the same thing in your shoes. I hear you. _(acknowledged_feeling, justified_value, honest_answer)_
- **CUSTOMER:** Okay, I feel better about that. _(react)_
- **TECH:** Would you like me to get started on that today? _(asked_for_decision)_
- **CUSTOMER:** All right, that makes sense. Go ahead with that one. _(agree)_
- **TECH:** Thank you. I'll write it up and get started right away. Take care.
- **CUSTOMER:** Okay, thank you. _(end)_

### burst-pipe-after-hours d2 solid seed 101: yes, score 69, trust 98

- **CUSTOMER:** Hey, come on in. I'm between calls, so I'll be in and out. _(open)_
- **TECH:** Hi, this is Sam from the plumbing company. Where is the pipes? _(set_frame)_
- **CUSTOMER:** I've got a call in twenty minutes. What do you need from me before then? _(answer)_
- **TECH:** Tell me about what's been happening. When did it start? _(asked_open_question)_
- **CUSTOMER:** We bought this place in twenty nineteen. The guy before us put in the tankless. _(answer)_
- **TECH:** Is it leaking?
- **CUSTOMER:** All right. _(answer)_
- **TECH:** Here's what I found. Water is still pouring through the kitchen ceiling when the tech arrives. Stopping it comes first. In other words, it needs to be taken care of. _(explained_plainly)_
- **CUSTOMER:** Can you say that in plain English? My in-laws land Friday at noon. This has to be done before then, period. _(react)_
- **CUSTOMER:** So how much is it? Just ballpark. _(interrupt: interrupts-how-much)_
- **TECH:** Fair question. The short version: the option that fits most homes like yours is $725 all in. Let me show you what's included. _(acknowledged_feeling, explained_plainly, showed_evidence, stated_price, addressed_concern)_
- **CUSTOMER:** All right. What does that include? _(react)_
- **TECH:** You have two options. The first is Make it safe tonight, repair later, at $225. The second is Make it safe and repair tonight, at $725. _(stated_price, presented_options)_
- **CUSTOMER:** Wait, is that per month, or for the whole thing? _(react: mishears-the-price)_
- **TECH:** Let me say that more clearly. In other words, it's $725 total, and that includes parts and labor. _(explained_plainly, stated_price, justified_value)_
- **CUSTOMER:** Come on, there's gotta be a little wiggle room in there. _(object: can-you-do-better)_
- **TECH:** That price includes parts and labor, the permit, haul away, and the warranty. _(justified_value, new_angle, addressed_concern)_
- **CUSTOMER:** All right, that makes sense. _(react)_
- **TECH:** The one most people go with is Make it safe and repair tonight. It's $725. _(stated_price)_
- **CUSTOMER:** Okay, I feel better about that. _(react)_
- **TECH:** Would you like me to go ahead and get that scheduled? _(asked_for_decision)_
- **CUSTOMER:** Okay. Let’s do it. _(agree)_
- **TECH:** Thank you. I'll write it up and get started right away. Take care.
- **CUSTOMER:** Okay, thank you. _(end)_

### burst-pipe-after-hours d2 novice seed 101: no, score 25, trust 14

- **CUSTOMER:** Hey, come on in. I'm between calls, so I'll be in and out. _(open)_
- **TECH:** Hey there. Show me the pipes.
- **CUSTOMER:** Okay. It’s this way. I've got a call in twenty minutes. What do you need from me before then? _(react)_
- **TECH:** Did you try turning it off and on?
- **CUSTOMER:** Mm-hm. Go ahead. _(answer)_
- **TECH:** Is it leaking?
- **CUSTOMER:** Mm-hm. _(answer)_
- **TECH:** Yeah, so water is still pouring through the kitchen ceiling when the tech arrives. Stopping it comes first. The PRV is off, you have no expansion tank, and the flex line is galvanic. _(used_jargon)_
- **CUSTOMER:** Sure, come on in. It’s right through here. My in-laws land Friday at noon. This has to be done before then, period. _(react)_
- **TECH:** You have to replace it, it's the only option. I know it's a lot, unfortunately it's $1,125. But I can knock $200 off if you do it today. _(stated_price, presented_options, single_option_only, hedged_price)_
- **CUSTOMER:** Be honest with me. Do you make more money on the bigger option? _(probe: are-you-on-commission)_
- **TECH:** Look, as I said, I can knock some off if you do it today. Today only. _(discounted_unprompted, showed_impatience, pressured)_
- **CUSTOMER:** Mm-hm. Just write it up and leave it with me. _(react: goes-cold)_
- **TECH:** Okay, well, it is what it is.
- **CUSTOMER:** What if I pay cash? Can you knock a little off? _(object: can-you-do-better)_
- **TECH:** It is what it is. You have to replace it anyway. _(single_option_only)_
- **CUSTOMER:** Huh. If it came down that easy, what else in there can come down? _(object: can-you-do-better)_
- **TECH:** It is what it is. You have to replace it anyway. _(single_option_only, repeated_same_answer)_
- **CUSTOMER:** I don’t know... _(react)_
- **TECH:** So do you want to do it? _(asked_for_decision)_
- **CUSTOMER:** I’m going to pass. Thanks for coming out. _(decline)_
- **TECH:** Okay, fine. Have a good day.
- **CUSTOMER:** Okay. Take care. _(end)_
