<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $filters = $request->only(['name', 'email', 'role']);

        $users = User::latest()
            ->filter($filters)
            ->paginate(10)
            ->withQueryString(); // supaya pagination kekalkan query

        return Inertia::render('admin/user/index', [
            'users' => $users,
            'filters' => $filters, // optional kalau nak bagi semula ke frontend
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load([
            'orders' => fn($q) => $q->latest()->with([
                'items.product' => fn($q) => $q->select('id', 'name', 'image_path', 'price'),
            ]),
        ]);

        $totalSpent = $user->orders->sum('total_price');
        $totalOrders = $user->orders->count();
        $completedOrders = $user->orders->whereIn('status', ['shipped', 'paid'])->count();

        return Inertia::render('admin/user/show', [
            'user' => $user,
            'totalSpent' => $totalSpent,
            'totalOrders' => $totalOrders,
            'completedOrders' => $completedOrders,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id), // Unique tapi ignore current
            ],
            'role' => ['required', Rule::in(['user', 'staff', 'admin'])],
        ]);

        // dd($validated);

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
