
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { availableTools } from "./tools.ts";

const model = new ChatGroq({
    model: process.env.MODEL!,
}).bindTools(availableTools);

const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
}

const toolNode = new ToolNode(availableTools);

const isToolCall = ({ messages }: typeof MessagesAnnotation.State) => {
    const lastMessages = messages.pop() as AIMessage;
    if (lastMessages?.tool_calls?.length)
        return "tools";
    else
        return "__end__"
}

const customStateGraphBuilder = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addNode("tools", toolNode)
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