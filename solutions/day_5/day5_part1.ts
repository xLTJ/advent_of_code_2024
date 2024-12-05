import * as fs from 'fs';

type RuleMap = Map<number, number[]>;

function main() {
    const input = fs.readFileSync('./input.txt', 'utf-8').replace(/\r\n/g, '\n');

    // The rule map is a Map where each key is a number, whose value is an array of number that must be after that number
    // updates is just an array of number array with each update
    const {rule_map, updates} = parse_input(input);

    // gets the middle number for every correct update and adds them together
    const result = updates.reduce((count, update) => {
        if (is_order_correct(rule_map, update)) {
            return count + update[Math.round((update.length - 1) / 2)];
        }

        return count;
    }, 0)

    console.log(result);
}


// parses the input string into a rule map, and an updates array
function parse_input(input: string): {rule_map: RuleMap, updates: number[][]} {
    const rules_input = input.split('\n\n')[0].split('\n');
    const updates_input = input.split('\n\n')[1].split('\n');

    const updates = updates_input.map(line => {
        return line.split(',').map(Number);
    });

    const rule_map: RuleMap = new Map();

    rules_input.forEach(rule => {
        const rule_pair = rule.split('|').map(Number);
        add_rule(rule_map, rule_pair);
    });

    return {rule_map, updates};
}


// adds a rule to the rule map. If the key already exist, add the right side to that array, if not create a new key/value pair
function add_rule(rule_map: RuleMap, rule_pair: number[]) {
    if (rule_map.has(rule_pair[0])) {
        rule_map.get(rule_pair[0])!.push(rule_pair[1]); // ! is safe cus we already checked if the key exists
    } else {
        rule_map.set(rule_pair[0], [rule_pair[1]]);
    }
}


// checks if an update has a valid order
function is_order_correct(rule_map: RuleMap, update: number[]): boolean {
    // set to store all passed numbers
    const passed_numbers = new Set<number>();

    //for each number in an update, check if any of the numbers in its rule array has been passed. If this is the case the update is invalid
    for (const number of update) {
        if (!rule_map.has(number)) {
            passed_numbers.add(number);
            continue;
        }

        for (const other_number of rule_map.get(number)!) {
            if (passed_numbers.has(other_number)) {
                return false;
            }
        }
        passed_numbers.add(number);
    }
    return true
}

main();