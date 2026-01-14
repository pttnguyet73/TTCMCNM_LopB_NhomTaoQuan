<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class CustomerExportController extends Controller
{
    public function export()
    {
        $customers = User::query()
            ->where('users.role', 'user')
            ->leftJoin('orders', 'orders.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                'users.email',
                'users.phone',
                DB::raw('COUNT(orders.id) AS order_count'),
                DB::raw('COALESCE(SUM(orders.total_amount), 0) AS total_spent')
            )
            ->groupBy('users.id', 'users.name', 'users.email', 'users.phone')
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $headers = [
            'A1' => 'ID',
            'B1' => 'Tên',
            'C1' => 'Email',
            'D1' => 'SĐT',
            'E1' => 'Số đơn',
            'F1' => 'Tổng chi tiêu',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Data
        $row = 2;
        foreach ($customers as $c) {
            $sheet->setCellValue("A{$row}", $c->id);
            $sheet->setCellValue("B{$row}", $c->name);
            $sheet->setCellValue("C{$row}", $c->email);
            $sheet->setCellValue("D{$row}", $c->phone);
            $sheet->setCellValue("E{$row}", $c->order_count);
            $sheet->setCellValue("F{$row}", $c->total_spent);
            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $fileName = 'customers.xlsx';
        $tempPath = storage_path("app/{$fileName}");
        $writer->save($tempPath);

        return response()->download($tempPath)->deleteFileAfterSend(true);
    }
}
