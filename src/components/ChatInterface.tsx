import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, CheckCheck, User, MessageCircle } from 'lucide-react';
import { Message, HostelListing, User as UserType } from '../types';
import { StorageManager } from '../data';

interface ChatInterfaceProps {
  listing: HostelListing;
  currentUser: UserType;
  recipientName: string;
  onBack: () => void;
}

export default function ChatInterface({ listing, currentUser, recipientName, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = `chat_${currentUser.id}_${listing.landlordId}_${listing.id}`;

  // Load chat history
  useEffect(() => {
    const allMsgs = StorageManager.getMessages();
    const chatMsgs = allMsgs.filter((m) => m.chatId === chatId);
    
    if (chatMsgs.length === 0) {
      // Add initial greeting from landlord if it is a new chat
      const initialGreeting: Message = {
        id: `msg_init_${Date.now()}`,
        chatId: chatId,
        senderId: listing.landlordId,
        recipientId: currentUser.id,
        text: `Hello! I am ${listing.landlordName}, the landlord for "${listing.title}". Is there any question you have about the room or when you'd like to visit?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };
      
      const updatedMsgs = [...allMsgs, initialGreeting];
      StorageManager.saveMessages(updatedMsgs);
      setMessages([initialGreeting]);
    } else {
      setMessages(chatMsgs);
    }
  }, [chatId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const studentMessage: Message = {
      id: `msg_stu_${Date.now()}`,
      chatId: chatId,
      senderId: currentUser.id,
      recipientId: listing.landlordId,
      text: inputText.trim(),
      timestamp: timestamp,
      read: true,
    };

    // Save and update state
    const allMsgs = StorageManager.getMessages();
    const newAllMsgs = [...allMsgs, studentMessage];
    StorageManager.saveMessages(newAllMsgs);
    setMessages((prev) => [...prev, studentMessage]);
    
    const userMsgText = inputText.trim().toLowerCase();
    setInputText('');

    // Simulate landlord typing and replying
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';

      if (userMsgText.includes('available') || userMsgText.includes('vacant') || userMsgText.includes('free')) {
        replyText = "Yes, the room is still fully vacant! We actually have high demand for the semester, but you can secure it soon.";
      } else if (userMsgText.includes('visit') || userMsgText.includes('come') || userMsgText.includes('see')) {
        replyText = "I can definitely show you the room! I will be around this Saturday morning. Would 10:00 AM or 11:30 AM work for you?";
      } else if (userMsgText.includes('price') || userMsgText.includes('discount') || userMsgText.includes('reduce')) {
        replyText = "The listed price of UGX 400,000 per semester covers security, maintenance, and 24/7 water. If you pay for the whole academic year upfront, I can give a small discount.";
      } else if (userMsgText.includes('book') || userMsgText.includes('pay') || userMsgText.includes('deposit')) {
        replyText = "To book, please use the 'Book This Room' form in the app. You can place a small booking request to hold the room.";
      } else {
        replyText = "Thanks for checking in! I'm happy to host you. Please let me know if you would like to arrange a visit or have more questions.";
      }

      const landlordReply: Message = {
        id: `msg_land_${Date.now()}`,
        chatId: chatId,
        senderId: listing.landlordId,
        recipientId: currentUser.id,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };

      const finalAllMsgs = [...newAllMsgs, landlordReply];
      StorageManager.saveMessages(finalAllMsgs);
      setMessages((prev) => [...prev, landlordReply]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white border-b border-slate-100 p-4 shadow-xs shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
              {recipientName.charAt(0)}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">{recipientName}</h3>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Online</span>
          </div>
        </div>
      </div>

      {/* Property Reference Alert */}
      <div className="bg-slate-100/80 border-b border-slate-100 px-4 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <h4 className="text-xs font-extrabold text-slate-800">{listing.title}</h4>
            <p className="text-[10px] font-mono font-bold text-blue-600">
              UGX {listing.pricePerSemester.toLocaleString()} / semester
            </p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center space-x-1 mt-1 text-[9px] font-bold text-slate-400">
                <span>{msg.timestamp}</span>
                {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 mr-auto max-w-[70%]">
            <div className="p-3 bg-white text-slate-500 rounded-2xl rounded-bl-none border border-slate-100 flex items-center space-x-1 shadow-xs">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white border-t border-slate-100 p-4 flex items-center space-x-3 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-4 py-3 text-xs font-semibold outline-none focus:bg-white focus:border-blue-500 transition-colors"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-500/15 cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
}
