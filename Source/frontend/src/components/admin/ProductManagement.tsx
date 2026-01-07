import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Package,
  X,
  Upload,
  Image as ImageIcon,
  Check,
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
import { useToast } from "@/hooks/use-toast";
import { products as initialProducts, formatPrice, Product } from "@/data/products";
import { ScrollArea } from "@/components/ui/scroll-area";

// Predefined colors for selection
const PRESET_COLORS = [
  { name: "Đen", hex: "#000000" },
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Xám", hex: "#808080" },
  { name: "Bạc", hex: "#C0C0C0" },
  { name: "Vàng", hex: "#FFD700" },
  { name: "Xanh dương", hex: "#0066CC" },
  { name: "Xanh lá", hex: "#00AA00" },
  { name: "Đỏ", hex: "#FF0000" },
  { name: "Tím", hex: "#800080" },
  { name: "Hồng", hex: "#FFC0CB" },
];

// Predefined storage options
const PRESET_STORAGE = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];

// Required technical specifications
const REQUIRED_SPECS = [
  { label: "Màn hình", placeholder: "6.7 inch, Super Retina XDR" },
  { label: "Chip", placeholder: "Apple A17 Pro" },
  { label: "Camera", placeholder: "48MP + 12MP + 12MP" },
  { label: "Pin", placeholder: "4422 mAh" },
  { label: "RAM", placeholder: "8GB" },
  { label: "Bộ nhớ", placeholder: "256GB" },
  { label: "Chất liệu", placeholder: "Titanium" },
];

interface FormData {
  name: string;
  category: string;
  originalPrice: string;
  salePrice: string;
  stock: string;
  description: string;
  images: string[];
  colors: { name: string; hex: string }[];
  storage: string[];
  customStorage: string;
  requiredSpecs: { label: string; value: string }[];
  additionalSpecs: { label: string; value: string }[];
}

