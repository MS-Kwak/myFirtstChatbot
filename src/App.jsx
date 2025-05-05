import { useEffect, useRef, useState } from 'react';
import './App.css';
import ChtbotIcon from './components/ChatbotIcon';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';
import { companyInfo } from './util/companyInfo';
// import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';

function App() {
  const [chatHistory, setChatHistory] = useState([
    // Adding a prefix to each user message so the chatbot responds only based on the provided data
    // useState([]) : 구글 AI API만 사용시
    { hideInChat: true, role: 'model', text: companyInfo },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    console.log('generateBotResponse history: ', history);

    // Helper function to update chat history
    const updateHistory = (apiResponseText, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== 'Thinking...'),
        { role: 'model', text: apiResponseText, isError },
      ]);
    };

    // format chat history for API request (https://aistudio.google.com/app/apikey)
    history = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    // const requestOptions = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ contents: history }),
    // };

    // Make the API call to get the bot's response
    try {
      // const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.error.message || 'Something went wrong!!');
      // }
      // const apiResponseText = data.candidates[0].content.parts[0].text
      //   .replace(/\*\*(.*?)\*\*/g, '$1')
      //   .trim();
      // //  Clean and update chat history with bot's response
      // updateHistory(apiResponseText);

      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const getAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response = await getAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: history,
      });
      const apiResponseText = response.text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
      // Clean and update chat history with bot's response
      updateHistory(apiResponseText);
      console.log('response data: ', response);

      // const getAI = new GoogleGenerativeAI('AIzaSyDA6RxdsIFB_3-Zsn6Tmz9gHhdcw1Gh-Kg');
      // const model = getAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      // const data = await model.generateContent({ contents: history });
      // const apiResponseText = data.response.candidates[0].content.parts[0].text
      //   .replace(/\*\*(.*?)\*\*/g, '$1')
      //   .trim();
      // Clean and update chat history with bot's response
      // updateHistory(apiResponseText);
      // console.log('response data: ', data);
    } catch (error) {
      updateHistory(error.message, true);

      console.log('response error: ', error);
    }
  };

  useEffect(() => {
    // Aoto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? `show-chatbot` : ''}`}>
      <button id="chatbotToggler" onClick={() => setShowChatbot((prev) => !prev)}>
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        {/* chat header */}
        <div className="chat-header">
          <div className="header-info">
            <ChtbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            className="material-symbols-rounded"
            onClick={() => setShowChatbot((prev) => !prev)}
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* chat body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChtbotIcon />
            <p className="message-text">
              안녕하세요! 👋🏻 <br /> 오늘은 무엇을 도와드릴까요?
            </p>
          </div>
          {/* Render the chat history dynamically */}
          {chatHistory.map((item, index) => (
            <ChatMessage key={index} chat={item} />
          ))}
        </div>

        {/* chat footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
