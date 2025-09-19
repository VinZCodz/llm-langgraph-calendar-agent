import type { CompiledStateGraph, StateGraph } from "@langchain/langgraph";
import fs from "fs/promises";

 export const graphVisualize = async (crudAgentProcess:typeof StateGraph) => {
//     const drawableGraphGraphState = await crudAgentProcess.getGraphAsync();
//     const graphStateImage = await drawableGraphGraphState.drawMermaidPng();
//     const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

//     const filePath = "./graphState.png";
//     await fs.writeFile(filePath, new Uint8Array(graphStateArrayBuffer));
}