<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryMovementRequest;
use App\Http\Requests\UpdateInventoryMovementRequest;
use App\Models\InventoryMovement;
use Illuminate\Http\Request;

class InventoryMovementController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        return response()->json(
            InventoryMovement::with(['part', 'performedBy'])
                ->orderByDesc('id')
                ->paginate($perPage)
        );
    }

    public function show(int $id)
    {
        $movement = InventoryMovement::with(['part', 'performedBy'])->find($id);

        if (!$movement) {
            return response()->json(['message' => 'InventoryMovement not found'], 404);
        }

        return response()->json($movement);
    }

    public function store(StoreInventoryMovementRequest $request)
    {
        $movement = InventoryMovement::create($request->validated());
        return response()->json($movement, 201);
    }

    public function update(UpdateInventoryMovementRequest $request, int $id)
    {
        $movement = InventoryMovement::find($id);

        if (!$movement) {
            return response()->json(['message' => 'InventoryMovement not found'], 404);
        }

        $movement->update($request->validated());
        return response()->json($movement);
    }

    public function destroy(int $id)
    {
        $movement = InventoryMovement::find($id);

        if (!$movement) {
            return response()->json(['message' => 'InventoryMovement not found'], 404);
        }

        $movement->delete();
        return response()->json(['message' => 'InventoryMovement deleted']);
    }

    // Búsqueda avanzada (por campos)
    public function search(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        $query = InventoryMovement::query();

        if ($request->filled('part_id')) {
            $query->where('part_id', $request->query('part_id'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        if ($request->filled('performed_by_user_id')) {
            $query->where('performed_by_user_id', $request->query('performed_by_user_id'));
        }

        if ($request->filled('from')) {
            $query->where('performed_at', '>=', $request->query('from'));
        }

        if ($request->filled('to')) {
            $query->where('performed_at', '<=', $request->query('to'));
        }

        return response()->json(
            $query->with(['part', 'performedBy'])
                  ->orderByDesc('id')
                  ->paginate($perPage)
        );
    }
}