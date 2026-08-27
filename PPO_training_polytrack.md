# Detailed Technical Analysis and Implementation Framework for Proximal Policy Optimization in High-Frequency Autonomous Vehicle Control

The development of robust autonomous driving agents necessitates a sophisticated approach to reinforcement learning that balances computational efficiency with the stability of the policy update. Proximal Policy Optimization (PPO) has emerged as the industry standard for these tasks, particularly in environments characterized by high-frequency observation cycles and discrete-continuous action spaces.[1],[2] In a simulation environment where a vehicle receives observations every 0.1 seconds and maps these to a combinatorial action space of 12 discrete steering and acceleration commands, the selection of the optimization algorithm is critical to preventing the catastrophic performance collapse common in standard policy gradient methods.[3],[4]

## Theoretical Foundation and the Evolution of Policy Optimization

To understand the necessity of PPO, one must first analyze the limitations of earlier reinforcement learning paradigms. Vanilla Policy Gradient methods, such as REINFORCE, rely on the log-derivative trick to update policy parameters based on observed returns.[5],[6] However, these methods are notoriously sensitive to the learning rate; a single large update can move the policy into a region of the parameter space where the agent performs poorly, leading to a feedback loop of increasingly worse data collection and eventual failure.[3],[7] 

Trust Region Policy Optimization (TRPO) attempted to resolve this by enforcing a hard constraint on the Kullback-Leibler (KL) divergence between the old and new policies, ensuring that updates remained within a "safe" region.[3],[4] While mathematically elegant, TRPO requires the computation of second-order derivatives and the inversion of the Fisher Information Matrix, operations that are computationally expensive and difficult to implement efficiently in high-level environments like TensorFlow.js.[4],[7] PPO provides a first-order approximation of this trust region by using a clipped surrogate objective, which achieves similar stability with significantly lower computational overhead.[3],[7],[8]

### The PPO-Clip Objective Function

The primary mechanism of PPO is the modification of the objective function to penalize updates that move the probability ratio $r_t(
\theta)$ too far from unity.[6],[7] The probability ratio represents the likelihood of an action under the current policy relative to the old policy used during data collection:

$$r_t(
\theta) = 
\frac{
\pi_{
\theta}(a_t|s_t)}{
\pi_{
\theta_{old}}(a_t|s_t)}$$

In a car racing context, where a 5-second window yields only 50 decision points, every update must be meaningful yet constrained.[2] The PPO objective function is defined as the minimum of two terms:

$$L^{CLIP}(
\theta) = 
\hat{
\mathbb{E}}_t 
\left[ 
\min(r_t(
\theta) 
\hat{A}_t, 
\text{clip}(r_t(
\theta), 1 - 
\epsilon, 1 + 
\epsilon) 
\hat{A}_t) 
\right]$$

The first term is the standard surrogate objective $r_t(
\theta) 
\hat{A}_t$, and the second term clips the ratio within a range $[1-
\epsilon, 1+
\epsilon]$, where $
\epsilon$ is typically 0.2.[1],[2],[7] This clipping ensures that if an action is much more probable in the new policy than the old one, but the advantage $
\hat{A}_t$ is positive, the objective stops increasing after a certain point, effectively removing the incentive to move the policy further.[8],[9]

## Architectural Considerations for Autonomous Control

For an agent processing 93 inputs and controlling a vehicle with 12 discrete actions, the neural network architecture must be deep enough to capture complex spatial and temporal relationships while remaining fast enough for inference in 0.1-second intervals.[10],[11] The standard approach involves an Actor-Critic architecture where the "Actor" (policyNetwork) selects actions and the "Critic" (valueNetwork) estimates the value of states.[12],[13]

### Discrete Action Space Mapping

The 12-action output represents a discrete combinatorial set of WASD inputs. Mapping these indices to continuous control signals for the physics engine is a process known as hard discretization.[11]

