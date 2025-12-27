import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  FileText,
  Image,
  Newspaper,
  Eye,
  EyeOff,
  Calendar,
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

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  status: "published" | "draft";
  createdAt: string;
  views: number;
}

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  position: string;
  status: "active" | "inactive";
  startDate: string;
  endDate: string;
}

const mockArticles: Article[] = [
  {
    id: "ART-001",
    title: "iPhone 16 Pro Max - Đánh giá chi tiết sau 1 tháng sử dụng",
    excerpt: "Trải nghiệm thực tế iPhone 16 Pro Max với chip A18 Pro mạnh mẽ...",
    content: "Nội dung bài viết chi tiết...",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    category: "Đánh giá",
    author: "Admin",
    status: "published",
    createdAt: "2024-01-15",
    views: 1250,
  },
  {
    id: "ART-002",
    title: "So sánh MacBook Pro M3 và M2 - Nên nâng cấp không?",
    excerpt: "Phân tích chi tiết sự khác biệt giữa chip M3 và M2...",
    content: "Nội dung bài viết chi tiết...",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    category: "So sánh",
    author: "Admin",
    status: "published",
    createdAt: "2024-01-12",
    views: 890,
  },
  {
    id: "ART-003",
    title: "Top 10 phụ kiện Apple không thể thiếu năm 2024",
    excerpt: "Những phụ kiện Apple chính hãng đáng mua nhất...",
    content: "Nội dung bài viết chi tiết...",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
    category: "Tin tức",
    author: "Editor",
    status: "draft",
    createdAt: "2024-01-10",
    views: 0,
  },
];

const mockBanners: Banner[] = [
  {
    id: "BAN-001",
    title: "Khuyến mãi Tết 2024",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800",
    link: "/products?sale=tet2024",
    position: "home-hero",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-02-15",
  },
  {
    id: "BAN-002",
    title: "iPhone 16 Series",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    link: "/products?category=iphone",
    position: "home-featured",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: "BAN-003",
    title: "Trade-in MacBook",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    link: "/trade-in",
    position: "sidebar",
    status: "inactive",
    startDate: "2024-02-01",
    endDate: "2024-03-01",
  },
];

