<?php

namespace Emptynick\VoyagerDocs;

use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Inertia\Inertia;
use League\CommonMark\CommonMarkConverter;
use League\CommonMark\Environment;
use League\CommonMark\Extension\HeadingPermalink\HeadingPermalinkExtension;
use League\CommonMark\Extension\HeadingPermalink\HeadingPermalinkRenderer;
use League\CommonMark\Inline\Element\Image;
use League\CommonMark\Inline\Element\Link;

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
        Route::get('docs', function (Request $request) {
            $path = $request->get('path', 'introduction.md');
            $path = str_replace('/', DIRECTORY_SEPARATOR, Str::start(urldecode($path), '/'));
            $start = Str::beforeLast(urldecode($path), DIRECTORY_SEPARATOR);
            $path = base_path('vendor/voyager-admin/voyager/docs').$path;

            $content = file_get_contents($path);

            // TODO: Uncomment when live
            /*if (realpath($path) != $path) {
                abort(404);
            }*/

            if (File::exists($path)) {
                return Inertia::render('voyager-docs', [
                    'title'     => Str::replaceFirst('# ', '', strtok($content, "\n")),
                    'content'   => Str::markdown(preg_replace('/^.+\n/', '', $content)),
                    'toc'       => Str::markdown(preg_replace('/^.+\n/', '', file_get_contents(base_path('vendor/voyager-admin/voyager/docs/summary.md')))),
                    'path'      => $request->get('path', 'introduction.md')
                ]);
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
        $item = (new MenuItem('Documentation', 'document'))->route('voyager.voyager-docs');

        $menumanager->addItems(
            (new MenuItem())->divider(),
            $item
        );
    }
}
