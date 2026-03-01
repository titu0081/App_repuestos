<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRepairRequest;
use App\Http\Requests\UpdateRepairRequest;
use App\Models\Repair;
use Illuminate\Http\Request;

class RepairController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        return response()->json(
            Repair::with(['device', 'technician'])
                ->orderByDesc('id')
                ->paginate($perPage)
        );
    }

    public function show(int $id)
    {
        $repair = Repair::with(['device', 'technician'])->find($id);

        if (!$repair) {
            return response()->json(['message' => 'Repair not found'], 404);
        }

        return response()->json($repair);
    }

    public function store(StoreRepairRequest $request)
    {
        $repair = Repair::create($request->validated());
        return response()->json($repair, 201);
    }

    public function update(UpdateRepairRequest $request, int $id)
    {
        $repair = Repair::find($id);

        if (!$repair) {
            return response()->json(['message' => 'Repair not found'], 404);
        }

        $repair->update($request->validated());
        return response()->json($repair);
    }

    public function destroy(int $id)
    {
        $repair = Repair::find($id);

        if (!$repair) {
            return response()->json(['message' => 'Repair not found'], 404);
        }

        $repair->delete();
        return response()->json(['message' => 'Repair deleted']);
    }

    // Búsqueda avanzada por campos
    public function search(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        $query = Repair::query();

        if ($request->filled('device_id')) {
            $query->where('device_id', $request->query('device_id'));
        }

        if ($request->filled('technician_user_id')) {
            $query->where('technician_user_id', $request->query('technician_user_id'));
        }

        if ($request->filled('started_from')) {
            $query->where('started_at', '>=', $request->query('started_from'));
        }

        if ($request->filled('started_to')) {
            $query->where('started_at', '<=', $request->query('started_to'));
        }

        return response()->json(
            $query->with(['device', 'technician'])
                  ->orderByDesc('id')
                  ->paginate($perPage)
        );
    }
}
