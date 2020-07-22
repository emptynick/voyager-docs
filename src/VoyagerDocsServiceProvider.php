<?php

namespace Emptynick\VoyagerDocs;

use Illuminate\Support\ServiceProvider;
use Voyager\Admin\Classes\MenuItem;
use Voyager\Admin\Manager\Plugins as PluginManager;
use Voyager\Admin\Manager\Menu as MenuManager;

class VoyagerDocsServiceProvider extends ServiceProvider
{
    public function boot(PluginManager $pluginmanager, MenuManager $menumanager)
    {
        $pluginmanager->addPlugin(\Emptynick\VoyagerDocs\VoyagerDocs::class);
        $menumanager->addItems(
            (new MenuItem('', ''))->divider(),
            (new MenuItem('Documentation', 'document'))->route('voyager-docs')
        );
    }

    public function register()
    {
        $this->loadViewsFrom(realpath(__DIR__.'/../resources/views'), 'voyager-docs');
    }
}