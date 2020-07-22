<?php

namespace Emptynick\VoyagerDocs;

use GrahamCampbell\Markdown\Facades\Markdown;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\View\View;
use League\CommonMark\CommonMarkConverter;
use League\CommonMark\Environment;
use League\CommonMark\Extension\HeadingPermalink\HeadingPermalinkExtension;
use League\CommonMark\Extension\HeadingPermalink\HeadingPermalinkRenderer;
use League\CommonMark\Inline\Element\Link;
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
        Route::get('docs', function (Request $request) {
            $path = $request->get('path', 'introduction.md');
            $path = str_replace('/', DIRECTORY_SEPARATOR, Str::start(urldecode($path), '/'));
            $start = Str::beforeLast(urldecode($path), DIRECTORY_SEPARATOR);
            $path = base_path('vendor/voyager-admin/voyager/docs').$path;


            $linkrenderer = new LinkRenderer($start);

            $environment = Environment::createCommonMarkEnvironment();
            $environment->addExtension(new HeadingPermalinkExtension());
            $environment->addInlineRenderer(Link::class, $linkrenderer);

            $config = [
                'heading_permalink' => [
                    'symbol' => '',
                ],
            ];

            // TODO: Uncomment when live
            /*if (realpath($path) != $path) {
                abort(404);
            }*/

            if (File::exists($path)) {
                $converter = new CommonMarkConverter($config, $environment);
                
                $content = $converter->convertToHtml(file_get_contents($path));
                
                $linkrenderer->absolute = true;
                $summary = $converter->convertToHtml(file_get_contents(base_path('vendor/voyager-admin/voyager/docs/summary.md')));

                return view('voyager-docs::docs', compact(
                    'content',
                    'summary'
                ));
            }

            abort(404);
        })->name('voyager-docs');
    }

    public function getCssRoutes(): array
    {
        return [];
    }

    public function getJsRoutes(): array
    {
        return [];
    }

    public function getSettingsView(): ?View
    {
        return null;
    }
}
