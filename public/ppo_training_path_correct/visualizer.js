if (calledSharedEventListeners.has("onAmmoLoaded")) { // Ammo already loaded, just run visualizer already
    loadScript("/lib/tfjs-vis.js", () => { console.log("Visualizer loaded! Ammo/math already loaded"); setupVisualizer(); });
} else { // if visualizer.js has loaded but ammo not done yet
    addSharedEventListener("onAmmoLoaded", () => { // wait for math
        loadScript("/lib/tfjs-vis.js", () => { console.log("Visualizer loaded! Waited for onAmmoLoaded"); setupVisualizer(); });
    });
}

async function setupVisualizer() {
    //tfvis.visor();

    setInterval(() => {
        //tfvis.visor().open();
    }, 5000);
}

function visualizerDrawGraph() {
    function movingMedian(values, windowSize = 30, step = 3) {
        const x = [];
        const y = [];
        for (let i = 0; i < values.length; i += step) {
            const start = Math.max(0, i - windowSize + 1);
            const slice = values.slice(start, i + 1).sort((a, b) => a - b);
            const mid = Math.floor(slice.length / 2);

            const median = slice.length % 2 === 0
                ? (slice[mid - 1] + slice[mid]) / 2
                : slice[mid];

            x.push(i);
            y.push(median);
        }
        return { x, y };
    }
    function median(values) {
        const sorted = [...values].sort((a, b) => a - b); // copy and sort
        const mid = Math.floor(sorted.length / 2);

        return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
    }

    // robust RL outlier suppression
    function clampOutliersMAD(values, madMultiplier = 6) {
        if (values.length < 10) return values;

        const med = median(values);
        const deviations = values.map(v => Math.abs(v - med));
        const mad = median(deviations);

        // avoid divide-by-zero weirdness
        if (mad === 0) return values;

        const maxDeviation = mad * madMultiplier;

        return values.map(v => {
            const deviation = v - med;
            if (Math.abs(deviation) > maxDeviation) {
                return med + Math.sign(deviation) * maxDeviation;
            }
            return v;
        });
    }

    function buildRawTrace({
        name,
        x,
        y,
        color,
        yaxis = "y"
    }) {
        return {
            x,
            y,
            mode: "markers",
            type: "scatter",
            name,
            yaxis,
            marker: {
                color,
                size: 5 //4
            },
            opacity: 1 //0.6
        };
    }

    function buildMedianTrace({
        name,
        x,
        y,
        color,
        yaxis = "y"
    }) {
        const med = movingMedian(y);
        const medianX = med.x.map(i => x[i]);

        return {
            x: medianX,
            y: med.y,
            mode: "lines",
            type: "scatter",
            name,
            yaxis,
            line: {
                color,
                width: 3,
                shape: "linear" // spline
            }
        };
    }

    function renderPlot(
        divId,
        traces,
        layout
    ) {
        const div = document.getElementById(divId);
        Plotly.react(
            div,
            traces,
            {
                uirevision: 'determenistic_value_here', // user changes won't get removed as long as this value doesn't change
                autosize: true,
                margin: {
                    l: 60,
                    r: 60,
                    t: 40,
                    b: 40
                },
                legend: {
                    x: 1.02,
                    y: 1,
                    xanchor: "left",
                    yanchor: "top",
                    orientation: "v"
                },
                ...layout
            },
            {
                responsive: true,
                scrollZoom: false,
                doubleClick: false,
                displaylogo: false,
                modeBarButtonsToRemove: [
                    "zoom2d",
                    "select2d",
                    "lasso2d",
                    "resetScale2d"
                ]
            }
        );
        // fixes first-render whitespace bug
        requestAnimationFrame(() => {
            Plotly.Plots.resize(div);
        });
    }


    const attempts = []; // AttemptCount, x axis on graphs, used only for progress and avgReturn
    const iterations = []; // IterationCount, x axis on graphs

    const progress = [];
    const avgReturns = [];
    const valueLoss = [];
    const explainedVariance = [];
    const kl = [];
    const policyLoss = [];
    const entropy = [];
    const logProb = [];

    for (const data of Object.values(iterationStats)) {
        iterations.push(data.iterationCount);

        // Critic
        valueLoss.push(data.averageValueLoss);
        explainedVariance.push(Math.max(-1, Math.min(1, data.explainedVariance))); // clamp to [-1, 1]

        // Stability
        kl.push(data.approxKLDivergence);
        policyLoss.push(-data.averagePolicyLoss); // invert because our policyLoss is always negative. Make positive

        // Exploration
        entropy.push(data.averageEntropy);
        logProb.push(-data.averageNewLogProbs); // invert because log probs are always negative

        // These are the attempts
        for (const carId of data.carIDs) {
            const requestId = data.requestIDs[carId];
            const totalReward = data.totalRewardPerCar[carId]; // unused
            const progressPercentage = data.progressPercentages[carId];
            const avgReturn = data.avgReturnPerCar[carId];

            attempts.push(requestId); // attempt count, incremental

            // Performance
            progress.push(100 - progressPercentage);
            avgReturns.push(avgReturn);
        }
    }

    // clamping to remove outliers, especially in valueLoss
    const clampedValueLoss = clampOutliersMAD(valueLoss, 5);
    const clampedReturn = clampOutliersMAD(avgReturns, 6);
    const clampedPolicyLoss = clampOutliersMAD(policyLoss, 6);
    const clampedLogProb = clampOutliersMAD(logProb, 6);


    // must use dual yaxis for most graphs because of different scales

    renderPlot(
        "graph_performance", // uses attempts instead of iterations
        [
            buildRawTrace({
                name: "Progress Left %",
                x: attempts,
                y: progress,
                color: "#ff4444",
                yaxis: "y"
            }),

            buildMedianTrace({
                name: "Progress Median",
                x: attempts,
                y: progress,
                color: "#cc0000",
                yaxis: "y"
            }),

            buildRawTrace({
                name: "Average Return",
                x: attempts,
                y: clampedReturn,
                color: "#00cc66",
                yaxis: "y2"
            }),

            buildMedianTrace({
                name: "Return Median",
                x: attempts,
                y: clampedReturn,
                color: "#00994d",
                yaxis: "y2"
            })
        ],
        {
            title: "Performance",
            yaxis: {
                title: "Progress Left %",
                range: [0, 100] // 0 bottom, 100 top
            },
            yaxis2: {
                title: "Average Return",
                overlaying: "y",
                side: "right"
            }
        }
    );

    renderPlot(
        "graph_critic",
        [
            buildRawTrace({
                name: "Value Loss",
                x: iterations,
                y: clampedValueLoss,
                color: "#ff9933",
                yaxis: "y"
            }),

            buildMedianTrace({
                name: "Value Loss Median",
                x: iterations,
                y: clampedValueLoss,
                color: "#cc6600",
                yaxis: "y"
            }),

            buildRawTrace({
                name: "Explained Variance",
                x: iterations,
                y: explainedVariance,
                color: "#3399ff",
                yaxis: "y2"
            }),

            buildMedianTrace({
                name: "Explained Variance Median",
                x: iterations,
                y: explainedVariance,
                color: "#0066cc",
                yaxis: "y2"
            })
        ],
        {
            title: "Critic Health",
            yaxis: {
                title: "Value Loss"
            },
            yaxis2: {
                title: "Explained Variance",
                overlaying: "y",
                side: "right",
                range: [-1, 1]
            }
        }
    );

    renderPlot(
        "graph_stability",
        [
            buildRawTrace({
                name: "KL Divergence",
                x: iterations,
                y: kl,
                color: "#cc66ff"
            }),

            buildMedianTrace({
                name: "KL Median",
                x: iterations,
                y: kl,
                color: "#9900cc"
            }),

            buildRawTrace({
                name: "Policy Loss",
                x: iterations,
                y: clampedPolicyLoss,
                color: "#00dddd"
            }),

            buildMedianTrace({
                name: "Policy Loss Median",
                x: iterations,
                y: clampedPolicyLoss,
                color: "#009999"
            })
        ],
        {
            title: "PPO Stability",
            shapes: [{ // horizontal line at y=0.02, KL threshold
                type: "line",
                xref: "paper",
                name: "KL Threshold",
                x0: 0,
                x1: 1,
                yref: "y",
                y0: 0.02,
                y1: 0.02,
                line: {
                    color: "red",
                    dash: "dash"
                }
            }]
        }
    );

    renderPlot(
        "graph_exploration",
        [
            buildRawTrace({
                name: "Entropy",
                x: iterations,
                y: entropy,
                color: "#999999"
            }),

            buildMedianTrace({
                name: "Entropy Median",
                x: iterations,
                y: entropy,
                color: "#666666"
            }),

            buildRawTrace({
                name: "Log Probabilities",
                x: iterations,
                y: clampedLogProb,
                color: "#00aa00"
            }),

            buildMedianTrace({
                name: "Log Prob Median",
                x: iterations,
                y: clampedLogProb,
                color: "#006600"
            })
        ],
        {
            title: "Exploration"
        }
    );
}