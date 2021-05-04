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
}