| Action Index | Input Keys | Keys | Steering | Throttle | Brake | Resulting Maneuver |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | A | ← | ← **−**1 | 0 | 0 | Hard Left Turn |
| 1 | A+S | ← 🔴 | ← **−**1 | 0 | 1 🔴 | Left Turn + Brake |
| 2 | A+W | ← 🔼 | ← **−**1 | 1 🔼 | 0 | Left Turn + Accelerate |
| 3 | A+W+S | ← 🔼 🔴 | ← **−**1 | 1 🔼 | 1 🔴 | Left Power-Slide |
| 4 | (None) |  | 0 | 0 | 0 | Coasting / Neutral |
| 5 | S | 🔴 | 0 | 0 | 1 🔴 | Full Braking |
| 6 | W | 🔼 | 0 | 1 🔼 | 0 | Full Acceleration |
| 7 | W+S | 🔼 🔴 | 0 | 1 🔼 | 1 🔴 | Burnout / Static Brake |
| 8 | D | → | 1 → | 0 | 0 | Hard Right Turn |
| 9 | D+S | → 🔴 | 1 → | 0 | 1 🔴 | Right Turn + Brake |
| 10 | D+W | → 🔼 | 1 → | 1 🔼 | 0 | Right Turn + Accelerate |
| 11 | D+W+S | → 🔼 🔴 | 1 → | 1 🔼 | 1 🔴 | Right Power-Slide |

This discrete set allows the agent to explore all cardinal directions and combinations while simplifying the policy head to a softmax distribution over 12 units.[11],[14] This is often more stable than a continuous output head (e.g., Beta or Gaussian distribution) in the early stages of learning for vehicle dynamics.[11]

### Optimization Strategy: Separate vs. Shared Architectures

While many PPO implementations use a shared trunk for the actor and critic to encourage common feature representation, the use of separate optimizers is highly recommended for stability in high-variance environments.[8],[15] The critic network (value function) often requires a higher learning rate and more frequent updates to converge on an accurate advantage estimate, whereas the actor network (policy) requires a smaller, more conservative learning rate to prevent trust region violations.[8],[15]

A common hyperparameter configuration for vehicle racing involves:
*   **Policy Learning Rate**: $3 
\times 10^{-4}$.[2],[16],[17]
*   **Value Learning Rate**: $1 
\times 10^{-3}$.[4],[10]

## Mathematical Refinement: Generalized Advantage Estimation (GAE)

The advantage function $
\hat{A}_t$ is the most critical component of the PPO update, as it determines whether an action should be encouraged or discouraged.[18],[19] In a 5-second simulation window, using raw returns (the sum of future rewards) leads to high variance, while using simple TD-errors leads to high bias.[19],[20] GAE balances these by taking an exponentially weighted average of $k$-step advantage estimates.[18],[21]

The TD residual $
\delta_t$ is defined as:
$$
\delta_t = r_t + 
\gamma V(s_{t+1}) - V(s_t)$$

The GAE estimate at time $t$ is calculated as:
$$
\hat{A}_t = 
\sum_{l=0}^{
\infty} (
\gamma 
\lambda)^l 
\delta_{t+l}$$

The parameter $
\lambda$ controls the trade-off: $
\lambda=0$ results in the 1-step TD estimate, while $
\lambda=1$ results in the Monte Carlo return.[19],[20],[21] For driving tasks where the consequences of a steering choice might not be felt until the car rounds a corner 2 seconds later, $
\lambda=0.95$ is generally preferred to maintain a long-horizon credit assignment without excessive noise.[2],[17],[21]

## Implementation in TensorFlow.js: Training Logic and Memory Management

Implementing PPO in a browser environment using TensorFlow.js requires careful management of asynchronous operations and tensor lifecycles. Unlike Python-based environments, JavaScript's Garbage Collector does not automatically free GPU memory, making `tf.tidy()` and `tf.dispose()` mandatory for stable training.[22],[23],[24]

### Data Preparation and Buffer Transformation

Before training can occur, the experience buffer must be converted into tensors. For a 50-step trajectory, the states, actions, old log-probabilities, and rewards are aggregated. A critical implementation detail involves reward normalization and advantage standardization.[1],[12],[15] Standardizing advantages (subtracting the mean and dividing by the standard deviation) across the batch ensures that the updates are not dominated by the scale of the environment's reward function.[1],[8],[15]

| Data Type | Shape | Purpose |
| :--- | :--- | :--- |
| **States** | `[93]` | Input observations for the Actor and Critic.[10] |
| **Actions** | `[12]` | One-hot or indices of the WASD combinations.[11] |
| **Returns** | `[50?]` | Targeted state-values (GAE + current value).[15],[21] |
| **Advantages**| `[50?]` | Standardized relative goodness of actions.[1],[8] |
| **LogProbs** | `[50?]` | Probability of action under the policy that collected data.[8] |

