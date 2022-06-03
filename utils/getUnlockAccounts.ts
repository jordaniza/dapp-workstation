import { WHALES, TEST_ACCOUNTS, GOVERNANCE } from './addresses';

const inputs = [...Object.values(WHALES), ...Object.values(TEST_ACCOUNTS), ...Object.values(GOVERNANCE)]

// convert accounts to space separated list for ganache scripts
const output = inputs.reduce((prev, curr) => {
    if (!prev) return curr;
    return prev + ' ' + curr;
});

// bash scripts can capture the output
console.log(output);
