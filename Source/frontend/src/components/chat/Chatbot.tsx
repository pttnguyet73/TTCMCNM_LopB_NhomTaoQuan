import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const quickReplies = [
  'Tình trạng đơn hàng',
  'Chính sách đổi trả',
  'Phương thức thanh toán',
  'Liên hệ hotline',
];

const botResponses: Record<string, string> = {
  'xin chào': 'Xin chào! Tôi là trợ lý ảo của iStore. Tôi có thể giúp gì cho bạn hôm nay? 😊',
  'hello': 'Xin chào! Tôi là trợ lý ảo của iStore. Tôi có thể giúp gì cho bạn hôm nay? 😊',
  'hi': 'Xin chào! Tôi là trợ lý ảo của iStore. Tôi có thể giúp gì cho bạn hôm nay? 😊',
  'tình trạng đơn hàng': 'Để kiểm tra tình trạng đơn hàng, bạn vui lòng đăng nhập vào tài khoản và vào mục "Lịch sử đơn hàng". Hoặc bạn có thể cung cấp mã đơn hàng để tôi hỗ trợ tra cứu.',
  'đơn hàng': 'Để kiểm tra tình trạng đơn hàng, bạn vui lòng đăng nhập vào tài khoản và vào mục "Lịch sử đơn hàng". Hoặc bạn có thể cung cấp mã đơn hàng để tôi hỗ trợ tra cứu.',
  'chính sách đổi trả': 'iStore hỗ trợ đổi trả trong vòng 30 ngày kể từ ngày mua hàng. Sản phẩm cần còn nguyên tem, phụ kiện và hóa đơn mua hàng. Phí đổi trả sẽ do iStore chi trả nếu lỗi từ nhà sản xuất.',
  'đổi trả': 'iStore hỗ trợ đổi trả trong vòng 30 ngày kể từ ngày mua hàng. Sản phẩm cần còn nguyên tem, phụ kiện và hóa đơn mua hàng. Phí đổi trả sẽ do iStore chi trả nếu lỗi từ nhà sản xuất.',
  'bảo hành': 'Tất cả sản phẩm tại iStore được bảo hành chính hãng 12 tháng. Đối với iPhone, iPad và Mac, bạn có thể mang đến bất kỳ cửa hàng iStore nào để được hỗ trợ.',
  'phương thức thanh toán': 'iStore hỗ trợ nhiều phương thức thanh toán:\n• COD (thanh toán khi nhận hàng)\n• Internet Banking\n• Ví MoMo, ZaloPay\n• Thẻ tín dụng/ghi nợ Visa, Mastercard, JCB',
  'thanh toán': 'iStore hỗ trợ nhiều phương thức thanh toán:\n• COD (thanh toán khi nhận hàng)\n• Internet Banking\n• Ví MoMo, ZaloPay\n• Thẻ tín dụng/ghi nợ Visa, Mastercard, JCB',
  'liên hệ hotline': 'Bạn có thể liên hệ với chúng tôi qua:\n📞 Hotline: 1900 xxxx (8h-22h hàng ngày)\n📧 Email: support@istore.vn\n🏪 Hệ thống cửa hàng: istore.vn/cua-hang',
  'hotline': 'Bạn có thể liên hệ với chúng tôi qua:\n📞 Hotline: 1900 xxxx (8h-22h hàng ngày)\n📧 Email: support@istore.vn\n🏪 Hệ thống cửa hàng: istore.vn/cua-hang',
  'liên hệ': 'Bạn có thể liên hệ với chúng tôi qua:\n📞 Hotline: 1900 xxxx (8h-22h hàng ngày)\n📧 Email: support@istore.vn\n🏪 Hệ thống cửa hàng: istore.vn/cua-hang',
  'giá': 'Giá sản phẩm tại iStore luôn cạnh tranh và được cập nhật liên tục. Bạn có thể xem giá chi tiết từng sản phẩm trên website hoặc liên hệ hotline để được báo giá tốt nhất.',
  'khuyến mãi': 'Hiện tại iStore đang có nhiều chương trình khuyến mãi hấp dẫn! Sử dụng mã ISTORE10 để giảm 10% cho đơn hàng. Xem thêm ưu đãi tại trang chủ.',
  'giảm giá': 'Hiện tại iStore đang có nhiều chương trình khuyến mãi hấp dẫn! Sử dụng mã ISTORE10 để giảm 10% cho đơn hàng. Xem thêm ưu đãi tại trang chủ.',
  'mã giảm giá': 'Sử dụng mã ISTORE10 để được giảm 10% cho đơn hàng của bạn! Áp dụng trực tiếp khi thanh toán.',
  'vận chuyển': 'iStore miễn phí vận chuyển cho đơn hàng từ 2 triệu đồng. Thời gian giao hàng:\n• Nội thành: 1-2 ngày\n• Ngoại thành: 2-4 ngày\n• Các tỉnh: 3-5 ngày',
  'giao hàng': 'iStore miễn phí vận chuyển cho đơn hàng từ 2 triệu đồng. Thời gian giao hàng:\n• Nội thành: 1-2 ngày\n• Ngoại thành: 2-4 ngày\n• Các tỉnh: 3-5 ngày',
  'ship': 'iStore miễn phí vận chuyển cho đơn hàng từ 2 triệu đồng. Thời gian giao hàng:\n• Nội thành: 1-2 ngày\n• Ngoại thành: 2-4 ngày\n• Các tỉnh: 3-5 ngày',
  'iphone': 'iStore có đầy đủ các dòng iPhone mới nhất: iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15 Plus và iPhone 15. Bạn muốn tìm hiểu về model nào?',
  'ipad': 'iStore cung cấp các dòng iPad: iPad Pro M2, iPad Air, iPad (10th gen) và iPad mini. Bạn quan tâm đến dòng nào?',
  'mac': 'Tại iStore có MacBook Air M2, MacBook Pro 14" và 16" M3. Bạn cần tư vấn thêm về cấu hình phù hợp không?',
  'macbook': 'Tại iStore có MacBook Air M2, MacBook Pro 14" và 16" M3. Bạn cần tư vấn thêm về cấu hình phù hợp không?',
  'trả góp': 'iStore hỗ trợ trả góp 0% lãi suất qua các ngân hàng và công ty tài chính. Thủ tục đơn giản, duyệt nhanh trong 15 phút. Liên hệ hotline để biết thêm chi tiết.',
  'cảm ơn': 'Không có gì! Rất vui được hỗ trợ bạn. Nếu cần thêm thông tin gì, đừng ngại hỏi nhé! 😊',
  'thanks': 'Không có gì! Rất vui được hỗ trợ bạn. Nếu cần thêm thông tin gì, đừng ngại hỏi nhé! 😊',
  'bye': 'Tạm biệt! Chúc bạn một ngày tốt lành. Hẹn gặp lại! 👋',
  'tạm biệt': 'Tạm biệt! Chúc bạn một ngày tốt lành. Hẹn gặp lại! 👋',
};

const defaultResponse = 'Cảm ơn bạn đã liên hệ! Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể thử hỏi về:\n• Tình trạng đơn hàng\n• Chính sách đổi trả & bảo hành\n• Phương thức thanh toán\n• Vận chuyển & giao hàng\n• Sản phẩm iPhone, iPad, Mac\n\nHoặc liên hệ hotline 1900 xxxx để được hỗ trợ trực tiếp.';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý ảo của iStore. Tôi có thể giúp gì cho bạn? 😊',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    return defaultResponse;
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center',
          'bg-gradient-to-r from-primary to-accent text-primary-foreground',
          'hover:shadow-xl transition-shadow',
          isOpen && 'hidden'
        )}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-4 text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">iStore Support</h3>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    Online
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-2',
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                    )}
                  >
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card border border-border rounded-bl-md'
                    )}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-3 border-t border-border bg-card">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-full bg-secondary border-0"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                Powered by iStore AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
