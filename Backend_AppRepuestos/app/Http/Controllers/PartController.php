<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePartRequest;
use App\Http\Requests\UpdatePartRequest;
use App\Models\Part;
use Illuminate\Http\Request;
use App\Models\InventoryMovement;

class PartController extends Controller
{
    // GET /api/parts?page=1
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = max(1, min($perPage, 100)); // evita abusos

        $parts = Part::query()
            ->orderBy('id', 'desc')
            ->paginate($perPage);

        return response()->json($parts);
    }

    // GET /api/parts/{id}
    public function show(int $id)
    {
        $part = Part::find($id);

        if (!$part) {
            return response()->json(['message' => 'Part not found'], 404);
        }

        return response()->json($part);
    }

    // POST /api/parts
    public function store(StorePartRequest $request)
    {
        $part = Part::create($request->validated());
        return response()->json($part, 201);
    }

    // PATCH /api/parts/{id}
    public function update(UpdatePartRequest $request, int $id)
    {
        $part = Part::find($id);

        if (!$part) {
            return response()->json(['message' => 'Part not found'], 404);
        }

        $part->fill($request->validated());
        $part->save();

        return response()->json($part);
    }

    // DELETE /api/parts/{id} (soft delete)
    public function destroy(int $id)
    {
        $part = Part::find($id);

        if (!$part) {
            return response()->json(['message' => 'Part not found'], 404);
        }

        $part->delete();

        return response()->json(['message' => 'Part deleted']);
    }

    // GET /api/parts/search?sku=...&name=...&q=...
    public function search(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = max(1, min($perPage, 100));

        $query = Part::query();

        // búsqueda avanzada por campos (lo que pide la actividad)
        $query->when($request->filled('sku'), fn ($q) => $q->where('sku', 'like', '%'.$request->query('sku').'%'));
        $query->when($request->filled('name'), fn ($q) => $q->where('name', 'like', '%'.$request->query('name').'%'));
        $query->when($request->filled('description'), fn ($q) => $q->where('description', 'like', '%'.$request->query('description').'%'));

        // opcional (punto extra): búsqueda libre en todos los campos
        $query->when($request->filled('q'), function ($q) use ($request) {
            $term = $request->query('q');
            $q->where(function ($qq) use ($term) {
                $qq->where('sku', 'like', "%{$term}%")
                   ->orWhere('name', 'like', "%{$term}%")
                   ->orWhere('description', 'like', "%{$term}%");
            });
        });

        return response()->json(
            $query->orderBy('id', 'desc')->paginate($perPage)
        );
    }

    public function stock(int $id)
    {
        $in = InventoryMovement::where('part_id', $id)
            ->where('type', 'in')
            ->sum('quantity');

        $out = InventoryMovement::where('part_id', $id)
            ->where('type', 'out')
            ->sum('quantity');

        $adjustment = InventoryMovement::where('part_id', $id)
            ->where('type', 'adjustment')
            ->sum('quantity');

        $stock = ($in + $adjustment) - $out;

        return response()->json([
            'part_id' => $id,
            'stock' => (int) $stock,
        ]);
    }
}

    
