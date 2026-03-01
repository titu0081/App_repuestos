<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max((int)$request->query('per_page',10),1),100);

        return response()->json(
            Client::orderByDesc('id')->paginate($perPage)
        );
    }

    public function show(int $id)
    {
        $client = Client::find($id);

        if(!$client){
            return response()->json(['message'=>'Client not found'],404);
        }

        return response()->json($client);
    }

    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->validated());
        return response()->json($client,201);
    }

    public function update(UpdateClientRequest $request,int $id)
    {
        $client = Client::find($id);

        if(!$client){
            return response()->json(['message'=>'Client not found'],404);
        }

        $client->update($request->validated());

        return response()->json($client);
    }

    public function destroy(int $id)
    {
        $client = Client::find($id);

        if(!$client){
            return response()->json(['message'=>'Client not found'],404);
        }

        $client->delete();

        return response()->json(['message'=>'Client deleted']);
    }

    public function search(Request $request)
    {
        $perPage = min(max((int)$request->query('per_page',10),1),100);

        $query = Client::query();

        if($request->filled('name')){
            $query->where('name','like','%'.$request->name.'%');
        }

        if($request->filled('identifier')){
            $query->where('identifier','like','%'.$request->identifier.'%');
        }

        return response()->json(
            $query->orderByDesc('id')->paginate($perPage)
        );
    }
}