import Groq from "groq-sdk";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const data = await req.json();

	const groq = new Groq();
	const completion = await groq.chat.completions.create({
		messages: [
			{ role: "system", content: "you are ai support assistant" },
			...data,
		],

		model: "llama3-8b-8192",
		temperature: 0.5,
		max_tokens: 1024,
		top_p: 1,
		stop: null,
		stream: true,
	});

	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();
			try {
				for await (let chunk of completion) {
					const content = chunk.choices[0]?.delta?.content || "";
					if (content) {
						controller.enqueue(encoder.encode(content));
					}
				}
			} catch (err) {
				controller.error(err);
			} finally {
				controller.close();
			}
		},
	});

	return new NextResponse(stream);
}
