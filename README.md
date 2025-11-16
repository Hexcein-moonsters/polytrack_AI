# polytrack-AI
PPO model in Polytrack, using simulation_worker.js and creating replays

Not using Kodub's main.bundle.js allows me to simulate the game without rendering anything, no UI processing is done. RealTime mode is disabled, it attempts to run sim loop as fast as possible.
This allows me to run the game much faster, about a 70x speedup. For 1000 iterations (full inference-to-training), with 5s targetSimulationTime, takes around 70s irl. 5000s/70s ~= 70x

Proximal Policy Optimization vocabulary: policyNetwork (actor, does inference), valueNetwork (critic, only used in training)

Full experience-gathering workflow (inference, data needed to learn/train/adapt the model):
1) Creating a car and track *(Environment Reset)*
2) Simulating 100ms
3) Asking AI to make a prediction of 12 key combination probabilities (from agentState observation) *(Policy Step)*
4) Selecting a control and sending it to the simulation, run 100ms *(Environment Step)*
5) Calculate the reward of this nextState and assign it in experience list of that action
5) Repeat step 1-4 until we've reached 5000ms (5 seconds) of in-game time *(Continue Rollout)*
6) endOfEpisode, delete car and ask simulation to store our inputs

Training workflow:
1) Get experienceBuffer of that car *(Rollout Buffer)*
2) Advantage calculation (GAE): valueNetwork predicts V(s) and V(s')
3) Loss calculation:
- policyNetwork loss: Clipped ratio of oldProbs (probability of chosen action during inference) and newProbs (new decision of old states), multiply by advantages
- valueNetwork loss: MSE targets of valueNetwork prediction compared to actual reward
- Total Loss: Sum of policy loss, value loss, and entropy loss
4) Minimize loss (adam) for multiple epochs of both policyNetwork and valueNetwork *(Update Step)*
5) Clear buffer, and tell sim to store all controls, repeat by sending train_done to main logic thread which'll create new car with same carID (new rollout)
6) If ai_environment.js (main logic thread) sees a best attempt it will ask sim to make carRecording string from controls - then updates frontend graphs and stats


## Requirements
TL;DR: 3-4 GB of ram is recommended. GPU is apparently not required but would massively speed up .predict (inference) and .minimize (train) calls with tfjs.

Ammo.wasm.wasm pre-allocates 16384 pages of 65536 bytes, making it always use 1.08 GB of RAM ("typed arrays"). The simulation also having to store a lot of physics vertices from tracks and cars adds another ~50MB (with 100 cars for me). ExperienceBuffers and other things bring the JS heap size to about 150MB.
Overall expect about 1.5 GB of RAM to be used by the site, and ~1 GB of vram usage of the GPU because it stores all those AI tensors.

I am running this with an i7-12700KF CPU and rtx 5060ti GPU with 16 GB vram and 32 GB ram to achieve a 70x sim speedup, but I've also ran this on a school Lenovo laptop with 16 GB ram and 1 GB vram (although tensors got stored on ram instead here) with a very rough speedup estimation (from my memory of a month ago) of 9x.

The reason ammo.wasm.wasm takes up so much RAM is because I modified it to use 16x more RAM than normal Polytrack, as this extends the max cars from the usual 15 to now 310. If you don't use this you will get an OOM error!

### Software requirements:
I have currently only tested this on Windows 11 with pnpm (any package manager would work perfectly fine) and Node.js v22.17.0, frontend on Google Chrome: v142.0.7444.163.
The backend is very flexible, it only uses Express to serve /public at localhost:19999, so as long as your code language can serve a static website this project should work. I'm not sure about the frontend requirements though, as I use `navigator.wakeLock.request("screen");` to prevent the WebGL Context from being lost (as that makes the AI unable to predict anything and will forever run the simulation with 0% progress and will completely dumb-ify)

## Usage
`pnpm install`, `node main.js`, Open `localhost:19999` in browser to get a black page with a determinism speed check in console. If the determinism check fails, you cannot run the simulation. (Normal Polytrack has the same requirements, it's most likely that the check will succeed). A good speed is about 10-25ms.

The most up-to-date directory is currently /public/ppo_training_path_correct, so head over to `localhost:19999/ppo_training_path_correct`. You can append an optional `?modelName=model1` if you want different sites/windows to train/use a different AI model (stored in indexedDB).
It will automatically either load an existing model or create a new model, and starts infinitely doing iterations (resumes iterationCount, stored per modelName in localStorage). The best attempt (since page load, not all-time, i.e., bestAttempt is not saved in localStorage) will also be displayed:
- Total Rewards: Sum of reward of each action in this attempt
- Track Progress: Percentage, measured by checking nearest path-point at end of attempt (path = list of points spaced ~0.5 meters apart from each other)
- Car Recording: The replay string you can put into Polytrack
- Attempts: What the iterationCount was at this bestAttempt timestamp

## Viewing AI Attempts
Get a list of all carRecording's (from bestAttempt for example) you want to display.
You will need to set up devtools (Chrome) overrides first:
1) Go to https://app-polytrack.kodub.com/0.5.0/ or whatever your desired version is
2) Open devtools, click Sources, click on '>>' ('more tabs') and click on Overrides
3) If first time: Assign/create a folder to use for overrides
4) Download and extract the project to get the /replay_renderer folder
5) Put the contents of the replay_renderer folder inside of your overrides folder

Example overrides folder setup:
```properties // Own note: this syntax highlighting is the only perfect one for the colors I want
.overrides/
└── app-polytrack.kodub.com/
    └── 0.5.0/
        └── main.bundle.js  (custom logic for loading cars)
        └── ammo.wasm.wasm  (for 310 cars, increased memory)
```

Now reload Polytrack while the devtools are open and while 'Enable Local Overrides' is enabled.
If everything goes well you'll see a pink/purple dot next to main.bundle.js in Sources. You can now click on that main.bundle.js file and edit (ctrl+S) to override that content. In my example file I have put 4 replay strings in the `extraReplays` list.
You now put your AI's carRecordings into that list of objects, at `{ c: "putCompressedCarRecordingHere" }`. You can modify the `AI_carColor`, get values from localStorage of key `polytrack_v4_prod_user_0`, it will be listed as `carColors: "compressedHexCodeHere"`, which is your own current car color. This describes all config values (primary, secondary, frame, rims).
And also change `const replayDuration = 5000;` to the targetSimulationTimeFrames (in ms).

Now all that's left to do is go to the desired track and click on 'Watch' without selecting any players. This will trigger an injection of your car recordings. You can use the timeline and pause and switch-car buttons like usual. You can click 'Back' to let yourself drive against these attempts. (All normal Polytrack logic)