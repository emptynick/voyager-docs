<?php

namespace Voyager\GenericBoilerplate;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\View\View;
use Voyager\Admin\Contracts\Plugins\GenericPlugin;

class ThemeBoilerplate implements ThemePlugin
{
    public $name = 'Generic boilerplate';
    public $description = 'A boilerplate for a generic Voyager II plugin';
    public $repository = 'voyager-admin/generic-boilerplate';
    public $website = 'https://github.com/voyager-admin/generic-boilerplate';
    public $version = '1.0.0';

    public function getInstructionsView(): ?View
    {
        return null;
    }

    public function registerProtectedRoutes()
    {
        //
    }

    public function registerPublicRoutes()
    {
        
    }

    public function getSettingsView(): ?View
    {
        return null;
    }
}
