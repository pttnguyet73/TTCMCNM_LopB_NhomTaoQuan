import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Tag,
  Mail,
  Share2,
  TrendingUp,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  Percent,
  Gift,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/data/products";

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usageCount: number;
  status: "active" | "expired" | "disabled";
  startDate: string;
  endDate: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sent";
  recipients: number;
  openRate: number;
  clickRate: number;
  scheduledAt: string;
  sentAt: string;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  robots: string;
  sitemap: boolean;
  analytics: string;
}

const mockCoupons: Coupon[] = [
  {
    id: "CPN-001",
    code: "TET2024",
    type: "percent",
    value: 15,
    minOrder: 5000000,
    maxDiscount: 2000000,
    usageLimit: 100,
    usageCount: 45,
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
  },
  {
    id: "CPN-002",
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minOrder: 2000000,
    maxDiscount: 1000000,
    usageLimit: 500,
    usageCount: 234,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: "CPN-003",
    code: "FREESHIP",
    type: "fixed",
    value: 50000,
    minOrder: 1000000,
    maxDiscount: 50000,
    usageLimit: 1000,
    usageCount: 1000,
    status: "expired",
    startDate: "2023-12-01",
    endDate: "2024-01-01",
  },
];

const mockEmailCampaigns: EmailCampaign[] = [
  {
    id: "EML-001",
    name: "Khuyến mãi Tết 2024",
    subject: "🎉 Giảm đến 30% - Ưu đãi Tết Giáp Thìn!",
    status: "sent",
    recipients: 5420,
    openRate: 42.5,
    clickRate: 12.3,
    scheduledAt: "2024-01-15 09:00",
    sentAt: "2024-01-15 09:00",
  },
  {
    id: "EML-002",
    name: "Ra mắt iPhone 16",
    subject: "iPhone 16 đã có mặt - Đặt hàng ngay!",
    status: "scheduled",
    recipients: 8500,
    openRate: 0,
    clickRate: 0,
    scheduledAt: "2024-01-20 10:00",
    sentAt: "",
  },
  {
    id: "EML-003",
    name: "Newsletter tháng 1",
    subject: "Tin tức Apple tháng 1/2024",
    status: "draft",
    recipients: 0,
    openRate: 0,
    clickRate: 0,
    scheduledAt: "",
    sentAt: "",
  },
];

const defaultSEO: SEOSettings = {
  metaTitle: "AppleStore - Đại lý ủy quyền Apple chính hãng",
  metaDescription: "Mua iPhone, iPad, MacBook, Apple Watch chính hãng với giá tốt nhất. Bảo hành chính hãng, trả góp 0%, giao hàng miễn phí toàn quốc.",
  keywords: "iphone, ipad, macbook, apple watch, apple chính hãng, đại lý apple",
  ogImage: "https://example.com/og-image.jpg",
  robots: "index, follow",
  sitemap: true,
  analytics: "G-XXXXXXXXXX",
};

