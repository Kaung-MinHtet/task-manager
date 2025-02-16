<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::where('user_id', Auth::id());

        // Filtering by status
        if ($request->has('status')) {
            $query->where('is_completed', $request->status === 'completed');
        }

        // Sorting by due_date or priority
        if ($request->has('sort')) {
            $query->orderBy($request->sort, 'asc');
        }

        // Fetch tasks and modify due_date
        $tasks = $query->get()->map(function ($task) {
            $task->due_date_human = Carbon::parse($task->due_date)->diffForHumans();
            return $task;
        });

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'in:Low,Medium,High',
            'category' => 'nullable|string',
        ]);

        $task = Task::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'priority' => $request->priority ?? 'Medium',
            'is_completed' => false,
            'category' => $request->category,
        ]);

        return response()->json($task, 201);
    }

    public function show($id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);

        $task->update($request->only(['title', 'description', 'due_date', 'priority', 'category']));

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function toggleComplete($id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        $task->is_completed = !$task->is_completed;
        $task->save();

        return response()->json($task);
    }
}
