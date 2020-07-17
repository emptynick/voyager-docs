<?php

namespace Voyager\GenericBoilerplate;

use Illuminate\Support\ServiceProvider;
use Voyager\Admin\Manager\Plugins as PluginManager;

class GenericBoilerplateServiceProvider extends ServiceProvider
{
    public function boot(PluginManager $pluginmanager)
    {
        $pluginmanager->addPlugin(\Voyager\GenericBoilerplate\GenericBoilerplate::class);
    }

    public function register()
    {
        //
    }
}