// This code is for v4 of the openai package: npmjs.com/package/openai
const OpenAI = require('openai');


const openai = new OpenAI({
  apiKey: "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",
});


// fine tuned chatgpt model 
async function runCompletion (prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages:[
      {
        role: 'system',
        content: 'You will be provided with statements, and your task is to convert them to standard English.',
      },
      {
        role: 'user',
        content: prompt,
      }, 
    
    
    ],
    temperature: 0,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  });
    console.log(response.choices[0].message.content)
   return response.choices[0].message.content;
}




//usage
//runCompletion("new dinner decor ideas:###");
module.exports = runCompletion;