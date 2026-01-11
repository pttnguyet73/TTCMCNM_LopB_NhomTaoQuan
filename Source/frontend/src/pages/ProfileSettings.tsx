import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Eye, EyeOff, Save, X, User, Mail, Phone, Lock, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validate passwords if user is trying to change them
    if (passwords.new || passwords.confirm || passwords.current) {
      if (!passwords.current) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập mật khẩu hiện tại",
          variant: "destructive",
        });
        return;
      }
      if (passwords.new !== passwords.confirm) {
        toast({
          title: "Lỗi",
          description: "Mật khẩu mới không khớp",
          variant: "destructive",
        });
        return;
      }
      if (passwords.new.length < 6) {
        toast({
          title: "Lỗi",
          description: "Mật khẩu mới phải có ít nhất 6 ký tự",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Thành công",
      description: "Thông tin đã được cập nhật",
    });
  };

  const handleCancel = () => {
    setProfile({
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0901234567",
    });
    setPasswords({ current: "", new: "", confirm: "" });
    setAvatar(null);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card className="border-border/50 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            Ảnh đại diện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-accent/20 overflow-hidden bg-muted flex items-center justify-center shadow-lg">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md hover:bg-accent/90 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Tải lên ảnh mới</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Chấp nhận JPG, PNG hoặc GIF. Kích thước tối đa 5MB.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Chọn ảnh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info Section */}
      <Card className="border-border/50 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => handleProfileChange("fullName", e.target.value)}
                  className="pl-10"
                  placeholder="Nhập họ và tên"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  className="pl-10"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="pl-10 bg-muted/50 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email không thể thay đổi. Liên hệ hỗ trợ nếu cần cập nhật.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card className="border-border/50 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            Đổi mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => handlePasswordChange("current", e.target.value)}
                className="pl-10 pr-10"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange("new", e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleCancel} className="px-6">
          <X className="w-4 h-4 mr-2" />
          Hủy
        </Button>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={handleSave} className="px-6 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;
