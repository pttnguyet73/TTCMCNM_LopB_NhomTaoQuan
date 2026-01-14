<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Gemini;
use Gemini\Data\GoogleSearch;
use Gemini\Data\Tool;
use Gemini\Data\GenerationConfig;

class ChatController extends Controller
{
    public function __invoke(Request $request)
    {
        $userMessage = $request->input('message');
        $reply = null;

        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'reply' => 'Thiếu API Key Gemini'
            ]);
        }

        try {
            // --- 1. Khởi tạo client ---
            $client = Gemini::client($apiKey);

            // --- 2. Tạo prompt ---
            $prompt = "Bạn là nhân viên tư vấn bán iPhone nhiệt tình tại iStore. " .
                      "Hãy tra cứu thông tin mới nhất trên Internet để tư vấn iPhone, iPad, MacBook, " .
                      "tính năng, giá cả và khuyến mãi. " .
                      "Chỉ trả lời ngắn gọn, dễ hiểu, không lan man. " .
                      "Câu hỏi khách hàng: " . $userMessage;

            // --- 3. Tạo config ---
            $config = new GenerationConfig(temperature: 0.7);

            // --- 4. Khởi tạo model ---
            $model = $client->generativeModel("gemini-2.5-flash")
                            ->withGenerationConfig($config);

            // --- 5. Thêm Google Search nếu tool được bật ---
            try {
                $model->withTool(new Tool(googleSearch: GoogleSearch::from()));
            } catch (\Throwable $toolException) {
                // Tool chưa được cấp quyền → log và continue mà không ném lỗi
                Log::warning('Google Search tool không khả dụng: ' . $toolException->getMessage());
            }

            // --- 6. Gọi Gemini ---
            $response = $model->generateContent($prompt);

            // --- 7. Lấy text trả về ---
            $reply = $response->text();

            if (!$reply) {
                $reply = "Xin lỗi, tôi không lấy được thông tin lúc này.";
            }

        } catch (\Throwable $e) {
            Log::error('Gemini API Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            $reply = "Xin lỗi, tôi gặp chút gián đoạn. Bạn thử lại sau nhé!";
        }

        return response()->json([
            'reply' => $reply
        ]);
    }
}