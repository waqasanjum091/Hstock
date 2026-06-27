<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $settings = Setting::all();
        $result = [];
        foreach ($settings as $setting) {
            $result[$setting->key] = $setting->value;
        }
        return response()->json($result);
    }

    public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|string|unique:settings,key',
            'value' => 'required|string',
        ]);

        $setting = Setting::create([
            'key' => $request->key,
            'value' => $request->value,
        ]);

        return response()->json([
            'message' => 'Setting created successfully',
            'setting' => $setting,
        ], 201);
    }

    public function update(Request $request, $key)
    {
        $request->validate([
            'value' => 'required|string',
        ]);

        $setting = Setting::where('key', $key)->firstOrFail();
        $setting->update(['value' => $request->value]);

        return response()->json([
            'message' => 'Setting updated successfully',
            'setting' => $setting,
        ]);
    }
}
