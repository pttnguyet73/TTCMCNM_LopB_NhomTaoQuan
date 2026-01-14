import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Save, X, User, Mail, Phone, Upload } from "lucide-react";
import api from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('profile');
        const data = res.data.data ?? res.data;
        const name = data.name ?? data.fullName ?? '';
        setProfile({ fullName: name, email: data.email ?? '', phone: data.phone ?? '' });
        const getBackendOrigin = () => {
          try {
            return new URL(api.defaults.baseURL).origin;
          } catch (e) {
            return '';
          }
        };
        const backendOrigin = getBackendOrigin();

        if (data.profile_photo_url) {
          let url = String(data.profile_photo_url);
          if (url.startsWith('http')) {
            // If backend returned a localhost URL without port (e.g. http://localhost/...),
            // replace its origin with our api base origin so the port (8000) is included.
            if (/^https?:\/\/localhost(:\d+)?\//.test(url)) {
              // replace the origin part
              try {
                const parsed = new URL(url);
                const path = parsed.pathname + parsed.search + parsed.hash;
                url = `${backendOrigin}${path}`;
              } catch (e) {
                // fallback
                url = url.replace(/^https?:\/\/localhost(:\d+)?/, backendOrigin);
              }
            }
            setAvatar(url);
          } else {
            setAvatar(`${backendOrigin}${url}`);
          }
        } else if (data.profile_photo_path) {
          setAvatar(`${backendOrigin}/storage/${data.profile_photo_path}`);
        }
      } catch (err) {
        // ignore
      }
    };
    loadProfile();
  }, []);

  const handleSave = () => {
    const submit = async () => {
      try {
        const form = new FormData();
        form.append('name', profile.fullName);
        form.append('phone', profile.phone || '');
        if (selectedFile) form.append('avatar', selectedFile);

        const res = await api.post('profile', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = res.data.data ?? res.data;
        setProfile(prev => ({ ...prev, fullName: data.name ?? prev.fullName }));
        const getBackendOrigin = () => {
          try {
            return new URL(api.defaults.baseURL).origin;
          } catch (e) {
            return '';
          }
        };
        const backendOrigin = getBackendOrigin();
        if (data.profile_photo_url) {
          let url = String(data.profile_photo_url);
          if (url.startsWith('http')) {
            if (/^https?:\/\/localhost(:\d+)?\//.test(url)) {
              try {
                const parsed = new URL(url);
                const path = parsed.pathname + parsed.search + parsed.hash;
                url = `${backendOrigin}${path}`;
              } catch (e) {
                url = url.replace(/^https?:\/\/localhost(:\d+)?/, backendOrigin);
              }
            }
            setAvatar(url);
          } else {
            setAvatar(`${backendOrigin}${url}`);
          }
        } else if (data.profile_photo_path) {
          setAvatar(`${backendOrigin}/storage/${data.profile_photo_path}`);
        }
        toast({ title: 'Thành công', description: 'Thông tin đã được cập nhật' });
      } catch (err: any) {
        toast({ title: 'Lỗi', description: err?.response?.data?.message ?? 'Lỗi khi cập nhật', variant: 'destructive' });
      }
    };
    submit();
  };

  const handleCancel = () => {
    setProfile({ fullName: '', email: '', phone: '' });
    setSelectedFile(null);
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