const ContentManagement = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [searchTerm, setSearchTerm] = useState("");
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    status: "draft" as "published" | "draft",
  });
  const [bannerForm, setBannerForm] = useState({
    title: "",
    image: "",
    link: "",
    position: "",
    startDate: "",
    endDate: "",
    status: "active" as "active" | "inactive",
  });
  const { toast } = useToast();

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenArticleDialog = (article?: Article) => {
    if (article) {
      setArticleForm({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        image: article.image,
        category: article.category,
        status: article.status,
      });
      setEditingArticle(article);
    } else {
      setArticleForm({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        category: "",
        status: "draft",
      });
      setEditingArticle(null);
    }
    setIsArticleDialogOpen(true);
  };

  const handleOpenBannerDialog = (banner?: Banner) => {
    if (banner) {
      setBannerForm({
        title: banner.title,
        image: banner.image,
        link: banner.link,
        position: banner.position,
        startDate: banner.startDate,
        endDate: banner.endDate,
        status: banner.status,
      });
      setEditingBanner(banner);
    } else {
      setBannerForm({
        title: "",
        image: "",
        link: "",
        position: "",
        startDate: "",
        endDate: "",
        status: "active",
      });
      setEditingBanner(null);
    }
    setIsBannerDialogOpen(true);
  };

  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.category) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? { ...a, ...articleForm }
            : a
        )
      );
      toast({ title: "Thành công", description: "Cập nhật bài viết thành công" });
    } else {
      const newArticle: Article = {
        id: `ART-${Date.now()}`,
        ...articleForm,
        author: "Admin",
        createdAt: new Date().toISOString().split("T")[0],
        views: 0,
      };
      setArticles((prev) => [newArticle, ...prev]);
      toast({ title: "Thành công", description: "Thêm bài viết mới thành công" });
    }
    setIsArticleDialogOpen(false);
  };

  const handleSubmitBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title || !bannerForm.image) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? { ...b, ...bannerForm }
            : b
        )
      );
      toast({ title: "Thành công", description: "Cập nhật banner thành công" });
    } else {
      const newBanner: Banner = {
        id: `BAN-${Date.now()}`,
        ...bannerForm,
      };
      setBanners((prev) => [newBanner, ...prev]);
      toast({ title: "Thành công", description: "Thêm banner mới thành công" });
    }
    setIsBannerDialogOpen(false);
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Đã xóa", description: "Bài viết đã được xóa" });
  };

  const handleDeleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast({ title: "Đã xóa", description: "Banner đã được xóa" });
  };

  const handleToggleBannerStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "active" ? "inactive" : "active" }
          : b
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng bài viết</p>
              <p className="text-2xl font-bold">{articles.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100">
              <Image className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Banner hoạt động</p>
              <p className="text-2xl font-bold">
                {banners.filter((b) => b.status === "active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-violet-100">
              <Eye className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng lượt xem</p>
              <p className="text-2xl font-bold">
                {articles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles" className="gap-2">
            <Newspaper className="h-4 w-4" />
            Bài viết
          </TabsTrigger>
          <TabsTrigger value="banners" className="gap-2">
            <Image className="h-4 w-4" />
            Banner
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleOpenArticleDialog()} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm bài viết
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {filteredArticles.map((article) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{article.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{article.excerpt}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{article.category}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{article.createdAt}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          article.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {article.status === "published" ? "Đã đăng" : "Nháp"}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenArticleDialog(article)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => handleOpenBannerDialog()} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm banner
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {banners.map((banner) => (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenBannerDialog(banner)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteBanner(banner.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{banner.title}</h4>
                        <Switch
                          checked={banner.status === "active"}
                          onCheckedChange={() => handleToggleBannerStatus(banner.id)}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 rounded bg-muted">{banner.position}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {banner.startDate} - {banner.endDate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>

      {/* Article Dialog */}
      <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitArticle} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={articleForm.title}
                onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                placeholder="Nhập tiêu đề bài viết"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={articleForm.category}
                  onValueChange={(value) => setArticleForm({ ...articleForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tin tức">Tin tức</SelectItem>
                    <SelectItem value="Đánh giá">Đánh giá</SelectItem>
                    <SelectItem value="So sánh">So sánh</SelectItem>
                    <SelectItem value="Hướng dẫn">Hướng dẫn</SelectItem>
                    <SelectItem value="Khuyến mãi">Khuyến mãi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={articleForm.status}
                  onValueChange={(value) =>
                    setArticleForm({ ...articleForm, status: value as "published" | "draft" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Nháp</SelectItem>
                    <SelectItem value="published">Đăng ngay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">URL hình ảnh</Label>
              <Input
                id="image"
                value={articleForm.image}
                onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                placeholder="Nhập URL hình ảnh"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Mô tả ngắn</Label>
              <Textarea
                id="excerpt"
                value={articleForm.excerpt}
                onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                placeholder="Nhập mô tả ngắn"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung</Label>
              <Textarea
                id="content"
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                placeholder="Nhập nội dung bài viết"
                rows={6}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsArticleDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                {editingArticle ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Banner Dialog */}
      <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Chỉnh sửa banner" : "Thêm banner mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitBanner} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bannerTitle">Tiêu đề</Label>
              <Input
                id="bannerTitle"
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                placeholder="Nhập tiêu đề banner"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerImage">URL hình ảnh</Label>
              <Input
                id="bannerImage"
                value={bannerForm.image}
                onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                placeholder="Nhập URL hình ảnh"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerLink">Đường dẫn</Label>
              <Input
                id="bannerLink"
                value={bannerForm.link}
                onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                placeholder="/products?category=iphone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Vị trí</Label>
              <Select
                value={bannerForm.position}
                onValueChange={(value) => setBannerForm({ ...bannerForm, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home-hero">Trang chủ - Hero</SelectItem>
                  <SelectItem value="home-featured">Trang chủ - Featured</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="product-page">Trang sản phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={bannerForm.startDate}
                  onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={bannerForm.endDate}
                  onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsBannerDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                {editingBanner ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;