### The Training Loop: Multi-Epoch Optimization

PPO updates the networks over several epochs using the same batch of data. To prevent overfitting to a small sample, the data is typically shuffled and divided into minibatches.[22],[25],[26] In the provided 50-sample scenario, a minibatch size of 16 to 32 is appropriate.[2],[16]

```javascript
/**
 * PPO Training Logic for Autonomous Vehicle
 * Integrates Actor-Critic clipping, Entropy bonus, and separate optimizers.
 */
async function trainPPO(policyNet, valueNet, buffer, config) {
    const { 
        gamma = 0.99, lambda = 0.95, epsilon = 0.2, 
        pLR = 3e-4, vLR = 1e-3, c2 = 0.01, 
        epochs = 10, batchSize = 16 
    } = config;

    // 1. Calculate Advantages and Returns
    const { advantages, returns } = tf.tidy(() =\\u003e {
        const states = tf.tensor2d(buffer.map(e =\\u003e e.agentState));
        const rewards = buffer.map(e =\\u003e e.reward);
        const values = buffer.map(e =\\u003e e.valueEstimate);
        const nextValues = [...values.slice(1), 0]; // 0 for terminal state
        const dones = buffer.map(e =\\u003e e.done);

        let gae = 0;
        const advs = new Array(buffer.length);
        const rets = new Array(buffer.length);

        for (let t = buffer.length - 1; t \\u003e= 0; t--) {
            const delta = rewards[t] + gamma * nextValues[t] * (dones[t]? 0 : 1) - values[t];
            gae = delta + gamma * lambda * (dones[t]? 0 : 1) * gae;
            advs[t] = gae;
            rets[t] = gae + values[t];
        }

        // Standardize advantages
        const advTensor = tf.tensor1d(advs);
        const mean = advTensor.mean();
        const std = tf.sqrt(tf.mean(tf.square(tf.sub(advTensor, mean))).add(1e-8));
        const normalizedAdvs = tf.div(tf.sub(advTensor, mean), std);

        return { advantages: normalizedAdvs, returns: tf.tensor1d(rets) };
    });

    const statesTensor = tf.tensor2d(buffer.map(e =\\u003e e.agentState));
    const actionsTensor = tf.tensor1d(buffer.map(e =\\u003e e.action.actionIndex), 'int32');
    const oldLogProbs = tf.tensor1d(buffer.map(e =\\u003e e.action.logProb));

    const policyOpt = tf.train.adam(pLR);
    const valueOpt = tf.train.adam(vLR);

    // 2. Optimization Epochs
    for (let i = 0; i \\u003c epochs; i++) {
        const indices = tf.util.createShuffledIndices(buffer.length);
        for (let j = 0; j \\u003c indices.length; j += batchSize) {
            const batchIdx = indices.slice(j, j + batchSize);

            // Policy Update
            policyOpt.minimize(() =\\u003e {
                return tf.tidy(() =\\u003e {
                    const bStates = statesTensor.gather(batchIdx);
                    const bActions = actionsTensor.gather(batchIdx);
                    const bOldLPs = oldLogProbs.gather(batchIdx);
                    const bAdvs = advantages.gather(batchIdx);

                    const logits = policyNet.apply(bStates);
                    const logProbsAll = tf.logSoftmax(logits);
                    
                    // Retrieve log-probs of taken actions
                    const bNewLPs = tf.sum(tf.mul(tf.oneHot(bActions, 12), logProbsAll), 1);
                    
                    // PPO Ratio
                    const ratio = tf.exp(tf.sub(bNewLPs, bOldLPs));
                    
                    // Clipped Objective
                    const surr1 = tf.mul(ratio, bAdvs);
                    const surr2 = tf.mul(tf.clipByValue(ratio, 1 - epsilon, 1 + epsilon), bAdvs);
                    const policyLoss = tf.neg(tf.mean(tf.minimum(surr1, surr2)));

                    // Entropy Bonus (encourages exploration)
                    const probs = tf.softmax(logits);
                    const entropy = tf.neg(tf.mean(tf.sum(tf.mul(probs, tf.log(tf.add(probs, 1e-8))), 1)));
                    
                    return tf.add(policyLoss, tf.mul(tf.neg(c2), entropy));
                });
            }, true, policyNet.getWeights());

            // Value Update
            valueOpt.minimize(() =\\u003e {
                return tf.tidy(() =\\u003e {
                    const bStates = statesTensor.gather(batchIdx);
                    const bReturns = returns.gather(batchIdx);
                    const vPreds = valueNet.apply(bStates);
                    return tf.losses.meanSquaredError(bReturns, tf.squeeze(vPreds));
                });
            }, true, valueNet.getWeights());
        }
        await tf.nextFrame(); // Yield to UI/Worker thread
    }

    // Cleanup
    tf.dispose();
}
```

