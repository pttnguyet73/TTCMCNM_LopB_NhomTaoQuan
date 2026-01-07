import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { Plus, Search, Edit, Trash2, MoreVertical, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/data/products";

type Category = "iPhone" | "iPad" | "MacBook" | "Apple Watch" | "AirPods" | "Phụ kiện";

interface Spec {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  specs: Spec[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "" as Category | "",
    price: "",
    description: "",
    image: "",
    specs: [{ label: "", value: "" }],
  });
  const { toast } = useToast();

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi fetch sản phẩm:", err);
      toast({ title: "Lỗi", description: "Không thể tải danh sách sản phẩm", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submit (Add / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      toast({ title: "Lỗi", description: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }

    const validSpecs = formData.specs.filter((s) => s.label && s.value);
    const payload = {
      ...formData,
      price: parseInt(formData.price),
      category: formData.category || "iPhone",
      specs: validSpecs.length > 0 ? validSpecs : [{ label: "Dung lượng", value: "128GB" }],
    };

    try {
      if (editingProduct) {
        // Update API
        await api.put(`/products/${editingProduct.id}`, payload);

        // Update local state
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p))
        );

        toast({ title: "Thành công", description: "Cập nhật sản phẩm thành công" });
      } else {
        // Add new product API
        try {
          const res = await api.post("/products", payload);
                  setProducts((prev) => [res.data, ...prev]);

        } catch (err: any) {
          console.error("Lỗi khi lưu sản phẩm:", err.response?.data);
        }
        // Add to local state

        toast({ title: "Thành công", description: "Thêm sản phẩm mới thành công" });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData({ name: "", category: "", price: "", description: "", image: "", specs: [{ label: "", value: "" }] });
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
      toast({ title: "Lỗi", description: "Thao tác thất bại", variant: "destructive" });
    }
  };

  // Open dialog for Add
  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    setFormData({ name: "", category: "", price: "", description: "", image: "", specs: [{ label: "", value: "" }] });
    setIsDialogOpen(true);
  };

  // Open dialog for Edit
  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      specs: product.specs.length > 0 ? product.specs : [{ label: "", value: "" }],
    });
    setIsDialogOpen(true);
  };

  // Delete product
  const handleDelete = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({ title: "Đã xóa", description: "Sản phẩm đã được xóa khỏi danh sách" });
    } catch (err) {
      console.error(err);
      toast({ title: "Lỗi", description: "Xóa sản phẩm thất bại", variant: "destructive" });
    }
  };

  // Specs handling
  const handleAddSpec = () => setFormData({ ...formData, specs: [...formData.specs, { label: "", value: "" }] });
  const handleRemoveSpec = (index: number) => setFormData({ ...formData, specs: formData.specs.filter((_, i) => i !== index) });
  const handleSpecChange = (index: number, field: "label" | "value", value: string) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specs: newSpecs });
  };

  // Filter products
  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleOpenAddDialog} className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Package className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Còn hàng</p>
              <p className="text-2xl font-bold">{products.filter((p) => p.inStock).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <Package className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hết hàng</p>
              <p className="text-2xl font-bold">{products.filter((p) => !p.inStock).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sản phẩm</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Danh mục</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Giá</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Đánh giá</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg bg-muted" />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{product.category}</td>
                      <td className="py-3 px-4 text-sm font-medium">{formatPrice(product.price)}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span>{product.rating}</span>
                          <span className="text-muted-foreground">({product.reviews})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.inStock ? "bg-emerald-100 text-emerald-700" : "bg-destructive/10 text-destructive"
                            }`}
                        >
                          {product.inStock ? "Còn hàng" : "Hết hàng"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditDialog(product)}>
                              <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nhập tên sản phẩm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as Category })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iPhone">iPhone</SelectItem>
                  <SelectItem value="iPad">iPad</SelectItem>
                  <SelectItem value="MacBook">MacBook</SelectItem>
                  <SelectItem value="Apple Watch">Apple Watch</SelectItem>
                  <SelectItem value="AirPods">AirPods</SelectItem>
                  <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Nhập giá sản phẩm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Nhập mô tả sản phẩm" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">URL hình ảnh</Label>
              <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="Nhập URL hình ảnh" />
            </div>

            {/* Specs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Thông số kỹ thuật</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSpec}>
                  <Plus className="h-4 w-4 mr-1" /> Thêm
                </Button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {formData.specs.map((spec, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input placeholder="Tên thông số" value={spec.label} onChange={(e) => handleSpecChange(index, "label", e.target.value)} className="flex-1" />
                    <Input placeholder="Giá trị" value={spec.value} onChange={(e) => handleSpecChange(index, "value", e.target.value)} className="flex-1" />
                    {formData.specs.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSpec(index)} className="shrink-0 text-destructive hover:text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                {editingProduct ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;