<?php

namespace App\Http\Controllers;

use App\Events\WebRTCOffer;
use App\Events\Answer;
use App\Events\WebRTCIceCandidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WebRTCController extends Controller
{
    public function sendOffer(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'offer' => 'required|array'
        ]);

        $fromUserId = Auth::id();
        $toUserId = $request->receiver_id;
        $offer = $request->offer;


        broadcast(new WebRTCOffer($toUserId, $offer, $fromUserId));

        return response()->json([
            'success' => true,
            'message' => 'Offer sent successfully'
        ]);
    }

    public function sendAnswer(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'answer' => 'required|array'
        ]);

        $fromUserId = Auth::id();
        $toUserId = $request->receiver_id;
        $answer = $request->answer;


        broadcast(new Answer($toUserId, $answer, $fromUserId));

        return response()->json([
            'success' => true,
            'message' => 'Answer sent successfully'
        ]);
    }
    public function sendIceCandidate(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'candidate' => 'required|array'
        ]);

        $fromUserId = Auth::id();
        $toUserId = $request->receiver_id;
        $candidate = $request->candidate;


        broadcast(new WebRTCIceCandidate($toUserId, $candidate, $fromUserId));

        return response()->json([
            'success' => true,
            'message' => 'ICE candidate sent successfully'
        ]);
    }
}