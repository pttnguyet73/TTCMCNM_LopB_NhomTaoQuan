import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const PrivacyPolicy = () => {
  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">
          CHÍNH SÁCH QUYỀN RIÊNG TƯ
        </h1>

        <p className="mb-4">
          Ứng dụng của chúng tôi sử dụng đăng nhập bằng Facebook để xác thực người dùng.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">
          Thông tin thu thập
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Họ tên</li>
          <li>Email</li>
          <li>Ảnh đại diện Facebook</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-2">
          Mục đích sử dụng
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Xác thực tài khoản</li>
          <li>Cung cấp dịch vụ cho người dùng</li>
        </ul>

        <p className="mb-4 font-medium">
          Chúng tôi <span className="text-red-600">KHÔNG</span> chia sẻ dữ liệu người dùng cho bên thứ ba.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">
          Liên hệ
        </h2>
        <p>
          Email:&nbsp;
          <a
            href="mailto:support@yourdomain.com"
            className="text-blue-600 hover:underline"
          >
            support@yourdomain.com
          </a>
        </p>
      </main>

      <Footer />
    </>
  );
};
