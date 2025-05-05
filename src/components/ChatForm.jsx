import { useRef } from 'react';

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const onSubmitForm = (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();
    if (!userMessage) {
      return;
    }
    console.log('userMessage: ', userMessage);

    inputRef.current.value = '';

    // update chat history with the user's message
    setChatHistory((history) => [...history, { role: 'user', text: userMessage }]);

    setTimeout(() => {
      // add a 'Thingking...' placeholder for bot's message
      setChatHistory((history) => [...history, { role: 'model', text: 'Thinking...' }]);

      // call the function to generate the bot's response
      generateBotResponse([
        ...chatHistory,
        {
          role: 'user',
          // Adding a prefix to each user message so the chatbot responds only based on the provided data
          // text: userMessage,
          text: `Using the details provide above, please address this query: ${userMessage}`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="ChatForm">
      <form action="#" className="chat-form" onSubmit={onSubmitForm}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Message..."
          className="message-input"
          required
        />
        <button className="material-symbols-rounded">arrow_upward</button>
      </form>
    </div>
  );
};

export default ChatForm;
