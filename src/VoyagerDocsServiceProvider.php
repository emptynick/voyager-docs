<?php

namespace Emptynick\VoyagerDocs;

use Illuminate\Support\ServiceProvider;
use Voyager\Admin\Manager\Plugins as PluginManager;

class VoyagerDocsServiceProvider extends ServiceProvider
{
    public function boot(PluginManager $pluginmanager)
    {
        $pluginmanager->addPlugin(\Emptynick\VoyagerDocs\VoyagerDocs::class);
    }

    public function register()
    {
        $this->loadViewsFrom(realpath(__DIR__.'/../resources/views'), 'voyager-docs');
    }
}