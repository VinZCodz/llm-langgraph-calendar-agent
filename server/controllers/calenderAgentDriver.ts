import * as readline from 'node:readline/promises';
import fs from "fs/promises";
import { graphVisualize } from "../services/graphVisualizer.ts"
import { customReActAgent } from "../services/customStateGraphBuilder.ts";
import { Command } from '@langchain/langgraph';

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

        const threadConfig = { configurable: { thread_id: "1" } };
        let result = await customReActAgent.invoke({ messages: messages }, threadConfig);

        const state = await customReActAgent.getState(threadConfig);
        const interrupts = state.tasks[state.tasks.length - 1]?.interrupts;

        if (interrupts) {
            console.log(`LLM has run into programmed interrupt! for the following reasons:`);
            console.log(`${interrupts[interrupts.length - 1]?.value.question}`);
            const confirmation = (await rl.question('')).toUpperCase();
            
            const command=new Command({ resume: confirmation });
            result = await customReActAgent.invoke(command, threadConfig);
        }

        console.log(`Assistant: ${result.messages[result.messages.length - 1]?.content}`);

    }
}

await main()
    .finally(() => {
        console.warn(`\nBye!\n`);
        rl.close()
    });