const statusConfig = {
  active: { label: "Hoạt động", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  expired: { label: "Hết hạn", color: "bg-muted text-muted-foreground", icon: XCircle },
  disabled: { label: "Vô hiệu", color: "bg-destructive/10 text-destructive", icon: XCircle },
  draft: { label: "Nháp", color: "bg-muted text-muted-foreground", icon: Clock },
  scheduled: { label: "Đã lên lịch", color: "bg-blue-100 text-blue-700", icon: Clock },
  sent: { label: "Đã gửi", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
};

const MarketingManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>(mockEmailCampaigns);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(defaultSEO);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
  });
  const { toast } = useToast();

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCouponDialog = (coupon?: Coupon) => {
    if (coupon) {
      setCouponForm({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        minOrder: coupon.minOrder.toString(),
        maxDiscount: coupon.maxDiscount.toString(),
        usageLimit: coupon.usageLimit.toString(),
        startDate: coupon.startDate,
        endDate: coupon.endDate,
      });
      setEditingCoupon(coupon);
    } else {
      setCouponForm({
        code: "",
        type: "percent",
        value: "",
        minOrder: "",
        maxDiscount: "",
        usageLimit: "",
        startDate: "",
        endDate: "",
      });
      setEditingCoupon(null);
    }
    setIsCouponDialogOpen(true);
  };

  const handleSubmitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.value) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: couponForm.code,
                type: couponForm.type,
                value: parseInt(couponForm.value),
                minOrder: parseInt(couponForm.minOrder) || 0,
                maxDiscount: parseInt(couponForm.maxDiscount) || 0,
                usageLimit: parseInt(couponForm.usageLimit) || 0,
                startDate: couponForm.startDate,
                endDate: couponForm.endDate,
              }
            : c
        )
      );
      toast({ title: "Thành công", description: "Cập nhật mã giảm giá thành công" });
    } else {
      const newCoupon: Coupon = {
        id: `CPN-${Date.now()}`,
        code: couponForm.code.toUpperCase(),
        type: couponForm.type,
        value: parseInt(couponForm.value),
        minOrder: parseInt(couponForm.minOrder) || 0,
        maxDiscount: parseInt(couponForm.maxDiscount) || 0,
        usageLimit: parseInt(couponForm.usageLimit) || 0,
        usageCount: 0,
        status: "active",
        startDate: couponForm.startDate,
        endDate: couponForm.endDate,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      toast({ title: "Thành công", description: "Tạo mã giảm giá mới thành công" });
    }
    setIsCouponDialogOpen(false);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Đã xóa", description: "Mã giảm giá đã được xóa" });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Đã sao chép", description: `Mã ${code} đã được sao chép` });
  };

  const handleSaveSEO = () => {
    toast({ title: "Thành công", description: "Cài đặt SEO đã được lưu" });
  };

  const stats = {
    activeCoupons: coupons.filter((c) => c.status === "active").length,
    totalSaved: coupons.reduce((sum, c) => sum + (c.usageCount * (c.type === "percent" ? c.maxDiscount : c.value)), 0),
    emailsSent: emailCampaigns.filter((e) => e.status === "sent").reduce((sum, e) => sum + e.recipients, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Tag className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mã đang hoạt động</p>
              <p className="text-2xl font-bold">{stats.activeCoupons}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100">
              <Gift className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đã tiết kiệm cho KH</p>
              <p className="text-lg font-bold">{formatPrice(stats.totalSaved)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-violet-100">
              <Mail className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email đã gửi</p>
              <p className="text-2xl font-bold">{stats.emailsSent.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coupons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="coupons" className="gap-2">
            <Tag className="h-4 w-4" />
            Mã giảm giá
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email Marketing
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            Mạng xã hội
          </TabsTrigger>
        </TabsList>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleOpenCouponDialog()} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Tạo mã giảm giá
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mã</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Giảm giá</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Đơn tối thiểu</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Đã dùng</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Thời hạn</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredCoupons.map((coupon) => {
                        const StatusIcon = statusConfig[coupon.status].icon;
                        return (
                          <motion.tr
                            key={coupon.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 rounded bg-muted font-mono text-sm">
                                  {coupon.code}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleCopyCode(coupon.code)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium">
                              {coupon.type === "percent" ? (
                                <span className="flex items-center gap-1">
                                  <Percent className="h-3 w-3" />
                                  {coupon.value}%
                                </span>
                              ) : (
                                formatPrice(coupon.value)
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm">{formatPrice(coupon.minOrder)}</td>
                            <td className="py-3 px-4 text-sm">
                              {coupon.usageCount}/{coupon.usageLimit}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${statusConfig[coupon.status].color}`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig[coupon.status].label}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {coupon.startDate} - {coupon.endDate}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleOpenCouponDialog(coupon)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteCoupon(coupon.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Marketing Tab */}
        <TabsContent value="email" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Tạo chiến dịch
            </Button>
          </div>

          <div className="grid gap-4">
            {emailCampaigns.map((campaign) => {
              const StatusIcon = statusConfig[campaign.status].icon;
              return (
                <Card key={campaign.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{campaign.name}</h4>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig[campaign.status].color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[campaign.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{campaign.subject}</p>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="text-muted-foreground">
                            Người nhận: <strong>{campaign.recipients.toLocaleString()}</strong>
                          </span>
                          {campaign.status === "sent" && (
                            <>
                              <span className="text-muted-foreground">
                                Tỷ lệ mở: <strong className="text-emerald-600">{campaign.openRate}%</strong>
                              </span>
                              <span className="text-muted-foreground">
                                Tỷ lệ click: <strong className="text-accent">{campaign.clickRate}%</strong>
                              </span>
                            </>
                          )}
                          {campaign.scheduledAt && (
                            <span className="text-muted-foreground">
                              Lên lịch: <strong>{campaign.scheduledAt}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {campaign.status === "draft" && (
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Gửi ngay
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                  placeholder="Tiêu đề trang"
                />
                <p className="text-xs text-muted-foreground">{seoSettings.metaTitle.length}/60 ký tự</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                  placeholder="Mô tả trang"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">{seoSettings.metaDescription.length}/160 ký tự</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={seoSettings.keywords}
                  onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                  placeholder="từ khóa 1, từ khóa 2, ..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogImage">Open Graph Image URL</Label>
                <Input
                  id="ogImage"
                  value={seoSettings.ogImage}
                  onChange={(e) => setSeoSettings({ ...seoSettings, ogImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="robots">Robots</Label>
                  <Select
                    value={seoSettings.robots}
                    onValueChange={(value) => setSeoSettings({ ...seoSettings, robots: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index, follow">Index, Follow</SelectItem>
                      <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                      <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                      <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="analytics">Google Analytics ID</Label>
                  <Input
                    id="analytics"
                    value={seoSettings.analytics}
                    onChange={(e) => setSeoSettings({ ...seoSettings, analytics: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Tự động tạo Sitemap</p>
                  <p className="text-xs text-muted-foreground">Tạo sitemap.xml tự động cho SEO</p>
                </div>
                <Switch
                  checked={seoSettings.sitemap}
                  onCheckedChange={(checked) => setSeoSettings({ ...seoSettings, sitemap: checked })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSEO} className="bg-accent hover:bg-accent/90">
                  Lưu cài đặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Facebook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Facebook Page URL</Label>
                  <Input placeholder="https://facebook.com/yourpage" />
                </div>
                <div className="space-y-2">
                  <Label>Facebook Pixel ID</Label>
                  <Input placeholder="123456789" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tích hợp Messenger Chat</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instagram</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Instagram Username</Label>
                  <Input placeholder="@yourusername" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hiển thị Instagram Feed</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Zalo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Zalo OA ID</Label>
                  <Input placeholder="123456789" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tích hợp Zalo Chat</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">TikTok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>TikTok Username</Label>
                  <Input placeholder="@yourusername" />
                </div>
                <div className="space-y-2">
                  <Label>TikTok Pixel ID</Label>
                  <Input placeholder="123456789" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button className="bg-accent hover:bg-accent/90">
              Lưu cài đặt
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Coupon Dialog */}
      <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCoupon} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã giảm giá</Label>
              <Input
                id="code"
                value={couponForm.code}
                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                placeholder="VD: SALE20"
                className="uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại giảm giá</Label>
                <Select
                  value={couponForm.type}
                  onValueChange={(value) => setCouponForm({ ...couponForm, type: value as "percent" | "fixed" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed">Số tiền cố định</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Giá trị</Label>
                <Input
                  id="value"
                  type="number"
                  value={couponForm.value}
                  onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })}
                  placeholder={couponForm.type === "percent" ? "10" : "100000"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrder">Đơn tối thiểu</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={couponForm.minOrder}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })}
                  placeholder="1000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Giảm tối đa</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={couponForm.maxDiscount}
                  onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                  placeholder="500000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Số lượt sử dụng</Label>
              <Input
                id="usageLimit"
                type="number"
                value={couponForm.usageLimit}
                onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                placeholder="100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={couponForm.startDate}
                  onChange={(e) => setCouponForm({ ...couponForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={couponForm.endDate}
                  onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCouponDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                {editingCoupon ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingManagement;
