using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace _
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var builder = Kernel.CreateBuilder();
            builder.AddAzureOpenAIChatCompletion(
                "gpt-35-turbo",
                "https://azureopenai-neudesic-test.openai.azure.com/",
                "08bd540f4656423e97058f8d30617ae8");
            Kernel kernel = builder.Build();

            var executionSettings = new OpenAIPromptExecutionSettings
            {
                MaxTokens = 2000,
                Temperature = 0.7,
                TopP = 0.5
            };

            var batmanFunction = kernel.CreateFunctionFromPrompt(batTemplate, executionSettings);
            var alferdFunction = kernel.CreateFunctionFromPrompt(alfredTemplate, executionSettings);

            var history = "";
            var arguments = new KernelArguments()
            {
                ["history"] = history
            };

            // Define the Chat delegate
            Func<string, Task> Chat = async (userInput) =>
            {
                // Save new message in the arguments
                arguments["userInput"] = userInput;

                // Process the user message and get an answer from batman
                var batmanAnswer = await batmanFunction.InvokeAsync(kernel, arguments);
                arguments["batmanInput"] = batmanAnswer;
                var result = $"\nUser: {userInput}\nBatman: {batmanAnswer}";
                history += result;
                arguments["history"] = history;

                Console.WriteLine(result);

                // Process the batman message and get an answer from alfred
                var alfredAnswer = await alferdFunction.InvokeAsync(kernel, arguments);

                // Append the new interaction to the chat history
                result = $"\nAlfred: {alfredAnswer}";
                history += result;
                arguments["history"] = history;

                // Show the response
                Console.WriteLine(result);
            };

            // Main loop for chat interaction
            while (true)
            {
                Console.Write("You: ");
                var userInput = Console.ReadLine();
                if (string.IsNullOrEmpty(userInput)) break; // Exit loop if input is empty

                await Chat(userInput);
            }
        }

        static readonly string batTemplate = @"
                Respond to the user's request as if you were Batman. Be creative and funny, but keep it clean.
                Try to answer user questions to the best of your ability.

                User: How are you?
                Batman: I'm fine. It's another wonderful day of inflicting vigilante justice upon the city.

                User: Where's a good place to shop for books?
                Batman: You know who likes books? The Riddler. You're not the Riddler, are you?

                {{$history}}
                User: {{$userInput}}
                Batman: 
                ";

        static readonly string alfredTemplate = @"
                Respond to the user's request as if you were Alfred, butler to Bruce Wayne. 
                Your job is to summarize text from Batman and relay it to the user. 
                Be polite and helpful, but a little snark is fine.

                Batman: I am vengeance. I am the night. I am Batman!
                Alfred: The dark knight wishes to inform you that he remains the batman.

                Batman: The missing bags - WHERE ARE THEY???
                Alfred: It is my responsibility to inform you that Batman requires information on the missing bags most urgently.

                {{$history}}
                Batman: {{$batmanInput}}
                Alfred: 
                ";
    }
}