const initialFormData: FormData = {
  name: "",
  category: "",
  originalPrice: "",
  salePrice: "",
  stock: "",
  description: "",
  images: [],
  colors: [],
  storage: [],
  customStorage: "",
  requiredSpecs: REQUIRED_SPECS.map((s) => ({ label: s.label, value: "" })),
  additionalSpecs: [],
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    setFormData(initialFormData);
    setEditingProduct(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (product: Product) => {
    const requiredSpecs = REQUIRED_SPECS.map((s) => {
      const existing = product.specs?.find((ps) => ps.label === s.label);
      return { label: s.label, value: existing?.value || "" };
    });
    const additionalSpecs = product.specs?.filter(
      (ps) => !REQUIRED_SPECS.some((rs) => rs.label === ps.label)
    ) || [];

    setFormData({
      name: product.name,
      category: product.category,
      originalPrice: product.price.toString(),
      salePrice: "",
      stock: "100",
      description: product.description,
      images: product.images || [product.image],
      colors: product.colors || [],
      storage: product.storage || [],
      customStorage: "",
      requiredSpecs,
      additionalSpecs,
    });
    setEditingProduct(product);
    setIsAddDialogOpen(true);
  };

  // Image handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Color handling
  const toggleColor = (color: { name: string; hex: string }) => {
    const exists = formData.colors.some((c) => c.hex === color.hex);
    setFormData((prev) => ({
      ...prev,
      colors: exists
        ? prev.colors.filter((c) => c.hex !== color.hex)
        : [...prev.colors, color],
    }));
  };

  // Storage handling
  const toggleStorage = (storage: string) => {
    const exists = formData.storage.includes(storage);
    setFormData((prev) => ({
      ...prev,
      storage: exists
        ? prev.storage.filter((s) => s !== storage)
        : [...prev.storage, storage],
    }));
  };

  const addCustomStorage = () => {
    if (formData.customStorage && !formData.storage.includes(formData.customStorage)) {
      setFormData((prev) => ({
        ...prev,
        storage: [...prev.storage, prev.customStorage],
        customStorage: "",
      }));
    }
  };

  // Spec handling
  const handleRequiredSpecChange = (index: number, value: string) => {
    const newSpecs = [...formData.requiredSpecs];
    newSpecs[index].value = value;
    setFormData({ ...formData, requiredSpecs: newSpecs });
  };

  const handleAddAdditionalSpec = () => {
    setFormData({
      ...formData,
      additionalSpecs: [...formData.additionalSpecs, { label: "", value: "" }],
    });
  };

  const handleRemoveAdditionalSpec = (index: number) => {
    setFormData({
      ...formData,
      additionalSpecs: formData.additionalSpecs.filter((_, i) => i !== index),
    });
  };

  const handleAdditionalSpecChange = (index: number, field: "label" | "value", value: string) => {
    const newSpecs = [...formData.additionalSpecs];
    newSpecs[index][field] = value;
    setFormData({ ...formData, additionalSpecs: newSpecs });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.originalPrice) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    const allSpecs = [
      ...formData.requiredSpecs.filter((s) => s.value),
      ...formData.additionalSpecs.filter((s) => s.label && s.value),
    ];

    const price = parseInt(formData.salePrice || formData.originalPrice);
    const originalPrice = parseInt(formData.originalPrice);

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category as "iphone" | "ipad" | "mac",
                price: price,
                description: formData.description,
                image: formData.images[0] || p.image,
                images: formData.images.length > 0 ? formData.images : p.images,
                specs: allSpecs.length > 0 ? allSpecs : p.specs,
                colors: formData.colors.length > 0 ? formData.colors : p.colors,
                storage: formData.storage.length > 0 ? formData.storage : p.storage,
                inStock: parseInt(formData.stock || "0") > 0,
              }
            : p
        )
      );
      toast({
        title: "Thành công",
        description: "Cập nhật sản phẩm thành công",
      });
    } else {
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: formData.name,
        category: formData.category as "iphone" | "ipad" | "mac",
        price: price,
        description: formData.description,
        image: formData.images[0] || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
        images: formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800"],
        specs: allSpecs.length > 0 ? allSpecs : [{ label: "Dung lượng", value: "128GB" }],
        colors: formData.colors.length > 0 ? formData.colors : [{ name: "Đen", hex: "#000000" }],
        storage: formData.storage.length > 0 ? formData.storage : ["128GB"],
        rating: 5,
        reviews: 0,
        inStock: parseInt(formData.stock || "0") > 0,
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast({
        title: "Thành công",
        description: "Thêm sản phẩm mới thành công",
      });
    }

    setIsAddDialogOpen(false);
  };

  const handleDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast({
      title: "Đã xóa",
      description: "Sản phẩm đã được xóa khỏi danh sách",
    });
  };

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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg bg-muted"
                          />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {product.description}
                            </p>
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
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.inStock
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-destructive/10 text-destructive"
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
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
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
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-accent">
              {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Tên sản phẩm <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên sản phẩm"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Danh mục <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="rounded-xl">
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
              </div>

              {/* Image Upload Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Hình ảnh sản phẩm</Label>
                <div className="border-2 border-dashed border-accent/30 rounded-xl p-4 bg-accent/5 hover:bg-accent/10 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-10 w-10 text-accent mb-2" />
                    <p className="text-sm font-medium text-accent">Tải ảnh lên</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Kéo thả hoặc click để chọn nhiều ảnh
                    </p>
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-accent text-white text-[10px] px-1.5 py-0.5 rounded">
                            Chính
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Stock Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalPrice" className="text-sm font-medium">
                    Giá gốc (VNĐ) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="29.990.000"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice" className="text-sm font-medium">
                    Giá khuyến mãi (VNĐ)
                  </Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="Để trống nếu không KM"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-medium">
                    Số lượng tồn kho
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="100"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Mô tả sản phẩm
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                  rows={3}
                  className="rounded-xl"
                />
              </div>

              {/* Variants Section */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
                <h3 className="font-semibold text-accent flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Biến thể sản phẩm
                </h3>

                {/* Colors */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Màu sắc</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => {
                      const isSelected = formData.colors.some((c) => c.hex === color.hex);
                      return (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() => toggleColor(color)}
                          className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                            isSelected ? "border-accent scale-110" : "border-border hover:border-accent/50"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isSelected && (
                            <Check
                              className={`absolute inset-0 m-auto h-4 w-4 ${
                                color.hex === "#FFFFFF" || color.hex === "#FFD700"
                                  ? "text-black"
                                  : "text-white"
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {formData.colors.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Đã chọn: {formData.colors.map((c) => c.name).join(", ")}
                    </p>
                  )}
                </div>

                {/* Storage */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Dung lượng</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_STORAGE.map((storage) => {
                      const isSelected = formData.storage.includes(storage);
                      return (
                        <button
                          key={storage}
                          type="button"
                          onClick={() => toggleStorage(storage)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-accent text-white"
                              : "bg-background border border-border hover:border-accent"
                          }`}
                        >
                          {storage}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={formData.customStorage}
                      onChange={(e) => setFormData({ ...formData, customStorage: e.target.value })}
                      placeholder="Thêm dung lượng khác..."
                      className="rounded-xl flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCustomStorage}
                      className="rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.storage.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.storage
                        .filter((s) => !PRESET_STORAGE.includes(s))
                        .map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-lg text-xs"
                          >
                            {s}
                            <button type="button" onClick={() => toggleStorage(s)}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
                <h3 className="font-semibold text-accent">Thông số kỹ thuật</h3>

                {/* Required Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.requiredSpecs.map((spec, index) => (
                    <div key={spec.label} className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        {spec.label}
                      </Label>
                      <Input
                        value={spec.value}
                        onChange={(e) => handleRequiredSpecChange(index, e.target.value)}
                        placeholder={REQUIRED_SPECS[index]?.placeholder || "Nhập giá trị"}
                        className="rounded-xl"
                      />
                    </div>
                  ))}
                </div>

                {/* Additional Specs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Thông số bổ sung</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddAdditionalSpec}
                      className="rounded-lg"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Thêm
                    </Button>
                  </div>
                  {formData.additionalSpecs.length > 0 && (
                    <div className="space-y-2">
                      {formData.additionalSpecs.map((spec, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Tên thông số"
                            value={spec.label}
                            onChange={(e) =>
                              handleAdditionalSpecChange(index, "label", e.target.value)
                            }
                            className="flex-1 rounded-xl"
                          />
                          <Input
                            placeholder="Giá trị"
                            value={spec.value}
                            onChange={(e) =>
                              handleAdditionalSpecChange(index, "value", e.target.value)
                            }
                            className="flex-1 rounded-xl"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAdditionalSpec(index)}
                            className="shrink-0 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="rounded-xl"
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 rounded-xl px-8">
                  {editingProduct ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
