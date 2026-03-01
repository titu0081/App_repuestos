<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Http\Requests\StoreDeviceRequest;
use App\Http\Requests\UpdateDeviceRequest;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max((int)$request->query('per_page',10),1),100);

        return response()->json(
            Device::with(['client','receivedBy'])
                ->orderByDesc('id')
                ->paginate($perPage)
        );
    }

    public function show(int $id)
    {
        $device = Device::with(['client','receivedBy'])->find($id);

        if(!$device){
            return response()->json(['message'=>'Device not found'],404);
        }

        return response()->json($device);
    }

    public function store(StoreDeviceRequest $request)
    {
        $device = Device::create($request->validated());
        return response()->json($device,201);
    }

    public function update(UpdateDeviceRequest $request,int $id)
    {
        $device = Device::find($id);

        if(!$device){
            return response()->json(['message'=>'Device not found'],404);
        }

        $device->update($request->validated());

        return response()->json($device);
    }

    public function destroy(int $id)
    {
        $device = Device::find($id);

        if(!$device){
            return response()->json(['message'=>'Device not found'],404);
        }

        $device->delete();

        return response()->json(['message'=>'Device deleted']);
    }

    public function search(Request $request)
    {
        $perPage = min(max((int)$request->query('per_page',10),1),100);

        $query = Device::query();

        if($request->filled('model')){
            $query->where('model','like','%'.$request->model.'%');
        }

        if($request->filled('status')){
            $query->where('status',$request->status);
        }

        if($request->filled('serial_number')){
            $query->where('serial_number','like','%'.$request->serial_number.'%');
        }

        return response()->json(
            $query->with(['client','receivedBy'])
                  ->orderByDesc('id')
                  ->paginate($perPage)
        );
    }
}