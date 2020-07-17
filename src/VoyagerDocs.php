<?php

namespace Emptynick\VoyagerDocs;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\View\View;
use Voyager\Admin\Contracts\Plugins\GenericPlugin;

class VoyagerDocs implements GenericPlugin
{
    public $name = 'Voyager docs';
    public $description = 'Display the Voyager documentation directly in the UI';
    public $repository = 'emptynick/voyager-docs';
    public $website = 'https://github.com/emptynick/voyager-docs';
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
