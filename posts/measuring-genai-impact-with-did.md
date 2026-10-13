You've rolled out an AI assistant to your sales team, and leadership asks the obvious question: *what is it worth?*

The textbook answer is a randomized A/B test. With internal tools, that's rarely possible. Rollouts follow business priorities, not coin flips. Nobody wants to hold the best team back from a new tool for three months, and once a team has the tool, everyone knows it.

What you usually do have is a **staged rollout**: some teams get the tool first, others later. Difference-in-Differences (DiD) turns that into a credible estimate of the tool's effect, as long as you respect its one big assumption.

> [!NOTE]
> Every number in this post comes from simulated data. Because we set the true effect ourselves, we can check each method against it.

## Why the obvious comparisons mislead

Two shortcuts show up in almost every first impact report:

| Approach | What it compares | Why it misleads |
|---|---|---|
| **Before vs. after** | Users after launch vs. the same users before | Mixes the tool's effect with everything else that changed: seasonality, campaigns, a growing market |
| **Users vs. non-users** | Users vs. non-users after launch | Teams that adopt first are often already the strongest, so the gap is partly selection |
| **Difference-in-Differences** | The *change* for users vs. the *change* for non-users | Cancels fixed gaps between the groups *and* shocks they share |

## The idea in one equation

DiD compares how much each group changed:

$$
\hat{\delta}_{\text{DiD}} = \left(\bar{Y}_{T,\text{post}} - \bar{Y}_{T,\text{pre}}\right) - \left(\bar{Y}_{C,\text{post}} - \bar{Y}_{C,\text{pre}}\right)
$$

The control group's change ($C$) stands in for what would have happened to the treated group ($T$) without the tool. Subtract it, and what's left is the effect.

In practice we estimate the same quantity with a regression, because it also gives us standard errors and lets us add controls:

$$
Y_{it} = \alpha + \beta\,\text{Treat}_i + \gamma\,\text{Post}_t + \delta\,(\text{Treat}_i \times \text{Post}_t) + \varepsilon_{it}
$$

Here $\beta$ absorbs the level gap between the groups, $\gamma$ absorbs what happened to everyone over time, and $\delta$, the interaction, is the effect we care about.

## A worked example in Python

Let's simulate 400 sales agents over 12 months. Half of them get the assistant from month 6. To make life realistic, the adopters are stronger to begin with, and everyone's sales trend upward during the year:

```python
import numpy as np
import pandas as pd
import statsmodels.formula.api as smf

rng = np.random.default_rng(7)
n_agents, n_months, launch = 400, 12, 6

df = pd.DataFrame(
    [(a, m) for a in range(n_agents) for m in range(n_months)],
    columns=["agent_id", "month"],
)
df["treated"] = (df["agent_id"] < n_agents // 2).astype(int)  # half get the assistant
df["post"] = (df["month"] >= launch).astype(int)               # ...from month 6
skill = rng.normal(0, 3, n_agents)

df["sales"] = (
    20
    + skill[df["agent_id"]]                # some agents are simply better
    + 0.3 * df["month"]                    # everyone trends up over the year
    + 2.0 * df["treated"]                  # adopters were stronger to begin with
    + 1.5 * df["treated"] * df["post"]     # the true effect of the assistant
    + rng.normal(0, 2, len(df))
)
```

The true effect is **+1.5** sales per agent per month. Now let's see what each method reports:

```python
means = df.groupby(["treated", "post"])["sales"].mean().unstack()
before_after = means.loc[1, 1] - means.loc[1, 0]
users_vs_non = means.loc[1, 1] - means.loc[0, 1]
did = before_after - (means.loc[0, 1] - means.loc[0, 0])
# before/after: 3.36   users vs non-users: 3.30   DiD: 1.45
```

Both shortcuts claim more than **twice** the real effect. Before vs. after takes credit for the yearly trend. Users vs. non-users takes credit for the adopters' head start. DiD lands on 1.45.

The regression version gives the same estimate, plus an honest interval:

```python
model = smf.ols("sales ~ treated * post", data=df).fit(
    cov_type="cluster", cov_kwds={"groups": df["agent_id"]}
)
model.params["treated:post"]                # 1.45
model.conf_int().loc["treated:post"]        # [1.23, 1.68]
```

> [!TIP]
> Cluster standard errors at the level where the treatment was assigned: the agent, team or branch. Twelve months from the same agent aren't twelve independent observations, and ignoring that makes your interval look far more precise than it is.

## The assumption that makes it work

DiD rests on **parallel trends**: without the tool, both groups would have moved in parallel. You can never observe that counterfactual directly, but you can look for evidence against it:

- **Plot the pre-launch months.** The two lines may sit at different levels, but they should move together.
- **Run a placebo test.** Pretend the launch happened earlier, using only pre-launch data. A real tool can't have an effect before it exists, so the "effect" should be close to zero:

```python
pre = df[df["month"] < launch].assign(post=lambda d: (d["month"] >= 3).astype(int))
placebo = smf.ols("sales ~ treated * post", data=pre).fit(
    cov_type="cluster", cov_kwds={"groups": pre["agent_id"]}
)
placebo.params["treated:post"]              # -0.11, 95% CI [-0.44, 0.22]
```

- **Go further with an event study:** estimate one coefficient per month relative to launch. Pre-launch coefficients should hover around zero. Post-launch ones show whether the effect builds up, holds or fades.

> [!WARNING]
> If the tool went first to the teams that were already *improving* fastest, say the ones on a winning streak, parallel trends breaks and DiD will overstate the effect. Ask how the rollout order was decided before you trust the estimate.

## Traps to watch for

- **Staggered rollouts.** When groups adopt at different times and the effect grows over time, the classic two-way fixed-effects regression can be badly biased. It can even flip sign. Use estimators built for staggered adoption, such as Callaway & Sant'Anna (2021) or Sun & Abraham (2021).
- **Spillovers.** Control agents pick up tricks from treated teammates, which shrinks the gap and hides part of the effect. Prefer controls in other branches or regions.
- **Anticipation.** Training sessions and launch announcements change behaviour before go-live. Start "post" at first exposure, not at the official launch date.
- **A shifting panel.** Agents join and leave. Check that the result holds on a balanced panel of agents present the whole time.

## From an estimate to business value

The coefficient is *per agent, per month*. To turn it into money:

$$
\text{monthly value} \approx \hat{\delta} \times \text{active users} \times \text{margin per sale}
$$

Carry the confidence interval through the same calculation, and report the range, not a single number. "Between \$X and \$Y a month" earns more trust than a figure that only looks precise.

## A checklist before you present

1. Write down how the rollout order was decided.
2. Plot pre-launch trends for both groups.
3. Run a placebo test, ideally an event study too.
4. Cluster standard errors at the level of assignment.
5. If adoption was staggered, use a staggered-adoption estimator.
6. Translate the effect into business value, with its interval.

DiD isn't magic. It swaps the impossible job of randomizing for one assumption you can argue about in the open. When the placebo test passes and the story behind the rollout holds up, it's one of the most convincing tools you have for answering "what is the AI worth?"
