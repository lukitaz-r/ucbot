const fetch = require('node-fetch');
const { OpenAIApi, Configuration } = require("openai");
const config = require(`${process.cwd()}/config/config.json`);

const configuration = new Configuration({
  apiKey: config.openai_key,
});
const openai = new OpenAIApi(configuration);

async function fetchResponseFromChatGPT(prompt) {
    try {
        const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.openai_key}`
            },
            body: JSON.stringify({
                prompt: `${config.base_prompt}${prompt}`,
                max_tokens: config.max_tokens,
                n: config.n,
                stop: config.stop,
                temperature: config.temperature,
            }),
        });
        const json = await response.json();
        const choice = json.choices;
        if (!json || !choice || !choice.length)
            return "Error: No data returned from OpenAI API";
        return json.choices[0].text.trim();
    } catch (error) {
        console.error("Error fetching response from ChatGPT:", error);
        return "Error fetching response from ChatGPT";
    }
}

module.exports = fetchResponseFromChatGPT;