<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Gemini;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function __invoke(Request $request)
    {
        $userMessage = $request->input('message');
        $reply = null;

        // Lấy API Key từ .env
        $apiKey = env('GEMINI_API_KEY');

        if ($apiKey) {
            try {
                $client = Gemini::client($apiKey);

                // Gemini sử dụng phương thức chat()->startChat() để giữ ngữ cảnh 
                // hoặc generateContent() cho câu hỏi đơn lẻ.
                // Ở đây ta thêm phần 'system instruction' trực tiếp vào prompt để Gemini hiểu vai trò.

                $prompt = "Bạn là nhân viên tư vấn bán iPhone, ipad, mac nhiệt tình tại iStore. " .
                          "Hãy tư vấn các dòng iPhone. ipad, mac, tính năng, giá cả, và khuyến mãi. " .
                          "Chỉ trả lời ngắn gọn, dễ hiểu, không lan man. " .
                          "Câu hỏi khách hàng: " . $userMessage;

                $response = $client->generativeModel("gemini-2.5-flash")->generateContent($prompt);

                $reply = $response->text();

            } catch (\Exception $e) {
                Log::error('Gemini API error: ' . $e->getMessage());
                $reply = "Xin lỗi, tôi gặp chút gián đoạn. Bạn thử lại sau nhé!";
            }
        }

        return response()->json([
            'reply' => $reply
        ]);
    }
}