This implementation utilizes `tf.logSoftmax` and `tf.oneHot` to calculate the log-probability of specific actions in a numerically stable way, which is a common requirement in deep RL to avoid "NaN" errors during backpropagation.[14],[27] The addition of an entropy bonus (multiplied by a coefficient like 0.01) is vital for ensuring the car continues to try different steering angles even after it finds a safe, slow path.[8],[28]

## High-Frequency Simulation and Decision Dynamics

The user's environment operates at 1000Hz while the agent makes decisions at 10Hz (every 0.1s). This is a highly efficient ratio for autonomous driving.[11]

### Action Repetition and Physics Stability

When the agent selects an action index (e.g., Index 6: W/Full Acceleration), this action should be held constant for the duration of the 0.1s decision interval. This "Action Repeat" strategy effectively smooths the car's behavior.[15] Rapid jitter in WASD inputs (at frequencies higher than 10Hz) would lead to suspension instability and loss of traction, particularly in physics engines that model tire slip and body roll.[11],[16]

By only updating the action every 100 simulation steps (1ms each), the agent learns to anticipate the car's inertia.[29] This creates a temporal context that can be captured by the 93 inputs, which likely include velocities, angular rates, and track distances.[10]

### The 5-Second Rollout Limitation

A 5-second rollout (50 steps) is relatively short for a racing track.[2] While this allows for very fast iterations and training updates, it may limit the agent's ability to learn long-term track geometry.

| Training Factor | Current (5s) | Recommended for Efficiency | Impact |
| :--- | :--- | :--- | :--- |
| **Total Steps** | 50 | 256 - 1024 | Longer horizons capture more track features.[2],[17] |
| **Decision Rate** | 10Hz | 10Hz - 20Hz | Balanced for physics vs. reaction speed.[15],[16] |
| **Minibatch Size** | 32 | 64 | Larger batches provide smoother gradients.[16],[17] |
| **Epochs** | 10 | 4 - 10 | Higher epochs increase sample efficiency but risk bias.[2],[17] |

If the car struggles to learn efficient cornering, the 5-second window should be extended to at least 20 seconds (200 steps) once basic straight-line stability is achieved.[2] This gives the GAE calculation enough steps to back-propagate the reward of a fast lap time through all the preceding curves.[18],[19]

## Reward Function Engineering for Competitive Racing

PPO performance is heavily dictated by the reward landscape. In autonomous driving, a dense reward signal is required to guide the agent toward the track center and high speeds.[16]

### Proposed Reward Structure

A composite reward function for the car racing task should include the following components:

1.  **Velocity Bonus**: $
\text{reward}_{v} = 
\text{speed} 
\times 
\cos(
\text{track
\_angle
\_difference})$. This encourages driving fast but only in the direction of the track.[16]
2.  **Centerline Penalty**: $
\text{reward}_{c} = -|d| / 
\text{track
\_width}$, where $d$ is the distance from the centerline. This keeps the car away from the edges.[16]
3.  **Stability Penalty**: A penalty for high steering angles at high speeds prevents spin-outs.[16]
4.  **Completion Bonus**: A large sparse reward for crossing the finish line or reaching a 5-second survival threshold.[2]

Rewards should be clipped to a range like $[-1, 1]$ before being stored in the experience buffer.[15] In TensorFlow.js, this can be done using `Math.max(-1, Math.min(1, rawReward))`. Clipping prevents the critic network from receiving large, unexpected gradients that could lead to "exploding gradients" and destabilize the value estimates.[27],[30]

## Advanced Optimization: Gradient Clipping and Learning Rate Decay

To achieve "smart and quick" learning, the training process should incorporate techniques that stabilize the optimization surface.[8],[30]

### Global Gradient Clipping

