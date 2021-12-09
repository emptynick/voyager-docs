<?php

namespace Emptynick\VoyagerDocs;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

use Voyager\Admin\Classes\{MenuItem, UserMenuItem};
use Voyager\Admin\Contracts\Plugins\GenericPlugin;
use Voyager\Admin\Contracts\Plugins\Features\Provider\{MenuItems, JS, ProtectedRoutes, Widgets};
use Voyager\Admin\Manager\Menu as MenuManager;

class VoyagerDocs implements GenericPlugin, ProtectedRoutes, MenuItems, JS, Widgets
{
    public $name = 'Voyager docs';
    public $description = 'Display the Voyager documentation directly in your admin panel';
    public $repository = 'emptynick/voyager-docs';
    public $website = 'https://github.com/emptynick/voyager-docs';

    private $mime_extensions = [
        'jpg'    => 'image/jpeg',
        'png'    => 'image/png',
    ];

    public function provideWidgets(): Collection
    {
        return collect([(new \Voyager\Admin\Classes\Widget('voyager-docs-widget', 'Documentation'))->parameters([
            'toc' => $this->getTOC(),
            'base' => Str::finish(route('voyager.voyager-docs'), '/')
        ])]);
    }

    public function provideProtectedRoutes(): void
    {
        Inertia::setRootView('voyager::app');

        Route::get('docs/{path?}', function ($path = 'introduction.md') {
            $relative = $path;
            $path = base_path('vendor/voyager-admin/voyager/docs/').$path;
            if (File::exists($path)) {
                $content = file_get_contents($path);

                if (Str::contains($path, '.gitbook')) {
                    $extension = Str::afterLast($path, '.');
                    $mime = $this->mime_extensions[$extension] ?? File::mimeType($path);

                    $response = response(File::get($path), 200, ['Content-Type' => $mime]);
                    $response->setSharedMaxAge(31536000);
                    $response->setMaxAge(31536000);
                    $response->setExpires(new \DateTime('+1 year'));

                    return $response;
                }

                $title = Str::after(Str::before($content, "\n"), '# ');

                return Inertia::render('voyager-docs', [
                    'title'     => $title,
                    'content'   => $content,
                    'toc'       => $this->getTOC(),
                    'path'      => Str::beforeLast(\Request::url(), '/').'/',
                    'base'      => Str::finish(route('voyager.voyager-docs'), '/'),
                    'page'      => $relative,
                ])->withViewData('title', $title);
            }

            abort(404);
        })->where('path', '.*')->name('voyager-docs');
    }

    public function provideJS(): string
    {
        return file_get_contents(realpath(dirname(__DIR__, 1).'/dist/voyager-docs.umd.js'));
    }

    public function provideMenuItems(MenuManager $menumanager): void
    {
        $menumanager->addItems(
            (new MenuItem())->divider(),
            (new MenuItem('Documentation', 'document-search'))->route('voyager.voyager-docs')
        );

        $menumanager->addItems(
            (new UserMenuItem('Documentation'))->route('voyager.voyager-docs')
        );
    }

    private function getTOC(): string
    {
        return Str::after(file_get_contents(base_path('vendor/voyager-admin/voyager/docs/summary.md')), "\n");
    }
}
