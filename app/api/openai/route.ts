import { NextResponse } from "next/server";
import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function GET(request: Request){
    return new Response("Hello!"); //esse tipo de resposta new Response() é como se faz em javascript
}

export async function POST(request: Request){
    const {userText} = await request.json(); //deestruturando a request para pegar só o que o usuário enviou do frontend

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": userText}] //conforme documentação do OpenAI https://platform.openai.com/docs/api-reference/chat/create
        });
        
        return NextResponse.json({message: completion.data.choices[0].message?.content}, {status: 200}); //com typescript, o jeito certo de enviar uma resposta é com esse NextResponse.json()
    } catch (error) {
        if(error instanceof Error){
            console.log(error.message);
        } 
    }
}