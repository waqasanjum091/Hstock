<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $vendorRole = Role::firstOrCreate(['name' => 'vendor']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);

        // Create a default super admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@marketplace.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
            ]
        );
        $superAdmin->assignRole($superAdminRole);
        
        // Create a default vendor user
        $vendor = User::firstOrCreate(
            ['email' => 'vendor@marketplace.com'],
            [
                'name' => 'Vendor Test',
                'password' => Hash::make('password'),
            ]
        );
        $vendor->assignRole($vendorRole);
        
        // Create a default customer user
        $customer = User::firstOrCreate(
            ['email' => 'customer@marketplace.com'],
            [
                'name' => 'Customer Test',
                'password' => Hash::make('password'),
            ]
        );
        $customer->assignRole($customerRole);
    }
}
