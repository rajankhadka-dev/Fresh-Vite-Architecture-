import { pipeline, env } from '@xenova/transformers';

// Skip local check for models
env.allowLocalModels = false;

class ChatbotPipeline {
    static task = 'text-generation';
    static model = 'Xenova/Qwen1.5-0.5B-Chat';
    static instance = null;

    static system_prompt = "You are Rajan's AI Assistant, a helpful and friendly concierge for Rajan Khadka's portfolio website. You answer questions about Rajan, his machine learning projects, and his skills. Rajan is an expert in AI and Software Engineering. Keep responses concise and professional.";

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const { text, messages } = event.data;

    // Get the pipeline instance. This will load the model the first time it's called.
    const generator = await ChatbotPipeline.getInstance(x => {
        // We also send progress updates to the main thread
        self.postMessage(x);
    });

    // Run the pipeline
    const conversation = [
        { role: 'system', content: ChatbotPipeline.system_prompt },
        ...messages
    ];

    const output = await generator(conversation, {
        max_new_tokens: 256,
        temperature: 0.7,
        do_sample: true,
        top_k: 50,
        // We use chat templates automatically
    });

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output,
    });
});
