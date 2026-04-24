const questionAnswerPrompt = (role, experience, topicToFocus, numberOfQuestions) => (`
You are an AI trained to generate technical interview questions and answers.
Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicToFocus}
- Write ${numberOfQuestions} interview questions.
- For each question, generate a detailed but beginner-friendly answer.
- If you include examples, use markdown formatting and fenced code blocks inside the JSON text.
- Keep formatting very clean.
- Return a pure JSON array like:
[
  {
    "question": "Question here?",
    "answer": "Answer here with markdown and code fences if needed."
  }
]
Important: Do NOT add any extra text outside the JSON. Only return valid JSON.
`)

const conceptExplainPrompt = (question)=>`
You are an AI trained to generate explanations for a given interview question.

Task:

- Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
- Question: "${question}"
- If your explanation includes examples, use markdown formatting and fenced code blocks.
- After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
- Return the result as a valid JSON object in the following format:

{
     "title": "Short title here?",
     "explanation": "Explanation here with markdown and code fences if needed."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`

module.exports = { questionAnswerPrompt, conceptExplainPrompt };