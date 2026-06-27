<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $conversations = Conversation::with(['participants', 'lastMessage.sender'])
            ->whereHas('participants', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            })
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($conversations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'participant_id' => 'required|exists:users,id',
            'subject' => 'nullable|string|max:255',
        ]);

        $existingConversation = Conversation::whereHas('participants', function ($q) use ($request) {
            $q->where('user_id', $request->user()->id);
        })->whereHas('participants', function ($q) use ($request) {
            $q->where('user_id', $request->participant_id);
        })->first();

        if ($existingConversation) {
            return response()->json($existingConversation->load(['participants', 'lastMessage.sender']));
        }

        $conversation = Conversation::create(['subject' => $request->subject]);

        $conversation->participants()->attach($request->user()->id);
        $conversation->participants()->attach($request->participant_id);

        return response()->json($conversation->load(['participants', 'lastMessage.sender']), 201);
    }

    public function show(Request $request, Conversation $conversation)
    {
        if (!$conversation->participants->contains($request->user()->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = Message::with('sender')
            ->where('conversation_id', $conversation->id)
            ->orderBy('created_at', 'asc')
            ->paginate(50);

        return response()->json([
            'conversation' => $conversation->load(['participants', 'lastMessage.sender']),
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request, Conversation $conversation)
    {
        if (!$conversation->participants->contains($request->user()->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'body' => 'required|string',
            'attachment' => 'nullable|string',
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $request->user()->id,
            'body' => $request->body,
            'attachment' => $request->attachment,
        ]);

        $conversation->update(['last_message_id' => $message->id]);

        return response()->json($message->load('sender'), 201);
    }

    public function markRead(Request $request, Conversation $conversation)
    {
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $conversation->participants()->updateExistingPivot(
            $request->user()->id,
            ['last_read_at' => now()]
        );

        return response()->json(['message' => 'Messages marked as read']);
    }

    public function unreadCount(Request $request)
    {
        $count = Message::whereHas('conversation', function ($q) use ($request) {
            $q->whereHas('participants', function ($q2) use ($request) {
                $q2->where('user_id', $request->user()->id);
            });
        })->where('sender_id', '!=', $request->user()->id)
          ->where('is_read', false)
          ->count();

        return response()->json(['unread_count' => $count]);
    }
}
