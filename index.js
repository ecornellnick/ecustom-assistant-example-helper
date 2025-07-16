// Wrapping the whole extension in a JS function 
// (ensures all global variables set in this extension cannot be referenced outside its scope)
(async function(codioIDE, window) {

  const systemPrompt = "You are an assistant that prioritizes learning and helps students understand their programming assignments. You do this by providing code examples that are relevant to the given assignment. \
Given a programming assignment, your job is to provide a relevant code example to help students achieve the goal outlined in the instructions. The example should be less than 10 lines of code. \
In your example, only use techniques outlined in the instructions or used in the solution code (located in the workspace in .guides/secure/solution/). Your example should only relate to the task given in the instructions. \
Always thoroughly explain how the example code works and why it works. \
Note that you will respond without xml tags and with only the code example (starting with \"Example: \") and explanation (starting with \"Explanation: \"). Do not provide the full solution code, only similar examples for students to reference. Do not refer to the solution code in your explanation; it is only for your reference. Do not ask if the student has any more questions. \
Be positive, but not condescending."

  // register(id: unique button id, name: name of button visible in Coach, function: function to call when button is clicked) 
  codioIDE.coachBot.register("customExampleHelper", "Provide an example of what I need to do", onButtonPress)

  async function onButtonPress() {
    //Gets information from the student assignment data, files, etc
    let context = await codioIDE.coachBot.getContext()
    
    var all_open_files = ""

    for (const [fileIndex, file] of Object.entries(context.files)) {
      all_open_files += `
      -----------------------------
      File Number: ${parseInt(fileIndex)+1}
      File name: ${file.path.split('/').pop()}
      File path: ${file.path}
      File content: 
      ${file.content}
      -----------------------------
      `
    }

    const userPrompt = `Here are all the student's current code files:

<code>
${all_open_files}
</code> 

If <code> is empty, assume that it's not available. 

Here is the description of the programming assignment the student is working on:

<assignment>
${context.guidesPage.content}
</assignment>

Note: Here is a list of items that are not part of the assignment instructions:
1. Anything in html <style> tags.
2. Anything in html <script> tags.
3. Anything that resembles autograder feedback about passing or failing tests, i.e. check passed, total passed, total failed, etc.

If any of the above are present in the <assignment>, ignore them as if they're not provided to you

Phrase your hints directly addressing the student as 'you'.
Phrase your hints as questions or suggestions.`

    const result = await codioIDE.coachBot.ask({
      systemPrompt: systemPrompt,
      messages: [{"role": "user", "content": userPrompt}]
    })
  }

})(window.codioIDE, window)