Even with the PPO clipped objective, the backpropagation process can produce large gradients if the loss surface is steep (e.g., when the car suddenly crashes).[27],[30] Global gradient clipping rescales the gradients of all trainable variables so that their combined L2-norm does not exceed a threshold (typically 0.5).[15],[27],[31]

In the `policyOpt.minimize` call, TensorFlow.js handles this by allowing the user to manipulate the gradients before they are applied. While `minimize()` is a convenient wrapper, the most precise PPO implementations manually compute gradients using `tape.gradient()`, clip them using `tf.clipByNorm()`, and then apply them using `optimizer.applyGradients()`.[27],[31]

### Learning Rate Scheduling

Early in training, a high learning rate allows the agent to discover the basic concept of following the track. As the agent matures, the learning rate should decay to allow for fine-tuning of the racing line.[32],[33]

A linear decay schedule, reducing the learning rate from $3 
\times 10^{-4}$ to $1 
\times 10^{-5}$ over the course of 1 million total simulation steps, is a standard practice in Stable Baselines 3 implementations.[17],[32],[34] This can be implemented in the worker by tracking a global `stepCount` and updating the optimizer's learning rate property periodically.[32]

## Analyzing Common Failure Modes in PPO Implementation

When implementing PPO from scratch in TensorFlow.js, several subtle bugs can prevent the agent from learning effectively.

### Incorrect Log-Probability Storage

The `logProb` stored in the buffer must be the log-probability of the *chosen* action under the policy weights *at the time of collection*.[8] A common error is to re-calculate the log-probability during the training loop using the updated policy and treating it as the "old" log-probability. This breaks the ratio $r_t(
\theta)$ calculation, as the ratio would always be near 1.0, effectively turning PPO into a standard (and unstable) policy gradient algorithm.[6],[7]

### Improper Terminal State Value Handling

When an episode ends because the 5-second timer expires (truncation), the "next state value" should be the critic's estimate for the following state.[15] However, if the car crashes (termination), the "next state value" must be exactly 0.[21] Failing to distinguish between these leads to the agent incorrectly believing that crashing is a viable way to "teleport" to a high-value future state.[6],[15]

### Observation and Advantage Normalization

Autonomous vehicle states (93 inputs) often have widely varying scales (e.g., speed in m/s vs. tire slip as a boolean).[10] Without observation normalization, the neural network's initial weights will be dominated by the inputs with the largest numerical values.[15] Similarly, advantage normalization is a "non-negotiable" implementation detail in PPO; without it, the policy updates will vary wildly in magnitude between different episodes, making convergence nearly impossible.[1],[12]

## Comprehensive Parameter Reference for Car Racing

The following table summarizes the optimized hyperparameters for a car racing task, derived from benchmarks like the AWS DeepRacer and OpenAI Gym CarRacing-v0.[2],[11],[16],[17]

| Hyperparameter | Value | Description |
| :--- | :--- | :--- |
| **Clip Epsilon ($\epsilon$)** | 0.2 | Limits how far the new policy can deviate from the old.[1],[4] |
| **Discount Factor ($\gamma$)** | 0.99 | Importance of future rewards; 0.99 for long-term racing.[16],[17] |
| **GAE Lambda ($\lambda$)** | 0.95 | Bias-variance trade-off for advantage estimation.[2],[17],[21] |
| **Entropy Coef ($c_2$)** | 0.01 | Encourages exploration; prevents deterministic collapse.[8],[15],[28] |
| **Value Coef ($c_1$)** | 0.5 | Weight of the critic loss relative to policy loss.[15],[17] |
| **Max Grad Norm** | 0.5 | Threshold for global gradient clipping.[15],[17] |
| **Num Epochs** | 10 | Number of passes over each batch of data.[2],[12],[17] |
| **Learning Rate** | $3 \times 10^{-4}$ | Initial rate for Adam optimizer; decay suggested.[2],[16],[17] |
| **Minibatch Size** | 32 | Number of samples per gradient update.[2],[16] |

## Integration and Scalability

The provided logic for `trainPPO` fills the "debugger" gap in the user's code, providing a complete, mathematically sound PPO implementation for TensorFlow.js. By utilizing separate optimizers and a custom `minimize` loop with `tf.tidy`, the worker can train the agent efficiently without memory bloat.[8],[35]

