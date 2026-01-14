import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Plus, Search, Edit, Trash2, MoreVertical, Package, X, Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { ScrollArea } from '@radix-ui/react-scroll-area';

// Constants
const PRESET_COLORS = [
  { name: 'Đen', hex: '#000000' },
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Xám', hex: '#A9A9A9' },
  { name: 'Vàng', hex: '#FFD700' },
  { name: 'Hồng', hex: '#FF69B4' },
];

const PRESET_STORAGE = ['64GB', '128GB', '256GB', '512GB', '1TB'];

const REQUIRED_SPECS = [
  { label: 'Dung lượng', placeholder: 'VD: 128GB, 256GB' },
  { label: 'RAM', placeholder: 'VD: 8GB, 12GB' },
  { label: 'Màn hình', placeholder: 'VD: 6.1 inch' },
];

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

interface Spec {
  id?: number;
  label: string;
  value: string;
}

interface Color {
  id?: number;
  name: string;
  hex: string;
}

interface Storage {
  id?: number;
  storage: string;
}

interface ProductImage {
  id?: number;
  image_url: string;
  is_main: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  status: number;
  is_new: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  category_id: number;
  category?: Category;
  images?: ProductImage[];
  colors?: Color[];
  specs?: Spec[];
  storages?: Storage[];
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    original_price: '',
    price: '',
    status: '1',
    description: '',
    imageUrl: '',
    images: [] as string[],
    colors: [] as Color[],
    storage: [] as string[],
    customStorage: '',
    requiredSpecs: REQUIRED_SPECS.map((s) => ({ label: s.label, value: '' })),
    additionalSpecs: [] as Spec[],
    specs: [] as Spec[],
    rating: 5.0,
    review_count: 200,
  });
  const { toast } = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      console.log('Categories API response:', res.data);

      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi fetch danh mục:', err);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      const productList = Array.isArray(res.data) ? res.data : res.data.data || [];
      setProducts(productList);
    } catch (err) {
      console.error('Lỗi fetch sản phẩm:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Image handling
  const handleAddImageUrl = () => {
    if (formData.imageUrl?.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.imageUrl],
        imageUrl: '',
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Color handling
  const toggleColor = (color: Color) => {
    const exists = formData.colors.some((c) => c.hex === color.hex);
    setFormData((prev) => ({
      ...prev,
      colors: exists ? prev.colors.filter((c) => c.hex !== color.hex) : [...prev.colors, color],
    }));
  };

  // Storage handling
  const toggleStorage = (storage: string) => {
    const exists = formData.storage.includes(storage);
    setFormData((prev) => ({
      ...prev,
      storage: exists ? prev.storage.filter((s) => s !== storage) : [...prev.storage, storage],
    }));
  };

  const addCustomStorage = () => {
    if (formData.customStorage && !formData.storage.includes(formData.customStorage)) {
      setFormData((prev) => ({
        ...prev,
        storage: [...prev.storage, prev.customStorage],
        customStorage: '',
      }));
    }
  };

  const handleRequiredSpecChange = (index: number, value: string) => {
    const newSpecs = [...formData.requiredSpecs];
    newSpecs[index].value = value;
    setFormData({ ...formData, requiredSpecs: newSpecs });
  };

  const handleAddAdditionalSpec = () => {
    setFormData({
      ...formData,
      additionalSpecs: [...formData.additionalSpecs, { label: '', value: '' }],
    });
  };

  const handleRemoveAdditionalSpec = (index: number) => {
    setFormData({
      ...formData,
      additionalSpecs: formData.additionalSpecs.filter((_, i) => i !== index),
    });
  };

  const handleAdditionalSpecChange = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...formData.additionalSpecs];
    newSpecs[index][field] = value;
    setFormData({ ...formData, additionalSpecs: newSpecs });
  };

  // Handle form submit (Add / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category_id || !formData.original_price) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive',
      });
      return;
    }

    // Payload chính cho product
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price || formData.original_price),
      original_price: parseInt(formData.original_price),
      status: parseInt(formData.status),
      category_id: parseInt(formData.category_id),
      is_featured: false,
      is_new: false,
      rating: 5.0,
      review_count: 200,
    };

    try {
      // --- Thêm mới product ---
      const res = await api.post('/products', payload);
      const newProductId = res.data.id;

      // --- Thêm images ---
      if (formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          const image = formData.images[i];
          // Nếu là URL thì chỉ cần JSON
          await api.post('/product-images', {
            product_id: newProductId,
            image_url: image,
            is_main: i === 0 ? 1 : 0,
          });
        }
      }

      // --- Thêm colors ---
      if (formData.colors.length > 0) {
        for (const color of formData.colors) {
          await api.post('/product-colors', {
            product_id: newProductId,
            name: color.name,
            hex: color.hex,
          });
        }
      }

      // --- Thêm required specs ---
      for (const spec of formData.requiredSpecs) {
        if (spec.value) {
          await api.post('/product-specs', {
            product_id: newProductId,
            label: spec.label,
            value: spec.value,
          });
        }
      }

      // --- Thêm additional specs ---
      for (const spec of formData.additionalSpecs) {
        if (spec.label && spec.value) {
          await api.post('/product-specs', {
            product_id: newProductId,
            label: spec.label,
            value: spec.value,
          });
        }
      }

      // --- Thêm storage ---
      for (const storage of formData.storage) {
        await api.post('/product-storages', {
          product_id: newProductId,
          storage: storage,
        });
      }
      console.table(formData.images);

      // --- Reload products và toast thành công ---
      fetchProducts();
      toast({
        title: 'Thành công',
        description: 'Thêm sản phẩm mới thành công',
      });

      // Reset form
      setIsAddDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (error: any) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      toast({ title: 'Lỗi', description: 'Thao tác thất bại', variant: 'destructive' });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      original_price: '',
      price: '',
      status: '1',
      description: '',
      imageUrl: '',
      images: [],
      colors: [],
      storage: [],
      customStorage: '',
      requiredSpecs: REQUIRED_SPECS.map((s) => ({ label: s.label, value: '' })),
      additionalSpecs: [],
      specs: [],
      rating: 5.0,
      review_count: 200,
    });
  };

  // Open dialog for Add
  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Open dialog for Edit
  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id.toString(),
      original_price: product.original_price.toString(),
      price: product.price.toString(),
      status: product.status.toString(),
      description: product.description,
      imageUrl: '',
      images: product.images?.map((img) => img.image_url) || [],
      colors: product.colors || [],
      storage: product.storages?.map((s) => s.storage) || [],
      customStorage: '',
      requiredSpecs: REQUIRED_SPECS.map((s) => ({ label: s.label, value: '' })),
      additionalSpecs: [],
      specs: product.specs || [],
      rating: product.rating,
      review_count: product.review_count,
    });
    setIsAddDialogOpen(true);
  };

  // Delete product
  const handleDelete = async (productId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({ title: 'Đã xóa', description: 'Sản phẩm đã được xóa khỏi danh sách' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Lỗi', description: 'Xóa sản phẩm thất bại', variant: 'destructive' });
    }
  };

  // Filter products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false),
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
              <p className="text-2xl font-bold">{products.filter((p) => p.status > 0).length}</p>
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
              <p className="text-2xl font-bold">{products.filter((p) => p.status === 0).length}</p>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Sản phẩm
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Danh mục
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Giá
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Đánh giá
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Trạng thái
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Thao tác
                  </th>
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
                          <img
                            src={product.images?.[0]?.image_url || 'https://via.placeholder.com/50'}
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
                      <td className="py-3 px-4 text-sm">{product.category?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span>{product.rating}</span>
                          <span className="text-muted-foreground">
                            ({product.review_count ?? 0})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.status > 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {product.status > 0 ? 'Còn hàng' : 'Hết hàng'}
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
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(product.id)}
                            >
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
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-accent">
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 pr-4">
            <form onSubmit={handleSubmit} className="space-y-6 pr-2">
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
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image URL Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Hình ảnh sản phẩm</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)"
                    className="rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={!formData.imageUrl?.trim()}
                    className="rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm
                  </Button>
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
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    placeholder="29.990.000"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice" className="text-sm font-medium">
                    Giá bán (VNĐ)
                  </Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Để trống nếu không khác"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Trạng thái
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Còn hàng</SelectItem>
                      <SelectItem value="0">Hết hàng</SelectItem>
                    </SelectContent>
                  </Select>
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
                            isSelected
                              ? 'border-accent scale-110'
                              : 'border-border hover:border-accent/50'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isSelected && (
                            <Check
                              className={`absolute inset-0 m-auto h-4 w-4 ${
                                color.hex === '#FFFFFF' || color.hex === '#FFD700'
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {formData.colors.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Đã chọn: {formData.colors.map((c) => c.name).join(', ')}
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
                              ? 'bg-accent text-white'
                              : 'bg-background border border-border hover:border-accent'
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
                        placeholder={REQUIRED_SPECS[index]?.placeholder || 'Nhập giá trị'}
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
                              handleAdditionalSpecChange(index, 'label', e.target.value)
                            }
                            className="flex-1 rounded-xl"
                          />
                          <Input
                            placeholder="Giá trị"
                            value={spec.value}
                            onChange={(e) =>
                              handleAdditionalSpecChange(index, 'value', e.target.value)
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
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
