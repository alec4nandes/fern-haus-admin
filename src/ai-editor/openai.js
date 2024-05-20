export default async function getOpenAiRevised(textInput) {
    const params = getOpenAiParams(textInput),
        revised = await fetchOpenAi(params);
    return revised;
}

function getOpenAiParams(textInput) {
    const systemContent =
        "Edit the text in the prompt to be more grammatically correct.";
    return {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemContent },
            { role: "user", content: textInput },
        ],
        temperature: 0.4,
        apiKeyName: "OPENAI_API_KEY_EDITOR",
    };
}

async function fetchOpenAi(params) {
    const response = await fetch(
            "https://nsr23vt5ps2kdjj2ypy2ypvlpe0oxnqb.lambda-url.us-east-2.on.aws/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            }
        ),
        { choices } = await response.json(),
        result = choices[0].message.content.trim();
    return result;
}