As the car's performance improves, the 5-second simulation constraint should be relaxed. PPO is most efficient when it can collect a large amount of diverse data (e.g., several different laps) before performing a single update.[12],[36] In production environments, this is often handled by running multiple car simulations in parallel and aggregating their experiences into a single large training batch, which significantly reduces the variance of the gradient updates and speeds up the "wall-clock" training time.[1],[2],[34]

This technical framework ensures that the autonomous vehicle agent is optimized using the most stable and sample-efficient version of Proximal Policy Optimization, enabling it to master complex driving dynamics within the browser's constrained environment.[2],[3],[10]





[1]: https://stable-baselines3.readthedocs.io/en/master/modules/ppo.html
[2]: https://medium.com/@uralaltan10/reinforcement-learning-showdown-ppo-vs-sac-vs-td3-on-carracing-v3-89864fb9975e
[3]: https://medium.com/@kdk199604/ppo-efficient-stable-and-scalable-policy-optimization-15b5b9c74a88
[4]: https://spinningup.openai.com/en/latest/algorithms/ppo.html
[5]: https://huggingface.co/blog/NormalUhr/rlhf-pipeline
[6]: https://towardsdatascience.com/proximal-policy-optimization-ppo-with-tensorflow-2-x-89c9430ecc26/
[7]: https://huggingface.co/learn/deep-rl-course/unit8/clipped-surrogate-objective
[8]: https://medium.com/@morriying77/proximal-policy-optimization-ppo-implementation-in-tensorflow-49b3e98305cd
[9]: https://www.tensorflow.org/agents/api_docs/python/tf_agents/agents/PPOClipAgent
[10]: https://github.com/zemlyansky/ppo-tfjs
[11]: https://notanymike.github.io/Solving-CarRacing/
[12]: https://www.reinforcementlearningpath.com/the-complete-practical-guide-to-ppo-with-stable-baselines3
[13]: https://www.tensorflow.org/tutorials/reinforcement_learning/actor_critic
[14]: https://shivammehta25.github.io/posts/deriving-categorical-cross-entropy-and-softmax/
[15]: https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/
[16]: https://pmc.ncbi.nlm.nih.gov/articles/PMC12708685/
[17]: https://stable-baselines3.readthedocs.io/en/v2.7.1/modules/ppo.html
[18]: https://shivang-ahd.medium.com/generalized-advantage-estimation-a-deep-dive-into-bias-variance-and-policy-gradients-a5e0b3454dad
[19]: https://towardsdatascience.com/generalized-advantage-estimate-maths-and-code-b5d5bd3ce737/
[20]: https://notesonai.com/generalized+advantage+estimate
[21]: https://nn.labml.ai/rl/ppo/gae.html
[22]: https://www.tensorflow.org/js/guide/train_models
[23]: https://medium.com/@harangpeter/investigating-the-embedding-layer-implementation-of-tensorflow-js-88a3f7ccff91
[24]: https://js.tensorflow.org/api/1.0.0/
[25]: https://medium.com/@nasuhcanturker/batching-and-mini-batch-making-your-deep-learning-model-work-efficiently-1bb5d3481eda
[26]: https://stats.stackexchange.com/questions/235844/should-training-samples-randomly-drawn-for-mini-batch-training-neural-nets-be-dr
[27]: https://www.geeksforgeeks.org/deep-learning/applying-gradient-clipping-in-tensorflow/
[28]: https://docs.aws.amazon.com/deepracer/latest/developerguide/deepracer-how-it-works-reinforcement-learning-algorithm.html
[29]: https://www.sandia.gov/app/uploads/sites/86/2023/03/Effectiveness_of_Warm_Start_PPO_for_Guidance_with_Highly_Constrained_Nonlinear_Fixed_Wing_Dynamics.pdf
[30]: https://neptune.ai/blog/understanding-gradient-clipping-and-how-it-can-fix-exploding-gradients-problem
[31]: https://stackoverflow.com/questions/36498127/how-to-apply-gradient-clipping-in-tensorflow
[32]: https://keras.io/2/api/callbacks/learning_rate_scheduler/
[33]: https://github.com/ray-project/ray/blob/master/rllib/examples/learners/ppo_with_torch_lr_schedulers.py
[34]: https://stable-baselines3.readthedocs.io/en/master/guide/examples.html
[35]: https://keras.io/guides/writing_a_custom_training_loop_in_tensorflow/
[36]: https://www.reddit.com/r/reinforcementlearning/comments/15p484p/ppo_tensorboard_loss_functions/