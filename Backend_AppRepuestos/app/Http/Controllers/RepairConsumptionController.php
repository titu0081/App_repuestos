<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRepairConsumptionRequest;
use App\Http\Requests\UpdateRepairConsumptionRequest;
use App\Models\RepairConsumption;
use Illuminate\Http\Request;
use App\Models\InventoryMovement;
use Illuminate\Support\Facades\DB;

class RepairConsumptionController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        return response()->json(
            RepairConsumption::with(['repair', 'part', 'createdBy'])
                ->orderByDesc('id')
                ->paginate($perPage)
        );
    }

    public function show(int $id)
    {
        $consumption = RepairConsumption::with(['repair', 'part', 'createdBy'])->find($id);

        if (!$consumption) {
            return response()->json(['message' => 'RepairConsumption not found'], 404);
        }

        return response()->json($consumption);
    }

    public function store(StoreRepairConsumptionRequest $request)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data) {

            //Validar stock disponible para la parte solicitada
            $in = InventoryMovement::where('part_id', $data['part_id'])
                ->where('type', 'in')
                ->sum('quantity');

            $out = InventoryMovement::where('part_id', $data['part_id'])
                ->where('type', 'out')
                ->sum('quantity');

            $adj = InventoryMovement::where('part_id', $data['part_id'])
                ->where('type', 'adjustment')
                ->sum('quantity');

            $stock = ($in + $adj) - $out;

            if ($data['quantity'] > $stock) {
                return response()->json([
                    'message' => 'Insufficient stock',
                    'errors' => [
                        'quantity' => ["Cantidad Solicitada {$data['quantity']} Se cuenta con {$stock} disponible."]
                    ],
                ], 422);
            }

            // Crear el registro de consumo de reparación
            $consumption = \App\Models\RepairConsumption::create($data);

            // Creacion del movimiento tipo out en inventory_movements
            InventoryMovement::create([
                'part_id' => $data['part_id'],
                'type' => 'out',
                'quantity' => $data['quantity'],
                'performed_by_user_id' => $data['created_by_user_id'],
                'performed_at' => now(),
                'notes' => 'Auto OUT by repair_consumption ID ' . $consumption->id .
                        ' (repair_id=' . $data['repair_id'] . ')',
            ]);

            return response()->json($consumption, 201);
        });
    }

    public function update(UpdateRepairConsumptionRequest $request, int $id)
    {
        $consumption = RepairConsumption::find($id);

        if (!$consumption) {
            return response()->json(['message' => 'RepairConsumption not found'], 404);
        }

        $consumption->update($request->validated());
        return response()->json($consumption);
    }

    public function destroy(int $id)
    {
        $consumption = RepairConsumption::find($id);

        if (!$consumption) {
            return response()->json(['message' => 'RepairConsumption not found'], 404);
        }

        $consumption->delete();
        return response()->json(['message' => 'RepairConsumption deleted']);
    }

    // Búsqueda avanzada
    public function search(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        $query = RepairConsumption::query();

        if ($request->filled('repair_id')) {
            $query->where('repair_id', $request->query('repair_id'));
        }

        if ($request->filled('part_id')) {
            $query->where('part_id', $request->query('part_id'));
        }

        if ($request->filled('created_by_user_id')) {
            $query->where('created_by_user_id', $request->query('created_by_user_id'));
        }

        return response()->json(
            $query->with(['repair', 'part', 'createdBy'])
                  ->orderByDesc('id')
                  ->paginate($perPage)
        );
    }
}