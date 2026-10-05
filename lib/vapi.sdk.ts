// import Vapi from "@vapi-ai/web";
//
// export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);


import Vapi from "@vapi-ai/web";

const vapiToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

console.log("Vapi token available:", !!vapiToken);

export const vapi = new Vapi(vapiToken!);