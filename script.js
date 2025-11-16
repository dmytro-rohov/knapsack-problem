// variables global - parametrs

const weights = [4, 6, 14, 2, 15, 3, 8, 16, 4, 12];
const values = [12, 3, 3, 12, 14, 15, 12, 3, 1, 10];

const MAX_WEIGHT = 68;
const POP_SIZE = 6;
const CH_SIZE = weights.length;

const CROSSOVER_RATE = 0.8;
const MUTATION_RATE = 0.2;
const TOURNAMENT_SIZE = 2;
const ELITE_COUNT = 1;



// generate chromosome

function generateChromosomeLength(length) {
    let ch = "";
    for (let i = 0; i < length; i++) {
        ch += Math.random() > 0.5 ? "1" : "0";
    }
    return ch;
}


function addChromosomeToPopulationArr(popSize, length) {
    const popArr = [];
    for (let i = 0; i < popSize; i++) {
        popArr.push(generateChromosomeLength(length));
    }
    return popArr;
}


// populaton 

let population = addChromosomeToPopulationArr(POP_SIZE, CH_SIZE);


// evaluate

function evaluate(chromosome) {
    let totalWeight = 0;
    let totalValue = 0;

    for (let i = 0; i < chromosome.length; i++) {
        if (chromosome[i] === "1") {
            totalWeight += weights[i];
            totalValue += values[i];
        }
    }

    const valid = totalWeight <= MAX_WEIGHT;
    return {value: totalValue, weight: totalWeight, valid};
}


// repair function

function repairByValuePerWeight(chromosome) {

    const eval0 = evaluate(chromosome);
    if (eval0.valid) return chromosome;
    
    const bits = chromosome.split("");

    const items = [];
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === "1") {
            items.push({idx: i, ration: values[i] / weights[i], weight: weights[i]});
        }
    }

    items.sort((a,b) => a.ration - b.ration);

    let currentWeight = eval0.weight;

    for (const it of items) {
        if (currentWeight <= MAX_WEIGHT) break;
        bits[it.idx] = "0";
        currentWeight -= it.weight;
    }
    return bits.join("");
}

// tournament selection

function tournamentSelection(population) {
    let best = null;
    for (let i = 0; i < TOURNAMENT_SIZE; i++) {
        const idx = Math.floor(Math.random() * population.length);
        const cand = population[idx];
        if (!best) best = cand;
        else {
            const a = evaluate(cand).value;
            const b = evaluate(best).value;
            if (a > b) best = cand;
        }
    }
    return best;
}


// crossover function

function crossover(parent1, parent2) {
    if (Math.random() > CROSSOVER_RATE) return [parent1, parent2];
    const point = 1 + Math.floor((Math.random() * (parent1.length - 1)));
    const child1 = parent1.slice(0, point) + parent2.slice(point);
    const child2 = parent2.slice(0, point) + parent1.slice(point);
    return [child1, child2];
}


// mutate function

function mutate(chromosome) {
    let out = "";
    for (let i = 0; i < chromosome.length; i++) {
        if (Math.random() < MUTATION_RATE) {
            out += chromosome[i] === "1" ? "0" : "1";
        } else {
            out += chromosome[i];
        }
    }
    return out;
}

// one iteration

function runOneIteration(pop) {
    
    // 1
    const sorted = pop
    .map(ch => ({ch, ...evaluate(ch) }))
    .sort((a, b) => b.value - a.value);

    const newPop = [];
    for (let e = 0; e < ELITE_COUNT; e++) {
        newPop.push(sorted[e].ch)
    }

    // 2
    const parents = [];
    while (parents.length < POP_SIZE) {
        parents.push(tournamentSelection(pop));
    }

    // 3
    for (let i = 0; i < parents.length; i++) {
        const p1 = parents[i];
        const p2 = parents[i + 1] || parents[0];
        let [c1, c2] = crossover(p1, p2);

        // mutation
        c1 = mutate(c1);
        c2 = mutate(c2);

        // repair after mutation
        c1 = repairByValuePerWeight(c1);
        c2 = repairByValuePerWeight(c2);

        newPop.push(c1);
        if (newPop.length < POP_SIZE) newPop.push(c2);
        if (newPop.length >= POP_SIZE) break;
    }

    return newPop.slice(0, POP_SIZE);
}


// n iterations

function runGA(generations = 10) {
    let pop = addChromosomeToPopulationArr(POP_SIZE, CH_SIZE);

    console.log("Poczatkowa populacja:");
    pop.forEach((ch, i) => {
        const e = evaluate(ch);
        console.log(`Ch${i+1}: ${ch} | Waga:${e.weight} | Wartosc:${e.value}`);
    });

    for (let gen = 1; gen <= generations; gen ++) {
        pop = runOneIteration(pop);

        const evals = pop.map(ch => evaluate(ch));
        const best = evals.reduce((acc, cur, idx) => {
            if (!acc || cur.value > acc.value) return {ch: pop[idx], ...cur};
            return acc;
        }, null);
        const avg = evals.reduce((s, x) => s + x.value, 0) / evals.length;
        console.log(`Generacja ${gen}: Best=${best.value} (waga=${best.weight}) chrom=${best.ch} | avg=${avg.toFixed(1)}`);
    }

    // end result
    const final = pop.map(ch => ({ ch, ...evaluate(ch) })).sort((a,b) => b.value - a.value);
    console.log("\n Najlepsze koncowe rozwizanie:" , final[0]);
    return final[0];
}

runGA(10);







