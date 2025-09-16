import * as readline from 'node:readline/promises';
import fs from "fs/promises";
import { graphVisualize } from "../services/graphVisualizer.ts"
import { customReActAgent } from "../services/customStateGraphBuilder.ts";

const instructions = await fs.readFile("./systemPrompt.txt", "utf-8");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let messages = [{ role: "system", content: instructions + `\n Todays Date: ${new Date()}` }];

const main = async () => {
    while (true) {
        const userPrompt = await rl.question('Your Query: ');
        if (userPrompt === '/bye') {
            break;
        }
        messages.push({ role: "user", content: userPrompt });

        const result = await customReActAgent.invoke({ messages: messages }, { configurable: { thread_id: "1" } });

        console.log(`Assistant: ${result.messages.pop()?.content}`);
    }
}

await main()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    });