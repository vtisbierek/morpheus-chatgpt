import { OpenAIStream } from "@/app/utils/OpenAIStream";

export const config = {
    runtime: "edge",
};

export async function POST(request: Request){
    const { prompt } = (await request.json()) as {
        prompt?: string;
      };

    console.log(prompt);
    
    const payload = {
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 200,
        stream: true,
        n: 1,
    };

    try {
        //const completion = await openai.createCompletion(payload);

        const stream = await OpenAIStream(payload);
        
        console.log(stream);
        
        return new Response(stream);
        //return NextResponse.json({message: completion.data.choices[0].message?.content}, {status: 200}); //com typescript, o jeito certo de enviar uma resposta é com esse NextResponse.json()
    } catch (error) {
        if(error instanceof Error){
            console.log(error.message);
        } 
    }
}