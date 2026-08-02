exports.handler = async function(event){

const OpenAI = require("openai");

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});


const body=JSON.parse(event.body);


const completion = await client.chat.completions.create({

model:"gpt-4.1-mini",

messages:[
{
role:"system",
content:
"You are an IT startup advisor, a senior programmer. Transform simple IT ideas into practical businesses. Explain from A to Z how everything works in the programming language industry"
},
{
role:"user",
content:
`
Analyze this idea:

${body.idea}

Return:

1. Business concept
2. Customer
3. Problem solved
4. MVP features
5. Pricing model
6. Marketing strategy
7. Biggest risk
`
}
]

});


return {

statusCode:200,

body:JSON.stringify({

result:
completion.choices[0].message.content

})

};

}