
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation, interrupt, MemorySaver, Command, END } from "@langchain/langgraph";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { autonomousTools, sensitiveTools } from "./tools.ts";

const model = new ChatGroq({
    model: process.env.MODEL!,
}).bindTools([...autonomousTools, ...sensitiveTools]);

const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
}

const toolNode = new ToolNode([...autonomousTools, ...sensitiveTools]);

const hilTools = new Set<string>(sensitiveTools.map(_ => _.name));
const isToolCall = (state: typeof MessagesAnnotation.State) => {
    const lastMessages = state.messages[state.messages.length - 1] as AIMessage;
    const toolCalls = lastMessages.tool_calls;

    if (toolCalls?.length) {
        if (hilTools.has(toolCalls[toolCalls.length - 1]?.name!)) {
            return "human";
        }
        return "tools"
    }
    else
        return "__end__"
}

const humanConfirmation = (state: typeof MessagesAnnotation.State) => {
    const confirmation: string = interrupt({
        question: "Caution : Operation is sensitive! which may have data loss and/or may not be undo'able if permitted. Do you confirm(Y|YES)?"
    });

    if (confirmation === 'YES' || confirmation == 'Y') {
        return new Command({ goto: "tools" });
    } else {
        (state.messages[state.messages.length - 1] as AIMessage).tool_calls?.pop();
        state.messages.push(new HumanMessage(`NO DON'T PROCEED! Please cancel this operation!`));
        
        return new Command({ goto: "agent" });
    }
}

const customStateGraphBuilder = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addNode("tools", toolNode)
    .addNode("human", humanConfirmation)
    .addConditionalEdges("agent", isToolCall)
    .addEdge("tools", "agent")

/**
* This allows you to build your own State Graph and state is managed by user.
* Has finer control of execution and state.
* Example use case for fine control: logging, confirmations/guardrails before critical calls etc. 
* Thus more reliable for execution. 
* With check pointer memory: non persistent.
*/
export const customReActAgent = customStateGraphBuilder.compile({ checkpointer: new MemorySaver() });