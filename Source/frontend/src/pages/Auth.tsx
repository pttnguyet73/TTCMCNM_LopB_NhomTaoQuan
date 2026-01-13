import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type AuthView = 'login' |'auth' | 'otp' | 'google-verify' | 'google-success' | 'forgot-password' | 'forgot-otp' | 'reset-password' | 'reset-success';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const navigate = useNavigate();
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState<AuthView>('auth');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      await handleLogin();
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setShowOTP(true);
      toast.success('Mã xác nhận đã gửi về email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi đăng ký');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await api.post('/verify-email', {
        email,
        code: otpValue,
          purpose: 'reset_password'
      });

      toast.success('Xác thực thành công, mời đăng nhập');
      setCurrentView('login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'OTP không đúng');
    }
  };
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res: any = await login(email, password);

      toast.success('Đăng nhập thành công');

      const role = res?.user?.role;

      if (role === 'user') {
        navigate('/', { replace: true });
      }
      else {
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      // 4. Xử lý lỗi tinh tế hơn
      const errorMessage = err.response?.data?.message || 'Sai thông tin đăng nhập';
      toast.error(errorMessage);
      console.error("Login Error:", err);
    }
  };


  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    if (provider === 'google') {
      window.location.href = 'http://localhost:8001/auth/google';
    }

  };

  const handleForgotPasswordSubmit = async () => {
    if (!email.trim()) {
      toast.error('Vui lòng nhập email!');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/resend-code', { email });
      setCurrentView('forgot-otp');

      setForgotEmail(email);

      toast.success('Mã xác nhận đã được gửi đến email!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Email không tồn tại');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/reset-password", {
        email: forgotEmail,
        code: otpValue,
        password: newPassword,
        password_confirmation: confirmNewPassword,
      });

      toast.success("Đặt lại mật khẩu thành công");
      setCurrentView("reset-success");

      // Clear state (optional nhưng rất nên)
      setNewPassword("");
      setConfirmNewPassword("");
      setOtpValue("");

    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Mã xác nhận không đúng hoặc đã hết hạn";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleResendOTP = async () => {
    await api.post('/resend-code', { email });
    toast.success('Đã gửi lại mã');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {(currentView === 'otp' || currentView === 'forgot-otp') ? (
              /* ================= OTP VERIFY ================= */
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="max-w-md mx-auto"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-accent" />
                  </div>

                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Xác nhận Email
                  </h1>

                  <p className="text-muted-foreground">
                    Chúng tôi đã gửi mã xác nhận đến
                  </p>
                  <p className="text-foreground font-medium mt-1">
                    {email}
                  </p>
                </div>

                <div className="p-8 bg-card rounded-3xl border border-border">
                  <div className="flex flex-col items-center space-y-6">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={setOtpValue}
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-12 h-14 text-xl rounded-xl border-border"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      onClick={handleVerifyOTP}
                    >
                      Xác nhận
                      <ArrowRight className="w-5 h-5" />
                    </Button>

                    <p className="text-muted-foreground text-sm">
                      Không nhận được mã?{" "}
                      <button
                        onClick={handleResendOTP}
                        className="text-accent font-medium hover:underline"
                      >
                        Gửi lại
                      </button>
                    </p>

                    <button
                      onClick={() => setCurrentView('login')}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Quay lại
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
            /* ================= LOGIN / REGISTER ================= */
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {isLogin ? "Đăng nhập" : "Đăng ký"}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin
                    ? "Chào mừng bạn trở lại!"
                    : "Tạo tài khoản mới"}
                </p>
              </div>

              <div className="p-8 bg-card rounded-3xl border border-border">
                {/* ===== SOCIAL LOGIN ===== */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleSocialLogin('google')}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-medium text-foreground">
                      {isLogin ? 'Đăng nhập với Google' : 'Đăng ký với Google'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleSocialLogin('facebook')}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#1877F2]/90 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="font-medium text-white">
                      {isLogin ? 'Đăng nhập với Facebook' : 'Đăng ký với Facebook'}
                    </span>
                  </button>
                </div>


                {/* ===== DIVIDER ===== */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">
                      hoặc
                    </span>
                  </div>
                </div>

                {/* ===== FORM ===== */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Họ và tên"
                      className="w-full h-12 px-4 bg-secondary rounded-xl"
                      required
                    />
                  )}

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full h-12 px-4 bg-secondary rounded-xl"
                    required
                  />

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu"
                      required
                      className="w-full h-12 pl-12 pr-12 bg-secondary rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {!isLogin && (
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        required
                        className="w-full h-12 pl-12 pr-12 bg-secondary rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleForgotPasswordSubmit}
                        className="text-sm text-accent hover:underline"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    {isLogin ? "Đăng nhập" : "Đăng ký"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>

                <p className="text-center text-muted-foreground mt-6">
                  {isLogin
                    ? "Chưa có tài khoản?"
                    : "Đã có tài khoản?"}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-1 text-accent font-medium hover:underline"
                  >
                    {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                  </button>
                </p>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}