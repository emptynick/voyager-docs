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

        Route::get('docs/{path?}', function ($path = 'index.md') {
            $relative = Str::finish($path, '.md');
            if (Str::contains($path, 'public')) {
                $relative = $path;
            }
            $path = base_path('vendor/voyager-admin/voyager/docs/').$relative;

            if (!File::exists($path) && File::isDirectory(Str::beforeLast($path, '.md'))) {
                $folder = Str::beforeLast($path, '.md');

                if (File::exists($folder.'/index.md')) {
                    $path = $folder.'/index.md';
                }
            }
    
            if (File::exists($path)) {
                $content = file_get_contents($path);

                if (Str::contains($path, 'public')) {
                    $path = Str::beforeLast($path, '.md');
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
            (new MenuItem('Documentation', 'document-magnifying-glass'))->route('voyager.voyager-docs')
        );

        $menumanager->addItems(
            (new UserMenuItem('Documentation'))->route('voyager.voyager-docs')
        );
    }

    private function getTOC(): mixed
    {
        return json_decode(file_get_contents(base_path('vendor/voyager-admin/voyager/docs/.vitepress/sidebar.json')));
    }
}
