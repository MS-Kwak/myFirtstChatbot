import ChtbotIcon from './ChatbotIcon';

const ChatMessage = ({ chat }) => {
  return (
    // Adding a prefix to each user message so the chatbot responds only based on the provided data
    !chat.hideInChat && (
      <div className="ChatMessage">
        <div
          className={`message ${chat.role === 'model' ? 'bot' : 'user'}-message ${
            chat.isError ? `error` : ''
          }`}
        >
          {chat.role === 'model' && <ChtbotIcon />}
          <p className="message-text">{chat.text}</p>
        </div>
      </div>
    )
  );
};
export default ChatMessage;
