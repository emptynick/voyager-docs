<?php

namespace Emptynick\VoyagerDocs;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

use Voyager\Admin\Classes\MenuItem;
use Voyager\Admin\Contracts\Plugins\GenericPlugin;
use Voyager\Admin\Contracts\Plugins\Features\Provider\MenuItems;
use Voyager\Admin\Contracts\Plugins\Features\Provider\JS;
use Voyager\Admin\Contracts\Plugins\Features\Provider\ProtectedRoutes;
use Voyager\Admin\Manager\Menu as MenuManager;

class VoyagerDocs implements GenericPlugin, ProtectedRoutes, MenuItems, JS
{
    public $name = 'Voyager docs';
    public $description = 'Display the Voyager documentation directly in your admin panel';
    public $repository = 'emptynick/voyager-docs';
    public $website = 'https://github.com/emptynick/voyager-docs';

    private $mime_extensions = [
        'jpg'    => 'image/jpeg',
        'png'    => 'image/png',
    ];

    public function provideProtectedRoutes(): void
    {
        Inertia::setRootView('voyager::app');

        Route::get('docs', function (Request $request) {
            Event::dispatch('voyager.page');
            $path = $request->get('path', 'introduction.md');
            $currentPath = $path;
            $path = str_replace('/', DIRECTORY_SEPARATOR, Str::start(urldecode($path), '/'));

            if (Str::contains($path, '..')) {
                abort(404);
            }

            $path = base_path('vendor/voyager-admin/voyager/docs').$path;

            if (File::exists($path)) {
                $content = file_get_contents($path);
                $title = Str::after(Str::before($content, "\n"), '# ');
                $content = $this->parseHTML(Str::markdown(Str::after($content, "\n")), true);
                $toc = $this->parseSummary(Str::markdown(Str::after(file_get_contents(base_path('vendor/voyager-admin/voyager/docs/summary.md')), "\n")));

                return Inertia::render('voyager-docs', [
                    'title'     => $title,
                    'content'   => $content,
                    'toc'       => $toc,
                    'path'      => $request->get('path', 'introduction.md'),
                    'current'   => $currentPath,
                ])->withViewData('title', $title);
            }

            abort(404);
        })->name('voyager-docs');

        Route::get('docs-asset', function (Request $request) {
            $path = $request->get('path', '');
            $path = str_replace('/', DIRECTORY_SEPARATOR, Str::start(urldecode($path), '/'));
            $start = Str::beforeLast(urldecode($path), DIRECTORY_SEPARATOR);
            $path = base_path('vendor/voyager-admin/voyager/docs/.gitbook/assets').$path;

            if (File::exists($path)) {
                $extension = Str::afterLast($path, '.');
                $mime = $this->mime_extensions[$extension] ?? File::mimeType($path);

                $response = response(File::get($path), 200, ['Content-Type' => $mime]);
                $response->setSharedMaxAge(31536000);
                $response->setMaxAge(31536000);
                $response->setExpires(new \DateTime('+1 year'));

                return $response;
            }

            abort(404);
        })->name('voyager-docs-asset');
    }

    public function provideJS(): string
    {
        return file_get_contents(realpath(dirname(__DIR__, 1).'/dist/voyager-docs.umd.js'));
    }

    public function provideMenuItems(MenuManager $menumanager): void
    {
        $item = (new MenuItem('Documentation', 'document-search'))->route('voyager.voyager-docs');

        $menumanager->addItems(
            (new MenuItem())->divider(),
            $item
        );
    }

    private function parseHTML($content, $relative = true)
    {
        // Smallen heading
        $content = str_replace(['<h1>', '<h2>', '<h3>'], ['<h1 class="mb-2 mt-4">', '<h2 class="mb-2 mt-4">', '<h3 class="mb-2 mt-4">'], $content);
        // Replace links

        // Replace tables
        $content = str_replace(['<table>', '</table>'], ['<div class="voyager-table"><table>', '</table></div>'], $content);

        return $content;
    }

    private function parseSummary($content)
    {
        $xml = simplexml_load_string('<div>'.$content.'</div>');
        $array = [];
        $lastMain = '';
        foreach ($xml->children() as $node) {
            if (in_array($node->getName(), ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])) {
                $array[(string) $node] = [];
                $lastMain = (string) $node;
            } else {
                $array[$lastMain] = $this->ulToArray($node);
            }
        }
        
        return $array;
    }

    private function ulToArray($ul)
    {
        $array = [];
        if ($ul->getName() == 'ul') {
            foreach ($ul->children() as $node) {
                if (count($node->children()) > 1) {
                    $array[(string) $node->children()[0]] = $this->ulToArray($node->children()[1]);
                } else {
                    $array[] = [
                        'title' => (string) $node->children()[0],
                        'href'  => (string) $node->children()[0]->attributes()['href']
                    ];
                }
            }
        }

        return $array;
    }
}
