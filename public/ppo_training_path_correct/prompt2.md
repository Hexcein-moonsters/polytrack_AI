"We are training a PPO racing AI in a custom physics game.

VERY IMPORTANT:
Goal is NOT human driving.
Goal is NOT path following.
Goal is NOT realism.

The ONLY true objective is:

* finish as fast as possible
* hit checkpoints in required order
* any route/exploit/physics abuse is allowed if checkpoints + finish are valid

This means:

* shortcuts are GOOD
* wallrides are GOOD
* jumps are GOOD
* replay inaccuracies are irrelevant
* path replay is ONLY a shaping prior, NOT legality

Current major issue:
Progress reward is hacked because progress comes from:

```js
treeNearest(carPos, 1)
```

using a global KD-tree over the entire replay path.

Track folds over itself spatially:

* bridges
* jumps
* nearby future sections
* overlapping geometry

This causes fake progress spikes:

* under bridges
* near finish
* flying near later path sections
* reward farming

IMPORTANT:
I do NOT want anti-exploit systems that suppress valid skips.
I specifically WANT the AI to discover insane shortcuts if checkpoints still validate.

So:
DO NOT add:

* max speed clamps
* anti-air punishments
* strict centerline following
* path enforcement
* “human driving” shaping

The replay path may be extremely bad.
The AI should still eventually discover much faster routes.

CORE DESIGN PHILOSOPHY:
Replay path should ONLY provide:

* dense shaping
* rough topology prior
* exploration guidance

The ONLY legality system is:

* ordered checkpoints
* finish line

---

## CURRENT THINKING / TARGET ARCHITECTURE

Instead of ONE global path:

START -> CP1 -> CP2 -> FINISH

split replay into checkpoint-local segments:

segment0 = START -> CP1
segment1 = CP1 -> CP2
segment2 = CP2 -> FINISH

Then:
ONLY search nearest points INSIDE CURRENT CHECKPOINT SEGMENT.

This prevents:

* future-track reward hacks
* under-bridge progress
* finish camping

WITHOUT suppressing real skips.

Huge shortcuts still work because:

* nearest progress still advances within current segment
* checkpoints still validate topology

---

## IMPORTANT REWARD IDEAS

Reward should become VERY simple.

Probably approximately:

```js
reward =
    progressGain * 0.02
    - 0.001
    + checkpointReward
    + finishReward
    - smallCollisionPenalty
```

Potential values:

```js
checkpointReward = 5
finishReward = 100
```

IMPORTANT:
Progress reward should NOT use raw deltaProgress_action.

Instead use:
“best progress reached so far”.

Reason:
Raw delta allows exploit farming:

+10
-5
+10
-5

Best-progress reward instead becomes:

+10
0
0
0

which rewards ONLY discovering farther progress.

Pseudo:

```js
previousBest = bestProgress_PerCar[carID]
newBest = Math.max(previousBest, progressIndex)

progressGain = newBest - previousBest

bestProgress_PerCar[carID] = newBest
```

Then:

```js
reward += progressGain * 0.02
```

QUESTION:
Need help integrating this correctly with checkpoint-local progress.

---

IMPORTANT:
NO strict anti-shortcut logic
-----------------------------

I do NOT want:

* hard distance rejection
* strict replay adherence
* progress speed clamping
* anti-teleport assumptions

because valid optimal routes may look insane.

Only checkpoint ordering matters.

---

## CURRENT OBSERVATIONS

Observations already include:

* local velocity
* vertical velocity
* future local-space lookahead points
* wheel contact/skid/suspension
* progress metrics

Lookaheads:
[5, 15, 40, 100]

Current extra height feature added:

```js
agentState.push((lookaheadPoint.y - carPos.y) / 20);
```

Goal:
let PPO infer:

* jumps
* ramps
* drops
* landing setup

WITHOUT hardcoded jump rewards.

---

## IMPORTANT EXISTING PHILOSOPHY

Geometry understanding should come from OBSERVATIONS,
NOT reward shaping.

Meaning:

* local lookaheads tell PPO future curvature
* PPO figures out racing line itself
* reward mainly optimizes completion speed

Avoid reintroducing:

* steering rewards
* alignment rewards
* centerline rewards

unless absolutely necessary.

---

## CURRENT TASKS FOR NEXT CHATBOT

Need help implementing:

1. checkpoint-local segmented progress system
2. replacing global KD-tree progress
3. proper progress storage per car
4. best-progress reward integration
5. smooth progress computation
6. whether segment projection onto lines is worth implementing now
7. exact code architecture changes
8. whether progress should become floating-point instead of point index
9. clean reward design aligned with “fastest legal finish only”

Current code still mostly uses:

* global nearest lookup
* point indices
* deltaProgress_action reward

Need help replacing this cleanly without accidentally suppressing valid exploits/shortcuts."


Update, I don't know if I did everything in the checklist yet, but I made point segments to get accurate progress I think.
However I've noticed that after 500 iterations the Returns about stay the same (reward), and after 2000 iterations nothing really changes on progress/reward at all anymore, it stagnates.
Additionally the AI replay looks like random actions which makes it brake a lot and do random keys to get any lucky forward progress. It isn't even going fast

You know that I don't really care about consistency or safety: I want to eventually compete with world record, or TAS/bruteforce. (However showing generalization on a track is very cool too). End goal is finding shortest route in any track (with finetuning training per track) even with super sloppy human driven run.

Also, the current path progress points is created from the world record on that track! Why is the AI doing terrible


